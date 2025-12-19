'use client';

import { useState } from 'react';
import { Search, LayoutList, Kanban, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IncidentList, IncidentDetail, IncidentsKanban, NewIncidentModal } from '@/components/incidents';
import type { NewIncidentData } from '@/components/incidents';
import incidentsData from '@/data/incidents.json';
import type { Incident } from '@/types';

const incidents = incidentsData as Incident[];

export default function IncidentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'mine'>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [incidentsData, setIncidentsData] = useState<Incident[]>(incidents);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddIncident = (data: NewIncidentData) => {
    const newIncident: Incident = {
      id: `incident-${Date.now()}`,
      title: data.title,
      description: data.description,
      severity: data.severity,
      status: 'open',
      type: data.type,
      storeId: data.storeId,
      storeName: getStoreName(data.storeId),
      assignedTo: data.assignedTo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setIncidentsData((prev) => [newIncident, ...prev]);
    console.log('Nuevo incidente creado:', newIncident);
  };

  const getStoreName = (storeId: string) => {
    const storeNames: Record<string, string> = {
      'store-001': 'Tienda Polanco',
      'store-002': 'Tienda Santa Fe',
      'store-003': 'Tienda Condesa',
      'store-004': 'Tienda Roma Norte',
      'store-005': 'Tienda Coyoacán',
      'store-006': 'Tienda Del Valle',
      'store-007': 'Tienda Satélite',
      'store-008': 'Tienda Pedregal',
      'store-009': 'Tienda Interlomas',
      'store-010': 'Tienda Reforma',
    };
    return storeNames[storeId] || 'Tienda Desconocida';
  };

  const handleStatusChange = (incidentId: string, newStatus: string) => {
    setIncidentsData((prev) =>
      prev.map((incident) =>
        incident.id === incidentId
          ? { ...incident, status: newStatus as any }
          : incident
      )
    );
    console.log(`Incidente ${incidentId} movido a ${newStatus}`);
  };

  const filteredIncidents = incidentsData
    .filter((incident) => {
      if (filter === 'mine') {
        return incident.assignedTo === 'Carlos Méndez'; // Mock current user
      }
      return true;
    })
    .filter(
      (incident) =>
        incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.storeName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Sort by severity then by date
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const selectedIncidentData = incidentsData.find((i) => i.id === selectedIncident);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Incidentes</h1>
          <p className="text-muted-foreground">Gestión y seguimiento de incidentes en tiendas</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Registrar Incidente
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex rounded-lg border p-1">
          <Button
            variant={filter === 'mine' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('mine')}
          >
            Mis Incidentes
          </Button>
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todos
          </Button>
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar incidentes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex rounded-lg border p-1 ml-auto">
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('kanban')}
          >
            <Kanban className="h-4 w-4 mr-1" />
            Kanban
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <LayoutList className="h-4 w-4 mr-1" />
            Lista
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* View */}
        <div className={selectedIncident && viewMode === 'list' ? 'lg:col-span-2' : 'lg:col-span-5'}>
          {viewMode === 'kanban' ? (
            <IncidentsKanban
              incidents={filteredIncidents}
              selectedId={selectedIncident}
              onSelect={setSelectedIncident}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <IncidentList
              incidents={filteredIncidents}
              selectedId={selectedIncident}
              onSelect={setSelectedIncident}
            />
          )}
        </div>

        {/* Detail */}
        {selectedIncidentData && (
          <div className={viewMode === 'kanban' ? 'hidden' : 'lg:col-span-3'}>
            <IncidentDetail
              incident={selectedIncidentData}
              onClose={() => setSelectedIncident(null)}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      <NewIncidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddIncident}
      />
    </div>
  );
}
