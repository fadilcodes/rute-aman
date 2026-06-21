import LatestReportCard from "./LatestReportCard";

export default function LatestReportSection() {
const reports = [
  {
    id: 1,
    title: "Percobaan Pencurian",
    location: "Jl. Sudirman",
    time: "5 menit lalu",
    status: "Baru" as const,
  },
  {
    id: 2,
    title: "Lampu Jalan Padam",
    location: "Jl. Merdeka",
    time: "15 menit lalu",
    status: "Diproses" as const,
  },
  {
    id: 3,
    title: "Sampah Menumpuk",
    location: "Jl. Ahmad Yani",
    time: "30 menit lalu",
    status: "Selesai" as const,
  },
];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 h-[500px]">
        <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg">
                Laporan Terbaru
            </h3>

            <button className="text-blue-600 text-sm font-medium hover:underline">
                Lihat Semua
            </button>
        </div>

      <div className="space-y-4 overflow-y-auto max-h-[400px] pr-1">
        {
            reports.map((report) => (
                <LatestReportCard
                key={report.id}
                title={report.title}
                location={report.location}
                time={report.time}
                status={report.status}
                />
            ))
        };
      </div>
    </div>
  );
}