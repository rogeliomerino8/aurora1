'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { StoreStatus } from '@/types';

interface StoresFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: StoreStatus | 'all';
  onStatusChange: (status: StoreStatus | 'all') => void;
}

const statusOptions = [
  { value: 'all' as const, label: 'Todas', className: 'bg-muted hover:bg-muted/80' },
  { value: 'operational' as const, label: 'Operativas', className: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { value: 'warning' as const, label: 'Advertencia', className: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  { value: 'critical' as const, label: 'Críticas', className: 'bg-red-100 text-red-700 hover:bg-red-200' },
];

export function StoresFilters({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}: StoresFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o dirección..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => onSearchChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {statusOptions.map((option) => (
          <Badge
            key={option.value}
            className={`cursor-pointer transition-all ${
              selectedStatus === option.value
                ? option.value === 'all'
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : option.className + ' ring-2 ring-offset-1 ring-primary'
                : option.className + ' opacity-60'
            }`}
            onClick={() => onStatusChange(option.value)}
          >
            {option.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
