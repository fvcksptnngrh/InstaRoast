# Rate Limiter

Rate limiter membatasi akses API agar hanya **4 akun unik** yang bisa mengakses dalam **20 menit**. Menggunakan Redis (Upstash) dengan pendekatan **sliding window**.

---

## 🚀 Quick Start

### 1. Setup Environment

Pastikan Redis sudah dikonfigurasi di `.env.local`:

```env
KV_REST_API_URL=your_redis_url
KV_REST_API_TOKEN=your_redis_token
```

### 2. Jalankan Test

```bash
# Test dengan 6 users (4 sukses, 2 ditolak)
npm run test:rate-limit

# Test dengan custom URL
BASE_URL=https://your-app.vercel.app npm run test:rate-limit
```

### 3. Manual Testing

1. Buka aplikasi di browser
2. Masukkan username 1–4 → ✅ Sukses
3. Masukkan username kelima → 🚫 Rate Limited

---

## ⚙️ Konfigurasi

Di `app/lib/rate-limiter.ts`:

```typescript
private readonly windowMs: number = 20 * 60 * 1000 // 20 menit
private readonly maxAccounts: number = 4            // maksimal 4 akun
```

---

## 🔄 Cara Kerja

### Sliding Window Approach

- Setiap akun yang mengakses API dicatat dengan timestamp
- Sistem hanya menghitung akun yang aktif dalam 20 menit terakhir
- Jika sudah ada 4 akun aktif, akun baru ditolak

### Redis Implementation

- Menggunakan **Redis Sorted Set** untuk menyimpan akun aktif
- Key: `rate_limit:active_accounts`
- Score: timestamp (untuk sorting dan cleanup)
- Value: username/identifier

### Logic Flow

```
1. User mengakses API dengan username
2. Sistem cek apakah username sudah ada di active accounts
3. Jika sudah ada → ALLOW (karena sudah terhitung)
4. Jika belum ada:
   - Cek jumlah active accounts
   - Jika < 4 → ADD username + ALLOW
   - Jika >= 4 → REJECT dengan pesan error
5. Cleanup entries lama (lebih dari 20 menit)
```

---

## 📡 API Endpoints

### POST `/api/roast`

Endpoint utama dengan rate limiting.

**Request:**
```json
{
  "username": "example_user",
  "profileData": { }
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
  "message": "Rate limit exceeded. Only 4 accounts allowed per 20 minutes.",
  "remaining": 0,
  "resetTime": "2024-01-01T12:00:00.000Z"
}
```

### GET `/api/rate-limit?username=example`

Cek status rate limit untuk username tertentu.

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

---

## 🧩 UI Components

### `RateLimitStatus`
- Menampilkan status rate limit real-time
- Auto-refresh setiap 30 detik
- Visual indicator untuk status (active/blocked/available)
- Progress bar untuk usage

### `RoastForm`
- Disabled state ketika rate limit exceeded
- Error handling untuk rate limit errors
- Visual feedback untuk user

---

## 📊 Monitoring

### Redis Commands

```bash
# Cek active accounts
redis-cli ZRANGE rate_limit:active_accounts 0 -1 WITHSCORES

# Cek key expiration
redis-cli TTL rate_limit:active_accounts

# Clear data (untuk testing)
redis-cli DEL rate_limit:active_accounts
```

### Logs

- Rate limit violations dicatat di console
- Error handling untuk Redis failures (fail-open approach)

---

## 💰 Estimasi Kapasitas

Dengan rate limit **4 akun per 20 menit**:

| Periode | Kapasitas Unique Users |
|---------|------------------------|
| Per jam | 12 |
| Per hari | 288 |
| Per bulan | ~8.640 |

Estimasi biaya API tergantung model yang digunakan — lihat dokumentasi provider (OpenAI/Gemini) untuk harga per request.

---

## 🛡️ Security

1. **Username Validation** — sanitasi input, prevent injection
2. **Redis Auth** — gunakan authentication tokens, network isolation jika memungkinkan
3. **Fail-Open Strategy** — jika Redis down, API tetap berfungsi (trade-off security vs availability)
4. **Auto-Cleanup** — entries lama dihapus otomatis, mencegah memory leaks

---

## 🔧 Troubleshooting

### Rate Limiter Tidak Berfungsi
1. Cek Redis connection
2. Verify environment variables (`KV_REST_API_URL`, `KV_REST_API_TOKEN`)
3. Run test script: `npm run test:rate-limit`

### Redis Connection Error
1. Cek env variables
2. Pastikan Redis service running
3. Sistem akan fail-open (allow requests)

### Debug Commands

```bash
# Cek active accounts di Redis
redis-cli ZRANGE rate_limit:active_accounts 0 -1 WITHSCORES

# Cek TTL
redis-cli TTL rate_limit:active_accounts

# Clear rate limit data
redis-cli DEL rate_limit:active_accounts
```

---

## 🚧 Future Enhancements

1. **IP-based Rate Limiting** — tambahan layer security
2. **User Authentication** — login system untuk tracking lebih akurat, premium tiers
3. **Analytics Dashboard** — monitor usage, track popular usernames
4. **Dynamic Rate Limiting** — adjust limits berdasarkan traffic (peak vs off-peak)
