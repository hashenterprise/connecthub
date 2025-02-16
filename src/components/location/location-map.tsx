import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useLocationStore } from '@/store/location-store';
import 'leaflet/dist/leaflet.css';

export function LocationMap() {
  const { currentLocation, nearbyPlaces } = useLocationStore();

  return (
    <MapContainer
      center={[currentLocation.lat, currentLocation.lng]}
      zoom={13}
      className="w-full h-[500px]"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Current location marker */}
      <Marker position={[currentLocation.lat, currentLocation.lng]}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Nearby places markers */}
      {nearbyPlaces.map((place) => (
        <Marker key={place.id} position={[place.lat, place.lng]}>
          <Popup>
            <div>
              <h3 className="font-bold">{place.name}</h3>
              <p>{place.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}