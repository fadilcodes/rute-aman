"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldAlert, FileText, UserCheck, Scale, CheckCircle2 } from 'lucide-react';

export default function SyaratKetentuanPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 text-gray-900">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-blue-600 mb-3">Syarat dan Ketentuan</h1>
            <p className="text-gray-500 text-sm">Terakhir diperbarui: 20 Juni 2026</p>
          </div>

          {/* Konten Utama */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 space-y-8 leading-relaxed text-sm md:text-base text-gray-700">
            <p>
              Selamat datang di <strong>RuteAman</strong>. Dengan mengakses dan menggunakan platform RuteAman, Anda dianggap telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak menyetujui bagian apa pun dari ketentuan ini, Anda tidak diperkenankan menggunakan layanan kami.
            </p>

            {/* Poin 1 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <UserCheck size={20} className="text-blue-600" /> 1. Pendaftaran Akun dan Keamanannya
              </h3>
              <div className="pl-7 space-y-2">
                <p>1.1. Untuk menggunakan fitur interaktif tertentu seperti membuat laporan, memberikan dukungan (like), dan berkomentar, Pengguna diwajibkan melakukan pendaftaran akun melalui sistem verifikasi yang disediakan.</p>
                <p>1.2. Pengguna bertanggung jawab penuh atas kerahasiaan informasi akun dan kata sandi mereka.</p>
                <p>1.3. Pengguna bertanggung jawab atas semua aktivitas yang terjadi di bawah akun mereka.</p>
              </div>
            </div>

            {/* Poin 2 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShieldAlert size={20} className="text-blue-600" /> 2. Ketentuan Konten dan Laporan Masalah
              </h3>
              <div className="pl-7 space-y-2">
                <p>2.1. Pengguna wajib memastikan bahwa setiap laporan yang dikirimkan (berupa judul, deskripsi, foto bukti, dan titik koordinat lokasi) adalah akurat, benar, dan berbasis kejadian nyata.</p>
                <p>2.2. Pengguna dilarang keras mengunggah, membagikan, atau menerbitkan konten yang:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Mengandung unsur SARA (Suku, Agama, Ras, dan Antargolongan).</li>
                  <li>Mengandung muatan ujaran kebencian, pencemaran nama baik, atau provokasi.</li>
                  <li>Berupa informasi bohong (hoax) atau manipulasi data lokasi/bukti foto.</li>
                  <li>Melanggar hak kekayaan intelektual pihak lain.</li>
                </ul>
                <p>2.3. RuteAman berhak sepenuhnya melalui tim admin untuk menolak, mengubah, atau menghapus laporan yang dianggap melanggar ketentuan tanpa pemberitahuan terlebih dahulu.</p>
              </div>
            </div>

            {/* Poin 3 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FileText size={20} className="text-blue-600" /> 3. Fitur Lapor Anonim
              </h3>
              <div className="pl-7 space-y-2">
                <p>3.1. RuteAman menyediakan fitur "Lapor Anonim" untuk melindungi identitas pelapor dari publik.</p>
                <p>3.2. Walaupun nama tampilan disembunyikan dari publik, sistem internal RuteAman tetap mencatat data akun yang valid demi keamanan dan pertanggungjawaban hukum jika terjadi pelanggaran berat terhadap Syarat dan Ketentuan ini.</p>
              </div>
            </div>

            {/* Poin 4 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-blue-600" /> 4. Alur Status dan Verifikasi Laporan
              </h3>
              <div className="pl-7 space-y-2">
                <p>4.1. Setiap laporan baru akan berstatus "Dilaporkan".</p>
                <p>4.2. Admin RuteAman akan melakukan peninjauan terhadap validitas laporan untuk mengubah status menjadi "Terverifikasi".</p>
                <p>4.3. Pengguna pembuat laporan dapat menandai laporan sebagai "Ditindaklanjuti" setelah koordinasi lapangan atau penanganan oleh pihak otoritas terkait selesai dilakukan.</p>
              </div>
            </div>

            {/* Poin 5 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Scale size={20} className="text-blue-600" /> 5. Batasan Tanggung Jawab
              </h3>
              <div className="pl-7">
                <p>
                  RuteAman adalah platform penyedia informasi berbasis komunitas (crowdsourcing). RuteAman tidak bertanggung jawab atas kerugian fisik, materiil, atau imateriil yang timbul akibat ketidakakuratan data yang diunggah oleh pengguna lain, ataupun keterlambatan penanganan dari otoritas publik terkait di lokasi yang dilaporkan.
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