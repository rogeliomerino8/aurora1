'use client';

import { useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <main
      className={cn(
        'min-h-screen pt-16 transition-all duration-300',
        sidebarCollapsed ? 'pl-20' : 'pl-[280px]'
      )}
    >
      <div className="p-6">
        {children}
      </div>
    </main>
  );
}
