import {
  FileText,
  UserX,
  UserCheck,
} from "lucide-react";

const getAvatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "User"
  )}&background=random`;

interface UserTableProps {
  users?: any[];
}

export default function UserTable({ users = [] }: UserTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

      <div className="px-6 py-5 border-b border-slate-100 text-[#191B23] bg-[#FFFFFF]">
        <h2 className="text-2xl font-bold">
          Daftar Pengguna
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">

          <thead className="bg-[#F3F3FE] text-slate-500 text-sm uppercase">
            <tr>
              <th className="text-left p-4">Pengguna</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Laporan</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400 font-medium">
                  Belum ada data pengguna yang terdaftar.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isSuspended = user.status?.toLowerCase() === "ditangguhkan";
                const statusUser = isSuspended ? "Ditangguhkan" : "Aktif";

                return (
                  <tr
                    key={user.id}
                    className="border-t border-slate-100 hover:bg-slate-50/80 transition text-[#434655]"
                  >
                    {/* Kolom Pengguna (Avatar + Nama) */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar_url || getAvatar(user.full_name)}
                          alt={user.full_name || "User"}
                          className="w-10 h-10 rounded-full object-cover border border-slate-100"
                        />
                        <span className="font-semibold text-slate-800">
                          {user.full_name || "Pengguna Anonim"}
                        </span>
                      </div>
                    </td>

                    {/* Kolom Email (Sudah Sinkron) */}
                    <td className="p-4 font-medium text-slate-600">
                      {user.email || <span className="text-gray-400 italic">Tidak ada email</span>}
                    </td>

                    {/* Kolom Jumlah Laporan (Sudah Otomatis Hitung) */}
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold">
                        <FileText size={16} />
                        {user.total_reports ?? 0} Laporan
                      </div>
                    </td>

                    {/* Kolom Status Akun */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          !isSuspended
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {statusUser}
                      </span>
                    </td>

                    {/* Kolom Tombol Aksi */}
                    <td className="p-4">
                      <button 
                        className={`p-2 rounded-xl transition ${
                          !isSuspended 
                            ? "hover:bg-red-50 text-red-600" 
                            : "hover:bg-green-50 text-green-600"
                        }`}
                        title={!isSuspended ? "Tangguhkan Pengguna" : "Aktifkan Pengguna"}
                      >
                        {!isSuspended ? (
                          <UserX size={18} />
                        ) : (
                          <UserCheck size={18} />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

        </table>
      </div>

      {/* Bagian Pagination Info */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
        <p className="text-sm text-slate-500 font-medium">
          Menampilkan {users.length > 0 ? 1 : 0} - {users.length} dari {users.length} pengguna
        </p>

        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center font-medium transition disabled:opacity-50" disabled>
            ‹
          </button>
          <button className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold shadow-sm">
            1
          </button>
          <button className="w-10 h-10 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center font-medium transition disabled:opacity-50" disabled>
            ›
          </button>
        </div>
      </div>

    </div>
  );
}