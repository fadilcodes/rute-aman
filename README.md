# 🛡️ RuteAman

[![Live Demo](https://img.shields.io/badge/Demo-rute--aman.vercel.app-0070F3?style=for-the-badge&logo=vercel&logoColor=white)](https://rute-aman.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **RuteAman** adalah platform pemetaan berbasis web dan komunitas *(crowdsourced)* yang dirancang untuk menandai, memantau, dan memvalidasi titik-titik rawan kriminalitas (seperti begal) serta area jalan yang minim penerangan demi keselamatan perjalanan di malam hari.

---

## 📌 Latar Belakang & Masalah

Banyak komuter, pekerja shift malam, dan mahasiswa merasa waswas saat harus melintasi rute yang sepi atau belum pernah dilewati. Minimnya penerangan jalan umum serta tingginya potensi tindak kejahatan jalanan menjadi ancaman nyata. 

**RuteAman** hadir sebagai wadah kolaboratif di mana masyarakat dapat saling berbagi informasi kondisi jalanan secara *real-time*, sehingga pengguna lain dapat mengambil keputusan rute yang lebih aman.

---

## ✨ Fitur Utama

### 1. Aplikasi Publik (`rute-aman-web`)
* 🗺️ **Peta Interaktif & Geolocation:** Menampilkan peta berbasis Leaflet dengan penanda (*pin/marker*) kategori bahaya (Rawan Begal, Minim Lampu/Gelap, Jalan Rusak) lengkap dengan fitur *clustering*.
* 📍 **Pelaporan Titik Rawan:** Pengguna dapat menandai koordinat langsung di peta, melampirkan foto bukti, deskripsi kondisi, dan waktu pantauan.
* 👥 **Validasi Sosial & Komunitas:** Fitur upvote/like laporan untuk memverifikasi keakuratan informasi serta kolom diskusi/komentar untuk pembaruan status terkini di lapangan.
* 🤖 **AI-Assisted Processing:** Integrasi Google Generative AI (Gemini API) untuk membantu kategorisasi serta peringatan deskripsi laporan.
* 📱 **Mobile-First & Responsif:** Antarmuka ringan dan cepat diakses langsung dari peramban ponsel pengendara.

### 2. Panel Admin & Analitik (`rute-aman-dashboard`)
* 📊 **Pemantauan Agregat:** Monitoring sebaran titik bahaya secara terpusat untuk keperluan moderasi dan evaluasi data.
* 🛡️ **Sistem Moderasi Laporan:** Validasi dan penindakan terhadap laporan palsu *(hoax)* atau konten yang melanggar.

---

## 🏗️ Struktur Repositori

Proyek ini menggunakan struktur multi-aplikasi (monorepo sederhana):

```text
rute-aman/
├── rute-aman-web/          # Aplikasi utama untuk pengguna publik
│   ├── app/                # Next.js App Router
│   ├── components/         # Komponen UI & Maps (React-Leaflet)
│   ├── lib/                # Konfigurasi Supabase client & utilitas
│   ├── public/             # Aset statis
│   ├── package.json
│   └── next.config.ts
├── rute-aman-dashboard/    # Dashboard pemantauan dan administrasi
│   ├── app/                # Next.js App Router
│   ├── components/         # Komponen dashboard & visualisasi data
│   ├── lib/                # Supabase client & TanStack Query
│   ├── package.json
│   └── next.config.ts
├── RuteAman.png            # Banner / logo proyek
└── package-lock.json
