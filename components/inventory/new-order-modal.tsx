'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SKU } from '@/types';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  sku?: SKU | null;
}

export function NewOrderModal({ isOpen, onClose, sku }: NewOrderModalProps) {
  const [quantity, setQuantity] = useState(sku ? '200' : '');
  const [supplier, setSupplier] = useState(sku?.supplier || '');
  const [selectedProduct, setSelectedProduct] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order created:', { sku: sku?.name || selectedProduct, quantity, supplier });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-background p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          {sku ? 'Crear Pedido Sugerido' : 'Nuevo Pedido'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SKU */}
          <div className="space-y-2">
            <Label htmlFor="sku">Producto</Label>
            {sku ? (
              <div className="rounded-lg bg-muted p-3">
                <p className="font-medium">{sku.name}</p>
                <p className="text-sm text-muted-foreground">{sku.category}</p>
              </div>
            ) : (
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Seleccionar producto</option>
                <option value="sku-001">Leche Entera 1L</option>
                <option value="sku-002">Pan Blanco Bimbo</option>
                <option value="sku-003">Coca-Cola 600ml</option>
              </select>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Ingresa la cantidad"
            />
            {sku && (
              <p className="text-xs text-muted-foreground">
                Cantidad sugerida por Aurora: 200 unidades
              </p>
            )}
          </div>

          {/* Supplier */}
          <div className="space-y-2">
            <Label htmlFor="supplier">Proveedor</Label>
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Seleccionar proveedor</option>
              <option value="Lala">Lala</option>
              <option value="Bimbo">Bimbo</option>
              <option value="FEMSA">FEMSA</option>
              <option value="Sigma">Sigma</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Crear Pedido
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
