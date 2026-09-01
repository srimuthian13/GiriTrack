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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 pb-12 text-[#452829] dark:text-[#F3E8DF]">
      
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DBC4B6] dark:border-[#57595B]/40 pb-6">
        <div>
          <h1 className="text-3xl font-black text-[#452829] dark:text-[#F3E8DF] flex items-center gap-3">
            <Navigation className="w-8 h-8 text-[#452829] dark:text-[#E8D1C5]" />
            <span>{t('tracker.title')}</span>
          </h1>
          <p className="text-sm text-[#57595B] dark:text-[#E8D1C5] mt-1">
            {t('tracker.subtitle')}
          </p>
        </div>

        {/* Trail Selector Dropdown */}
        <div className="w-full md:w-72">
          <label className="block text-xs font-bold text-[#452829] dark:text-[#F3E8DF] mb-1">
            {t('tracker.selectTrail')}
          </label>
          <select
            value={selectedTrailId}
            onChange={(e) => setSelectedTrailId(e.target.value)}
            className="w-full px-3.5 py-2 rounded-2xl border border-[#DBC4B6] dark:border-[#57595B]/40 bg-white dark:bg-[#2D1C1D] text-xs font-semibold text-[#452829] dark:text-[#F3E8DF] focus:outline-none focus:ring-2 focus:ring-[#452829] cursor-pointer shadow-sm"
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
