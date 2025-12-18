'use client';

import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, ArrowRight, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  actionLabel: string;
  onAction?: () => void;
  link?: string;
}

interface AlertCarouselProps {
  alerts: Alert[];
}

const severityStyles = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-blue-100 text-blue-800 border-blue-200',
};

const severityLabels = {
  critical: 'Crítico',
  high: 'Alto',
  medium: 'Medio',
  low: 'Bajo',
};

const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

export function AlertCarousel({ alerts }: AlertCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [confirmedAlerts, setConfirmedAlerts] = useState<Set<string>>(new Set());
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);

  // Filtrar alertas descartadas y ordenar por severidad
  const activeAlerts = alerts
    .filter(alert => !dismissedAlerts.has(alert.id))
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const totalAlerts = activeAlerts.length;

  // Ajustar índice si se descartan alertas
  useEffect(() => {
    if (currentIndex >= totalAlerts && totalAlerts > 0) {
      setCurrentIndex(totalAlerts - 1);
    }
  }, [totalAlerts, currentIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + totalAlerts) % totalAlerts);
  }, [totalAlerts]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % totalAlerts);
  }, [totalAlerts]);

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const handleAction = (alert: Alert) => {
    if (alert.onAction) {
      setShowConfirmation(alert.id);
    }
  };

  const handleConfirm = (alert: Alert) => {
    setConfirmedAlerts(prev => new Set([...prev, alert.id]));
    setShowConfirmation(null);
    alert.onAction?.();
    // Auto-dismiss after confirmation
    setTimeout(() => {
      handleDismiss(alert.id);
    }, 2000);
  };

  if (totalAlerts === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="flex items-center justify-center gap-2 p-6 text-green-700">
          <Check className="h-5 w-5" />
          <span>No hay alertas pendientes</span>
        </CardContent>
      </Card>
    );
  }

  const currentAlert = activeAlerts[currentIndex];

  if (!currentAlert) return null;

  const isConfirmed = confirmedAlerts.has(currentAlert.id);

  return (
    <Card className="border-l-4 border-l-destructive relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Acciones Requeridas
            <Badge variant="secondary" className="ml-1">
              {currentIndex + 1} / {totalAlerts}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className={severityStyles[currentAlert.severity]}>
              {severityLabels[currentAlert.severity]}
            </Badge>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => handleDismiss(currentAlert.id)}
              title="Descartar alerta"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isConfirmed ? (
          <div className="flex items-center justify-center gap-2 py-4 text-green-700">
            <Check className="h-5 w-5" />
            <span>Acción completada exitosamente</span>
          </div>
        ) : (
          <>
            <div className="min-h-[60px]">
              <h4 className="font-medium">{currentAlert.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {currentAlert.description}
              </p>
            </div>

            {showConfirmation === currentAlert.id ? (
              <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                <span className="flex-1 text-sm">¿Confirmar acción?</span>
                <Button size="sm" variant="ghost" onClick={() => setShowConfirmation(null)}>
                  <X className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={() => handleConfirm(currentAlert)}>
                  <Check className="h-4 w-4 mr-1" />
                  Confirmar
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleAction(currentAlert)} className="flex-1">
                  {currentAlert.actionLabel}
                </Button>
                {currentAlert.link && (
                  <Link href={currentAlert.link}>
                    <Button size="sm" variant="outline">
                      Ver Detalle
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </>
        )}

        {/* Navigation controls */}
        {totalAlerts > 1 && (
          <div className="flex items-center justify-center gap-1 pt-2 border-t">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Dot indicators */}
            <div className="flex items-center gap-1.5 px-2">
              {activeAlerts.map((alert, index) => (
                <button
                  key={alert.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-4 bg-primary'
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  title={alert.title}
                />
              ))}
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
