import { Users } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="bg-blue-600 rounded-3xl p-10 text-center text-white relative overflow-hidden">
      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-3">Jadilah Bagian dari Perubahan</h2>
        <p className="text-blue-100 text-sm mb-0">
          Kontribusi sekecil apa pun sangat berarti bagi keamanan komunitas Anda. Mari ciptakan 
          lingkungan yang lebih aman bersama RuteAman.
        </p>
      </div>
      {/* Background Icon Decoration */}
      <Users size={120} className="absolute -bottom-6 -right-6 text-blue-500 opacity-50" />
    </section>
  );
}