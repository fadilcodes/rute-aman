export default function FilterSection() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="grid grid-cols-3 gap-4">

        <select className="border border-slate-300 rounded-xl px-4 py-3">
          <option>Semua Kategori</option>
        </select>

        <select className="border border-slate-300 rounded-xl px-4 py-3">
          <option>Semua Status</option>
        </select>

        <select className="border border-slate-300 rounded-xl px-4 py-3">
          <option>Terakhir 7 Hari</option>
        </select>

      </div>

      <div className="flex gap-4 mt-4">
        <button className="px-5 py-3 rounded-xl border border-slate-300">
          Filter Lanjut
        </button>

        <button className="px-5 py-3 rounded-xl bg-blue-600 text-white">
          Ekspor Laporan
        </button>
      </div>
    </div>
  );
}