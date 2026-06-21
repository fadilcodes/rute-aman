import {
  FileText,
  UserX,
  UserCheck,
} from "lucide-react";

const users = [
  {
    id: 1,
    name: "Budi",
    email: "budi@gmail.com",
    reports: 12,
    status: "Aktif",
  },
  {
    id: 2,
    name: "Ani Wijaya",
    email: "ani.wijaya88@gmail.com",
    reports: 0,
    status: "Aktif",
  },
  {
    id: 3,
    name: "Dedi Kurniawan",
    email: "dedi.kur@gmail.com",
    reports: 45,
    status: "Ditangguhkan",
  },
  {
    id: 4,
    name: "Siska Putri",
    email: "siska.put@gmail.com",
    reports: 2,
    status: "Aktif",
  },
];

const getAvatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random`;

export default function UserTable() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

      <div className="px-6 py-5 border-b border-slate-100 text-[#191B23] bg-[#FFFFFF]">
        <h2 className="text-2xl font-bold">
          Daftar Pengguna
        </h2>
      </div>

      <table className="w-full">

        <thead className=" bg-[#F3F3FE] text-slate-500 text-sm uppercase">
          <tr>
            <th className="text-left p-4">Pengguna</th>
            <th className="text-left p-4">Email</th>
            <th className="text-left p-4">Laporan</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Aksi</th>
          </tr>
        </thead>

        <tbody>

          {users.map((user) => (

            <tr
              key={user.id}
              className="border-t border-slate-100 hover:bg-slate-50 transition text-[#434655]"
            >

                <td className="p-4">
                <div className="flex items-center gap-3">

                    <img
                    src={getAvatar(user.name)}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                    />

                    <span className="font-medium">
                    {user.name}
                    </span>

                </div>
                </td>

              <td className="p-4">
                {user.email}
              </td>

              <td className="p-4">

                <div className="flex items-center gap-2 text-blue-600">
                  <FileText size={16} />
                  {user.reports} Laporan
                </div>

              </td>

              <td className="p-4">

                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    user.status === "Aktif"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </span>

              </td>

              <td className="p-4">

                {user.status === "Aktif" ? (
                  <UserX
                    size={18}
                    className="text-red-600"
                  />
                ) : (
                  <UserCheck
                    size={18}
                    className="text-green-600"
                  />
                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">

            <p className="text-sm text-slate-500">
                Menampilkan 1 - 4 dari 500 pengguna
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