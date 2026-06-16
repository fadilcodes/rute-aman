export default function Footer() {
  return (
    <footer className="flex flex-col md:flex-row items-center justify-between py-6 px-8 bg-slate-200/50 text-sm text-slate-500 border-t border-slate-200">
      <div className="font-bold text-slate-800">
        RuteAman <span className="font-normal text-slate-500">© 2026 RuteAman. Melindungi Komunitas Bersama.</span>
      </div>
      <div className="flex gap-4 mt-4 md:mt-0">
        <a href="#" className="hover:text-slate-800">Kebijakan Privasi</a>
        <a href="#" className="hover:text-slate-800">Syarat & Ketentuan</a>
        <a href="#" className="hover:text-slate-800">Kontak Kami</a>
      </div>
    </footer>
  );
}