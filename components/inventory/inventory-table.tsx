'use client';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { SKU } from '@/types';
import { Package } from 'lucide-react';

interface InventoryTableProps {
  data: SKU[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const statusConfig = {
  optimal: { label: 'Óptimo', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  low_stock: { label: 'Bajo Stock', className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
  stockout: { label: 'Quiebre', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  shrinkage_risk: { label: 'Riesgo Merma', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
};

export function InventoryTable({ data, selectedId, onSelect }: InventoryTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Producto</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Ventas 30D</TableHead>
            <TableHead className="text-right">Pronóstico</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((sku) => (
            <TableRow
              key={sku.id}
              className={cn(
                'cursor-pointer transition-colors',
                selectedId === sku.id && 'bg-accent'
              )}
              onClick={() => onSelect(sku.id)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{sku.name}</p>
                    <p className="text-xs text-muted-foreground">{sku.category}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {sku.currentStock.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {sku.sales30d.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {sku.forecastNext30d.toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusConfig[sku.status].className}>
                  {statusConfig[sku.status].label}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
