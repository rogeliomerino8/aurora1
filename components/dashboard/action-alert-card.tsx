'use client';

import { useState } from 'react';
import { AlertTriangle, ArrowRight, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface ActionAlertCardProps {
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  actionLabel: string;
  onAction?: () => void;
  link?: string;
}

const severityStyles = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-blue-100 text-blue-800 border-blue-200',
};

export function ActionAlertCard({
  title,
  description,
  severity,
  actionLabel,
  onAction,
  link,
}: ActionAlertCardProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleAction = () => {
    if (onAction) {
      setShowConfirmation(true);
    }
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setShowConfirmation(false);
    onAction?.();
  };

  if (confirmed) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="flex items-center justify-center gap-2 p-6 text-green-700">
          <Check className="h-5 w-5" />
          <span>Acción completada exitosamente</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-destructive">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Acción Requerida
          </CardTitle>
          <Badge variant="outline" className={severityStyles[severity]}>
            {severity === 'critical' ? 'Crítico' : severity === 'high' ? 'Alto' : severity === 'medium' ? 'Medio' : 'Bajo'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {showConfirmation ? (
          <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
            <span className="flex-1 text-sm">¿Confirmar acción?</span>
            <Button size="sm" variant="ghost" onClick={() => setShowConfirmation(false)}>
              <X className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={handleConfirm}>
              <Check className="h-4 w-4 mr-1" />
              Confirmar
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAction} className="flex-1">
              {actionLabel}
            </Button>
            {link && (
              <Link href={link}>
                <Button size="sm" variant="outline">
                  Ver Detalle
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
