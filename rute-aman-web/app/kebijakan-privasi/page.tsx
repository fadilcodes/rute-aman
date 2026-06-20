"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Eye, Database, Globe, RefreshCw, ShieldCheck } from 'lucide-react';

export default function KebijakanPrivasiPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 text-gray-900">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-blue-600 mb-3">Kebijakan Privasi</h1>
            <p className="text-gray-500 text-sm">Terakhir diperbarui: 20 Juni 2026</p>
          </div>

          {/* Konten Utama */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 space-y-8 leading-relaxed text-sm md:text-base text-gray-700">
            <p>
              Kebijakan Privasi ini menjelaskan bagaimana <strong>RuteAman</strong> mengumpulkan, menggunakan, melindungi, dan membagikan informasi pribadi Anda saat Anda menggunakan layanan kami. Kami berkomitmen untuk menjaga privasi dan keamanan data setiap pengguna kami.
            </p>

            {/* Poin 1 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Database size={20} className="text-blue-600" /> 1. Informasi yang Kami Kumpulkan
              </h3>
              <div className="pl-7 space-y-2">
                <p>1.1. <strong>Data Akun:</strong> Saat Anda mendaftar, kami mengumpulkan data dasar seperti nama lengkap, alamat email, dan foto profil (avatar) melalui penyedia layanan autentikasi kami (Supabase Auth).</p>
                <p>1.2. <strong>Data Laporan & Geokode:</strong> Saat Anda membuat laporan, kami mengumpulkan koordinat geografis (latitude dan longitude), alamat lokasi kejadian, deskripsi masalah, serta foto bukti kejadian yang Anda unggah secara sukarela.</p>
              </div>
            </div>

            {/* Poin 2 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Eye size={20} className="text-blue-600" /> 2. Penggunaan Informasi Anda
              </h3>
              <div className="pl-7 space-y-2">
                <p>Kami menggunakan informasi yang dikumpulkan untuk keperluan:</p>
                <p>2.1. Menampilkan titik indikator bahaya dan masalah fasilitas umum secara akurat pada peta interaktif komunitas.</p>
                <p>2.2. Memfasilitasi diskusi komunitas melalui fitur komentar dan dukungan (votes/likes).</p>
                <p>2.3. Melakukan proses verifikasi laporan oleh tim admin untuk memastikan kualitas informasi.</p>
                <p>2.4. Menghitung poin reputasi pengguna berdasarkan kontribusi nyata yang diberikan.</p>
              </div>
            </div>

            {/* Poin 3 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck size={20} className="text-blue-600" /> 3. Perlindungan dan Penyimpanan Data
              </h3>
              <div className="pl-7 space-y-2">
                <p>3.1. Seluruh data pengguna dan konten laporan disimpan secara aman menggunakan infrastruktur basis data terenkripsi.</p>
                <p>3.2. Jika Anda memilih opsi "Lapor Anonim", sistem kami akan memblokir penampilan nama dan foto profil Anda pada antarmuka publik, sehingga pengguna lain hanya akan melihat laporan tersebut sebagai kiriman "Pengguna Anonim".</p>
              </div>
            </div>

            {/* Poin 4 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Globe size={20} className="text-blue-600" /> 4. Layanan Pihak Ketiga
              </h3>
              <div className="pl-7 space-y-2">
                <p>Aplikasi kami terintegrasi dengan beberapa layanan pihak ketiga untuk mengoptimalkan kinerja:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li><strong>Supabase:</strong> Penyimpanan data, database, autentikasi, dan penyimpanan berkas gambar.</li>
                  <li><strong>OpenStreetMap & Leaflet:</strong> Penyedia peta interaktif dan visualisasi koordinat.</li>
                  <li><strong>Nominatim API:</strong> Layanan reverse geocoding untuk konversi titik koordinat menjadi nama jalan/alamat tertulis.</li>
                </ul>
                <p>Layanan pihak ketiga ini memiliki kebijakan privasi masing-masing terkait pemrosesan data teknis.</p>
              </div>
            </div>

            {/* Poin 5 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <RefreshCw size={20} className="text-blue-600" /> 5. Perubahan Kebijakan Privasi
              </h3>
              <div className="pl-7">
                <p>
                  RuteAman berhak memperbarui Kebijakan Privasi ini sewaktu-waktu. Pengguna disarankan untuk meninjau halaman ini secara berkala untuk mengetahui perubahan terbaru.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}