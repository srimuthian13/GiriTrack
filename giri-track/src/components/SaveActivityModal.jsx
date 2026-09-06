import { useState, useRef } from 'react';
import { X, MapPin, Clock, Camera, FileText, Image as ImageIcon, CheckCircle2, ChevronRight, Navigation, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SaveActivityModal({ 
  isOpen, 
  onClose, 
  onSave, 
  durationSeconds, 
  distanceKm, 
  avgSpeed,
  defaultTitle = ''
}) {
  const { t } = useLanguage();
  const [title, setTitle] = useState(defaultTitle || `Jelajah Bebas - ${new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}`);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const estimatedCalories = Math.round(distanceKm * 65); // Basic estimation: 65 kcal per km

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result]);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    });
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveDefaults = () => {
    onSave({
      title: defaultTitle || `Jelajah Bebas - ${new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}`,
      notes: '',
      photos: []
    });
  };

  const handleSaveCustom = () => {
    onSave({
      title,
      notes,
      photos
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#1C2129] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300 border border-[#E1E5EA] dark:border-[#2C3440] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/50 dark:bg-[#252C36]/50">
          <h2 className="text-xl font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <span>Selesaikan Aktivitas</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[#6B7C8C] dark:text-[#A7BBC7]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#DA7F8F]/20 flex items-center justify-center shrink-0">
                <Navigation className="w-5 h-5 text-[#DA7F8F]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#6B7C8C] dark:text-[#A7BBC7] uppercase">Jarak</p>
                <p className="text-lg font-black text-[#2B3542] dark:text-[#FAF3F3] leading-none">{distanceKm} <span className="text-xs font-normal">km</span></p>
              </div>
            </div>
            
            <div className="p-3 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#6B7C8C] dark:text-[#A7BBC7] uppercase">Waktu</p>
                <p className="text-lg font-black text-[#2B3542] dark:text-[#FAF3F3] leading-none">{formatTime(durationSeconds)}</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#6B7C8C] dark:text-[#A7BBC7] uppercase">Kecepatan</p>
                <p className="text-lg font-black text-[#2B3542] dark:text-[#FAF3F3] leading-none">{avgSpeed} <span className="text-xs font-normal">km/h</span></p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#6B7C8C] dark:text-[#A7BBC7] uppercase">Kalori</p>
                <p className="text-lg font-black text-[#2B3542] dark:text-[#FAF3F3] leading-none">~{estimatedCalories} <span className="text-xs font-normal">kcal</span></p>
              </div>
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#2B3542] dark:text-[#FAF3F3]">Nama Aktivitas</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-white dark:bg-[#1C2129] text-sm text-[#2B3542] dark:text-[#FAF3F3] focus:ring-2 focus:ring-[#DA7F8F] outline-none transition-all"
              placeholder="Cth: Latihan Trail Gn. Manglayang"
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#2B3542] dark:text-[#FAF3F3]">Foto Dokumentasi</label>
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-[#E1E5EA] dark:border-[#2C3440] flex flex-col items-center justify-center gap-1 text-[#6B7C8C] dark:text-[#A7BBC7] hover:border-[#DA7F8F] hover:text-[#DA7F8F] hover:bg-[#DA7F8F]/5 transition-all cursor-pointer"
              >
                <Camera className="w-6 h-6" />
                <span className="text-[10px] font-bold">Tambah Foto</span>
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload}
                accept="image/*" 
                multiple 
                className="hidden" 
              />

              {photos.map((photo, i) => (
                <div key={i} className="relative shrink-0 w-24 h-24 rounded-xl overflow-hidden group border border-[#E1E5EA] dark:border-[#2C3440]">
                  <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Catatan Singkat (Opsional)</span>
            </label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-white dark:bg-[#1C2129] text-sm text-[#2B3542] dark:text-[#FAF3F3] focus:ring-2 focus:ring-[#DA7F8F] outline-none transition-all resize-none"
              placeholder="Bagaimana kondisi cuaca atau rute hari ini?"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[#E1E5EA] dark:border-[#2C3440] flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSaveDefaults}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-[#6B7C8C] dark:text-[#A7BBC7] bg-[#FAF3F3] dark:bg-[#252C36] hover:bg-[#E1E5EA] dark:hover:bg-[#2C3440] transition-colors text-sm"
          >
            Simpan Tanpa Ubah
          </button>
          <button
            onClick={handleSaveCustom}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-[#DA7F8F] hover:bg-[#c96c7d] transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
          >
            <span>Simpan Aktivitas</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
