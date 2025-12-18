'use client';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { SearchCommand } from './search-command';
import { useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { sidebarCollapsed, sidebarOpen } = useUIStore();

  return (
    <>
      <Sidebar />
      <Header />
      <SearchCommand />
      <main
        className={cn(
          'min-h-screen pt-16 transition-all duration-300',
          !sidebarOpen && 'lg:pl-0',
          sidebarOpen && (sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-[280px]')
        )}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </>
  );
}
