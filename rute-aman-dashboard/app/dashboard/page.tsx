"use-client";

import DashboardLayout from "@/app/components/layout/dashboardlayout";
import StatCard from "@/app/components/dashboard/StatCard";
import CategoryFilter from "@/app/components/dashboard/CategoryFilter";
import ReportMap from "@/app/components/dashboard/ReportMap";
import LatestReportSection from "@/app/components/dashboard/LatestReportSection";
import MapSection from "@/app/components/dashboard/mapsection";

import {
  FileText,
  Clock3,
  BadgeCheck,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div className="grid grid-cols-4 gap-5">
          <StatCard
            title="Total Laporan"
            value="1,284"
            change="+12%"
            icon={FileText}
            iconBg="bg-blue-100 text-blue-600"
          />

          <StatCard
            title="Laporan Aktif"
            value="342"
            change="+5%"
            icon={Clock3}
            iconBg="bg-yellow-100 text-yellow-600"
          />

          <StatCard
            title="Terverifikasi"
            value="856"
            change="+8%"
            icon={BadgeCheck}
            iconBg="bg-green-100 text-green-600"
          />

          <StatCard
            title="Selesai"
            value="428"
            change="+15%"
            icon={CheckCircle2}
            iconBg="bg-purple-100 text-purple-600"
          />
        </div>
        <div>
          <CategoryFilter />
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              <MapSection />
            </div>

            <div className="col-span-4">
              <LatestReportSection />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}