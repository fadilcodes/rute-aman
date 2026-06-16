import { Shield, ShieldCheck, Activity } from 'lucide-react';
import { Card } from '../ui/Card';

const values = [
  {
    title: 'Keamanan Bersama',
    desc: 'Kami percaya bahwa kolaborasi aktif antar warga adalah kunci utama dalam mendeteksi dan mencegah potensi bahaya di sekitar kita.',
    icon: <Shield size={20} className="text-blue-700" />,
    bg: 'bg-blue-100'
  },
  {
    title: 'Data Terpercaya',
    desc: 'Setiap laporan divalidasi dengan algoritma cerdas dan verifikasi komunitas untuk memastikan informasi yang disajikan selalu akurat.',
    icon: <ShieldCheck size={20} className="text-slate-600" />,
    bg: 'bg-slate-100'
  },
  {
    title: 'Transparansi',
    desc: 'Akses data yang terbuka membantu warga memahami pola keamanan di lingkungan mereka dan memudahkan otoritas dalam bertindak.',
    icon: <Activity size={20} className="text-emerald-600" />,
    bg: 'bg-emerald-100'
  }
];

export default function ValuesSection() {
  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-800">Nilai-Nilai Kami</h2>
        <p className="text-slate-500 text-sm mt-2">Prinsip yang membimbing setiap baris kode dan keputusan yang kami ambil di RuteAman.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {values.map((val, idx) => (
          <Card key={idx} className="bg-slate-50 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${val.bg}`}>
              {val.icon}
            </div>
            <h3 className="font-bold text-slate-800 mb-2">{val.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{val.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}