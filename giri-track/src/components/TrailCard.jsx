import { MapPin, Navigation, Mountain, Clock, Eye, Edit, Trash2, Lock, Heart, Star, Compass, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTrail } from '../context/TrailContext';
import { useToast } from '../context/ToastContext';

// GiriTrack Signature Earth Tones (Mahogany, Forest Green, Mountain Slate Navy, Deep Ochre)
const EARTH_TONES = ['#452829', '#233729', '#1E2836', '#3A231C'];

export default function TrailCard({ trail, index, onDetail, onEdit, onDelete }) {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const { isFavorite, toggleFavorite } = useTrail();
  const { showToast } = useToast();

  if (!trail) return null;

  const {
    id,
    name,
    location,
    difficulty,
    distance_km,
    elevation_m,
    estimated_time,
    image,
    description,
    likes_count = 0,
    ratingAvg = 0,
    reviews = [],
    status = 'verified',
  } = trail;

  // Determine alternating earth tone accent color
  const colorIndex = typeof index === 'number'
    ? Math.abs(index)
    : typeof id === 'number'
    ? Math.abs(id)
    : Math.abs(String(id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
  const cardBgColor = EARTH_TONES[colorIndex % EARTH_TONES.length];

  const favorited = isFavorite(id);
  const displayRating = Number(ratingAvg) > 0 ? Number(ratingAvg).toFixed(1) : null;

  const getDifficultyBadge = (level) => {
    switch (String(level).toLowerCase()) {
      case 'mudah':
      case 'easy':
        return 'bg-emerald-500/80 text-white border-emerald-400/60';
      case 'sedang':
      case 'moderate':
        return 'bg-amber-500/80 text-white border-amber-400/60';
      case 'sulit':
      case 'hard':
        return 'bg-orange-500/80 text-white border-orange-400/60';
      case 'ekstrem':
      case 'extreme':
        return 'bg-rose-500/85 text-white border-rose-400/60';
      default:
        return 'bg-white/30 text-white border-white/40';
    }
  };

  const getTranslatedDifficulty = (diff) => {
    const dLower = String(diff).toLowerCase();
    if (dLower === 'mudah' || dLower === 'easy') return t('filterSort.easy');
    if (dLower === 'sedang' || dLower === 'moderate') return t('filterSort.moderate');
    if (dLower === 'sulit' || dLower === 'hard') return t('filterSort.hard');
    if (dLower === 'ekstrem' || dLower === 'extreme') return t('filterSort.extreme');
    return diff;
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(id);
    if (!favorited) {
      showToast(`"${name}" ditambahkan ke daftar Favorit Anda! ❤️`, {
        type: 'favorite',
        title: 'Disukai!',
      });
    } else {
      showToast(`"${name}" dihapus dari Favorit`, {
        type: 'info',
      });
    }
  };

  const handleCardClick = () => {
    if (onDetail) {
      onDetail(trail);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 border border-[#E1E5EA]/60 dark:border-[#2C3440]/80 cursor-pointer select-none"
    >
      {/* ========================================================================= */}
      {/* 1. SETENGAH BAGIAN ATAS: FOTO LANSKAP PEMANDANGAN GUNUNG (h-36 sm:h-38) */}
      {/* ========================================================================= */}
      <div className="relative h-36 sm:h-38 w-full overflow-hidden bg-stone-900 shrink-0">
        <img
          src={image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop'}
          alt={name}
          className="h-36 sm:h-38 object-cover w-full group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {/* Subtle dynamic overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />

        {/* Favorite Button (Top Left) */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={`absolute top-2.5 left-2.5 w-7 h-7 rounded-full backdrop-blur-md border shadow-md transition-all duration-200 active:scale-90 flex items-center justify-center z-20 cursor-pointer ${
            favorited
              ? 'bg-[#DA7F8F] border-[#DA7F8F] text-white shadow-[#DA7F8F]/40'
              : 'bg-black/40 hover:bg-black/60 border-white/25 text-white/90 hover:text-[#DA7F8F]'
          }`}
          title={favorited ? 'Hapus dari Favorit' : 'Sukai & Tambah ke Favorit'}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              favorited ? 'fill-white text-white scale-110' : 'text-white/90 hover:scale-110'
            }`}
          />
        </button>

        {/* Status / Rating / Difficulty Badges (Top Right) */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
          {status === 'pending' && (
            <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-[#DA7F8F] text-white shadow-sm backdrop-blur-md">
              Pending
            </span>
          )}

          {displayRating && (
            <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-400 text-amber-950 shadow-sm flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-amber-950" />
              <span>{displayRating}</span>
            </span>
          )}

          <span
            className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border shadow-sm backdrop-blur-md transition-colors duration-200 ${getDifficultyBadge(
              difficulty
            )}`}
          >
            {getTranslatedDifficulty(difficulty)}
          </span>
        </div>

        {/* Location Info (Bottom of Image) */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-white/90 drop-shadow-md z-10">
          <MapPin className="w-3 h-3 text-[#DA7F8F] shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SETENGAH BAGIAN BAWAH: CARD BODY DENGAN AKSEN TANAH KHAS GIRITRACK */}
      {/* ========================================================================= */}
      <div
        style={{ backgroundColor: cardBgColor }}
        className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between text-white relative transition-colors duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/15 pointer-events-none" />

        <div className="relative z-10 flex-1 flex flex-col">
          {/* Label kecil atas */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/70">
              <Compass className="w-3 h-3 text-[#E8D1C5]" />
              <span>{t('common.guide') || 'Panduan Jalur'}</span>
            </div>

            {reviews.length > 0 && (
              <span className="text-[9px] sm:text-[10px] text-white/60 font-medium">
                {reviews.length} ulasan
              </span>
            )}
          </div>

          {/* Judul: Nama panduan/gunung */}
          <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1 mt-0.5 leading-snug drop-shadow-sm group-hover:text-[#FAF3F3] transition-colors">
            {name}
          </h3>

          {/* Deskripsi Singkat */}
          <p className="text-[11px] text-white/80 line-clamp-2 mt-1 leading-relaxed font-normal">
            {description || 'Jalur pendakian gunung indah dengan pemandangan alam memukau dan panorama alam asri.'}
          </p>
        </div>

        {/* Key Metrics Pill Grid */}
        <div className="relative z-10 grid grid-cols-3 gap-1 py-1.5 px-1.5 my-2 rounded-xl bg-black/25 backdrop-blur-sm border border-white/15 text-center text-white">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-0.5 text-white/70 text-[9px] mb-0.5">
              <Navigation className="w-2.5 h-2.5 text-[#E8D1C5]" />
              <span>{t('common.distance')}</span>
            </div>
            <span className="text-xs font-black text-white">
              {distance_km} <span className="text-[9px] font-normal text-white/80">{t('common.km')}</span>
            </span>
          </div>

          <div className="flex flex-col items-center justify-center border-x border-white/15">
            <div className="flex items-center justify-center gap-0.5 text-white/70 text-[9px] mb-0.5">
              <Mountain className="w-2.5 h-2.5 text-[#E8D1C5]" />
              <span>{t('common.elevation')}</span>
            </div>
            <span className="text-xs font-black text-white">
              {elevation_m} <span className="text-[9px] font-normal text-white/80">{t('common.mdpl')}</span>
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-0.5 text-white/70 text-[9px] mb-0.5">
              <Clock className="w-2.5 h-2.5 text-[#E8D1C5]" />
              <span>Waktu</span>
            </div>
            <span className="text-[11px] font-bold text-white truncate max-w-full px-0.5">
              {estimated_time || '5-6 Jam'}
            </span>
          </div>
        </div>

        {/* BAWAH: TOMBOL PILL "JELAJAHI" */}
        <div className="relative z-10 flex items-center gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onDetail) onDetail(trail);
            }}
            className="flex-1 py-1.5 sm:py-2 px-3 rounded-full border border-white/70 text-white bg-transparent font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-300 group-hover:bg-white group-hover:text-stone-900 group-hover:border-white group-hover:shadow-md active:scale-95 cursor-pointer"
          >
            <span>{t('btn.explore') || 'Jelajahi'}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          {/* Admin Edit & Delete Actions */}
          {isAdmin ? (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(trail)}
                  className="p-1.5 rounded-full bg-white/15 hover:bg-white/30 border border-white/20 text-white transition active:scale-95 cursor-pointer shadow-sm"
                  title="Edit Jalur (Akses Admin)"
                >
                  <Edit className="w-3 h-3" />
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(id)}
                  className="p-1.5 rounded-full bg-rose-500/30 hover:bg-rose-600 border border-rose-400/40 text-white transition active:scale-95 cursor-pointer shadow-sm"
                  title="Hapus Jalur (Akses Admin)"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ) : (
            (onEdit || onDelete) && (
              <span
                className="p-1.5 text-white/40 flex items-center"
                title="Aksi Edit/Hapus hanya tersedia untuk Mode Admin"
              >
                <Lock className="w-3 h-3" />
              </span>
            )
          )}
        </div>

      </div>
    </div>
  );
}

