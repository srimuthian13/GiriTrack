import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Navigation, Mountain, Clock, ArrowLeft, Play, Edit, Trash2, Shield, MessageSquare, Send, User, Heart } from 'lucide-react';
import { useTrail } from '../context/TrailContext';
import { useLanguage } from '../context/LanguageContext';
import MapViewer from '../components/MapViewer';
import ModalConfirm from '../components/ModalConfirm';
import DetailSkeleton from '../components/skeleton/DetailSkeleton';

export default function TrailDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTrailById, deleteTrail, addComment, isFavorite, toggleFavorite } = useTrail();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentUser, setCommentUser] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  const trail = getTrailById(id);

  // Simulated loading state effect on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!trail) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-[#2D1C1D] rounded-3xl border border-[#DBC4B6] dark:border-[#57595B]/40 text-center space-y-4 text-[#452829] dark:text-[#F3E8DF]">
        <h2 className="text-xl font-bold">
          Jalur Pendakian Tidak Ditemukan
        </h2>
        <p className="text-xs text-[#57595B] dark:text-[#E8D1C5]">
          Jalur pendakian yang Anda cari mungkin telah dihapus atau URL tidak valid.
        </p>
        <Link
          to="/trails"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#452829] text-[#F3E8DF] dark:bg-[#E8D1C5] dark:text-[#452829] text-xs font-bold shadow-md transition-transform duration-150 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Jalur</span>
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(trail.id);

  const handleDeleteConfirm = () => {
    deleteTrail(trail.id);
    setDeleteModalOpen(false);
    navigate('/trails');
  };

  const handleStartTracking = () => {
    navigate(`/tracker?trailId=${trail.id}`);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(trail.id, {
      user: commentUser.trim() || 'Pendaki Giri',
      text: commentText.trim(),
    });

    setCommentText('');
    setCommentUser('');
    setCommentSuccess(true);

    setTimeout(() => setCommentSuccess(false), 3000);
  };

  const commentsList = Array.isArray(trail.comments) ? trail.comments : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 pb-12 text-[#452829] dark:text-[#F3E8DF] transition-colors duration-300 ease-in-out">
      
      {/* Back Button & Top Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-[#452829] dark:text-[#E8D1C5] hover:underline cursor-pointer transition-transform duration-150 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('btn.back')}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Favorite Love Button */}
          <button
            onClick={() => toggleFavorite(trail.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm ${
              favorited
                ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
                : 'bg-[#EFE4DC] text-[#452829] border-[#DBC4B6] dark:bg-[#3F2728] dark:text-[#E8D1C5] dark:border-[#57595B]/40 hover:bg-rose-100 hover:text-rose-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{favorited ? 'Jalur Disukai' : 'Suka Jalur Ini'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-white/60 dark:bg-black/40 font-mono">
              {trail.likes_count || 0}
            </span>
          </button>

          <button
            onClick={() => navigate(`/manage?editId=${trail.id}`)}
            className="p-2 rounded-xl bg-[#EFE4DC] text-[#452829] dark:bg-[#3F2728] dark:text-[#E8D1C5] hover:bg-[#DBC4B6] transition-all duration-200 active:scale-95 cursor-pointer text-xs font-semibold flex items-center gap-1.5"
          >
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">{t('btn.edit')}</span>
          </button>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="p-2 rounded-xl bg-[#EFE4DC] text-rose-700 dark:bg-[#3F2728] dark:text-rose-300 hover:bg-rose-100 transition-all duration-200 active:scale-95 cursor-pointer text-xs font-semibold flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t('btn.delete')}</span>
          </button>
        </div>
      </div>

      {/* Hero Banner Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#DBC4B6] dark:border-[#57595B]/40 h-64 sm:h-96">
        <img
          src={trail.image}
          alt={trail.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#E8D1C5] text-[#452829] border border-[#E8D1C5]/40 shadow-sm">
              Tingkat {trail.difficulty}
            </span>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-black/60 text-[#E8D1C5] backdrop-blur-md flex items-center gap-1">
              <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{trail.likes_count || 0} Suka</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {trail.name}
          </h1>

          <div className="flex items-center gap-2 text-sm text-stone-200 font-medium">
            <MapPin className="w-4 h-4 text-[#E8D1C5] shrink-0" />
            <span>{trail.location}</span>
          </div>
        </div>
      </div>

      {/* Key Technical Specifications Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#2D1C1D] border border-[#DBC4B6] dark:border-[#57595B]/40 shadow-sm text-center transition-colors duration-300">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#57595B] dark:text-[#E8D1C5] font-medium mb-1">
            <Navigation className="w-4 h-4 text-[#452829] dark:text-[#E8D1C5]" />
            <span>Jarak Pendakian</span>
          </div>
          <p className="text-xl font-black text-[#452829] dark:text-[#F3E8DF]">
            {trail.distance_km} <span className="text-xs font-normal">km</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#2D1C1D] border border-[#DBC4B6] dark:border-[#57595B]/40 shadow-sm text-center transition-colors duration-300">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#57595B] dark:text-[#E8D1C5] font-medium mb-1">
            <Mountain className="w-4 h-4 text-[#452829] dark:text-[#E8D1C5]" />
            <span>Elevasi Puncak</span>
          </div>
          <p className="text-xl font-black text-[#452829] dark:text-[#F3E8DF]">
            {trail.elevation_m} <span className="text-xs font-normal">mdpl</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#2D1C1D] border border-[#DBC4B6] dark:border-[#57595B]/40 shadow-sm text-center transition-colors duration-300">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#57595B] dark:text-[#E8D1C5] font-medium mb-1">
            <Clock className="w-4 h-4 text-[#452829] dark:text-[#E8D1C5]" />
            <span>Estimasi Waktu</span>
          </div>
          <p className="text-xl font-black text-[#452829] dark:text-[#F3E8DF]">
            {trail.estimated_time || '6-7 Jam'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#2D1C1D] border border-[#DBC4B6] dark:border-[#57595B]/40 shadow-sm text-center transition-colors duration-300">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#57595B] dark:text-[#E8D1C5] font-medium mb-1">
            <Shield className="w-4 h-4 text-[#452829] dark:text-[#E8D1C5]" />
            <span>Kesulitan</span>
          </div>
          <p className="text-xl font-black text-[#452829] dark:text-[#F3E8DF]">
            {trail.difficulty}
          </p>
        </div>
      </div>

      {/* Track GPS Action Banner */}
      <div className="p-6 rounded-3xl bg-[#452829] text-[#F3E8DF] dark:bg-[#2D1C1D] border border-[#DBC4B6]/40 dark:border-[#57595B]/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300">
        <div>
          <h3 className="text-lg font-bold text-[#E8D1C5]">Siap Muncak di Jalur Ini?</h3>
          <p className="text-xs text-[#F3E8DF]/80 mt-1">
            Gunakan perekam GPS real-time GiriTrack saat Anda melakukan pendakian di jalur ini.
          </p>
        </div>
        <button
          onClick={handleStartTracking}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#E8D1C5] text-[#452829] hover:bg-white font-bold text-xs transition-all duration-200 active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Mulai Pelacak GPS Jalur Ini</span>
        </button>
      </div>

      {/* Description Section */}
      <div className="bg-white dark:bg-[#2D1C1D] rounded-3xl p-6 sm:p-8 border border-[#DBC4B6] dark:border-[#57595B]/40 shadow-sm space-y-4 transition-colors duration-300">
        <h2 className="text-xl font-bold text-[#452829] dark:text-[#F3E8DF]">
          Deskripsi & Informasi Jalur
        </h2>
        <p className="text-sm text-[#452829]/90 dark:text-[#F3E8DF]/90 leading-relaxed whitespace-pre-line">
          {trail.description}
        </p>
      </div>

      {/* OpenTopoMap Route Section */}
      <div className="bg-white dark:bg-[#2D1C1D] rounded-3xl p-6 sm:p-8 border border-[#DBC4B6] dark:border-[#57595B]/40 shadow-sm space-y-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#452829] dark:text-[#F3E8DF] flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#452829] dark:text-[#E8D1C5]" />
            <span>Peta Topografi Jalur Pendakian (OpenTopoMap)</span>
          </h2>
          <span className="text-xs text-[#57595B] dark:text-[#E8D1C5]">
            {trail.coordinates?.length || 0} Titik Waypoint
          </span>
        </div>

        <MapViewer
          coordinates={trail.coordinates}
          trailName={trail.name}
        />
      </div>

      {/* Comments & Review Section */}
      <div className="bg-white dark:bg-[#2D1C1D] rounded-3xl p-6 sm:p-8 border border-[#DBC4B6] dark:border-[#57595B]/40 shadow-sm space-y-6 transition-colors duration-300">
        <div className="flex items-center justify-between border-b border-[#DBC4B6]/60 dark:border-[#57595B]/40 pb-4">
          <h2 className="text-xl font-bold text-[#452829] dark:text-[#F3E8DF] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#452829] dark:text-[#E8D1C5]" />
            <span>Komentar & Ulasan Pendaki ({commentsList.length})</span>
          </h2>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="space-y-4 bg-[#EFE4DC]/60 dark:bg-[#3F2728]/50 p-5 rounded-2xl border border-[#DBC4B6]/50 dark:border-[#57595B]/30 transition-colors duration-300">
          <h3 className="text-sm font-bold text-[#452829] dark:text-[#F3E8DF]">
            Tulis Ulasan / Pengalaman Pendakian
          </h3>

          {commentSuccess && (
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 text-xs font-bold">
              Ulasan Anda berhasil ditambahkan!
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#57595B] dark:text-[#E8D1C5] mb-1">
                Nama Pendaki / Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#57595B] dark:text-[#E8D1C5]" />
                <input
                  type="text"
                  value={commentUser}
                  onChange={(e) => setCommentUser(e.target.value)}
                  placeholder="Contoh: Rangga Explorer"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#DBC4B6] dark:border-[#57595B]/40 bg-white dark:bg-[#2D1C1D] text-xs text-[#452829] dark:text-[#F3E8DF] focus:outline-none focus:ring-2 focus:ring-[#452829] transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#57595B] dark:text-[#E8D1C5] mb-1">
                Ulasan & Catatan Kondisi Jalur *
              </label>
              <textarea
                rows={3}
                required
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Bagikan kondisi jalur, sumber air, atau pengalaman mendaki Anda..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#DBC4B6] dark:border-[#57595B]/40 bg-white dark:bg-[#2D1C1D] text-xs text-[#452829] dark:text-[#F3E8DF] focus:outline-none focus:ring-2 focus:ring-[#452829] transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#452829] text-[#F3E8DF] hover:bg-[#341e1f] dark:bg-[#E8D1C5] dark:text-[#452829] font-bold text-xs cursor-pointer transition-all duration-200 active:scale-95 shadow-md flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Kirim Ulasan</span>
          </button>
        </form>

        {/* Comments List */}
        {commentsList.length > 0 ? (
          <div className="space-y-3">
            {commentsList.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-[#EFE4DC]/40 dark:bg-[#3F2728]/30 border border-[#DBC4B6]/40 dark:border-[#57595B]/30 space-y-1.5 transition-colors duration-300"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#452829] dark:text-[#F3E8DF] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#452829] dark:text-[#E8D1C5]" />
                    <span>{c.user}</span>
                  </span>
                  <span className="text-[11px] text-[#57595B] dark:text-[#E8D1C5] font-mono">
                    {c.date}
                  </span>
                </div>
                <p className="text-xs text-[#452829]/90 dark:text-[#F3E8DF]/90 leading-relaxed pl-5">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-[#57595B] dark:text-[#E8D1C5] bg-[#EFE4DC]/20 dark:bg-[#3F2728]/20 rounded-2xl border border-dashed border-[#DBC4B6]">
            Belum ada komentar untuk jalur ini. Jadilah yang pertama memberikan ulasan!
          </div>
        )}
      </div>

      {/* Modal Confirm Delete */}
      <ModalConfirm
        isOpen={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

    </div>
  );
}
