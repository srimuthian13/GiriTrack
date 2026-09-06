import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  MapPin,
  Mountain,
  Star,
  Heart,
  Eye,
  Edit,
  Users,
  Compass,
  Layers,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  Search,
  Check,
  Activity,
  Award,
  Clock
} from 'lucide-react';
import { useTrail } from '../context/TrailContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ModalConfirm from '../components/ModalConfirm';

export default function AdminDashboard() {
  const {
    trails,
    verifyTrail,
    deleteTrail,
    locations,
    addLocation,
    deleteLocation,
    difficultyLevels,
    addDifficultyLevel,
    deleteDifficultyLevel,
    users,
    deleteReview
  } = useTrail();

  const { isAdmin, user, loginAsDemoAdmin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState('popular'); // 'popular' | 'pending' | 'master' | 'moderation'

  // Master Data Inputs
  const [newLocationName, setNewLocationName] = useState('');
  const [newDiffLabel, setNewDiffLabel] = useState('');
  const [newDiffBadgeColor, setNewDiffBadgeColor] = useState('emerald');

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  // Search Filter for moderation
  const [reviewSearch, setReviewSearch] = useState('');

  // 1. Check Admin Access
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white dark:bg-[#1C2129] rounded-3xl border border-[#E1E5EA] dark:border-[#2C3440] text-center space-y-5 text-[#2B3542] dark:text-[#FAF3F3] shadow-xl">
        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black">Akses Khusus Admin</h2>
        <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] leading-relaxed">
          Halaman Panel Dashboard Admin dan Verifikasi Jalur hanya dapat diakses oleh akun dengan role <strong>Admin GiriTrack</strong>.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              loginAsDemoAdmin();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#DA7F8F] text-white hover:bg-[#c96c7d] text-xs font-bold shadow-md cursor-pointer transition active:scale-95"
          >
            Masuk Sebagai Demo Admin
          </button>
          <Link
            to="/trails"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#E1E5EA] hover:bg-[#A7BBC7]/30 dark:bg-[#252C36] text-xs font-bold transition"
          >
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  // Aggregate Data
  const pendingTrails = trails.filter((t) => t.status === 'pending');
  const verifiedTrails = trails.filter((t) => t.status !== 'pending');

  // Popular Trails (Sorted by Likes & Rating)
  const popularTrails = [...trails].sort((a, b) => {
    const scoreA = (Number(a.likes_count) || 0) * 2 + (Number(a.ratingAvg) || 0) * 10;
    const scoreB = (Number(b.likes_count) || 0) * 2 + (Number(b.ratingAvg) || 0) * 10;
    return scoreB - scoreA;
  });

  // Extract all reviews across all trails for moderation
  const allReviews = trails.flatMap((tr) =>
    (Array.isArray(tr.reviews) ? tr.reviews : []).map((rev) => ({
      ...rev,
      trailId: tr.id,
      trailName: tr.name,
    }))
  ).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  const filteredReviews = allReviews.filter((r) =>
    (r.userName || '').toLowerCase().includes(reviewSearch.toLowerCase()) ||
    (r.comment || '').toLowerCase().includes(reviewSearch.toLowerCase()) ||
    (r.trailName || '').toLowerCase().includes(reviewSearch.toLowerCase())
  );

  // Handlers for Master Data
  const handleAddLocation = (e) => {
    e.preventDefault();
    if (!newLocationName.trim()) return;
    addLocation({ name: newLocationName.trim() });
    setNewLocationName('');
  };

  const handleAddDifficulty = (e) => {
    e.preventDefault();
    if (!newDiffLabel.trim()) return;

    let badgeClass = 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300 border-stone-300';
    if (newDiffBadgeColor === 'emerald') {
      badgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
    } else if (newDiffBadgeColor === 'amber') {
      badgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
    } else if (newDiffBadgeColor === 'orange') {
      badgeClass = 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-300';
    } else if (newDiffBadgeColor === 'rose') {
      badgeClass = 'bg-[#DA7F8F]/25 text-[#C96C7D] dark:bg-[#DA7F8F]/30 dark:text-[#DA7F8F] border-[#DA7F8F]/50';
    }

    addDifficultyLevel({ label: newDiffLabel.trim(), colorBadge: badgeClass });
    setNewDiffLabel('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 pb-16 text-[#2B3542] dark:text-[#FAF3F3]">
      
      {/* Header Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E1E5EA] dark:border-[#2C3440] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#DA7F8F] text-white shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-[#2B3542] dark:text-[#FAF3F3] tracking-tight">
                  Panel Admin & Verifikasi
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#DA7F8F]/20 text-[#DA7F8F] border border-[#DA7F8F]/40">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-0.5">
                Kelola master wilayah, tingkat kesulitan, moderasi ulasan, dan verifikasi rute pendakian
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            to="/manage"
            className="px-4 py-2 rounded-xl bg-[#DA7F8F] text-white hover:bg-[#c96c7d] text-xs font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Jalur Baru</span>
          </Link>
        </div>
      </div>

      {/* Top 4 Key Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B7C8C] dark:text-[#A7BBC7]">Jalur Terverifikasi</p>
            <p className="text-2xl font-black text-[#2B3542] dark:text-[#FAF3F3]">{verifiedTrails.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B7C8C] dark:text-[#A7BBC7]">Menunggu Verifikasi</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-black text-[#2B3542] dark:text-[#FAF3F3]">{pendingTrails.length}</p>
              {pendingTrails.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DA7F8F] text-white animate-pulse">
                  Butuh Review
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#A7BBC7]/20 text-[#3D5A70] dark:text-[#A7BBC7] shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B7C8C] dark:text-[#A7BBC7]">Total Ulasan</p>
            <p className="text-2xl font-black text-[#2B3542] dark:text-[#FAF3F3]">{allReviews.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#DA7F8F]/20 text-[#DA7F8F] shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B7C8C] dark:text-[#A7BBC7]">Akun Pengguna</p>
            <p className="text-2xl font-black text-[#2B3542] dark:text-[#FAF3F3]">{users.length}</p>
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E1E5EA] dark:border-[#2C3440]">
        
        <button
          type="button"
          onClick={() => setActiveTab('popular')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'popular'
              ? 'bg-[#DA7F8F] text-white shadow-md'
              : 'bg-white dark:bg-[#1C2129] text-[#2B3542] dark:text-[#FAF3F3] border border-[#E1E5EA] dark:border-[#2C3440] hover:bg-[#FAF3F3]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Statistik Jalur Populer</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'pending'
              ? 'bg-[#DA7F8F] text-white shadow-md'
              : 'bg-white dark:bg-[#1C2129] text-[#2B3542] dark:text-[#FAF3F3] border border-[#E1E5EA] dark:border-[#2C3440] hover:bg-[#FAF3F3]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Verifikasi Jalur ({pendingTrails.length})</span>
          {pendingTrails.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#DA7F8F]"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('master')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'master'
              ? 'bg-[#DA7F8F] text-white shadow-md'
              : 'bg-white dark:bg-[#1C2129] text-[#2B3542] dark:text-[#FAF3F3] border border-[#E1E5EA] dark:border-[#2C3440] hover:bg-[#FAF3F3]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Manajemen Master Data</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'moderation'
              ? 'bg-[#DA7F8F] text-white shadow-md'
              : 'bg-white dark:bg-[#1C2129] text-[#2B3542] dark:text-[#FAF3F3] border border-[#E1E5EA] dark:border-[#2C3440] hover:bg-[#FAF3F3]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Moderasi Ulasan & Akun</span>
        </button>

      </div>

      {/* ========================================================= */}
      {/* TAB 1: STATISTIK JALUR POPULER */}
      {/* ========================================================= */}
      {activeTab === 'popular' && (
        <div className="space-y-6">
          <div className="bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E1E5EA] dark:border-[#2C3440] pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#DA7F8F]" />
                  <span>Peringkat & Popularitas Jalur Pendakian</span>
                </h2>
                <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-0.5">
                  Diurutkan berdasarkan skor interaksi komunitas (jumlah favorit dan rata-rata rating review)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E1E5EA] dark:border-[#2C3440] text-[#6B7C8C] dark:text-[#A7BBC7]">
                    <th className="py-3 px-3">Rank</th>
                    <th className="py-3 px-3">Nama Jalur & Gunung</th>
                    <th className="py-3 px-3">Lokasi / Wilayah</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Favorit</th>
                    <th className="py-3 px-3">Rating Ulasan</th>
                    <th className="py-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E5EA] dark:divide-[#2C3440]">
                  {popularTrails.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-[#FAF3F3] dark:hover:bg-[#252C36] transition">
                      <td className="py-3 px-3 font-mono font-bold">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] ${
                          idx === 0
                            ? 'bg-amber-400 text-amber-950 font-black'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-900 font-bold'
                            : idx === 2
                            ? 'bg-amber-700 text-amber-100 font-bold'
                            : 'text-[#6B7C8C] dark:text-[#A7BBC7]'
                        }`}>
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-[#2B3542] dark:text-[#FAF3F3]">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <p className="font-bold text-xs">{item.name}</p>
                            <p className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7] font-normal">
                              {item.distance_km} km • {item.elevation_m} mdpl
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#6B7C8C] dark:text-[#A7BBC7]">
                        {item.location}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'pending'
                            ? 'bg-[#DA7F8F]/20 text-[#DA7F8F]'
                            : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {item.status === 'pending' ? 'Pending' : 'Verified'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-[#DA7F8F]">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 fill-[#DA7F8F]" />
                          <span>{item.likes_count || 0}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-amber-600 dark:text-amber-400">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{Number(item.ratingAvg) > 0 ? Number(item.ratingAvg).toFixed(1) : '-'}</span>
                          <span className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7] font-normal">
                            ({item.reviews?.length || 0})
                          </span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-1.5">
                        <button
                          onClick={() => navigate(`/trails/${item.id}`)}
                          className="p-1.5 rounded-xl bg-[#E1E5EA] hover:bg-[#A7BBC7]/30 dark:bg-[#252C36] text-xs transition cursor-pointer"
                          title="Lihat Detail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigate(`/manage?editId=${item.id}`)}
                          className="p-1.5 rounded-xl bg-[#E1E5EA] hover:bg-[#A7BBC7]/30 dark:bg-[#252C36] text-xs transition cursor-pointer"
                          title="Edit Jalur"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: VERIFIKASI JALUR (PENDING APPROVAL QUEUE) */}
      {/* ========================================================= */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          <div className="bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E1E5EA] dark:border-[#2C3440] pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#DA7F8F]" />
                  <span>Antrean Verifikasi Jalur Baru ({pendingTrails.length})</span>
                </h2>
                <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-0.5">
                  Jalur yang dibuat oleh pengguna publik memerlukan persetujuan admin sebelum tampil di katalog utama.
                </p>
              </div>
            </div>

            {pendingTrails.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingTrails.map((trail) => (
                  <div
                    key={trail.id}
                    className="p-5 rounded-3xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] flex flex-col justify-between space-y-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={trail.image}
                        alt={trail.name}
                        className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-sm"
                      />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DA7F8F]/20 text-[#DA7F8F]">
                            Menunggu Verifikasi
                          </span>
                          <span className="text-[10px] font-mono text-[#6B7C8C] dark:text-[#A7BBC7]">
                            {trail.difficulty}
                          </span>
                        </div>
                        <h3 className="text-sm font-black text-[#2B3542] dark:text-[#FAF3F3]">
                          {trail.name}
                        </h3>
                        <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#DA7F8F]" />
                          <span>{trail.location}</span>
                        </p>
                        <p className="text-[11px] text-[#6B7C8C] dark:text-[#A7BBC7]">
                          {trail.distance_km} km • {trail.elevation_m} mdpl • {trail.coordinates?.length || 0} Waypoints
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] line-clamp-2 italic">
                      "{trail.description}"
                    </p>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E1E5EA] dark:border-[#2C3440]">
                      <Link
                        to={`/trails/${trail.id}`}
                        className="text-xs font-bold text-[#DA7F8F] hover:underline"
                      >
                        Pratinjau Rute Penuh →
                      </Link>

                      <div className="flex items-center gap-2">
                        {/* Tolak / Hapus */}
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: 'Tolak & Hapus Jalur',
                              message: `Apakah Anda yakin ingin menolak dan menghapus pengajuan jalur "${trail.name}"?`,
                              onConfirm: () => {
                                deleteTrail(trail.id);
                                setConfirmModal({ isOpen: false });
                              },
                            });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-xs font-bold transition cursor-pointer"
                        >
                          Tolak
                        </button>

                        {/* Setujui / Verifikasi */}
                        <button
                          type="button"
                          onClick={() => verifyTrail(trail.id)}
                          className="px-4 py-1.5 rounded-xl bg-[#DA7F8F] hover:bg-[#c96c7d] text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Setujui & Terbitkan</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-[#6B7C8C] dark:text-[#A7BBC7] bg-[#FAF3F3]/50 dark:bg-[#252C36]/50 rounded-2xl border border-dashed border-[#E1E5EA] dark:border-[#2C3440] space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="font-bold">Semua jalur sudah diverifikasi!</p>
                <p>Tidak ada jalur pendakian yang menunggu antrean persetujuan.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: MANAJEMEN MASTER DATA (WILAYAH & KESULITAN) */}
      {/* ========================================================= */}
      {activeTab === 'master' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Master 1: Lokasi / Wilayah */}
          <div className="bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#E1E5EA] dark:border-[#2C3440] pb-3">
              <h2 className="text-base font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#DA7F8F]" />
                <span>Master Data Wilayah / Lokasi ({locations.length})</span>
              </h2>
            </div>

            {/* Add Location Form */}
            <form onSubmit={handleAddLocation} className="flex gap-2">
              <input
                type="text"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                placeholder="Tambah nama wilayah (cth: Sumatera Barat)..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-white dark:bg-[#1C2129] text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#DA7F8F] text-white hover:bg-[#c96c7d] text-xs font-bold transition shrink-0 cursor-pointer"
              >
                Tambah
              </button>
            </form>

            {/* List of Locations */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {locations.map((loc) => {
                const trailCount = trails.filter(
                  (t) => t.locationId === loc.id || (t.location && t.location.includes(loc.name))
                ).length;

                return (
                  <div
                    key={loc.id}
                    className="p-3 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{loc.name}</span>
                      <span className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7] font-mono">
                        ({trailCount} Jalur)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteLocation(loc.id)}
                      className="p-1 text-rose-600 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                      title="Hapus Wilayah"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Master 2: Tingkat Kesulitan */}
          <div className="bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#E1E5EA] dark:border-[#2C3440] pb-3">
              <h2 className="text-base font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
                <Mountain className="w-4 h-4 text-[#DA7F8F]" />
                <span>Master Tingkat Kesulitan ({difficultyLevels.length})</span>
              </h2>
            </div>

            {/* Add Difficulty Form */}
            <form onSubmit={handleAddDifficulty} className="space-y-2.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDiffLabel}
                  onChange={(e) => setNewDiffLabel(e.target.value)}
                  placeholder="Nama tingkat kesulitan (cth: Ekstra Terjal)..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-white dark:bg-[#1C2129] text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40"
                />
                <select
                  value={newDiffBadgeColor}
                  onChange={(e) => setNewDiffBadgeColor(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-white dark:bg-[#1C2129] text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40"
                >
                  <option value="emerald">Hijau (Mudah)</option>
                  <option value="amber">Kuning (Sedang)</option>
                  <option value="orange">Oranye (Sulit)</option>
                  <option value="rose">Merah (Ekstrem)</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#DA7F8F] text-white hover:bg-[#c96c7d] text-xs font-bold transition shrink-0 cursor-pointer"
                >
                  Tambah
                </button>
              </div>
            </form>

            {/* List of Difficulties */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {difficultyLevels.map((diff) => (
                <div
                  key={diff.id}
                  className="p-3 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] flex items-center justify-between text-xs"
                >
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${diff.colorBadge}`}>
                    {diff.label}
                  </span>

                  <button
                    type="button"
                    onClick={() => deleteDifficultyLevel(diff.id)}
                    className="p-1 text-rose-600 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                    title="Hapus Kategori Kesulitan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: MODERASI ULASAN & PENGGUNA */}
      {/* ========================================================= */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          
          {/* Moderasi Ulasan Section */}
          <div className="bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E1E5EA] dark:border-[#2C3440] pb-3">
              <div>
                <h2 className="text-base font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#DA7F8F]" />
                  <span>Moderasi Ulasan & Komentar ({filteredReviews.length})</span>
                </h2>
                <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">
                  Tinjau dan hapus komentar atau ulasan tidak pantas yang dilaporkan oleh komunitas
                </p>
              </div>

              {/* Quick Search in reviews */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A7BBC7]" />
                <input
                  type="text"
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  placeholder="Cari kata ulasan / nama pendaki..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3] dark:bg-[#252C36] text-xs focus:outline-none"
                />
              </div>
            </div>

            {filteredReviews.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'}
                        alt={rev.userName}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-[#2B3542] dark:text-[#FAF3F3]">{rev.userName}</span>
                          <span className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7] font-mono">{rev.date}</span>
                          <span className="px-2 py-0.5 rounded-md bg-[#DA7F8F]/15 text-[#DA7F8F] font-semibold text-[10px]">
                            Jalur: {rev.trailName}
                          </span>
                        </div>
                        <div className="flex items-center text-amber-500">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= Number(rev.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-[#2B3542] dark:text-[#FAF3F3]/90 leading-relaxed">
                          "{rev.comment}"
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          title: 'Hapus Ulasan',
                          message: `Apakah Anda yakin ingin menghapus ulasan dari "${rev.userName}"?`,
                          onConfirm: () => {
                            deleteReview(rev.trailId, rev.id);
                            setConfirmModal({ isOpen: false });
                          },
                        });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-xs font-bold transition flex items-center gap-1.5 self-end sm:self-auto cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Ulasan</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-center py-6 text-[#6B7C8C] dark:text-[#A7BBC7]">
                Tidak ada ulasan yang sesuai dengan pencarian.
              </p>
            )}
          </div>

          {/* Daftar Pengguna Komunitas */}
          <div className="bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E1E5EA] dark:border-[#2C3440] pb-3">
              <h2 className="text-base font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#DA7F8F]" />
                <span>Daftar Akun Pengguna Terdaftar ({users.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="p-3.5 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] flex items-center gap-3"
                >
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#E1E5EA]"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate text-[#2B3542] dark:text-[#FAF3F3]">{u.name}</p>
                    <p className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7] truncate">{u.email}</p>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mt-1 ${
                      u.role === 'admin'
                        ? 'bg-[#DA7F8F]/20 text-[#DA7F8F] border border-[#DA7F8F]/40'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {u.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Confirmation Modal */}
      <ModalConfirm
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onCancel={() => setConfirmModal({ isOpen: false })}
        onConfirm={confirmModal.onConfirm}
      />

    </div>
  );
}
