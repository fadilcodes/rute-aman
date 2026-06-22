"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import DashboardLayout from "@/app/components/layout/dashboardlayout";
import StatCard from "@/app/components/dashboard/StatCard";
import CategoryFilter from "@/app/components/dashboard/CategoryFilter";
import LatestReportSection from "@/app/components/dashboard/LatestReportSection";
import dynamic from "next/dynamic";
const MapSection = dynamic(
  () => import("@/app/components/dashboard/mapsection"),
  { ssr: false }
);

import {
  FileText,
  Clock3,
  BadgeCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const supabase = createClient();

  // Tarik semua data laporan dari database
  const { data: reports, isLoading } = useQuery({
    queryKey: ["dashboard_reports_overview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*, profiles:user_id(full_name, avatar_url)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Kalkulasi data statistik dinamis
  const totalReports = reports?.length || 0;
  
  const pendingReports = reports?.filter(
    (r) => r.status?.toLowerCase() === "dilaporkan" || !r.status
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

        {/* State Loading biar transisi mulus pas narik data awal */}
        {isLoading ? (
          <div className="flex items-center justify-center h-32 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-slate-500 font-medium">Memuat ringkasan dashboard...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Laporan"
              value={totalReports.toString()}
              change="Real-time" 
              icon={FileText}
              iconBg="bg-blue-100 text-blue-600"
            />

            <StatCard
              title="Laporan Aktif"
              value={pendingReports.toString()}
              change="Perlu Tindakan"
              icon={Clock3}
              iconBg="bg-yellow-100 text-yellow-600"
            />

            <StatCard
              title="Terverifikasi"
              value={verifiedReports.toString()}
              change="Tervalidasi"
              icon={BadgeCheck}
              iconBg="bg-green-100 text-green-600"
            />

            <StatCard
              title="Selesai"
              value={resolvedReports.toString()}
              change="Ditangani"
              icon={CheckCircle2}
              iconBg="bg-purple-100 text-purple-600"
            />
          </div>
        )}

        <div>
          <CategoryFilter />
          <div className="grid grid-cols-12 gap-6 mt-6">
            <div className="col-span-12 lg:col-span-8">
              {/* Kita lempar data reports ke MapSection biar petanya ikutan dinamis */}
              <MapSection reports={reports} />
            </div>

            <div className="col-span-12 lg:col-span-4">
              {/* Lempar juga datanya ke sidebar laporan terbaru */}
              <LatestReportSection reports={reports} />
            </div>
          </div>
        </div>
        
      </div>
    </DashboardLayout>
  );
}