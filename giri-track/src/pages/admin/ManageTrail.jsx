import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Settings, Plus, Save, Edit, Trash2, CheckCircle2, AlertCircle, 
  RefreshCw, Upload, Image as ImageIcon, Link as LinkIcon, X, 
  Lock, LogIn, ShieldCheck, Clock, Check,
  ArrowLeft, Compass, Camera
} from 'lucide-react';
import { useTrail } from '../../context/TrailContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import ModalConfirm from '../../components/ModalConfirm';
import CameraCaptureModal from '../../components/CameraCaptureModal';

export default function ManageTrail() {
  const { 
    trails, addTrail, updateTrail, deleteTrail, verifyTrail, resetTrails,
    locations, addLocation, deleteLocation,
    difficultyLevels, addDifficultyLevel, deleteDifficultyLevel
  } = useTrail();
  const { isAdmin, isLoggedIn, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  // Master Data States
  const [newLocationName, setNewLocationName] = useState('');
  const [newDiffLabel, setNewDiffLabel] = useState('');
  const [newDiffBadgeColor, setNewDiffBadgeColor] = useState('emerald');

  const editId = searchParams.get('editId');

  // Preset Sample Mountain Images
  const presetImages = [
    { name: 'Gunung Gede', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Gunung Prau', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Gunung Merbabu', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Gunung Rinjani', url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Gunung Sindoro', url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1000&auto=format&fit=crop' },
  ];

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    difficulty: 'Sedang',
    distance_km: '',
    elevation_m: '',
    estimated_time: '6-7 Jam',
    image: '',
    description: '',
    coordinatesRaw: '[[-6.7912, 106.9825], [-6.7850, 106.9870], [-6.7790, 106.9910]]',
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);
  const [imageTab, setImageTab] = useState('upload'); // 'upload' | 'url' | 'preset'

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      location: '',
      difficulty: 'Sedang',
      distance_km: '',
      elevation_m: '',
      estimated_time: '6-7 Jam',
      image: '',
      description: '',
      coordinatesRaw: '[[-6.7912, 106.9825], [-6.7850, 106.9870], [-6.7790, 106.9910]]',
    });
    setFormError('');
    setSearchParams({});
  }, [setSearchParams]);

  // Effect to prefill form if editing (Admin only)
  useEffect(() => {
    if (editId && isAdmin) {
      const existing = trails.find((t) => String(t.id) === String(editId));
      if (existing) {
        const timer = setTimeout(() => {
          setFormData({
            name: existing.name || '',
            location: existing.location || '',
            difficulty: existing.difficulty || 'Sedang',
            distance_km: existing.distance_km || '',
            elevation_m: existing.elevation_m || '',
            estimated_time: existing.estimated_time || '',
            image: existing.image || '',
            description: existing.description || '',
            coordinatesRaw: existing.coordinates ? JSON.stringify(existing.coordinates) : '',
          });
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [editId, trails, isAdmin]);

  // 1. GERBANG AUTENTIKASI: Jika belum login, cegah akses pengelolaan jalur
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 animate-in fade-in zoom-in duration-300">
        <div className="bg-white/90 dark:bg-[#1C2129] rounded-3xl p-8 border border-[#E1E5EA] dark:border-[#2C3440] shadow-xl text-center space-y-5 text-[#2B3542] dark:text-[#FAF3F3]">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black">Akses Pengelolaan Terkunci</h2>
            <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-1.5 leading-relaxed">
              Anda harus masuk ke akun GiriTrack terlebih dahulu untuk dapat mengajukan atau mengelola jalur pendakian.
            </p>
          </div>
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => {
                localStorage.setItem('giritrack_intended_path', '/manage');
                navigate('/login');
              }}
              className="w-full py-3 rounded-2xl bg-[#DA7F8F] text-white hover:bg-[#c96c7d] font-bold text-xs shadow-md transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Akun Sekarang</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-2.5 rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36] font-semibold text-xs transition cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Local File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('File yang diunggah harus berupa gambar (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Ukuran file gambar maksimal 5 MB.');
      return;
    }

    setFormError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, image: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetImage = (url) => {
    setFormData((prev) => ({ ...prev, image: url }));
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Basic Validation
    if (!formData.name.trim() || !formData.location.trim()) {
      setFormError('Nama jalur dan lokasi wajib diisi.');
      return;
    }

    if (!formData.distance_km || Number(formData.distance_km) <= 0) {
      setFormError('Jarak harus berupa angka positif.');
      return;
    }

    if (!formData.elevation_m || Number(formData.elevation_m) <= 0) {
      setFormError('Elevasi harus berupa angka positif.');
      return;
    }

    // Parse coordinates JSON
    let parsedCoords;
    try {
      parsedCoords = JSON.parse(formData.coordinatesRaw);
      if (!Array.isArray(parsedCoords)) {
        throw new Error('Koordinat harus berupa array JSON');
      }
    } catch {
      setFormError(`Format koordinat tidak valid JSON. (Contoh: [[-6.79, 106.98]])`);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      location: formData.location.trim(),
      difficulty: formData.difficulty,
      distance_km: Number(formData.distance_km),
      elevation_m: Number(formData.elevation_m),
      estimated_time: formData.estimated_time.trim() || '6-7 Jam',
      image: formData.image.trim() || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop',
      description: formData.description.trim() || 'Jalur pendakian gunung yang indah dan menantang.',
      coordinates: parsedCoords,
      submittedBy: user?.name || user?.email || 'User Pendaki',
    };

    if (editId && isAdmin) {
      updateTrail(editId, payload);
      setFormSuccess(t('modal.successEdit') || 'Informasi jalur berhasil diperbarui!');
      resetForm();
    } else {
      addTrail(payload, isAdmin ? 'admin' : 'user');
      setFormSuccess(
        isAdmin
          ? (t('modal.successAdd') || 'Jalur pendakian resmi berhasil ditambahkan!')
          : 'Jalur berhasil diajukan! Status jalur saat ini "Menunggu Persetujuan Admin" sebelum dipublikasikan.'
      );
      resetForm();
    }

    setTimeout(() => setFormSuccess(''), 5000);
  };

  const handleEditClick = (trail) => {
    if (!isAdmin) return;
    setSearchParams({ editId: trail.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id) => {
    if (!isAdmin) return;
    setSelectedIdToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedIdToDelete && isAdmin) {
      deleteTrail(selectedIdToDelete);
      setDeleteModalOpen(false);
      setSelectedIdToDelete(null);
      if (editId === selectedIdToDelete) {
        resetForm();
      }
    }
  };

  const handleApproveTrail = (trailId) => {
    if (!isAdmin) return;
    verifyTrail(trailId);
    setFormSuccess('Jalur berhasil disetujui (Approved) dan kini tampil untuk seluruh pendaki!');
    setTimeout(() => setFormSuccess(''), 4000);
  };

  const pendingTrailsCount = trails.filter(t => t.status === 'pending').length;

  const handleAddLocation = (e) => {
    e.preventDefault();
    if (!newLocationName.trim()) return;
    addLocation({ name: newLocationName.trim() });
    setNewLocationName('');
  };

  const handleAddDifficultyLevel = (e) => {
    e.preventDefault();
    if (!newDiffLabel.trim()) return;

    let badgeClass = 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300 border-stone-300';
    if (newDiffBadgeColor === 'emerald') {
      badgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
    } else if (newDiffBadgeColor === 'amber') {
      badgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
    } else if (newDiffBadgeColor === 'rose') {
      badgeClass = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
    } else if (newDiffBadgeColor === 'purple') {
      badgeClass = 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300';
    }

    addDifficultyLevel({
      label: newDiffLabel.trim(),
      badgeClass,
      color: newDiffBadgeColor,
    });
    setNewDiffLabel('');
    setNewDiffBadgeColor('emerald');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 pb-12 text-[#2B3542] dark:text-[#FAF3F3]">
      
      {/* Back Button */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7] hover:text-[#DA7F8F] dark:hover:text-[#DA7F8F] transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('btn.back') || 'Kembali'}</span>
        </button>
      </div>

      {/* Page Title & User Role Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E1E5EA] dark:border-[#2C3440] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border ${
              isAdmin 
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' 
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
            }`}>
              {isAdmin ? 'Mode Administrator' : 'Mode Kontributor Pendaki'}
            </span>
            {isAdmin && pendingTrailsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                {pendingTrailsCount} Pengajuan Menunggu Persetujuan
              </span>
            )}
          </div>

          <h1 className="text-3xl font-black text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-3">
            <Settings className="w-8 h-8 text-[#DA7F8F]" />
            <span>{isAdmin ? 'Kelola & Verifikasi Jalur' : 'Ajukan Jalur Pendakian Baru'}</span>
          </h1>
          <p className="text-sm text-[#6B7C8C] dark:text-[#A7BBC7] mt-1">
            {isAdmin
              ? 'Kelola data resmi, edit rute, hapus, serta setujui (approve) jalur yang diajukan oleh pengguna.'
              : 'Punya info jalur gunung baru? Tambahkan data jalur di sini untuk ditinjau & disetujui oleh admin.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const listEl = document.getElementById('trail-list-section');
              if (listEl) {
                listEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-[#DA7F8F] text-white hover:bg-[#c96c7d] shadow-sm transition flex items-center gap-2 cursor-pointer active:scale-95"
            title="Buka Daftar Jalur Pendakian"
          >
            <Compass className="w-4 h-4" />
            <span>Lihat Daftar Jalur</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={resetTrails}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36] transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data Default</span>
            </button>
          )}
        </div>
      </div>

      {/* Info Notice for Regular Users */}
      {!isAdmin && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Ketentuan Pengajuan Jalur (User Mode):</p>
            <p className="text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
              Sebagai pendaki terdaftar, Anda dapat menambahkan data jalur gunung baru. Jalur yang Anda ajukan akan masuk ke status <strong>"Menunggu Persetujuan (Pending)"</strong> dan akan langsung tampil untuk umum setelah diverifikasi oleh Admin.
            </p>
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white/90 dark:bg-[#1C2129] rounded-3xl p-4 sm:p-5 shadow-lg border border-[#E1E5EA] dark:border-[#2C3440] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E1E5EA] dark:border-[#2C3440] pb-3">
          <h2 className="text-xl font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
            {editId && isAdmin ? <Edit className="w-5 h-5 text-[#DA7F8F]" /> : <Plus className="w-5 h-5 text-[#DA7F8F]" />}
            <span>
              {isAdmin 
                ? (editId ? t('form.editTitle') || 'Edit Informasi Jalur' : t('form.addTitle') || 'Tambah Jalur Resmi Baru') 
                : 'Formulir Tambah / Usulkan Jalur Baru'}
            </span>
          </h2>

          {editId && isAdmin && (
            <button
              onClick={resetForm}
              className="text-xs font-bold text-[#DA7F8F] hover:underline cursor-pointer"
            >
              Batal Edit (Kembali Tambah Baru)
            </button>
          )}
        </div>

        {/* Error / Success Notifications */}
        {formError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{formError}</span>
          </div>
        )}

        {formSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 dark:bg-emerald-950/60 dark:border-emerald-900 dark:text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{formSuccess}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            
            {/* Trail Name */}
            <div>
              <label className="block text-xs font-bold text-[#2B3542] dark:text-[#FAF3F3] mb-1">
                {t('form.nameLabel') || 'Nama Jalur Pendakian'} *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t('form.namePlaceholder') || 'Contoh: Gunung Gede via Putri'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/80 dark:bg-[#252C36] text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-[#2B3542] dark:text-[#FAF3F3] mb-1">
                {t('form.locationLabel') || 'Lokasi / Wilayah'} *
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleInputChange}
                placeholder={t('form.locationPlaceholder') || 'Contoh: Cianjur, Jawa Barat'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/80 dark:bg-[#252C36] text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-bold text-[#2B3542] dark:text-[#FAF3F3] mb-1">
                {t('form.difficultyLabel') || 'Tingkat Kesulitan'}
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/80 dark:bg-[#252C36] text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40 cursor-pointer"
              >
                <option value="Mudah">Mudah</option>
                <option value="Sedang">Sedang</option>
                <option value="Sulit">Sulit</option>
                <option value="Sangat Sulit">Sangat Sulit / Ekstrem</option>
              </select>
            </div>

            {/* Distance */}
            <div>
              <label className="block text-xs font-bold text-[#2B3542] dark:text-[#FAF3F3] mb-1">
                {t('form.distanceLabel') || 'Jarak (km)'} *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                name="distance_km"
                value={formData.distance_km}
                onChange={handleInputChange}
                placeholder="Contoh: 12.5"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/80 dark:bg-[#252C36] text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40"
              />
            </div>

            {/* Elevation */}
            <div>
              <label className="block text-xs font-bold text-[#2B3542] dark:text-[#FAF3F3] mb-1">
                {t('form.elevationLabel') || 'Elevasi Puncak (mdpl)'} *
              </label>
              <input
                type="number"
                min="100"
                required
                name="elevation_m"
                value={formData.elevation_m}
                onChange={handleInputChange}
                placeholder="Contoh: 2958"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/80 dark:bg-[#252C36] text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40"
              />
            </div>

            {/* Estimated Time */}
            <div>
              <label className="block text-xs font-bold text-[#2B3542] dark:text-[#FAF3F3] mb-1">
                Estimasi Waktu Tempuh
              </label>
              <input
                type="text"
                name="estimated_time"
                value={formData.estimated_time}
                onChange={handleInputChange}
                placeholder="Contoh: 6-7 Jam"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/80 dark:bg-[#252C36] text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40"
              />
            </div>

          </div>

          {/* Image Selection Tabbed */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-[#2B3542] dark:text-[#FAF3F3]">
              {t('form.imageLabel') || 'Foto / Gambar Jalur'}
            </label>

            <div className="flex flex-wrap items-center gap-2 border-b border-[#E1E5EA] dark:border-[#2C3440] pb-2">
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  imageTab === 'upload'
                    ? 'bg-[#DA7F8F] text-white'
                    : 'text-[#6B7C8C] dark:text-[#A7BBC7] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36]'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Ambil Foto Kamera</span>
              </button>

              <button
                type="button"
                onClick={() => setImageTab('preset')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  imageTab === 'preset'
                    ? 'bg-[#DA7F8F] text-white'
                    : 'text-[#6B7C8C] dark:text-[#A7BBC7] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Pilihan Galeri Gunung</span>
              </button>

              <button
                type="button"
                onClick={() => setImageTab('url')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  imageTab === 'url'
                    ? 'bg-[#DA7F8F] text-white'
                    : 'text-[#6B7C8C] dark:text-[#A7BBC7] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36]'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Tautan URL</span>
              </button>
            </div>

            {imageTab === 'upload' && (
              <div className="p-4 border-2 border-dashed border-[#E1E5EA] dark:border-[#2C3440] rounded-2xl text-center bg-[#FAF3F3]/30 dark:bg-[#252C36]/30">
                <input
                  type="file"
                  id="trail-img-upload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="trail-img-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] text-xs font-bold shadow-sm hover:border-[#DA7F8F] cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#DA7F8F]" />
                  <span>Pilih Gambar dari Komputer</span>
                </label>
                <p className="text-[10px] text-[#A7BBC7] mt-1.5">Mendukung file JPG, PNG, atau WebP maks 5 MB.</p>
              </div>
            )}

            {imageTab === 'preset' && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {presetImages.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPresetImage(preset.url)}
                    className={`relative rounded-xl overflow-hidden aspect-video border-2 transition cursor-pointer group ${
                      formData.image === preset.url ? 'border-[#DA7F8F] ring-2 ring-[#DA7F8F]/40' : 'border-transparent hover:border-[#A7BBC7]'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    <span className="absolute inset-0 bg-black/40 flex items-end p-1.5 text-[10px] font-bold text-white">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {imageTab === 'url' && (
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/80 dark:bg-[#252C36] text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40"
              />
            )}

            {/* Preview Image */}
            {formData.image && (
              <div className="relative inline-block mt-2">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-32 h-20 object-cover rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-rose-600 cursor-pointer"
                  title="Hapus foto"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#2B3542] dark:text-[#FAF3F3] mb-1">
              {t('form.descLabel') || 'Deskripsi Jalur'}
            </label>
            <textarea
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t('form.descPlaceholder') || 'Tuliskan deskripsi jalur, kondisi lintasan, sumber mata air, dan estimasi waktu...'}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/80 dark:bg-[#252C36] text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40"
            />
          </div>

          {/* Coordinates JSON Raw */}
          <div>
            <label className="block text-xs font-bold text-[#2B3542] dark:text-[#FAF3F3] mb-1">
              {t('form.coordinatesLabel') || 'Koordinat Jalur GPS (Array JSON)'}
            </label>
            <textarea
              rows={2}
              name="coordinatesRaw"
              value={formData.coordinatesRaw}
              onChange={handleInputChange}
              placeholder={t('form.coordinatesPlaceholder') || '[[-6.7912, 106.9825], [-6.7850, 106.9870]]'}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/80 dark:bg-[#252C36] text-xs font-mono text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#DA7F8F] text-white hover:bg-[#c96c7d] font-bold shadow-md transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer text-xs"
            >
              <Save className="w-4 h-4" />
              <span>
                {isAdmin
                  ? (editId ? t('btn.save') || 'Simpan Perubahan' : t('btn.add') || 'Tambah Jalur Resmi')
                  : 'Ajukan Jalur Sekarang'}
              </span>
            </button>

            {editId && isAdmin && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] text-[#2B3542] dark:text-[#FAF3F3] text-xs font-semibold hover:bg-[#FAF3F3] dark:hover:bg-[#252C36] cursor-pointer"
              >
                {t('btn.cancel') || 'Batal'}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Existing Trails Table */}
      <div id="trail-list-section" className="bg-white/90 dark:bg-[#1C2129] rounded-3xl p-4 sm:p-5 shadow-lg border border-[#E1E5EA] dark:border-[#2C3440] space-y-3 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E1E5EA] dark:border-[#2C3440] pb-2">
          <h2 className="text-xl font-bold text-[#2B3542] dark:text-[#FAF3F3]">
            Daftar Jalur Pendakian Terdaftar ({trails.length})
          </h2>
          <span className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">
            {isAdmin 
              ? 'Admin dapat menyetujui, mengedit, atau menghapus seluruh jalur.' 
              : 'Daftar jalur pendakian yang telah terverifikasi dan berstatus pengajuan.'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E1E5EA] dark:border-[#2C3440] text-[#6B7C8C] dark:text-[#A7BBC7] text-[10px] uppercase">
                <th className="py-2 px-2">Foto</th>
                <th className="py-2 px-2">Nama Jalur</th>
                <th className="py-2 px-2">Lokasi</th>
                <th className="py-2 px-2">Kesulitan</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2">Jarak</th>
                <th className="py-2 px-2">Elevasi</th>
                <th className="py-2 px-2 text-right">{isAdmin ? 'Aksi Admin' : 'Status & Info'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E5EA] dark:divide-[#2C3440]">
              {trails.map((tItem) => {
                const isPending = tItem.status === 'pending';

                return (
                  <tr key={tItem.id} className="hover:bg-[#FAF3F3] dark:hover:bg-[#252C36] transition">
                    <td className="py-2 px-2">
                      <img
                        src={tItem.image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop'}
                        alt={tItem.name}
                        className="w-8 h-8 rounded-lg object-cover border border-[#E1E5EA]"
                      />
                    </td>
                    <td className="py-2 px-2 font-bold text-[#2B3542] dark:text-[#FAF3F3]">
                      <div className="flex flex-col">
                        <span>{tItem.name}</span>
                        {tItem.submittedBy && (
                          <span className="text-[9px] text-[#A7BBC7] font-normal">
                            Oleh: {tItem.submittedBy}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-2 text-[#6B7C8C] dark:text-[#A7BBC7]">
                      {tItem.location}
                    </td>
                    <td className="py-2 px-2">
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-[#E1E5EA] text-[#2B3542] dark:bg-[#252C36] dark:text-[#FAF3F3]">
                        {tItem.difficulty}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      {isPending ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          <Clock className="w-2.5 h-2.5" />
                          <span>Pending</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          <span>Verified</span>
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-[#6B7C8C] dark:text-[#A7BBC7]">
                      {tItem.distance_km} km
                    </td>
                    <td className="py-2 px-2 text-[#6B7C8C] dark:text-[#A7BBC7]">
                      {tItem.elevation_m} m
                    </td>
                    <td className="py-2 px-2 text-right space-x-1">
                      {isAdmin ? (
                        <div className="inline-flex items-center gap-1">
                          {/* Admin Approve Button for Pending Trails */}
                          {isPending && (
                            <button
                              onClick={() => handleApproveTrail(tItem.id)}
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow-sm transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                              title="Setujui Jalur Ini"
                            >
                              <Check className="w-3 h-3" />
                              <span>Setujui</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleEditClick(tItem)}
                            className="p-1 rounded bg-[#E1E5EA] text-[#DA7F8F] dark:bg-[#252C36] hover:bg-[#A7BBC7]/30 cursor-pointer"
                            title="Edit Jalur"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(tItem.id)}
                            className="p-1 rounded bg-[#E1E5EA] text-rose-600 dark:bg-[#252C36] dark:text-rose-400 hover:bg-rose-100 cursor-pointer"
                            title="Hapus Jalur"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#A7BBC7] italic">
                          {isPending ? 'Menunggu Admin' : 'Terverifikasi'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Confirm Delete */}
      <ModalConfirm
        isOpen={deleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        title={t('modal.deleteTitle')}
        message={t('modal.deleteMessage')}
      />

      {/* ========================================================= */}
      {/* MANAJEMEN MASTER DATA (WILAYAH & KESULITAN) - Admin Only */}
      {/* ========================================================= */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          
          {/* Master 1: Lokasi / Wilayah */}
          <div className="bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#E1E5EA] dark:border-[#2C3440] pb-3">
              <h2 className="text-base font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#DA7F8F]" />
                <span>Master Data Wilayah / Lokasi ({locations?.length || 0})</span>
              </h2>
            </div>

            {/* Add Location Form */}
            <form onSubmit={handleAddLocation} className="flex gap-2">
              <input
                type="text"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                placeholder="Tambah nama wilayah (cth: Sumatera Barat)..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3] dark:bg-[#252C36] text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40"
              />
              <button
                type="submit"
                disabled={!newLocationName.trim()}
                className="px-4 py-2 rounded-xl bg-[#DA7F8F] text-white hover:bg-[#c96c7d] text-xs font-bold transition shrink-0 cursor-pointer disabled:opacity-50"
              >
                Tambah
              </button>
            </form>

            {/* List of Locations */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {(locations || []).map((loc) => {
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
                <AlertCircle className="w-4 h-4 text-[#DA7F8F]" />
                <span>Master Tingkat Kesulitan ({(difficultyLevels || []).length})</span>
              </h2>
            </div>

            {/* Add Difficulty Form */}
            <form onSubmit={handleAddDifficultyLevel} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDiffLabel}
                  onChange={(e) => setNewDiffLabel(e.target.value)}
                  placeholder="Mis: Sangat Ekstrem"
                  className="flex-1 px-3 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3] dark:bg-[#252C36] text-xs focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newDiffLabel.trim()}
                  className="px-4 py-2 rounded-xl bg-[#DA7F8F] text-white font-bold text-xs hover:bg-[#c96c7d] transition disabled:opacity-50 cursor-pointer"
                >
                  Tambah
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#6B7C8C] dark:text-[#A7BBC7] font-semibold">Warna Badge:</span>
                {['emerald', 'amber', 'rose', 'purple', 'stone'].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewDiffBadgeColor(color)}
                    className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all ${
                      newDiffBadgeColor === color ? 'border-[#2B3542] dark:border-[#FAF3F3] scale-110' : 'border-transparent hover:scale-110'
                    } bg-${color}-500`}
                    aria-label={`Set color to ${color}`}
                  />
                ))}
              </div>
            </form>

            {/* Difficulties List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {(difficultyLevels || []).map((diff) => (
                <div key={diff.id} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440]">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${diff.badgeClass}`}>
                    {diff.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteDifficultyLevel(diff.id)}
                    className="p-1 text-rose-600 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                    title="Hapus Tingkat Kesulitan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Camera Feature */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(base64) => {
          setFormData((prev) => ({ ...prev, image: base64 }));
          setImageTab('upload');
        }}
      />

    </div>
  );
}
