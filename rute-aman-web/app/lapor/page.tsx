"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Crosshair, UploadCloud, EyeOff, Info, ChevronDown, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import 'leaflet/dist/leaflet.css';

// Load peta tanpa SSR
const MapComponent = dynamic(() => import('@/components/MapComponent'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 font-medium animate-pulse">
      Memuat Peta...
    </div>
  )
});

export default function LaporPage() {
  const [latLng, setLatLng] = useState<{lat: number, lng: number} | null>(null);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState(''); 
  const [description, setDescription] = useState('');
  const [isAnon, setIsAnon] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const [locationName, setLocationName] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // STATE BARU: Untuk Notifikasi DOM
  const [notification, setNotification] = useState<{show: boolean, type: 'success' | 'error', message: string} | null>(null);

  const supabase = createClient();
  const router = useRouter();

  // FUNGSI BARU: Menampilkan notifikasi
  const showNotification = (message: string, type: 'success' | 'error' = 'error') => {
    setNotification({ show: true, message, type });
    // Hilangkan notifikasi otomatis setelah 3.5 detik
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Handle preview gambar
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // Handle Reverse Geocoding otomatis tiap koordinat berubah
  useEffect(() => {
    const getAddress = async () => {
      if (!latLng) return;
      
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latLng.lat}&lon=${latLng.lng}`,
          { headers: { 'Accept-Language': 'id' } }
        );
        const data = await res.json();
        
        if (data && data.address) {
          const road = data.address.road || data.address.pedestrian || '';
          const suburb = data.address.suburb || data.address.village || '';
          const city = data.address.city || data.address.town || data.address.regency || '';
          
          setLocationName(road ? `${road}, ${city || suburb}` : `${suburb}, ${city}`);
          setFullAddress(data.display_name);
        }
      } catch (error) {
        console.error("Gagal get address:", error);
        setLocationName(`Lat: ${latLng.lat.toFixed(3)}, Lng: ${latLng.lng.toFixed(3)}`);
        setFullAddress(`Koordinat: ${latLng.lat}, ${latLng.lng}`);
      }
    };

    getAddress();
  }, [latLng]);

  // Fetch Kategori
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('name').order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const handleGetCurrentLocation = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatLng({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => showNotification('Gagal mendapatkan lokasi. Pastikan izin akses lokasi aktif.', 'error')
      );
    } else {
      showNotification('Browser lu ga support Geolocation, Dil.', 'error');
    }
  };

  // --- FUNGSI BARU: Validasi File JPG/PNG dan Max 5MB ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;

    // 1. Validasi Tipe File (MIME Type)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(selectedFile.type)) {
      showNotification('Format file ditolak! Harap unggah gambar berformat JPG atau PNG saja.', 'error');
      e.target.value = ''; // Reset input
      return;
    }

    // 2. Validasi Ukuran Maksimal (5 MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      showNotification('Ukuran gambar terlalu besar! Maksimal 5MB.', 'error');
      e.target.value = ''; // Reset input
      return;
    }

    // Lolos validasi, simpan ke state
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ganti semua alert validasi menjadi showNotification
    if (!latLng) return showNotification('Pilih lokasi di peta terlebih dahulu!', 'error');
    if (!category) return showNotification('Pilih kategori laporan!', 'error');
    if (!title) return showNotification('Isi judul laporan!', 'error');

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Anda harus login terlebih dahulu!');

      let imageUrl = null;
      if (file) {
        const fileExt = file.name.split('.').pop();
        // Pakai Date.now() biar nama file selalu unik & menghindari bentrok di storage
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('report_images')
          .upload(`public/${fileName}`, file);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('report_images')
          .getPublicUrl(`public/${fileName}`);
        imageUrl = publicUrl;
      }

      const { error } = await supabase.from('reports').insert({
        user_id: user.id,
        title: title, 
        category,
        description,
        lat: latLng.lat,
        lng: latLng.lng,
        location_name: locationName, 
        full_address: fullAddress,   
        image_url: imageUrl,
        is_anonymous: isAnon,
        status: 'Dilaporkan' // Sesuaikan dengan constraint DB lu
      });

      if (error) throw error;

      showNotification('Laporan berhasil dikirim! Terima kasih atas kontribusi Anda.', 'success');
      
      // Kasih jeda 2 detik biar user bisa baca pesan sukses sebelum pindah halaman
      setTimeout(() => {
        router.push('/'); // Atau arahin ke /laporan-komunitas
      }, 2000);

    } catch (error: any) {
      showNotification(error.message, 'error');
      setIsSubmitting(false); // Pindahin set false ke sini biar kalau error tombolnya nyala lagi
    }
  };

  return (
    <>
    {/* KOMPONEN NOTIFIKASI TOAST */}
    {notification && (
      <div className={`fixed top-24 right-6 z-[9999] flex items-center p-4 rounded-xl shadow-lg border transition-all duration-300 animate-in slide-in-from-top-5 fade-in ${
        notification.type === 'success' 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-red-50 border-red-200 text-red-800'
      }`}>
        {notification.type === 'success' ? (
          <CheckCircle2 className="w-6 h-6 mr-3 text-green-600 flex-shrink-0" />
        ) : (
          <AlertTriangle className="w-6 h-6 mr-3 text-red-600 flex-shrink-0" />
        )}
        <p className="text-sm font-medium pr-8">{notification.message}</p>
        <button 
          onClick={() => setNotification(null)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )}

    <Navbar />
    
    <div className="max-w-5xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-2">Buat Laporan Baru</h1>
      <p className="text-gray-600 mb-10">Kontribusi Anda membantu menjaga keamanan komunitas kita bersama.</p>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Kolom Kiri: Peta */}
          <div>
            <label className="block mb-3 font-semibold text-gray-800">Pilih Lokasi</label>
            <div className="h-[280px] rounded-xl overflow-hidden border border-gray-200 relative">
              <MapComponent 
                interactive={true} 
                onLocationSelect={(lat, lng) => setLatLng({lat, lng})}
                selectedLocation={latLng}
                selectedCategory={category}
              />
              <button 
                type="button" // Biar gak submit form pas ditekan
                onClick={handleGetCurrentLocation}
                className="absolute bottom-4 right-4 z-[400] bg-white px-4 py-2 rounded-full text-sm font-medium shadow-md flex items-center gap-2 hover:bg-gray-50 border border-gray-200"
              >
                <Crosshair size={16} className="text-gray-500" />
                Gunakan Lokasi Saat Ini
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">Klik pada peta untuk menyesuaikan titik lokasi laporan.</p>
            
            {fullAddress && (
              <p className="text-xs text-blue-600 mt-1 font-medium bg-blue-50 p-2 rounded truncate">
                Lokasi terdeteksi: {locationName}
              </p>
            )}
          </div>

          {/* Kolom Kanan: Kategori & Anonim */}
          <div className="space-y-6">
            <div>
              <label className="block mb-3 font-semibold text-gray-800">Kategori Masalah</label>
              <div className="relative">
                <select 
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  required
                >
                  <option value="" disabled>Pilih kategori laporan...</option>
                  {isLoadingCategories ? (
                    <option disabled>Memuat kategori...</option>
                  ) : (
                    categories?.map((cat) => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))
                  )}
                </select>
                <ChevronDown className="absolute right-4 top-4 text-gray-400" size={20} pointerEvents="none" />
              </div>
            </div>

            <div className="border border-gray-200 bg-gray-50 rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-start gap-3">
                <EyeOff className="text-blue-600 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">Lapor Anonim</h4>
                  <p className="text-xs text-gray-500 mt-1">Sembunyikan nama Anda dari publik</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isAnon} onChange={e => setIsAnon(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION BARU: Judul Laporan */}
        <div className="mb-6">
          <label className="block mb-3 font-semibold text-gray-800">Judul Laporan</label>
          <input 
            type="text"
            className="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Contoh: Percobaan Pencurian Motor, Lampu Jalan Padam..."
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required
            maxLength={100}
          />
        </div>

        {/* Deskripsi Laporan */}
        <div className="mb-8">
          <label className="block mb-3 font-semibold text-gray-800">Deskripsi Detail</label>
          <textarea 
            className="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Jelaskan detail kejadian atau kondisi yang Anda temukan..."
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            required
          ></textarea>
        </div>

        {/* Unggah Foto */}
        <div className="mb-10">
          <label className="block mb-3 font-semibold text-gray-800">Unggah Foto Bukti (Opsional)</label>
          <label className="border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer relative">
            <UploadCloud size={40} className="text-blue-500 mb-3" />
            <span className="text-gray-700 font-medium">Klik atau seret foto ke sini</span>
            <span className="text-gray-400 text-sm mt-1">Maksimal ukuran file: 5MB (Hanya JPG/PNG)</span>
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              accept="image/jpeg, image/png, image/jpg"
              onChange={handleFileChange}
            />
          </label>
          
          {file && previewUrl && (
            <div className="mt-6 relative inline-block">
              <img 
                src={previewUrl} 
                alt="Preview foto" 
                className="h-40 w-auto object-cover rounded-xl border border-gray-200 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setFile(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition"
                title="Hapus foto"
              >
                <X size={14} />
              </button>
              <p className="text-sm text-green-600 mt-3 font-medium">File terpilih: {file.name}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 border-t border-gray-100 pt-6">
          <button type="button" onClick={() => router.back()} className="text-gray-600 font-medium px-6 py-3 hover:text-gray-800">
            Batal
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Laporan ▹'}
          </button>
        </div>
      </form>

      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start gap-4">
        <Info className="text-blue-500 shrink-0 mt-1" size={24} />
        <div>
          <h4 className="font-semibold text-gray-800">Keamanan Data Anda</h4>
          <p className="text-gray-600 text-sm mt-1">
            Laporan Anda akan ditinjau oleh tim moderator dalam waktu maksimal 24 jam. Kami menjamin 
            kerahasiaan identitas Anda sesuai dengan kebijakan privasi kami.
          </p>
        </div>
      </div>
    </div>

    <Footer />
    </>
  );
}