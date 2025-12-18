'use client';

import { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InventoryTable, SKUDetailPanel, NewOrderModal } from '@/components/inventory';
import inventoryData from '@/data/inventory.json';
import type { SKU } from '@/types';

const inventory = inventoryData as SKU[];

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSKU, setSelectedSKU] = useState<string | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [viewMode, setViewMode] = useState<'operative' | 'strategic'>('operative');

  const filteredInventory = inventory.filter(
    (sku) =>
      sku.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sku.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedSKUData = inventory.find((sku) => sku.id === selectedSKU);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventario</h1>
          <p className="text-muted-foreground">Gestión y predicciones de inventario con IA</p>
        </div>
        <Button onClick={() => setShowOrderModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Pedido
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <div className="flex rounded-lg border p-1">
          <button
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'operative'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setViewMode('operative')}
          >
            Operativa
          </button>
          <button
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'strategic'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setViewMode('strategic')}
          >
            Estratégica
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Table */}
        <div className={selectedSKU ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <InventoryTable
            data={filteredInventory}
            selectedId={selectedSKU}
            onSelect={setSelectedSKU}
          />
        </div>

        {/* Detail Panel */}
        {selectedSKUData && (
          <div className="lg:col-span-1">
            <SKUDetailPanel
              sku={selectedSKUData}
              onClose={() => setSelectedSKU(null)}
              onCreateOrder={() => setShowOrderModal(true)}
            />
          </div>
        )}
      </div>

      {/* New Order Modal */}
      <NewOrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        sku={selectedSKUData}
      />
    </div>
  );
}
