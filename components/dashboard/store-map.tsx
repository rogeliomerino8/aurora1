'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import storesData from '@/data/stores.json';
import type { Store } from '@/types';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const stores = storesData as Store[];

const statusColors = {
  operational: '#22c55e',
  warning: '#f97316',
  critical: '#ef4444',
};

const statusLabels = {
  operational: 'Operativo',
  warning: 'Advertencia',
  critical: 'Crítico',
};

interface StoreMapProps {
  selectedStoreId?: string | null;
  onStoreSelect?: (store: Store) => void;
}

// Componente del mapa cargado dinámicamente para evitar problemas de SSR
const MapComponent = dynamic(
  () => import('./map-component').then((mod) => mod.MapComponent),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando mapa...</div>
      </div>
    ),
  }
);

export function StoreMap({ selectedStoreId, onStoreSelect }: StoreMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <MapPin className="h-4 w-4" />
          Mapa de Tiendas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mounted ? (
          <MapComponent
            stores={stores}
            statusColors={statusColors}
            statusLabels={statusLabels}
            selectedStoreId={selectedStoreId}
            onStoreSelect={onStoreSelect}
          />
        ) : (
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Cargando mapa...</div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          {Object.entries(statusLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: statusColors[key as keyof typeof statusColors] }}
              />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Exportar stores para usar en el dashboard
export { stores };
