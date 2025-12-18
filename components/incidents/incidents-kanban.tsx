'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Incident, IncidentStatus } from '@/types';
import { User, GripVertical } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import { useState } from 'react';

interface IncidentsKanbanProps {
  incidents: Incident[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onStatusChange?: (incidentId: string, newStatus: IncidentStatus) => void;
}

const statusConfig = {
  open: { label: 'Abierto', className: 'bg-red-100 text-red-800', borderColor: 'border-red-200 bg-red-50' },
  in_progress: { label: 'En Progreso', className: 'bg-blue-100 text-blue-800', borderColor: 'border-blue-200 bg-blue-50' },
  escalated: { label: 'Escalado', className: 'bg-purple-100 text-purple-800', borderColor: 'border-purple-200 bg-purple-50' },
  resolved: { label: 'Resuelto', className: 'bg-green-100 text-green-800', borderColor: 'border-green-200 bg-green-50' },
};

const severityConfig = {
  critical: { label: 'Crítico', className: 'bg-red-600 text-white' },
  high: { label: 'Alto', className: 'bg-orange-500 text-white' },
  medium: { label: 'Medio', className: 'bg-yellow-500 text-white' },
  low: { label: 'Bajo', className: 'bg-blue-500 text-white' },
};

const statuses: IncidentStatus[] = ['open', 'in_progress', 'escalated', 'resolved'];

interface DraggableIncidentCardProps {
  incident: Incident;
  isSelected: boolean;
  onSelect: () => void;
}

function DraggableIncidentCard({ incident, isSelected, onSelect }: DraggableIncidentCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: incident.id,
    data: {
      incident,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-3"
    >
      <Card
        className={cn(
          'p-3 transition-all hover:shadow-md border',
          isSelected ? 'ring-2 ring-primary' : '',
          isDragging ? 'opacity-50' : ''
        )}
        onClick={onSelect}
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <Badge className={severityConfig[incident.severity].className}>
                {severityConfig[incident.severity].label}
              </Badge>
            </div>
            <div
              {...attributes}
              {...listeners}
              className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
              title="Arrastra para mover"
            >
              <GripVertical className="h-4 w-4" />
            </div>
          </div>
          <h4 className="font-medium text-sm leading-tight line-clamp-2">{incident.title}</h4>
          <p className="text-xs text-muted-foreground line-clamp-2">{incident.description}</p>
          <div className="space-y-1 pt-2 border-t">
            <p className="text-xs font-medium text-muted-foreground">{incident.storeName}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="truncate">{incident.assignedTo}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(incident.createdAt), {
                addSuffix: true,
                locale: es,
              })}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface DroppableColumnProps {
  status: IncidentStatus;
  incidents: Incident[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function DroppableColumn({ status, incidents, selectedId, onSelect }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const config = statusConfig[status];

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'rounded-lg border-2 p-4 min-h-96 transition-colors',
        config.borderColor,
        isOver ? 'ring-2 ring-primary ring-offset-2' : ''
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={config.className}>
            {config.label}
          </Badge>
          <span className="text-sm font-medium text-muted-foreground">
            {incidents.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3 min-h-32">
        {incidents.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Sin incidentes
          </div>
        ) : (
          incidents.map((incident) => (
            <DraggableIncidentCard
              key={incident.id}
              incident={incident}
              isSelected={selectedId === incident.id}
              onSelect={() => onSelect(incident.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function IncidentsKanban({
  incidents,
  selectedId,
  onSelect,
  onStatusChange,
}: IncidentsKanbanProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [localIncidents, setLocalIncidents] = useState(incidents);

  // Sync with parent incidents
  useState(() => {
    setLocalIncidents(incidents);
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeIncident = localIncidents.find((i) => i.id === active.id);
    const overId = over.id as IncidentStatus;

    if (!activeIncident) return;

    // Si el over.id es un status válido y diferente al actual
    if (statuses.includes(overId) && activeIncident.status !== overId) {
      setLocalIncidents((prev) =>
        prev.map((incident) =>
          incident.id === active.id
            ? { ...incident, status: overId }
            : incident
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeIncident = incidents.find((i) => i.id === active.id);
    const newStatus = over.id as IncidentStatus;

    if (!activeIncident) return;

    if (statuses.includes(newStatus) && activeIncident.status !== newStatus && onStatusChange) {
      onStatusChange(active.id as string, newStatus);
    }
  };

  const activeIncident = localIncidents.find((i) => i.id === activeId);

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {statuses.map((status) => {
          const statusIncidents = localIncidents.filter((incident) => incident.status === status);

          return (
            <DroppableColumn
              key={status}
              status={status}
              incidents={statusIncidents}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          );
        })}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeIncident ? (
          <Card className="p-3 border shadow-lg opacity-90 w-80 cursor-grabbing">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={severityConfig[activeIncident.severity].className}>
                  {severityConfig[activeIncident.severity].label}
                </Badge>
              </div>
              <h4 className="font-medium text-sm leading-tight line-clamp-2">{activeIncident.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{activeIncident.description}</p>
            </div>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
