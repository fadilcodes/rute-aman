import DashboardLayout from "@/app/components/layout/dashboardlayout";
import SummaryCard from "@/app/components/laporan/summarycard";
import UserTable from "@/app/components/pengguna/usertable";

import {
  Users,
  CheckCircle,
  Ban,
} from "lucide-react";

export default function PenggunaPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div className="grid grid-cols-3 gap-5 ">

          <SummaryCard
            title="Total Pengguna"
            value="500"
            icon={Users}
            iconClass="bg-blue-100 text-blue-600"
          />

          <SummaryCard
            title="Aktif"
            value="492"
            icon={CheckCircle}
            iconClass="bg-green-100 text-green-600"
          />

          <SummaryCard
            title="Ditangguhkan"
            value="8"
            icon={Ban}
            iconClass="bg-red-100 text-red-600"
          />

        </div>

        <UserTable />

      </div>
    </DashboardLayout>
  );
}