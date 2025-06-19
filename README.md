# 🔥 InstaRoaster - AI Instagram Roaster

Aplikasi web yang menggunakan AI untuk membuat roast savage dari profil Instagram berdasarkan data publik. Dibuat dengan Next.js 14, TypeScript, dan Tailwind CSS.

## ✨ Fitur

- 🔍 **Data Instagram Real-time**: Mengambil data profil dan feed dari Instagram tanpa login atau API key
- 🤖 **AI Roasting**: Generate roast yang savage dan lucu berdasarkan data profil
- 📊 **Analisis Feed**: Analisis mendalam tentang postingan, likes, komentar, dan engagement
- 🎨 **UI Modern**: Interface yang cantik dengan animasi smooth menggunakan Framer Motion
- 📱 **Responsive**: Bekerja sempurna di desktop dan mobile
- 🌙 **Dark Mode**: Dukungan tema gelap dan terang
- 🚀 **Performance**: Optimized untuk kecepatan dan user experience

## 🛠️ Tech Stack

- **Framework**: Next.js 14 dengan App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 🚀 Cara Menjalankan

### Prerequisites

- Node.js 18+ 
- npm atau yarn

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd instaroaster
```

2. **Install dependencies**
```bash
npm install
```

3. **Jalankan development server**
```bash
npm run dev:3002
```

4. **Buka browser**
```
http://localhost:3002
```

### Scripts Available

- `npm run dev:3002` - Jalankan di port 3002
- `npm run dev` - Jalankan di port default (3000)
- `npm run build` - Build untuk production
- `npm run start` - Jalankan production build
- `npm run lint` - Run ESLint

## 📖 Cara Penggunaan

1. **Masukkan Username**: Ketik username Instagram yang ingin di-roast
2. **Tunggu Loading**: Sistem akan mengambil data profil dan feed
3. **Lihat Hasil**: AI akan generate roast yang savage berdasarkan data
4. **Share**: Bagikan roast ke teman-teman (opsional)

### Contoh Username untuk Test

- `cristiano` - Cristiano Ronaldo
- `kyliejenner` - Kylie Jenner  
- `elonmusk` - Elon Musk
- Atau username Instagram lainnya

## 🔧 Konfigurasi

### Environment Variables

Tidak perlu environment variables! Aplikasi menggunakan Instagram public API yang tidak memerlukan login atau API key.

### Customization

- **Roast Templates**: Edit file `app/api/roast/route.ts` untuk mengubah template roast
- **Styling**: Modifikasi `tailwind.config.js` untuk mengubah tema
- **Components**: Semua komponen ada di folder `app/components/`

## 📁 Struktur Project

```
instaroaster/
├── app/
│   ├── api/
│   │   ├── profile/route.ts    # API untuk data profil
│   │   ├── feed/route.ts       # API untuk data feed
│   │   └── roast/route.ts      # API untuk generate roast
│   ├── components/
│   │   ├── Header.tsx          # Header component
│   │   ├── RoastForm.tsx       # Form input username
│   │   ├── ProfileCard.tsx     # Tampilan profil
│   │   └── RoastResult.tsx     # Tampilan hasil roast
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main page
├── public/                     # Static assets
├── tailwind.config.js          # Tailwind configuration
├── next.config.js              # Next.js configuration
└── package.json                # Dependencies
```

## 🌐 API Endpoints

### POST /api/profile
Mengambil data profil Instagram
```json
{
  "username": "username_instagram"
}
```

### POST /api/feed  
Mengambil data feed Instagram
```json
{
  "username": "username_instagram"
}
```

### POST /api/roast
Generate roast berdasarkan data profil dan feed
```json
{
  "username": "username_instagram",
  "profileData": {...},
  "feedData": {...}
}
```

## 🎯 Fitur Utama

### Data Instagram Real-time
- Menggunakan Instagram public API
- Tidak perlu login atau API key
- Data profil: followers, following, posts, bio
- Data feed: likes, komentar, hashtags, mentions

### AI Roasting System
- Template roast dalam Bahasa Indonesia
- Roast khusus untuk selebriti terkenal
- Analisis berdasarkan engagement rate
- Roast yang personalized berdasarkan data

### UI/UX Modern
- Animasi smooth dengan Framer Motion
- Responsive design
- Dark mode support
- Loading states yang informatif

## 🔒 Keamanan & Privasi

- **Tidak menyimpan data**: Semua data diambil real-time dan tidak disimpan
- **Public data only**: Hanya mengakses data publik Instagram
- **No authentication**: Tidak memerlukan login atau API key
- **Rate limiting**: Implementasi rate limiting untuk mencegah abuse

## 🚨 Disclaimer

⚠️ **PENTING**: Aplikasi ini dibuat untuk hiburan semata. Roast yang dihasilkan adalah satire dan tidak dimaksudkan untuk menyakiti atau menghina siapapun. Gunakan dengan bijak dan jangan diambil hati!

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🆘 Troubleshooting

### Error "Failed to fetch profile data"
- Pastikan username Instagram valid dan publik
- Cek koneksi internet
- Coba refresh halaman

### Error "Failed to generate roast"
- Coba username yang berbeda
- Pastikan server berjalan dengan baik
- Cek console browser untuk error details

### Performance Issues
- Pastikan menggunakan Node.js versi terbaru
- Clear cache browser
- Restart development server

## 📞 Support

Jika ada masalah atau pertanyaan:
- Buat issue di GitHub
- Cek documentation di folder `docs/`
- Pastikan sudah mengikuti troubleshooting guide

---

**Dibuat dengan ❤️ dan AI - Hanya untuk hiburan semata! 🔥** 