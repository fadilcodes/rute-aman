import { Card } from '../ui/Card';

export default function ImpactSection() {
  return (
    <section className="bg-[#2a2f35] rounded-3xl p-8 md:p-12 text-white grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div>
        <h2 className="text-3xl font-bold mb-4">Dampak Sosial Kami</h2>
        <p className="text-slate-300 text-sm mb-8 leading-relaxed">
          Sejak diluncurkan, RuteAman telah membantu ribuan warga menghindari area rawan dan memberikan data krusial bagi pihak berwenang untuk meningkatkan infrastruktur keamanan di 15 kota besar di Indonesia.
        </p>
        <div className="flex gap-4">
          <div className="bg-[#3a4149] p-5 rounded-xl flex-1">
            <div className="text-3xl font-bold text-blue-400">50rb+</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">Laporan Warga</div>
          </div>
          <div className="bg-[#3a4149] p-5 rounded-xl flex-1">
            <div className="text-3xl font-bold text-emerald-400">85%</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">Tingkat Akurasi</div>
          </div>
        </div>
      </div>
      
      <div>
        <Card className="bg-white text-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <img src="https://i.pravatar.cc/150?img=11" alt="Joko" className="w-10 h-10 rounded-full" />
            <div>
              <h4 className="font-bold text-sm">Joko</h4>
              <p className="text-xs text-blue-600">Warga Jakarta Selatan</p>
            </div>
          </div>
          <p className="text-sm italic text-slate-600">
            "RuteAman sangat membantu saya saat harus pulang larut malam dari kantor. 
            Mengetahui rute mana yang lebih terang dan diawasi warga memberikan ketenangan 
            pikiran yang luar biasa."
          </p>
        </Card>
      </div>
    </section>
  );
}