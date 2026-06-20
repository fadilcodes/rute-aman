"use client";
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';

interface MapProps {
  reports?: any[];
  onLocationSelect?: (lat: number, lng: number) => void;
  interactive?: boolean;
  selectedLocation?: { lat: number; lng: number } | null;
  selectedCategory?: string;
}

// Fungsi warna marker
const getCategoryColor = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'kriminalitas': return '#ef4444'; 
    case 'penerangan': return '#eab308'; 
    case 'infrastruktur': return '#6b7280'; 
    default: return '#3b82f6'; 
  }
};

// Custom SVG Marker
const createCustomIcon = (category: string) => {
  const color = getCategoryColor(category);
  const svgIcon = `
    <svg width="36" height="36" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.25));">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3" fill="white"></circle>
    </svg>
  `;

  return L.divIcon({
    className: 'bg-transparent border-none',
    html: svgIcon,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

function LocationPicker({ onLocationSelect }: { onLocationSelect: any }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function MapComponent({ 
  reports = [], 
  onLocationSelect, 
  interactive = false,
  selectedLocation = null,
  selectedCategory = 'Lainnya' 
}: MapProps) {
  
  // Memaksa Leaflet me-refresh ukurannya saat komponen dimuat
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MapContainer 
      center={[-6.2088, 106.8456]} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
      className="rounded-xl z-0"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      
      {reports.map((report) => (
        <Marker 
          key={report.id} 
          position={[report.lat, report.lng]} 
          icon={createCustomIcon(report.category)}
        >
          <Popup className="custom-popup">
            <div className="font-sans flex flex-col min-w-[180px] text-center p-1">
              
              {/* Badge Kategori */}
              <div className="mb-2">
                <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-md border ${
                  report.category?.toLowerCase() === 'kriminalitas' ? 'bg-red-100 text-red-700 border-red-200' :
                  report.category?.toLowerCase() === 'penerangan' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                  report.category?.toLowerCase() === 'infrastruktur' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                  'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {report.category || 'Lainnya'}
                </span>
              </div>
              
              {/* Judul Laporan */}
              <p className="font-bold text-gray-900 text-sm mb-3 leading-tight line-clamp-2">
                {report.title}
              </p>

              {/* Tombol Lihat Detail */}
              <a 
                href={`/laporan/${report.id}`} 
                className="w-full border border-blue-600 text-blue-600 text-xs font-semibold py-2 rounded-lg hover:border-blue-900 hover:text-white transition-colors shadow-sm block text-center no-underline"
              >
                Lihat Laporan &rsaquo;
              </a>
              
            </div>
          </Popup>
        </Marker>
      ))}

      {selectedLocation && (
        <Marker 
          position={[selectedLocation.lat, selectedLocation.lng]}
          icon={createCustomIcon(selectedCategory)}
        />
      )}

      {interactive && <LocationPicker onLocationSelect={onLocationSelect} />}
    </MapContainer>
  );
}