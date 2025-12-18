'use client';

import { useState, useMemo } from 'react';
import { DollarSign, Package, AlertTriangle, TrendingDown } from 'lucide-react';
import { KPICard, NetworkStatusCard, AlertCarousel, StoreMap, stores, StoreDetailPanel } from '@/components/dashboard';
import type { Alert } from '@/components/dashboard';
import type { Store, Incident, SKU } from '@/types';
import incidentsData from '@/data/incidents.json';
import inventoryData from '@/data/inventory.json';

const incidents = incidentsData as Incident[];
const inventory = inventoryData as SKU[];

// Generar alertas a partir de incidentes activos
function generateAlertsFromIncidents(incidents: Incident[]): Alert[] {
  const activeIncidents = incidents.filter(inc => inc.status !== 'resolved');

  const alerts: Alert[] = activeIncidents.map(incident => {
    let actionLabel = 'Revisar';
    let description = incident.description;

    switch (incident.type) {
      case 'theft':
        actionLabel = 'Verificar Video';
        break;
      case 'shrinkage':
        actionLabel = 'Investigar Merma';
        break;
      case 'stockout':
        actionLabel = 'Ordenar Stock';
        break;
      case 'anomaly':
        actionLabel = 'Analizar Datos';
        break;
    }

    // Agregar contexto de tienda
    description = `${incident.storeName}: ${description}`;

    return {
      id: incident.id,
      title: incident.title,
      description,
      severity: incident.severity,
      actionLabel,
      link: `/incidents/${incident.id}`,
      onAction: () => console.log(`Action taken on incident: ${incident.id}`),
    };
  });

  // Agregar alertas adicionales del sistema
  const systemAlerts: Alert[] = [
    {
      id: 'sys-001',
      title: 'Transferencia de inventario pendiente',
      description: '50 unidades de Leche Entera 1L de Tienda Polanco a Tienda Santa Fe requieren aprobación.',
      severity: 'high',
      actionLabel: 'Aprobar Transferencia',
      link: '/inventory',
      onAction: () => console.log('Transfer approved'),
    },
    {
      id: 'sys-002',
      title: 'Reabastecimiento automático sugerido',
      description: '15 SKUs con stock bajo detectados. El sistema recomienda generar órdenes de compra.',
      severity: 'medium',
      actionLabel: 'Ver Sugerencias',
      link: '/inventory?filter=low_stock',
      onAction: () => console.log('View suggestions'),
    },
    {
      id: 'sys-003',
      title: 'Actualización de precios pendiente',
      description: 'Hay 8 productos con precios desactualizados según el catálogo del proveedor.',
      severity: 'low',
      actionLabel: 'Actualizar Precios',
      link: '/settings',
      onAction: () => console.log('Update prices'),
    },
  ];

  return [...alerts, ...systemAlerts];
}

export default function DashboardPage() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // Generar alertas
  const alerts = useMemo(() => generateAlertsFromIncidents(incidents), []);

  // Filtrar incidentes de la tienda seleccionada
  const storeIncidents = selectedStore
    ? incidents.filter(inc => inc.storeId === selectedStore.id)
    : [];

  // Contar incidentes activos para el KPI
  const activeIncidentsCount = incidents.filter(inc => inc.status !== 'resolved').length;

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
  };

  const handleClosePanel = () => {
    setSelectedStore(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Centro de Mando</h1>
        <p className="text-muted-foreground">Monitoreo en tiempo real de tu red de tiendas</p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map - Takes 2 columns */}
        <div className="lg:col-span-2">
          <StoreMap
            selectedStoreId={selectedStore?.id}
            onStoreSelect={handleStoreSelect}
          />
        </div>

        {/* Right Column - Store Detail or Cards */}
        <div className="space-y-4">
          {selectedStore ? (
            <StoreDetailPanel
              store={selectedStore}
              incidents={storeIncidents}
              onClose={handleClosePanel}
              inventory={inventory}
            />
          ) : (
            <>
              <NetworkStatusCard percentage={87} />
              <AlertCarousel alerts={alerts} />
            </>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Ventas Totales"
          value="$2.4M"
          trend={12.5}
          icon={<DollarSign className="h-6 w-6" />}
          variant="success"
        />
        <KPICard
          title="Unidades Vendidas"
          value="45,231"
          trend={8.2}
          icon={<Package className="h-6 w-6" />}
        />
        <KPICard
          title="Incidentes Activos"
          value={String(activeIncidentsCount)}
          trend={-15}
          icon={<AlertTriangle className="h-6 w-6" />}
          variant="warning"
        />
        <KPICard
          title="Nivel de Merma"
          value="2.3%"
          trend={-5.1}
          icon={<TrendingDown className="h-6 w-6" />}
          variant="danger"
        />
      </div>
    </div>
  );
}
