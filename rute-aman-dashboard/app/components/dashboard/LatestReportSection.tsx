import Link from "next/link";
import LatestReportCard from "./LatestReportCard";

interface LatestReportSectionProps {
  reports?: any[];
}

export default function LatestReportSection({ reports = [] }: LatestReportSectionProps) {
  
  // Fungsi pintar buat ngubah waktu jadi format "X menit lalu"
  const timeAgo = (dateString: string) => {
    if (!dateString) return "Baru saja";
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    
    if (diffInMins < 1) return "Baru saja";
    if (diffInMins < 60) return `${diffInMins} menit lalu`;
    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari lalu`;
  };

  // Fungsi buat nyesuain status database ke label UI yang lu buat sebelumnya
  const getStatusLabel = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "ditindaklanjuti") return "Selesai";
    if (s === "terverifikasi") return "Diproses";
    return "Baru"; // Kalau statusnya "Dilaporkan" atau kosong
  };

  // Karena ini cuma sidebar (ringkasan), kita ambil 5 laporan paling baru aja
  const latestReports = reports.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-5 shrink-0">
        <h3 className="font-bold text-lg text-slate-800">
          Laporan Terbaru
        </h3>

        {/* Gw ubah jadi Link Next.js biar kalau diklik langsung ngarah ke halaman /laporan */}
        <Link href="/laporan" className="text-blue-600 text-sm font-medium hover:underline">
          Lihat Semua
        </Link>
      </div>

      <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
        {latestReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <p className="text-sm font-medium">Belum ada laporan baru.</p>
          </div>
        ) : (
          latestReports.map((report) => (
            <LatestReportCard
              key={report.id}
              title={report.title}
              // Kalau ada location_name pakai itu, kalau gak ada kasih default
              location={report.location_name || "Lokasi Peta"} 
              time={timeAgo(report.created_at)}
              status={getStatusLabel(report.status)}
            />
          ))
        )}
      </div>
    </div>
  );
}