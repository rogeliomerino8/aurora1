import { create } from 'zustand';

interface UIState {
  sidebarCollapsed: boolean;
  sidebarOpen: boolean;
  selectedSKU: string | null;
  selectedIncident: string | null;
  activeSettingsTab: string;
  searchOpen: boolean;
  notificationsOpen: boolean;

  // Actions
  toggleSidebar: () => void;
  toggleSidebarOpen: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setSelectedSKU: (skuId: string | null) => void;
  setSelectedIncident: (incidentId: string | null) => void;
  setActiveSettingsTab: (tab: string) => void;
  setSearchOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  sidebarOpen: true,
  selectedSKU: null,
  selectedIncident: null,
  activeSettingsTab: 'general',
  searchOpen: false,
  notificationsOpen: false,

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleSidebarOpen: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSelectedSKU: (skuId) => set({ selectedSKU: skuId }),
  setSelectedIncident: (incidentId) => set({ selectedIncident: incidentId }),
  setActiveSettingsTab: (tab) => set({ activeSettingsTab: tab }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),
}));
