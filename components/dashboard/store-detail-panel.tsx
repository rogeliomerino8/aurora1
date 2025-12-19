'use client';

import { Store, Incident, SKU } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  X,
  MapPin,
  User,
  Activity,
  AlertTriangle,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  XCircle,
  DollarSign,
  Package,
  TrendingUp,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  ShoppingCart
} from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

interface StoreDetailPanelProps {
  store: Store;
  incidents: Incident[];
  onClose: () => void;
  inventory?: SKU[];
}

const statusConfig = {
  operational: {
    label: 'Operativo',
    color: 'bg-green-500',
    textColor: 'text-green-600',
    bgLight: 'bg-green-50',
    icon: CheckCircle2
  },
  warning: {
    label: 'Advertencia',
    color: 'bg-orange-500',
    textColor: 'text-orange-600',
    bgLight: 'bg-orange-50',
    icon: AlertCircle
  },
  critical: {
    label: 'Crítico',
    color: 'bg-red-500',
    textColor: 'text-red-600',
    bgLight: 'bg-red-50',
    icon: XCircle
  },
};

const severityConfig = {
  critical: { label: 'Crítico', variant: 'destructive' as const },
  high: { label: 'Alto', variant: 'destructive' as const },
  medium: { label: 'Medio', variant: 'default' as const },
  low: { label: 'Bajo', variant: 'secondary' as const },
};

const incidentTypeLabels = {
  shrinkage: 'Merma',
  theft: 'Hurto',
  anomaly: 'Anomalía',
  stockout: 'Quiebre de Stock',
};

export function StoreDetailPanel({ store, incidents, onClose, inventory = [] }: StoreDetailPanelProps) {
  const config = statusConfig[store.status];
  const StatusIcon = config.icon;

  // Filtrar incidentes activos (no resueltos)
  const activeIncidents = incidents.filter(
    inc => inc.status !== 'resolved'
  );

  // Incidentes resueltos recientes (últimos 7 días)
  const recentResolvedIncidents = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return incidents
      .filter(inc => inc.status === 'resolved' && new Date(inc.updatedAt) >= sevenDaysAgo)
      .slice(0, 3);
  }, [incidents]);

  // Calcular métricas de inventario
  const inventoryMetrics = useMemo(() => {
    const totalSKUs = inventory.length;
    const lowStock = inventory.filter(sku => sku.status === 'low_stock' || sku.status === 'stockout').length;
    const totalStock = inventory.reduce((sum, sku) => sum + sku.currentStock, 0);
    const totalSales30d = inventory.reduce((sum, sku) => sum + (sku.sales30d * sku.price), 0);
    const estimatedRevenue = totalSales30d * (store.operativity / 100);

    return {
      totalSKUs,
      lowStock,
      totalStock,
      totalSales30d,
      estimatedRevenue
    };
  }, [inventory, store.operativity]);

  // Acciones requeridas basadas en el estado de la tienda y sus incidentes
  const requiredActions = generateRequiredActions(store, activeIncidents);

  return (
    <Card className="flex flex-col min-h-[600px]">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">{store.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {store.address}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {/* Estado y Operatividad */}
        <div className={`p-3 rounded-lg ${config.bgLight}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-5 w-5 ${config.textColor}`} />
              <span className={`font-medium ${config.textColor}`}>{config.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{store.operativity}%</span>
              <span className="text-sm text-muted-foreground">operativo</span>
            </div>
          </div>
        </div>

        {/* Métricas de Rendimiento */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Ventas 30d</span>
            </div>
            <p className="text-lg font-semibold">
              ${(inventoryMetrics.totalSales30d / 1000).toFixed(1)}K
            </p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">SKUs</span>
            </div>
            <p className="text-lg font-semibold">{inventoryMetrics.totalSKUs}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Stock Total</span>
            </div>
            <p className="text-lg font-semibold">{inventoryMetrics.totalStock.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Stock Bajo</span>
            </div>
            <p className="text-lg font-semibold text-orange-600">{inventoryMetrics.lowStock}</p>
          </div>
        </div>

        {/* Info del Gerente y Contacto */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Gerente</p>
              <p className="font-medium">{store.manager}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Dirección</p>
              <p className="font-medium text-sm">{store.address}</p>
            </div>
          </div>
        </div>

        {/* Acciones Requeridas */}
        {requiredActions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Acciones Requeridas ({requiredActions.length})
            </h4>
            <div className="space-y-2">
              {requiredActions.map((action, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg bg-orange-50 border-orange-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-900">{action.title}</p>
                      <p className="text-xs text-orange-700 mt-0.5">{action.description}</p>
                    </div>
                    {action.link && (
                      <Link href={action.link}>
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          {action.actionLabel}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Incidentes Activos */}
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-red-500" />
            Incidentes Activos ({activeIncidents.length})
          </h4>

          {activeIncidents.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground bg-muted/30 rounded-lg">
              No hay incidentes activos en esta tienda
            </div>
          ) : (
            <div className="space-y-2">
              {activeIncidents.map((incident) => (
                <Link
                  key={incident.id}
                  href={`/incidents/${incident.id}`}
                  className="block"
                >
                  <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={severityConfig[incident.severity].variant} className="text-xs">
                            {severityConfig[incident.severity].label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {incidentTypeLabels[incident.type]}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium truncate">{incident.title}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(incident.createdAt)}
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Incidentes Resueltos Recientes */}
        {recentResolvedIncidents.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Resueltos Recientemente ({recentResolvedIncidents.length})
            </h4>
            <div className="space-y-2">
              {recentResolvedIncidents.map((incident) => (
                <Link
                  key={incident.id}
                  href={`/incidents/${incident.id}`}
                  className="block"
                >
                  <div className="p-2 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer bg-green-50/50 border-green-200/50">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate text-green-900">{incident.title}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Resuelto {formatDate(incident.updatedAt)}
                        </div>
                      </div>
                      <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface RequiredAction {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  link?: string;
  actionLabel?: string;
}

function generateRequiredActions(store: Store, incidents: Incident[]): RequiredAction[] {
  const actions: RequiredAction[] = [];

  // Acciones basadas en el estado de la tienda
  if (store.status === 'critical') {
    actions.push({
      title: 'Revisar operatividad crítica',
      description: `La tienda está al ${store.operativity}% de operatividad. Requiere atención inmediata.`,
      priority: 'high',
      link: `/inventory?store=${store.id}`,
      actionLabel: 'Ver Inventario',
    });
  } else if (store.status === 'warning') {
    actions.push({
      title: 'Atender advertencias operativas',
      description: `Operatividad en ${store.operativity}%. Revisar posibles problemas.`,
      priority: 'medium',
      link: `/inventory?store=${store.id}`,
      actionLabel: 'Revisar',
    });
  }

  // Acciones basadas en incidentes críticos o de alta prioridad
  const criticalIncidents = incidents.filter(i => i.severity === 'critical' && i.status === 'open');
  if (criticalIncidents.length > 0) {
    actions.push({
      title: `Atender ${criticalIncidents.length} incidente(s) crítico(s)`,
      description: 'Hay incidentes que requieren atención inmediata.',
      priority: 'high',
      link: `/incidents?store=${store.id}&severity=critical`,
      actionLabel: 'Ver Incidentes',
    });
  }

  // Acciones para quiebres de stock
  const stockoutIncidents = incidents.filter(i => i.type === 'stockout' && i.status !== 'resolved');
  if (stockoutIncidents.length > 0) {
    actions.push({
      title: `Resolver ${stockoutIncidents.length} quiebre(s) de stock`,
      description: 'Productos sin inventario afectando ventas.',
      priority: 'high',
      link: `/inventory?store=${store.id}&status=stockout`,
      actionLabel: 'Ver Stock',
    });
  }

  // Acción para incidentes escalados
  const escalatedIncidents = incidents.filter(i => i.status === 'escalated');
  if (escalatedIncidents.length > 0) {
    actions.push({
      title: `${escalatedIncidents.length} incidente(s) escalado(s)`,
      description: 'Incidentes que han sido escalados para revisión.',
      priority: 'high',
      link: `/incidents?store=${store.id}&status=escalated`,
      actionLabel: 'Revisar',
    });
  }

  return actions;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Hace menos de 1 hora';
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;

  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short'
  });
}
