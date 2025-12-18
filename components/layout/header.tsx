'use client';

import { Search, Bell, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { NotificationsPanel } from './notifications-panel';

export function Header() {
  const { sidebarCollapsed, sidebarOpen, searchOpen, setSearchOpen, notificationsOpen, setNotificationsOpen, toggleSidebarOpen } = useUIStore();

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-6 transition-all duration-300',
        !sidebarOpen && 'lg:left-0',
        sidebarOpen && (sidebarCollapsed ? 'lg:left-20' : 'lg:left-[280px]'),
        'left-0'
      )}
    >
      {/* Left side - Menu button and Search */}
      <div className="flex items-center gap-4">
        {/* Menu Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebarOpen}
          className="lg:hidden"
          aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar... (Cmd+K)"
            className="w-[300px] pl-9 bg-muted/50"
            onClick={() => setSearchOpen(true)}
            readOnly
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              3
            </span>
          </Button>
          {notificationsOpen && <NotificationsPanel />}
        </div>

        {/* User Avatar */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </div>
        </Button>
      </div>
    </header>
  );
}
