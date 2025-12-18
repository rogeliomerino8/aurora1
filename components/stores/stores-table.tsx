'use client';

import { Store } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  MapPin,
  User,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

interface StoresTableProps {
  stores: Store[];
}

const statusConfig = {
  operational: {
    label: 'Operativo',
    variant: 'default' as const,
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-700 hover:bg-green-100',
  },
  warning: {
    label: 'Advertencia',
    variant: 'default' as const,
    icon: AlertCircle,
    className: 'bg-orange-100 text-orange-700 hover:bg-orange-100',
  },
  critical: {
    label: 'Crítico',
    variant: 'destructive' as const,
    icon: XCircle,
    className: 'bg-red-100 text-red-700 hover:bg-red-100',
  },
};

function getOperativityColor(operativity: number): string {
  if (operativity >= 90) return 'text-green-600';
  if (operativity >= 80) return 'text-orange-600';
  return 'text-red-600';
}

export function StoresTable({ stores }: StoresTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tienda</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Operatividad</TableHead>
            <TableHead>Gerente</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No se encontraron tiendas
              </TableCell>
            </TableRow>
          ) : (
            stores.map((store) => {
              const config = statusConfig[store.status];
              const StatusIcon = config.icon;

              return (
                <TableRow key={store.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{store.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {store.address}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={config.className}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            store.operativity >= 90
                              ? 'bg-green-500'
                              : store.operativity >= 80
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${store.operativity}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${getOperativityColor(store.operativity)}`}>
                        {store.operativity}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">{store.manager}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/incidents?store=${store.id}`}>
                        <Button variant="ghost" size="sm">
                          Incidentes
                        </Button>
                      </Link>
                      <Link href={`/inventory?store=${store.id}`}>
                        <Button variant="ghost" size="sm">
                          Inventario
                        </Button>
                      </Link>
                      <Link href={`/stores/${store.id}`}>
                        <Button variant="outline" size="sm">
                          Ver detalle
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
