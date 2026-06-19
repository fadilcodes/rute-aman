"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  Calendar, MapPin, ThumbsUp, MessageSquare, 
  AlertTriangle, CheckCircle2, Navigation, Send, User, Shield, Loader2, X, CheckCircle, Edit3
} from 'lucide-react';
import Navbar from '@/components/Navbar'; 
import Footer from '@/components/Footer'; 

const StaticMap = dynamic<{ lat: number; lng: number }>(
  () => import('@/components/StaticMap'), 
  { 
    ssr: false,
    loading: () => <div className="w-full h-40 bg-gray-100 animate-pulse rounded-t-xl" />
  }
);

export default function DetailLaporanPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authorStats, setAuthorStats] = useState({ totalReports: 0, totalLikes: 0 });
  
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isResolving, setIsResolving] = useState(false); // State loading buat tombol Selesai

  // STATE NOTIFIKASI DOM
  const [notification, setNotification] = useState<{show: boolean, type: 'success' | 'error', message: string} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(null), 3500); 
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };

    const fetchReportDetail = async () => {
      if (!params.id) return;
      
      try {
        const { data, error } = await supabase
          .from('reports')
          .select(`
            *,
            profiles:user_id ( full_name, avatar_url, reputation_points ),
            votes ( id, user_id ),
            comments (
              id, content, created_at,
              profiles ( full_name, avatar_url )
            )
          `)
          .eq('id', params.id)
          .single();

        if (error) throw error;
        
        if (data.comments) {
          data.comments.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        
        setReport(data);

        if (data.user_id && !data.is_anonymous) {
          const { data: authorData } = await supabase
            .from('reports')
            .select('id, votes(count)')
            .eq('user_id', data.user_id);

          if (authorData) {
            const totalReports = authorData.length;
            const totalLikes = authorData.reduce((acc, curr: any) => acc + (curr.votes?.[0]?.count || 0), 0);
            setAuthorStats({ totalReports, totalLikes });
          }
        }
      } catch (err) {
        console.error("Gagal memuat laporan:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
    fetchReportDetail();
  }, [params.id, supabase]);

  const hasLiked = currentUser && report?.votes?.some((v: any) => v.user_id === currentUser.id);

  const handleLoginRedirect = () => {
    router.push(`/login?next=/laporan/${params.id}`);
  };

  const handleLike = async () => {
    if (!currentUser) return handleLoginRedirect();
    if (isLiking) return;

    setIsLiking(true);
    try {
      if (hasLiked) {
        await supabase.from('votes').delete().match({ report_id: report.id, user_id: currentUser.id });
        setReport((prev: any) => ({
          ...prev,
          votes: prev.votes.filter((v: any) => v.user_id !== currentUser.id)
        }));
      } else {
        const { data, error } = await supabase.from('votes').insert({ report_id: report.id, user_id: currentUser.id }).select().single();
        if (error) throw error;
        setReport((prev: any) => ({ ...prev, votes: [...prev.votes, data] }));
      }
    } catch (error: any) {
      showNotification('Gagal memproses dukungan: ' + error.message, 'error');
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async () => {
    if (!currentUser) return handleLoginRedirect();
    if (!commentInput.trim()) return;

    setIsSubmittingComment(true);
    try {
      const { data: newComment, error } = await supabase
        .from('comments')
        .insert({ report_id: report.id, user_id: currentUser.id, content: commentInput.trim() })
        .select(`id, content, created_at, profiles ( full_name, avatar_url )`)
        .single();

      if (error) throw error;

      setReport((prev: any) => ({ ...prev, comments: [newComment, ...(prev.comments || [])] }));
      setCommentInput('');
      showNotification('Komentar berhasil dikirim!', 'success');
    } catch (error: any) {
      showNotification('Gagal mengirim komentar: ' + error.message, 'error');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // FUNGSI BARU: Tandai sebagai Ditindaklanjuti
  const handleResolveReport = async () => {
    if (!currentUser || currentUser.id !== report.user_id) return;
    
    setIsResolving(true);
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('reports')
        .update({ 
          status: 'Ditindaklanjuti', 
          resolved_at: now 
        })
        .eq('id', report.id);

      if (error) throw error;

      setReport((prev: any) => ({ ...prev, status: 'Ditindaklanjuti', resolved_at: now }));
      showNotification('Laporan berhasil ditandai selesai ditindaklanjuti!', 'success');
    } catch (error: any) {
      showNotification('Gagal memperbarui status: ' + error.message, 'error');
    } finally {
      setIsResolving(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
    return `${date.toLocaleDateString('id-ID', options)} • ${date.toLocaleTimeString('id-ID', timeOptions).replace('.', ':')}`;
  };

  const timeAgo = (dateString: string) => {
    const minutes = Math.round((new Date().getTime() - new Date(dateString).getTime()) / 60000);
    if (minutes < 60) return minutes === 0 ? 'Baru saja' : `${minutes} menit yang lalu`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} jam yang lalu`;
    return `${Math.round(hours / 24)} hari yang lalu`;
  };

  if (loading) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
      <span className="text-gray-500">Memuat detail laporan...</span>
    </div>;
  }

  if (!report) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Laporan tidak ditemukan.</div>;
  }

  // Logika 3 Fase Status
  const isDilaporkan = true; // Selalu true karena ini fase awal
  const isDiverifikasi = report.status?.toLowerCase() === 'terverifikasi' || report.status?.toLowerCase() === 'ditindaklanjuti';
  const isDitindaklanjuti = report.status?.toLowerCase() === 'ditindaklanjuti';
  
  const isOwner = currentUser?.id === report.user_id;
  const authorName = report.is_anonymous ? 'Pengguna Anonim' : (report.profiles?.full_name || 'Tanpa Nama');

  return (
    <div className="bg-[#F8FAFC] min-h-screen relative">
      {/* NOTIFIKASI TOAST DOM */}
      {notification && (
        <div className={`fixed top-24 right-6 z-[9999] flex items-center p-4 rounded-xl shadow-lg border transition-all duration-300 animate-in slide-in-from-top-5 fade-in ${
          notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-6 h-6 mr-3 text-green-600 shrink-0" /> : <AlertTriangle className="w-6 h-6 mr-3 text-red-600 shrink-0" />}
          <p className="text-sm font-medium pr-8">{notification.message}</p>
          <button onClick={() => setNotification(null)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 rounded-md transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <AlertTriangle size={14} />
              {report.category}
            </span>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
              isDitindaklanjuti ? 'bg-blue-600 text-white' : isDiverifikasi ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              <CheckCircle size={14} />
              {report.status || 'Dilaporkan'}
            </span>
          </div>
          
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">{report.title}</h1>
          
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar size={16} className="mr-2" />
            Dilaporkan pada {formatDate(report.created_at)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-gray-900 rounded-2xl overflow-hidden relative aspect-video shadow-sm">
              {report.image_url ? (
                <img src={report.image_url} alt={report.title} className="w-full h-full object-cover opacity-90" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">Tidak ada foto bukti</div>
              )}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-md">
                Foto Bukti
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Detail Kejadian</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
                {report.description}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-gray-500 border-t border-gray-100 pt-6 mb-6">
                <div className="flex items-center gap-2 font-medium">
                  <ThumbsUp size={18} className={hasLiked ? "text-blue-600" : ""} />
                  <span className="text-gray-900">{report.votes?.length || 0}</span> Mendukung
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <MessageSquare size={18} />
                  <span className="text-gray-900">{report.comments?.length || 0}</span> Komentar
                </div>
              </div>

              <button 
                onClick={handleLike}
                disabled={isLiking}
                className={`w-full font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                  hasLiked ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100' : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-70`}
              >
                {isLiking ? <Loader2 size={18} className="animate-spin" /> : <ThumbsUp size={18} className={hasLiked ? "fill-blue-200" : ""} />}
                {hasLiked ? 'Batalkan Dukungan' : 'Dukung Laporan'}
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Diskusi Komunitas</h3>
              
              <div className="space-y-6 mb-8 max-h-[500px] overflow-y-auto pr-2">
                {report.comments?.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">Belum ada diskusi, jadilah yang pertama berkomentar!</p>
                ) : (
                  report.comments?.map((comment: any) => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0 overflow-hidden border border-blue-200">
                        {comment.profiles?.avatar_url ? (
                          <img src={comment.profiles.avatar_url} alt="User" className="w-full h-full object-cover" />
                        ) : (
                          comment.profiles?.full_name?.charAt(0) || 'U'
                        )}
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-sm">{comment.profiles?.full_name || 'Pengguna RuteAman'}</span>
                          <span className="text-xs text-gray-400">{timeAgo(comment.created_at)}</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                  {currentUser ? (currentUser.email?.charAt(0).toUpperCase() || 'U') : '?'}
                </div>
                <div className="flex-1 relative">
                  <textarea 
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onFocus={() => { if (!currentUser) handleLoginRedirect(); }}
                    placeholder={currentUser ? "Tambahkan komentar..." : "Klik di sini untuk login & berkomentar..."}
                    disabled={isSubmittingComment}
                    className="w-full border border-gray-200 rounded-xl p-4 pr-32 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] text-sm resize-y bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button 
                    onClick={handleComment}
                    disabled={(currentUser && !commentInput.trim()) || isSubmittingComment}
                    className="absolute bottom-4 right-4 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmittingComment ? 'Mengirim...' : 'Kirim'} <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
           <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="h-40 bg-gray-200 relative group">
                {report.lat && report.lng ? (
                  <a href={`https://www.google.com/maps/search/?api=1&query=${report.lat},${report.lng}`} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative cursor-pointer">
                    <StaticMap lat={Number(report.lat)} lng={Number(report.lng)} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all z-[400] flex items-center justify-center">
                      <div className="bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
                        <Navigation size={14} /> Buka di Google Maps
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Lokasi tidak tersedia</div>
                )}
              </div>
              <div className="p-4 flex gap-3 text-sm text-gray-600 items-start">
                <Navigation className="text-blue-600 shrink-0 mt-0.5" size={18} />
                <p className="leading-snug">{report.full_address || report.location_name || 'Lokasi Peta'}</p>
              </div>
            </div>

            {/* STATUS LAPORAN & AKSI PELAPOR */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Status Laporan</h4>
              <div className="relative pl-6 border-l-2 border-gray-100 space-y-8">
                
                {/* 1. Fase Dilaporkan */}
                <div className="relative">
                  <div className="absolute -left-[35px] top-0.5 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center border-4 border-white shadow-sm">
                    <CheckCircle2 size={14} />
                  </div>
                  <h5 className="font-bold text-gray-900 text-sm">Dilaporkan</h5>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(report.created_at)}</p>
                </div>

                {/* 2. Fase Diverifikasi */}
                <div className="relative">
                  <div className={`absolute -left-[35px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${isDiverifikasi ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {isDiverifikasi ? <CheckCircle2 size={14} /> : <div className="w-2 h-2 rounded-full bg-gray-400"></div>}
                  </div>
                  <h5 className={`font-bold text-sm ${isDiverifikasi ? 'text-gray-900' : 'text-gray-500'}`}>Diverifikasi Admin</h5>
                  {isDiverifikasi ? (
                     <p className="text-xs text-gray-500 mt-1">{report.verified_at ? formatDate(report.verified_at) : 'Laporan valid'}</p>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1">Menunggu peninjauan admin</p>
                  )}
                </div>

                {/* 3. Fase Ditindaklanjuti */}
                <div className="relative">
                  <div className={`absolute -left-[35px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${isDitindaklanjuti ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {isDitindaklanjuti ? <CheckCircle2 size={14} /> : <div className="w-2 h-2 rounded-full bg-gray-400"></div>}
                  </div>
                  <h5 className={`font-bold text-sm ${isDitindaklanjuti ? 'text-gray-900' : 'text-gray-500'}`}>Ditindaklanjuti</h5>
                  {isDitindaklanjuti ? (
                    <p className="text-xs text-gray-500 mt-1">{report.resolved_at ? formatDate(report.resolved_at) : 'Selesai ditangani'}</p>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1">Menunggu proses perbaikan/otoritas</p>
                  )}
                </div>
              </div>

              {/* KONTROL KHUSUS PELAPOR (OWNER) */}
              {isOwner && (
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
                  <Link href={`/laporan/${report.id}/edit`} className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors text-sm">
                    <Edit3 size={16} /> Edit Laporan
                  </Link>

                  {/* Tombol Ditindaklanjuti hanya muncul jika status udah Terverifikasi, tapi belum Selesai */}
                  {report.status?.toLowerCase() === 'terverifikasi' && (
                    <button 
                      onClick={handleResolveReport}
                      disabled={isResolving}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm disabled:opacity-70"
                    >
                      {isResolving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                      Tandai Selesai Ditindaklanjuti
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
                  {report.is_anonymous || !report.profiles?.avatar_url ? (
                    <User size={24} className="text-gray-400" />
                  ) : (
                    <img src={report.profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{authorName}</h4>
                </div>
              </div>

              {!report.is_anonymous && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-blue-50/50 rounded-xl p-3 text-center border border-blue-50">
                    <p className="text-xs text-gray-500 mb-1">Total Laporan</p>
                    <p className="font-bold text-gray-900 text-lg">{authorStats.totalReports}</p>
                  </div>
                  <div className="bg-blue-50/50 rounded-xl p-3 text-center border border-blue-50">
                    <p className="text-xs text-gray-500 mb-1">Poin Reputasi</p>
                    <p className="font-bold text-blue-600 text-lg">{authorStats.totalLikes}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-4 mt-2">
                <span className="text-gray-500">Lapor Anonim:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[10px] tracking-wider ${report.is_anonymous ? 'bg-blue-100 text-blue-600' : 'bg-blue-100 text-blue-600'}`}>
                  {report.is_anonymous ? 'YA' : 'TIDAK'}
                </span>
              </div>
            </div>

            <div className="bg-[#0047D4] rounded-2xl p-6 text-white relative overflow-hidden shadow-md">
              <Shield className="absolute -right-4 -bottom-4 w-32 h-32 text-blue-500/30" />
              <div className="relative z-10">
                <h4 className="font-bold text-lg mb-2">Tetap Aman!</h4>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Selalu gunakan kunci ganda dan parkir di area yang terpantau CCTV atau memiliki petugas keamanan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}