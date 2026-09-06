import { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { RaceContext } from '../context/RaceContext';
import { flagshipRace } from '../data/raceData';
import { pastRaces } from '../data/pastRacesData';
import {
  Calendar, MapPin, Trophy, Clock, Mountain, Navigation,
  ShieldAlert, CheckCircle2, ChevronRight, ArrowRight,
  Timer, Sparkles, Flame, Users, Download,
  Search, Award, Layers, Compass, AlertCircle
} from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Marker DivIcons for Trail Race Map
const createMarkerIcon = (label, color = '#DA7F8F') => L.divIcon({
  className: 'custom-race-marker',
  html: `<div style="background-color: ${color}; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 10px; border: 2.5px solid #FAF3F3; box-shadow: 0 4px 10px rgba(0,0,0,0.5); font-family: monospace;">${label}</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export default function RaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRaceById, liveLeaderboard } = useContext(RaceContext);
  const [searchParams] = useSearchParams();

  let race = getRaceById(id);
  if (!race) {
    race = pastRaces.find(r => r.id === id) || flagshipRace;
  }

  const isCompleted = race.status === 'COMPLETED' || searchParams.get('status') === 'completed';
  
  const [activeTab, setActiveTab] = useState(isCompleted ? 'leaderboard' : 'course'); // 'course' | 'categories' | 'schedule' | 'leaderboard' | 'gallery' | 'finishers'
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic Countdown Timer to Race Date
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const targetDate = new Date(race?.date || '2026-10-24T04:00:00+07:00').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [race?.date]);

  // Filtered Participants / Leaderboard
  const filteredLeaderboard = useMemo(() => {
    const data = liveLeaderboard && liveLeaderboard.length > 0 ? liveLeaderboard : (race?.leaderboard || []);
    return data.filter(item => {
      const matchesCategory = selectedCategoryFilter === 'ALL' || item.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase());
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.bib.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [liveLeaderboard, race.leaderboard, selectedCategoryFilter, searchQuery]);

  const mapCenter = race.routeCoordinates?.[0] || [-7.5954, 111.1578];

  return (
    <div className="min-h-screen text-[#2B3542] dark:text-[#FAF3F3] pb-16">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION MEGAH (UTMB / GOLDEN TRAIL SERIES DRAMATIC STYLE)         */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-[#2D1C1D] text-white py-16 md:py-24 border-b border-[#452829]">
        {/* Background Image with Deep Earthy Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={race.heroBanner || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85"}
            alt={race.title}
            className="w-full h-full object-cover object-center scale-105 filter brightness-75"
          />
          {/* Earth-tone gradient overlay khas GiriTrack */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C2129] via-[#2D1C1D]/80 to-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#DA7F8F]/20 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Badges & Series tag */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-[#DA7F8F] text-white text-[11px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>GiriTrack Ultra Series 2026</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#E8D1C5] text-[11px] font-semibold tracking-wide border border-white/20">
              UTMB Index Qualifier • ITRA National
            </span>
          </div>

          {/* Main Title & Tagline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white drop-shadow-lg max-w-4xl leading-[1.05]">
            {race.title}
          </h1>

          <p className="mt-3 text-base sm:text-xl text-[#F3E8DF] font-medium max-w-2xl leading-relaxed drop-shadow">
            {race.tagline || 'Menembus Batas Kaldera Mistis Lawu via Candi Cetho'}
          </p>

          {/* Location & Date Pills */}
          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs sm:text-sm text-white/90">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <Calendar className="w-4 h-4 text-[#DA7F8F]" />
              <span className="font-semibold">{new Date(race.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <MapPin className="w-4 h-4 text-[#DA7F8F]" />
              <span>{race.location}</span>
            </div>
          </div>

          {/* Countdown Timer & CTA Row */}
          <div className="mt-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-8 border-t border-white/15">
            {!isCompleted ? (
              <>
                {/* Live Countdown Grid */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#E8D1C5] font-bold mb-2 flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5 text-[#DA7F8F]" />
                    <span>Hitung Mundur Race Day</span>
                  </p>
                  <div className="flex items-center gap-3 font-mono">
                    <div className="bg-[#1C2129]/90 border border-white/20 px-3 py-2 rounded-xl text-center min-w-[64px] shadow-lg">
                      <span className="text-2xl sm:text-3xl font-black text-white">{String(timeLeft.days).padStart(2, '0')}</span>
                      <span className="block text-[9px] uppercase tracking-wider text-[#A7BBC7]">HARI</span>
                    </div>
                    <span className="text-xl font-bold text-white/50">:</span>
                    <div className="bg-[#1C2129]/90 border border-white/20 px-3 py-2 rounded-xl text-center min-w-[64px] shadow-lg">
                      <span className="text-2xl sm:text-3xl font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                      <span className="block text-[9px] uppercase tracking-wider text-[#A7BBC7]">JAM</span>
                    </div>
                    <span className="text-xl font-bold text-white/50">:</span>
                    <div className="bg-[#1C2129]/90 border border-white/20 px-3 py-2 rounded-xl text-center min-w-[64px] shadow-lg">
                      <span className="text-2xl sm:text-3xl font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                      <span className="block text-[9px] uppercase tracking-wider text-[#A7BBC7]">MENIT</span>
                    </div>
                    <span className="text-xl font-bold text-white/50">:</span>
                    <div className="bg-[#1C2129]/90 border border-white/20 px-3 py-2 rounded-xl text-center min-w-[64px] shadow-lg">
                      <span className="text-2xl sm:text-3xl font-black text-[#DA7F8F]">{String(timeLeft.seconds).padStart(2, '0')}</span>
                      <span className="block text-[9px] uppercase tracking-wider text-[#A7BBC7]">DETIK</span>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => {
                      setActiveTab('categories');
                      setTimeout(() => {
                        document.getElementById('race-categories-section')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#DA7F8F] to-[#c96c7d] hover:from-[#c96c7d] hover:to-[#DA7F8F] text-white font-black text-sm uppercase tracking-wider shadow-2xl shadow-[#DA7F8F]/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                  >
                    <span>DAFTAR SEKARANG</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <Link
                    to={`/races/${race.id}/register`}
                    className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wide border border-white/30 backdrop-blur-md transition-all active:scale-95"
                  >
                    Formulir Pendaftaran Langsung
                  </Link>
                </div>
              </>
            ) : (
              <div className="w-full flex justify-between items-center bg-black/40 backdrop-blur-md px-6 py-5 rounded-2xl border border-white/15">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    <span>LOMBA TELAH SELESAI</span>
                  </h3>
                  <p className="text-sm text-[#A7BBC7] mt-1">Terima kasih kepada seluruh pelari, volunteer, dan sponsor.</p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('leaderboard');
                    setTimeout(() => {
                      document.getElementById('race-tabs-content')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wide border border-white/30 backdrop-blur-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>Lihat Hasil Juara</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. RACE INFORMATION GRID (3 ICONIC METRICS ala UTMB)                      */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#1C2129] p-6 rounded-3xl border border-[#E1E5EA] dark:border-[#2C3440] shadow-xl flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-[#DA7F8F]/15 text-[#DA7F8F] flex items-center justify-center shrink-0">
              <Navigation className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7C8C] dark:text-[#A7BBC7]">TOTAL DISTANCE</span>
              <p className="text-3xl font-black text-[#2B3542] dark:text-[#FAF3F3]">{race.statsSummary?.maxDistance || '50 KM'}</p>
              <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7]/80">Rute Loop Candi Cetho Lawu</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1C2129] p-6 rounded-3xl border border-[#E1E5EA] dark:border-[#2C3440] shadow-xl flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Mountain className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7C8C] dark:text-[#A7BBC7]">ELEVATION GAIN</span>
              <p className="text-3xl font-black text-[#2B3542] dark:text-[#FAF3F3]">{race.statsSummary?.maxElevation || '3.200 M+'}</p>
              <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7]/80">Titik Tertinggi 3.265 mdpl</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1C2129] p-6 rounded-3xl border border-[#E1E5EA] dark:border-[#2C3440] shadow-xl flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7C8C] dark:text-[#A7BBC7]">CUT OFF TIME (COT)</span>
              <p className="text-3xl font-black text-[#2B3542] dark:text-[#FAF3F3]">{race.statsSummary?.cutOffTime || '12 HOURS'}</p>
              <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7]/80">Batas Waktu Finisher Resmi</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE TABS SUB-NAVBAR                                            */}
      {/* ========================================================================= */}
      <div id="race-tabs-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-[#E1E5EA] dark:border-[#2C3440] scrollbar-none">
          {[
            ...(isCompleted ? [
              { id: 'leaderboard', label: 'Papan Hasil & Juara', icon: Trophy },
              { id: 'finishers', label: 'Daftar Finisher', icon: Users },
              { id: 'gallery', label: 'Galeri Foto Lomba', icon: Sparkles },
            ] : [
              { id: 'course', label: 'Course & Elevation', icon: Layers },
              { id: 'categories', label: 'Race Categories', icon: Trophy },
              { id: 'schedule', label: 'Jadwal Acara', icon: Calendar },
            ])
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#DA7F8F] text-white shadow-md shadow-[#DA7F8F]/30 scale-102'
                    : 'bg-white dark:bg-[#1C2129] text-[#6B7C8C] dark:text-[#A7BBC7] hover:text-[#2B3542] dark:hover:text-white border border-[#E1E5EA] dark:border-[#2C3440]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ======================================================================= */}
        {/* TAB 1: COURSE & ELEVATION                                              */}
        {/* ======================================================================= */}
        {activeTab === 'course' && (
          <div className="mt-8 space-y-10 animate-in fade-in duration-300">
            {/* SVG Elevation Chart Visualizer */}
            <div className="bg-white dark:bg-[#1C2129] p-6 sm:p-8 rounded-3xl border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Mountain className="w-5 h-5 text-[#DA7F8F]" />
                    <span>Profil Kontur & Elevasi Rute (Elevation Profile)</span>
                  </h3>
                  <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-1">
                    Visualisasi gradien tanjakan dari Candi Cetho (1.496 mdpl) menuju Puncak Hargo Dumilah (3.265 mdpl).
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                    Max Alt: 3.265 MDPL
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                    Gain: +3.200m
                  </span>
                </div>
              </div>

              {/* Elevation Curve SVG */}
              <div className="relative w-full overflow-hidden bg-slate-950/90 rounded-2xl p-4 sm:p-6 border border-white/10">
                <svg viewBox="0 0 800 240" className="w-full h-48 sm:h-64 overflow-visible">
                  <defs>
                    <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#DA7F8F" stopOpacity="0.75" />
                      <stop offset="50%" stopColor="#452829" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#1C2129" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guide Lines */}
                  <line x1="30" y1="30" x2="770" y2="30" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                  <text x="35" y="25" fill="#A7BBC7" fontSize="10" fontFamily="monospace">3.265 m (Peak)</text>

                  <line x1="30" y1="125" x2="770" y2="125" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                  <text x="35" y="120" fill="#A7BBC7" fontSize="10" fontFamily="monospace">2.400 m</text>

                  <line x1="30" y1="210" x2="770" y2="210" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                  <text x="35" y="205" fill="#A7BBC7" fontSize="10" fontFamily="monospace">1.496 m (Cetho)</text>

                  {/* Area fill */}
                  <path
                    d={race.elevationProfileSvg?.fillPath || "M 30 210 L 100 190 L 220 150 L 360 95 L 480 30 L 530 45 L 640 125 L 720 180 L 770 210 L 770 230 L 30 230 Z"}
                    fill="url(#elevationGrad)"
                  />

                  {/* Stroke Path */}
                  <path
                    d={race.elevationProfileSvg?.path || "M 30 210 L 100 190 L 220 150 L 360 95 L 480 30 L 530 45 L 640 125 L 720 180 L 770 210"}
                    fill="none"
                    stroke="#DA7F8F"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Peak and Checkpoint Markers */}
                  {(race.elevationProfileSvg?.peaks || []).map((pt, idx) => (
                    <g key={idx} className="cursor-pointer group">
                      <circle cx={pt.x} cy={pt.y} r="5" fill="#FAF3F3" stroke="#DA7F8F" strokeWidth="3" />
                      <text
                        x={pt.x}
                        y={pt.y - 12}
                        textAnchor="middle"
                        fill="#FAF3F3"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        {pt.label} ({pt.alt})
                      </text>
                      <text
                        x={pt.x}
                        y="235"
                        textAnchor="middle"
                        fill="#6B7C8C"
                        fontSize="8"
                      >
                        {pt.km}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Leaflet Course Map */}
            <div className="bg-white dark:bg-[#1C2129] p-6 sm:p-8 rounded-3xl border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Compass className="w-5 h-5 text-[#DA7F8F]" />
                    <span>Peta Rute & Titik Pos Checkpoint (CP / WS)</span>
                  </h3>
                  <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-1">
                    Pos pemeriksaan medis, suplai air minum (Water Station), dan cut-off checkpoints.
                  </p>
                </div>
              </div>

              <div className="h-[420px] w-full rounded-2xl overflow-hidden border border-[#E1E5EA] dark:border-[#2C3440] relative z-10">
                <MapContainer
                  center={mapCenter}
                  zoom={12}
                  scrollWheelZoom={false}
                  className="h-full w-full"
                >
                  <TileLayer
                    url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenTopoMap contributors'
                  />

                  {/* Polyline Route */}
                  {race.routeCoordinates && (
                    <Polyline
                      positions={race.routeCoordinates}
                      color="#DA7F8F"
                      weight={5}
                      opacity={0.9}
                      dashArray="2, 6"
                    />
                  )}

                  {/* Checkpoint Markers */}
                  {(race.checkpoints || []).map((cp, idx) => {
                    const isStart = cp.type === 'start_finish';
                    const isSummit = cp.type === 'summit';
                    const isWS = cp.type === 'water_station';
                    const color = isStart ? '#10B981' : isSummit ? '#DA7F8F' : isWS ? '#3B82F6' : '#F59E0B';
                    const label = isStart ? 'SF' : isSummit ? '▲' : isWS ? 'WS' : `CP${idx}`;

                    return (
                      <Marker
                        key={idx}
                        position={[cp.lat, cp.lng]}
                        icon={createMarkerIcon(label, color)}
                      >
                        <Popup>
                          <div className="text-xs p-1">
                            <strong className="block text-sm font-black text-stone-900">{cp.name}</strong>
                            <p className="text-stone-600">Jarak: {cp.km} • Elevasi: {cp.elevation}</p>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>

              {/* Legend List of Checkpoints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                {(race.checkpoints || []).slice(0, 4).map((cp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-[#14171C] border border-[#E1E5EA] dark:border-[#2C3440] text-xs">
                    <p className="font-bold text-[#2B3542] dark:text-[#FAF3F3] truncate">{cp.name}</p>
                    <p className="text-[#6B7C8C] dark:text-[#A7BBC7]">{cp.km} • {cp.elevation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mandatory Gear Checklist */}
            <div className="bg-white dark:bg-[#1C2129] p-6 sm:p-8 rounded-3xl border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  <span>Daftar Perlengkapan Wajib (Mandatory Gear Checklist)</span>
                </h3>
                <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-1">
                  Pemeriksaan ketat dilakukan saat Race Pack Collection (RPC) dan secara acak di pos pemeriksaan lintasan. Pelanggaran berakibat diskualifikasi (DQ).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(race.mandatoryGear || []).map((gear, idx) => {
                  const name = typeof gear === 'string' ? gear : gear.name;
                  const isRequired = typeof gear === 'object' ? gear.required !== false : true;

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-gray-50 dark:bg-[#14171C] border border-[#E1E5EA] dark:border-[#2C3440] flex items-start gap-3"
                    >
                      <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${isRequired ? 'text-emerald-500' : 'text-amber-500'}`} />
                      <div>
                        <p className="font-bold text-xs sm:text-sm text-[#2B3542] dark:text-[#FAF3F3] leading-snug">{name}</p>
                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${isRequired ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {isRequired ? 'Wajib Dibawa (Mandatory)' : 'Disarankan (Recommended)'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 2: RACE CATEGORIES & REGISTRATION                                  */}
        {/* ======================================================================= */}
        {activeTab === 'categories' && (
          <div id="race-categories-section" className="mt-8 space-y-8 animate-in fade-in duration-300">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h3 className="text-2xl font-black">Pilihan Kategori Lomba</h3>
              <p className="text-xs sm:text-sm text-[#6B7C8C] dark:text-[#A7BBC7] mt-1">
                Pilih tantangan yang sesuai dengan kesiapan fisik dan pengalaman lari lintas alam Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {(race.categories || []).map((cat) => {
                const slotsLeft = cat.quota - cat.slotsTaken;
                const isSoldOut = slotsLeft <= 0;
                const percentFilled = Math.round((cat.slotsTaken / cat.quota) * 100);

                return (
                  <div
                    key={cat.id}
                    className="bg-white dark:bg-[#1C2129] rounded-3xl border border-[#E1E5EA] dark:border-[#2C3440] shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Header Card */}
                    <div className="p-6 sm:p-8 border-b border-[#E1E5EA] dark:border-[#2C3440] bg-gradient-to-br from-transparent to-[#DA7F8F]/5">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full bg-[#DA7F8F]/15 text-[#DA7F8F] text-xs font-black uppercase tracking-wider">
                          {cat.distance}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {cat.difficulty || 'Challenging'}
                        </span>
                      </div>

                      <h4 className="text-2xl font-black text-[#2B3542] dark:text-white mt-2">{cat.name}</h4>
                      <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-2 line-clamp-2 leading-relaxed">
                        {cat.description || 'Rute menantang melintasi sabana dan tanjakan teknis gunung Lawu.'}
                      </p>

                      <div className="mt-6">
                        <span className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">Biaya Pendaftaran:</span>
                        <p className="text-3xl font-black text-[#DA7F8F]">
                          Rp{cat.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    {/* Specs List */}
                    <div className="p-6 sm:p-8 space-y-4 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E1E5EA] dark:border-[#2C3440]">
                        <span className="text-[#6B7C8C] dark:text-[#A7BBC7]">Total Elevasi Gain:</span>
                        <strong className="font-bold text-[#2B3542] dark:text-white">{cat.elevationGain}</strong>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b border-[#E1E5EA] dark:border-[#2C3440]">
                        <span className="text-[#6B7C8C] dark:text-[#A7BBC7]">Cut-Off Time (COT):</span>
                        <strong className="font-bold text-[#2B3542] dark:text-white">{cat.cot}</strong>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b border-[#E1E5EA] dark:border-[#2C3440]">
                        <span className="text-[#6B7C8C] dark:text-[#A7BBC7]">Waktu Flag-Off:</span>
                        <strong className="font-bold text-[#2B3542] dark:text-white">{cat.flagOff || '05:00 WIB'}</strong>
                      </div>
                      <div className="pt-1">
                        <span className="text-[#6B7C8C] dark:text-[#A7BBC7] block mb-1">Syarat / Kualifikasi:</span>
                        <p className="text-[11px] font-medium text-[#2B3542] dark:text-[#FAF3F3] bg-gray-50 dark:bg-[#14171C] p-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440]">
                          {cat.qualification || 'Kondisi fisik prima dan lulus pemeriksaan mandatory gear.'}
                        </p>
                      </div>

                      {/* Quota Progress */}
                      <div className="pt-2">
                        <div className="flex justify-between text-[11px] mb-1 font-semibold">
                          <span>Sisa Kuota:</span>
                          <span className={slotsLeft < 10 ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>
                            {slotsLeft} / {cat.quota} Slot
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-[#2C3440] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${percentFilled > 80 ? 'bg-rose-500' : 'bg-[#DA7F8F]'}`}
                            style={{ width: `${percentFilled}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-6 sm:p-8 pt-0">
                      <button
                        type="button"
                        disabled={isSoldOut}
                        onClick={() => navigate(`/races/${race.id}/register?category=${cat.id}`)}
                        className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                          isSoldOut
                            ? 'bg-gray-200 dark:bg-[#2C3440] text-gray-400 cursor-not-allowed'
                            : 'bg-[#DA7F8F] hover:bg-[#c96c7d] text-white shadow-lg shadow-[#DA7F8F]/30 hover:scale-102 active:scale-98'
                        }`}
                      >
                        <span>{isSoldOut ? 'SLOT HABIS (SOLD OUT)' : `DAFTAR KATEGORI ${cat.name.split(' ')[0]}`}</span>
                        {!isSoldOut && <ArrowRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 3: JADWAL ACARA (SCHEDULE TIMELINE)                                */}
        {/* ======================================================================= */}
        {activeTab === 'schedule' && (
          <div className="mt-8 space-y-8 animate-in fade-in duration-300">
            <div className="max-w-3xl mx-auto">
              {(race.schedule || []).map((sched, dayIdx) => (
                <div key={dayIdx} className="mb-10 last:mb-0">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DA7F8F]/15 text-[#DA7F8F] text-xs font-black uppercase tracking-wider mb-6">
                    <Calendar className="w-4 h-4" />
                    <span>{sched.day}</span>
                  </div>

                  <div className="relative border-l-2 border-[#E1E5EA] dark:border-[#2C3440] ml-4 sm:ml-6 space-y-6">
                    {sched.events.map((evt, evtIdx) => (
                      <div key={evtIdx} className="relative pl-6 sm:pl-8 group">
                        {/* Dot indicator */}
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white dark:bg-[#1C2129] border-4 border-[#DA7F8F] group-hover:scale-125 transition-transform" />

                        <div className="bg-white dark:bg-[#1C2129] p-5 rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm">
                          <span className="font-mono text-xs font-black text-[#DA7F8F] block mb-1">
                            {evt.time}
                          </span>
                          <h4 className="text-base font-bold text-[#2B3542] dark:text-[#FAF3F3]">
                            {evt.title}
                          </h4>
                          {evt.loc && (
                            <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#DA7F8F]" />
                              <span>{evt.loc}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 4: PESERTA & LIVE LEADERBOARD                                      */}
        {/* ======================================================================= */}
        {activeTab === 'leaderboard' && (
          <div className="mt-8 space-y-8 animate-in fade-in duration-300">
            {/* Top 3 Podium Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredLeaderboard.slice(0, 3).map((podium, idx) => {
                const medalColors = [
                  'from-amber-400 to-yellow-600 text-amber-950',
                  'from-slate-300 to-slate-400 text-slate-900',
                  'from-amber-700 to-amber-900 text-white'
                ];
                const medalLabels = ['1ST CHAMPION', '2ND RUNNER-UP', '3RD PLACE'];

                return (
                  <div
                    key={podium.bib}
                    className="bg-white dark:bg-[#1C2129] p-6 rounded-3xl border border-[#E1E5EA] dark:border-[#2C3440] shadow-md relative overflow-hidden text-center flex flex-col items-center justify-between"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#DA7F8F]/20 to-transparent flex items-center justify-center text-xl font-black mb-3 text-[#DA7F8F]">
                      #{idx + 1}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r ${medalColors[idx]} mb-2`}>
                      {medalLabels[idx]}
                    </span>
                    <h4 className="text-lg font-bold text-[#2B3542] dark:text-[#FAF3F3]">{podium.name}</h4>
                    <p className="text-xs font-mono text-[#6B7C8C] dark:text-[#A7BBC7] mt-1">{podium.bib} • {podium.category}</p>
                    
                    <div className="mt-4 pt-3 border-t border-[#E1E5EA] dark:border-[#2C3440] w-full">
                      <span className="text-[10px] uppercase text-[#6B7C8C] dark:text-[#A7BBC7]">Waktu Finish</span>
                      <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{podium.finishTime || podium.time}</p>
                      <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">Pace: {podium.avgPace || podium.pace || '-'}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white dark:bg-[#1C2129] p-4 sm:p-5 rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {['ALL', '50K', '30K', '15K'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      selectedCategoryFilter === cat
                        ? 'bg-[#DA7F8F] text-white'
                        : 'bg-gray-100 dark:bg-[#14171C] text-[#6B7C8C] dark:text-[#A7BBC7] hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'ALL' ? 'Semua Kategori' : cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama atau nomor BIB..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-gray-50 dark:bg-[#14171C] border border-[#E1E5EA] dark:border-[#2C3440] text-[#2B3542] dark:text-white focus:outline-none focus:border-[#DA7F8F]"
                />
              </div>
            </div>

            {/* Interactive Leaderboard Table */}
            <div className="bg-white dark:bg-[#1C2129] rounded-3xl border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-gray-50 dark:bg-[#14171C] text-[#6B7C8C] dark:text-[#A7BBC7] uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-6 py-4 font-bold">Peringkat</th>
                      <th className="px-6 py-4 font-bold">BIB</th>
                      <th className="px-6 py-4 font-bold">Nama Pelari</th>
                      <th className="px-6 py-4 font-bold">Kategori</th>
                      <th className="px-6 py-4 font-bold">Waktu Finish</th>
                      <th className="px-6 py-4 font-bold">Avg Pace</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1E5EA] dark:divide-[#2C3440] text-[#2B3542] dark:text-[#FAF3F3]">
                    {filteredLeaderboard.length > 0 ? (
                      filteredLeaderboard.map((runner, index) => (
                        <tr key={runner.bib || index} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-black font-mono">
                            {runner.rank || index + 1}
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-[#DA7F8F]">
                            {runner.bib}
                          </td>
                          <td className="px-6 py-4 font-semibold text-sm">
                            {runner.name}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-md bg-[#DA7F8F]/10 text-[#DA7F8F] font-bold text-[10px]">
                              {runner.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                            {runner.finishTime || runner.time || '-'}
                          </td>
                          <td className="px-6 py-4 text-[#6B7C8C] dark:text-[#A7BBC7]">
                            {runner.avgPace || runner.pace || '-'}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                              {runner.status || 'Finished'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                          Data pelari tidak ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 4.5: DAFTAR FINISHER                                               */}
        {/* ======================================================================= */}
        {activeTab === 'finishers' && (
          <div className="mt-8 space-y-8 animate-in fade-in duration-300">
            {/* Filter & Search Bar */}
            <div className="bg-white dark:bg-[#1C2129] p-4 sm:p-5 rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {['ALL', '50K', '30K', '15K'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      selectedCategoryFilter === cat
                        ? 'bg-[#DA7F8F] text-white'
                        : 'bg-gray-100 dark:bg-[#14171C] text-[#6B7C8C] dark:text-[#A7BBC7] hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'ALL' ? 'Semua Kategori' : cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama atau nomor BIB..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-gray-50 dark:bg-[#14171C] border border-[#E1E5EA] dark:border-[#2C3440] text-[#2B3542] dark:text-white focus:outline-none focus:border-[#DA7F8F]"
                />
              </div>
            </div>

            {/* Finishers Table */}
            <div className="bg-white dark:bg-[#1C2129] rounded-3xl border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-gray-50 dark:bg-[#14171C] text-[#6B7C8C] dark:text-[#A7BBC7] uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-6 py-4 font-bold">Peringkat</th>
                      <th className="px-6 py-4 font-bold">BIB</th>
                      <th className="px-6 py-4 font-bold">Nama Finisher</th>
                      <th className="px-6 py-4 font-bold">Kategori</th>
                      <th className="px-6 py-4 font-bold">Waktu Finish</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1E5EA] dark:divide-[#2C3440] text-[#2B3542] dark:text-[#FAF3F3]">
                    {filteredLeaderboard.length > 0 ? (
                      filteredLeaderboard.map((runner, index) => (
                        <tr key={runner.bib || index} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-black font-mono">
                            {runner.rank || index + 1}
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-[#DA7F8F]">
                            {runner.bib}
                          </td>
                          <td className="px-6 py-4 font-semibold text-sm">
                            {runner.name}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-md bg-[#DA7F8F]/10 text-[#DA7F8F] font-bold text-[10px]">
                              {runner.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                            {runner.finishTime || runner.time || '-'}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                              {runner.status || 'Finished'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          Data pelari tidak ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 5: GALERI & BERITA                                                 */}
        {/* ======================================================================= */}
        {activeTab === 'gallery' && (
          <div className="mt-8 space-y-10 animate-in fade-in duration-300">
            {/* Gallery Grid */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#DA7F8F]" />
                <span>Dokumentasi Visual Lintasan & Event</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(race.gallery || []).map((img, idx) => (
                  <div key={idx} className="group relative rounded-2xl overflow-hidden h-64 bg-stone-900 border border-[#E1E5EA] dark:border-[#2C3440] shadow-md">
                    <img
                      src={img.url}
                      alt={img.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                      <p className="text-xs text-white font-medium leading-snug mb-3">{img.caption}</p>
                      <a href={img.url} target="_blank" rel="noopener noreferrer" className="self-start px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/40 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/30 flex items-center gap-1.5 transition-colors">
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh HD</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* News / Trail Updates */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#DA7F8F]" />
                <span>Kabar & Buletin Resmi Perlombaan</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(race.news || []).map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-[#1C2129] p-6 rounded-3xl border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-[#DA7F8F] font-bold block mb-1">{item.date}</span>
                      <h4 className="text-base font-bold text-[#2B3542] dark:text-white mb-2">{item.title}</h4>
                      <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] leading-relaxed">{item.summary}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#E1E5EA] dark:border-[#2C3440] flex items-center text-xs font-bold text-[#DA7F8F]">
                      <span>Baca Instruksi Lengkap</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
