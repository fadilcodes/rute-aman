import { LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-4 px-8 bg-white border-b border-slate-100">
      <div className="text-xl font-bold text-blue-700 flex items-center gap-2">
        <div className="w-4 h-5 bg-blue-700 rounded-sm" /> {/* Placeholder logo icon */}
        RuteAman
      </div>
      <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500 items-center">
        <Link href="#" className="hover:text-blue-700">Beranda</Link>
        <Link href="#" className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">Tentang Kami</Link>
        <Link href="#" className="hover:text-blue-700">Laporan Komunitas</Link>
      </div>
      <button className="flex items-center gap-2 text-red-500 text-sm font-medium hover:text-red-600">
        <LogOut size={16} /> Keluar
      </button>
    </nav>
  );
}