import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navigation } from 'lucide-react';
import { useTrail } from '../context/TrailContext';
import { useLanguage } from '../context/LanguageContext';
import LiveTracker from '../components/LiveTracker';

export default function TrackerPage() {
  const { trails } = useTrail();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  const initialTrailId = searchParams.get('trailId') || '';
  const [selectedTrailId, setSelectedTrailId] = useState(initialTrailId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 pb-12 text-[#2B3542] dark:text-[#FAF3F3]">
      
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E1E5EA] dark:border-[#2C3440] pb-6">
        <div>
          <h1 className="text-3xl font-black text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-3">
            <Navigation className="w-8 h-8 text-[#DA7F8F]" />
            <span>{t('tracker.title')}</span>
          </h1>
          <p className="text-sm text-[#6B7C8C] dark:text-[#A7BBC7] mt-1">
            {t('tracker.subtitle')}
          </p>
        </div>

        {/* Trail Selector Dropdown */}
        <div className="w-full md:w-72">
          <label className="block text-xs font-bold text-[#2B3542] dark:text-[#FAF3F3] mb-1">
            {t('tracker.selectTrail')}
          </label>
          <select
            value={selectedTrailId}
            onChange={(e) => setSelectedTrailId(e.target.value)}
            className="w-full px-3.5 py-2 rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] bg-white dark:bg-[#1C2129] text-xs font-semibold text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40 cursor-pointer shadow-sm"
          >
            <option value="">{t('tracker.noTrailSelected')}</option>
            {trails.map((tr) => (
              <option key={tr.id} value={tr.id}>
                {tr.name} ({tr.distance_km} km)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live GPS Tracker Component with Embedded Live Leaflet Map & Polyline */}
      <LiveTracker selectedTrailId={selectedTrailId} />

    </div>
  );
}
