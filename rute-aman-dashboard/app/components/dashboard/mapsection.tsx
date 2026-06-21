"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; 

// Fix icon default Leaflet yang sering ilang di Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapSectionProps {
  reports?: any[];
}

export default function MapSection({ reports = [] }: MapSectionProps) {
  
  // Filter laporan yang punya koordinat valid aja biar map-nya nggak crash
  const validReports = reports.filter((r) => r.lat !== null && r.lng !== null);

  return (
    // Tambahin z-0 biar popup petanya nggak tumpang tindih nutupin navbar/dropdown lu
    <div className="h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0">

      <MapContainer
        center={[-6.2088, 106.8456]} // Titik tengah default
        zoom={12}
        className="h-full w-full"
        scrollWheelZoom={false} // UX biar gak keputar pas user nge-scroll web
      >

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Looping data dari database untuk nampilin marker */}
        {validReports.map((report) => (
          <Marker 
            key={report.id} 
            position={[report.lat, report.lng]}
          >
            <Popup>
              <div className="font-sans min-w-[150px]">
                <h3 className="font-bold text-sm text-slate-800 leading-tight">
                  {report.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-2">
                  {report.category || "Lainnya"}
                </p>
                <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded border ${
                  report.status === "Ditindaklanjuti" ? "bg-green-50 text-green-700 border-green-200" :
                  report.status === "Terverifikasi" ? "bg-blue-50 text-blue-700 border-blue-200" :
                  "bg-slate-50 text-slate-600 border-slate-200"
                }`}>
                  {report.status || "Dilaporkan"}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>

    </div>
  );
}