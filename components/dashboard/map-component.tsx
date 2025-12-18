'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression, divIcon } from 'leaflet';
import type { Store } from '@/types';

interface MapComponentProps {
  stores: Store[];
  statusColors: Record<string, string>;
  statusLabels: Record<string, string>;
  selectedStoreId?: string | null;
  onStoreSelect?: (store: Store) => void;
}

// Crear iconos personalizados usando divIcon para mejor compatibilidad
const createCustomIcon = (color: string, isSelected: boolean = false) => {
  const size = isSelected ? 32 : 24;
  const innerSize = isSelected ? 12 : 8;
  const borderWidth = isSelected ? 4 : 3;

  return divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: ${borderWidth}px solid ${isSelected ? '#1d4ed8' : 'white'};
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,${isSelected ? '0.5' : '0.3'});
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        cursor: pointer;
        ${isSelected ? 'transform: scale(1.1);' : ''}
      ">
        <div style="
          width: ${innerSize}px;
          height: ${innerSize}px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

export function MapComponent({
  stores,
  statusColors,
  statusLabels,
  selectedStoreId,
  onStoreSelect
}: MapComponentProps) {
  // Centro de CDMX (Zócalo)
  const center: LatLngExpression = [19.4326, -99.1332];
  const zoom = 11;

  const handleMarkerClick = (store: Store) => {
    if (onStoreSelect) {
      onStoreSelect(store);
    }
  };

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stores.map((store) => {
          const color = statusColors[store.status];
          const isSelected = selectedStoreId === store.id;
          const customIcon = createCustomIcon(color, isSelected);

          return (
            <Marker
              key={store.id}
              position={[store.latitude, store.longitude]}
              icon={customIcon}
              eventHandlers={{
                click: () => handleMarkerClick(store),
              }}
            >
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <p className="font-medium text-sm mb-1">{store.name}</p>
                  <p className="text-xs text-muted-foreground mb-2">{store.address}</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs">{statusLabels[store.status]}</span>
                    <span className="text-xs text-muted-foreground">
                      {store.operativity}% operativo
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Gerente: {store.manager}
                  </p>
                  <button
                    onClick={() => handleMarkerClick(store)}
                    className="mt-2 w-full text-xs bg-primary text-primary-foreground py-1.5 px-3 rounded hover:bg-primary/90 transition-colors"
                  >
                    Ver detalles
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
