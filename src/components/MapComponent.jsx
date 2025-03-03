import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

function MapComponent() {
  useEffect(() => {
    // Any side effects can go here
    return () => {
      // Cleanup if needed
    };
  }, []);

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
        <Marker position={VICTORIA_CENTER}>
          <Popup>
            Victoria, Australia
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapComponent;
