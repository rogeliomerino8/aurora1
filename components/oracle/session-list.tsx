'use client';

import { Plus, Search, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { OracleSession } from '@/types';

interface SessionListProps {
  sessions: OracleSession[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNewSession: () => void;
}

export function SessionList({ sessions, selectedId, onSelect, onNewSession }: SessionListProps) {
  return (
    <div className="flex h-full flex-col border-r">
      {/* Header */}
      <div className="border-b p-4 space-y-3">
        <Button onClick={onNewSession} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Simulación
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar en historial..." className="pl-9" />
        </div>
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelect(session.id)}
            className={cn(
              'w-full p-4 text-left transition-colors border-b hover:bg-accent',
              selectedId === session.id && 'bg-accent'
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{session.title}</p>
                <p className="text-xs text-muted-foreground">
                  {session.messageCount} mensajes •{' '}
                  {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true, locale: es })}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
