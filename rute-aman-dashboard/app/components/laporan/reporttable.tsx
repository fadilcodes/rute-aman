"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import {
  Eye,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  MapPin,
  Loader2
} from "lucide-react";
import Link from "next/link";

interface ReportTableProps {
  reports?: any[];
}

export default function ReportTable({ reports = [] }: ReportTableProps) {
  const supabase = createClient();
  const queryClient = useQueryClient();
  
  // State buat nandain baris mana yang lagi proses update (biar loadingnya per baris)
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // FUNGSI SAKTI: Update Status langsung ke Supabase
  const handleStatusChange = async (reportId: string, newStatus: string, oldStatus: string) => {
    if (newStatus === oldStatus) return; // Kalau milih yang sama, gausah ngapa-ngapain
    
    setUpdatingId(reportId);
    try {
      const updateData: any = { status: newStatus };
      
      // Logika otomatis nyatet waktu:
      // Kalau diubah ke Terverifikasi, catat verified_at
      if (newStatus === "Terverifikasi" && oldStatus === "Dilaporkan") {
        updateData.verified_at = new Date().toISOString();
      } 
      // Kalau diubah ke Ditindaklanjuti, catat resolved_at
      else if (newStatus === "Ditindaklanjuti" && oldStatus !== "Ditindaklanjuti") {
        updateData.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("reports")
        .update(updateData)
        .eq("id", reportId);

      if (error) throw error;

      // Refresh data di layar tanpa reload halaman!
      await queryClient.invalidateQueries({ queryKey: ["admin_reports"] });
      
    } catch (error) {
      console.error("Gagal mengubah status:", error);
      alert("Gagal mengubah status laporan. Cek koneksi atau izin database lu.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      
      <div className="px-6 py-5 border-b border-slate-100 text-[#191B23] bg-[#FFFFFF]">
        <h2 className="text-2xl font-bold">
          Daftar Laporan
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F3F3FE] text-slate-500 text-sm uppercase">
            <tr>
              <th className="text-left p-4">Detail Laporan</th>
              <th className="text-left p-4">Pelapor</th>
              <th className="text-left p-4">Tanggal</th>
              <th className="text-left p-4">Status Laporan</th>
              <th className="text-center p-4">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400 font-medium">
                  Belum ada data laporan dari komunitas.
                </td>
              </tr>
            ) : (
              reports.map((report) => {
                const categoryLower = report.category?.toLowerCase();
                const isKriminalitas = categoryLower === "kriminalitas";
                const isPenerangan = categoryLower === "penerangan";
                
                const currentStatus = report.status || "Dilaporkan";
                const isUpdating = updatingId === report.id;

                const authorName = report.is_anonymous 
                  ? "Pengguna Anonim" 
                  : (report.profiles?.full_name || "Tanpa Nama");

                return (
                  <tr
                    key={report.id}
                    className="border-t border-slate-100 hover:bg-slate-50/80 transition text-[#434655]"
                  >
                    {/* Kolom Detail */}
                    <td className="p-4 max-w-xs">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-semibold text-slate-800 truncate" title={report.title}>
                          {report.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border uppercase tracking-wider ${
                            isKriminalitas ? 'bg-red-50 text-red-600 border-red-100' :
                            isPenerangan ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                            'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                            {report.category || 'Lainnya'}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1 truncate">
                            <MapPin size={12} /> {report.location_name || "Lokasi Peta"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Kolom Pelapor */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          report.is_anonymous ? "bg-slate-800 text-white" : "bg-blue-100 text-blue-600"
                        }`}>
                          {report.is_anonymous || !report.profiles?.avatar_url ? (
                            authorName.charAt(0).toUpperCase()
                          ) : (
                            <img src={report.profiles.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                          )}
                        </div>
                        <span className={`font-medium ${report.is_anonymous ? 'text-slate-500 italic' : 'text-slate-700'}`}>
                          {authorName}
                        </span>
                      </div>
                    </td>

                    {/* Kolom Tanggal */}
                    <td className="p-4 text-sm font-medium text-slate-600">
                      {formatDate(report.created_at)}
                    </td>

                    {/* KOLOM STATUS (SELECT DROPDOWN) */}
                    <td className="p-4">
                      <div className="relative inline-block">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(report.id, e.target.value, currentStatus)}
                          disabled={isUpdating}
                          className={`appearance-none outline-none font-bold text-xs px-3 py-1.5 rounded-full cursor-pointer pr-8 border transition-all ${
                            currentStatus === "Ditindaklanjuti" ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" :
                            currentStatus === "Terverifikasi" ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" :
                            "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          } ${isUpdating ? "opacity-50 cursor-wait" : ""}`}
                        >
                          <option value="Dilaporkan">Dilaporkan</option>
                          <option value="Terverifikasi">Terverifikasi</option>
                          <option value="Ditindaklanjuti">Ditindaklanjuti</option>
                        </select>
                        
                        {/* Custom icon panah / loading spinner */}
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                          {isUpdating ? (
                            <Loader2 size={12} className="animate-spin text-slate-500" />
                          ) : (
                            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Kolom Aksi */}
                    <td className="p-4 text-center">
                      <Link 
                      href={`/laporan/${report.id}`} 
                        className="inline-flex items-center justify-center p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition"
                        title="Lihat Detail Laporan"
                      >
                        <Eye size={20} />
                      </Link>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
        <p className="text-sm text-slate-500 font-medium">
          Menampilkan {reports.length > 0 ? 1 : 0} - {reports.length} dari {reports.length} laporan
        </p>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center font-medium transition disabled:opacity-50" disabled>
            ‹
          </button>
          <button className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold shadow-sm">
            1
          </button>
          <button className="w-10 h-10 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center font-medium transition disabled:opacity-50" disabled>
            ›
          </button>
        </div>
      </div>

    </div>
  );
}