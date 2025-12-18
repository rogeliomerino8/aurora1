'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StoresTable, StoresFilters, NewStoreModal } from '@/components/stores';
import type { NewStoreData } from '@/components/stores';
import { CheckCircle2, AlertCircle, XCircle, Store, Plus } from 'lucide-react';
import storesData from '@/data/stores.json';
import type { Store as StoreType, StoreStatus } from '@/types';

const stores = storesData as StoreType[];

export default function StoresPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<StoreStatus | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddStore = (data: NewStoreData) => {
    console.log('Nueva tienda:', data);
    // Aquí se integraría con el backend para guardar la tienda
  };

  // Filtrar tiendas
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      // Filtro de búsqueda
      const matchesSearch =
        searchQuery === '' ||
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.manager.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro de estado
      const matchesStatus = selectedStatus === 'all' || store.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const operational = stores.filter((s) => s.status === 'operational').length;
    const warning = stores.filter((s) => s.status === 'warning').length;
    const critical = stores.filter((s) => s.status === 'critical').length;
    const avgOperativity = Math.round(
      stores.reduce((acc, s) => acc + s.operativity, 0) / stores.length
    );

    return { total: stores.length, operational, warning, critical, avgOperativity };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tiendas</h1>
          <p className="text-muted-foreground">Gestiona y monitorea todas tus tiendas</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Tienda
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tiendas</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Store className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Operativas</p>
                <p className="text-2xl font-bold text-green-600">{stats.operational}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Con Advertencia</p>
                <p className="text-2xl font-bold text-orange-600">{stats.warning}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Críticas</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <StoresFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Mostrando {filteredStores.length} de {stores.length} tiendas
      </p>

      {/* Table */}
      <StoresTable stores={filteredStores} />

      {/* Modal */}
      <NewStoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddStore}
      />
    </div>
  );
}
