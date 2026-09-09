import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Mountain, Flag, ArrowRight, Activity, Trophy, ChevronLeft, ChevronRight, Target, Users, Compass, Sparkles } from 'lucide-react';
import { useRace } from '../context/RaceContext';

// GiriTrack Signature Earth Tones
const EARTH_TONES = ['#452829', '#233729', '#1E2836', '#3A231C'];

export default function UpcomingRaceSection() {
  const { races } = useRace();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  // Batasi hanya 5 kartu event lomba untuk halaman beranda
  const displayRaces = (races || []).slice(0, 5);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Check scroll positions for enabling/disabling arrows
  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    // Estimate active index based on card width
    const cardWidth = 290;
    const index = Math.round(scrollLeft / (cardWidth + 20));
    setActiveIndex(Math.max(0, Math.min(index, displayRaces.length)));
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      checkScroll();
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [displayRaces.length]);

  const handleScroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = 290;
    const scrollAmount = (cardWidth + 20) * (direction === 'left' ? -1 : 1);

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  // Helper to calculate days remaining
  const getDaysRemaining = (dateStr) => {
    if (!dateStr) return null;
    const now = new Date().getTime();
    const target = new Date(dateStr).getTime();
    const diff = target - now;
    if (diff <= 0) return 'Sedang Berlangsung';
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `${days} Hari Lagi`;
  };

  if (!displayRaces || displayRaces.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 my-16">
      
      {/* 1. Header Section with Navigation Arrows */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full bg-[#DA7F8F]/10 text-[#DA7F8F] border border-[#DA7F8F]/20 text-xs font-bold uppercase tracking-wider">
            <Flag className="w-3.5 h-3.5" />
            <span>Event Unggulan (5 Agenda Terpilih)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2B3542] dark:text-[#FAF3F3] tracking-tight">
            Kompetisi Lari Gunung 2026
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7C8C] dark:text-[#A7BBC7] max-w-xl mt-1">
            Geser untuk melihat 5 event pilihan kami, atau buka katalog lengkap untuk melihat seluruh agenda.
          </p>
        </div>

        {/* Carousel Arrow Controls & Catalog Link */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/races"
            className="text-xs font-bold text-[#DA7F8F] hover:text-[#c96c7d] hover:underline flex items-center gap-1 transition-colors mr-1"
          >
            <span>Buka Katalog Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`p-2.5 rounded-full border transition-all duration-200 cursor-pointer active:scale-95 shadow-sm ${
                canScrollLeft
                  ? 'bg-white dark:bg-[#1C2129] border-[#E1E5EA] dark:border-[#2C3440] text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36] hover:border-[#DA7F8F]'
                  : 'bg-stone-100 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-300 dark:text-stone-700 cursor-not-allowed opacity-50'
              }`}
              title="Geser ke Kiri"
              aria-label="Previous Races"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={`p-2.5 rounded-full border transition-all duration-200 cursor-pointer active:scale-95 shadow-sm ${
                canScrollRight
                  ? 'bg-white dark:bg-[#1C2129] border-[#E1E5EA] dark:border-[#2C3440] text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36] hover:border-[#DA7F8F]'
                  : 'bg-stone-100 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-300 dark:text-stone-700 cursor-not-allowed opacity-50'
              }`}
              title="Geser ke Kanan"
              aria-label="Next Races"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Scrollable Track (5 Race Cards + Catalog CTA) */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-5 overflow-x-auto no-scrollbar scroll-smooth py-3 px-1 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayRaces.map((race, index) => {
          const colorIndex = Math.abs(index);
          const cardBgColor = EARTH_TONES[colorIndex % EARTH_TONES.length];
          const daysRemain = getDaysRemaining(race.date);

          // Calculate quotas
          const categories = race.categories || [];
          const totalQuota = categories.reduce((acc, cat) => acc + (Number(cat.quota) || 0), 0);
          const totalSlotsTaken = categories.reduce((acc, cat) => acc + (Number(cat.slotsTaken) || 0), 0);
          const slotsLeft = Math.max(0, totalQuota - totalSlotsTaken);
          const isSoldOut = totalQuota > 0 && slotsLeft === 0;

          return (
            <div
              key={race.id || index}
              onClick={() => navigate(`/races/${race.id}`)}
              className="group relative flex flex-col w-[82vw] sm:w-[290px] h-[385px] shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 border border-[#E1E5EA]/60 dark:border-[#2C3440]/80 cursor-pointer select-none snap-start"
            >
              {/* TOP: Image Banner with Badges (h-36 sm:h-38) */}
              <div className="relative h-36 sm:h-38 w-full overflow-hidden bg-stone-900 shrink-0">
                <img
                  src={race.banner || race.heroBanner || 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1000&auto=format&fit=crop'}
                  alt={race.title}
                  className="h-36 sm:h-38 object-cover w-full group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />

                {/* Days Remaining Pill (Top Left) */}
                {daysRemain && (
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-rose-600/90 text-white backdrop-blur-md border border-white/20 text-[10px] font-black tracking-wide shadow-md flex items-center gap-1 z-20">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>{daysRemain}</span>
                  </div>
                )}

                {/* Date Badge (Top Right) */}
                <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-white shadow-md flex items-center gap-1 z-20">
                  <Calendar className="w-2.5 h-2.5 text-[#E8D1C5]" />
                  <span className="text-[10px] font-bold">
                    {new Date(race.date).toLocaleDateString('id-ID', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                {/* Location (Bottom of Image) */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-white/90 drop-shadow-md z-10">
                  <MapPin className="w-3 h-3 text-[#DA7F8F] shrink-0" />
                  <span className="truncate">{race.location}</span>
                </div>
              </div>

              {/* BOTTOM: Card Body with GiriTrack Earth Tones */}
              <div
                style={{ backgroundColor: cardBgColor }}
                className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between text-white relative transition-colors duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/15 pointer-events-none" />

                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/70">
                      <Activity className="w-3 h-3 text-[#E8D1C5]" />
                      <span>Trail Race Series</span>
                    </div>

                    {race.statsSummary?.maxDistance && (
                      <span className="text-[10px] font-black text-rose-300">
                        {race.statsSummary.maxDistance}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1 mt-0.5 leading-snug drop-shadow-sm group-hover:text-[#FAF3F3] transition-colors">
                    {race.title}
                  </h3>

                  {/* Categories Pills */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {categories.slice(0, 3).map((cat, idx) => (
                      <span
                        key={cat.id || idx}
                        className="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/20 text-[9px] font-semibold text-white/90"
                      >
                        {cat.name || cat.distance}
                      </span>
                    ))}
                    {categories.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[9px] font-semibold text-white/70">
                        +{categories.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Key Metrics Grid (Kategori & Sisa Slot) */}
                <div className="relative z-10 grid grid-cols-2 gap-1 py-1.5 px-2 my-2 rounded-xl bg-black/25 backdrop-blur-sm border border-white/15 text-center text-white">
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center gap-0.5 text-white/70 text-[9px] mb-0.5">
                      <Target className="w-2.5 h-2.5 text-[#E8D1C5]" />
                      <span>Kategori</span>
                    </div>
                    <span className="text-xs font-black text-white">
                      {categories.length} <span className="text-[9px] font-normal text-white/80">Pilihan</span>
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center border-l border-white/15">
                    <div className="flex items-center justify-center gap-0.5 text-white/70 text-[9px] mb-0.5">
                      <Users className="w-2.5 h-2.5 text-[#E8D1C5]" />
                      <span>Sisa Slot</span>
                    </div>
                    <span className="text-xs font-black text-white">
                      {totalQuota > 0 ? slotsLeft : 'Tersedia'}{' '}
                      <span className="text-[9px] font-normal text-white/80">
                        {isSoldOut ? 'Habis' : 'Slot'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Action CTA Button */}
                <div className="relative z-10 flex items-center pt-0.5 mt-auto">
                  <button
                    type="button"
                    disabled={isSoldOut}
                    className={`w-full py-1.5 sm:py-2 px-3 rounded-full border ${
                      isSoldOut
                        ? 'border-white/30 text-white/50 bg-black/20 cursor-not-allowed'
                        : 'border-white/70 text-white bg-transparent group-hover:bg-white group-hover:text-stone-900 group-hover:border-white group-hover:shadow-md'
                    } font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 cursor-pointer`}
                  >
                    <span>{isSoldOut ? 'Slot Penuh' : 'Detail & Daftar'}</span>
                    {!isSoldOut && <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />}
                  </button>
                </div>

              </div>
            </div>
          );
        })}

        {/* 3. Final "Explore Catalog" Card at the End of the Track */}
        <div
          onClick={() => navigate('/races')}
          className="group relative flex flex-col justify-between w-[82vw] sm:w-[290px] h-[385px] shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden p-5 sm:p-6 bg-gradient-to-br from-[#452829] via-[#3A231C] to-[#1E2836] text-white border border-[#E1E5EA]/50 dark:border-[#2C3440] shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer select-none snap-start"
        >
          <div className="relative z-10 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#DA7F8F] shadow-inner group-hover:scale-110 transition-transform duration-300">
              <Trophy className="w-5 h-5" />
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 text-rose-200 border border-white/20 text-[10px] font-bold uppercase tracking-wider">
              Katalog Lengkap
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
              Ingin Lihat Lebih Banyak Lomba?
            </h3>

            <p className="text-[11px] sm:text-xs text-stone-200 leading-relaxed">
              Jelajahi seluruh agenda kompetisi lari lintas alam di berbagai gunung Indonesia dengan filter lengkap.
            </p>
          </div>

          <div className="relative z-10 pt-3 mt-auto">
            <button
              type="button"
              className="w-full py-2 px-4 rounded-full bg-white text-stone-900 hover:bg-[#FAF3F3] font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all duration-300 group-hover:gap-2 active:scale-95 cursor-pointer"
            >
              <span>Buka Katalog Lomba</span>
              <ArrowRight className="w-3.5 h-3.5 text-rose-600" />
            </button>
          </div>
        </div>
      </div>

    </section>
  );
}
