"use client";

import { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Bikin array buat list menu biar kodenya lebih rapi pas di-map
  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang Kami', href: '/tentang-kami' },
    { name: 'Laporan Komunitas', href: '/laporan-komunitas' },
  ];

  return (
    <nav className="relative bg-white border-b border-slate-100 z-50">
      <div className="flex items-center justify-between py-4 px-6 md:px-8">
        
        {/* Logo RuteAman */}
        <Link href="/" className="text-xl font-bold text-blue-700 flex items-center gap-2">
          <div className="w-4 h-5 bg-blue-700 rounded-sm" /> 
          RuteAman
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-2 text-sm font-medium items-center">
          {navLinks.map((link) => {
            // Cek apakah href menu sama dengan path URL saat ini
            const isActive = pathname === link.href;
            
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-slate-500 hover:text-blue-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Logout Button (Desktop) & Hamburger Menu (Mobile) */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:block">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 text-sm font-medium hover:text-red-600 hover:bg-red-50 transition-colors">
              <LogOut size={18} /> Keluar
            </button>
          </Link>

          {/* Tombol Hamburger buat Mobile */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:text-blue-700 focus:outline-none bg-slate-50 rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {/* Akan muncul kalau isOpen bernilai true */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-lg py-4 px-6 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)} // Tutup menu pas diklik
                className={`px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-slate-500 hover:text-blue-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          
          <div className="h-px bg-slate-100 my-2"></div>
          
          <Link href="/login" onClick={() => setIsOpen(false)}>
            <button className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-red-500 font-medium hover:text-red-600 hover:bg-red-50 transition-colors">
              <LogOut size={18} /> Keluar
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}