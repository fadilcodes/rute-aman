"use client";

import { usePathname } from "next/navigation";

import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();
    
  return (
    <aside className="w-72 bg-white border-r flex flex-col">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-3 rounded-xl">
            <Shield size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              RuteAman
            </h1>

            <p className="text-sm text-gray-500">
              Sistem Keamanan Publik
            </p>
          </div>
        </div>
      </div>

      <nav className="px-4 flex-1">
        <ul className="space-y-2">
          <li>
           <Link
                href="/dashboard"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                    ${
                    pathname === "/dashboard"
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "hover:bg-gray-100 text-slate-700"
                    }`}
                >
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
          </li>

          <li>
            <Link
                href="/laporan"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                    ${
                    pathname === "/laporan"
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "hover:bg-gray-100 text-slate-700"
                    }`}
                >
              <FileText size={20} />
              Laporan
            </Link>
          </li>

          <li>
            <Link
            href="/pengguna"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                ${
                pathname === "/pengguna"
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-gray-100 text-slate-700"
                }`}
            >
              <Users size={20} />
              Pengguna
            </Link>
          </li>

          {/* <li>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#D0E1FB] text-[#434655] font-medium"
            >
              <Settings size={20} />
              Pengaturan
            </Link>
          </li> */}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}