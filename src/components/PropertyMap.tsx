'use client';

import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
  address: string;
}

export default function PropertyMap({ latitude, longitude }: PropertyMapProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: '400px', width: '100%', borderRadius: '0.75rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Circle
        center={[latitude, longitude]}
        radius={200}
        pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.15 }}
      />
    </MapContainer>
  );
}
