import { MapPin, Navigation, Mountain, Clock, Eye, Edit, Trash2, Lock, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTrail } from '../context/TrailContext';

export default function TrailCard({ trail, onDetail, onEdit, onDelete }) {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const { isFavorite, toggleFavorite } = useTrail();

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
  } = trail;

  const favorited = isFavorite(id);

  const getDifficultyBadge = (level) => {
    switch (String(level).toLowerCase()) {
      case 'mudah':
      case 'easy':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
      case 'sedang':
      case 'moderate':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
      case 'sulit':
      case 'hard':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-300';
      case 'ekstrem':
      case 'extreme':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
      default:
        return 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300 border-stone-300';
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
  };

  return (
    <div className="bg-white dark:bg-[#2D1C1D] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 border border-[#DBC4B6] hover:border-[#452829]/50 dark:border-[#57595B]/40 dark:hover:border-[#E8D1C5]/50 flex flex-col group text-[#452829] dark:text-[#F3E8DF] relative">
      
      {/* Thumbnail Header */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#57595B]/20">
        <img
          src={image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Favorite Love Button (Top Left) */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 left-3 p-2 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md border border-white/40 dark:border-stone-700/60 shadow-md transition-transform duration-150 active:scale-95 hover:scale-110 cursor-pointer flex items-center gap-1 z-10"
          title={favorited ? 'Hapus dari Jalur Favorit' : 'Sukai & Tambah ke Favorit'}
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-200 ${
              favorited
                ? 'fill-rose-500 text-rose-500'
                : 'text-stone-500 hover:text-rose-500 dark:text-stone-300'
            }`}
          />
          <span className="text-[11px] font-extrabold text-stone-800 dark:text-stone-100 pr-0.5">
            {likes_count}
          </span>
        </button>

        {/* Difficulty Badge (Top Right) */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full border shadow-sm backdrop-blur-md transition-colors duration-200 ${getDifficultyBadge(
              difficulty
            )}`}
          >
            {getTranslatedDifficulty(difficulty)}
          </span>
        </div>

        {/* Location Badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1 text-xs font-medium text-stone-200">
          <MapPin className="w-3.5 h-3.5 text-[#E8D1C5] shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#452829] dark:text-[#F3E8DF] group-hover:text-[#57595B] dark:group-hover:text-[#E8D1C5] transition-colors duration-200 line-clamp-1 mb-2">
            {name}
          </h3>

          <p className="text-xs text-[#57595B] dark:text-[#E8D1C5] line-clamp-2 mb-4">
            {description || 'Jalur pendakian gunung indah dengan pemandangan alam memukau.'}
          </p>
        </div>

        {/* Key Metrics Sub-box */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#DBC4B6]/60 dark:border-[#57595B]/40 text-center mb-4 bg-[#EFE4DC] dark:bg-[#3F2728] rounded-xl transition-colors duration-200">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[#57595B] dark:text-[#E8D1C5] text-xs mb-0.5">
              <Navigation className="w-3.5 h-3.5 text-[#452829] dark:text-[#E8D1C5]" />
              <span>{t('common.distance')}</span>
            </div>
            <span className="text-sm font-bold text-[#452829] dark:text-[#F3E8DF]">
              {distance_km} <span className="text-xs font-normal">{t('common.km')}</span>
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-[#DBC4B6]/80 dark:border-[#57595B]/50">
            <div className="flex items-center gap-1 text-[#57595B] dark:text-[#E8D1C5] text-xs mb-0.5">
              <Mountain className="w-3.5 h-3.5 text-[#452829] dark:text-[#E8D1C5]" />
              <span>{t('common.elevation')}</span>
            </div>
            <span className="text-sm font-bold text-[#452829] dark:text-[#F3E8DF]">
              {elevation_m} <span className="text-xs font-normal">{t('common.mdpl')}</span>
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[#57595B] dark:text-[#E8D1C5] text-xs mb-0.5">
              <Clock className="w-3.5 h-3.5 text-[#452829] dark:text-[#E8D1C5]" />
              <span>Waktu</span>
            </div>
            <span className="text-xs font-bold text-[#452829] dark:text-[#F3E8DF] truncate max-w-full px-1">
              {estimated_time || '5-6 Jam'}
            </span>
          </div>
        </div>

        {/* Action Buttons with Role-based Visibility */}
        <div className="flex items-center gap-2 pt-1">
          {/* Detail Button */}
          {onDetail && (
            <button
              onClick={() => onDetail(trail)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-[#452829] text-[#F3E8DF] hover:bg-[#341e1f] dark:bg-[#E8D1C5] dark:text-[#452829] dark:hover:bg-[#dfc2b3] transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t('btn.detail')}</span>
            </button>
          )}

          {/* Admin Edit & Delete buttons */}
          {isAdmin ? (
            <>
              {onEdit && (
                <button
                  onClick={() => onEdit(trail)}
                  className="p-2 text-xs font-semibold rounded-xl bg-[#EFE4DC] text-[#452829] hover:bg-[#DBC4B6] dark:bg-[#3F2728] dark:text-[#E8D1C5] dark:hover:bg-[#4a2e2f] transition-all duration-200 active:scale-95 cursor-pointer"
                  title="Edit Jalur (Admin Access)"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => onDelete(id)}
                  className="p-2 text-xs font-semibold rounded-xl bg-[#EFE4DC] text-rose-700 hover:bg-rose-100 dark:bg-[#3F2728] dark:text-rose-300 dark:hover:bg-rose-950 transition-all duration-200 active:scale-95 cursor-pointer"
                  title="Hapus Jalur (Admin Access)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            (onEdit || onDelete) && (
              <span
                className="p-2 text-[10px] text-[#57595B] dark:text-[#E8D1C5]/60 flex items-center gap-1"
                title="Aksi Edit/Hapus hanya tersedia untuk Mode Admin"
              >
                <Lock className="w-3.5 h-3.5" />
              </span>
            )
          )}
        </div>

      </div>
    </div>
  );
}
