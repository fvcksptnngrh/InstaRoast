# Rate Limiter Quick Start Guide

## 🚀 Implementasi Rate Limiter Selesai!

Rate limiter telah berhasil diimplementasikan dengan konfigurasi:
- **4 akun unik** per **20 menit**
- Menggunakan Redis untuk penyimpanan data
- Sliding window approach untuk akurasi

## 📁 File yang Ditambahkan/Dimodifikasi

### 1. Core Rate Limiter
- `app/lib/rate-limiter.ts` - Logic utama rate limiting
- `app/api/rate-limit/route.ts` - API endpoint untuk cek status

### 2. UI Components
- `app/components/RateLimitStatus.tsx` - Komponen status real-time
- `app/components/RoastForm.tsx` - Updated dengan disabled state

### 3. API Integration
- `app/api/roast/route.ts` - Integrated rate limiting

### 4. Testing & Documentation
- `scripts/test-rate-limiter.js` - Test script
- `RATE_LIMITER_README.md` - Dokumentasi lengkap
- `package.json` - Added test script

## 🔧 Cara Menggunakan

### 1. Setup Environment
Pastikan Redis sudah dikonfigurasi di `.env`:
```env
KV_REST_API_URL=your_redis_url
KV_REST_API_TOKEN=your_redis_token
```

### 2. Testing Rate Limiter
```bash
# Test dengan 6 users (4 sukses, 2 ditolak)
npm run test:rate-limit

# Test dengan custom URL
BASE_URL=https://your-app.vercel.app npm run test:rate-limit
```

### 3. Manual Testing
1. Buka aplikasi di browser
2. Masukkan username pertama → ✅ Sukses
3. Masukkan username kedua → ✅ Sukses
4. Masukkan username ketiga → ✅ Sukses
5. Masukkan username keempat → ✅ Sukses
6. Masukkan username kelima → 🚫 Rate Limited

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

### API Endpoints
```bash
# Cek status rate limit
GET /api/rate-limit?username=example

# Generate roast (dengan rate limiting)
POST /api/roast
```

## 💰 Estimasi Cost

Dengan rate limit 4 akun per 20 menit:
- **Per jam**: 12 akun unik = $0.012
- **Per hari**: 288 akun unik = $0.288
- **Per bulan**: ~8,640 akun unik = $8.64

## 🛡️ Security Features

1. **Fail-Open Strategy**: Jika Redis down, API tetap berfungsi
2. **Input Validation**: Sanitasi username input
3. **Auto-Cleanup**: Entries lama otomatis dihapus
4. **Real-time Monitoring**: UI menampilkan status live

## 🔄 Cara Kerja

1. User input username
2. Sistem cek apakah username sudah aktif
3. Jika sudah → ALLOW (karena sudah terhitung)
4. Jika belum → cek jumlah active accounts
5. Jika < 4 → ADD + ALLOW
6. Jika >= 4 → REJECT dengan pesan error

## 🎯 Next Steps

1. **Deploy ke production**
2. **Monitor usage** dengan Redis commands
3. **Adjust limits** jika diperlukan
4. **Add analytics** untuk tracking

## ❓ Troubleshooting

### Rate Limiter Tidak Berfungsi
1. Cek Redis connection
2. Verify environment variables
3. Run test script: `npm run test:rate-limit`

### Redis Connection Error
1. Cek `KV_REST_API_URL` dan `KV_REST_API_TOKEN`
2. Pastikan Redis service running
3. Sistem akan fail-open (allow requests)

### Performance Issues
1. Redis operations sudah dioptimasi
2. Auto-cleanup mencegah memory leaks
3. Sliding window approach untuk akurasi

## 📞 Support

Jika ada masalah atau pertanyaan:
1. Cek dokumentasi lengkap di `RATE_LIMITER_README.md`
2. Run test script untuk debugging
3. Monitor Redis data untuk troubleshooting

---

**Rate Limiter siap digunakan! 🎉** 