"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ShieldCheck, Map } from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return alert('Lu harus setuju sama Syarat & Ketentuan dulu, Dil!');
    
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    setIsLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert('Registrasi berhasil! Cek email buat verifikasi ya.');
      router.push('/login');
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
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Kolom Kiri - Copywriting & Features */}
        <div className="hidden md:block pr-8">
          <h1 className="text-5xl font-bold text-blue-600 leading-tight mb-4">
            Bergabung untuk Lingkungan yang <span className="text-green-700">Lebih Aman.</span>
          </h1>
          <p className="text-gray-600 text-lg mb-10 max-w-md">
            RuteAman membantu Anda menavigasi kota dengan informasi keamanan real-time dari komunitas untuk komunitas.
          </p>
          
          <div className="flex gap-6">
            <div className="bg-gray-100 p-5 rounded-2xl flex-1 border border-gray-200">
              <ShieldCheck className="text-blue-600 mb-3" size={24} />
              <h3 className="font-bold text-gray-900 mb-1">Terpercaya</h3>
              <p className="text-sm text-gray-600">Laporan diverifikasi oleh komunitas lokal.</p>
            </div>
            <div className="bg-gray-100 p-5 rounded-2xl flex-1 border border-gray-200">
              <Map className="text-green-700 mb-3" size={24} />
              <h3 className="font-bold text-gray-900 mb-1">Real-time</h3>
              <p className="text-sm text-gray-600">Peta bahaya yang diperbarui setiap saat.</p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan - Form Register */}
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-200 w-full max-w-md ml-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Buat Akun</h2>
          <p className="text-gray-500 mb-8">Mulai perjalanan aman Anda bersama RuteAman.</p>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input 
                type="text" 
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                placeholder="Budi Santoso"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                placeholder="contoh@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  placeholder="Min. 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex items-start gap-2">
              <input 
                type="checkbox" 
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label className="text-sm text-gray-600">
                Saya setuju dengan <Link href="/privasi" className="text-blue-600 hover:underline">Kebijakan Privasi</Link> dan <Link href="/syarat" className="text-blue-600 hover:underline">Syarat & Ketentuan</Link>.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-700 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-70"
            >
              {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </button>
          </form>

          {/* <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-sm text-gray-400">ATAU</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Daftar dengan Google
          </button> */}

          <p className="text-center text-sm text-gray-600 mt-8">
            Sudah punya akun? <Link href="/login" className="text-blue-600 font-medium hover:underline">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}