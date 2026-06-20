"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import { Crosshair, ChevronDown, X, CheckCircle2, AlertTriangle, Loader2, Save } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import 'leaflet/dist/leaflet.css';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-50 animate-pulse">Memuat Peta...</div>
});

export default function EditLaporanPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [latLng, setLatLng] = useState<{lat: number, lng: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [notification, setNotification] = useState<{show: boolean, type: 'success' | 'error', message: string} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch Kategori Dinamis dari Database
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('name').order('name', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    const fetchReport = async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        showNotification('Gagal memuat data laporan', 'error');
        router.back();
        return;
      }

      setTitle(data.title);
      setDescription(data.description);
      setCategory(data.category);
      setLatLng({ lat: data.lat, lng: data.lng });
      setLoading(false);
    };
    fetchReport();
  }, [params.id, supabase, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let locationName = '';
      let fullAddress = '';
      if (latLng) {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latLng.lat}&lon=${latLng.lng}`, { headers: { 'Accept-Language': 'id' } });
        const data = await res.json();
        if (data.address) {
          const road = data.address.road || data.address.pedestrian || '';
          const city = data.address.city || data.address.town || data.address.regency || '';
          locationName = road ? `${road}, ${city}` : city;
          fullAddress = data.display_name;
        }
      }

      const { error } = await supabase
        .from('reports')
        .update({
          title,
          description,
          category,
          lat: latLng?.lat,
          lng: latLng?.lng,
          location_name: locationName,
          full_address: fullAddress
        })
        .eq('id', params.id);

      if (error) throw error;

      showNotification('Laporan berhasil diperbarui!', 'success');
      setTimeout(() => router.push(`/laporan/${params.id}`), 2000);
    } catch (error: any) {
      showNotification('Gagal update: ' + error.message, 'error');
      setIsSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <>
      {notification && (
        <div className={`fixed top-24 right-6 z-9999 flex items-center p-4 rounded-xl shadow-lg border transition-all duration-300 animate-in slide-in-from-top-5 fade-in ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {notification.type === 'success' ? <CheckCircle2 className="mr-3" /> : <AlertTriangle className="mr-3" />}
          <p className="text-sm font-medium">{notification.message}</p>
          <button onClick={() => setNotification(null)} className="ml-4"><X size={16}/></button>
        </div>
      )}

      <Navbar />
      <div className="max-w-5xl mx-auto py-12 px-6 pt-32">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">Edit Laporan</h1>
        <form onSubmit={handleUpdate} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block mb-3 font-semibold">Pilih Lokasi Baru</label>
              <div className="h-70 rounded-xl overflow-hidden border">
                <MapComponent 
                  interactive={true} 
                  onLocationSelect={(lat, lng) => setLatLng({lat, lng})}
                  selectedLocation={latLng}
                  selectedCategory={category}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block mb-3 font-semibold">Kategori Masalah</label>
                <div className="relative">
                  <select 
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={category} 
                    onChange={e => setCategory(e.target.value)} 
                    required
                  >
                    <option value="" disabled>Pilih kategori...</option>
                    {isLoadingCategories ? <option disabled>Memuat...</option> : categories?.map((cat) => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-3 font-semibold">Judul</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-4 rounded-xl bg-gray-50" />
          </div>

          <div className="mb-8">
            <label className="block mb-3 font-semibold">Deskripsi</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border p-4 rounded-xl bg-gray-50 h-32" />
          </div>

          <div className="flex justify-end gap-4 border-t pt-6">
            <button type="button" onClick={() => router.back()} className="px-6 py-3 text-gray-600 font-medium">Batal</button>
            <button type="submit" disabled={isSaving} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-blue-700">
              {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />} Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}