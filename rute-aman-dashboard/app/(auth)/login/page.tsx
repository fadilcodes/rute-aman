"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Proses Login ke Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw new Error("Email atau kata sandi salah.");

      // 2. Cek apakah user ini ada di tabel admin_users
      const { data: adminData, error: adminError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (adminError || !adminData) {
        // Kalau bukan admin, langsung paksa logout!
        await supabase.auth.signOut();
        throw new Error("Akses Ditolak. Akun Anda bukan akun Admin.");
      }

      // 3. Kalau sukses dan terbukti admin, lempar ke dashboard
      router.push("/dashboard");
      
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8F9FA]">
      
      {/* KIRI: Bagian Branding (Disesuaikan dengan Screenshot) */}
      <div className="hidden md:flex md:w-1/2 p-12 flex-col justify-center bg-gradient-to-br from-blue-50 to-slate-100 border-r border-slate-200">
        <div className="max-w-md mx-auto w-full space-y-6">
          <div className="flex items-center gap-2 text-blue-700">
            <ShieldCheck size={40} />
            <h1 className="text-4xl font-extrabold tracking-tight">RuteAman</h1>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 leading-snug">
            Portal Admin Khusus <br />
            <span className="text-slate-500">Pusat Kendali Laporan Keamanan.</span>
          </h2>
          
          <div className="mt-8 rounded-2xl overflow-hidden border border-slate-200/50">
            {/* Pakai placeholder gambar kayak di screenshot */}
            <img 
              src="RuteAman.png" 
              alt="City Street" 
            />
          </div>
        </div>
      </div>

      {/* KANAN: Bagian Form Login */}
      <div className="flex-1 flex flex-col justify-center p-8 sm:p-12">
        <div className="max-w-md w-full mx-auto">
          
          <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Masuk sebagai Admin</h2>
              <p className="text-slate-500 text-sm mt-2">
                Silakan masukkan kredensial akses khusus Anda.
              </p>
            </div>

            {/* Alert Error */}
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Input Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Admin</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ruteaman.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-slate-700 bg-slate-50/50 focus:bg-white"
                  required
                />
              </div>

              {/* Input Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Kata Sandi</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-slate-700 bg-slate-50/50 focus:bg-white pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Lupa Password & Ingat Saya */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                  <span className="text-sm text-slate-600">Ingat Saya</span>
                </label>
                
                <button type="button" className="text-sm font-semibold text-blue-600 hover:underline">
                  Lupa Kata Sandi?
                </button>
              </div>

              {/* Tombol Masuk */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm shadow-blue-700/20 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Masuk ke Dashboard"}
              </button>

            </form>
          </div>

        </div>
      </div>

    </div>
  );
}