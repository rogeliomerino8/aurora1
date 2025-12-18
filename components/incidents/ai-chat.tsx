'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types';

interface AIChatProps {
  incidentId: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'aurora',
    content: 'He analizado el incidente. Detecté actividad sospechosa en la cámara 12 del pasillo 3 a las 08:42. Una persona con mochila negra pasó más de 3 minutos frente al exhibidor de electrónicos.',
    timestamp: '2024-12-18T08:45:00Z',
  },
  {
    id: '2',
    sender: 'aurora',
    content: 'Basándome en el patrón de movimiento y el tiempo en la zona, asigné una probabilidad del 85% de hurto. El artículo posiblemente sustraído es un cargador inalámbrico (SKU-E042).',
    timestamp: '2024-12-18T08:45:30Z',
  },
];

const mockResponses = [
  'He revisado las cámaras adyacentes. El individuo entró por la entrada principal a las 08:35 y no realizó ninguna compra antes de este incidente.',
  'Comparé el perfil con nuestra base de datos de incidentes previos. No hay coincidencias exactas, pero el modus operandi es similar a 3 casos previos en la zona Santa Fe.',
  'Recomiendo revisar el inventario del exhibidor E-12 y comparar con las ventas registradas del día para confirmar la pérdida.',
];

export function AIChat({ incidentId }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'aurora',
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex h-[400px] flex-col rounded-lg border">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              message.sender === 'user' && 'flex-row-reverse'
            )}
          >
            <div
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                message.sender === 'aurora'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              {message.sender === 'aurora' ? (
                <Sparkles className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
            <div
              className={cn(
                'max-w-[80%] rounded-lg px-4 py-2',
                message.sender === 'aurora'
                  ? 'bg-muted'
                  : 'bg-primary text-primary-foreground'
              )}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="rounded-lg bg-muted px-4 py-2">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta a Aurora sobre este incidente..."
            className="min-h-[40px] resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
