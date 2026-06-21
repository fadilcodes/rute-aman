const reports = [
  {
    id: "RA-8821",
    category: "Kecelakaan Lalu Lintas",
    categoryColor: "bg-red-500",
    location: "Jl. Sudirman No.45, Jakarta Pusat",
    date: "12 Mei 2026, 08:30",
    status: "Pending",
    validation: 12,
    action: "Verifikasi",
  },
  {
    id: "RA-8819",
    category: "Lampu Jalan Padam",
    categoryColor: "bg-yellow-500",
    location: "Simpang Lima, Semarang",
    date: "12 Apr 2026, 07:15",
    status: "Dalam Tinjauan",
    validation: 45,
    action: "Selesai",
  },
  {
    id: "RA-8815",
    category: "Jalan Berlubang",
    categoryColor: "bg-blue-500",
    location: "Jl. Malioboro, Yogyakarta",
    date: "11 Apr 2026, 21:40",
    status: "Terverifikasi",
    validation: 128,
    action: "Selesai",
  },
  {
    id: "RA-8810",
    category: "Kebakaran",
    categoryColor: "bg-green-600",
    location: "Pasar Atom, Surabaya",
    date: "11 Apr 2026, 18:00",
    status: "Selesai",
    validation: 256,
    action: "Selesai",
  },
];

export default function ReportTable() {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-red-100 text-red-600";

      case "Dalam Tinjauan":
        return "bg-blue-100 text-blue-600";

      case "Terverifikasi":
        return "bg-sky-100 text-sky-600";

      case "Selesai":
        return "bg-green-100 text-green-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getActionClass = (action: string) => {
    return action === "Verifikasi"
      ? "bg-blue-600 text-white"
      : "bg-green-600 text-white";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#F3F3FE] text-slate-500 text-sm uppercase">
          <tr>
            <th className="text-left p-4">ID Laporan</th>
            <th className="text-left p-4">Kategori</th>
            <th className="text-left p-4">Lokasi</th>
            <th className="text-left p-4">Tanggal</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Validasi</th>
            <th className="text-left p-4">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((report) => (
            <tr
              key={report.id}
              className="border-t border-slate-100 hover:bg-slate-50 text-[#191B23]"
            >
              <td className="p-4 font-semibold text-blue-600">
                #{report.id}
              </td>

                <td className="p-4">
                <div className="flex items-center gap-2">
                    <div
                    className={`w-2 h-2 rounded-full ${report.categoryColor}`}
                    />

                    <span>{report.category}</span>
                </div>
                </td>

              <td className="p-4">
                {report.location}
              </td>

              <td className="p-4">
                {report.date}
              </td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                    report.status
                  )}`}
                >
                  {report.status}
                </span>
              </td>

                <td className="p-4">
                <span className="bg-slate-100 px-4 py-1 rounded-full text-sm font-medium">
                    {report.validation}
                </span>
                </td>

              <td className="p-4">
                <button
                  className={`px-5 py-2 rounded-lg text-sm font-semibold ${getActionClass(
                    report.action
                  )}`}
                >
                  {report.action}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
                Menampilkan 1 - 4 dari 1,382 laporan
            </p>

            <div className="flex gap-2">
                <button className="w-10 h-10 rounded-lg border">
                ‹
                </button>

                <button className="w-10 h-10 rounded-lg bg-blue-600 text-white">
                1
                </button>

                <button className="w-10 h-10 rounded-lg border">
                2
                </button>

                <button className="w-10 h-10 rounded-lg border">
                3
                </button>

                <button className="w-10 h-10 rounded-lg border">
                ›
                </button>
            </div>
        </div>
    </div>
  );
}