'use client';

import { Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmbeddedChart } from './embedded-chart';
import type { OracleMessage } from '@/types';

interface ChatMessageProps {
  message: OracleMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={cn('flex gap-3', !isAssistant && 'flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isAssistant ? 'bg-transparent' : 'bg-muted'
        )}
      >
        {isAssistant ? (
          <img src="/clippahtgroup.svg" alt="Aurora Oracle" className="h-7 w-7" />
        ) : (
          <User className="h-4 w-4" />
        )}
      </div>

      {/* Content */}
      <div className={cn('max-w-[75%] space-y-2', !isAssistant && 'items-end')}>
        <div
          className={cn(
            'rounded-lg px-4 py-3',
            isAssistant ? 'bg-muted' : 'bg-primary text-primary-foreground'
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Embedded Chart */}
        {message.chart && <EmbeddedChart data={message.chart} />}

        {/* Embedded Table */}
        {message.table && (
          <div className="mt-3 overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  {message.table.headers.map((header, i) => (
                    <th key={i} className="px-4 py-2 text-left font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {message.table.rows.map((row, i) => (
                  <tr key={i} className="border-t">
                    {message.table!.headers.map((header, j) => (
                      <td key={j} className="px-4 py-2">
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
