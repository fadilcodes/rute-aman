export default function CategoryFilter() {
  const categories = [
    "Semua",
    "Kriminalitas",
    "Penerangan Jalan",
    "Masalah Lain",
  ];

  return (
    <div className="flex gap-3 flex-wrap">
      {categories.map((category, index) => (
        <button
          key={category}
          className={`px-5 py-2 rounded-full text-sm font-medium transition
            ${
              index === 0
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 hover:bg-slate-50"
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}