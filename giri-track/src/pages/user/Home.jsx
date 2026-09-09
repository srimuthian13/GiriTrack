import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Navigation, Users, Calendar, ArrowRight, Mountain, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTrail } from '../../context/TrailContext';
import { useRace } from '../../context/RaceContext';
import { useLanguage } from '../../context/LanguageContext';
import TrailCard from '../../components/TrailCard';
import PastRaceCard from '../../components/PastRaceCard';
import UpcomingRaceSection from '../../components/UpcomingRaceSection';
import { pastRaces } from '../../data/pastRacesData';
import heroBromo from '../../assets/hero-bromo.jpg';


export default function Home() {
  const { trails } = useTrail();
  const { races } = useRace();
  const { t } = useLanguage();
  const navigate = useNavigate();



  // Background Hero Slides derived from mountain photos
  const heroSlides = [
    {
      image: heroBromo,
      location: 'Taman Nasional Bromo Tengger Semeru',
      peak: 'Kawah Bromo & Puncak Mahameru',
      subtitle: 'Saksikan panorama megah kawah Bromo dan keagungan Semeru saat fajar membias indah.',
    },
    {
      image: '/images/hero-2.png',
      location: 'Kawasan Puncak Gunung Prau & Sindoro',
      peak: 'Puncak Prau & Jajaran Gunung Berapi',
      subtitle: 'Nikmati hamparan rerumputan emas puncak gunung dan barisan cakrawala megah Nusantara.',
    },
    {
      image: '/images/hero-3.png',
      location: 'Pegunungan Dieng - Temanggung',
      peak: 'Lautan Awan Puncak Gunung Sumbing',
      subtitle: 'Sensasi berdiri melayang di atas lautan awan putih selembut pualam di ketinggian 3.000 mdpl.',
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  // Automatic Smooth Slideshow Timer (6 Seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handleTrailDetail = (trail) => {
    navigate(`/trails/${trail.id}`);
  };

  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Reset scroll to top when page mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Titik tengah dari section (Jalur Pendakian Populer)
      const sectionCenter = rect.top + (rect.height / 2);
      // Titik tengah dari layar (viewport)
      const viewportCenter = windowHeight / 2;

      // Hitung jarak absolut antara tengah section dengan tengah layar
      const distance = Math.abs(sectionCenter - viewportCenter);

      // Jarak toleransi (zona aman) di mana kartu akan sejajar rapi (progress = 0)
      const safeZone = 100; // px
      // Jarak maksimal di mana kartu akan menumpuk penuh (progress = 1)
      const maxDistance = windowHeight * 0.6; 

      if (distance <= safeZone) {
        // Jika section ada persis di tengah-tengah layar (zona aman), kartu tidak menumpuk sama sekali
        setScrollProgress(0);
      } else if (distance >= maxDistance) {
        // Jika section terlalu jauh di atas atau di bawah layar, tumpuk maksimal
        setScrollProgress(1);
      } else {
        // Semakin menjauh dari zona aman, semakin menumpuk
        const progress = (distance - safeZone) / (maxDistance - safeZone);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="-mt-6 space-y-12 pb-12 text-[#2B3542] dark:text-[#FAF3F3]">
      
      {/* 1. Immersive Full-Screen Edge-to-Edge Hero Banner */}
      <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] h-[calc(100vh-64px)] flex flex-col justify-between overflow-hidden px-6 md:px-12 py-4 text-white shadow-2xl">
        {/* Background image & overlays */}
        {heroSlides.map((slide, index) => {
          const isActive = index === activeSlide;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.peak}
                className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out transform ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/30 z-0" />

        {/* Carousel Arrow Controls */}
        <button
          type="button"
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Slide Sebelumnya"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Slide Selanjutnya"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        {/* Top Content (Hero Text & CTA) */}
        <div className="relative z-10 flex flex-col items-center text-center mt-auto mb-auto max-w-3xl mx-auto">
          <span className="text-[11px] py-0.5 px-3 mb-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 font-bold uppercase tracking-[0.2em]">
            {t('home.badge')}
          </span>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight drop-shadow-lg text-white">
            {t('home.heroTitlePrefix')} <span className="text-rose-400">GiriTrack</span>
          </h1>
          <p className="text-xs md:text-sm text-stone-200 max-w-lg mt-1 mb-3 text-center leading-relaxed drop-shadow">
            {t('home.heroDesc')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/trails"
              className="py-2 px-4 text-xs font-semibold rounded-full bg-rose-600 hover:bg-rose-500 text-white uppercase tracking-wider shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>{t('home.btnExplore')}</span>
            </Link>
            <Link
              to="/tracker"
              className="py-2 px-4 text-xs font-semibold rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white uppercase tracking-wider transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Navigation className="w-4 h-4 text-rose-300" />
              <span>{t('home.btnTracker')}</span>
            </Link>
          </div>
          
          {/* Slide Indicators */}
          <div className="flex items-center justify-center gap-1.5 my-1 mt-4">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlide(idx)}
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeSlide ? 'w-6 bg-rose-500' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
                title={`Pindah ke slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Content (Stats Cards) */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-5xl mx-auto pb-2">
          <div className="bg-stone-950/40 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5 transition-transform hover:-translate-y-1">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-rose-400 shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <p className="text-base md:text-lg font-bold text-white leading-none">{trails.length}+</p>
              <p className="text-[10px] text-stone-300 mt-1 uppercase tracking-wide leading-tight">{t('home.stats.trails')}</p>
            </div>
          </div>

          <div className="bg-stone-950/40 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5 transition-transform hover:-translate-y-1">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-base md:text-lg font-bold text-white leading-none">{races?.length || 3}+</p>
              <p className="text-[10px] text-stone-300 mt-1 uppercase tracking-wide leading-tight">{t('home.stats.races')}</p>
            </div>
          </div>

          <div className="bg-stone-950/40 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5 transition-transform hover:-translate-y-1">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-base md:text-lg font-bold text-white leading-none">1,250+</p>
              <p className="text-[10px] text-stone-300 mt-1 uppercase tracking-wide leading-tight">{t('home.stats.community')}</p>
            </div>
          </div>

          <div className="bg-stone-950/40 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5 transition-transform hover:-translate-y-1">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-blue-400 shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <p className="text-base md:text-lg font-bold text-white leading-none">100%</p>
              <p className="text-[10px] text-stone-300 mt-1 uppercase tracking-wide leading-tight">{t('home.stats.local')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Past Events Recap Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-block px-2.5 py-1 mb-2 text-[10px] font-bold tracking-widest text-[#DA7F8F] bg-[#DA7F8F]/10 rounded-full border border-[#DA7F8F]/20">
              {t('home.pastBadge')}
            </div>
            <h2 className="text-2xl font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
              <Mountain className="w-6 h-6 text-[#DA7F8F]" />
              <span>{t('home.pastTitle')}</span>
            </h2>
            <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-1 max-w-xl">
              {t('home.pastSubtitle')}
            </p>
          </div>
          <Link
            to="/races"
            className="text-xs font-bold text-[#DA7F8F] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>{t('btn.viewGallery')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Desktop Interactive Scroll-Stacked View (lg and up) */}
        <div 
          ref={sectionRef}
          className="hidden lg:flex justify-center items-stretch py-6 min-h-[385px]"
        >
          {pastRaces.map((race, index) => {
            const isStacked = scrollProgress > 0.4;
            const baseGap = 20; 
            const maxOverlap = -140; 
            const currentOffset = index === 0 ? 0 : baseGap - (scrollProgress * (baseGap - maxOverlap));

            return (
              <div 
                key={race.id}
                style={{
                  marginLeft: index > 0 ? `${currentOffset}px` : '0px',
                  zIndex: 10 + index, 
                  transform: scrollProgress > 0
                    ? `scale(${1 - ((1 - scrollProgress) * 0.03 * (pastRaces.length - 1 - index))})`
                    : 'scale(1)',
                }}
                className={`
                  relative w-[290px] shrink-0
                  transition-all duration-500 ease-out h-[385px]
                  ${isStacked ? 'hover:-translate-y-6 hover:scale-105 hover:z-50 hover:shadow-2xl cursor-pointer' : ''}
                `}
              >
                <PastRaceCard
                  race={race}
                  index={index}
                />
              </div>
            );
          })}
        </div>

        {/* Mobile / Tablet Smooth Horizontal Swipe Track (Below lg) */}
        <div className="flex lg:hidden items-stretch gap-4 overflow-x-auto no-scrollbar scroll-smooth py-3 px-1 snap-x snap-mandatory">
          {pastRaces.map((race, index) => (
            <div
              key={race.id}
              className="w-[82vw] sm:w-[290px] shrink-0 snap-start h-[385px] flex flex-col transition-transform duration-300 active:scale-98"
            >
              <PastRaceCard
                race={race}
                index={index}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Upcoming Race Series Section */}
      <UpcomingRaceSection />



    </div>
  );
}
