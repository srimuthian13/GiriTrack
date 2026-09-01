import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Navigation, Users, Calendar, ArrowRight, Mountain, Trophy, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useTrail } from '../context/TrailContext';
import { useLanguage } from '../context/LanguageContext';
import TrailCard from '../components/TrailCard';
import heroBromo from '../assets/hero-bromo.jpg';

export default function Home() {
  const { trails, events, joinEvent, leaveEvent } = useTrail();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const featuredTrails = trails.slice(0, 3);
  const upcomingEvents = events.slice(0, 3);

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

  return (
    <div className="space-y-12 pb-12 text-[#452829] dark:text-[#F3E8DF]">
      
      {/* 1. Proportional Hero Banner (AllTrails Inspired) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <section className="relative overflow-hidden rounded-3xl bg-[#2D1C1D] text-white shadow-xl border border-[#DBC4B6]/40 dark:border-[#57595B]/40 h-[460px] md:h-[500px] max-h-[70vh] flex items-center justify-center group">
          
          {/* Background Images with Slow Motion Zoom Effect */}
          {heroSlides.map((slide, index) => {
            const isActive = index === activeSlide;
            return (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.peak}
                  className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out transform ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
                {/* Proportional Dark Overlay Gradients for Perfect Text Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
              </div>
            );
          })}

          {/* Hero Content Overlay */}
          <div className="relative z-20 max-w-3xl mx-auto px-6 py-8 flex flex-col items-center text-center space-y-4">
            
            {/* Top Location Tag */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-[#F3E8DF] text-xs font-semibold uppercase tracking-wider shadow-sm transition-all duration-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{heroSlides[activeSlide].location}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-2xl mx-auto drop-shadow-md">
              Jelajahi Keindahan Gunung Bersama <span className="text-[#E8D1C5] underline decoration-[#2C6E49]/60 underline-offset-4">GiriTrack</span>
            </h1>

            {/* Subtitle / Description */}
            <p className="text-sm md:text-base text-slate-200 max-w-xl mx-auto line-clamp-2 mt-2 font-normal drop-shadow">
              {heroSlides[activeSlide].subtitle}
            </p>

            {/* Hero CTA Action Buttons (Frosted Glass & Solid Nature Accents) */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <Link
                to="/trails"
                className="px-5 py-2.5 rounded-full bg-[#2C6E49] hover:bg-[#23583a] text-white font-bold shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 text-xs md:text-sm cursor-pointer"
              >
                <Compass className="w-4 h-4 text-white" />
                <span>Eksplor Jalur Pendakian</span>
              </Link>
              
              <Link
                to="/tracker"
                className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white font-semibold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 text-xs md:text-sm cursor-pointer shadow-md"
              >
                <Navigation className="w-4 h-4 text-[#E8D1C5]" />
                <span>Mulai Pelacak GPS</span>
              </Link>
            </div>
          </div>

          {/* Carousel Arrow Controls */}
          <button
            type="button"
            onClick={handlePrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white/25 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Slide Sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white/25 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Slide Selanjutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicators & Peak Title Pill */}
          <div className="absolute bottom-4 left-0 right-0 z-30 flex flex-col items-center gap-2 pointer-events-auto">
            <span className="text-[11px] font-medium text-stone-200 backdrop-blur-md bg-black/40 px-3 py-0.5 rounded-full border border-white/20 shadow-sm">
              {heroSlides[activeSlide].peak}
            </span>
            <div className="flex items-center justify-center gap-1.5">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeSlide ? 'w-6 bg-[#2C6E49] dark:bg-[#E8D1C5]' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  title={`Pindah ke slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </section>
      </div>

      {/* 2. Community Statistics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#2D1C1D] border border-[#DBC4B6] dark:border-[#57595B]/40 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-[#2C6E49] dark:bg-[#3F2728] dark:text-[#E8D1C5] shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-[#1E293B] dark:text-[#F3E8DF]">{trails.length}+</p>
            <p className="text-xs text-[#57595B] dark:text-[#E8D1C5] font-medium">Jalur Pendakian Terdata</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#2D1C1D] border border-[#DBC4B6] dark:border-[#57595B]/40 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-[#2C6E49] dark:bg-[#3F2728] dark:text-[#E8D1C5] shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-[#1E293B] dark:text-[#F3E8DF]">{events.length}</p>
            <p className="text-xs text-[#57595B] dark:text-[#E8D1C5] font-medium">Event Tektok Terjadwal</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#2D1C1D] border border-[#DBC4B6] dark:border-[#57595B]/40 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-[#2C6E49] dark:bg-[#3F2728] dark:text-[#E8D1C5] shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-[#1E293B] dark:text-[#F3E8DF]">1,250+</p>
            <p className="text-xs text-[#57595B] dark:text-[#E8D1C5] font-medium">Pendaki Komunitas</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#2D1C1D] border border-[#DBC4B6] dark:border-[#57595B]/40 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-[#2C6E49] dark:bg-[#3F2728] dark:text-[#E8D1C5] shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-[#1E293B] dark:text-[#F3E8DF]">100%</p>
            <p className="text-xs text-[#57595B] dark:text-[#E8D1C5] font-medium">Lokal & Tanpa Server</p>
          </div>
        </div>
      </section>

      {/* 3. Featured Trails Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1E293B] dark:text-[#F3E8DF] flex items-center gap-2">
              <Mountain className="w-6 h-6 text-[#2C6E49] dark:text-[#E8D1C5]" />
              <span>Jalur Pendakian Populer</span>
            </h2>
            <p className="text-xs text-[#57595B] dark:text-[#E8D1C5] mt-1">
              Rekomendasi jalur muncak favorit pendaki Indonesia dengan estimasi teknis lengkap.
            </p>
          </div>
          <Link
            to="/trails"
            className="text-xs font-bold text-[#2C6E49] hover:underline dark:text-[#E8D1C5] flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua Jalur</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTrails.map((trail) => (
            <TrailCard
              key={trail.id}
              trail={trail}
              onDetail={handleTrailDetail}
            />
          ))}
        </div>
      </section>

      {/* 4. Upcoming Tektok Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1E293B] dark:text-[#F3E8DF] flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#2C6E49] dark:text-[#E8D1C5]" />
              <span>Agenda Event Tektok Terdekat</span>
            </h2>
            <p className="text-xs text-[#57595B] dark:text-[#E8D1C5] mt-1">
              Muncak sehari tanpa nginep bersama pendaki tektok lainnya.
            </p>
          </div>
          <Link
            to="/events"
            className="text-xs font-bold text-[#2C6E49] hover:underline dark:text-[#E8D1C5] flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua Event</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {upcomingEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white dark:bg-[#2D1C1D] rounded-2xl p-5 border border-[#DBC4B6] dark:border-[#57595B]/40 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#57595B] dark:text-[#E8D1C5]">
                    {evt.date}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                      evt.is_joined
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : evt.current_participants >= evt.max_quota
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {evt.is_joined
                      ? t('event.statusJoined')
                      : evt.current_participants >= evt.max_quota
                      ? t('event.statusFull')
                      : t('event.statusOpen')}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-[#1E293B] dark:text-[#F3E8DF]">
                  {evt.name}
                </h3>
                <p className="text-xs text-[#57595B] dark:text-[#E8D1C5]">
                  Target: <strong className="text-[#1E293B] dark:text-[#F3E8DF]">{evt.peak_target}</strong>
                </p>
                <p className="text-xs text-[#57595B] dark:text-[#E8D1C5]">
                  Lead: {evt.organizer}
                </p>
              </div>

              <div className="pt-3 border-t border-[#DBC4B6]/50 dark:border-[#57595B]/30 flex items-center justify-between">
                <div className="text-xs font-semibold text-[#57595B] dark:text-[#E8D1C5]">
                  <span>Partisipan: </span>
                  <span className="font-bold text-[#1E293B] dark:text-[#F3E8DF]">
                    {evt.current_participants}/{evt.max_quota}
                  </span>
                </div>

                {evt.is_joined ? (
                  <button
                    type="button"
                    onClick={() => leaveEvent(evt.id)}
                    className="px-3 py-1.5 text-xs font-bold rounded-full bg-[#EFE4DC] text-rose-700 hover:bg-rose-100 dark:bg-[#3F2728] dark:text-rose-400 cursor-pointer transition"
                  >
                    {t('btn.leaveEvent')}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => joinEvent(evt.id)}
                    disabled={evt.current_participants >= evt.max_quota}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition ${
                      evt.current_participants >= evt.max_quota
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed dark:bg-[#3F2728] dark:text-stone-500'
                        : 'bg-[#2C6E49] text-white hover:bg-[#23583a] dark:bg-[#E8D1C5] dark:text-[#452829] cursor-pointer'
                    }`}
                  >
                    {t('btn.joinEvent')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
