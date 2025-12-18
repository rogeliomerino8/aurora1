'use client';

import { useState } from 'react';
import { UserPlus, CheckCircle, ArrowUpCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIChat } from './ai-chat';
import { VideoPlayer } from './video-player';
import type { Incident } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface IncidentDetailProps {
  incident: Incident;
  onClose: () => void;
}

const severityConfig = {
  critical: { label: 'Crítico', className: 'bg-red-600 text-white' },
  high: { label: 'Alto', className: 'bg-orange-100 text-orange-800' },
  medium: { label: 'Medio', className: 'bg-yellow-100 text-yellow-800' },
  low: { label: 'Bajo', className: 'bg-blue-100 text-blue-800' },
};

const statusConfig = {
  open: { label: 'Abierto', className: 'bg-red-100 text-red-800' },
  in_progress: { label: 'En Progreso', className: 'bg-blue-100 text-blue-800' },
  resolved: { label: 'Resuelto', className: 'bg-green-100 text-green-800' },
  escalated: { label: 'Escalado', className: 'bg-purple-100 text-purple-800' },
};

const typeConfig = {
  shrinkage: 'Merma',
  theft: 'Hurto',
  anomaly: 'Anomalía',
  stockout: 'Quiebre de Stock',
};

export function IncidentDetail({ incident, onClose }: IncidentDetailProps) {
  const [showResolveModal, setShowResolveModal] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={severityConfig[incident.severity].className}>
                  {severityConfig[incident.severity].label}
                </Badge>
                <Badge variant="outline" className={statusConfig[incident.status].className}>
                  {statusConfig[incident.status].label}
                </Badge>
                <Badge variant="outline">
                  {typeConfig[incident.type]}
                </Badge>
              </div>
              <CardTitle className="text-xl">{incident.title}</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{incident.description}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>Tienda: <strong className="text-foreground">{incident.storeName}</strong></span>
            <span>Asignado a: <strong className="text-foreground">{incident.assignedTo}</strong></span>
            <span>
              Creado:{' '}
              <strong className="text-foreground">
                {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true, locale: es })}
              </strong>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          <UserPlus className="mr-2 h-4 w-4" />
          Reasignar
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => setShowResolveModal(true)}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Resolver
        </Button>
        <Button variant="destructive" className="flex-1">
          <ArrowUpCircle className="mr-2 h-4 w-4" />
          Escalar
        </Button>
      </div>

      {/* Video */}
      <VideoPlayer
        videoUrl={incident.videoClipUrl}
        cameraLocation={incident.cameraLocation}
        timestamp={incident.createdAt}
      />

      {/* AI Chat */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Asistente Aurora</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <AIChat incidentId={incident.id} />
        </CardContent>
      </Card>

      {/* Resolve Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowResolveModal(false)} />
          <div className="relative z-50 w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Resolver Incidente</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Motivo de resolución</label>
                <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2">
                  <option>Falso positivo</option>
                  <option>Artículo recuperado</option>
                  <option>Pérdida confirmada</option>
                  <option>Otro</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Comentarios</label>
                <textarea
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                  placeholder="Agregar comentarios adicionales..."
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowResolveModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={() => setShowResolveModal(false)} className="flex-1">
                  Confirmar Resolución
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
