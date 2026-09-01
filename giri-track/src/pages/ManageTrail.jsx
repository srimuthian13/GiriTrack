import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Settings, Plus, Save, Edit, Trash2, CheckCircle2, AlertCircle, RefreshCw, Upload, Image as ImageIcon, Link as LinkIcon, X } from 'lucide-react';
import { useTrail } from '../context/TrailContext';
import { useLanguage } from '../context/LanguageContext';
import ModalConfirm from '../components/ModalConfirm';

export default function ManageTrail() {
  const { trails, addTrail, updateTrail, deleteTrail, resetTrails } = useTrail();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

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
    estimated_time: '',
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

  // Effect to prefill form if editing
  useEffect(() => {
    if (editId) {
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
            coordinatesRaw: JSON.stringify(existing.coordinates || []),
          });
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [editId, trails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Local File Upload Handler (FileReader -> Data URL)
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
    };

    if (editId) {
      updateTrail(editId, payload);
      setFormSuccess(t('modal.successEdit'));
      resetForm();
    } else {
      addTrail(payload);
      setFormSuccess(t('modal.successAdd'));
      resetForm();
    }

    setTimeout(() => setFormSuccess(''), 4000);
  };

  const handleEditClick = (trail) => {
    setSearchParams({ editId: trail.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id) => {
    setSelectedIdToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedIdToDelete) {
      deleteTrail(selectedIdToDelete);
      setDeleteModalOpen(false);
      setSelectedIdToDelete(null);
      if (editId === selectedIdToDelete) {
        resetForm();
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 pb-12 text-[#452829] dark:text-[#F3E8DF]">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DBC4B6] dark:border-[#57595B]/40 pb-6">
        <div>
          <h1 className="text-3xl font-black text-[#452829] dark:text-[#F3E8DF] flex items-center gap-3">
            <Settings className="w-8 h-8 text-[#452829] dark:text-[#E8D1C5]" />
            <span>{t('nav.manage')}</span>
          </h1>
          <p className="text-sm text-[#57595B] dark:text-[#E8D1C5] mt-1">
            Tambah, edit, dan hapus data jalur pendakian GiriTrack.
          </p>
        </div>

        <button
          onClick={resetTrails}
          className="px-4 py-2 text-xs font-bold rounded-xl border border-[#DBC4B6] dark:border-[#57595B]/40 text-[#452829] dark:text-[#E8D1C5] hover:bg-[#EFE4DC] dark:hover:bg-[#3F2728] transition flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Data Awal Default</span>
        </button>
      </div>

      {/* Form Container */}
      <div className="bg-white dark:bg-[#2D1C1D] rounded-3xl p-6 sm:p-8 shadow-lg border border-[#DBC4B6] dark:border-[#57595B]/40 space-y-6">
        <div className="flex items-center justify-between border-b border-[#DBC4B6]/60 dark:border-[#57595B]/40 pb-4">
          <h2 className="text-xl font-bold text-[#452829] dark:text-[#F3E8DF] flex items-center gap-2">
            {editId ? <Edit className="w-5 h-5 text-amber-600" /> : <Plus className="w-5 h-5 text-[#452829] dark:text-[#E8D1C5]" />}
            <span>{editId ? t('form.editTitle') : t('form.addTitle')}</span>
          </h2>

          {editId && (
            <button
              onClick={resetForm}
              className="text-xs font-bold text-[#57595B] dark:text-[#E8D1C5] hover:underline cursor-pointer"
            >
              Batal Edit (Tambah Baru)
            </button>
          )}
        </div>

        {/* Error / Success Notifications */}
        {formError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {formSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 dark:bg-emerald-950/60 dark:border-emerald-900 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{formSuccess}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            
            {/* Trail Name */}
            <div>
              <label className="block text-xs font-bold text-[#452829] dark:text-[#F3E8DF] mb-1">
                {t('form.nameLabel')} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t('form.namePlaceholder')}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DBC4B6] dark:border-[#57595B]/40 bg-[#EFE4DC]/40 dark:bg-[#3F2728]/40 text-xs text-[#452829] dark:text-[#F3E8DF] focus:outline-none focus:ring-2 focus:ring-[#452829]"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-[#452829] dark:text-[#F3E8DF] mb-1">
                {t('form.locationLabel')} *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder={t('form.locationPlaceholder')}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DBC4B6] dark:border-[#57595B]/40 bg-[#EFE4DC]/40 dark:bg-[#3F2728]/40 text-xs text-[#452829] dark:text-[#F3E8DF] focus:outline-none focus:ring-2 focus:ring-[#452829]"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-bold text-[#452829] dark:text-[#F3E8DF] mb-1">
                {t('form.difficultyLabel')}
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DBC4B6] dark:border-[#57595B]/40 bg-[#EFE4DC]/40 dark:bg-[#3F2728]/40 text-xs text-[#452829] dark:text-[#F3E8DF] focus:outline-none focus:ring-2 focus:ring-[#452829] cursor-pointer"
              >
                <option value="Mudah">Mudah (Easy)</option>
                <option value="Sedang">Sedang (Moderate)</option>
                <option value="Sulit">Sulit (Hard)</option>
                <option value="Ekstrem">Ekstrem (Extreme)</option>
              </select>
            </div>

            {/* Distance */}
            <div>
              <label className="block text-xs font-bold text-[#452829] dark:text-[#F3E8DF] mb-1">
                {t('form.distanceLabel')} *
              </label>
              <input
                type="number"
                step="0.1"
                name="distance_km"
                value={formData.distance_km}
                onChange={handleInputChange}
                placeholder={t('form.distancePlaceholder')}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DBC4B6] dark:border-[#57595B]/40 bg-[#EFE4DC]/40 dark:bg-[#3F2728]/40 text-xs text-[#452829] dark:text-[#F3E8DF] focus:outline-none focus:ring-2 focus:ring-[#452829]"
              />
            </div>

            {/* Elevation */}
            <div>
              <label className="block text-xs font-bold text-[#452829] dark:text-[#F3E8DF] mb-1">
                {t('form.elevationLabel')} *
              </label>
              <input
                type="number"
                name="elevation_m"
                value={formData.elevation_m}
                onChange={handleInputChange}
                placeholder={t('form.elevationPlaceholder')}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DBC4B6] dark:border-[#57595B]/40 bg-[#EFE4DC]/40 dark:bg-[#3F2728]/40 text-xs text-[#452829] dark:text-[#F3E8DF] focus:outline-none focus:ring-2 focus:ring-[#452829]"
              />
            </div>

            {/* Estimated Time */}
            <div>
              <label className="block text-xs font-bold text-[#452829] dark:text-[#F3E8DF] mb-1">
                Estimasi Waktu Pendakian
              </label>
              <input
                type="text"
                name="estimated_time"
                value={formData.estimated_time}
                onChange={handleInputChange}
                placeholder="Contoh: 6-7 Jam"
                className="w-full px-3.5 py-2 rounded-xl border border-[#DBC4B6] dark:border-[#57595B]/40 bg-[#EFE4DC]/40 dark:bg-[#3F2728]/40 text-xs text-[#452829] dark:text-[#F3E8DF] focus:outline-none focus:ring-2 focus:ring-[#452829]"
              />
            </div>

          </div>

          {/* Image Selection & Upload System Section */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#EFE4DC]/50 dark:bg-[#3F2728]/40 border border-[#DBC4B6]/50 dark:border-[#57595B]/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="block text-xs font-bold text-[#452829] dark:text-[#F3E8DF] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#452829] dark:text-[#E8D1C5]" />
                <span>Foto Banner Jalur Pendakian</span>
              </label>

              {/* Image Input Mode Tabs */}
              <div className="flex items-center gap-1 bg-white dark:bg-[#2D1C1D] p-1 rounded-xl border border-[#DBC4B6]/50 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    imageTab === 'upload'
                      ? 'bg-[#452829] text-[#F3E8DF] dark:bg-[#E8D1C5] dark:text-[#452829]'
                      : 'text-[#57595B] dark:text-[#E8D1C5]'
                  }`}
                >
                  Unggah File
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    imageTab === 'url'
                      ? 'bg-[#452829] text-[#F3E8DF] dark:bg-[#E8D1C5] dark:text-[#452829]'
                      : 'text-[#57595B] dark:text-[#E8D1C5]'
                  }`}
                >
                  URL Gambar
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('preset')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    imageTab === 'preset'
                      ? 'bg-[#452829] text-[#F3E8DF] dark:bg-[#E8D1C5] dark:text-[#452829]'
                      : 'text-[#57595B] dark:text-[#E8D1C5]'
                  }`}
                >
                  Rekomendasi
                </button>
              </div>
            </div>

            {/* Tab 1: Local File Upload */}
            {imageTab === 'upload' && (
              <div className="space-y-2">
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#DBC4B6] dark:border-[#57595B] rounded-2xl bg-white dark:bg-[#2D1C1D] hover:bg-[#EFE4DC]/40 cursor-pointer transition text-center">
                  <Upload className="w-7 h-7 text-[#452829] dark:text-[#E8D1C5] mb-1" />
                  <span className="text-xs font-bold text-[#452829] dark:text-[#F3E8DF]">
                    Pilih File Gambar dari Perangkat Anda
                  </span>
                  <span className="text-[11px] text-[#57595B] dark:text-[#E8D1C5] mt-0.5">
                    Format JPG, PNG, WebP (Maksimal 5 MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Tab 2: Direct URL Input */}
            {imageTab === 'url' && (
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#57595B] dark:text-[#E8D1C5]" />
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#DBC4B6] dark:border-[#57595B]/40 bg-white dark:bg-[#2D1C1D] text-xs text-[#452829] dark:text-[#F3E8DF] focus:outline-none focus:ring-2 focus:ring-[#452829]"
                />
              </div>
            )}

            {/* Tab 3: Preset Mountain Images Picker */}
            {imageTab === 'preset' && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {presetImages.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPresetImage(preset.url)}
                    className={`relative rounded-xl overflow-hidden h-16 border-2 transition text-left group ${
                      formData.image === preset.url
                        ? 'border-[#452829] dark:border-[#E8D1C5] ring-2 ring-[#452829]'
                        : 'border-transparent hover:border-[#DBC4B6]'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                      <span className="text-[10px] font-bold text-white leading-tight truncate">
                        {preset.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Live Image Preview Card */}
            {formData.image && (
              <div className="relative rounded-2xl overflow-hidden border border-[#DBC4B6] dark:border-[#57595B]/40 h-32 sm:h-40 w-full group">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-between p-3 text-white">
                  <span className="text-xs font-bold bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                    Pratinjau Foto Banner
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer"
                    title="Hapus Gambar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#452829] dark:text-[#F3E8DF] mb-1">
              {t('form.descLabel')}
            </label>
            <textarea
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t('form.descPlaceholder')}
              className="w-full px-3.5 py-2 rounded-xl border border-[#DBC4B6] dark:border-[#57595B]/40 bg-[#EFE4DC]/40 dark:bg-[#3F2728]/40 text-xs text-[#452829] dark:text-[#F3E8DF] focus:outline-none focus:ring-2 focus:ring-[#452829]"
            />
          </div>

          {/* Coordinates JSON Raw */}
          <div>
            <label className="block text-xs font-bold text-[#452829] dark:text-[#F3E8DF] mb-1">
              {t('form.coordinatesLabel')}
            </label>
            <textarea
              rows={2}
              name="coordinatesRaw"
              value={formData.coordinatesRaw}
              onChange={handleInputChange}
              placeholder={t('form.coordinatesPlaceholder')}
              className="w-full px-3.5 py-2 rounded-xl border border-[#DBC4B6] dark:border-[#57595B]/40 bg-[#EFE4DC]/40 dark:bg-[#3F2728]/40 text-xs font-mono text-[#452829] dark:text-[#F3E8DF] focus:outline-none focus:ring-2 focus:ring-[#452829]"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#452829] text-[#F3E8DF] hover:bg-[#341e1f] dark:bg-[#E8D1C5] dark:text-[#452829] font-bold shadow-md transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer text-xs"
            >
              <Save className="w-4 h-4" />
              <span>{editId ? t('btn.save') : t('btn.add')}</span>
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl border border-[#DBC4B6] dark:border-[#57595B]/40 text-[#452829] dark:text-[#E8D1C5] text-xs font-semibold hover:bg-[#EFE4DC] dark:hover:bg-[#3F2728] cursor-pointer"
              >
                {t('btn.cancel')}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Existing Trails Table */}
      <div className="bg-white dark:bg-[#2D1C1D] rounded-3xl p-6 shadow-lg border border-[#DBC4B6] dark:border-[#57595B]/40 space-y-4">
        <h2 className="text-xl font-bold text-[#452829] dark:text-[#F3E8DF]">
          Daftar Jalur Pendakian Terdaftar ({trails.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#DBC4B6] dark:border-[#57595B]/40 text-[#57595B] dark:text-[#E8D1C5]">
                <th className="py-3 px-3">Foto</th>
                <th className="py-3 px-3">Nama Jalur</th>
                <th className="py-3 px-3">Lokasi</th>
                <th className="py-3 px-3">Kesulitan</th>
                <th className="py-3 px-3">Jarak</th>
                <th className="py-3 px-3">Elevasi</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DBC4B6]/40 dark:divide-[#57595B]/30">
              {trails.map((tItem) => (
                <tr key={tItem.id} className="hover:bg-[#EFE4DC]/50 dark:hover:bg-[#3F2728]/50 transition">
                  <td className="py-2.5 px-3">
                    <img
                      src={tItem.image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop'}
                      alt={tItem.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#DBC4B6]"
                    />
                  </td>
                  <td className="py-3 px-3 font-bold text-[#452829] dark:text-[#F3E8DF]">
                    {tItem.name}
                  </td>
                  <td className="py-3 px-3 text-[#57595B] dark:text-[#E8D1C5]">
                    {tItem.location}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFE4DC] text-[#452829] dark:bg-[#3F2728] dark:text-[#E8D1C5]">
                      {tItem.difficulty}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#57595B] dark:text-[#E8D1C5]">
                    {tItem.distance_km} km
                  </td>
                  <td className="py-3 px-3 text-[#57595B] dark:text-[#E8D1C5]">
                    {tItem.elevation_m} mdpl
                  </td>
                  <td className="py-3 px-3 text-right space-x-1">
                    <button
                      onClick={() => handleEditClick(tItem)}
                      className="p-1.5 rounded-lg bg-[#EFE4DC] text-amber-700 dark:bg-[#3F2728] dark:text-amber-400 hover:bg-amber-100 cursor-pointer"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(tItem.id)}
                      className="p-1.5 rounded-lg bg-[#EFE4DC] text-rose-700 dark:bg-[#3F2728] dark:text-rose-400 hover:bg-rose-100 cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Confirm Delete */}
      <ModalConfirm
        isOpen={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
}
