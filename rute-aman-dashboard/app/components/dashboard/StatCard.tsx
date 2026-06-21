import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  iconBg: string;
};

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconBg,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2 text-slate-800">
            {value}
          </h2>
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <Icon size={22} />
        </div>
      </div>

      <div className="mt-4">
        <span className="text-green-600 text-sm font-medium">
          {change}
        </span>

        <span className="text-slate-400 text-sm ml-2">
          dibanding bulan lalu
        </span>
      </div>
    </div>
  );
}