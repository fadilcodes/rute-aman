"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HubungiKamiPage() {
  const emailTarget = "ahmadfadilah.fd@gmail.com";
  const emailSubject = encodeURIComponent("[RuteAman] Pertanyaan / Hubungan Kemitraan");
  const emailBody = encodeURIComponent("Halo Tim RuteAman,\n\nSaya ingin menanyakan terkait...");

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 text-gray-900">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-blue-600 mb-3">Hubungi Kami</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Punya pertanyaan, kendala teknis, laporan bug, atau tawaran kolaborasi? Kami siap mendengarkan Anda.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Informasi Kontak */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Saluran Resmi</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Tim RuteAman aktif meninjau masukan dari komunitas setiap hari kerja. Jangan ragu untuk mengirimkan email kepada kami.
              </p>
              
              <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-50">
                <div className="p-3 bg-blue-600 text-white rounded-xl">
                  <Mail size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500 font-medium">Email Dukungan</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{emailTarget}</p>
                </div>
              </div>
            </div>

            {/* Kotak Aksi Kirim Pesan */}
            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col justify-between border border-gray-100">
              <div>
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-base">
                  <MessageSquare size={18} className="text-blue-600" /> Kirim Email Langsung
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Klik tombol di bawah untuk langsung membuka aplikasi email Anda dengan format tujuan yang sudah disesuaikan.
                </p>
              </div>

              <div className="mt-6">
                <a 
                  href={`mailto:${emailTarget}?subject=${emailSubject}&body=${emailBody}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors text-sm"
                >
                  Buka Aplikasi Email <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4">
            <ShieldCheck className="text-blue-600 shrink-0" size={24} />
            <p className="text-xs text-gray-600 leading-relaxed">
              Kami berkomitmen penuh untuk merespons setiap laporan kendala teknis dalam kurun waktu <strong>1x24 jam</strong> pada hari kerja.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}