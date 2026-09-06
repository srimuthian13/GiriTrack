import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Timer, Mountain, Flag, ArrowRight, Activity } from 'lucide-react';
import { useRace } from '../context/RaceContext';

export default function UpcomingRaceSection() {
  const { races } = useRace();
  const currentRace = races?.[0];

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate countdown to the race date
  useEffect(() => {
    if (!currentRace?.date) return;
    // Use targetDate if available, fallback to date
    const targetDateStr = currentRace.targetDate || `${currentRace.date}T05:00:00`;
    const raceDate = new Date(targetDateStr).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = raceDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentRace]);



  if (!currentRace) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 my-16">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 dark:bg-stone-800 text-[#DA7F8F] text-xs font-bold uppercase tracking-wider">
          <Flag className="w-3.5 h-3.5" />
          <span>Event Resmi Terdekat</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-[#2B3542] dark:text-[#FAF3F3]">
          Agenda Lomba Lari Gunung 2026
        </h2>
        <p className="text-sm md:text-base text-[#6B7C8C] dark:text-[#A7BBC7] max-w-2xl">
          Tantang batas kemampuanmu melintasi alam liar. Persiapkan dirimu untuk pengalaman lari trail paling dramatis dan tak terlupakan tahun ini.
        </p>
      </div>

      {/* Featured Card Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-stone-950 flex flex-col justify-end min-h-[500px] lg:min-h-[600px] border border-stone-800">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={currentRace.heroBanner || "/images/hero-3.png"} 
            alt={currentRace.title} 
            className="w-full h-full object-cover opacity-70 scale-105 hover:scale-110 transition-transform duration-[10000ms]"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=2000&auto=format&fit=crop' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-transparent"></div>
        </div>

        {/* Card Content */}
        <div className="relative z-10 p-6 md:p-10 lg:p-14 w-full flex flex-col gap-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            
            {/* Left Content */}
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap gap-2">
                {currentRace.categories?.map((cat, idx) => (
                  <span 
                    key={cat.id} 
                    className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur ${
                      idx === currentRace.categories.length - 1 
                        ? 'bg-[#DA7F8F]/20 text-[#DA7F8F] border-[#DA7F8F]/30 shadow-[0_0_15px_rgba(218,127,143,0.3)]'
                        : 'bg-stone-800/80 text-stone-200 border-stone-700'
                    }`}
                  >
                    {cat.name.split(' ')[0]}
                  </span>
                ))}
              </div>
              
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-100 leading-tight">
                {currentRace.title}
              </h3>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-stone-300 font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#DA7F8F]" />
                  <span>
                    {currentRace.dateString || new Date(currentRace.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#DA7F8F]" />
                  <span>{currentRace.location}</span>
                </div>
              </div>
            </div>

            {/* Right Content / Countdown */}
            <div className="flex gap-4 p-4 rounded-2xl bg-stone-900/60 backdrop-blur-md border border-stone-700/50">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-white">{timeLeft.days}</span>
                <span className="text-[10px] text-stone-400 font-bold tracking-wider uppercase">Hari</span>
              </div>
              <span className="text-2xl text-stone-600 font-bold mt-1">:</span>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-white">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-stone-400 font-bold tracking-wider uppercase">Jam</span>
              </div>
              <span className="text-2xl text-stone-600 font-bold mt-1">:</span>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-white">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-stone-400 font-bold tracking-wider uppercase">Mnt</span>
              </div>
              <span className="text-2xl text-stone-600 font-bold mt-1">:</span>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-[#DA7F8F]">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-stone-400 font-bold tracking-wider uppercase">Dtk</span>
              </div>
            </div>

          </div>

          <div className="w-full h-px bg-stone-700/50 my-2"></div>

          {/* Bottom Actions & Metrics */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Iconic Metrics */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 w-full lg:w-auto">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-stone-800/80 text-stone-300">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Jarak</p>
                  <p className="text-lg font-black text-stone-100">{currentRace.statsSummary?.maxDistance || "50 KM"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-stone-800/80 text-stone-300">
                  <Mountain className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Elevasi</p>
                  <p className="text-lg font-black text-stone-100">{currentRace.statsSummary?.maxElevation || "3.200 M+"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-stone-800/80 text-stone-300">
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Batas Waktu</p>
                  <p className="text-lg font-black text-stone-100">{currentRace.statsSummary?.cutOffTime || "12 Jam"}</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Link 
                to={`/races/${currentRace.id}?tab=course`}
                className="px-6 py-3.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-100 font-bold border border-stone-600 transition-all text-sm flex justify-center items-center gap-2"
              >
                Lihat Profil Elevasi
              </Link>
              <Link 
                to={`/races/${currentRace.id}`}
                className="px-6 py-3.5 rounded-full bg-[#DA7F8F] hover:bg-[#c96c7d] text-white font-bold transition-all text-sm flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(218,127,143,0.4)]"
              >
                <span>Daftar & Info Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
