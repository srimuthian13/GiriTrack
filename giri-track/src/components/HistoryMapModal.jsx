import { useState, useEffect, useRef, useMemo } from 'react';
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
  Camera,
  Upload,
  Trash2,
  CheckCircle,
  Maximize2,
  Image as ImageIcon,
  Map as MapPinIcon,
  Compass,
  LocateFixed,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTrail } from '../context/TrailContext';
import CameraCaptureModal from './CameraCaptureModal';
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
  html: `<div style="background-color: #DA7F8F; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-weight: 800; font-size: 11px;">B</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const hikerReplayIcon = L.divIcon({
  className: 'custom-history-marker-hiker',
  html: `
    <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; inset: 0; background-color: #DA7F8F; border-radius: 50%; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: relative; background-color: #DA7F8F; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #FAF3F3; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); font-size: 13px;">
        🚶
      </div>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

function MapFitBounds({ bounds, triggerRecenter }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      setTimeout(() => {
        map.invalidateSize();
        map.fitBounds(bounds, { padding: [35, 35] });
      }, 100);
    }
  }, [bounds, map, triggerRecenter]);
  return null;
}

/**
 * Foto Rute SVG Component
 * Generates a stable, crisp vector-based snapshot of the route that never shifts, drifts, or gets displaced
 */
function StaticRoutePhoto({ coordinates, replayIndex, trailName, distanceKm }) {
  // Normalize GPS coordinates to SVG viewBox coordinates [500 x 340]
  const svgData = useMemo(() => {
    if (!coordinates || coordinates.length === 0) {
      return { pathD: '', activePathD: '', startSvg: { x: 50, y: 170 }, endSvg: { x: 450, y: 170 }, currentSvg: { x: 50, y: 170 }, points: [] };
    }

    const lats = coordinates.map((c) => c[0]);
    const lons = coordinates.map((c) => c[1]);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);

    const latSpan = maxLat - minLat || 0.001;
    const lonSpan = maxLon - minLon || 0.001;

    const width = 560;
    const height = 340;
    const padding = 50;

    const toSvgCoord = ([lat, lon]) => {
      const x = padding + ((lon - minLon) / lonSpan) * (width - padding * 2);
      const y = height - padding - ((lat - minLat) / latSpan) * (height - padding * 2);
      return { x, y };
    };

    const points = coordinates.map(toSvgCoord);

    const buildPath = (pts) => {
      if (pts.length === 0) return '';
      return pts.reduce((acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`, '');
    };

    const pathD = buildPath(points);
    const activePoints = points.slice(0, replayIndex + 1);
    const activePathD = buildPath(activePoints);

    const startSvg = points[0] || { x: padding, y: height / 2 };
    const endSvg = points[points.length - 1] || { x: width - padding, y: height / 2 };
    const currentSvg = points[replayIndex] || startSvg;

    return { pathD, activePathD, startSvg, endSvg, currentSvg, points, width, height };
  }, [coordinates, replayIndex]);

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#1C2129] via-[#252C36] to-[#14171C] border border-[#2C3440] shadow-inner flex items-center justify-center select-none">
      
      {/* Background Topo & Contour Aesthetic Lines */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#DA7F8F_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,#DA7F8F_0,transparent_60%)]"></div>

      {/* Top Badge Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#DA7F8F]" />
          <span>Foto Rute Resmi • Terkalibrasi GPS</span>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-[#1C2129]/80 backdrop-blur-md border border-[#DA7F8F]/40 text-[#DA7F8F] text-[11px] font-mono font-bold">
          {distanceKm} km
        </div>
      </div>

      {/* SVG Canvas Route Graphic */}
      <svg
        viewBox={`0 0 ${svgData.width} ${svgData.height}`}
        className="w-full h-full p-2"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A7BBC7" />
            <stop offset="50%" stopColor="#DA7F8F" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Decorative Grid Lines */}
        <line x1="40" y1="90" x2="520" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
        <line x1="40" y1="170" x2="520" y2="170" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
        <line x1="40" y1="250" x2="520" y2="250" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />

        {/* Outer Shadow Path */}
        <path
          d={svgData.pathD}
          fill="none"
          stroke="#14171C"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />

        {/* Full Track Base Path */}
        <path
          d={svgData.pathD}
          fill="none"
          stroke="#475569"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4, 5"
          opacity="0.7"
        />

        {/* Active Replay / Progress Path */}
        {svgData.activePathD && (
          <path
            d={svgData.activePathD}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#routeGlow)"
          />
        )}

        {/* Intermediate waypoint dots */}
        {svgData.points.filter((_, i) => i % 6 === 0 && i !== 0 && i !== svgData.points.length - 1).map((pt, idx) => (
          <circle key={idx} cx={pt.x} cy={pt.y} r="2.5" fill="#A7BBC7" opacity="0.6" />
        ))}

        {/* Start Point A */}
        <g transform={`translate(${svgData.startSvg.x}, ${svgData.startSvg.y})`}>
          <circle r="14" fill="#10B981" stroke="#ffffff" strokeWidth="2.5" className="drop-shadow-md" />
          <text textAnchor="middle" dy="4" fill="#ffffff" fontSize="10" fontWeight="900" fontFamily="sans-serif">
            A
          </text>
          <rect x="-24" y="-30" width="48" height="15" rx="7.5" fill="#064E3B" opacity="0.9" />
          <text textAnchor="middle" y="-20" fill="#A7F3D0" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
            START
          </text>
        </g>

        {/* End Point B */}
        <g transform={`translate(${svgData.endSvg.x}, ${svgData.endSvg.y})`}>
          <circle r="14" fill="#DA7F8F" stroke="#ffffff" strokeWidth="2.5" className="drop-shadow-md" />
          <text textAnchor="middle" dy="4" fill="#ffffff" fontSize="10" fontWeight="900" fontFamily="sans-serif">
            B
          </text>
          <rect x="-26" y="16" width="52" height="15" rx="7.5" fill="#881337" opacity="0.9" />
          <text textAnchor="middle" y="26.5" fill="#FECDD3" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
            FINISH
          </text>
        </g>

        {/* Animated Replay Hiker Position */}
        <g transform={`translate(${svgData.currentSvg.x}, ${svgData.currentSvg.y})`}>
          <circle r="16" fill="#DA7F8F" opacity="0.3" className="animate-ping" />
          <circle r="12" fill="#DA7F8F" stroke="#ffffff" strokeWidth="2" className="drop-shadow-lg" />
          <text textAnchor="middle" dy="4" fontSize="11">
            🚶
          </text>
        </g>
      </svg>

      {/* Bottom Information Footer on Photo */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] text-[#A7BBC7] z-10 pointer-events-none">
        <span className="flex items-center gap-1">
          <Compass className="w-3 h-3 text-[#DA7F8F]" />
          {trailName}
        </span>
        <span className="font-mono">{coordinates.length} Titik GPS Tersimpan</span>
      </div>
    </div>
  );
}

export default function HistoryMapModal({ isOpen, onClose, record }) {
  const { t } = useLanguage();
  const { addHistoryPhoto, deleteHistoryPhoto } = useTrail();

  // Mode View: 'photo' (Foto Rute - Default) | 'map' (Peta Interaktif)
  const [viewMode, setViewMode] = useState('photo');
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  // Replay State
  const [isPlaying, setIsPlaying] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);
  const [replaySpeed, setReplaySpeed] = useState(1); // 1x, 2x, 4x
  const replayIntervalRef = useRef(null);

  // Photo & Lightbox State
  const [selectedPhotoZoom, setSelectedPhotoZoom] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef(null);

  const coordinates = Array.isArray(record?.coordinates) && record.coordinates.length > 0
    ? record.coordinates
    : [[-6.7912, 106.9825], [-6.7850, 106.9870], [-6.7790, 106.9910]];

  const totalPoints = coordinates.length;
  const startPoint = coordinates[0];
  const endPoint = coordinates[coordinates.length - 1];
  const centerPoint = coordinates[Math.floor(coordinates.length / 2)] || startPoint;

  const activeReplayCoordinates = coordinates.slice(0, replayIndex + 1);
  const currentReplayPoint = coordinates[replayIndex] || startPoint;

  const [prevRecordId, setPrevRecordId] = useState(record?.id);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (record?.id !== prevRecordId || isOpen !== prevIsOpen) {
    setPrevRecordId(record?.id);
    setPrevIsOpen(isOpen);
    setIsPlaying(false);
    setReplayIndex(0);
    setViewMode('photo');
    if (replayIntervalRef.current) {
      clearInterval(replayIntervalRef.current);
    }
  }

  useEffect(() => {
    if (isPlaying) {
      const baseDelay = 350;
      const delay = Math.max(70, baseDelay / replaySpeed);

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

  const compressAndSavePhoto = (base64OrBlob) => {
    const img = new Image();
    img.onload = () => {
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
    img.src = base64OrBlob;
  };

  const handleCameraCapture = (capturedBase64) => {
    compressAndSavePhoto(capturedBase64);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        compressAndSavePhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const progressPercent = Math.round(((replayIndex + 1) / totalPoints) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto print:bg-white print:p-0 print:static">
      
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
        className="bg-white dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] rounded-3xl max-w-5xl w-full p-5 sm:p-7 shadow-2xl space-y-5 relative text-[#2B3542] dark:text-[#FAF3F3] my-auto max-h-[92vh] flex flex-col"
      >
        
        {/* Header Modal */}
        <div className="flex items-start sm:items-center justify-between border-b border-[#E1E5EA] dark:border-[#2C3440] pb-4 gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#DA7F8F]/15 text-[#DA7F8F] shrink-0">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-[#2B3542] dark:text-[#FAF3F3] tracking-tight">
                  {record.trail_name || 'Jalur Pendakian'}
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle className="w-3 h-3" />
                  <span>Sesi Selesai</span>
                </span>
              </div>
              <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] flex items-center gap-1.5 mt-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#DA7F8F]" />
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
            className="no-print p-2 rounded-full text-[#A7BBC7] hover:text-[#2B3542] dark:hover:text-white hover:bg-[#FAF3F3] dark:hover:bg-[#252C36] transition cursor-pointer shrink-0"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Side-by-Side 2-Column Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 overflow-y-auto pr-1">
          
          {/* KOLOM KIRI (PINGGIR 1): Foto Rute / Peta Visualizer + Replay Controls */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col space-y-3">
            
            {/* View Mode Switcher Tab */}
            <div className="flex items-center justify-between no-print">
              <div className="flex items-center bg-[#FAF3F3] dark:bg-[#252C36] p-1 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440]">
                <button
                  type="button"
                  onClick={() => setViewMode('photo')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    viewMode === 'photo'
                      ? 'bg-[#DA7F8F] text-white shadow-sm'
                      : 'text-[#6B7C8C] dark:text-[#A7BBC7] hover:text-[#2B3542]'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Foto Rute</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setViewMode('map');
                    setRecenterTrigger((prev) => prev + 1);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    viewMode === 'map'
                      ? 'bg-[#DA7F8F] text-white shadow-sm'
                      : 'text-[#6B7C8C] dark:text-[#A7BBC7] hover:text-[#2B3542]'
                  }`}
                >
                  <MapPinIcon className="w-3.5 h-3.5" />
                  <span>Peta Interaktif</span>
                </button>
              </div>

              {viewMode === 'map' && (
                <button
                  type="button"
                  onClick={() => setRecenterTrigger((prev) => prev + 1)}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF3F3] dark:bg-[#252C36] hover:bg-[#E1E5EA] text-[#2B3542] dark:text-[#FAF3F3] text-[11px] font-bold flex items-center gap-1 border border-[#E1E5EA] dark:border-[#2C3440] cursor-pointer transition"
                  title="Pusatkan kembali tampilan peta ke rute"
                >
                  <LocateFixed className="w-3 h-3 text-[#DA7F8F]" />
                  <span>Pusatkan</span>
                </button>
              )}
            </div>

            {/* Visualizer Display */}
            <div className="w-full">
              {viewMode === 'photo' ? (
                <StaticRoutePhoto
                  coordinates={coordinates}
                  replayIndex={replayIndex}
                  trailName={record.trail_name || 'Jalur Pendakian'}
                  distanceKm={record.distance_km}
                />
              ) : (
                <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden shadow-inner border border-[#E1E5EA] dark:border-[#2C3440] z-0">
                  <MapContainer
                    center={centerPoint}
                    zoom={13}
                    scrollWheelZoom={false}
                    className="w-full h-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapFitBounds bounds={coordinates} triggerRecenter={recenterTrigger} />

                    {/* Full Background Path */}
                    <Polyline
                      positions={coordinates}
                      pathOptions={{
                        color: '#A7BBC7',
                        weight: 4,
                        opacity: 0.6,
                        dashArray: '4, 6',
                      }}
                    />

                    {/* Active Replay Path */}
                    <Polyline
                      positions={activeReplayCoordinates}
                      pathOptions={{
                        color: '#DA7F8F',
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
                          <strong className="text-[#DA7F8F] block">Titik Akhir (Finish B)</strong>
                          <span>{record.trail_name}</span>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Animated Replaying Hiker Marker */}
                    <Marker position={currentReplayPoint} icon={hikerReplayIcon}>
                      <Popup>
                        <div className="text-xs font-sans">
                          <strong>Posisi Tracker Saat Ini</strong>
                          <p className="text-[11px] text-[#6B7C8C] dark:text-[#A7BBC7]">
                            Titik ke-{replayIndex + 1} ({progressPercent}%)
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </div>

            {/* Replay Player Controls Bar */}
            <div className="no-print p-3 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] flex flex-wrap items-center justify-between gap-2.5 text-xs">
              
              {/* Play/Pause & Reset & Speed */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="px-3 py-1.5 rounded-full bg-[#DA7F8F] text-white hover:bg-[#c96c7d] font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm text-xs"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Jeda</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Replay</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResetReplay}
                  className="p-1.5 rounded-full bg-white dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#FAF3F3] transition cursor-pointer"
                  title="Reset Replay"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Speed Buttons */}
                <div className="flex items-center rounded-full bg-white dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] p-0.5">
                  {[1, 2, 4].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => setReplaySpeed(spd)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                        replaySpeed === spd
                          ? 'bg-[#DA7F8F] text-white'
                          : 'text-[#6B7C8C] hover:text-[#2B3542] dark:text-[#A7BBC7]'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider Progress and Point Counter */}
              <div className="flex-1 min-w-[140px] flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max={totalPoints - 1}
                  value={replayIndex}
                  onChange={handleSliderChange}
                  className="w-full h-1.5 bg-[#E1E5EA] dark:bg-[#2C3440] rounded-lg appearance-none cursor-pointer accent-[#DA7F8F]"
                />
                <span className="text-[10px] font-mono text-[#6B7C8C] dark:text-[#A7BBC7] shrink-0 font-bold">
                  {progressPercent}%
                </span>
              </div>

            </div>

          </div>

          {/* KOLOM KANAN (PINGGIR 2): Keterangan Statistik, Galeri Dokumentasi & Ekspor */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col space-y-4">
            
            {/* 4 Kotak Statistik Metrik (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              
              <div className="p-3 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#A7BBC7]/20 text-[#2B3542] dark:text-[#FAF3F3] shrink-0">
                  <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-[#DA7F8F]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#6B7C8C] dark:text-[#A7BBC7]">Jarak Tempuh</p>
                  <p className="text-base sm:text-lg font-black text-[#2B3542] dark:text-[#FAF3F3] leading-tight">
                    {record.distance_km} <span className="text-xs font-semibold">km</span>
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 shrink-0">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#6B7C8C] dark:text-[#A7BBC7]">Durasi Sesi</p>
                  <p className="text-xs sm:text-sm font-black text-[#2B3542] dark:text-[#FAF3F3] leading-tight truncate">
                    {formatSecondsToDuration(record.duration_seconds)}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 shrink-0">
                  <Gauge className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#6B7C8C] dark:text-[#A7BBC7]">Kecepatan Rerata</p>
                  <p className="text-base sm:text-lg font-black text-[#2B3542] dark:text-[#FAF3F3] leading-tight">
                    {record.avg_speed_kmh} <span className="text-xs font-semibold">km/j</span>
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#DA7F8F]/20 text-[#DA7F8F] shrink-0">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#6B7C8C] dark:text-[#A7BBC7]">Est. Kalori</p>
                  <p className="text-base sm:text-lg font-black text-[#2B3542] dark:text-[#FAF3F3] leading-tight">
                    ~{estimatedCalories} <span className="text-xs font-semibold">kcal</span>
                  </p>
                </div>
              </div>

            </div>

            {/* Dokumentasi Foto Pendakian */}
            <div className="space-y-2.5 pt-1 border-t border-[#E1E5EA] dark:border-[#2C3440] flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#DA7F8F]" />
                  <h4 className="text-xs sm:text-sm font-bold text-[#2B3542] dark:text-[#FAF3F3]">
                    Dokumentasi Foto ({record.photos?.length || 0})
                  </h4>
                </div>

                <div className="flex items-center gap-2 no-print">
                  {/* Camera Live Modal Button */}
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="px-2.5 py-1.5 rounded-full bg-[#FAF3F3] dark:bg-[#252C36] hover:bg-[#E1E5EA] text-[#2B3542] dark:text-[#FAF3F3] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition active:scale-95 border border-[#E1E5EA] dark:border-[#2C3440]"
                    title="Buka Kamera untuk Mengambil Foto Langsung"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#DA7F8F]" />
                    <span>Kamera</span>
                  </button>

                  {/* Upload Gallery Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 rounded-full bg-[#FAF3F3] dark:bg-[#252C36] hover:bg-[#E1E5EA] text-[#2B3542] dark:text-[#FAF3F3] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition active:scale-95 border border-[#E1E5EA] dark:border-[#2C3440]"
                    title="Upload Foto dari Galeri / File"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#DA7F8F]" />
                    <span>{isUploading ? 'Memproses...' : 'Upload Foto'}</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </div>
              </div>

              {/* Photo Gallery Grid */}
              {Array.isArray(record.photos) && record.photos.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 max-h-[140px] overflow-y-auto pr-1">
                  {record.photos.map((photoSrc, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-xl overflow-hidden aspect-square border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3] dark:bg-[#252C36] shadow-sm"
                    >
                      <img
                        src={photoSrc}
                        alt={`Dokumentasi ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300 cursor-pointer"
                        onClick={() => setSelectedPhotoZoom(photoSrc)}
                      />
                      
                      {/* Photo Actions Overlay */}
                      <div className="no-print absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1 p-1">
                        <button
                          type="button"
                          onClick={() => setSelectedPhotoZoom(photoSrc)}
                          className="p-1 rounded-full bg-white/80 hover:bg-white text-slate-900 cursor-pointer transition"
                          title="Lihat Penuh"
                        >
                          <Maximize2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteHistoryPhoto(record.id, idx)}
                          className="p-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white cursor-pointer transition"
                          title="Hapus Foto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl border border-dashed border-[#E1E5EA] dark:border-[#2C3440] text-center text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">
                  Belum ada foto dokumentasi untuk sesi ini.
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="no-print pt-3 border-t border-[#E1E5EA] dark:border-[#2C3440] flex items-center justify-end mt-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-[#DA7F8F] text-white hover:bg-[#c96c7d] font-bold text-xs cursor-pointer transition shadow-md active:scale-95"
              >
                {t('btn.close') || 'Tutup'}
              </button>
            </div>

          </div>

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

      {/* Live In-App Camera Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

    </div>
  );
}
