"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, CheckCircle2, Circle, ArrowRight, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';

export default function ResetSandiPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State baru buat nampung pesan sukses/error
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const supabase = createClient();
  const router = useRouter();

  // Validasi real-time
  const isLengthValid = password.length >= 8;
  const isMatch = password === confirmPassword && password.length > 0;
  const isFormValid = isLengthValid && isMatch;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setStatusMsg(null);

    // Karena user diarahkan ke sini dari link email, session udah aktif otomatis
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    setIsLoading(false);

    if (error) {
      // Tampilkan error di UI
      setStatusMsg({ type: 'error', text: `Gagal mereset sandi: ${error.message}` });
    } else {
      // Tampilkan sukses di UI
      setStatusMsg({ type: 'success', text: 'Kata sandi berhasil diubah! Mengalihkan ke halaman masuk...' });
      
      // Logout user untuk alasan keamanan, lalu arahkan ke login setelah delay 2 detik
      await supabase.auth.signOut();
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative">
      
      {/* Header Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-600 flex items-center justify-center gap-2">
          <ShieldCheck size={32} /> RuteAman
        </h1>
        <p className="text-gray-500 mt-3 text-sm">Atur ulang akses akun Anda dengan aman</p>
      </div>

      {/* Main Card */}
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-200 w-full max-w-md z-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ubah Kata Sandi</h2>
        <p className="text-gray-500 mb-8 text-sm">Silakan masukkan kata sandi baru untuk akun Anda.</p>

        <form onSubmit={handleUpdatePassword} className="space-y-5">
          {/* Input Sandi Baru */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Kata Sandi Baru
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className={`h-5 w-5 ${statusMsg?.type === 'error' ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:outline-none transition text-gray-700 ${
                  statusMsg?.type === 'error' ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-600'
                }`}
                placeholder="Min. 8 karakter"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (statusMsg) setStatusMsg(null); // Ilangin pesan kalau user ngetik lagi
                }}
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Input Konfirmasi Sandi */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RefreshCw className={`h-5 w-5 ${statusMsg?.type === 'error' ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                required
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:outline-none transition text-gray-700 ${
                  statusMsg?.type === 'error' ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-600'
                }`}
                placeholder="Ulangi kata sandi baru"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (statusMsg) setStatusMsg(null); // Ilangin pesan kalau user ngetik lagi
                }}
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Kriteria Keamanan Real-time */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-6">
            <p className="text-xs font-bold text-gray-700 mb-3">Kriteria Keamanan:</p>
            <div className="space-y-2">
              <div className={`flex items-center gap-2 text-sm transition-colors ${isLengthValid ? 'text-green-600' : 'text-gray-500'}`}>
                {isLengthValid ? <CheckCircle2 size={16} /> : <Circle size={16} className="text-gray-300" />}
                <span>Minimal 8 karakter</span>
              </div>
              <div className={`flex items-center gap-2 text-sm transition-colors ${isMatch ? 'text-green-600' : 'text-gray-500'}`}>
                {isMatch ? <CheckCircle2 size={16} /> : <Circle size={16} className="text-gray-300" />}
                <span>Kata sandi cocok</span>
              </div>
            </div>
          </div>

          {/* Area Notifikasi UI (Muncul kalau ada error atau sukses) */}
          {statusMsg && (
            <div className={`flex items-start gap-3 p-4 mt-4 text-sm border rounded-xl animate-in fade-in zoom-in duration-300 ${
              statusMsg.type === 'error' 
                ? 'bg-red-50 border-red-200 text-red-700' 
                : 'bg-green-50 border-green-200 text-green-700'
            }`}>
              {statusMsg.type === 'error' ? (
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
              )}
              <p className="leading-relaxed font-medium">{statusMsg.text}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={!isFormValid || isLoading || statusMsg?.type === 'success'}
            className="w-full bg-blue-700 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Kata Sandi'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="border-t border-gray-100 mt-8 pt-6 text-center">
          <Link href="/login" className="text-sm text-blue-600 font-medium hover:underline">
            Kembali ke halaman masuk
          </Link>
        </div>
      </div>

      {/* Footer Text */}
      <div className="absolute bottom-6 text-xs text-gray-400 text-center w-full">
        © 2026 RuteAman. Melindungi Komunitas Bersama.
      </div>
    </div>
  );
}