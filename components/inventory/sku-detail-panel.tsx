'use client';

import { useState } from 'react';
import { X, Sparkles, ShoppingCart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ForecastChart } from './forecast-chart';
import type { SKU, ForecastDataPoint } from '@/types';

interface SKUDetailPanelProps {
  sku: SKU;
  onClose: () => void;
  onCreateOrder: () => void;
}

const statusConfig = {
  optimal: { label: 'Óptimo', className: 'bg-green-100 text-green-800' },
  low_stock: { label: 'Bajo Stock', className: 'bg-orange-100 text-orange-800' },
  stockout: { label: 'Quiebre', className: 'bg-red-100 text-red-800' },
  shrinkage_risk: { label: 'Riesgo Merma', className: 'bg-yellow-100 text-yellow-800' },
};

// Mock forecast data
const shortTermForecast: ForecastDataPoint[] = [
  { date: 'Sem 1', actual: 220, predicted: 215 },
  { date: 'Sem 2', actual: 245, predicted: 240 },
  { date: 'Sem 3', actual: 230, predicted: 235 },
  { date: 'Sem 4', actual: 260, predicted: 250 },
  { date: 'Sem 5', predicted: 265, confidenceLow: 245, confidenceHigh: 285 },
  { date: 'Sem 6', predicted: 280, confidenceLow: 255, confidenceHigh: 305 },
  { date: 'Sem 7', predicted: 275, confidenceLow: 250, confidenceHigh: 300 },
  { date: 'Sem 8', predicted: 290, confidenceLow: 265, confidenceHigh: 315 },
];

const longTermForecast: ForecastDataPoint[] = [
  { date: 'Ene', predicted: 1100, confidenceLow: 950, confidenceHigh: 1250 },
  { date: 'Feb', predicted: 1050, confidenceLow: 900, confidenceHigh: 1200 },
  { date: 'Mar', predicted: 1200, confidenceLow: 1050, confidenceHigh: 1350 },
  { date: 'Abr', predicted: 1150, confidenceLow: 1000, confidenceHigh: 1300 },
  { date: 'May', predicted: 1300, confidenceLow: 1150, confidenceHigh: 1450 },
  { date: 'Jun', predicted: 1250, confidenceLow: 1100, confidenceHigh: 1400 },
];

export function SKUDetailPanel({ sku, onClose, onCreateOrder }: SKUDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<'short' | 'long'>('short');

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{sku.name}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* SKU Info */}
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className={statusConfig[sku.status].className}>
            {statusConfig[sku.status].label}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {sku.category} • {sku.supplier}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-muted p-3 text-center">
            <p className="text-2xl font-bold">{sku.currentStock}</p>
            <p className="text-xs text-muted-foreground">Stock Actual</p>
          </div>
          <div className="rounded-lg bg-muted p-3 text-center">
            <p className="text-2xl font-bold">{sku.sales30d}</p>
            <p className="text-xs text-muted-foreground">Ventas 30D</p>
          </div>
          <div className="rounded-lg bg-muted p-3 text-center">
            <p className="text-2xl font-bold">${sku.price}</p>
            <p className="text-xs text-muted-foreground">Precio</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'short'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('short')}
          >
            Corto Plazo
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'long'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('long')}
          >
            Largo Plazo
          </button>
        </div>

        {/* Chart */}
        <ForecastChart
          data={activeTab === 'short' ? shortTermForecast : longTermForecast}
          showConfidence={activeTab === 'long'}
        />

        {/* AI Alert */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Sugerencia de Aurora</p>
              <p className="text-sm text-muted-foreground">
                Basado en las tendencias actuales, se recomienda realizar un pedido de{' '}
                <strong>200 unidades</strong> para la próxima semana para evitar quiebre de stock.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button className="flex-1" onClick={onCreateOrder}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Crear Pedido Sugerido
          </Button>
          <Button variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            Ver Historial
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
