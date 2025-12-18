'use client';

import { useState } from 'react';
import {
  Database,
  ShoppingBag,
  Layers,
  Calculator,
  Users,
  CreditCard,
  Mail,
  BarChart,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Integration } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface IntegrationCardProps {
  integration: Integration;
  onConnect: () => void;
  onConfigure: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  database: Database,
  'shopping-bag': ShoppingBag,
  layers: Layers,
  calculator: Calculator,
  users: Users,
  'credit-card': CreditCard,
  mail: Mail,
  'bar-chart': BarChart,
};

const statusConfig = {
  connected: {
    label: 'Conectado',
    className: 'bg-green-100 text-green-800 border-green-200',
    borderClass: 'border-l-4 border-l-green-500',
  },
  disconnected: {
    label: 'Desconectado',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
    borderClass: 'border-l-4 border-l-gray-300',
  },
  error: {
    label: 'Error',
    className: 'bg-red-100 text-red-800 border-red-200',
    borderClass: 'border-l-4 border-l-red-500',
  },
};

export function IntegrationCard({ integration, onConnect, onConfigure }: IntegrationCardProps) {
  const [isEnabled, setIsEnabled] = useState(integration.status === 'connected');
  const Icon = iconMap[integration.icon] || Database;

  return (
    <Card className={cn('transition-shadow hover:shadow-md', statusConfig[integration.status].borderClass)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{integration.name}</h3>
                <Badge variant="outline" className={statusConfig[integration.status].className}>
                  {statusConfig[integration.status].label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{integration.description}</p>
              {integration.lastSync && (
                <p className="text-xs text-muted-foreground">
                  Última sincronización:{' '}
                  {formatDistanceToNow(new Date(integration.lastSync), { addSuffix: true, locale: es })}
                </p>
              )}
            </div>
          </div>

          {/* Switch */}
          <button
            role="switch"
            aria-checked={isEnabled}
            onClick={() => setIsEnabled(!isEnabled)}
            className={cn(
              'relative h-6 w-11 rounded-full transition-colors',
              isEnabled ? 'bg-primary' : 'bg-muted'
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                isEnabled ? 'left-[22px]' : 'left-0.5'
              )}
            />
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          {integration.status === 'connected' ? (
            <Button variant="outline" size="sm" onClick={onConfigure}>
              Configurar
            </Button>
          ) : (
            <Button size="sm" onClick={onConnect}>
              Conectar
            </Button>
          )}
          {integration.status === 'error' && (
            <Button variant="destructive" size="sm">
              Ver Error
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
