import { Users, Zap, Eye } from 'lucide-react';
import { Card } from '../ui/Card';

export default function VisionMissionSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col gap-6">
        <Card className="bg-[#f8fbff] border-blue-100">
          <h3 className="text-xl font-bold text-blue-700 mb-2">Visi</h3>
          <p className="text-sm text-slate-600">
            Menjadi platform pemetaan keamanan nomor satu di Indonesia yang menghubungkan 
            teknologi cerdas dengan kepedulian warga untuk menciptakan ruang publik yang tanpa rasa takut.
          </p>
        </Card>
        <Card className="bg-[#f8fbff] border-blue-100">
          <h3 className="text-xl font-bold text-blue-700 mb-4">Misi</h3>
          <ul className="space-y-4 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <Users size={18} className="text-blue-600 mt-0.5" />
              <span>Memberdayakan warga untuk aktif berkontribusi dalam pelaporan keamanan.</span>
            </li>
            <li className="flex items-start gap-3">
              <Zap size={18} className="text-blue-600 mt-0.5" />
              <span>Menyediakan data keamanan real-time yang akurat dan dapat diandalkan.</span>
            </li>
            <li className="flex items-start gap-3">
              <Eye size={18} className="text-blue-600 mt-0.5" />
              <span>Meningkatkan kesadaran keamanan di seluruh lapisan masyarakat.</span>
            </li>
          </ul>
        </Card>
      </div>
      <div className="relative rounded-2xl overflow-hidden min-h-75">
        {/* Ganti src dengan gambar asli lu dari public folder */}
        <img 
          src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop" 
          alt="Vision Illustration" 
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-linear-to-t from-blue-900/90 to-transparent flex items-end p-6">
          <p className="text-white font-medium text-sm md:text-base">
            "Keamanan bukanlah tugas satu orang, melainkan tanggung jawab kita semua."
          </p>
        </div>
      </div>
    </section>
  );
}