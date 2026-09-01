import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  X,
  Navigation,
  Clock,
  Gauge,
  Calendar,
  Mountain,
  Flame,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Camera,
  Upload,
  Trash2,
  Download,
  FileCode,
  Printer,
  CheckCircle,
  Maximize2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTrail } from '../context/TrailContext';
import 'leaflet/dist/leaflet.css';

// Leaflet DivIcons for Start (A), End (B), and Animated Hiker Marker
const startIcon = L.divIcon({
  className: 'custom-history-marker-start',
  html: `<div style="background-color: #10B981; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-weight: 800; font-size: 11px;">A</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const endIcon = L.divIcon({
  className: 'custom-history-marker-end',
  html: `<div style="background-color: #EF4444; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-weight: 800; font-size: 11px;">B</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const hikerReplayIcon = L.divIcon({
  className: 'custom-history-marker-hiker',
  html: `
    <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; inset: 0; background-color: #2563EB; border-radius: 50%; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: relative; background-color: #1E40AF; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #F3E8DF; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); font-size: 13px;">
        🚶
      </div>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

function MapFitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [bounds, map]);
  return null;
}

export default function HistoryMapModal({ isOpen, onClose, record }) {
  const { t } = useLanguage();
  const { addHistoryPhoto, deleteHistoryPhoto } = useTrail();

  // Replay State
  const [isPlaying, setIsPlaying] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);
  const [replaySpeed, setReplaySpeed] = useState(1); // 1x, 2x, 4x
  const replayIntervalRef = useRef(null);

  // Photo & Lightbox State
  const [selectedPhotoZoom, setSelectedPhotoZoom] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const coordinates = Array.isArray(record?.coordinates) && record.coordinates.length > 0
    ? record.coordinates
    : [[-6.7912, 106.9825], [-6.7850, 106.9870], [-6.7790, 106.9910]];

  const totalPoints = coordinates.length;
  const startPoint = coordinates[0];
  const endPoint = coordinates[coordinates.length - 1];
  const centerPoint = coordinates[Math.floor(coordinates.length / 2)] || startPoint;

  // Active coordinates drawn so far in replay
  const activeReplayCoordinates = coordinates.slice(0, replayIndex + 1);
  const currentReplayPoint = coordinates[replayIndex] || startPoint;

  // Reset replay when record changes or modal opens
  useEffect(() => {
    setIsPlaying(false);
    setReplayIndex(0);
    if (replayIntervalRef.current) {
      clearInterval(replayIntervalRef.current);
    }
  }, [record?.id, isOpen]);

  // Replay Timer Controller
  useEffect(() => {
    if (isPlaying) {
      const baseDelay = 400; // ms per point
      const delay = Math.max(80, baseDelay / replaySpeed);

      replayIntervalRef.current = setInterval(() => {
        setReplayIndex((prevIndex) => {
          if (prevIndex >= totalPoints - 1) {
            setIsPlaying(false);
            clearInterval(replayIntervalRef.current);
            return totalPoints - 1;
          }
          return prevIndex + 1;
        });
      }, delay);
    } else {
      if (replayIntervalRef.current) {
        clearInterval(replayIntervalRef.current);
      }
    }

    return () => {
      if (replayIntervalRef.current) {
        clearInterval(replayIntervalRef.current);
      }
    };
  }, [isPlaying, replaySpeed, totalPoints]);

  if (!isOpen || !record) return null;

  // Helper formatting
  const formatSecondsToDuration = (seconds = 0) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}j ${mins}m ${secs}d`;
    }
    return `${mins}m ${secs}d`;
  };

  const estimatedCalories = Math.round(
    Number(record.distance_km || 0) * 65 || (Number(record.duration_seconds || 0) / 60) * 7.5
  );

  // Play / Pause / Reset Handlers
  const handleTogglePlay = () => {
    if (replayIndex >= totalPoints - 1) {
      setReplayIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleResetReplay = () => {
    setIsPlaying(false);
    setReplayIndex(0);
  };

  const handleSliderChange = (e) => {
    const newIdx = parseInt(e.target.value, 10);
    setReplayIndex(newIdx);
  };

  // Image Upload Handler (Compressed to Base64)
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Offscreen canvas compression to avoid localStorage storage limits
          const canvas = document.createElement('canvas');
          const maxDimension = 900;
          let width = img.width;
          let height = img.height;

          if (width > height && width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
          addHistoryPhoto(record.id, compressedBase64);
          setIsUploading(false);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 1. Download GPX File
  const handleDownloadGPX = () => {
    const trackPointsXml = coordinates
      .map(([lat, lon]) => `      <trkpt lat="${lat}" lon="${lon}"></trkpt>`)
      .join('\n');

    const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="GiriTrack - Komunitas Pendaki Indonesia" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${record.trail_name || 'Riwayat Pendakian GiriTrack'}</name>
    <time>${record.date}</time>
    <desc>Jarak: ${record.distance_km} km | Durasi: ${formatSecondsToDuration(record.duration_seconds)} | Kecepatan: ${record.avg_speed_kmh} km/j</desc>
  </metadata>
  <trk>
    <name>${record.trail_name || 'Rute Pendakian'}</name>
    <trkseg>
${trackPointsXml}
    </trkseg>
  </trk>
</gpx>`;

    const blob = new Blob([gpxContent], { type: 'application/gpx+xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = (record.trail_name || 'giritrack-route').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.href = url;
    link.download = `${safeName}-${new Date(record.date).toISOString().slice(0, 10)}.gpx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 2. Download JSON File
  const handleDownloadJSON = () => {
    const exportData = {
      app: 'GiriTrack',
      version: '1.0',
      export_date: new Date().toISOString(),
      record: {
        id: record.id,
        trail_name: record.trail_name,
        date: record.date,
        distance_km: record.distance_km,
        duration_seconds: record.duration_seconds,
        avg_speed_kmh: record.avg_speed_kmh,
        estimated_calories: estimatedCalories,
        total_points: coordinates.length,
        coordinates: coordinates,
      },
    };

    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = (record.trail_name || 'giritrack-data').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.href = url;
    link.download = `${safeName}-${new Date(record.date).toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 3. Print / PDF Summary
  const handlePrintCertificate = () => {
    window.print();
  };

  const progressPercent = Math.round(((replayIndex + 1) / totalPoints) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto print:bg-white print:p-0 print:static">
      
      {/* Printable Style Injection */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-history-report, #printable-history-report * {
            visibility: visible;
          }
          #printable-history-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 24px;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div
        id="printable-history-report"
        className="bg-white dark:bg-[#2D1C1D] border border-[#DBC4B6] dark:border-[#57595B]/40 rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl space-y-5 relative text-[#452829] dark:text-[#F3E8DF] my-auto"
      >
        
        {/* Header Modal */}
        <div className="flex items-start sm:items-center justify-between border-b border-[#DBC4B6]/60 dark:border-[#57595B]/40 pb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#2C6E49]/10 dark:bg-[#E8D1C5]/15 text-[#2C6E49] dark:text-[#E8D1C5] shrink-0">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-[#1E293B] dark:text-[#F3E8DF] tracking-tight">
                  {record.trail_name || 'Jalur Pendakian'}
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle className="w-3 h-3" />
                  <span>Sesi Selesai</span>
                </span>
              </div>
              <p className="text-xs text-[#57595B] dark:text-[#E8D1C5] flex items-center gap-1.5 mt-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#2C6E49] dark:text-[#E8D1C5]" />
                <span>
                  {new Date(record.date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="no-print p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#3F2728] transition cursor-pointer shrink-0"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid 4 Kotak Statistik Metrik */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#3F2728]/70 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-stone-400">Jarak Tempuh</p>
              <p className="text-lg font-black text-[#1E293B] dark:text-[#F3E8DF] leading-tight">
                {record.distance_km} <span className="text-xs font-semibold">km</span>
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#3F2728]/70 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-stone-400">Durasi Sesi</p>
              <p className="text-sm sm:text-base font-black text-[#1E293B] dark:text-[#F3E8DF] leading-tight">
                {formatSecondsToDuration(record.duration_seconds)}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#3F2728]/70 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 shrink-0">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-stone-400">Kecepatan Rerata</p>
              <p className="text-lg font-black text-[#1E293B] dark:text-[#F3E8DF] leading-tight">
                {record.avg_speed_kmh} <span className="text-xs font-semibold">km/j</span>
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#3F2728]/70 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-stone-400">Est. Kalori</p>
              <p className="text-lg font-black text-[#1E293B] dark:text-[#F3E8DF] leading-tight">
                ~{estimatedCalories} <span className="text-xs font-semibold">kcal</span>
              </p>
            </div>
          </div>

        </div>

        {/* 1. Leaflet Map Section & Replay Control Bar */}
        <div className="space-y-2">
          
          {/* Replay Player Controls Bar */}
          <div className="no-print p-3 rounded-2xl bg-slate-100 dark:bg-[#3F2728] border border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Play/Pause & Reset & Speed */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="px-3 py-1.5 rounded-full bg-[#2C6E49] text-white hover:bg-[#23583a] dark:bg-[#E8D1C5] dark:text-[#452829] font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Replay Rute</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResetReplay}
                className="p-1.5 rounded-full bg-white dark:bg-[#2D1C1D] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-stone-300 hover:bg-slate-50 transition cursor-pointer"
                title="Reset Replay"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Speed Buttons */}
              <div className="flex items-center rounded-full bg-white dark:bg-[#2D1C1D] border border-slate-200 dark:border-slate-700 p-0.5">
                {[1, 2, 4].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setReplaySpeed(spd)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                      replaySpeed === spd
                        ? 'bg-[#2C6E49] text-white dark:bg-[#E8D1C5] dark:text-[#452829]'
                        : 'text-slate-500 hover:text-slate-900 dark:text-stone-400'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Slider Progress and Point Counter */}
            <div className="flex-1 min-w-[200px] flex items-center gap-3">
              <input
                type="range"
                min="0"
                max={totalPoints - 1}
                value={replayIndex}
                onChange={handleSliderChange}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#2C6E49]"
              />
              <span className="text-[11px] font-mono text-slate-500 dark:text-stone-400 shrink-0 font-semibold">
                {progressPercent}% ({replayIndex + 1}/{totalPoints})
              </span>
            </div>

          </div>

          {/* Map Leaflet Container */}
          <div className="relative w-full h-[300px] sm:h-[340px] rounded-2xl overflow-hidden shadow-inner border border-slate-200 dark:border-[#57595B]/40 z-0">
            <MapContainer
              center={centerPoint}
              zoom={13}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapFitBounds bounds={coordinates} />

              {/* Full Background Path (Subtle Blue) */}
              <Polyline
                positions={coordinates}
                pathOptions={{
                  color: '#94A3B8',
                  weight: 4,
                  opacity: 0.6,
                  dashArray: '4, 6',
                }}
              />

              {/* Active Replay Path (Vibrant Emerald / Blue) */}
              <Polyline
                positions={activeReplayCoordinates}
                pathOptions={{
                  color: '#2C6E49',
                  weight: 5,
                  opacity: 0.95,
                }}
              />

              {/* Start Marker A */}
              <Marker position={startPoint} icon={startIcon}>
                <Popup>
                  <div className="text-xs font-sans">
                    <strong className="text-emerald-700 block">Titik Awal (Start A)</strong>
                    <span>{record.trail_name}</span>
                  </div>
                </Popup>
              </Marker>

              {/* End Marker B */}
              <Marker position={endPoint} icon={endIcon}>
                <Popup>
                  <div className="text-xs font-sans">
                    <strong className="text-rose-700 block">Titik Akhir (Finish B)</strong>
                    <span>{record.trail_name}</span>
                  </div>
                </Popup>
              </Marker>

              {/* Animated Replaying Hiker Marker */}
              <Marker position={currentReplayPoint} icon={hikerReplayIcon}>
                <Popup>
                  <div className="text-xs font-sans">
                    <strong>Posisi Tracker Saat Ini</strong>
                    <p className="text-[11px] text-slate-500">
                      Titik ke-{replayIndex + 1} ({progressPercent}%)
                    </p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* 2. Dokumentasi Foto Pendakian (Local Storage) */}
        <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-[#57595B]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#2C6E49] dark:text-[#E8D1C5]" />
              <h4 className="text-xs sm:text-sm font-bold text-[#1E293B] dark:text-[#F3E8DF]">
                Dokumentasi & Galeri Foto Sesi ({record.photos?.length || 0})
              </h4>
            </div>

            <div className="no-print">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                multiple
                className="hidden"
                id="history-photo-input"
              />
              <label
                htmlFor="history-photo-input"
                className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#3F2728] hover:bg-slate-200 dark:hover:bg-[#57595B]/60 text-[#1E293B] dark:text-[#F3E8DF] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition active:scale-95 border border-slate-200 dark:border-slate-700"
              >
                <Upload className="w-3.5 h-3.5 text-[#2C6E49] dark:text-[#E8D1C5]" />
                <span>{isUploading ? 'Memproses...' : 'Tambah Foto'}</span>
              </label>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          {Array.isArray(record.photos) && record.photos.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {record.photos.map((photoSrc, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-stone-900 shadow-sm"
                >
                  <img
                    src={photoSrc}
                    alt={`Dokumentasi ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300 cursor-pointer"
                    onClick={() => setSelectedPhotoZoom(photoSrc)}
                  />
                  
                  {/* Photo Actions Overlay */}
                  <div className="no-print absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5 p-1">
                    <button
                      type="button"
                      onClick={() => setSelectedPhotoZoom(photoSrc)}
                      className="p-1 rounded-full bg-white/80 hover:bg-white text-slate-900 cursor-pointer transition"
                      title="Lihat Penuh"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteHistoryPhoto(record.id, idx)}
                      className="p-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white cursor-pointer transition"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400 dark:text-stone-400">
              Belum ada foto dokumentasi yang diunggah untuk pendakian ini.
            </div>
          )}
        </div>

        {/* 3. Fitur Ekspor & Download Riwayat & Footer Actions */}
        <div className="no-print pt-3 border-t border-slate-100 dark:border-[#57595B]/30 flex flex-wrap items-center justify-between gap-3">
          
          {/* Export Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadGPX}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#3F2728] dark:hover:bg-[#57595B]/60 border border-slate-200 dark:border-slate-700 text-[#1E293B] dark:text-[#F3E8DF] text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm"
              title="Unduh file track GPS format .gpx"
            >
              <Download className="w-3.5 h-3.5 text-[#2C6E49] dark:text-[#E8D1C5]" />
              <span>Ekspor GPX</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#3F2728] dark:hover:bg-[#57595B]/60 border border-slate-200 dark:border-slate-700 text-[#1E293B] dark:text-[#F3E8DF] text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm"
              title="Unduh format data raw .json"
            >
              <FileCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Ekspor JSON</span>
            </button>

            <button
              type="button"
              onClick={handlePrintCertificate}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#3F2728] dark:hover:bg-[#57595B]/60 border border-slate-200 dark:border-slate-700 text-[#1E293B] dark:text-[#F3E8DF] text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm"
              title="Cetak kartu sertifikat / PDF rekap pendakian"
            >
              <Printer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Cetak Rekap / PDF</span>
            </button>
          </div>

          {/* Close Action */}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#2C6E49] text-white hover:bg-[#23583a] dark:bg-[#E8D1C5] dark:text-[#452829] font-bold text-xs cursor-pointer transition shadow-md active:scale-95"
          >
            {t('btn.close') || 'Tutup Modal'}
          </button>
        </div>

      </div>

      {/* Full Photo Zoom Lightbox Modal */}
      {selectedPhotoZoom && (
        <div
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoZoom(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedPhotoZoom}
              alt="Zoom Dokumentasi"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setSelectedPhotoZoom(null)}
              className="absolute -top-3 -right-3 p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-black transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
