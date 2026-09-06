import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Leaflet Markers using L.divIcon
const startIcon = L.divIcon({
  className: 'custom-leaflet-marker-start',
  html: `<div style="background-color: #10B981; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.4); font-weight: bold; font-size: 11px;">A</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const endIcon = L.divIcon({
  className: 'custom-leaflet-marker-end',
  html: `<div style="background-color: #DA7F8F; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.4); font-weight: bold; font-size: 11px;">B</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// Helper component to auto-recenter and fit map bounds to route coordinates
function ChangeView({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [bounds, map]);
  return null;
}

export default function MapViewer({ coordinates = [], trailName = 'Jalur Pendakian' }) {
  const defaultCoords = [
    [-6.74610, 106.99420],
    [-6.75320, 106.98980],
    [-6.75940, 106.98610],
    [-6.76610, 106.98230],
    [-6.77280, 106.98010],
    [-6.77940, 106.97850],
    [-6.78450, 106.97920],
    [-6.78910, 106.98140],
    [-6.79320, 106.98390],
    [-6.79780, 106.98520]
  ];

  const validCoords = Array.isArray(coordinates) && coordinates.length > 0 ? coordinates : defaultCoords;
  
  const startPoint = validCoords[0];
  const endPoint = validCoords[validCoords.length - 1];
  const centerPoint = validCoords[Math.floor(validCoords.length / 2)] || startPoint;

  return (
    <div className="relative w-full h-[350px] sm:h-[450px] rounded-2xl overflow-hidden shadow-inner border border-[#E1E5EA] dark:border-[#2C3440] z-0">
      <MapContainer
        center={centerPoint}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        {/* OpenTopoMap Green Topography TileLayer */}
        <TileLayer
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
        />

        <ChangeView bounds={validCoords} />

        {/* High-Contrast Rose Polyline Route */}
        <Polyline
          positions={validCoords}
          pathOptions={{
            color: '#DA7F8F',
            weight: 5,
            opacity: 0.9,
            dashArray: '6, 8',
          }}
        />

        {/* Start Point Marker (A) */}
        <Marker position={startPoint} icon={startIcon}>
          <Popup>
            <div className="text-xs font-sans">
              <strong className="text-emerald-700 block">Titik Awal (Basecamp A)</strong>
              <span>{trailName}</span>
            </div>
          </Popup>
        </Marker>

        {/* End Point Marker (B) */}
        <Marker position={endPoint} icon={endIcon}>
          <Popup>
            <div className="text-xs font-sans">
              <strong className="text-[#DA7F8F] block">Titik Akhir (Puncak B)</strong>
              <span>{trailName}</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
