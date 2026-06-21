import DashboardLayout from "@/app/components/layout/dashboardlayout";
import SummaryCard from "@/app/components/laporan/summarycard";
import FilterSection from "@/app/components/laporan/filtersection";
import ReportTable from "@/app/components/laporan/reporttable";
import {
  ClipboardList,
  BadgeCheck,
  Eye,
  CheckCircle,
} from "lucide-react";

export default function LaporanPage() {
  return (
    <DashboardLayout>
    <div className="space-y-6">

        <div className="grid grid-cols-4 gap-5">

        <SummaryCard
            title="Laporan Pending"
            value="24"
            icon={ClipboardList}
            iconClass="bg-blue-100 text-blue-600"
        />

        <SummaryCard
            title="Terverifikasi"
            value="142"
            icon={BadgeCheck}
            iconClass="bg-green-100 text-green-600"
        />

        <SummaryCard
            title="Dalam Tinjauan"
            value="12"
            icon={Eye}
            iconClass="bg-slate-100 text-slate-600"
        />

        <SummaryCard
            title="Selesai"
            value="1204"
            icon={CheckCircle}
            iconClass="bg-green-100 text-green-600"
        />

        </div>

        <FilterSection />

        <ReportTable />

    </div>
    </DashboardLayout>
  );
}