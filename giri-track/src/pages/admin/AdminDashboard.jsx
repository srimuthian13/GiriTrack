import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle,
  Plus,
  Trash2,
  MapPin,
  Mountain,
  Star,
  Users,
  Compass,
  MessageSquare,
  AlertTriangle,
  Search,
  Check,
  Clock,
  QrCode,
  Download,
  Flag,
  CreditCard
} from 'lucide-react';
import { useTrail } from '../../context/TrailContext';
import { useAuth } from '../../context/AuthContext';

import { useRace } from '../../context/RaceContext';
import ModalConfirm from '../../components/ModalConfirm';

export default function AdminDashboard() {
  const {
    trails,
    verifyTrail,
    deleteTrail,
    difficultyLevels,
    addDifficultyLevel,
    deleteDifficultyLevel,
    deleteReview
  } = useTrail();

  const { races, registrations } = useRace();
  const { isAdmin, user, usersDb = [], deleteUser, updateUserRole, loginAsDemoAdmin } = useAuth();
  const navigate = useNavigate();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState('races'); // 'races' | 'pending' | 'master' | 'moderation'

  // Master Data Inputs
  const [newDiffLabel, setNewDiffLabel] = useState('');
  const [newDiffBadgeColor, setNewDiffBadgeColor] = useState('emerald');

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  // Search Filter for moderation & users
  const [reviewSearch, setReviewSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [raceRegSearch, setRaceRegSearch] = useState('');
  


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

  const filteredUsers = usersDb.filter((u) =>
    (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.role || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  // Handlers for Master Data
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

  const handleExportCSV = () => {
    const headers = ['BIB', 'Nama Peserta', 'Email', 'Event', 'Kategori', 'Status Bayar', 'Tanggal'];
    const csvContent = [
      headers.join(','),
      ...registrations.map(r => [
        r.bibNumber || '-',
        `"${r.name || '-'}"`,
        `"${r.email || '-'}"`,
        `"${r.raceTitle || '-'}"`,
        `"${r.categoryName || '-'}"`,
        r.status || 'PENDING',
        `"${new Date(r.date).toLocaleDateString('id-ID')}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Data_Peserta_Lomba_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compute Stats
  const pendingRegistrationsCount = registrations.filter(r => r.status !== 'PAID').length;
  const totalIncome = registrations.filter(r => r.status === 'PAID').reduce((acc, r) => acc + (Number(r.price) || 0), 0);
  const formattedIncome = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalIncome);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 pb-16 text-[#2B3542] dark:text-[#FAF3F3]">
      
      {/* Back Button (Removed from Dashboard as requested) */}

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
                Kelola tingkat kesulitan, moderasi ulasan, dan verifikasi rute pendakian
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto hidden md:flex">
          {/* Action buttons can go here in the future */}
        </div>
      </div>

      {/* Top 4 Key Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm flex items-center gap-4 hover:border-[#DA7F8F] transition-colors">
          <div className="p-3.5 rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 shrink-0 hidden sm:block">
            <Flag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B7C8C] dark:text-[#A7BBC7]">Lomba Aktif</p>
            <p className="text-xl sm:text-2xl font-black text-[#2B3542] dark:text-[#FAF3F3]">{races.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm flex flex-col justify-center gap-1 hover:border-[#DA7F8F] transition-colors relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3.5 rounded-2xl bg-[#DA7F8F]/20 text-[#DA7F8F] shrink-0 hidden sm:block">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#6B7C8C] dark:text-[#A7BBC7]">Total Peserta</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-0.5">
                <p className="text-xl sm:text-2xl font-black text-[#2B3542] dark:text-[#FAF3F3]">{registrations.length}</p>
                {pendingRegistrationsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 self-start sm:self-auto">
                    Pending: {pendingRegistrationsCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm flex items-center gap-4 hover:border-[#DA7F8F] transition-colors">
          <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shrink-0 hidden sm:block">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B7C8C] dark:text-[#A7BBC7]">Pemasukan (QRIS)</p>
            <p className="text-lg sm:text-[17px] font-black text-[#2B3542] dark:text-[#FAF3F3] truncate max-w-[140px]" title={formattedIncome}>
              {formattedIncome}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm flex flex-col justify-center gap-1 hover:border-[#DA7F8F] transition-colors relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3.5 rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 shrink-0 hidden sm:block">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#6B7C8C] dark:text-[#A7BBC7]">Jalur Terdaftar</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-0.5">
                <p className="text-xl sm:text-2xl font-black text-[#2B3542] dark:text-[#FAF3F3]">{trails.length}</p>
                {pendingTrails.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 self-start sm:self-auto">
                    Pending: {pendingTrails.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E1E5EA] dark:border-[#2C3440] scrollbar-hide">
        
        <button
          type="button"
          onClick={() => setActiveTab('races')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'races'
              ? 'bg-[#DA7F8F] text-white shadow-md'
              : 'bg-white dark:bg-[#1C2129] text-[#2B3542] dark:text-[#FAF3F3] border border-[#E1E5EA] dark:border-[#2C3440] hover:bg-[#FAF3F3]'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Lomba & Peserta</span>
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
      {/* TAB 1: KELOLA LOMBA & PESERTA */}
      {/* ========================================================= */}
      {activeTab === 'races' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-[#2B3542] dark:text-[#FAF3F3]">Monitoring Peserta Lomba</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-[#E1E5EA] dark:bg-[#252C36] text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#DA7F8F] hover:text-white transition-colors text-xs font-bold flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={() => alert("Simulasi: Membuka Kamera Scanner QR")}
                className="px-4 py-2 rounded-xl bg-[#E1E5EA] dark:bg-[#252C36] text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#DA7F8F] hover:text-white transition-colors text-xs font-bold flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                Scan QR BIB
              </button>
              <button
                onClick={() => navigate('/admin/races')}
                className="px-4 py-2 rounded-xl bg-[#DA7F8F] text-white hover:bg-[#c96c7d] transition-colors text-xs font-bold flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" />
                Kelola & Tambah Lomba
              </button>
            </div>
          </div>
          
          <div className="bg-white/90 dark:bg-[#1C2129] rounded-3xl p-6 shadow-sm border border-[#E1E5EA] dark:border-[#2C3440]">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7C8C]" />
                <input
                  type="text"
                  placeholder="Cari nama atau nomor BIB..."
                  value={raceRegSearch}
                  onChange={(e) => setRaceRegSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-transparent text-[#2B3542] dark:text-[#FAF3F3] focus:ring-2 focus:ring-[#DA7F8F] focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E1E5EA] dark:border-[#2C3440] text-[#6B7C8C] dark:text-[#A7BBC7] uppercase">
                    <th className="py-2 px-3">BIB</th>
                    <th className="py-2 px-3">Nama Peserta</th>
                    <th className="py-2 px-3">Event & Kategori</th>
                    <th className="py-2 px-3">WhatsApp / Email</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E5EA] dark:divide-[#2C3440]">
                  {registrations
                    .filter(r => 
                      (r.name || '').toLowerCase().includes(raceRegSearch.toLowerCase()) || 
                      (r.bibNumber || '').toLowerCase().includes(raceRegSearch.toLowerCase())
                    )
                    .map(r => (
                    <tr key={r.id} className="hover:bg-[#FAF3F3] dark:hover:bg-[#252C36] transition">
                      <td className="py-3 px-3 font-mono font-bold">{r.bibNumber || '-'}</td>
                      <td className="py-3 px-3 font-bold">{r.name || '-'}</td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#DA7F8F]">{r.raceTitle}</span>
                          <span className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7]">{r.categoryName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span>{r.whatsapp || r.phone || '-'}</span>
                          <span className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7]">{r.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {r.status === 'PAID' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            PAID
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                            PENDING
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button className="p-1.5 rounded-lg bg-[#E1E5EA] dark:bg-[#252C36] text-[#6B7C8C] dark:text-[#A7BBC7] hover:text-[#DA7F8F] transition" title="Verifikasi">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {registrations.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-[#6B7C8C] dark:text-[#A7BBC7]">Belum ada data pendaftar.</td>
                    </tr>
                  )}
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
      {/* TAB 3: MANAJEMEN MASTER DATA (TINGKAT KESULITAN) */}
      {/* ========================================================= */}
      {activeTab === 'master' && (
        <div className="max-w-xl mx-auto">
          {/* Master: Tingkat Kesulitan */}
          <div className="bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#E1E5EA] dark:border-[#2C3440] pb-3">
              <h2 className="text-base font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
                <Mountain className="w-4 h-4 text-[#DA7F8F]" />
                <span>Master Tingkat Kesulitan ({difficultyLevels.length})</span>
              </h2>
            </div>

            {/* Add Difficulty Form */}
            <form onSubmit={handleAddDifficulty} className="space-y-2.5">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newDiffLabel}
                  onChange={(e) => setNewDiffLabel(e.target.value)}
                  placeholder="Nama tingkat kesulitan (cth: Ekstra Terjal)..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-white dark:bg-[#1C2129] text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40"
                />
                <div className="flex items-center gap-2">
                  <select
                    value={newDiffBadgeColor}
                    onChange={(e) => setNewDiffBadgeColor(e.target.value)}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-white dark:bg-[#1C2129] text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40"
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
              </div>
            </form>

            {/* List of Difficulties - Tampil ke Bawah (Semua Terlihat) */}
            <div className="space-y-2">
              {difficultyLevels.map((diff) => (
                <div
                  key={diff.id}
                  className="p-3 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] flex items-center justify-between text-xs hover:border-[#DA7F8F]/40 transition shadow-sm"
                >
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${diff.colorBadge}`}>
                    {diff.label}
                  </span>

                  <button
                    type="button"
                    onClick={() => deleteDifficultyLevel(diff.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
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

          {/* Daftar Pengguna Terdaftar */}
          <div className="bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E1E5EA] dark:border-[#2C3440] pb-3">
              <div>
                <h2 className="text-base font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#DA7F8F]" />
                  <span>Daftar Akun Pengguna Terdaftar ({filteredUsers.length})</span>
                </h2>
                <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">
                  Seluruh akun yang mendaftar melalui formulir registrasi atau Google Auth
                </p>
              </div>

              {/* Quick Search for users */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A7BBC7]" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Cari nama / email pengguna..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3] dark:bg-[#252C36] text-xs focus:outline-none"
                />
              </div>
            </div>

            {filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredUsers.map((u, idx) => {
                  const isCurrentAdmin = u.email === user?.email;
                  const isSuperAdminAccount = u.email === 'admin@giritrack.id' || u.email === 'admin@giritrack.com';

                  return (
                    <div
                      key={u.email || idx}
                      className="p-4 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name || 'User')}`}
                          alt={u.name}
                          className="w-11 h-11 rounded-full object-cover shrink-0 border-2 border-white dark:border-[#1C2129] shadow-sm bg-white"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold truncate text-[#2B3542] dark:text-[#FAF3F3]">
                              {u.name}
                            </p>
                            {isCurrentAdmin && (
                              <span className="text-[9px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.2 rounded">
                                Anda
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#6B7C8C] dark:text-[#A7BBC7] truncate mt-0.5 font-mono">
                            {u.email}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                              u.role === 'admin'
                                ? 'bg-[#DA7F8F] text-white shadow-sm'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/40'
                            }`}>
                              {u.role === 'admin' ? 'Admin' : 'Pendaki'}
                            </span>
                            {u.registeredAt && (
                              <span className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7]">
                                {new Date(u.registeredAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Bar for User */}
                      <div className="pt-2 border-t border-[#E1E5EA] dark:border-[#2C3440] flex items-center justify-between text-xs">
                        <button
                          type="button"
                          disabled={isSuperAdminAccount}
                          onClick={() => {
                            const newRole = u.role === 'admin' ? 'user' : 'admin';
                            setConfirmModal({
                              isOpen: true,
                              title: `Ubah Role Akun`,
                              subtitle: `Tindakan ini akan mengubah level akses pengguna.`,
                              message: `Ubah hak akses "${u.name}" (${u.email}) menjadi ${newRole === 'admin' ? 'Admin' : 'Pendaki / User'}?`,
                              confirmText: 'Ya, Ubah Role',
                              type: 'warning',
                              onConfirm: () => {
                                updateUserRole(u.email, newRole);
                                setConfirmModal({ isOpen: false });
                              }
                            });
                          }}
                          className={`text-[11px] font-bold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                            u.role === 'admin'
                              ? 'text-amber-600 dark:text-amber-400 hover:underline'
                              : 'text-[#DA7F8F] hover:underline'
                          }`}
                        >
                          {u.role === 'admin' ? 'Ubah ke User' : 'Ubah ke Admin'}
                        </button>

                        {!isSuperAdminAccount && !isCurrentAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmModal({
                                isOpen: true,
                                title: 'Hapus Akun Pengguna',
                                message: `Apakah Anda yakin ingin menghapus akun "${u.name}" (${u.email}) secara permanen?`,
                                onConfirm: () => {
                                  deleteUser(u.email);
                                  setConfirmModal({ isOpen: false });
                                }
                              });
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded-lg transition cursor-pointer"
                            title="Hapus Akun"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-center py-6 text-[#6B7C8C] dark:text-[#A7BBC7]">
                Tidak ada akun pengguna yang sesuai dengan pencarian.
              </p>
            )}
          </div>

        </div>
      )}

      {/* Confirmation Modal */}
      <ModalConfirm
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        subtitle={confirmModal.subtitle}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type || 'danger'}
        onCancel={() => setConfirmModal({ isOpen: false })}
        onConfirm={confirmModal.onConfirm}
      />

    </div>
  );
}
