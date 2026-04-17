import React from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Activity, MapPin, Trash2, Loader2 } from 'lucide-react';

// Fix for default marker icon in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icon factory based on source type
const getCustomIcon = (type) => {
  let color = '#3b82f6'; // default blue
  if (type === 'HUMINT') color = '#eab308'; // yellow
  if (type === 'IMINT') color = '#22c55e'; // green
  if (type === 'OSINT') color = '#ec4899'; // pink
  
  const svgIcon = `
    <div class="hover:-translate-y-1 hover:scale-110 transition-all duration-200 drop-shadow-[0_0_8px_${color}]">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="white"/>
      </svg>
    </div>`;
    
  return L.divIcon({
    className: 'custom-leaflet-icon bg-transparent border-0',
    html: svgIcon,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -32]
  });
};


const DashboardMap = ({ data, onDelete, isLoading }) => {
  // Center roughly on global view if no data, else center on first point
  const center = data.length > 0 && data[0].location.lat ? [data[0].location.lat, data[0].location.lng] : [20, 0];

  return (
    <div className="w-full h-full relative z-0">
      <LeafletMap center={center} zoom={3} style={{ height: '100%', width: '100%' }}>
        {/* CartoDB Dark Matter Theme */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {data.map((point) => (
          point.location && point.location.lat && point.location.lng && (
            <Marker 
              key={point._id} 
              position={[point.location.lat, point.location.lng]}
              icon={getCustomIcon(point.sourceType)}
            >
              <Popup className="glass-popup">
                <div className="p-2 min-w-[200px]">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col gap-1 pr-2 w-full">
                      <div className="flex justify-between w-full">
                        <h3 className="font-bold text-[15px] text-gray-800 m-0 leading-tight">{point.title}</h3>
                        <button 
                          onClick={() => onDelete(point._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 -mt-1 -mr-1"
                          title="Delete Pin"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center w-full mt-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full w-max">
                          {point.sourceType}
                        </span>
                        <span className="text-[9px] text-gray-400 font-medium">
                          {point.createdAt ? new Date(point.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' }) : 'Just now'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {point.imageUrl && (
                    <img src={`https://intelfusion-backend.onrender.com${point.imageUrl}`} alt="Intelligence" className="w-full h-24 object-cover rounded mb-2 border border-gray-200" />
                  )}
                  <p className="text-sm text-gray-600 mb-2 max-h-24 overflow-y-auto">{point.description}</p>
                  
                  {/* AI Metadata Section */}
                  <div className="bg-white/50 p-2.5 rounded-md border border-gray-100 shadow-sm mt-3">
                    <div className="flex items-center gap-1.5 mb-2 border-b border-gray-100 pb-1.5">
                      <Activity size={14} className="text-indigo-600"/>
                      <span className="text-xs font-bold text-gray-800 tracking-wide uppercase">AI Analysis</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-gray-600 font-medium tracking-wide">Sentiment:</span>
                      <span className={`font-bold tracking-wide ${point.sentimentScore > 0 ? 'text-green-600' : point.sentimentScore < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        {point.sentimentScore > 0 ? 'Positive' : point.sentimentScore < 0 ? 'Negative' : 'Neutral'} 
                        <span className="opacity-80 ml-1">({point.sentimentScore > 0 ? '+' : ''}{point.sentimentScore})</span>
                      </span>
                    </div>
                    {point.keywords && point.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 border-t border-gray-100 pt-2">
                        {point.keywords.map(kw => (
                          <span key={kw} className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-semibold tracking-wide shadow-sm">
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </LeafletMap>
      
      {/* Legend Overlay */}
      <div className="absolute bottom-6 right-6 glass p-4 z-[400] rounded-lg">
        <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wide">Legend</h4>
        <div className="flex flex-col gap-2 text-xs font-medium text-gray-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ec4899] shadow-[0_0_8px_#ec4899]"></span> OSINT
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#eab308] shadow-[0_0_8px_#eab308]"></span> HUMINT
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]"></span> IMINT
          </div>
        </div>
      </div>

      {/* Loading & Empty States Overlay */}
      {isLoading ? (
        <div className="absolute inset-0 z-[500] bg-dark/60 backdrop-blur-sm flex items-center justify-center flex-col gap-3">
          <Loader2 className="animate-spin text-neon" size={40} />
          <p className="text-neon font-bold tracking-widest text-sm animate-pulse">SYNCING INTEL...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="absolute inset-0 z-[500] bg-dark/60 backdrop-blur-sm flex items-center justify-center">
          <div className="glass px-8 py-6 rounded-xl border border-white/10 text-center flex flex-col items-center gap-3">
            <Activity className="text-gray-500" size={32} />
            <p className="text-gray-300 font-semibold tracking-wide">No intelligence data available.</p>
            <p className="text-xs text-gray-500">Upload reports via the sidebar or adjust filters.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DashboardMap;
