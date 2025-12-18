// === TIENDAS ===
export type StoreStatus = 'operational' | 'critical' | 'warning';

export interface Store {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: StoreStatus;
  operativity: number;
  address: string;
  manager: string;
}

// === INVENTARIO ===
export type SKUStatus = 'optimal' | 'low_stock' | 'stockout' | 'shrinkage_risk';

export interface SKU {
  id: string;
  name: string;
  image: string;
  category: string;
  currentStock: number;
  sales30d: number;
  forecastNext30d: number;
  status: SKUStatus;
  price: number;
  supplier: string;
}

export interface ForecastDataPoint {
  date: string;
  actual?: number;
  predicted: number;
  confidenceLow?: number;
  confidenceHigh?: number;
}

export interface StrategicForecast {
  month: string;
  predicted: number;
  confidenceLow: number;
  confidenceHigh: number;
  suggestedPurchase?: number;
  event?: string;
}

// === INCIDENTES ===
export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'open' | 'in_progress' | 'resolved' | 'escalated';
export type IncidentType = 'shrinkage' | 'theft' | 'anomaly' | 'stockout';

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  type: IncidentType;
  storeId: string;
  storeName: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  videoClipUrl?: string;
  cameraLocation?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'aurora';
  content: string;
  timestamp: string;
  attachments?: string[];
}

// === CONFIGURACION ===
export type IntegrationStatus = 'connected' | 'disconnected' | 'error';

export interface Integration {
  id: string;
  name: string;
  icon: string;
  status: IntegrationStatus;
  lastSync?: string;
  description: string;
}

// === ORACLE ===
export interface OracleSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface OracleMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  chart?: ChartData;
  table?: TableData;
}

export interface ChartData {
  type: 'line' | 'bar' | 'area';
  title: string;
  data: Array<Record<string, number | string>>;
  xKey: string;
  yKeys: string[];
}

export interface TableData {
  headers: string[];
  rows: Array<Record<string, string | number>>;
}

// === UI STATE ===
export interface UIState {
  sidebarCollapsed: boolean;
  selectedSKU: string | null;
  selectedIncident: string | null;
  activeSettingsTab: string;
  searchOpen: boolean;
  notificationsOpen: boolean;
}

// === NOTIFICACIONES ===
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success';
  read: boolean;
  createdAt: string;
  link?: string;
}
