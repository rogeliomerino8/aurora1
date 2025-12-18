'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IntegrationCard, ConnectModal } from '@/components/settings';
import integrationsData from '@/data/integrations.json';
import type { Integration } from '@/types';

const integrations = integrationsData as Integration[];

const tabs = [
  { id: 'general', label: 'General' },
  { id: 'users', label: 'Usuarios' },
  { id: 'integrations', label: 'Integraciones' },
  { id: 'notifications', label: 'Notificaciones' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowConnectModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">Administra la configuración de la plataforma</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'general' && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Empresa</CardTitle>
                <CardDescription>Datos básicos de tu organización</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Nombre de la Empresa</Label>
                  <Input id="company" defaultValue="Retail Corp México" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email de Contacto</Label>
                  <Input id="email" type="email" defaultValue="admin@retailcorp.mx" />
                </div>
                <Button>Guardar Cambios</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferencias</CardTitle>
                <CardDescription>Configuraciones generales del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <select
                    id="timezone"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="America/Mexico_City">Ciudad de México (UTC-6)</option>
                    <option value="America/Tijuana">Tijuana (UTC-8)</option>
                    <option value="America/Cancun">Cancún (UTC-5)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <select
                    id="language"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <Button>Guardar Cambios</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>Administra los usuarios y permisos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                      CM
                    </div>
                    <div>
                      <p className="font-medium">Carlos Méndez</p>
                      <p className="text-sm text-muted-foreground">carlos@retailcorp.mx</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">Administrador</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-medium">
                      MG
                    </div>
                    <div>
                      <p className="font-medium">María González</p>
                      <p className="text-sm text-muted-foreground">maria@retailcorp.mx</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">Operador</span>
                </div>
                <Button>+ Agregar Usuario</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'integrations' && (
          <div className="grid gap-4 md:grid-cols-2">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onConnect={() => handleConnect(integration)}
                onConfigure={() => console.log('Configure:', integration.name)}
              />
            ))}
          </div>
        )}

        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
              <CardDescription>Configura cómo y cuándo recibir alertas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { label: 'Incidentes críticos', description: 'Alertas inmediatas para hurtos y eventos críticos' },
                  { label: 'Quiebre de stock', description: 'Notificaciones cuando un producto se agota' },
                  { label: 'Predicciones de IA', description: 'Sugerencias y alertas de Aurora Oracle' },
                  { label: 'Resumen diario', description: 'Email con resumen de actividad del día' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <button
                      className="relative h-6 w-11 rounded-full bg-primary transition-colors"
                      role="switch"
                    >
                      <span className="absolute left-[22px] top-0.5 h-5 w-5 rounded-full bg-white shadow" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Connect Modal */}
      <ConnectModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        integration={selectedIntegration}
      />
    </div>
  );
}
