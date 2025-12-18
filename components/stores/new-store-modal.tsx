'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NewStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (store: NewStoreData) => void;
}

export interface NewStoreData {
  name: string;
  address: string;
  manager: string;
  latitude: string;
  longitude: string;
}

export function NewStoreModal({ isOpen, onClose, onSubmit }: NewStoreModalProps) {
  const [formData, setFormData] = useState<NewStoreData>({
    name: '',
    address: '',
    manager: '',
    latitude: '',
    longitude: '',
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof NewStoreData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', address: '', manager: '', latitude: '', longitude: '' });
    onClose();
  };

  const isFormValid = formData.name && formData.address && formData.manager;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-background p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Agregar Nueva Tienda</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la tienda *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="Ej: Tienda Centro"
            />
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={handleChange('address')}
              placeholder="Ej: Av. Reforma 123"
            />
          </div>

          {/* Gerente */}
          <div className="space-y-2">
            <Label htmlFor="manager">Gerente *</Label>
            <Input
              id="manager"
              value={formData.manager}
              onChange={handleChange('manager')}
              placeholder="Nombre del gerente"
            />
          </div>

          {/* Coordenadas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitud</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={handleChange('latitude')}
                placeholder="19.4326"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitud</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={handleChange('longitude')}
                placeholder="-99.1332"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Las coordenadas son opcionales. Se pueden agregar después.
          </p>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={!isFormValid}>
              Agregar Tienda
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
