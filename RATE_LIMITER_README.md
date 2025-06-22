# Rate Limiter Documentation

## Overview
Rate limiter ini membatasi akses API agar hanya **4 akun unik** yang bisa mengakses dalam **20 menit**. Sistem ini menggunakan Redis untuk menyimpan data rate limiting dengan pendekatan sliding window.

## Cara Kerja

### 1. Sliding Window Approach
- Setiap akun yang mengakses API akan dicatat dengan timestamp
- Sistem hanya menghitung akun yang aktif dalam 20 menit terakhir
- Jika sudah ada 4 akun aktif, akun baru akan ditolak

### 2. Redis Implementation
- Menggunakan Redis Sorted Set untuk menyimpan data akun aktif
- Key: `rate_limit:active_accounts`
- Score: timestamp (untuk sorting dan cleanup)
- Value: username/identifier

### 3. Logic Flow
```
1. User mengakses API dengan username
2. Sistem cek apakah username sudah ada di active accounts
3. Jika sudah ada → ALLOW (karena sudah terhitung)
4. Jika belum ada:
   - Cek jumlah active accounts
   - Jika < 4 → ADD username + ALLOW
   - Jika >= 4 → REJECT dengan pesan error
5. Cleanup old entries (lebih dari 20 menit)
```

## Konfigurasi

### Environment Variables
Pastikan Redis sudah dikonfigurasi di `.env`:
```env
KV_REST_API_URL=your_redis_url
KV_REST_API_TOKEN=your_redis_token
```

### Rate Limit Settings
Di `app/lib/rate-limiter.ts`:
```typescript
private readonly windowMs: number = 20 * 60 * 1000 // 20 menit
private readonly maxAccounts: number = 4 // maksimal 4 akun
```

## API Endpoints

### 1. POST /api/roast
Endpoint utama dengan rate limiting:
```json
{
  "username": "example_user",
  "profileData": {...}
}
```

**Response Success:**
```json
{
  "success": true,
  "roast": "...",
  "rateLimit": {
    "remaining": 2,
    "resetTime": "2024-01-01T12:00:00.000Z"
  }
}
```

**Response Error (429):**
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Rate limit exceeded. Only 4 accounts allowed per 20 minutes. Try again in 15 minutes.",
  "remaining": 0,
  "resetTime": "2024-01-01T12:00:00.000Z"
}
```

### 2. GET /api/rate-limit?username=example
Cek status rate limit untuk username tertentu:
```json
{
  "success": true,
  "username": "example",
  "rateLimit": {
    "isActive": true,
    "activeAccounts": 3,
    "remainingSlots": 1,
    "maxAccounts": 4,
    "windowMinutes": 20,
    "resetTime": "2024-01-01T12:00:00.000Z",
    "canAccess": true
  }
}
```

## UI Components

### RateLimitStatus Component
- Menampilkan status rate limit real-time
- Auto-refresh setiap 30 detik
- Visual indicator untuk status (active/blocked/available)
- Progress bar untuk usage

### RoastForm Component
- Disabled state ketika rate limit exceeded
- Error handling untuk rate limit errors
- Visual feedback untuk user

## Monitoring & Analytics

### Redis Keys
- `rate_limit:active_accounts` - Sorted set dengan active accounts
- Auto-cleanup untuk entries yang sudah expired

### Logs
- Rate limit violations dicatat di console
- Error handling untuk Redis failures (fail-open approach)

## Perhitungan Rate Limit

### Untuk API Gemini
Dengan rate limit 4 akun per 20 menit:
- **Per jam**: 12 akun unik
- **Per hari**: 288 akun unik
- **Per bulan**: ~8,640 akun unik

### Estimasi Cost
- Gemini API: ~$0.001 per request
- Dengan 4 akun/20 menit = $0.004 per 20 menit
- Per jam: $0.012
- Per hari: $0.288
- Per bulan: ~$8.64

## Troubleshooting

### Common Issues

1. **Redis Connection Error**
   - Cek environment variables
   - Pastikan Redis service running
   - Sistem akan fail-open (allow requests)

2. **Rate Limit Not Working**
   - Cek Redis data: `ZRANGE rate_limit:active_accounts 0 -1 WITHSCORES`
   - Verify timestamp calculations

3. **Performance Issues**
   - Redis operations sudah dioptimasi dengan sorted sets
   - Auto-cleanup untuk mencegah memory leaks

### Debug Commands
```bash
# Cek active accounts di Redis
redis-cli ZRANGE rate_limit:active_accounts 0 -1 WITHSCORES

# Cek key expiration
redis-cli TTL rate_limit:active_accounts

# Clear rate limit data (untuk testing)
redis-cli DEL rate_limit:active_accounts
```

## Security Considerations

1. **Username Validation**
   - Sanitasi input username
   - Prevent injection attacks

2. **Redis Security**
   - Use authentication tokens
   - Network isolation jika memungkinkan

3. **Fail-Open Strategy**
   - Jika Redis down, API tetap berfungsi
   - Trade-off antara security dan availability

## Future Enhancements

1. **IP-based Rate Limiting**
   - Tambahan layer security
   - Prevent abuse dari IP yang sama

2. **User Authentication**
   - Login system untuk tracking yang lebih akurat
   - Premium tiers dengan limit berbeda

3. **Analytics Dashboard**
   - Monitor rate limit usage
   - Track popular usernames

4. **Dynamic Rate Limiting**
   - Adjust limits berdasarkan traffic
   - Peak hours vs off-peak hours 