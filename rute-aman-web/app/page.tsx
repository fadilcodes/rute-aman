"use client";
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';
import ReportCard from '@/components/ReportCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Settings, User, LogIn, UserPlus } from 'lucide-react'; 
import FormLaporan from '@/components/FormLaporan';

// Load Map tanpa SSR - Pastiin path-nya mengarah ke file MapComponent di atas
const MapComponent = dynamic(() => import('@/components/MapComponent'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 font-medium animate-pulse">
      Memuat Peta...
    </div>
  )
});

export default function Home() {
  const supabase = createClient();

  const { data: reports, isLoading: isLoadingReports } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false }).limit(10);
      if (error) throw error;
      return data;
    }
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* UPDATE: Hapus tinggi mutlak di main, ganti pakai min-h-screen biar fleksibel 
        buat responsif antar layar.
      */}
      <main className="flex flex-col md:flex-row flex-1 bg-gray-50 min-h-screen pt-24">
        
        {/* UPDATE: Peta
          Di HP tetap h-[55vh], di laptop dipaku tingginya pakai calc(100vh-100px).
          Ditambahin md:sticky dan md:top-20 biar kalau layarnya di-scroll ke bawah, map-nya ngikut.
        */}
        <div className="w-full h-[55vh] md:h-[calc(100vh-100px)] md:w-2/3 p-3 md:p-4 z-0 md:sticky md:top-20">
          <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white">
            
            {/* Indikator Bahaya Mengambang */}
            <div className="absolute top-4 left-4 md:top-2 md:left-15 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-md z-400 text-gray-700 pointer-events-none border border-gray-100">
              <h4 className="font-bold text-xs md:text-sm mb-2">Indikator Bahaya</h4>
              <ul className="text-[10px] md:text-sm space-y-1.5 md:space-y-2">
                <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full"></span> Kriminalitas</li>
                <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-yellow-500 rounded-full"></span> Penerangan</li>
                <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-gray-500 rounded-full"></span> Infrastruktur</li>
              </ul>
            </div>
            
            <MapComponent reports={reports || []} />
            
          </div>
        </div>

        {/* UPDATE: Sidebar Laporan
          Dikasih batasan tinggi yang sama pakai calc() biar bisa di-scroll terpisah dari map.
          Ditambahin sedikit margin dan radius di desktop biar makin rapi.
        */}
        <div className="w-full h-[60vh] md:h-[calc(100vh-100px)] md:w-1/3 flex flex-col bg-white border-t md:border-t-0 md:border-l border-gray-200 md:mt-4 md:mr-4 md:rounded-2xl md:shadow-sm">
          
          <div className="flex-1 overflow-y-auto p-5 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-700">Laporan Terbaru</h2>
              <Link href="/laporan-komunitas" className="text-xs md:text-sm text-blue-600 font-medium hover:underline">
                Lihat Semua
              </Link>
            </div>
            
            {isLoadingReports ? (
              <div className="flex justify-center py-10">
                <p className="text-sm text-gray-500 animate-pulse">Memuat laporan dari komunitas...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {reports?.map(report => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            )}
          </div>

          {/* Area Widget Bawah */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 md:rounded-b-2xl">
            {isLoadingProfile ? (
              <div className="h-12 flex items-center justify-center animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : profile ? (
              <Link href="/profile" className="flex items-center justify-between p-3 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm transition group">
                <div className="flex items-center gap-3">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User size={20} />
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition">{profile.full_name}</h4>
                    <p className="text-xs text-gray-500 capitalize">{profile.role || 'Kontributor'}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-blue-600 transition">
                  <Settings size={20} />
                </button>
              </Link>
            ) : (
              <div className="flex gap-3">
                <Link href="/login" className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition shadow-sm">
                  <LogIn size={16} /> Masuk
                </Link>
                <Link href="/register" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
                  <UserPlus size={16} /> Daftar
                </Link>
              </div>
            )}
          </div>

          <FormLaporan/>

        </div>
      </main>
      <Footer />
    </div>
  );
}