'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Incident } from '@/types';
import { User } from 'lucide-react';

interface IncidentListProps {
  incidents: Incident[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const severityConfig = {
  critical: { label: 'Crítico', className: 'bg-red-600 text-white hover:bg-red-600' },
  high: { label: 'Alto', className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
  medium: { label: 'Medio', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  low: { label: 'Bajo', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
};

const statusConfig = {
  open: { label: 'Abierto', className: 'bg-red-100 text-red-800' },
  in_progress: { label: 'En Progreso', className: 'bg-blue-100 text-blue-800' },
  resolved: { label: 'Resuelto', className: 'bg-green-100 text-green-800' },
  escalated: { label: 'Escalado', className: 'bg-purple-100 text-purple-800' },
};

export function IncidentList({ incidents, selectedId, onSelect }: IncidentListProps) {
  return (
    <div className="space-y-2">
      {incidents.map((incident) => (
        <Card
          key={incident.id}
          className={cn(
            'cursor-pointer p-4 transition-all hover:shadow-md',
            selectedId === incident.id && 'ring-2 ring-primary'
          )}
          onClick={() => onSelect(incident.id)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={severityConfig[incident.severity].className}>
                  {severityConfig[incident.severity].label}
                </Badge>
                <Badge variant="outline" className={statusConfig[incident.status].className}>
                  {statusConfig[incident.status].label}
                </Badge>
              </div>
              <h3 className="font-medium leading-tight">{incident.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {incident.description}
              </p>
              <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
                <span>{incident.storeName}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {incident.assignedTo}
                </div>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(incident.createdAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
