'use client';

import { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Integration } from '@/types';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: Integration | null;
}

export function ConnectModal({ isOpen, onClose, integration }: ConnectModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [url, setUrl] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  if (!isOpen || !integration) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsTesting(false);
    setTestSuccess(true);
  };

  const handleConnect = () => {
    console.log('Connected:', { integration: integration.name, apiKey, url });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-background p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-1">Conectar {integration.name}</h2>
        <p className="text-sm text-muted-foreground mb-6">{integration.description}</p>

        <form className="space-y-4">
          {/* API Key */}
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-xxxxxxxxxxxxxxxx"
            />
          </div>

          {/* URL (optional) */}
          <div className="space-y-2">
            <Label htmlFor="url">URL del Servidor (opcional)</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com"
            />
          </div>

          {/* Test Result */}
          {testSuccess && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700">
              <Check className="h-4 w-4" />
              <span className="text-sm">Conexión exitosa</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={!apiKey || isTesting}
              className="flex-1"
            >
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Probando...
                </>
              ) : (
                'Probar Conexión'
              )}
            </Button>
            <Button
              type="button"
              onClick={handleConnect}
              disabled={!testSuccess}
              className="flex-1"
            >
              Conectar
            </Button>
          </div>

          <Button type="button" variant="ghost" onClick={onClose} className="w-full">
            Cancelar
          </Button>
        </form>
      </div>
    </div>
  );
}
