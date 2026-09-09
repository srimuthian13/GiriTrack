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
      className="group relative flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 border border-[#E1E5EA]/60 dark:border-[#2C3440]/80 cursor-pointer select-none h-full"
    >
      {/* 1. BAGIAN ATAS: FOTO LANSKAP (h-36 sm:h-38) */}
      <div className="relative h-36 sm:h-38 w-full overflow-hidden bg-stone-900 shrink-0">
        <img
          src={image}
          alt={name}
          className="h-36 sm:h-38 object-cover w-full group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />

        {/* Status & Rating Badges (Top Right) */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
          <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-400 text-amber-950 shadow-sm flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-amber-950" />
            <span>{rating}</span>
          </span>

          <span className="px-2 py-0.5 text-[9px] font-bold rounded-full border shadow-sm backdrop-blur-md bg-emerald-500/80 text-white border-emerald-400/60">
            SELESAI
          </span>
        </div>

        {/* Location Info (Bottom of Image) */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-white/90 drop-shadow-md z-10">
          <MapPin className="w-3 h-3 text-[#DA7F8F] shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </div>

      {/* 2. BAGIAN BAWAH: CARD BODY DENGAN AKSEN TANAH */}
      <div
        style={{ backgroundColor: cardBgColor }}
        className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between text-white relative transition-colors duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/15 pointer-events-none" />

        <div className="relative z-10 flex-1 flex flex-col">
          {/* Label kecil atas */}
          <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/70">
            <Quote className="w-3 h-3 text-[#E8D1C5]" />
            <span>KILAS BALIK LOMBA</span>
          </div>

          {/* Judul Event */}
          <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1 mt-0.5 leading-snug drop-shadow-sm group-hover:text-[#FAF3F3] transition-colors">
            {name}
          </h3>

          {/* Kutipan Ulasan */}
          <p className="text-[11px] text-white/80 line-clamp-2 mt-1 italic leading-relaxed font-normal flex-1">
            "{reviewQuote}"
          </p>
        </div>

        {/* Key Metrics Pill Grid */}
        <div className="relative z-10 grid grid-cols-3 gap-1 py-1.5 px-1.5 my-2 rounded-xl bg-black/25 backdrop-blur-sm border border-white/15 text-center text-white">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-0.5 text-white/70 text-[9px] mb-0.5">
              <Users className="w-2.5 h-2.5 text-[#E8D1C5]" />
              <span className="truncate">Finisher</span>
            </div>
            <span className="text-xs font-black text-white truncate px-0.5 w-full">
              {finishersCount}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center border-x border-white/15">
            <div className="flex items-center justify-center gap-0.5 text-white/70 text-[9px] mb-0.5">
              <Map className="w-2.5 h-2.5 text-[#E8D1C5]" />
              <span className="truncate">Jarak</span>
            </div>
            <span className="text-xs font-black text-white truncate px-0.5 w-full">
              {longestDistance}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-0.5 text-white/70 text-[9px] mb-0.5">
              <Trophy className="w-2.5 h-2.5 text-[#E8D1C5]" />
              <span className="truncate">Rekor</span>
            </div>
            <span className="text-xs font-black text-white truncate px-0.5 w-full">
              {courseRecord}
            </span>
          </div>
        </div>

        {/* TOMBOL PILL */}
        <div className="relative z-10 flex items-center pt-0.5 mt-auto">
          <button
            type="button"
            className="w-full py-1.5 sm:py-2 px-3 rounded-full border border-white/70 text-white bg-transparent font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-300 group-hover:bg-white group-hover:text-stone-900 group-hover:border-white group-hover:shadow-md active:scale-95 cursor-pointer"
          >
            <span>Lihat Hasil & Galeri</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </div>
  );
}
