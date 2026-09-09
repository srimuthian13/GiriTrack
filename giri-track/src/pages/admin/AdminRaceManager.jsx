import { useContext, useState } from 'react';
import { RaceContext } from '../../context/RaceContext';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { 
  Users, Activity, Target, Search, Download, ShieldAlert, PhoneCall, 
  Plus, Trash2, ExternalLink, Calendar, MapPin, CheckCircle2, X, Trophy, Clock,
  Upload, ImageIcon, ArrowLeft
} from 'lucide-react';

export default function AdminRaceManager() {
  const navigate = useNavigate();
  const { races, registrations, addRace, deleteRace, updateLeaderboardTime } = useContext(RaceContext);
  const { user, isAdmin } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRunner, setEditingRunner] = useState(null);
  const [raceToDelete, setRaceToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // New Race Form State
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    date: '',
    location: '',
    banner: '',
    description: '',
    categories: [
      { id: 'cat-1', name: '10K Trail Discovery', distance: '10 km', elevationGain: '+450 m', cot: '3 Jam', price: 200000, quota: 150, slotsTaken: 0, flagOff: '06:30 WIB' },
      { id: 'cat-2', name: '25K Mountain Challenge', distance: '25 km', elevationGain: '+1400 m', cot: '6 Jam', price: 350000, quota: 100, slotsTaken: 0, flagOff: '05:30 WIB' },
      { id: 'cat-3', name: '50K Ultra Summit', distance: '50 km', elevationGain: '+3100 m', cot: '12 Jam', price: 550000, quota: 50, slotsTaken: 0, flagOff: '04:00 WIB' }
    ]
  });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto maksimal 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, banner: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const filteredRegistrations = registrations.filter(reg => 
    reg.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    reg.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    if (registrations.length === 0) return;

    const headers = ['No Reg', 'BIB', 'Nama', 'Email', 'No HP', 'Gol Darah', 'Jersey', 'Event', 'Kategori', 'Kontak Darurat', 'Hp Darurat', 'Status', 'Tanggal'];
    const rows = registrations.map(reg => {
      const race = races.find(r => r.id === reg.raceId);
      const cat = race?.categories?.find(c => c.id === reg.categoryId);
      const catCode = cat?.name ? cat.name.split(' ')[0].toUpperCase() : 'RUN';
      const bib = `BIB-${catCode}-${String(reg.id || '001').slice(-3).padStart(3, '0')}`;

      return [
        reg.id,
        bib,
        `"${reg.name}"`,
        reg.email,
        reg.phone,
        reg.bloodType || '-',
        reg.jerseySize || 'M',
        `"${race?.title || '-'}"`,
        `"${cat?.name || '-'}"`,
        `"${reg.emergencyContactName || '-'}"`,
        reg.emergencyContactPhone || '-',
        reg.status,
        new Date(reg.date).toLocaleString('id-ID')
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `giritrack-race-registrations-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCategoryChange = (index, field, value) => {
    const updatedCats = [...formData.categories];
    updatedCats[index] = {
      ...updatedCats[index],
      [field]: field === 'price' || field === 'quota' ? Number(value) : value
    };
    setFormData({ ...formData, categories: updatedCats });
  };

  const handleAddCategory = () => {
    const newId = `cat-${Date.now()}`;
    setFormData({
      ...formData,
      categories: [
        ...formData.categories,
        {
          id: newId,
          name: 'Category Baru',
          distance: '15 km',
          elevationGain: '+800 m',
          cot: '4 Jam',
          price: 250000,
          quota: 100,
          slotsTaken: 0,
          flagOff: '06:00 WIB'
        }
      ]
    });
  };

  const handleRemoveCategory = (index) => {
    if (formData.categories.length <= 1) return;
    const updated = formData.categories.filter((_, idx) => idx !== index);
    setFormData({ ...formData, categories: updated });
  };

  const handleCreateRace = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location) {
      alert('Mohon lengkapi judul, tanggal, dan lokasi lomba.');
      return;
    }

    const created = addRace({
      title: formData.title,
      tagline: formData.tagline || 'Lomba Trail Running Bergengsi GiriTrack',
      date: formData.date,
      location: formData.location,
      banner: formData.banner,
      categories: formData.categories,
      description: formData.description
    });

    setIsAddModalOpen(false);
    showToast(`Lomba "${created.title}" berhasil ditambahkan ke katalog!`);
    
    // Reset form
    setFormData({
      title: '',
      tagline: '',
      date: '',
      location: '',
      banner: '',
      description: '',
      categories: [
        { id: 'cat-1', name: '10K Trail Discovery', distance: '10 km', elevationGain: '+450 m', cot: '3 Jam', price: 200000, quota: 150, slotsTaken: 0, flagOff: '06:30 WIB' },
        { id: 'cat-2', name: '25K Mountain Challenge', distance: '25 km', elevationGain: '+1400 m', cot: '6 Jam', price: 350000, quota: 100, slotsTaken: 0, flagOff: '05:30 WIB' },
        { id: 'cat-3', name: '50K Ultra Summit', distance: '50 km', elevationGain: '+3100 m', cot: '12 Jam', price: 550000, quota: 50, slotsTaken: 0, flagOff: '04:00 WIB' }
      ]
    });
  };

  const handleDeleteRace = () => {
    if (!raceToDelete) return;
    deleteRace(raceToDelete.id);
    showToast(`Event "${raceToDelete.title}" telah dihapus.`);
    setRaceToDelete(null);
  };

  const handleSaveFinishTime = (e) => {
    e.preventDefault();
    if (!editingRunner) return;

    if (updateLeaderboardTime) {
      updateLeaderboardTime({
        bib: editingRunner.bib,
        name: editingRunner.name,
        category: editingRunner.category,
        finishTime: editingRunner.finishTime,
        pace: editingRunner.avgPace,
        status: 'Finished'
      });
    }

    showToast(`Waktu finish untuk ${editingRunner.name} (${editingRunner.bib}) berhasil dicatat.`);
    setEditingRunner(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7] hover:text-[#DA7F8F] dark:hover:text-[#DA7F8F] transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#2B3542] dark:text-[#FAF3F3] mb-2 drop-shadow-sm flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-[#DA7F8F]" />
            Admin Race Manager
          </h1>
          <p className="text-[#6B7C8C] dark:text-[#A7BBC7] max-w-2xl text-sm sm:text-base">
            Kelola dan tambah event trail running baru, pantau kuota peserta, dan cetak waktu finish pendaftar.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#DA7F8F] hover:bg-[#c96c7d] text-white rounded-2xl font-bold shadow-lg shadow-[#DA7F8F]/25 hover:shadow-xl transition-all duration-200 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Lomba Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Events & Quota Overview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#DA7F8F]" />
              Daftar Event ({races.length})
            </h2>
          </div>

          <div className="space-y-4">
            {races.map(race => {
              const totalQuota = race.categories?.reduce((sum, cat) => sum + (cat.quota || 0), 0) || 0;
              const totalSlotsTaken = race.categories?.reduce((sum, cat) => sum + (cat.slotsTaken || 0), 0) || 0;
              const percentFilled = totalQuota > 0 ? Math.min(100, Math.round((totalSlotsTaken / totalQuota) * 100)) : 0;

              return (
                <div key={race.id} className="bg-white dark:bg-[#1C2129] rounded-2xl p-5 border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm relative group hover:border-[#DA7F8F]/50 transition-all">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-[#2B3542] dark:text-[#FAF3F3] line-clamp-1">{race.title}</h3>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link
                        to={`/races/${race.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-gray-400 hover:text-[#DA7F8F] rounded-lg hover:bg-gray-100 dark:hover:bg-[#252C36] transition"
                        title="Lihat Halaman Lomba"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setRaceToDelete(race)}
                        className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                        title="Hapus Lomba"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#DA7F8F]" />
                      {race.date ? new Date(race.date).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '-'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#DA7F8F]" />
                      {race.location || '-'}
                    </span>
                  </div>
                  
                  <div className="mb-2 flex justify-between text-xs sm:text-sm">
                    <span className="font-medium text-[#2B3542] dark:text-[#FAF3F3]">Kapasitas Peserta</span>
                    <span className="font-bold text-[#DA7F8F]">{totalSlotsTaken} / {totalQuota} Slot</span>
                  </div>
                  
                  <div className="w-full bg-gray-100 dark:bg-[#2C3440] rounded-full h-2 mb-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#DA7F8F] to-emerald-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-[#2C3440]">
                    {race.categories?.map(cat => (
                      <div key={cat.id} className="flex justify-between items-center text-xs">
                        <span className="text-[#6B7C8C] dark:text-[#A7BBC7] font-medium">{cat.name} ({cat.distance})</span>
                        <span className="font-bold text-[#2B3542] dark:text-[#FAF3F3] bg-gray-100 dark:bg-[#252C36] px-2 py-0.5 rounded-md">
                          {cat.slotsTaken || 0} / {cat.quota}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Registrations List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#1C2129] rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm overflow-hidden flex flex-col h-full">
            
            <div className="p-5 border-b border-[#E1E5EA] dark:border-[#2C3440] flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <h2 className="text-xl font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#DA7F8F]" />
                Data Pendaftar ({registrations.length})
              </h2>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Cari nama, ID, email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-gray-50 dark:bg-[#14171C] text-[#2B3542] dark:text-white focus:outline-none focus:border-[#DA7F8F]"
                  />
                </div>
                <button 
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 bg-[#452829] hover:bg-[#321c1d] text-white rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer shrink-0" 
                  title="Export Data ke CSV"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-[#14171C] text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3.5 font-medium">BIB & Reg ID</th>
                    <th className="px-6 py-3.5 font-medium">Peserta</th>
                    <th className="px-6 py-3.5 font-medium">Event & Kategori</th>
                    <th className="px-6 py-3.5 font-medium">Kontak Darurat</th>
                    <th className="px-6 py-3.5 font-medium">Status</th>
                    <th className="px-6 py-3.5 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E5EA] dark:divide-[#2C3440] text-[#2B3542] dark:text-[#FAF3F3]">
                  {filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map(reg => {
                      const race = races.find(r => r.id === reg.raceId);
                      const cat = race?.categories?.find(c => c.id === reg.categoryId);
                      const catCode = cat?.name ? cat.name.split(' ')[0].toUpperCase() : 'RUN';
                      const bibNumber = `BIB-${catCode}-${String(reg.id || '001').slice(-3).padStart(3, '0')}`;

                      return (
                        <tr key={reg.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-black font-mono text-xs text-[#DA7F8F]">{bibNumber}</div>
                            <div className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7] font-mono">{reg.id}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold">{reg.name}</div>
                            <div className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">{reg.email} • {reg.phone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-xs">{race?.title || reg.raceTitle || 'Unknown Event'}</div>
                            <div className="text-[10px] uppercase tracking-wide text-[#DA7F8F] font-bold">{cat?.name || reg.categoryName || 'Trail Run'} ({reg.jerseySize || 'M'})</div>
                          </td>
                          <td className="px-6 py-4 text-xs">
                            <div className="font-medium flex items-center gap-1">
                              <PhoneCall className="w-3 h-3 text-rose-500" />
                              <span>{reg.emergencyContactName || '-'}</span>
                            </div>
                            <div className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7]">{reg.emergencyContactPhone || '-'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                              {(reg.status || 'PAID').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingRunner({
                                  bib: bibNumber,
                                  name: reg.name,
                                  category: cat?.name || reg.categoryName || 'Trail Run',
                                  finishTime: '',
                                  avgPace: ''
                                });
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#DA7F8F]/15 hover:bg-[#DA7F8F] text-[#DA7F8F] hover:text-white font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <Trophy className="w-3.5 h-3.5" />
                              <span>Catat Finish</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        {searchTerm ? 'Pendaftar tidak ditemukan.' : 'Belum ada peserta terdaftar.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL FULL LAYAR: TAMBAH LOMBA TRAIL RUNNING BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#FAF3F3] dark:bg-[#14171C] flex flex-col overflow-hidden animate-in fade-in duration-200">
          {/* Sticky Top Header */}
          <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#1C2129]/95 backdrop-blur-md px-6 sm:px-10 py-4 border-b border-[#E1E5EA] dark:border-[#2C3440] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#DA7F8F]/15 flex items-center justify-center text-[#DA7F8F] border border-[#DA7F8F]/30">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#2B3542] dark:text-white tracking-tight">
                  Tambah Lomba Trail Running Baru
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7C8C] dark:text-[#A7BBC7]">
                  Isi formulir lengkap untuk menerbitkan event lari lintas alam resmi ke katalog GiriTrack
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="p-2.5 rounded-2xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#252C36] transition cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              title="Tutup Formulir"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form Content Area (Scrollable 2-Column Grid) */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8">
            <form id="create-race-form" onSubmit={handleCreateRace} className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* KOLOM KIRI (5 Cols): Informasi Utama & Gambar Banner */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white dark:bg-[#1C2129] rounded-3xl p-6 sm:p-7 border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm space-y-5">
                    <h3 className="text-base font-bold text-[#2B3542] dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-[#2C3440] pb-3">
                      <Calendar className="w-4 h-4 text-[#DA7F8F]" />
                      1. Informasi Utama Event
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-[#2B3542] dark:text-stone-300 mb-1.5">
                        Judul Lomba / Event <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Merbabu Sky Ultra 2026"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] bg-gray-50 dark:bg-[#14171C] text-sm text-[#2B3542] dark:text-white focus:outline-none focus:border-[#DA7F8F] focus:ring-2 focus:ring-[#DA7F8F]/20 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2B3542] dark:text-stone-300 mb-1.5">
                        Slogan / Tagline
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Taklukkan Puncak Savana dan Menembus Batas di Jalur Selo"
                        value={formData.tagline}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] bg-gray-50 dark:bg-[#14171C] text-sm text-[#2B3542] dark:text-white focus:outline-none focus:border-[#DA7F8F] focus:ring-2 focus:ring-[#DA7F8F]/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#2B3542] dark:text-stone-300 mb-1.5">
                          Tanggal Pelaksanaan <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] bg-gray-50 dark:bg-[#14171C] text-sm text-[#2B3542] dark:text-white focus:outline-none focus:border-[#DA7F8F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#2B3542] dark:text-stone-300 mb-1.5">
                          Lokasi (Kota, Provinsi) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Boyolali, Jawa Tengah"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] bg-gray-50 dark:bg-[#14171C] text-sm text-[#2B3542] dark:text-white focus:outline-none focus:border-[#DA7F8F]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2B3542] dark:text-stone-300 mb-1.5 flex items-center justify-between">
                        <span>Foto Banner / Poster Lomba</span>
                        {formData.banner && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, banner: '' })}
                            className="text-rose-500 hover:text-rose-600 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            Hapus Foto
                          </button>
                        )}
                      </label>

                      {formData.banner ? (
                        <div className="relative rounded-2xl overflow-hidden border border-[#E1E5EA] dark:border-[#2C3440] aspect-video bg-gray-100 dark:bg-[#14171C] group shadow-inner">
                          <img 
                            src={formData.banner} 
                            alt="Banner Preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <label className="px-4 py-2 bg-white/95 hover:bg-white text-gray-800 text-xs font-bold rounded-xl shadow-lg cursor-pointer flex items-center gap-1.5 transition active:scale-95">
                              <Upload className="w-3.5 h-3.5 text-[#DA7F8F]" />
                              <span>Ganti Foto</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, banner: '' })}
                              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-lg cursor-pointer flex items-center gap-1.5 transition active:scale-95"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-3 pointer-events-none">
                            <p className="text-white text-xs font-bold truncate">
                              {formData.title || 'Foto Banner Terpilih'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[#DA7F8F] dark:hover:border-[#DA7F8F] rounded-2xl p-7 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 bg-gray-50/80 dark:bg-[#14171C]/60 hover:bg-white dark:hover:bg-[#1C2129] group">
                          <div className="w-14 h-14 rounded-2xl bg-[#DA7F8F]/15 text-[#DA7F8F] flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-[#DA7F8F] group-hover:text-white transition-all shadow-sm">
                            <Upload className="w-7 h-7" />
                          </div>
                          <p className="text-xs font-bold text-[#2B3542] dark:text-white mb-0.5">
                            Klik atau Seret Foto ke Sini
                          </p>
                          <p className="text-[11px] text-[#6B7C8C] dark:text-[#A7BBC7]">
                            Pilih gambar dari galeri/perangkat Anda (JPG, PNG, WEBP maks 5MB)
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      )}

                      {/* Opsi URL link online sekunder */}
                      <div className="mt-2.5">
                        <details className="text-xs text-gray-500">
                          <summary className="cursor-pointer font-medium hover:text-[#DA7F8F] transition select-none flex items-center gap-1">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Atau gunakan link URL gambar online</span>
                          </summary>
                          <div className="mt-2">
                            <input
                              type="url"
                              placeholder="https://images.unsplash.com/..."
                              value={formData.banner.startsWith('data:') ? '' : formData.banner}
                              onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                              className="w-full px-3.5 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-gray-50 dark:bg-[#14171C] text-xs text-[#2B3542] dark:text-white focus:outline-none focus:border-[#DA7F8F]"
                            />
                          </div>
                        </details>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2B3542] dark:text-stone-300 mb-1.5">
                        Deskripsi Singkat Lomba
                      </label>
                      <textarea
                        rows="3"
                        placeholder="Deskripsikan keindahan jalur, tantangan elevasi, dan daya tarik utama event ini..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] bg-gray-50 dark:bg-[#14171C] text-xs text-[#2B3542] dark:text-white focus:outline-none focus:border-[#DA7F8F]"
                      />
                    </div>
                  </div>
                </div>

                {/* KOLOM KANAN (7 Cols): Daftar Kategori & Kuota */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white dark:bg-[#1C2129] rounded-3xl p-6 sm:p-7 border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-[#2C3440] pb-4 mb-5">
                      <div>
                        <h3 className="text-base font-bold text-[#2B3542] dark:text-white flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-[#DA7F8F]" />
                          2. Kategori Lomba & Kuota Peserta
                        </h3>
                        <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">
                          Atur kategori jarak, batas waktu (COT), elevasi, kuota peserta, dan biaya pendaftaran
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#DA7F8F]/15 hover:bg-[#DA7F8F] text-[#DA7F8F] hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Kategori</span>
                      </button>
                    </div>

                    {/* Category Cards List */}
                    <div className="space-y-4">
                      {formData.categories.map((cat, idx) => (
                        <div 
                          key={cat.id || idx} 
                          className="p-5 bg-gray-50 dark:bg-[#14171C] rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] relative group hover:border-[#DA7F8F]/40 transition"
                        >
                          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-200/60 dark:border-gray-800">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-[#DA7F8F] text-white text-xs font-black flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="text-xs font-bold text-[#2B3542] dark:text-white">
                                Kategori {idx + 1}
                              </span>
                            </div>

                            {formData.categories.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveCategory(idx)}
                                className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2.5 py-1 rounded-lg transition cursor-pointer"
                                title="Hapus Kategori Ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus</span>
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                                Nama Kategori
                              </label>
                              <input
                                type="text"
                                placeholder="Contoh: 25K Mountain Challenge"
                                value={cat.name}
                                onChange={(e) => handleCategoryChange(idx, 'name', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C2129] border border-gray-200 dark:border-gray-700 text-xs font-bold text-[#2B3542] dark:text-white focus:outline-none focus:border-[#DA7F8F]"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                                Jarak (km)
                              </label>
                              <input
                                type="text"
                                placeholder="25 km"
                                value={cat.distance}
                                onChange={(e) => handleCategoryChange(idx, 'distance', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C2129] border border-gray-200 dark:border-gray-700 text-xs text-[#2B3542] dark:text-white focus:outline-none focus:border-[#DA7F8F]"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                                Elevasi (+ m)
                              </label>
                              <input
                                type="text"
                                placeholder="+1400 m"
                                value={cat.elevationGain}
                                onChange={(e) => handleCategoryChange(idx, 'elevationGain', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C2129] border border-gray-200 dark:border-gray-700 text-xs text-[#2B3542] dark:text-white focus:outline-none focus:border-[#DA7F8F]"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                                Cut-Off Time (COT)
                              </label>
                              <input
                                type="text"
                                placeholder="6 Jam"
                                value={cat.cot}
                                onChange={(e) => handleCategoryChange(idx, 'cot', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C2129] border border-gray-200 dark:border-gray-700 text-xs text-[#2B3542] dark:text-white focus:outline-none focus:border-[#DA7F8F]"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                                Jam Flag-Off
                              </label>
                              <input
                                type="text"
                                placeholder="05:30 WIB"
                                value={cat.flagOff}
                                onChange={(e) => handleCategoryChange(idx, 'flagOff', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C2129] border border-gray-200 dark:border-gray-700 text-xs text-[#2B3542] dark:text-white focus:outline-none focus:border-[#DA7F8F]"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                                Kuota Peserta (Slot)
                              </label>
                              <input
                                type="number"
                                placeholder="100"
                                value={cat.quota}
                                onChange={(e) => handleCategoryChange(idx, 'quota', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C2129] border border-gray-200 dark:border-gray-700 text-xs font-semibold text-[#2B3542] dark:text-white focus:outline-none focus:border-[#DA7F8F]"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                                Biaya Registrasi (Rp)
                              </label>
                              <input
                                type="number"
                                placeholder="350000"
                                value={cat.price}
                                onChange={(e) => handleCategoryChange(idx, 'price', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C2129] border border-gray-200 dark:border-gray-700 text-xs font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:border-[#DA7F8F]"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Ringkasan Kuota & Kategori Box */}
                    <div className="mt-6 p-4 rounded-2xl bg-[#DA7F8F]/10 border border-[#DA7F8F]/20 flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Total Kategori: </span>
                        <strong className="text-[#2B3542] dark:text-white font-bold">{formData.categories.length} Kategori</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Total Kuota Peserta: </span>
                        <strong className="text-[#DA7F8F] font-black">{formData.categories.reduce((sum, c) => sum + (Number(c.quota) || 0), 0)} Peserta</strong>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </form>
          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="sticky bottom-0 z-20 bg-white/95 dark:bg-[#1C2129]/95 backdrop-blur-md px-6 sm:px-10 py-4 border-t border-[#E1E5EA] dark:border-[#2C3440] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] hidden sm:block">
              💡 Pastikan informasi tanggal, lokasi, dan biaya kategori telah sesuai sebelum mempublikasikan event.
            </p>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-[#252C36] transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="create-race-form"
                className="flex-1 sm:flex-initial px-8 py-3 rounded-2xl bg-[#DA7F8F] hover:bg-[#c96c7d] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#DA7F8F]/25 hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Terbitkan Lomba Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CATAT WAKTU FINISH RUNNER */}
      {editingRunner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C2129] rounded-3xl max-w-md w-full p-6 border border-[#E1E5EA] dark:border-[#2C3440] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E5EA] dark:border-[#2C3440] mb-4">
              <h3 className="font-bold text-lg text-[#2B3542] dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#DA7F8F]" />
                Catat Waktu Finish
              </h3>
              <button
                onClick={() => setEditingRunner(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFinishTime} className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-[#14171C] rounded-xl border border-gray-200 dark:border-gray-800 text-xs space-y-1">
                <div className="font-bold text-sm text-[#DA7F8F]">{editingRunner.bib}</div>
                <div className="font-semibold text-[#2B3542] dark:text-white">{editingRunner.name}</div>
                <div className="text-gray-500">{editingRunner.category}</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B3542] dark:text-stone-300 mb-1">
                  Waktu Finish (HH:MM:SS) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="04:25:30"
                  value={editingRunner.finishTime}
                  onChange={(e) => setEditingRunner({ ...editingRunner, finishTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-gray-50 dark:bg-[#14171C] text-sm text-[#2B3542] dark:text-white focus:outline-none focus:border-[#DA7F8F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B3542] dark:text-stone-300 mb-1">
                  Rata-rata Pace (Contoh: 08:30 /km)
                </label>
                <input
                  type="text"
                  placeholder="08:30 /km"
                  value={editingRunner.avgPace}
                  onChange={(e) => setEditingRunner({ ...editingRunner, avgPace: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-gray-50 dark:bg-[#14171C] text-sm text-[#2B3542] dark:text-white focus:outline-none focus:border-[#DA7F8F]"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingRunner(null)}
                  className="flex-1 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#DA7F8F] hover:bg-[#c96c7d] text-white text-xs font-bold transition"
                >
                  Simpan Finish Time
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI HAPUS EVENT */}
      {raceToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C2129] rounded-3xl max-w-sm w-full p-6 border border-[#E1E5EA] dark:border-[#2C3440] shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-500 mx-auto flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#2B3542] dark:text-white mb-2">Hapus Lomba Ini?</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              Event <strong>"{raceToDelete.title}"</strong> akan dihapus dari sistem beserta konfigurasi kategorinya.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRaceToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteRace}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold cursor-pointer transition"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
