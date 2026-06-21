"use client";

import type { ComponentType } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import DashboardLayout from "@/app/components/layout/dashboardlayout";
import SummaryCard from "@/app/components/laporan/summarycard";
import FilterSection from "@/app/components/laporan/filtersection";
import ReportTable from "@/app/components/laporan/reporttable";
import {
  ClipboardList,
  BadgeCheck,
  CheckCircle,
  Files,
  Loader2,
} from "lucide-react";

export default function LaporanPage() {
  const supabase = createClient();

  // Fetch data dari tabel reports + join data profil pelapor
  const { data: reports, isLoading } = useQuery({
    queryKey: ["admin_reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select(`
          *,
          profiles:user_id ( full_name, avatar_url, email )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Hitung statistik dinamis berdasarkan 3 fase status di database
  const totalReports = reports?.length || 0;
  
  const pendingReports = reports?.filter(
    (r) => r.status?.toLowerCase() === "dilaporkan"
  ).length || 0;
  
  const verifiedReports = reports?.filter(
    (r) => r.status?.toLowerCase() === "terverifikasi"
  ).length || 0;
  
  const resolvedReports = reports?.filter(
    (r) => r.status?.toLowerCase() === "ditindaklanjuti"
  ).length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* UX Improvement: Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-40 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-500 font-medium">Menarik data laporan komunitas...</span>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <SummaryCard
                title="Total Laporan"
                value={totalReports.toString()}
                icon={Files}
                iconClass="bg-slate-100 text-slate-600"
              />

              <SummaryCard
                title="Menunggu Verifikasi"
                value={pendingReports.toString()}
                icon={ClipboardList}
                iconClass="bg-blue-100 text-blue-600"
              />

              <SummaryCard
                title="Terverifikasi"
                value={verifiedReports.toString()}
                icon={BadgeCheck}
                iconClass="bg-yellow-100 text-yellow-600"
              />

              <SummaryCard
                title="Selesai Ditangani"
                value={resolvedReports.toString()}
                icon={CheckCircle}
                iconClass="bg-green-100 text-green-600"
              />
            </div>

            <FilterSection />

            {/* Passing data ke tabel biar dinamis */}
            <ReportTable reports={reports} />
          </>
        )}

      </div>
    </DashboardLayout>
  );
}