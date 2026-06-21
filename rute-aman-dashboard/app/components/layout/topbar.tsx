"use client";

import {
  Bell,
  CircleHelp,
  Search,
} from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-8">
      <div className="relative w-96">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Cari laporan..."
          className="w-full bg-slate-100 rounded-full py-3 pl-11 pr-4 outline-none text-[#6B7280]"
        />
      </div>

      <div className="flex items-center gap-6">
        <Bell className="cursor-pointer text-[#434655]" />
        <CircleHelp className="cursor-pointer text-[#434655]" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-300" />

          <div>
            <p className="font-medium text-[#191B23]">
              Admin RuteAman
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}