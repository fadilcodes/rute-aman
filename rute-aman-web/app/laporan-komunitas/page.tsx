"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { 
  Clock, 
  MapPin, 
  Heart, 
  MessageSquare, 
  CheckCircle2, 
  Clock3, 
  ChevronLeft, 
  ChevronRight,
  Loader2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CATEGORIES = ['Semua', 'Kriminalitas', 'Penerangan', 'Infrastruktur', 'Lainnya'];

// Helper ngitung waktu
const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit yang lalu`;
  if (hours < 24) return `${hours} jam yang lalu`;
  if (days === 1) return 'Kemarin';
  return `${days} hari yang lalu`;
};

// Helper warna kategori
const getCategoryStyle = (category: string) => {
  const cat = category?.toUpperCase();
  switch (cat) {
    case 'KRIMINALITAS': return 'bg-red-600';
    case 'PENERANGAN': return 'bg-slate-500';
    case 'INFRASTRUKTUR': return 'bg-emerald-600';
    default: return 'bg-slate-400';
  }
};

export default function LaporanKomunitasPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('reports')
          .select(`
            id,
            title,
            description,
            category,
            status,
            image_url,
            created_at,
            location_name,
            votes ( id ),
            comments ( id )
          `)
          .order('created_at', { ascending: false });

        if (activeCategory !== 'Semua') {
          query = query.ilike('category', activeCategory);
        }

        const { data, error } = await query;

        if (error) throw error;

        const formattedReports = data?.map((item: any) => ({
          id: item.id,
          category: item.category?.toUpperCase() || 'LAINNYA',
          status: item.status || 'Menunggu',
          timeAgo: timeAgo(item.created_at),
          title: item.title,
          desc: item.description,
          location: item.location_name || 'Lokasi tidak diketahui', 
          likes: item.votes?.length || 0,
          comments: item.comments?.length || 0,
          imgUrl: item.image_url,
        })) || [];

        setReports(formattedReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [activeCategory, supabase]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-10 flex-1 w-full">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-3">Laporan Komunitas</h1>
          <p className="text-gray-600 max-w-3xl leading-relaxed">
            Pantau dan kontribusikan informasi keamanan untuk lingkungan yang lebih aman.
            Laporkan kejadian atau kondisi infrastruktur yang memerlukan perhatian.
          </p>
        </div>

        {/* Filter Categories */}
        <div className="mb-8">
          <h3 className="text-sm text-gray-500 mb-3">Kategori</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors border whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State atau Reports Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-600" />
            <p>Memuat laporan komunitas...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
            Belum ada laporan di kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                
                {/* Image & Badges */}
                <div className="relative h-48 bg-gray-200">
                  {report.imgUrl ? (
                    <img src={report.imgUrl} alt={report.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <span className="text-slate-600 text-sm">Tidak ada foto</span>
                    </div> 
                  )}
                  
                  <div className="absolute top-3 left-3">
                    <span className={`${getCategoryStyle(report.category)} text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider`}>
                      {report.category}
                    </span>
                  </div>
                  
                  <div className="absolute top-3 right-3">
                    <span className={`flex items-center text-[11px] px-2 py-1 rounded font-medium shadow-sm ${
                      report.status?.toLowerCase() === 'terverifikasi' 
                        ? 'text-green-700 bg-white/95' 
                        : 'text-gray-600 bg-white/95'
                    }`}>
                      {report.status?.toLowerCase() === 'terverifikasi' ? (
                        <CheckCircle2 className="w-3 h-3 text-green-600 mr-1.5" />
                      ) : (
                        <Clock3 className="w-3 h-3 text-gray-500 mr-1.5" />
                      )}
                      {report.status}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center text-gray-400 text-xs mb-2.5">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    {report.timeAgo}
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-lg mb-2 leading-snug line-clamp-2">
                    {report.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
                    {report.desc}
                  </p>
                  
                  <div className="flex items-center text-blue-600 text-xs font-medium mb-5">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                    <span className="truncate">{report.location}</span>
                  </div>
                  
                  {/* Card Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex gap-4 text-gray-500 text-sm font-medium">
                      <button className="flex items-center hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4 mr-1.5" />
                        {report.likes}
                      </button>
                      <button className="flex items-center hover:text-blue-500 transition-colors">
                        <MessageSquare className="w-4 h-4 mr-1.5" />
                        {report.comments}
                      </button>
                    </div>
                    {/* Link ke halaman detail dinamis yang lu buat tadi */}
                    <Link href={`/laporan/${report.id}`}>
                      <button className="text-blue-600 text-sm font-bold hover:text-blue-800 transition-colors">
                        Detail
                      </button>
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Pagination Dummy */}
        {!isLoading && reports.length > 0 && (
          <div className="mt-12 flex flex-col items-center">
            <div className="flex items-center gap-3">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-3">Menampilkan {reports.length} dari {reports.length} laporan terbaru</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}