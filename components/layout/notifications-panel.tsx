'use client';

import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/lib/store';
import notificationsData from '@/data/notifications.json';
import type { Notification } from '@/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const notifications = notificationsData as Notification[];

const iconMap = {
  alert: AlertTriangle,
  info: Info,
  success: CheckCircle,
};

const colorMap = {
  alert: 'text-destructive bg-destructive/10',
  info: 'text-blue-500 bg-blue-500/10',
  success: 'text-green-500 bg-green-500/10',
};

export function NotificationsPanel() {
  const { setNotificationsOpen } = useUIStore();

  return (
    <div className="absolute right-0 top-full mt-2 w-[380px] rounded-lg border border-border bg-popover shadow-lg">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="font-semibold">Notificaciones</h3>
        <Button variant="ghost" size="icon" onClick={() => setNotificationsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.map((notification) => {
          const Icon = iconMap[notification.type];
          return (
            <Link
              key={notification.id}
              href={notification.link || '#'}
              onClick={() => setNotificationsOpen(false)}
              className={cn(
                'flex gap-3 border-b border-border p-4 transition-colors hover:bg-accent',
                !notification.read && 'bg-accent/50'
              )}
            >
              <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', colorMap[notification.type])}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(notification.createdAt).toLocaleString('es-MX', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {!notification.read && (
                <div className="h-2 w-2 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
      <div className="border-t border-border p-2">
        <Button variant="ghost" className="w-full text-sm text-muted-foreground">
          Ver todas las notificaciones
        </Button>
      </div>
    </div>
  );
}
