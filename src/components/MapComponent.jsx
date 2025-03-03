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

// Component to handle suburb geocoding
function GeocodingHandler({ pins, onPinGeocoded }) {
  const map = useMap();
  
  useEffect(() => {
    // Find any pins that need geocoding
    const pinsNeedingGeocoding = pins.filter(pin => pin.type === 'suburb' && !pin.position);
    
    // Process each pin that needs geocoding
    pinsNeedingGeocoding.forEach(async (pin, arrayIndex) => {
      try {
        // Find the index in the original pins array
        const pinIndex = pins.findIndex(p => p === pin);
        if (pinIndex === -1) return;
        
        const suburb = pin.name;
        // Using Nominatim for geocoding (OpenStreetMap's geocoding service)
        const query = encodeURIComponent(`${suburb}, Victoria, Australia`);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const newPosition = [parseFloat(lat), parseFloat(lon)];
          
          // Notify parent component about the geocoded position
          if (onPinGeocoded) {
            onPinGeocoded(pinIndex, newPosition);
          }
        } else {
          console.error(`Could not find location for "${suburb}"`);
        }
      } catch (err) {
        console.error(`Error geocoding pin:`, err);
      }
    });
  }, [pins, onPinGeocoded, map]);
  
  return null;
}

function MapComponent({ pins = [], onPinGeocoded }) {
  // Debug log to check pins being received
  console.log("MapComponent received pins:", pins);
  
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
        
        {/* Handler for geocoding suburb pins */}
        <GeocodingHandler pins={pins} onPinGeocoded={onPinGeocoded} />
        
        {/* Render all pins with positions */}
        {pins.filter(pin => pin.position).map((pin, index) => (
          <Marker 
            key={`marker-${index}-${pin.name}`} 
            position={pin.position}
          >
            <Popup>
              {pin.name}
              {pin.position && (
                <div className="coordinates">
                  [{pin.position[0].toFixed(4)}, {pin.position[1].toFixed(4)}]
                </div>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapComponent;
