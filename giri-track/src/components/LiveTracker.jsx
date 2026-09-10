import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { Play, Pause, Square, MapPin, Gauge, Clock, Navigation, CheckCircle2, AlertCircle, Map as MapIcon } from 'lucide-react';
import { useTrail } from '../context/TrailContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import SaveActivityModal from './SaveActivityModal';
import 'leaflet/dist/leaflet.css';

// Leaflet custom marker icons
const greenStartIcon = L.divIcon({
  className: 'custom-live-marker-start',
  html: `<div style="background-color: #10B981; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-weight: bold; font-size: 11px;">START</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

/**
 * Haversine formula calculation in kilometers
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Controller for camera auto-pan following live position
function LiveMapAutoPan({ currentPos, pathCoordinates }) {
  const map = useMap();

  useEffect(() => {
    if (currentPos) {
      map.panTo([currentPos.lat, currentPos.lng]);
    }
  }, [currentPos, map]);

  useEffect(() => {
    if (pathCoordinates && pathCoordinates.length > 1) {
      map.fitBounds(pathCoordinates, { padding: [30, 30] });
    }
  }, [pathCoordinates, map]);

  return null;
}

export default function LiveTracker({ selectedTrailId, onSessionComplete }) {
  const { trails, addHistoryRecord } = useTrail();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [trackingState, setTrackingState] = useState('idle'); // 'idle' | 'active' | 'paused'
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [currentPos, setCurrentPos] = useState(null);
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [gpsError, setGpsError] = useState(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const navigate = useNavigate();

  const watchIdRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const selectedTrail = trails.find((t) => String(t.id) === String(selectedTrailId)) || null;

  // Initial map center (Gunung Gede if no active position)
  const defaultCenter = selectedTrail?.coordinates?.[0] || [-6.7912, 106.9825];

  useEffect(() => {
    if (trackingState === 'active') {
      timerIntervalRef.current = setInterval(() => {
        setDurationSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [trackingState]);

  useEffect(() => {
    // Initial position fetch when opened
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPos({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.warn('Initial GPS fetch failed:', err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const handleStart = () => {
    if (!navigator.geolocation) {
      setGpsError(t('tracker.gpsNotSupported'));
      return;
    }

    setGpsError(null);
    setSaveSuccessMsg(false);
    setTrackingState('active');

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPoint = [latitude, longitude];

        setCurrentPos({ lat: latitude, lng: longitude });

        setPathCoordinates((prevCoords) => {
          if (prevCoords.length > 0) {
            const lastPoint = prevCoords[prevCoords.length - 1];
            const addedDist = calculateHaversineDistance(
              lastPoint[0],
              lastPoint[1],
              latitude,
              longitude
            );
            if (addedDist > 0.002) {
              setDistanceKm((prevDist) => Number((prevDist + addedDist).toFixed(3)));
              return [...prevCoords, newPoint];
            }
            return prevCoords;
          }
          return [newPoint];
        });
      },
      (err) => {
        console.error('GPS Watch Error:', err);
        setGpsError(`${t('tracker.gpsError')} (${err.message})`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
      }
    );
  };

  const handlePause = () => {
    setTrackingState('paused');
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const handleResume = () => {
    handleStart();
  };

  const handleStop = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setTrackingState('idle');

    if (durationSeconds > 0 || distanceKm > 0) {
      setIsModalOpen(true);
    }
  };

  const handleModalSave = (modalData) => {
    setIsModalOpen(false);
    
    const avgSpeed = durationSeconds > 0 ? Number(((distanceKm / (durationSeconds / 3600))).toFixed(2)) : 0;

    const record = {
      id: 'act_' + Date.now(),
      userEmail: user?.email || '',
      trail_id: selectedTrail ? selectedTrail.id : null,
      trail_name: modalData.title,
      duration_seconds: durationSeconds,
      distance_km: distanceKm,
      avg_speed_kmh: avgSpeed,
      coordinates: pathCoordinates.length > 0 ? pathCoordinates : selectedTrail?.coordinates || [],
      photos: modalData.photos,
      notes: modalData.notes,
      date: new Date().toISOString()
    };

    addHistoryRecord(record);
    setSaveSuccessMsg(true);
    showToast(`Aktivitas berhasil disimpan! 📍`, {
      type: 'success',
      title: 'Tersimpan',
    });

    if (onSessionComplete) {
      onSessionComplete(record);
    }

    if (!user?.isLoggedIn && !user?.email) {
      localStorage.setItem('giritrack_intended_path', '/history');
      showToast('Aktivitas dicatat! Silakan masuk agar riwayat tersimpan di akun pribadi Anda.', {
        type: 'info',
        title: 'Masuk Akun'
      });
      navigate('/login');
    } else {
      navigate('/history');
    }
  };

  const handleReset = () => {
    handleStop();
    setDurationSeconds(0);
    setDistanceKm(0);
    setCurrentPos(null);
    setPathCoordinates([]);
    setGpsError(null);
    setSaveSuccessMsg(false);
  };

  const avgSpeed = durationSeconds > 0 ? ((distanceKm / (durationSeconds / 3600))).toFixed(1) : '0.0';

  return (
    <div className="bg-white/90 dark:bg-[#1C2129] rounded-3xl p-6 shadow-sm border border-[#E1E5EA] dark:border-[#2C3440] space-y-6 text-[#2B3542] dark:text-[#FAF3F3] transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E1E5EA] dark:border-[#2C3440] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#DA7F8F]" />
            <span>{t('tracker.title')}</span>
          </h2>
          <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-1">
            {selectedTrail ? `Jalur Target: ${selectedTrail.name}` : t('tracker.subtitle')}
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 ${
              trackingState === 'active'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 animate-pulse'
                : trackingState === 'paused'
                ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                : 'bg-[#FAF3F3] text-[#6B7C8C] border border-[#E1E5EA] dark:bg-[#252C36] dark:text-[#A7BBC7] dark:border-[#2C3440]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                trackingState === 'active'
                  ? 'bg-emerald-500'
                  : trackingState === 'paused'
                  ? 'bg-amber-500'
                  : 'bg-stone-400'
              }`}
            />
            {trackingState === 'active'
              ? t('tracker.active')
              : trackingState === 'paused'
              ? t('tracker.paused')
              : t('tracker.inactive')}
          </span>
        </div>
      </div>

      {/* GPS Alerts */}
      {gpsError && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{gpsError}</span>
        </div>
      )}

      {saveSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 dark:bg-emerald-950/60 dark:border-emerald-900 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{t('tracker.sessionSaved')}</span>
        </div>
      )}

      {/* Real-time Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        
        {/* Hike Duration Box */}
        <div className="p-4 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] text-[#2B3542] dark:text-[#FAF3F3] border border-[#E1E5EA] dark:border-[#2C3440] flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1 text-xs font-semibold text-[#6B7C8C] dark:text-[#A7BBC7] mb-1">
            <Clock className="w-4 h-4 text-[#DA7F8F]" />
            <span>{t('tracker.duration')}</span>
          </div>
          <span className="text-2xl font-black tracking-tight text-[#2B3542] dark:text-[#FAF3F3] font-mono">
            {formatTime(durationSeconds)}
          </span>
        </div>

        {/* Distance Box */}
        <div className="p-4 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] text-[#2B3542] dark:text-[#FAF3F3] border border-[#E1E5EA] dark:border-[#2C3440] flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1 text-xs font-semibold text-[#6B7C8C] dark:text-[#A7BBC7] mb-1">
            <Navigation className="w-4 h-4 text-[#DA7F8F]" />
            <span>{t('tracker.distance')}</span>
          </div>
          <span className="text-2xl font-black tracking-tight text-[#2B3542] dark:text-[#FAF3F3]">
            {distanceKm} <span className="text-xs font-normal">{t('common.km')}</span>
          </span>
        </div>

        {/* Speed Box */}
        <div className="p-4 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] text-[#2B3542] dark:text-[#FAF3F3] border border-[#E1E5EA] dark:border-[#2C3440] flex flex-col items-center justify-center text-center col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1 text-xs font-semibold text-[#6B7C8C] dark:text-[#A7BBC7] mb-1">
            <Gauge className="w-4 h-4 text-[#DA7F8F]" />
            <span>{t('tracker.speed')}</span>
          </div>
          <span className="text-2xl font-black tracking-tight text-[#2B3542] dark:text-[#FAF3F3]">
            {avgSpeed} <span className="text-xs font-normal">{t('common.kmh')}</span>
          </span>
        </div>
      </div>

      {/* Embedded Live Leaflet Map Container */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#2B3542] dark:text-[#FAF3F3]">
          <span className="flex items-center gap-1.5">
            <MapIcon className="w-4 h-4 text-[#DA7F8F]" />
            <span>{t('tracker.liveMapTitle')}</span>
          </span>
          <span className="font-mono text-[11px] text-[#6B7C8C] dark:text-[#A7BBC7]">
            {pathCoordinates.length} Titik GPS Terekam
          </span>
        </div>

        <div className="relative w-full h-[350px] sm:h-[400px] rounded-2xl overflow-hidden shadow-inner border border-[#E1E5EA] dark:border-[#2C3440] z-0">
          <MapContainer
            center={currentPos ? [currentPos.lat, currentPos.lng] : defaultCenter}
            zoom={14}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LiveMapAutoPan currentPos={currentPos} pathCoordinates={pathCoordinates} />

            {/* Recorded Path Polyline */}
            {pathCoordinates.length > 0 && (
              <Polyline
                positions={pathCoordinates}
                pathOptions={{
                  color: '#DA7F8F', // Accent color
                  weight: 5,
                  opacity: 0.9,
                }}
              />
            )}

            {/* Start Point Marker */}
            {pathCoordinates.length > 0 && (
              <Marker position={pathCoordinates[0]} icon={greenStartIcon}>
                <Popup>
                  <div className="text-xs font-sans">
                    <strong className="text-emerald-700 block">Titik Awal Pelacakan (Start)</strong>
                    <span>{selectedTrail ? selectedTrail.name : 'Awal Sesi'}</span>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Current Live Location Pulse Circle Marker */}
            {currentPos && (
              <CircleMarker
                center={[currentPos.lat, currentPos.lng]}
                radius={9}
                pathOptions={{
                  color: '#ffffff',
                  fillColor: '#DA7F8F',
                  fillOpacity: 1,
                  weight: 3,
                }}
              >
                <Popup>
                  <div className="text-xs font-sans">
                    <strong className="text-[#DA7F8F] block">Posisi Anda Saat Ini (Live)</strong>
                    <span>{currentPos.lat.toFixed(5)}, {currentPos.lng.toFixed(5)}</span>
                  </div>
                </Popup>
              </CircleMarker>
            )}
          </MapContainer>
        </div>
      </div>

      {/* Current Position Display */}
      {currentPos && (
        <div className="p-3 rounded-xl bg-[#FAF3F3] dark:bg-[#252C36] text-xs flex items-center justify-between text-[#6B7C8C] dark:text-[#A7BBC7] font-mono border border-[#E1E5EA] dark:border-[#2C3440]">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#DA7F8F]" />
            <span>{t('tracker.currentPos')}:</span>
          </span>
          <span>
            {currentPos.lat.toFixed(5)}, {currentPos.lng.toFixed(5)}
          </span>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center gap-3 pt-2">
        {trackingState === 'idle' ? (
          <button
            onClick={handleStart}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#DA7F8F] text-white hover:bg-[#c96c7d] font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{t('btn.startTracking')}</span>
          </button>
        ) : (
          <>
            {trackingState === 'active' ? (
              <button
                onClick={handlePause}
                className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Pause className="w-5 h-5 fill-current" />
                <span>{t('btn.pauseTracking')}</span>
              </button>
            ) : (
              <button
                onClick={handleResume}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{t('btn.resumeTracking')}</span>
              </button>
            )}

            <button
              onClick={handleStop}
              className="py-3 px-4 rounded-2xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Square className="w-5 h-5 fill-current" />
              <span>{t('btn.stopTracking')}</span>
            </button>
          </>
        )}

        {(durationSeconds > 0 || distanceKm > 0) && trackingState === 'idle' && (
          <button
            onClick={handleReset}
            className="py-3 px-4 rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36] transition text-xs font-semibold cursor-pointer"
          >
            {t('btn.reset')}
          </button>
        )}
      </div>

      <SaveActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        durationSeconds={durationSeconds}
        distanceKm={distanceKm}
        avgSpeed={avgSpeed}
        defaultTitle={selectedTrail ? selectedTrail.name : 'Jelajah Bebas GPS'}
      />
    </div>
  );
}
