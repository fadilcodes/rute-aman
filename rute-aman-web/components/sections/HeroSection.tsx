import { ArrowDown } from 'lucide-react';
import { Badge } from '../ui/Card';

export default function HeroSection() {
  return (
    <section className="text-center max-w-2xl mx-auto py-16 flex flex-col items-center gap-4">
      <Badge>Misi Keamanan Warga</Badge>
      <h1 className="text-4xl font-bold text-slate-900 mt-2">Tentang RuteAman</h1>
      <p className="text-slate-500 text-sm leading-relaxed">
        Membangun lingkungan yang lebih aman melalui kekuatan kolaborasi komunitas. Kami 
        percaya bahwa setiap warga memiliki peran penting dalam menjaga keamanan bersama 
        melalui pemetaan data yang transparan dan real-time.
      </p>
      <button className="mt-4 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
        Pelajari Misi Kami <ArrowDown size={16} />
      </button>
    </section>
  );
}