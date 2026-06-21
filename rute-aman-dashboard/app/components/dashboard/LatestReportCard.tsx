import { MapPin, Clock } from "lucide-react";

type LatestReportCardProps = {
  title: string;
  location: string;
  time: string;
  status: "Baru" | "Diproses" | "Selesai";
};

export default function LatestReportCard({
  title,
  location,
  time,
  status,
}: LatestReportCardProps) {
  const statusStyles = {
    Baru: "bg-red-100 text-red-600",
    Diproses: "bg-yellow-100 text-yellow-700",
    Selesai: "bg-green-100 text-green-600",
  };

  return (
    <div className="border border-slate-100 rounded-xl p-4 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-slate-800">
          {title}
        </h4>

        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${statusStyles[status]}`}
        >
          {status}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <MapPin size={14} />
          <span>{location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock size={14} />
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
}