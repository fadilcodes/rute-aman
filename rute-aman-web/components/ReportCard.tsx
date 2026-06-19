import { MapPin, MessageSquare, ThumbsUp, Clock3 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';

export default function ReportCard({ report }: { report: any }) {
  // Logic sakti buat nangkep angka dari berbagai format kembalian Supabase
  const likesCount = report.likes ?? report.votes?.length ?? report.votes?.[0]?.count ?? 0;
  const commentsCount = report.comments ?? report.comments?.length ?? report.comments?.[0]?.count ?? 0;

  // Helper buat ngasih warna background badge otomatis sesuai kategori
  const getCategoryStyle = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'kriminalitas': return 'bg-red-100 text-red-700 border-red-200';
      case 'infrastruktur': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'penerangan': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    // UX: Bungkus seluruh card pakai Link biar area kliknya luas (Clickable Card)
    <Link href={`/laporan/${report.id}`} className="block group">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
        
        {/* Header: Badge Kategori & Waktu */}
        <div className="flex justify-between items-center mb-3">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${getCategoryStyle(report.category)} tracking-wider uppercase`}>
            {report.category || 'Lainnya'}
          </span>
          <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
            <Clock3 size={12} />
            {report.created_at ? formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: id }) : ''}
          </span>
        </div>

        {/* Content: Judul & Deskripsi */}
        {/* UX: Judul berubah biru saat card di-hover */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
          {report.title}
        </h3>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow leading-relaxed">
          {report.description}
        </p>

        {/* UX: Menambahkan Info Lokasi jika datanya ada */}
        {(report.location_name || report.full_address) && (
          <div className="flex items-center text-xs text-gray-500 mb-4 font-medium bg-gray-50 p-2 rounded-lg border border-gray-100">
            <MapPin size={14} className="mr-1.5 text-blue-500 shrink-0" />
            <span className="truncate">{report.location_name || report.full_address}</span>
          </div>
        )}
        
        {/* Footer: Statistik Like/Comment & Tombol Action */}
        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4 mt-auto">
          <div className="flex gap-5">
            <div className="flex items-center gap-1.5 group/icon">
              <ThumbsUp size={16} className="group-hover/icon:text-blue-600 transition-colors" /> 
              <span className="font-medium group-hover/icon:text-blue-600 transition-colors">{likesCount}</span>
            </div>
            <div className="flex items-center gap-1.5 group/icon">
              <MessageSquare size={16} className="group-hover/icon:text-blue-600 transition-colors" /> 
              <span className="font-medium group-hover/icon:text-blue-600 transition-colors">{commentsCount}</span>
            </div>
          </div>
          
          {/* UX: Teks detail geser ke kanan dikit pas di-hover */}
          <span className="text-blue-600 text-sm font-bold flex items-center gap-1">
            Detail <span className="text-lg leading-none group-hover:translate-x-1 transition-transform duration-200">&rsaquo;</span>
          </span>
        </div>

      </div>
    </Link>
  );
}