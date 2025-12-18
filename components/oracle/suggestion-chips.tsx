'use client';

import { TrendingUp, DollarSign, Calendar, Lightbulb, BarChart3, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuggestionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  prompt: string;
  onSelect: (prompt: string) => void;
}

const SuggestionCard = ({ icon: Icon, title, description, prompt, onSelect }: SuggestionCardProps) => {
  return (
    <button
      onClick={() => onSelect(prompt)}
      className={cn(
        'group relative flex flex-col items-start gap-4 rounded-3xl bg-muted/50 p-6',
        'transition-all duration-200 hover:bg-muted/70 hover:scale-[1.02]',
        'border border-border/50 hover:border-border',
        'text-left w-full h-full',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
      )}
    >
      {/* Icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
        <Icon className="h-6 w-6" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </button>
  );
};

interface SuggestionChipsProps {
  onSelect: (suggestion: string) => void;
}

const suggestions = [
  {
    icon: TrendingUp,
    title: 'Predecir Ventas',
    description: 'Analiza tendencias históricas y proyecta ventas futuras con modelos avanzados de predicción.',
    prompt: '¿Cuál es la predicción de ventas para el primer trimestre de 2025?',
  },
  {
    icon: DollarSign,
    title: 'Simular Escenarios',
    description: 'Evalúa el impacto de cambios en precios, inventario y estrategias de negocio.',
    prompt: 'Simula el impacto de un aumento de precios del 5% en las ventas',
  },
  {
    icon: Calendar,
    title: 'Análisis Estacional',
    description: 'Identifica patrones estacionales y optimiza la planificación de inventario y promociones.',
    prompt: 'Analiza los patrones de estacionalidad en las ventas del último año',
  },
];

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl mx-auto">
      {suggestions.map((suggestion, index) => (
        <SuggestionCard
          key={index}
          icon={suggestion.icon}
          title={suggestion.title}
          description={suggestion.description}
          prompt={suggestion.prompt}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
