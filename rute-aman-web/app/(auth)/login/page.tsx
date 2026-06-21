"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle } from 'lucide-react'; // Tambahin AlertCircle buat icon error

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // State baru buat nampung pesan error

  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null); // Reset pesan error tiap kali nyoba login lagi
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      // Set pesan error ke state alih-alih pake alert()
      setErrorMsg('Email atau kata sandi yang lu masukin salah nih. Coba cek lagi ya!');
    } else {
      router.push('/');
      router.refresh(); // Biar navbar otomatis update state login
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Kolom Kiri - Teks & Gambar Placeholder */}
        <div className="flex flex-col items-center justify-center">
          <img 
            src="/RuteAman.png" 
            alt="RuteAman Logo" 
            className="w-100 object-contain items-center justify-center"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-center pt-3 w-60%">
            Melindungi Komunitas Bersama Melalui <span className="text-blue-600">Laporan Keamanan Real-Time.</span> 
          </h1>
            
        </div>

        {/* Kolom Kanan - Form Login */}
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-200 w-full max-w-md ml-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang Kembali</h2>
          <p className="text-gray-500 mb-8 text-sm">Silakan masuk ke akun Anda untuk melanjutkan.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                required
                className={`w-full border rounded-lg p-3 focus:ring-2 focus:outline-none transition ${
                  errorMsg ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-600'
                }`}
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg(null); // Ilangin error pas user mulai ngetik lagi
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  className={`w-full border rounded-lg p-3 focus:ring-2 focus:outline-none transition text-gray-700 ${
                    errorMsg ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-600'
                  }`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg(null); // Ilangin error pas user mulai ngetik lagi
                  }}
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm text-gray-600">Ingat Saya</label>
              </div>
              <Link href="/lupa-sandi" className="text-sm text-blue-600 font-medium hover:underline">
                Lupa Kata Sandi?
              </Link>
            </div>

            {/* Area Notifikasi Error */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg animate-pulse">
                <AlertCircle size={18} className="shrink-0" />
                <p>{errorMsg}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-700 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-70 mt-4"
            >
              {isLoading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>

          {/* <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-xs text-gray-400 font-medium">ATAU</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div> */}

          {/* <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Masuk dengan Google
          </button> */}

          <p className="text-center text-sm text-gray-600 mt-8">
            Belum punya akun? <Link href="/register" className="text-blue-600 font-medium hover:underline">Daftar Sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}