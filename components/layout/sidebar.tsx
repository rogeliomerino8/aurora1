'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Store,
  Package,
  AlertTriangle,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Centro de Mando', icon: LayoutGrid, href: '/dashboard' },
  { name: 'Tiendas', icon: Store, href: '/stores' },
  { name: 'Inventario', icon: Package, href: '/inventory' },
  { name: 'Incidentes', icon: AlertTriangle, href: '/incidents' },
  { name: 'Aurora Oracle', icon: Sparkles, href: '/oracle' },
  { name: 'Configuración', icon: Settings, href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, sidebarOpen, toggleSidebar, toggleSidebarOpen, setSidebarOpen } = useUIStore();

  useEffect(() => {
    // Inicializar estado del sidebar basado en el tamaño de pantalla
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      setSidebarOpen(false);
    }
    // En desktop, mantener el estado actual (abierto por defecto)
  }, [setSidebarOpen]);

  const handleLinkClick = () => {
    // Cerrar sidebar en mobile al hacer clic en un link
    if (window.innerWidth < 1024) {
      toggleSidebarOpen();
    }
  };

  return (
    <>
      {/* Overlay para mobile cuando el sidebar está abierto */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggleSidebarOpen}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300',
          sidebarCollapsed ? 'w-20' : 'w-[280px]',
          !sidebarOpen && '-translate-x-full lg:translate-x-0'
        )}
      >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className={cn(
          'flex h-16 items-center border-b border-sidebar-border px-4',
          sidebarCollapsed ? 'justify-center' : 'justify-between'
        )}>
          {!sidebarCollapsed && (
            <>
              <div className="flex items-center gap-2">
                <div className="flex h-24 w-24 items-center justify-center">
                  <Image
                    src="/logo.svg"
                    alt="Aurora Logo"
                    width={96}
                    height={96}
                    className="h-24 w-24"
                  />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="h-8 w-8"
                  aria-label="Colapsar sidebar"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebarOpen}
                  className="h-8 w-8 lg:hidden"
                  aria-label="Cerrar menú"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
          {sidebarCollapsed && (
            <div className="flex items-center justify-center w-full">
              <div className="flex h-16 w-16 items-center justify-center">
                <Image
                  src="/logo.svg"
                  alt="Aurora Logo"
                  width={64}
                  height={64}
                  className="h-16 w-16"
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  sidebarCollapsed && 'justify-center px-2'
                )}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-primary')} />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Botón de expandir cuando está colapsado */}
        {sidebarCollapsed && (
          <div className="p-3 border-t border-sidebar-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="w-full h-10 hover:bg-accent"
              aria-label="Expandir sidebar"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </aside>
    </>
  );
}
