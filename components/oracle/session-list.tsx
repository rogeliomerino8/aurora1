'use client';

import { Plus, Search, MessageSquare, Trash2 } from 'lucide-react';
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
  onDeleteSession?: (id: string) => void;
}

export function SessionList({ sessions, selectedId, onSelect, onNewSession, onDeleteSession }: SessionListProps) {
  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (onDeleteSession) {
      onDeleteSession(sessionId);
    }
  };

  return (
    <div className="flex h-full flex-col border-r">
      {/* Header */}
      <div className="border-b p-4 space-y-3">
        <Button onClick={onNewSession} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Conversación
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar en historial..." className="pl-9" />
        </div>
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={cn(
              'group relative w-full p-4 text-left transition-colors border-b hover:bg-accent cursor-pointer',
              selectedId === session.id && 'bg-accent'
            )}
            onClick={() => onSelect(session.id)}
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
              <button
                onClick={(e) => handleDelete(e, session.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive"
                aria-label="Eliminar conversación"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
