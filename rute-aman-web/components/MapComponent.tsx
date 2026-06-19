"use client";
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

interface MapProps {
  reports?: any[];
  onLocationSelect?: (lat: number, lng: number) => void;
  interactive?: boolean;
  selectedLocation?: { lat: number; lng: number } | null;
  selectedCategory?: string;
}

// Fungsi warna marker
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Kriminalitas': return '#ef4444'; 
    case 'Penerangan': return '#eab308'; 
    case 'Infrastruktur': return '#6b7280'; 
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
          <Popup>
            <div className="font-sans">
              <span className={`text-[10px] font-bold px-2 py-1 rounded inline-block mb-1 ${
                report.category === 'Kriminalitas' ? 'bg-red-100 text-red-600' : 
                report.category === 'Penerangan' ? 'bg-yellow-100 text-yellow-600' : 
                report.category === 'Infrastruktur' ? 'bg-gray-100 text-gray-600' : 
                'bg-blue-100 text-blue-600'
              }`}>
                {report.category}
              </span>
              <p className="font-bold m-0 text-sm leading-tight">{report.title}</p>
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




// "use client";
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// interface MapProps {
//   reports?: any[];
//   onLocationSelect?: (lat: number, lng: number) => void;
//   interactive?: boolean;
//   selectedLocation?: { lat: number; lng: number } | null;
//   selectedCategory?: string;
// }

// // Fungsi buat nentuin warna berdasarkan kategori
// const getCategoryColor = (category: string) => {
//   switch (category) {
//     case 'Kriminalitas': return '#ef4444'; // Merah (text-red-500)
//     case 'Penerangan': return '#eab308'; // Kuning (text-yellow-500)
//     case 'Infrastruktur': return '#6b7280'; // Abu-abu (text-gray-500)
//     default: return '#3b82f6'; // Biru default (text-blue-500)
//   }
// };

// // Fungsi buat bikin icon marker SVG kustom
// const createCustomIcon = (category: string) => {
//   const color = getCategoryColor(category);
  
//   // Menggunakan inline SVG biar bentuknya rapi kayak pin lokasi
//   const svgIcon = `
//     <svg width="36" height="36" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.25));">
//       <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
//       <circle cx="12" cy="10" r="3" fill="white"></circle>
//     </svg>
//   `;

//   return L.divIcon({
//     className: 'bg-transparent border-none', // Hilangin style bawaan leaflet
//     html: svgIcon,
//     iconSize: [36, 36],
//     iconAnchor: [18, 36], // Titik jangkar di ujung bawah pin
//     popupAnchor: [0, -36] // Popup muncul tepat di atas pin
//   });
// };

// // Komponen buat nangkap klik (buat form lapor)
// function LocationPicker({ onLocationSelect }: { onLocationSelect: any }) {
//   useMapEvents({
//     click(e) {
//       if (onLocationSelect) {
//         onLocationSelect(e.latlng.lat, e.latlng.lng);
//       }
//     },
//   });
//   return null;
// }

// export default function MapComponent({ 
//   reports = [], 
//   onLocationSelect, 
//   interactive = false,
//   selectedLocation = null,
//   selectedCategory = 'Lainnya' 
// }: MapProps) {
  
//   return (
//     <MapContainer 
//       center={[-6.2088, 106.8456]} // Default Jakarta
//       zoom={13} 
//       className="w-full h-full rounded-xl z-0"
//     >
//       <TileLayer
//         url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
//       />
      
//       {/* Render Marker untuk Data Laporan yang udah ada (di Beranda) */}
//       {reports.map((report) => (
//         <Marker 
//           key={report.id} 
//           position={[report.lat, report.lng]} 
//           icon={createCustomIcon(report.category)}
//         >
//           <Popup>
//             <div className="font-sans">
//               <span className={`text-xs font-bold px-2 py-1 rounded inline-block mb-1 ${
//                 report.category === 'Kriminalitas' ? 'bg-red-100 text-red-600' : 
//                 report.category === 'Penerangan' ? 'bg-yellow-100 text-yellow-600' : 
//                 report.category === 'Infrastruktur' ? 'bg-gray-100 text-gray-600' : 
//                 'bg-blue-100 text-blue-600'
//               }`}>
//                 {report.category}
//               </span>
//               <p className="font-bold m-0 text-sm leading-tight">{report.title}</p>
//             </div>
//           </Popup>
//         </Marker>
//       ))}

//       {/* Render Marker saat user lagi milih lokasi di halaman Buat Laporan */}
//       {selectedLocation && (
//         <Marker 
//           position={[selectedLocation.lat, selectedLocation.lng]}
//           icon={createCustomIcon(selectedCategory)}
//         />
//       )}

//       {/* Event Listener buat klik peta */}
//       {interactive && <LocationPicker onLocationSelect={onLocationSelect} />}
//     </MapContainer>
//   );
// }