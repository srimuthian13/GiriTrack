import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  Mountain,
  Clock,
  ArrowLeft,
  Play,
  Edit,
  Trash2,
  Shield,
  MessageSquare,
  Send,
  User,
  Heart,
  Star,
  CheckCircle2,
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  Sun,
  Compass,
  TrendingUp,
  Sparkles,
  Download,
  AlertTriangle,
  Share2,
  X
} from 'lucide-react';
import { useTrail } from '../../context/TrailContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import MapViewer from '../../components/MapViewer';
import ModalConfirm from '../../components/ModalConfirm';
import DetailSkeleton from '../../components/skeleton/DetailSkeleton';

/**
 * Elevation Profile Component
 * Generates an outdoor contour terrain elevation graph from Basecamp to Peak
 */
function ElevationProfileWidget({ elevationM = 2958, distanceKm = 12.5 }) {
  const basecampElevation = Math.max(500, Math.round(elevationM * 0.45));
  const elevationGain = elevationM - basecampElevation;

  // Generate 5 Elevation Waypoints
  const waypoints = [
    { name: 'Basecamp (Start)', dist: '0.0 km', elev: basecampElevation },
    { name: 'Pos 1 (Gerbang)', dist: `${(distanceKm * 0.25).toFixed(1)} km`, elev: Math.round(basecampElevation + elevationGain * 0.22) },
    { name: 'Pos 2 (Pos Air)', dist: `${(distanceKm * 0.5).toFixed(1)} km`, elev: Math.round(basecampElevation + elevationGain * 0.52) },
    { name: 'Pos 3 (Shelter)', dist: `${(distanceKm * 0.75).toFixed(1)} km`, elev: Math.round(basecampElevation + elevationGain * 0.78) },
    { name: 'Puncak (Summit)', dist: `${distanceKm} km`, elev: elevationM },
  ];

  return (
    <div className="bg-white/90 dark:bg-[#1C2129] rounded-3xl p-6 sm:p-8 border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm space-y-5 transition-colors duration-300">
      
      {/* Header Elevation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E1E5EA] dark:border-[#2C3440] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#DA7F8F]" />
            <span>Profil Elevasi & Kontur Ketinggian</span>
          </h2>
          <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-0.5">
            Grafik tanjakan rute dari titik awal (Basecamp) hingga titik tertinggi (Puncak)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-[#DA7F8F]/15 text-[#DA7F8F] text-xs font-bold font-mono">
            Gain: +{elevationGain} m
          </span>
          <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold font-mono">
            Max: {elevationM} mdpl
          </span>
        </div>
      </div>

      {/* SVG Elevation Graphic Area */}
      <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-gradient-to-b from-[#A7BBC7]/15 to-transparent dark:from-black/30 dark:to-black/10 border border-[#E1E5EA] dark:border-[#2C3440] p-2 select-none">
        
        <svg
          viewBox="0 0 600 180"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="elevFillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DA7F8F" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#A7BBC7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#FAF3F3" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="elevStrokeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#A7BBC7" />
              <stop offset="50%" stopColor="#E594A2" />
              <stop offset="100%" stopColor="#DA7F8F" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          <line x1="30" y1="40" x2="570" y2="40" stroke="rgba(167,187,199,0.25)" strokeDasharray="3,3" />
          <line x1="30" y1="90" x2="570" y2="90" stroke="rgba(167,187,199,0.25)" strokeDasharray="3,3" />
          <line x1="30" y1="140" x2="570" y2="140" stroke="rgba(167,187,199,0.25)" strokeDasharray="3,3" />

          {/* Area Fill Curve */}
          <path
            d="M 30 150 Q 150 145, 230 115 T 420 65 T 570 30 L 570 170 L 30 170 Z"
            fill="url(#elevFillGrad)"
          />

          {/* Elevation Stroke Line */}
          <path
            d="M 30 150 Q 150 145, 230 115 T 420 65 T 570 30"
            fill="none"
            stroke="url(#elevStrokeGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Point 1 (Basecamp) */}
          <circle cx="30" cy="150" r="5" fill="#A7BBC7" stroke="#ffffff" strokeWidth="2" />
          <text x="35" y="142" fontSize="9" fontWeight="bold" fill="#3D5A70">
            {basecampElevation} m
          </text>

          {/* Point 2 (Mid ridge) */}
          <circle cx="230" cy="115" r="4" fill="#E594A2" stroke="#ffffff" strokeWidth="1.5" />
          
          {/* Point 3 (Shelter) */}
          <circle cx="420" cy="65" r="4" fill="#DA7F8F" stroke="#ffffff" strokeWidth="1.5" />

          {/* Point 4 (Summit) */}
          <circle cx="570" cy="30" r="6" fill="#DA7F8F" stroke="#ffffff" strokeWidth="2.5" />
          <text x="500" y="24" fontSize="10" fontWeight="900" fill="#DA7F8F">
            ▲ {elevationM} m
          </text>
        </svg>

        {/* Floating Start & Summit Markers */}
        <div className="absolute bottom-2 left-4 text-[10px] font-bold text-[#3D5A70] dark:text-[#A7BBC7]">
          Basecamp ({basecampElevation} mdpl)
        </div>
        <div className="absolute bottom-2 right-4 text-[10px] font-bold text-[#DA7F8F] text-right">
          Puncak ({elevationM} mdpl)
        </div>
      </div>

      {/* Checkpoints Key Indicators Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-center">
        {waypoints.map((wp, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440]"
          >
            <p className="text-[10px] font-semibold text-[#6B7C8C] dark:text-[#A7BBC7] truncate">{wp.name}</p>
            <p className="text-xs font-black text-[#2B3542] dark:text-[#FAF3F3] mt-0.5">{wp.elev} <span className="text-[9px] font-normal">mdpl</span></p>
            <p className="text-[9px] text-[#DA7F8F] font-mono font-bold">{wp.dist}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

/**
 * Mountain Weather Widget Component
 */
function MountainWeatherWidget({ elevationM = 2958 }) {
  const baseTemp = Math.max(10, Math.min(22, Math.round(28 - (elevationM / 1000) * 5)));
  const summitTemp = Math.max(4, baseTemp - 7);

  return (
    <div className="bg-white/90 dark:bg-[#1C2129] rounded-3xl p-6 sm:p-8 border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm space-y-5 transition-colors duration-300">
      
      {/* Header Weather */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E1E5EA] dark:border-[#2C3440] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-[#DA7F8F] shrink-0" />
            <span>Kondisi Cuaca & Puncak Hari Ini</span>
          </h2>
          <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-0.5">
            Prakiraan mikroklimat gunung real-time untuk persiapan logistik & pakaian pendakian
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#DA7F8F]/15 text-[#DA7F8F] border border-[#DA7F8F]/30 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kondisi Ramah Muncak</span>
          </span>
        </div>
      </div>

      {/* 4 Weather Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        
        <div className="p-3.5 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[#6B7C8C] dark:text-[#A7BBC7] font-semibold">
            <Thermometer className="w-4 h-4 text-[#DA7F8F]" />
            <span>Suhu Rerata</span>
          </div>
          <p className="text-xl font-black text-[#2B3542] dark:text-[#FAF3F3]">
            {baseTemp}°C
          </p>
          <p className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7]">
            Puncak: ~{summitTemp}°C dini hari
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[#6B7C8C] dark:text-[#A7BBC7] font-semibold">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Kondisi Langit</span>
          </div>
          <p className="text-sm sm:text-base font-black text-[#2B3542] dark:text-[#FAF3F3] leading-tight">
            Cerah Berawan
          </p>
          <p className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7]">
            Kabut tipis sore hari
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[#6B7C8C] dark:text-[#A7BBC7] font-semibold">
            <Wind className="w-4 h-4 text-[#3D5A70] dark:text-[#A7BBC7]" />
            <span>Kecepatan Angin</span>
          </div>
          <p className="text-xl font-black text-[#2B3542] dark:text-[#FAF3F3]">
            12 <span className="text-xs font-normal">km/j</span>
          </p>
          <p className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7]">
            Arah: Barat Daya (Tenang)
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[#6B7C8C] dark:text-[#A7BBC7] font-semibold">
            <Droplets className="w-4 h-4 text-[#DA7F8F]" />
            <span>Kelembapan</span>
          </div>
          <p className="text-xl font-black text-[#2B3542] dark:text-[#FAF3F3]">
            78%
          </p>
          <p className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7]">
            Indeks UV: 4 (Sedang)
          </p>
        </div>

      </div>

      {/* Summit Tip Banner */}
      <div className="p-3.5 rounded-2xl bg-[#E1E5EA]/60 dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] text-xs text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2.5">
        <Compass className="w-4 h-4 text-[#DA7F8F] shrink-0" />
        <span>
          <strong>Rekomendasi Waktu Summit:</strong> Mulai jalan dari pos terakhir pukul 03:00 - 03:30 WIB untuk mengejar Golden Sunrise di puncak dan menghindari terik matahari.
        </span>
      </div>

    </div>
  );
}

export default function TrailDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTrailById, deleteTrail, verifyTrail, addReview, deleteReview, isFavorite, toggleFavorite } = useTrail();
  const { t } = useLanguage();
  const { user: currentUser, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  // Rating & Review Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState(currentUser?.name || '');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const trail = getTrailById(id);

  // Simulated loading state effect on mount
  const [weatherModalOpen, setWeatherModalOpen] = useState(false);
  const [offRouteAlertActive, setOffRouteAlertActive] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (currentUser?.name && !reviewerName) {
      setReviewerName(currentUser.name);
    }
  }, [currentUser, reviewerName]);

  if (loading) {
    return <DetailSkeleton />;
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Silakan pilih rating bintang terlebih dahulu!');
      return;
    }
    
    addReview(trail.id, {
      id: Date.now(),
      reviewer: reviewerName,
      rating: rating,
      comment: reviewComment,
      date: new Date().toISOString()
    });

    setReviewSuccess(true);
    setReviewerName('');
    setReviewComment('');
    setRating(0);
    setHoverRating(0);
    setTimeout(() => setReviewSuccess(false), 5000);
  };

  const handleDownloadOfflineMap = () => {
    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: trail.coordinates || []
          },
          properties: {
            name: trail.name,
            elevation: trail.elevation_m
          }
        }
      ]
    };
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `${trail.name.replace(/\s+/g, '-').toLowerCase()}-offline-route.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Rute dan koordinat titik pos berhasil diunduh untuk penggunaan offline tanpa sinyal!', { type: 'success' });
  };

  const handleLiveShare = () => {
    const shareText = `Darurat / Live Track: Saya sedang mendaki ${trail.name}. Pantau lokasi saya di: https://giritrack.id/live/track-xyz123`;
    navigator.clipboard.writeText(shareText);
    showToast('Tautan pelacakan berhasil disalin ke clipboard!', { type: 'success' });
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  if (!trail) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-[#1C2129] rounded-3xl border border-[#E1E5EA] dark:border-[#2C3440] text-center space-y-4 text-[#2B3542] dark:text-[#FAF3F3]">
        <h2 className="text-xl font-bold">
          Jalur Pendakian Tidak Ditemukan
        </h2>
        <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">
          Jalur pendakian yang Anda cari mungkin telah dihapus atau URL tidak valid.
        </p>
        <Link
          to="/trails"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#DA7F8F] text-white hover:bg-[#c96c7d] text-xs font-bold shadow-md transition-transform duration-150 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Jalur</span>
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(trail.id);

  const handleFavoriteToggle = () => {
    toggleFavorite(trail.id);
    if (!favorited) {
      showToast(`"${trail.name}" ditambahkan ke Favorit! ❤️`, {
        type: 'favorite',
        title: 'Ditambahkan ke Favorit',
      });
    } else {
      showToast(`"${trail.name}" dihapus dari Favorit`, {
        type: 'info',
      });
    }
  };

  const handleDeleteConfirm = () => {
    deleteTrail(trail.id);
    setDeleteModalOpen(false);
    showToast(`Jalur "${trail.name}" berhasil dihapus.`, { type: 'info' });
    navigate('/trails');
  };

  const reviewsList = Array.isArray(trail.reviews) ? trail.reviews : [];
  const displayRating = Number(trail.ratingAvg) > 0 ? Number(trail.ratingAvg).toFixed(1) : 'Baru';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 pb-12 text-[#2B3542] dark:text-[#FAF3F3] transition-colors duration-300 ease-in-out">
      
      {/* Back Button & Top Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-[#2B3542] dark:text-[#FAF3F3] hover:text-[#DA7F8F] cursor-pointer transition-transform duration-150 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('btn.back')}</span>
        </button>

        <div className="flex items-center gap-2">
          {!isAdmin && (
            <button
              onClick={handleFavoriteToggle}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer shadow-sm ${
                favorited
                  ? 'bg-[#DA7F8F] text-white border-[#DA7F8F] shadow-[#DA7F8F]/30'
                  : 'bg-white dark:bg-[#1C2129] text-[#2B3542] border-[#E1E5EA] dark:text-[#FAF3F3] dark:border-[#2C3440] hover:bg-[#FAF3F3]'
              }`}
              title={favorited ? 'Hapus dari Favorit' : 'Sukai & Tambah ke Favorit'}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-white text-white' : 'text-[#DA7F8F]'}`} />
              <span>{favorited ? 'Tersimpan di Favorit' : 'Tambah ke Favorit'}</span>
            </button>
          )}

          {isAdmin && (
            <>
              <button
                onClick={() => navigate(`/manage?editId=${trail.id}`)}
                className="p-2 rounded-xl bg-[#E1E5EA] text-[#2B3542] dark:bg-[#252C36] dark:text-[#FAF3F3] hover:bg-[#A7BBC7]/30 transition-all duration-200 active:scale-95 cursor-pointer text-xs font-semibold flex items-center gap-1.5"
              >
                <Edit className="w-4 h-4 text-[#DA7F8F]" />
                <span className="hidden sm:inline">{t('btn.edit')}</span>
              </button>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="p-2 rounded-xl bg-[#E1E5EA] text-rose-600 dark:bg-[#252C36] dark:text-rose-400 hover:bg-rose-100 transition-all duration-200 active:scale-95 cursor-pointer text-xs font-semibold flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t('btn.delete')}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hero Banner Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E1E5EA] dark:border-[#2C3440] h-64 sm:h-96">
        <img
          src={trail.image}
          alt={trail.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        {trail.status === 'pending' && (
          <div className="absolute top-4 left-4 right-4 bg-amber-500 text-white font-bold px-4 py-2 rounded-2xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-lg backdrop-blur-md gap-3 z-10">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 shrink-0" />
              <span>⚠️ Jalur ini sedang menunggu persetujuan dan verifikasi.</span>
            </div>
            {isAdmin ? (
              <button
                onClick={() => {
                  verifyTrail(trail.id);
                  showToast(`Jalur "${trail.name}" berhasil diverifikasi! ✅`, { type: 'success' });
                }}
                className="px-3 py-1.5 rounded-xl bg-white text-amber-600 hover:bg-amber-50 text-xs font-bold transition shadow-sm whitespace-nowrap cursor-pointer"
              >
                Verifikasi Sekarang
              </button>
            ) : (
              <span className="text-[10px] uppercase bg-black/20 text-white px-2 py-0.5 rounded-full font-mono whitespace-nowrap">Status: Pending</span>
            )}
          </div>
        )}

        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-sm">
              Tingkat {trail.difficulty}
            </span>

            <span className="px-3 py-1 text-xs font-black rounded-full bg-amber-400 text-amber-950 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-950 text-amber-950" />
              <span>{displayRating}</span>
              <span className="text-[10px] font-normal opacity-85">({reviewsList.length} ulasan)</span>
            </span>

            {favorited && (
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#DA7F8F] text-white backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                <Heart className="w-3.5 h-3.5 fill-white text-white" />
                <span>Favorit</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {trail.name}
          </h1>

          <div className="flex items-center gap-2 text-sm text-stone-200 font-medium">
            <MapPin className="w-4 h-4 text-[#DA7F8F] shrink-0" />
            <span>{trail.location}</span>
          </div>
        </div>
      </div>

      {/* Key Technical Specifications Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm text-center transition-colors duration-300">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#6B7C8C] dark:text-[#A7BBC7] font-medium mb-1">
            <Navigation className="w-4 h-4 text-[#DA7F8F]" />
            <span>Jarak Pendakian</span>
          </div>
          <p className="text-xl font-black text-[#2B3542] dark:text-[#FAF3F3]">
            {trail.distance_km} <span className="text-xs font-normal">km</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm text-center transition-colors duration-300">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#6B7C8C] dark:text-[#A7BBC7] font-medium mb-1">
            <Mountain className="w-4 h-4 text-[#DA7F8F]" />
            <span>Elevasi Puncak</span>
          </div>
          <p className="text-xl font-black text-[#2B3542] dark:text-[#FAF3F3]">
            {trail.elevation_m} <span className="text-xs font-normal">mdpl</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm text-center transition-colors duration-300">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#6B7C8C] dark:text-[#A7BBC7] font-medium mb-1">
            <Clock className="w-4 h-4 text-[#DA7F8F]" />
            <span>Estimasi Waktu</span>
          </div>
          <p className="text-xl font-black text-[#2B3542] dark:text-[#FAF3F3]">
            {trail.estimated_time || '6-7 Jam'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm text-center transition-colors duration-300">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#6B7C8C] dark:text-[#A7BBC7] font-medium mb-1">
            <Shield className="w-4 h-4 text-[#DA7F8F]" />
            <span>Kesulitan</span>
          </div>
          <p className="text-xl font-black text-[#2B3542] dark:text-[#FAF3F3]">
            {trail.difficulty}
          </p>
        </div>
      </div>

      {/* 4 Interactive Feature Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={handleDownloadOfflineMap}
          className="p-5 rounded-2xl bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm hover:shadow-md hover:border-[#DA7F8F] group transition-all duration-300 text-left cursor-pointer active:scale-95 flex flex-col gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-[#2B3542] dark:text-[#FAF3F3] text-sm">Peta Offline</h4>
            <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-1">Unduh Rute GPX/JSON</p>
          </div>
        </button>

        <button
          onClick={() => setWeatherModalOpen(true)}
          className="p-5 rounded-2xl bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm hover:shadow-md hover:border-[#DA7F8F] group transition-all duration-300 text-left cursor-pointer active:scale-95 flex flex-col gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-[#2B3542] dark:text-[#FAF3F3] text-sm">Kondisi Cuaca</h4>
            <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-1">Prakiraan Suhu Puncak</p>
          </div>
        </button>

        <div className="p-5 rounded-2xl bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${offRouteAlertActive ? 'bg-amber-100 text-amber-600' : 'bg-[#E1E5EA] dark:bg-[#2C3440] text-[#6B7C8C]'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <button
              onClick={() => {
                setOffRouteAlertActive(!offRouteAlertActive);
                if (!offRouteAlertActive) {
                  showToast('Sensor Deviasi Jalur Diaktifkan! Kami akan memperingatkan jika Anda keluar jalur >50m.', { type: 'success' });
                }
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${offRouteAlertActive ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-600'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${offRouteAlertActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div>
            <h4 className="font-bold text-[#2B3542] dark:text-[#FAF3F3] text-sm">Off-Route Alert</h4>
            <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-1">Peringatan Keluar Jalur</p>
          </div>
        </div>

        <button
          onClick={handleLiveShare}
          className="p-5 rounded-2xl bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm hover:shadow-md hover:border-[#DA7F8F] group transition-all duration-300 text-left cursor-pointer active:scale-95 flex flex-col gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-[#DA7F8F]/15 text-[#DA7F8F] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-[#2B3542] dark:text-[#FAF3F3] text-sm">Bagikan Lokasi</h4>
            <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-1">Share via WhatsApp</p>
          </div>
        </button>
      </div>

      {/* Description Section */}
      <div className="bg-white/90 dark:bg-[#1C2129] rounded-3xl p-6 sm:p-8 border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm space-y-4 transition-colors duration-300">
        <h2 className="text-xl font-bold text-[#2B3542] dark:text-[#FAF3F3]">
          Deskripsi & Informasi Jalur
        </h2>
        <p className="text-sm text-[#2B3542]/90 dark:text-[#FAF3F3]/90 leading-relaxed whitespace-pre-line">
          {trail.description}
        </p>
      </div>

      {/* OpenTopoMap Route Section */}
      <div className="bg-white/90 dark:bg-[#1C2129] rounded-3xl p-6 sm:p-8 border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm space-y-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#DA7F8F]" />
            <span>Peta Topografi Jalur Pendakian (OpenTopoMap)</span>
          </h2>
          <span className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">
            {trail.coordinates?.length || 0} Titik Waypoint
          </span>
        </div>

        <MapViewer
          coordinates={trail.coordinates}
          trailName={trail.name}
        />
      </div>

      <ElevationProfileWidget
        elevationM={trail.elevation_m}
        distanceKm={trail.distance_km}
      />

      {/* Rating & Reviews Section */}
      <div className="bg-white/90 dark:bg-[#1C2129] rounded-3xl p-6 sm:p-8 border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm space-y-6 transition-colors duration-300">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E1E5EA] dark:border-[#2C3440] pb-5 gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#DA7F8F]" />
              <span>Rating & Ulasan Pendaki ({reviewsList.length})</span>
            </h2>
            <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-1">
              Bagikan penilaian objektif mengenai keindahan pemandangan, medan, dan ketersediaan mata air.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#FAF3F3] dark:bg-[#252C36] px-4 py-2.5 rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] shrink-0">
            <div className="text-3xl font-black text-[#2B3542] dark:text-[#FAF3F3]">
              {displayRating}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center text-amber-500">
                {[1, 2, 3, 4, 5].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-4 h-4 ${
                      starIdx <= Math.round(Number(trail.ratingAvg) || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300 dark:text-stone-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7] font-semibold">
                Rata-rata {reviewsList.length} ulasan
              </span>
            </div>
          </div>
        </div>

        {!isAdmin && (
          <form onSubmit={handleReviewSubmit} className="space-y-4 bg-[#FAF3F3]/80 dark:bg-[#252C36]/60 p-5 sm:p-6 rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] transition-colors duration-300">
            <h3 className="text-sm font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Beri Penilaian & Tulis Pengalaman Mendaki</span>
            </h3>

            {reviewSuccess && (
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Ulasan dan rating Anda berhasil disimpan dan langsung diperbarui!</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7]">
                Pilih Skor Rating Bintang (1 - 5) *
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white dark:bg-[#1C2129] px-3 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440]">
                  {[1, 2, 3, 4, 5].map((starNum) => {
                    const isFilled = starNum <= (hoverRating || rating);
                    return (
                      <button
                        key={starNum}
                        type="button"
                        onClick={() => setRating(starNum)}
                        onMouseEnter={() => setHoverRating(starNum)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 cursor-pointer transition-transform duration-150 hover:scale-125 focus:outline-none"
                        title={`${starNum} Bintang`}
                      >
                        <Star
                          className={`w-6 h-6 transition-colors duration-150 ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-stone-300 dark:text-stone-600'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-bold text-[#2B3542] dark:text-[#FAF3F3]">
                  {rating === 5 ? '5.0 - Sangat Memuaskan & Indah' : `${rating}.0 Bintang`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7] mb-1">
                  Nama Pendaki / Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A7BBC7]" />
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Contoh: Rangga Explorer"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-white dark:bg-[#1C2129] text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7] mb-1">
                  Ulasan & Catatan Kondisi Jalur *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Bagikan kondisi jalur, ketersediaan sumber air, vegetasi, atau tips bagi pendaki lain..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-white dark:bg-[#1C2129] text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40 transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#DA7F8F] text-white hover:bg-[#c96c7d] font-bold text-xs cursor-pointer transition-all duration-200 active:scale-95 shadow-md flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Ulasan & Rating</span>
            </button>
          </form>
        )}

        {/* Reviews List */}
        {reviewsList.length > 0 ? (
          <div className="space-y-3 pt-2">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] space-y-2 transition-colors duration-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'}
                      alt={rev.userName}
                      className="w-9 h-9 rounded-full object-cover border border-[#E1E5EA] dark:border-stone-700 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-[#2B3542] dark:text-[#FAF3F3]">
                        {rev.userName || 'Pendaki Giri'}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center text-amber-500">
                          {[1, 2, 3, 4, 5].map((starIdx) => (
                            <Star
                              key={starIdx}
                              className={`w-3 h-3 ${
                                starIdx <= Number(rev.rating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-300 dark:text-stone-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7] font-mono">
                          {rev.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {(isAdmin || currentUser?.id === rev.userId) && (
                    <button
                      onClick={() => deleteReview(trail.id, rev.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 text-xs transition cursor-pointer"
                      title="Hapus Ulasan Ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-[#2B3542]/90 dark:text-[#FAF3F3]/90 leading-relaxed pl-12">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-[#6B7C8C] dark:text-[#A7BBC7] bg-[#FAF3F3]/50 dark:bg-[#252C36]/50 rounded-2xl border border-dashed border-[#E1E5EA] dark:border-[#2C3440]">
            Belum ada ulasan untuk jalur ini. Jadilah yang pertama memberikan ulasan dan rating bintang!
          </div>
        )}
      </div>

      {/* Modal Confirm Delete */}
      <ModalConfirm
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={t('modal.confirmDeleteTitle')}
        description={t('modal.confirmDeleteDesc')}
        confirmText={t('btn.delete')}
        cancelText={t('btn.cancel')}
        isDestructive={true}
      />

      {/* Weather Modal */}
      {weatherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#FAF3F3] dark:bg-[#1C2129] rounded-[2rem] shadow-2xl border border-[#E1E5EA] dark:border-[#2C3440] overflow-hidden relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setWeatherModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5 text-[#2B3542] dark:text-[#FAF3F3]" />
            </button>
            <div className="p-4 sm:p-6">
              <MountainWeatherWidget elevationM={trail.elevation_m} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
