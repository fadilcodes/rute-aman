import { LucideIcon } from "lucide-react";

type SummaryCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  iconClass: string;
};

export default function SummaryCard({
  title,
  value,
  icon: Icon,
  iconClass,
}: SummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center ${iconClass}`}
      >
        <Icon size={24} />
      </div>

      <div>
        <p className="text-sm text-slate-500">
          {title}
        </p>

        <h3 className="text-3xl font-bold text-slate-800">
          {value}
        </h3>
      </div>
    </div>
  );
}