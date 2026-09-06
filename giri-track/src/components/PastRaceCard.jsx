import { MapPin, Star, Users, Map, Trophy, ArrowRight, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const EARTH_TONES = ['#452829', '#233729', '#1E2836', '#3A231C'];

export default function PastRaceCard({ race, index }) {
  const { showToast } = useToast();

  if (!race) return null;

  const {
    id,
    name,
    location,
    image,
    finishersCount,
    rating,
    reviewQuote,
    longestDistance,
    courseRecord,
  } = race;

  const colorIndex = typeof index === 'number'
    ? Math.abs(index)
    : Math.abs(String(id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
  const cardBgColor = EARTH_TONES[colorIndex % EARTH_TONES.length];

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/races/${id}?status=completed`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-[#E1E5EA]/60 dark:border-[#2C3440]/80 cursor-pointer select-none h-full"
    >
      {/* 1. BAGIAN ATAS: FOTO LANSKAP (h-56 object-cover) */}
      <div className="relative h-56 w-full overflow-hidden bg-stone-900">
        <img
          src={image}
          alt={name}
          className="h-56 object-cover w-full group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />

        {/* Status & Rating Badges (Top Right) */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-20">
          <span className="px-2.5 py-1 text-xs font-black rounded-full bg-amber-400 text-amber-950 shadow-sm flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-950" />
            <span>{rating}</span>
          </span>

          <span className="px-3 py-1 text-xs font-bold rounded-full border shadow-sm backdrop-blur-md transition-colors duration-200 bg-emerald-500/80 text-white border-emerald-400/60">
            SELESAI
          </span>
        </div>

        {/* Location Info (Bottom of Image) */}
        <div className="absolute bottom-3.5 left-4 right-4 flex items-center gap-1.5 text-xs font-medium text-white/90 drop-shadow-md z-10">
          <MapPin className="w-3.5 h-3.5 text-[#DA7F8F] shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </div>

      {/* 2. BAGIAN BAWAH: CARD BODY DENGAN AKSEN TANAH */}
      <div
        style={{ backgroundColor: cardBgColor }}
        className="p-5 sm:p-6 flex-1 flex flex-col justify-between text-white relative transition-colors duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/15 pointer-events-none" />

        <div className="relative z-10 flex-1 flex flex-col">
          {/* Label kecil atas */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/70">
            <Quote className="w-3.5 h-3.5 text-[#E8D1C5]" />
            <span>KILAS BALIK LOMBA</span>
          </div>

          {/* Judul Event */}
          <h3 className="font-bold text-white text-xl line-clamp-2 mt-1 leading-tight drop-shadow-sm group-hover:text-[#FAF3F3] transition-colors">
            {name}
          </h3>

          {/* Kutipan Ulasan */}
          <p className="text-xs text-white/80 line-clamp-3 mt-3 italic leading-relaxed font-normal flex-1">
            {reviewQuote}
          </p>
        </div>

        {/* Key Metrics Pill Grid */}
        <div className="relative z-10 grid grid-cols-3 gap-2 py-2.5 px-2 my-4 rounded-2xl bg-black/25 backdrop-blur-sm border border-white/15 text-center text-white">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-1 text-white/70 text-[10px] sm:text-[11px] mb-0.5">
              <Users className="w-3 h-3 text-[#E8D1C5]" />
              <span className="truncate">Finisher</span>
            </div>
            <span className="text-xs sm:text-sm font-black text-white truncate px-1 w-full">
              {finishersCount}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center border-x border-white/15">
            <div className="flex items-center justify-center gap-1 text-white/70 text-[10px] sm:text-[11px] mb-0.5">
              <Map className="w-3 h-3 text-[#E8D1C5]" />
              <span className="truncate">Jarak</span>
            </div>
            <span className="text-xs sm:text-sm font-black text-white truncate px-1 w-full">
              {longestDistance}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-1 text-white/70 text-[10px] sm:text-[11px] mb-0.5">
              <Trophy className="w-3 h-3 text-[#E8D1C5]" />
              <span className="truncate">Rekor</span>
            </div>
            <span className="text-xs sm:text-sm font-black text-white truncate px-1 w-full">
              {courseRecord}
            </span>
          </div>
        </div>

        {/* TOMBOL PILL */}
        <div className="relative z-10 flex items-center pt-1 mt-auto">
          <button
            type="button"
            className="w-full py-2.5 px-5 rounded-full border-2 border-white/70 text-white bg-transparent font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 group-hover:bg-white group-hover:text-stone-900 group-hover:border-white group-hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <span>Lihat Galeri & Hasil</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </div>
  );
}
