"use client";

import { useState, useEffect, FormEvent } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Crosshair, UploadCloud, EyeOff, ChevronDown, X, CheckCircle2, AlertTriangle, MessageSquarePlus } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Load peta tanpa SSR biar gak error di Next.js
const MapComponent = dynamic(() => import('@/components/MapComponent'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-62.5 flex items-center justify-center bg-gray-50 text-gray-400 font-medium animate-pulse rounded-xl border border-gray-200">
      Memuat Peta...
    </div>
  )
});

export default function FormLaporan() {
  const supabase = createClient();
  const router = useRouter();

  // --- State Modal (Popup) & Notifikasi ---
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{show: boolean, type: 'success' | 'error', message: string} | null>(null);

  // --- State Form Utama ---
  const [category, setCategory] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [deskripsi, setDeskripsi] = useState<string>("");
  const [foto, setFoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnon, setIsAnon] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // --- State Lokasi (Map) ---
  const [latLng, setLatLng] = useState<{lat: number, lng: number} | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [fullAddress, setFullAddress] = useState<string>('');

  // --- State AI Bubble ---
  const [narasiAI, setNarasiAI] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);

  // --- Fungsi Notifikasi ---
  const showNotification = (message: string, type: 'success' | 'error' = 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // --- Effect: Handle Preview Gambar ---
  useEffect(() => {
    if (!foto) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(foto);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [foto]);

  // --- Effect: Reverse Geocoding (Dapetin Nama Alamat) ---
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
        setLocationName(`Lat: ${latLng.lat.toFixed(3)}, Lng: ${latLng.lng.toFixed(3)}`);
        setFullAddress(`Koordinat: ${latLng.lat}, ${latLng.lng}`);
      }
    };
    getAddress();
  }, [latLng]);

  // --- Fetch Kategori dari Supabase ---
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('name').order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  // --- Fungsi: Ambil Lokasi Saat Ini (GPS) ---
  const handleGetCurrentLocation = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatLng({ lat: position.coords.latitude, lng: position.coords.longitude });
          showNotification('Lokasi berhasil didapatkan!', 'success');
        },
        () => showNotification('Gagal mendapatkan lokasi. Pastikan GPS aktif.', 'error')
      );
    } else {
      showNotification('Browser tidak mendukung Geolocation.', 'error');
    }
  };

  // --- Fungsi: Buka Modal & Cek Auth (Langsung Redirect ke /login) ---
  const handleOpenModal = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data?.user) {
        showNotification('Login terlebih dahulu, mengarahkan ke halaman login...', 'error');
        setTimeout(() => {
          router.push('/login');
        }, 500);
        return;
      }
      
      setIsOpen(true);
    } catch (error) {
      showNotification('Terjadi kesalahan saat memeriksa status login.', 'error');
    }
  };

  // --- Fungsi: Hit API Gemini ---
  const handleAutoFillAI = async () => {
    if (!narasiAI) return showNotification("Ceritain dulu kejadiannya di kolom AI dong!", "error");

    setIsLoadingAI(true);
    try {
      const res = await fetch('/api/ai-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ceritaUser: narasiAI })
      });

      if (!res.ok) throw new Error("Gagal fetch dari AI");

      const data = await res.json();
      setCategory(data.kategori_masalah);
      setTitle(data.judul_laporan);
      setDeskripsi(data.deskripsi_detail);
      
      showNotification("Form berhasil diisi AI ✨ Jangan lupa tentukan lokasi dan unggah foto!", "success");
    } catch (error) {
      console.error(error);
      showNotification("AI sedang sibuk, silakan isi manual.", "error");
    } finally {
      setIsLoadingAI(false);
    }
  };

  // --- Fungsi: Submit Final ke Supabase ---
  const handleFinalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!latLng) return showNotification('Pilih lokasi di peta terlebih dahulu!', 'error');
    if (!category) return showNotification('Pilih kategori laporan!', 'error');
    if (!title) return showNotification('Isi judul laporan!', 'error');
    if (!deskripsi) return showNotification('Isi deskripsi kejadian!', 'error');
    if (!foto) return showNotification('Foto bukti wajib diunggah!', 'error');

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        throw new Error('Lu harus login dulu buat ngelapor, Dil!');
      }

      // 1. Upload Gambar ke Storage
      let imageUrl = null;
      const fileExt = foto.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('report_images')
        .upload(`public/${fileName}`, foto);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('report_images')
        .getPublicUrl(`public/${fileName}`);
      imageUrl = publicUrl;

      // 2. Insert ke tabel `reports` dengan status 'Dilaporkan'
      const { error } = await supabase.from('reports').insert({
        user_id: user.id,
        title: title, 
        category: category,
        description: deskripsi,
        lat: latLng.lat,
        lng: latLng.lng,
        location_name: locationName, 
        full_address: fullAddress,   
        image_url: imageUrl,
        is_anonymous: isAnon,
        status: 'Dilaporkan' // <-- SUDAH DISESUAIKAN DENGAN CHECK CONSTRAINT
      });

      if (error) throw error;

      showNotification('Mantap! Laporan berhasil dikirim.', 'success');
      
      setTimeout(() => {
        setIsOpen(false);
        setIsSubmitting(false);
        setCategory(""); setTitle(""); setDeskripsi(""); setFoto(null); setNarasiAI(""); setLatLng(null);
        router.refresh();
      }, 2000);

    } catch (error: any) {
      showNotification(error.message || "Terjadi kesalahan saat mengirim laporan", 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* --- KOMPONEN NOTIFIKASI TOAST --- */}
      {notification && (
        <div className={`fixed top-24 right-6 z-9999 flex items-center p-4 rounded-xl shadow-lg border transition-all duration-300 animate-in slide-in-from-top-5 fade-in ${
          notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-6 h-6 mr-3 text-green-600 flex-shrink-0" /> : <AlertTriangle className="w-6 h-6 mr-3 text-red-600 flex-shrink-0" />}
          <p className="text-sm font-medium pr-8">{notification.message}</p>
          <button onClick={() => setNotification(null)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:bg-gray-200 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* --- TOMBOL BUBBLE FAB MENGAMBANG --- */}
      <button
        onClick={handleOpenModal}
        className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-transform hover:scale-110 hover:bg-blue-700 active:scale-95 group"
        title="Buat Laporan Baru"
      >
        <MessageSquarePlus className="w-7 h-7 group-hover:animate-pulse" strokeWidth={2.5} />
      </button>

      {/* --- MODAL POPUP FORM --- */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <button onClick={() => setIsOpen(false)} className="absolute right-4 top-4 z-[110] rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Buat Laporan Baru</h2>
              <p className="text-sm text-gray-500 mt-1">Gunakan AI untuk mengisi form dengan cepat atau isi secara manual.</p>
            </div>

            <form onSubmit={handleFinalSubmit}>
              
              {/* --- AI BUBBLE SECTION --- */}
              <div className="bg-blue-50/80 p-5 rounded-xl border border-blue-200 mb-6 shadow-sm">
                <label className="block font-semibold text-blue-800 mb-2">✨ Ceritain ke AI Rute Aman</label>
                <textarea 
                  className="w-full p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  rows={2}
                  placeholder="Ceritakan kejadiannya di sini, misal: Baru aja ada motor kejeblos lobang gede depan pom bensin sudirman..."
                  value={narasiAI}
                  onChange={(e) => setNarasiAI(e.target.value)}
                />
                <button 
                  type="button" onClick={handleAutoFillAI} disabled={isLoadingAI}
                  className="mt-3 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
                >
                  {isLoadingAI ? "Sedang Menganalisis..." : "Isikan Form Otomatis"}
                </button>
              </div>

              {/* --- GRID LAYOUT: MAP & KATEGORI --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                
                {/* Kiri: Peta Leaflet */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-800 text-sm">Pilih Lokasi Kejadian</label>
                  <div className="h-[220px] rounded-xl overflow-hidden border border-gray-200 relative z-[90]">
                    <MapComponent 
                      interactive={true} 
                      onLocationSelect={(lat: number, lng: number) => setLatLng({lat, lng})}
                      selectedLocation={latLng}
                      selectedCategory={category}
                    />
                    <button 
                      type="button"
                      onClick={handleGetCurrentLocation}
                      className="absolute bottom-3 right-3 z-[400] bg-white px-3 py-1.5 rounded-full text-xs font-medium shadow flex items-center gap-2 hover:bg-gray-50 border border-gray-200"
                    >
                      <Crosshair size={14} className="text-gray-500" /> Deteksi Lokasi
                    </button>
                  </div>
                  {fullAddress && (
                    <p className="text-xs text-blue-700 mt-2 font-medium bg-blue-50 p-2 rounded border border-blue-100 truncate">
                      📍 {locationName}
                    </p>
                  )}
                </div>

                {/* Kanan: Kategori & Toggle Anonim */}
                <div className="space-y-5">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-800 text-sm">Kategori Masalah</label>
                    <div className="relative">
                      <select 
                        className="w-full border border-gray-300 bg-white rounded-xl p-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={category} onChange={e => setCategory(e.target.value)} required
                      >
                        <option value="" disabled>Pilih kategori laporan...</option>
                        {isLoadingCategories ? <option disabled>Memuat kategori...</option> : categories?.map((cat) => (
                          <option key={cat.name} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-4 text-gray-400" size={18} pointerEvents="none" />
                    </div>
                  </div>

                  <div className="border border-gray-200 bg-gray-50 rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-start gap-3">
                      <EyeOff className="text-gray-600 mt-1" size={18} />
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm">Lapor Anonim</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">Sembunyikan nama lu dari publik</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={isAnon} onChange={e => setIsAnon(e.target.checked)} />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* --- JUDUL & DESKRIPSI --- */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Judul Laporan</label>
                  <input 
                    type="text" required maxLength={100}
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Contoh: Percobaan Pencurian Motor, Lampu Padam..."
                    value={title} onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Deskripsi Detail</label>
                  <textarea 
                    required rows={3}
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Jelaskan detail kejadian yang lu temukan..."
                    value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}
                  />
                </div>
              </div>

              {/* --- UPLOAD FOTO (HANYA JPG/PNG) --- */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-2">Unggah Foto Bukti (Wajib)</label>
                {!previewUrl ? (
                  <label className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                    <UploadCloud size={36} className="text-blue-500 mb-2" />
                    <span className="text-gray-700 font-medium text-sm">Klik atau seret foto ke sini</span>
                    <span className="text-gray-400 text-xs mt-1">Hanya JPG/PNG, Maks. 5MB</span>
                    <input 
                      type="file" className="hidden" 
                      accept="image/jpeg, image/png, image/jpg" 
                      onChange={(e) => e.target.files && setFoto(e.target.files[0])}
                    />
                  </label>
                ) : (
                  <div className="relative inline-block border rounded-xl overflow-hidden shadow-sm">
                    <img src={previewUrl} alt="Preview" className="h-36 w-auto object-cover" />
                    <button
                      type="button" onClick={() => setFoto(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* --- TOMBOL SUBMIT --- */}
              <div className="pt-5 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Batal</button>
                <button 
                  type="submit" disabled={isSubmitting}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-8 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Mengirim Data...' : 'Kirim Laporan'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}