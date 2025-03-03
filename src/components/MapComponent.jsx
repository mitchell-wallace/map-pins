import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for the default marker icon issue in react-leaflet
// This is needed because the default icons are not properly loaded
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Victoria, Australia coordinates
const VICTORIA_CENTER = [-37.0201, 144.9646]; // Approximate center of Victoria
const DEFAULT_ZOOM = 7;

// Component to handle suburb geocoding and map updates
function SuburbMarker({ suburb, onGeocodeComplete }) {
  const map = useMap();
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const geocodeSuburb = async () => {
      try {
        // Using Nominatim for geocoding (OpenStreetMap's geocoding service)
        const query = encodeURIComponent(`${suburb}, Victoria, Australia`);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const newPosition = [parseFloat(lat), parseFloat(lon)];
          setPosition(newPosition);
          
          // Notify parent component about the geocoded position
          if (onGeocodeComplete) {
            onGeocodeComplete(suburb, newPosition);
          }
          
          // Center map on the new position
          map.flyTo(newPosition, 12);
        } else {
          setError(`Could not find location for "${suburb}"`);
        }
      } catch (err) {
        setError(`Error geocoding "${suburb}": ${err.message}`);
      }
    };

    if (suburb) {
      geocodeSuburb();
    }
  }, [suburb, map, onGeocodeComplete]);

  if (!position) return null;

  return (
    <Marker position={position}>
      <Popup>
        {suburb}
        {error && <div className="error">{error}</div>}
      </Popup>
    </Marker>
  );
}

function MapComponent({ pins = [], onPinGeocoded }) {
  return (
    <div className="map-container" style={{ height: '600px', width: '100%' }}>
      <MapContainer 
        center={VICTORIA_CENTER} 
        zoom={DEFAULT_ZOOM} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Render pins with coordinates */}
        {pins.filter(pin => pin.position).map((pin, index) => (
          <Marker key={`pin-${index}`} position={pin.position}>
            <Popup>
              {pin.name}
            </Popup>
          </Marker>
        ))}
        
        {/* Render suburb pins that need geocoding */}
        {pins.filter(pin => pin.type === 'suburb' && !pin.position).map((pin, index) => (
          <SuburbMarker 
            key={`suburb-${index}`} 
            suburb={pin.name} 
            onGeocodeComplete={(suburb, position) => onPinGeocoded(index, position)}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default MapComponent;
