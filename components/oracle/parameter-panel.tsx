'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function ParameterPanel() {
  const [horizon, setHorizon] = useState('6');
  const [scenarios, setScenarios] = useState({
    seasonality: true,
    promotions: false,
    newStores: false,
  });
  const [confidence, setConfidence] = useState(80);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Parámetros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Horizon */}
        <div className="space-y-2">
          <Label>Horizonte de Predicción</Label>
          <select
            value={horizon}
            onChange={(e) => setHorizon(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="6">6 meses</option>
            <option value="12">12 meses</option>
            <option value="18">18 meses</option>
          </select>
        </div>

        {/* Scenarios */}
        <div className="space-y-3">
          <Label>Escenarios</Label>
          {[
            { key: 'seasonality', label: 'Estacionalidad' },
            { key: 'promotions', label: 'Promociones' },
            { key: 'newStores', label: 'Nuevas Tiendas' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <span className="text-sm">{item.label}</span>
              <button
                role="switch"
                aria-checked={scenarios[item.key as keyof typeof scenarios]}
                onClick={() =>
                  setScenarios((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof scenarios],
                  }))
                }
                className={`relative h-5 w-9 rounded-full transition-colors ${
                  scenarios[item.key as keyof typeof scenarios] ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    scenarios[item.key as keyof typeof scenarios]
                      ? 'left-[18px]'
                      : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Confidence Level */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Nivel de Confianza</Label>
            <span className="text-sm font-medium">{confidence}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="99"
            value={confidence}
            onChange={(e) => setConfidence(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {/* Apply Button */}
        <Button className="w-full">Aplicar Parámetros</Button>
      </CardContent>
    </Card>
  );
}
