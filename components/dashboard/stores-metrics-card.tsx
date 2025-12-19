'use client';

import { useEffect, useState } from 'react';
import { Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StoresMetricsCardProps {
  percentage?: number;
  averageRevenue?: string;
}

export function StoresMetricsCard({
  percentage = 70,
  averageRevenue = '$240K',
}: StoresMetricsCardProps) {
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const getStatusColor = (value: number) => {
    if (value >= 70) return 'text-green-500';
    if (value >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const getStatusBg = (value: number) => {
    if (value >= 70) return 'stroke-green-500';
    if (value >= 50) return 'stroke-orange-500';
    return 'stroke-red-500';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (displayPercentage / 100) * circumference;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Store className="h-4 w-4" />
          Rendimiento de Tiendas
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="relative h-32 w-32">
          <svg className="h-32 w-32 -rotate-90 transform">
            <circle
              cx="64"
              cy="64"
              r="45"
              strokeWidth="10"
              fill="none"
              className="stroke-muted"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              strokeWidth="10"
              fill="none"
              className={cn('transition-all duration-1000 ease-out', getStatusBg(displayPercentage))}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('text-3xl font-bold transition-colors', getStatusColor(displayPercentage))}>
              {Math.round(displayPercentage)}%
            </span>
            <span className="text-xs text-muted-foreground">Óptimo</span>
          </div>
        </div>
        <div className="mt-6 w-full text-center">
          <p className="text-xs text-muted-foreground">Promedio por tienda</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{averageRevenue}</p>
        </div>
      </CardContent>
    </Card>
  );
}
