"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  PenSquare, Plus, ClipboardList, Heart, CheckCircle, 
  MapPin, ChevronLeft, ChevronRight, Loader2, Clock3, 
  Trash2, X, UploadCloud, MessageSquare, AlertTriangle, CheckCircle2 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export default function ProfilPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ laporanDikirim: 0, totalLike: 0, laporanSelesai: 0 });
  const [history, setHistory] = useState<any[]>([]);

  // State buat Modal Edit Profil
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // STATE BARU: Notifikasi Toast & Modal Konfirmasi Hapus
  const [notification, setNotification] = useState<{show: boolean, type: 'success' | 'error', message: string} | null>(null);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);

  // FUNGSI BARU: Menampilkan notifikasi
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(null), 3500); // Hilang dalam 3.5 detik
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push('/login');
          return;
        }
        setCurrentUser(user);

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setProfile(profileData);

        const { data: reportsData } = await supabase
          .from('reports')
          .select('*, votes(count), comments(count)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (reportsData) {
          const laporanDikirim = reportsData.length;
          const laporanSelesai = reportsData.filter((r: any) => 
            r.status?.toLowerCase() === 'terverifikasi' || r.status?.toLowerCase() === 'selesai'
          ).length;

          const totalLike = reportsData.reduce((acc, curr: any) => acc + (curr.votes?.[0]?.count || 0), 0);

          setStats({ laporanDikirim, totalLike, laporanSelesai });
          
          const formattedHistory = reportsData.map((item: any) => ({
            ...item,
            likesCount: item.votes?.[0]?.count || 0,
            commentsCount: item.comments?.[0]?.count || 0,
          }));
          
          setHistory(formattedHistory);
        }
      } catch (error) {
        console.error("Gagal memuat profil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router, supabase]);

  const openEditModal = () => {
    setEditName(profile?.full_name || '');
    setEditBio(profile?.bio || '');
    setEditAvatar(null);
    setPreviewAvatar(profile?.avatar_url || null);
    setIsEditing(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditAvatar(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let newAvatarUrl = profile.avatar_url;

      if (editAvatar) {
        const fileExt = editAvatar.name.split('.').pop();
        const fileName = `${currentUser.id}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(`public/${fileName}`, editAvatar);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(`public/${fileName}`);
          
        newAvatarUrl = publicUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editName,
          bio: editBio,
          avatar_url: newAvatarUrl
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      setProfile({ ...profile, full_name: editName, bio: editBio, avatar_url: newAvatarUrl });
      setIsEditing(false);
      showNotification('Profil berhasil diperbarui!', 'success');
    } catch (error: any) {
      showNotification('Gagal update profil: ' + error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Panggil Modal Konfirmasi, Bukan Hapus Langsung
  const confirmDeleteReport = (e: React.MouseEvent, reportId: string) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    setReportToDelete(reportId); // Set ID laporan yang mau dihapus, memicu modal terbuka
  };

  // Eksekusi Hapus Laporan Setelah User Klik "Ya"
  const executeDeleteReport = async () => {
    if (!reportToDelete) return;

    try {
      const { error } = await supabase.from('reports').delete().eq('id', reportToDelete);
      if (error) throw error;

      setHistory(prev => prev.filter(item => item.id !== reportToDelete));
      setStats(prev => ({ ...prev, laporanDikirim: prev.laporanDikirim > 0 ? prev.laporanDikirim - 1 : 0 }));
      
      showNotification('Laporan berhasil dihapus.', 'success');
    } catch (error: any) {
      showNotification('Gagal menghapus laporan: ' + error.message, 'error');
    } finally {
      setReportToDelete(null); // Tutup modal konfirmasi
    }
  };

  const getCategoryStyle = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'kriminalitas': return 'bg-red-600 text-white';
      case 'infrastruktur': return 'bg-emerald-600 text-white';
      case 'penerangan': return 'bg-yellow-500 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <span className="text-gray-500">Memuat profil...</span>
      </div>
    );
  }

  if (!profile) return null;

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
      <div className="min-h-screen bg-gray-50 pb-20 relative pt-24">
        <div className="max-w-5xl mx-auto pt-10 px-6">
          
          {/* Header Profil */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-[100px] -z-10 opacity-50"></div>
            
            <div className="relative shrink-0">
              <div className="w-32 h-32 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden text-4xl font-bold">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profile.full_name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <button 
                onClick={openEditModal}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-full border-2 border-white hover:bg-blue-700 transition shadow-sm" 
                title="Edit Profil"
              >
                <PenSquare size={16} />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.full_name || 'Pengguna RuteAman'}</h1>
              <p className="text-gray-600 mb-4 max-w-lg leading-relaxed text-sm">
                {profile.bio || 'Belum ada bio. Klik tombol edit untuk menambahkan keterangan tentang diri Anda.'}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {profile.role || 'KONTRIBUTOR'}
                </span>
                <span className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                  <MapPin size={14} className="text-gray-400" /> Pengguna Aktif
                </span>
              </div>
            </div>

            <div className="mt-4 md:mt-0 shrink-0">
              <Link href="/lapor" className="bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition flex items-center gap-2 shadow-sm">
                <Plus size={20} /> Buat Laporan
              </Link>
            </div>
          </div>

          {/* Kartu Statistik */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600 mb-4">
                <ClipboardList size={24} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.laporanDikirim}</h3>
              <p className="text-gray-500 text-sm font-medium">Laporan Dikirim</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform">
              <div className="bg-red-50 p-3 rounded-xl text-red-500 mb-4">
                <Heart size={24} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalLike}</h3>
              <p className="text-gray-500 text-sm font-medium">Poin Reputasi</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform">
              <div className="bg-green-50 p-3 rounded-xl text-green-600 mb-4">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.laporanSelesai}</h3>
              <p className="text-gray-500 text-sm font-medium">Laporan Selesai</p>
            </div>
          </div>

          {/* Area Riwayat Laporan */}
          <div className="mt-16">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Riwayat Laporan Anda</h2>
              <div className="flex gap-3 w-full sm:w-auto">
                <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2 focus:outline-none flex-1 sm:flex-none">
                  <option>Terbaru</option>
                  <option>Terpopuler</option>
                </select>
                <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2 focus:outline-none flex-1 sm:flex-none">
                  <option>Semua Kategori</option>
                  <option>Terverifikasi</option>
                  <option>Menunggu</option>
                </select>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Belum ada laporan</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">Anda belum pernah membuat laporan. Mulai kontribusi Anda untuk lingkungan yang lebih aman.</p>
                <Link href="/lapor" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 transition">
                  <Plus size={18} /> Buat Laporan Pertama
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history.map((item) => (
                  <Link href={`/laporan/${item.id}`} key={item.id} className="block group">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300 flex flex-col h-full relative">
                      
                      {/* Tombol Hapus memanggil modal */}
                      <button 
                        onClick={(e) => confirmDeleteReport(e, item.id)}
                        className="absolute top-4 left-4 z-10 bg-white/90 hover:bg-red-50 text-gray-500 hover:text-red-600 p-2 rounded-full shadow-sm backdrop-blur-sm transition-colors"
                        title="Hapus Laporan"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="h-48 bg-gray-200 relative overflow-hidden">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">Tidak ada foto</div>
                        )}
                        <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${getCategoryStyle(item.category)}`}>
                          {item.category || 'LAINNYA'}
                        </div>
                      </div>
                      
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2 gap-4">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">{item.title}</h3>
                          <span className="text-xs text-gray-400 shrink-0 flex items-center gap-1 mt-1">
                            <Clock3 size={12} />
                            {item.created_at ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: localeId }) : ''}
                          </span>
                        </div>
                        
                        <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">
                          {item.description}
                        </p>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
                          <div className="flex gap-4 text-gray-500 text-sm font-medium">
                            <span className="flex items-center gap-1.5 group-hover:text-blue-600 transition-colors">
                              <Heart size={16}/> {item.likesCount}
                            </span>
                            <span className="flex items-center gap-1.5 group-hover:text-blue-600 transition-colors">
                              <MessageSquare size={16} /> {item.commentsCount}
                            </span>
                          </div>
                          
                          <span className={`text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 ${
                            item.status?.toLowerCase() === 'terverifikasi' || item.status?.toLowerCase() === 'selesai'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {item.status?.toLowerCase() === 'terverifikasi' || item.status?.toLowerCase() === 'selesai' ? <CheckCircle size={14}/> : null}
                            {item.status || 'Menunggu'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL KONFIRMASI HAPUS */}
      {reportToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Hapus Laporan?</h2>
            <p className="text-gray-500 text-sm mb-8">
              Yakin ingin menghapus laporan ini? Data yang dihapus tidak bisa dikembalikan lagi.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setReportToDelete(null)}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
              >
                Batal
              </button>
              <button 
                onClick={executeDeleteReport}
                className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT PROFIL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsEditing(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profil</h2>
            
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Edit Foto */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-md overflow-hidden relative group">
                  {previewAvatar ? (
                    <img src={previewAvatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-2xl">
                      {editName.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  {/* Overlay Hover buat Ganti Foto */}
                  <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <UploadCloud className="text-white w-8 h-8" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/jpeg, image/png, image/webp" 
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <span className="text-xs text-gray-500">Klik foto untuk mengganti</span>
              </div>

              {/* Edit Nama */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Tampilan</label>
                <input 
                  type="text" 
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>

              {/* Edit Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio Singkat</label>
                <textarea 
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 min-h-[100px] resize-y"
                  placeholder="Ceritakan sedikit tentang komitmen Anda..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isSaving ? <><Loader2 size={18} className="animate-spin" /> Menyimpan...</> : 'Simpan Perubahan'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}