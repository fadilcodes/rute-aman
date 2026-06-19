"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { Mail, RefreshCw, Send, Edit2, HelpCircle, History } from 'lucide-react';

export default function LupaSandiPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  const handleResetPassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-sandi`, // Nanti lu harus bikin halaman ini buat masukin password baru
    });

    setIsLoading(false);

    if (error) {
      setErrorMsg('Gagal mengirim email reset. Pastikan email lu terdaftar ya, Dil!');
    } else {
      setIsSubmitted(true);
    }
  };

  // Tampilan 2: Halaman Sukses Verifikasi Email (Screenshot 2)
  if (isSubmitted) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Verifikasi Email Anda</h1>
          <p className="text-gray-600 mb-8">
            Kami telah mengirimkan tautan verifikasi ke <br />
            <span className="font-bold text-gray-900">{email}</span>. Silakan periksa kotak masuk atau <br />
            folder spam Anda.
          </p>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-left max-w-lg mx-auto mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Instruksi Verifikasi</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Klik tombol verifikasi dalam email tersebut untuk mengaktifkan akun RuteAman Anda.
                </p>
              </div>
            </div>

            <button 
              onClick={() => handleResetPassword()}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-70"
            >
              <Send size={18} />
              {isLoading ? 'Mengirim...' : 'Kirim Ulang Email'}
            </button>
          </div>

          <div className="flex flex-col items-center gap-3 text-sm">
            <button 
              onClick={() => setIsSubmitted(false)}
              className="flex items-center gap-2 text-blue-600 font-medium hover:underline"
            >
              <Edit2 size={16} /> Ganti Alamat Email
            </button>
            <Link href="/kontak" className="flex items-center gap-2 text-gray-500 hover:text-gray-800">
              <HelpCircle size={16} /> Butuh bantuan? Hubungi kami
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan 1: Form Lupa Kata Sandi (Screenshot 1)
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Kolom Kiri - Gambar & Teks */}
        <div className="hidden md:flex flex-col items-center text-center pr-4">
          <div className="w-full h-80 bg-slate-900 rounded-2xl shadow-lg mb-8 relative overflow-hidden flex items-center justify-center">
            {/* Ganti dengan gambar gembok lu, ini efek gradient sementara buat nge-mockup */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/20 via-slate-900 to-slate-900"></div>
            <div className="relative z-10 p-6 bg-blue-500/20 rounded-3xl border border-blue-400/30 backdrop-blur-sm">
               <LockIconPlaceholder /> 
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Keamanan Prioritas Kami</h2>
          <p className="text-gray-500 text-sm max-w-sm">
            Kami akan membantu memulihkan akses akun Anda dengan langkah-langkah verifikasi yang aman.
          </p>
        </div>

        {/* Kolom Kanan - Form Reset */}
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-200 w-full max-w-md ml-auto">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 mb-6">
            <History size={24} />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Lupa Kata Sandi?</h2>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            Jangan khawatir. Masukkan email Anda di bawah ini dan kami akan mengirimkan instruksi untuk mengatur ulang kata sandi.
          </p>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  required
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                    errorMsg ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-600'
                  }`}
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                />
              </div>
              {errorMsg && <p className="text-red-500 text-xs mt-2">{errorMsg}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !email}
              className="w-full bg-blue-700 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Memproses...' : 'Kirim Instruksi ▹'}
            </button>
          </form>

          <div className="border-t border-gray-100 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600">
              Ingat kata sandi Anda? <Link href="/login" className="text-blue-600 font-medium hover:underline">Masuk di sini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Komponen buat mock-up gembok di sebelah kiri (Bisa lu hapus dan ganti tag <img>)
function LockIconPlaceholder() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}