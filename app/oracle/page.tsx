'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Send, Paperclip, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SessionList, ChatMessage, SuggestionChips } from '@/components/oracle';
import sessionsData from '@/data/oracle-sessions.json';
import type { OracleSession, OracleMessage, ChartData } from '@/types';

// Mock chart data for responses
const mockChartData: ChartData = {
  type: 'line',
  title: 'Proyección de Ventas Q1 2025',
  data: [
    { month: 'Ene', actual: 2100, predicted: 2150 },
    { month: 'Feb', actual: 1950, predicted: 2000 },
    { month: 'Mar', predicted: 2300 },
    { month: 'Abr', predicted: 2450 },
  ],
  xKey: 'month',
  yKeys: ['actual', 'predicted'],
};

const mockResponses = [
  {
    content: 'He analizado los datos históricos de los últimos 24 meses. Basándome en las tendencias de ventas, estacionalidad y eventos promocionales, proyecto un crecimiento del 8.5% para el Q1 2025.\n\nLos factores principales son:\n• Aumento estacional por temporada de reyes\n• Impacto positivo de nuevas tiendas\n• Tendencia al alza en categoría lácteos',
    hasChart: true,
  },
  {
    content: 'Simulé el escenario de aumento de precios del 5%. Los resultados muestran:\n\n• Caída estimada en volumen: 3.2%\n• Incremento en margen: 12.8%\n• Impacto neto en revenue: +4.1%\n\nLa elasticidad de precio varía por categoría. Bebidas muestran mayor sensibilidad que abarrotes.',
    hasChart: false,
  },
  {
    content: 'El análisis de estacionalidad revela patrones claros:\n\n• Pico principal: Diciembre (Navidad)\n• Pico secundario: Mayo (Día de la Madre)\n• Valle: Febrero\n• Crecimiento sostenido: Marzo-Abril\n\nRecomiendo ajustar inventario 3 semanas antes de cada pico.',
    hasChart: true,
  },
];

export default function OraclePage() {
  const [sessions, setSessions] = useState<OracleSession[]>(sessionsData as OracleSession[]);
  const [selectedSession, setSelectedSession] = useState<string | null>('session-001');
  const [messages, setMessages] = useState<OracleMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy Aurora Oracle, tu asistente de predicciones y análisis. ¿En qué puedo ayudarte hoy?\n\nPuedo ayudarte a:\n• Predecir ventas futuras\n• Simular escenarios de negocio\n• Analizar tendencias y patrones\n• Optimizar inventario',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: OracleMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const mockResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const aiMessage: OracleMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: mockResponse.content,
        timestamp: new Date().toISOString(),
        chart: mockResponse.hasChart ? mockChartData : undefined,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleNewSession = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: '¡Nueva sesión iniciada! ¿Qué te gustaría analizar hoy?',
        timestamp: new Date().toISOString(),
      },
    ]);
    setSelectedSession(null);
  };

  const handleDeleteSession = (sessionId: string) => {
    // Eliminar la sesión del estado
    setSessions((prevSessions) => prevSessions.filter((s) => s.id !== sessionId));

    // Si la sesión eliminada es la actualmente seleccionada, limpiar la selección
    if (selectedSession === sessionId) {
      setSelectedSession(null);
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: '¡Hola! Soy Aurora Oracle, tu asistente de predicciones y análisis. ¿En qué puedo ayudarte hoy?\n\nPuedo ayudarte a:\n• Predecir ventas futuras\n• Simular escenarios de negocio\n• Analizar tendencias y patrones\n• Optimizar inventario',
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-0 -m-6">
      {/* Session List */}
      <div className="w-[280px] shrink-0">
        <SessionList
          sessions={sessions}
          selectedId={selectedSession}
          onSelect={setSelectedSession}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 1 && (
            <div className="flex flex-col items-center justify-center gap-8 min-h-[60vh]">
              {/* Welcome Section */}
              <div className="flex flex-col items-center gap-4 text-center max-w-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center">
                    <Image
                      src="/clippahtgroup.svg"
                      alt="Aurora Oracle Logo"
                      width={40}
                      height={40}
                      className="h-10 w-10"
                    />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">Aurora Oracle</h2>
                </div>
                <p className="text-base text-muted-foreground">
                  Tu asistente de predicciones y análisis. ¿En qué puedo ayudarte hoy?
                </p>
              </div>

              {/* Suggestion Cards */}
              <SuggestionChips onSelect={handleSend} />
            </div>
          )}

          {messages.length > 1 && messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent">
                <img src="/clippahtgroup.svg" alt="Aurora Oracle" className="h-7 w-7" />
              </div>
              <div className="rounded-lg bg-muted px-4 py-3">
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
        <div className="border-t p-4 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl bg-muted/50 border border-border/50 p-4 space-y-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta a Aurora..."
                className="min-h-[100px] resize-none bg-background border-border/50 text-foreground placeholder:text-muted-foreground"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              
              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="gap-2 h-8">
                    <Paperclip className="h-4 w-4" />
                    <span className="hidden sm:inline text-xs">Adjuntar</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2 h-8">
                    <Sparkles className="h-4 w-4" />
                    <span className="hidden sm:inline text-xs">Pensamiento profundo</span>
                  </Button>
                </div>
                
                <Button
                  size="icon"
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="h-9 w-9 rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
