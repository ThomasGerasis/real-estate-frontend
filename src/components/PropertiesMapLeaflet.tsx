'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '@/lib/api';

interface PropertiesMapLeafletProps {
  properties: Property[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onMoveEnd?: (bounds: L.LatLngBounds) => void;
}

function formatMarkerPrice(property: Property): string {
  const raw = typeof property.price === 'string' ? parseFloat(property.price) : property.price;
  if (!raw || isNaN(raw)) return '—';
  if (property.listing_type === 'rent') return `${Math.round(raw)}€/μ`;
  if (raw >= 1_000_000) return `${(raw / 1_000_000).toFixed(1)}M€`;
  if (raw >= 1_000) return `${Math.round(raw / 1_000)}K€`;
  return `${raw}€`;
}

function createPriceIcon(label: string, selected: boolean) {
  return L.divIcon({
    html: `<div class="price-marker${selected ? ' selected' : ''}">${label}</div>`,
    className: '',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function MapMoveHandler({ onMoveEnd }: { onMoveEnd?: (bounds: L.LatLngBounds) => void }) {
  useMapEvents({
    moveend: (e) => {
      if (onMoveEnd) onMoveEnd(e.target.getBounds());
    },
  });
  return null;
}

function FlyToSelected({ properties, selectedId }: { properties: Property[]; selectedId: number | null }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const prop = properties.find((p) => p.id === selectedId);
    if (prop?.latitude && prop?.longitude) {
      map.flyTo([prop.latitude, prop.longitude], map.getZoom(), { duration: 0.5 });
    }
  }, [selectedId, properties, map]);
  return null;
}

export default function PropertiesMapLeaflet({
  properties,
  selectedId,
  onSelect,
  onMoveEnd,
}: PropertiesMapLeafletProps) {
  const markersRef = useRef<Map<number, L.Marker>>(new Map());

  // Athens default center
  const center: [number, number] = [37.9838, 23.7275];

  const withCoords = properties.filter((p) => p.latitude && p.longitude);

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapMoveHandler onMoveEnd={onMoveEnd} />
      <FlyToSelected properties={properties} selectedId={selectedId} />

      {withCoords.map((property) => {
        const label = formatMarkerPrice(property);
        const isSelected = property.id === selectedId;
        const icon = createPriceIcon(label, isSelected);

        return (
          <Marker
            key={`${property.id}-${isSelected}`}
            position={[property.latitude!, property.longitude!]}
            icon={icon}
            ref={(marker) => {
              if (marker) markersRef.current.set(property.id, marker);
            }}
            eventHandlers={{
              click: () => onSelect(property.id),
            }}
          />
        );
      })}
    </MapContainer>
  );
}
