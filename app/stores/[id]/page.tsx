'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StoreDetailPanel } from '@/components/dashboard';
import storesData from '@/data/stores.json';
import incidentsData from '@/data/incidents.json';
import inventoryData from '@/data/inventory.json';
import type { Store, Incident, SKU } from '@/types';

const stores = storesData as Store[];
const incidents = incidentsData as Incident[];
const inventory = inventoryData as SKU[];

export default function StoreDetailPage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params?.id as string;

  const [store, setStore] = useState<Store | undefined>();
  const [storeIncidents, setStoreIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    if (storeId) {
      const foundStore = stores.find((s) => s.id === storeId);
      if (foundStore) {
        setStore(foundStore);
        setStoreIncidents(incidents.filter((inc) => inc.storeId === foundStore.id));
      }
    }
  }, [storeId]);

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Tienda no encontrada</h2>
        <p className="text-muted-foreground">La tienda que buscas no existe o fue eliminada.</p>
        <Button onClick={() => router.push('/stores')}>
          Volver a Tiendas
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{store.name}</h1>
          <p className="text-muted-foreground">Perfil completo de la tienda</p>
        </div>
      </div>

      {/* Store Detail Panel */}
      <div className="max-w-5xl">
        <StoreDetailPanel
          store={store}
          incidents={storeIncidents}
          onClose={() => router.push('/stores')}
          inventory={inventory}
        />
      </div>
    </div>
  );
}
