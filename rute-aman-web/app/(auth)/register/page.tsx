"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ShieldCheck, Map, AlertTriangle, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State khusus untuk Custom Notification
  const [notif, setNotif] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const supabase = createClient();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi Syarat & Ketentuan pakai Notif Custom
    if (!agreed) {
      setNotif({ type: 'error', message: 'Silakan centang Syarat & Ketentuan untuk dapat lanjut!' });
      return;
    }
    
    setIsLoading(true);
    setNotif(null); // Bersihin notif sebelumnya kalau ada

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
      setNotif({ type: 'error', message: error.message });
    } else {
      setNotif({ 
        type: 'success', 
        message: 'Registrasi berhasil! Cek kotak masuk email untuk verifikasi.' 
      });
    }
  };

  // Fungsi buat nutup notifikasi (dan redirect kalau sukses)
  const closeNotif = () => {
    if (notif?.type === 'success') {
      router.push('/login');
    }
    setNotif(null);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-6">
      
      {/* --- CUSTOM NOTIFICATION MODAL (Center Focus) --- */}
      {notif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center transform scale-100 transition-all border border-gray-100">
            
            {/* Ikon Notif */}
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-5 ${notif.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {notif.type === 'success' ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
            </div>
            
            {/* Judul & Pesan */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {notif.type === 'success' ? 'Mantap!' : 'Oops, Ada Kendala!'}
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {notif.message}
            </p>
            
            {/* Tombol Aksi */}
            <button 
              onClick={closeNotif}
              className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-sm ${
                notif.type === 'success' 
                  ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20' 
                  : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
              }`}
            >
              {notif.type === 'success' ? 'Lanjut ke Login' : 'Mengerti'}
            </button>
          </div>
        </div>
      )}
      {/* ----------------------------------------------- */}

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Kolom Kiri - Copywriting & Features */}
        <div className="flex flex-col items-center justify-center">
           <img 
            src="/RuteAman.png" 
            alt="RuteAman Logo" 
            className="w-100 object-contain items-center justify-center mb-3"
          />
          <h1 className=" text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4 text-center">
            Bergabung untuk Lingkungan yang <span className="text-blue-700">Lebih Aman.</span>
          </h1>
          <p className="text-gray-600 text-lg mb-10 max-w-md text-center">
            RuteAman membantu Anda menavigasi kota dengan informasi keamanan real-time dari komunitas untuk komunitas.
          </p>
          
          <div className="flex gap-6 justify-center items-center">
            <div className="flex flex-col bg-gray-100 p-5 rounded-2xl flex-1 border border-gray-200 items-center justify-center">
              <ShieldCheck className="text-blue-600 mb-3" size={24} />
              <h3 className="font-bold text-gray-900 mb-1">Terpercaya</h3>
              <p className="text-sm text-gray-600 text-center">Laporan diverifikasi oleh komunitas lokal.</p>
            </div>
            <div className="flex flex-col bg-gray-100 p-5 rounded-2xl flex-1 border border-gray-200 items-center justify-center">
              <Map className="text-green-700 mb-3" size={24} />
              <h3 className="font-bold text-gray-900 mb-1">Real-time</h3>
              <p className="text-sm text-gray-600 text-center">Peta bahaya yang diperbarui setiap saat.</p>
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
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
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
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
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
                  className="w-full border border-gray-300 rounded-lg p-3 pr-12 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                  placeholder="Min. 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 mt-4">
              <input 
                type="checkbox" 
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label className="text-sm text-gray-600 leading-relaxed cursor-pointer" onClick={() => setAgreed(!agreed)}>
                Saya setuju dengan <Link href="/privasi" className="text-blue-600 hover:underline">Kebijakan Privasi</Link> dan <Link href="/syarat" className="text-blue-600 hover:underline">Syarat & Ketentuan</Link>.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-700 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-800 transition-all shadow-sm shadow-blue-700/20 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            Sudah punya akun? <Link href="/login" className="text-blue-600 font-bold hover:underline">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}