'use client';

import { useEffect } from 'react';
import {
  LayoutGrid,
  Package,
  AlertTriangle,
  Settings,
  Sparkles,
  Search
} from 'lucide-react';
import { useUIStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

const searchItems = [
  { name: 'Centro de Mando', icon: LayoutGrid, href: '/dashboard', keywords: ['dashboard', 'inicio', 'mando'] },
  { name: 'Inventario', icon: Package, href: '/inventory', keywords: ['productos', 'stock', 'sku'] },
  { name: 'Incidentes', icon: AlertTriangle, href: '/incidents', keywords: ['alertas', 'problemas', 'hurto'] },
  { name: 'Configuración', icon: Settings, href: '/settings', keywords: ['ajustes', 'integraciones'] },
  { name: 'Aurora Oracle', icon: Sparkles, href: '/oracle', keywords: ['chat', 'ia', 'predicciones'] },
];

export function SearchCommand() {
  const { searchOpen, setSearchOpen } = useUIStore();
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) return null;

  const handleNavigate = (href: string) => {
    router.push(href);
    setSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setSearchOpen(false)}
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/4 z-50 w-full max-w-lg -translate-x-1/2 rounded-xl border border-border bg-popover shadow-2xl">
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            className="flex-1 bg-transparent px-3 py-4 text-sm outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            ESC
          </kbd>
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Navegación
          </p>
          {searchItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-accent"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
