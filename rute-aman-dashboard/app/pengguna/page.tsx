"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import DashboardLayout from "@/app/components/layout/dashboardlayout";
import SummaryCard from "@/app/components/laporan/summarycard";
import UserTable from "@/app/components/pengguna/usertable";
import { Users, CheckCircle, Ban, Loader2 } from "lucide-react";

type Profile = {
  id: string;
  full_name?: string;
  avatar_url?: string;
  email?: string;
  status?: string;
  reports?: { count: number }[]; // Tipe data bentukan Supabase buat hasil count
};

export default function PenggunaPage() {
  const supabase = createClient();

  // Fetch data dari tabel profiles SEKALIGUS menghitung jumlah laporan
  const { data: users, isLoading } = useQuery<Profile[]>({
    queryKey: ["admin_users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, reports(count)") // Query sakti buat ngitung total laporan per user
        .order("full_name", { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Hitung statistik secara dinamis
  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter((user: Profile) => user.status !== "ditangguhkan").length || 0;
  const suspendedUsers = users?.filter((user: Profile) => user.status === "ditangguhkan").length || 0;

  // Format ulang data sebelum dikirim ke UserTable biar gampang dibaca
  const formattedUsers = users?.map((user) => ({
    ...user,
    // Ekstrak hasil count dari Supabase jadi angka biasa
    total_reports: user.reports?.[0]?.count || 0, 
  })) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {isLoading ? (
          <div className="flex items-center justify-center h-32 bg-white rounded-xl border border-gray-100 shadow-sm">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-500 font-medium">Memuat data pengguna...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <SummaryCard
                title="Total Pengguna"
                value={totalUsers.toString()}
                icon={Users}
                iconClass="bg-blue-100 text-blue-600"
              />

              <SummaryCard
                title="Aktif"
                value={activeUsers.toString()}
                icon={CheckCircle}
                iconClass="bg-green-100 text-green-600"
              />

              <SummaryCard
                title="Ditangguhkan"
                value={suspendedUsers.toString()}
                icon={Ban}
                iconClass="bg-red-100 text-red-600"
              />
            </div>

            {/* Kirim data yang udah diformat ke UserTable */}
            <UserTable users={formattedUsers} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}