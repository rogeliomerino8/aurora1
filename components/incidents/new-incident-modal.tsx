'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { IncidentSeverity, IncidentType } from '@/types';

interface NewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incident: NewIncidentData) => void;
}

export interface NewIncidentData {
  title: string;
  description: string;
  severity: IncidentSeverity;
  type: IncidentType;
  storeId: string;
  assignedTo: string;
}

export function NewIncidentModal({ isOpen, onClose, onSubmit }: NewIncidentModalProps) {
  const [formData, setFormData] = useState<NewIncidentData>({
    title: '',
    description: '',
    severity: 'medium',
    type: 'anomaly',
    storeId: '',
    assignedTo: '',
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof NewIncidentData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      severity: 'medium',
      type: 'anomaly',
      storeId: '',
      assignedTo: '',
    });
    onClose();
  };

  const isFormValid = formData.title && formData.description && formData.storeId && formData.assignedTo;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-background p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Registrar Nuevo Incidente</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título del incidente *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleChange('title')}
              placeholder="Ej: Posible hurto detectado en sección de electrónicos"
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Describe el incidente con el mayor detalle posible..."
              rows={4}
            />
          </div>

          {/* Tipo y Severidad */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de incidente</Label>
              <select
                id="type"
                value={formData.type}
                onChange={handleChange('type')}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="shrinkage">Merma</option>
                <option value="theft">Hurto</option>
                <option value="anomaly">Anomalía</option>
                <option value="stockout">Quiebre de Stock</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severidad</Label>
              <select
                id="severity"
                value={formData.severity}
                onChange={handleChange('severity')}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="low">Bajo</option>
                <option value="medium">Medio</option>
                <option value="high">Alto</option>
                <option value="critical">Crítico</option>
              </select>
            </div>
          </div>

          {/* Tienda */}
          <div className="space-y-2">
            <Label htmlFor="storeId">Tienda afectada *</Label>
            <select
              id="storeId"
              value={formData.storeId}
              onChange={handleChange('storeId')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Seleccionar tienda</option>
              <option value="store-001">Tienda Polanco</option>
              <option value="store-002">Tienda Santa Fe</option>
              <option value="store-003">Tienda Condesa</option>
              <option value="store-004">Tienda Roma Norte</option>
              <option value="store-005">Tienda Coyoacán</option>
              <option value="store-006">Tienda Del Valle</option>
              <option value="store-007">Tienda Satélite</option>
              <option value="store-008">Tienda Pedregal</option>
              <option value="store-009">Tienda Interlomas</option>
              <option value="store-010">Tienda Reforma</option>
            </select>
          </div>

          {/* Asignado a */}
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Asignar a *</Label>
            <select
              id="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange('assignedTo')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Seleccionar responsable</option>
              <option value="Carlos Méndez">Carlos Méndez</option>
              <option value="Ana López">Ana López</option>
              <option value="Roberto García">Roberto García</option>
              <option value="María Fernández">María Fernández</option>
              <option value="Jorge Hernández">Jorge Hernández</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={!isFormValid}>
              Registrar Incidente
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
