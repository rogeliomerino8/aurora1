# PRD: Aurora Platform UI

## Información del Proyecto

| Campo | Valor |
|-------|-------|
| **Nombre** | Aurora Platform UI |
| **Versión** | 1.0.0 |
| **Stack** | Next.js 14 (App Router) + TypeScript + shadcn/ui + Tailwind CSS |
| **Alcance** | UI estática sin funcionalidad backend |
| **Fecha** | Diciembre 2024 |

---

## 1. Resumen Ejecutivo

Aurora es una plataforma de gestión retail que integra monitoreo de tiendas, control de inventario con predicciones IA, gestión de incidentes y un asistente conversacional (Oracle). Este PRD define la implementación del frontend UI-only usando Next.js y shadcn/ui.

### Objetivos
- Implementar todas las vistas del diseño con componentes reutilizables
- Crear una base sólida para futura integración con backend
- Mantener consistencia visual y UX según especificación
- Preparar estructura de datos mockeados con tipos TypeScript

---

## 3. Arquitectura de Carpetas

```
aurora-ui/
├── app/
│   ├── layout.tsx                 # Layout raíz con sidebar
│   ├── page.tsx                   # Redirect a /dashboard
│   ├── dashboard/
│   │   └── page.tsx               # Centro de Mando
│   ├── inventory/
│   │   └── page.tsx               # Inventario y Predicciones
│   ├── incidents/
│   │   ├── page.tsx               # Lista de incidentes
│   │   └── [id]/
│   │       └── page.tsx           # Detalle de incidente
│   ├── settings/
│   │   └── page.tsx               # Configuración (tabs)
│   └── oracle/
│       └── page.tsx               # Aurora Oracle Chat
│
├── components/
│   ├── ui/                        # shadcn components (auto-generated)
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── search-command.tsx     # Cmd+K search
│   │   └── notifications-panel.tsx
│   ├── dashboard/
│   │   ├── store-map.tsx
│   │   ├── kpi-card.tsx
│   │   ├── action-alert-card.tsx
│   │   └── network-status-card.tsx
│   ├── inventory/
│   │   ├── inventory-table.tsx
│   │   ├── sku-detail-panel.tsx
│   │   ├── forecast-chart.tsx
│   │   ├── strategic-view.tsx
│   │   └── new-order-modal.tsx
│   ├── incidents/
│   │   ├── incident-list.tsx
│   │   ├── incident-detail.tsx
│   │   ├── ai-chat.tsx
│   │   ├── video-player.tsx
│   │   └── context-panel.tsx
│   ├── settings/
│   │   ├── settings-tabs.tsx
│   │   ├── integration-card.tsx
│   │   └── connect-modal.tsx
│   └── oracle/
│       ├── session-list.tsx
│       ├── chat-feed.tsx
│       ├── chat-message.tsx
│       ├── embedded-chart.tsx
│       ├── parameter-panel.tsx
│       └── suggestion-chips.tsx
│
├── lib/
│   ├── utils.ts                   # cn() y utilidades
│   └── store.ts                   # Zustand store
│
├── data/
│   ├── stores.json                # Datos mock tiendas
│   ├── inventory.json             # Datos mock inventario
│   ├── incidents.json             # Datos mock incidentes
│   ├── integrations.json          # Datos mock integraciones
│   └── oracle-sessions.json       # Datos mock sesiones Oracle
│
├── types/
│   └── index.ts                   # Tipos TypeScript
│
├── hooks/
│   ├── use-sidebar.ts
│   ├── use-search.ts
│   └── use-notifications.ts
│
└── styles/
    └── globals.css                # Tailwind + custom vars
```

---

## 4. Definición de Tipos (TypeScript)

```typescript
// types/index.ts

// === TIENDAS ===
export type StoreStatus = 'operational' | 'critical' | 'warning';

export interface Store {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: StoreStatus;
  operativity: number; // 0-100
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
  event?: string; // "Navidad", "Hot Sale", etc.
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

// === CONFIGURACIÓN ===
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
```

---

## 5. Especificación por Módulo

### 5.1 Layout Global (Shell)

#### Componentes
| Componente | Descripción | shadcn components |
|------------|-------------|-------------------|
| `Sidebar` | Navegación lateral colapsable | Sheet, Button, Avatar |
| `Header` | Barra superior con búsqueda | Input, Button, Popover |
| `SearchCommand` | Modal Cmd+K | Command (cmdk) |
| `NotificationsPanel` | Panel de alertas | Popover, ScrollArea |

#### Comportamiento UI
- Sidebar: 280px expandido, 80px colapsado
- Items activos: `bg-purple-100 text-purple-900`
- Mobile: Sidebar como Sheet (drawer)
- Search: `Cmd+K` abre CommandDialog

#### Rutas de Navegación
| Item | Icono | Ruta |
|------|-------|------|
| Centro de Mando | `LayoutGrid` | `/dashboard` |
| Inventario | `Package` | `/inventory` |
| Incidentes | `AlertTriangle` | `/incidents` |
| Configuración | `Settings` | `/settings` |
| Aurora Oracle | `Sparkles` | `/oracle` |

---

### 5.2 Centro de Mando (Dashboard)

**Ruta:** `/dashboard`

#### Layout
```
┌─────────────────────────────────────────────────┐
│                    Header                        │
├──────────────────────────┬──────────────────────┤
│                          │   Network Status     │
│                          ├──────────────────────┤
│       Store Map          │   Action Alert       │
│       (Leaflet)          ├──────────────────────┤
│                          │   Total Sales        │
│                          ├──────────────────────┤
│                          │   Shrinkage Level    │
└──────────────────────────┴──────────────────────┘
```

#### Componentes

**StoreMap**
- Librería: `react-leaflet`
- Markers: Círculos de color según status
- Tooltip en hover: nombre + operatividad
- Click en marker rojo: console.log (preparado para navegación)
- Leyenda inferior con estados

**KPICard**
- Props: `title`, `value`, `trend`, `icon`
- Variantes: default, success, warning, danger

**ActionAlertCard**
- Muestra alerta prioritaria mock
- Botones: "Aprobar Transferencia", "Ver Incidente"
- Click abre modal de confirmación (UI only)

**NetworkStatusCard**
- Porcentaje grande animado (contador)
- Indicador visual circular/semicircular

#### Datos Mock (stores.json)
```json
[
  {
    "id": "store-001",
    "name": "Tienda Polanco",
    "latitude": 19.4326,
    "longitude": -99.1332,
    "status": "operational",
    "operativity": 98,
    "address": "Av. Presidente Masaryk 123",
    "manager": "Carlos Ruiz"
  },
  {
    "id": "store-002",
    "name": "Tienda Santa Fe",
    "latitude": 19.3590,
    "longitude": -99.2622,
    "status": "critical",
    "operativity": 72,
    "address": "Centro Comercial Santa Fe",
    "manager": "Ana López"
  }
  // ... 8-10 tiendas más
]
```

---

### 5.3 Inventario y Predicciones

**Ruta:** `/inventory`

#### Layout
```
┌─────────────────────────────────────────────────┐
│  Search    [Filters]    [+ Nuevo Pedido]        │
│            [Vista: Operativa | Estratégica]     │
├────────────────────────────┬────────────────────┤
│                            │                    │
│     Inventory Table        │   SKU Detail       │
│     (DataTable)            │   Panel            │
│                            │                    │
│                            │   - Tabs           │
│                            │   - Chart          │
│                            │   - AI Alert       │
│                            │                    │
└────────────────────────────┴────────────────────┘
```

#### Componentes

**InventoryTable**
- shadcn: `Table`, `Badge`
- Columnas: SKU (img+name), Stock, Ventas 30D, Pronóstico, Estado
- Row clickeable → actualiza panel lateral
- Sorting por columnas

**SKUDetailPanel**
- Tabs: "Corto Plazo" | "Largo Plazo"
- **Corto Plazo:**
  - Gráfica líneas (Recharts): stock real vs predicción
  - Card de alerta IA con sugerencia
  - Botón "Crear Pedido Sugerido"
- **Largo Plazo:**
  - Selector horizonte: 6/12/18 meses
  - Checkboxes escenarios: Estacionalidad, Promociones, Nuevas tiendas
  - Gráfica con intervalo confianza (área sombreada)
  - Tabla de compras sugeridas por mes

**ForecastChart**
- Recharts `ComposedChart`
- Línea sólida: datos reales
- Línea punteada: predicción
- Área sombreada: intervalo confianza

**NewOrderModal**
- shadcn: `Dialog`, `Select`, `Input`, `Button`
- Campos: SKU, Cantidad, Proveedor
- Versión "inteligente": pre-llenado desde alerta IA

#### Datos Mock (inventory.json)
```json
[
  {
    "id": "sku-001",
    "name": "Leche Entera 1L",
    "image": "/products/milk.jpg",
    "category": "Lácteos",
    "currentStock": 145,
    "sales30d": 892,
    "forecastNext30d": 920,
    "status": "shrinkage_risk",
    "price": 28.50,
    "supplier": "Lala"
  }
  // ... más SKUs
]
```

---

### 5.4 Gestión de Incidentes

**Ruta:** `/incidents` y `/incidents/[id]`

#### Layout Lista
```
┌─────────────────────────────────────────────────┐
│  [Mis Incidentes] [Todos]      Search           │
├─────────────────┬───────────────────────────────┤
│                 │                               │
│  Incident       │      Incident Detail          │
│  List           │      (Selected)               │
│                 │                               │
│  - Card 1       │      - Header + Actions       │
│  - Card 2       │      - AI Chat                │
│  - Card 3       │      - Video Player           │
│  - ...          │      - Context Panel          │
│                 │                               │
└─────────────────┴───────────────────────────────┘
```

#### Componentes

**IncidentList**
- Lista de cards scrolleable
- Cada card: título, badge severidad, asignado, tiempo
- Filtros: "Mis Incidentes" | "Todos"
- Ordenamiento: severidad > fecha

**IncidentDetail**
- Header: título, badges de estado
- Botones: "Asignar", "Resolver", "Escalar"

**AIChat**
- Estilo conversacional (burbujas)
- Mensajes de Aurora (izq) y usuario (der)
- Input con botón enviar
- Indicador "Aurora está escribiendo..."

**VideoPlayer**
- Reproductor HTML5 básico
- Metadata: cámara, fecha/hora
- Controles: play/pause, repetir

**ContextPanel**
- Mini sparklines justificando la alerta
- Datos relacionados del incidente

#### Modales
- **ResolveModal**: Motivo (select) + comentarios
- **EscalateDropdown**: Lista de roles superiores

---

### 5.5 Configuración

**Ruta:** `/settings`

#### Layout
```
┌─────────────────────────────────────────────────┐
│  [General] [Usuarios] [Integraciones] [Notif.]  │
├─────────────────────────────────────────────────┤
│                                                 │
│            Tab Content                          │
│                                                 │
│  (Grid de IntegrationCards para tab Integ.)    │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### Componentes

**SettingsTabs**
- shadcn: `Tabs`
- 4 tabs según spec

**IntegrationCard**
- Estados visuales: conectado (borde verde), desconectado (gris)
- Info: nombre, icono, última sync
- Botones: "Conectar" o "Configurar"
- Switch activo/inactivo

**ConnectModal**
- Formulario dinámico según integración
- Campos: API Key, URL, etc.
- Botón "Test Connection" (simula loading)

#### Datos Mock (integrations.json)
```json
[
  {
    "id": "oracle",
    "name": "Oracle ERP",
    "icon": "database",
    "status": "connected",
    "lastSync": "2024-12-18T10:30:00Z",
    "description": "Sistema de planificación empresarial"
  },
  {
    "id": "shopify",
    "name": "Shopify",
    "icon": "shopping-bag",
    "status": "disconnected",
    "description": "Plataforma de e-commerce"
  }
]
```

---

### 5.6 Aurora Oracle (Chat Predictivo)

**Ruta:** `/oracle`

#### Layout (3 columnas)
```
┌────────────┬─────────────────────────┬────────────┐
│            │                         │            │
│  Session   │      Chat Feed          │ Parameter  │
│  History   │                         │   Panel    │
│            │  - Messages             │            │
│  + Nueva   │  - Embedded Charts      │  Sliders   │
│            │  - Tables               │  Selects   │
│  - Ses 1   │                         │            │
│  - Ses 2   │                         │            │
│            ├─────────────────────────┤            │
│            │  [Input] [Attach] [Send]│            │
└────────────┴─────────────────────────┴────────────┘
```

#### Componentes

**SessionList**
- Botón "+ Nueva Simulación"
- Lista de sesiones pasadas
- Buscador de historial
- Click carga sesión en chat

**ChatFeed**
- Scroll infinito
- Renderiza `ChatMessage` por cada mensaje

**ChatMessage**
- Variante user: derecha, fondo morado claro
- Variante assistant: izquierda, con icono estrella
- Puede contener:
  - Texto markdown
  - `EmbeddedChart`
  - `EmbeddedTable`

**EmbeddedChart**
- Recharts dentro del mensaje
- Interactivo: hover muestra tooltip
- Botón "Aplicar a Pronóstico"

**ParameterPanel**
- Sliders: shadcn `Slider`
- Selects para horizonte temporal
- Cambios actualizan gráfica visible (estado local)

**SuggestionChips**
- Aparecen en chat vacío
- 3 sugerencias: "Predecir ventas Q1", "Simular aumento precios", etc.

**ChatInput**
- Textarea multilinea
- Botón adjuntar (icono clip)
- Botón enviar (icono send)

#### Flujo UI (sin backend)
1. Usuario escribe mensaje
2. Mensaje aparece en chat (derecha)
3. Indicador "Aurora está analizando..." (1-2 seg delay)
4. Mensaje de Aurora aparece con respuesta mock + gráfica si aplica

#### Datos Mock
```json
// oracle-sessions.json
[
  {
    "id": "session-001",
    "title": "Análisis Q4 2024",
    "createdAt": "2024-12-15T09:00:00Z",
    "updatedAt": "2024-12-15T09:45:00Z",
    "messageCount": 12
  }
]

// Mensajes pre-cargados para demo
```

---

## 6. Paleta de Colores y Diseño

### Colores Base (CSS Variables)
```css
:root {
  /* Primarios - Púrpura */
  --primary: 262 83% 58%;        /* #7C3AED */
  --primary-foreground: 0 0% 100%;
  
  /* Estados */
  --success: 142 76% 36%;        /* Verde */
  --warning: 38 92% 50%;         /* Amarillo/Naranja */
  --danger: 0 84% 60%;           /* Rojo */
  
  /* Neutros */
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
  
  /* Bordes y cards */
  --border: 214 32% 91%;
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
}
```

### Badges de Estado
| Estado | Color | Clase Tailwind |
|--------|-------|----------------|
| Óptimo | Verde | `bg-green-100 text-green-800` |
| Bajo Stock | Naranja | `bg-orange-100 text-orange-800` |
| Quiebre | Rojo | `bg-red-100 text-red-800` |
| Riesgo Merma | Amarillo | `bg-yellow-100 text-yellow-800` |
| Crítico | Rojo oscuro | `bg-red-600 text-white` |

### Tipografía
- Font: Inter (Google Fonts)
- Headings: `font-semibold`
- Body: `font-normal`
- Small/Labels: `text-sm text-muted-foreground`

---

## 7. Componentes shadcn/ui Requeridos

```bash
# Instalación de componentes necesarios
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add checkbox
npx shadcn@latest add command
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add popover
npx shadcn@latest add scroll-area
npx shadcn@latest add select
npx shadcn@latest add separator
npx shadcn@latest add sheet
npx shadcn@latest add skeleton
npx shadcn@latest add slider
npx shadcn@latest add switch
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add textarea
npx shadcn@latest add toast
npx shadcn@latest add tooltip
```

---

## 8. Dependencias Adicionales

```json
{
  "dependencies": {
    "recharts": "^2.10.0",
    "react-leaflet": "^4.2.1",
    "leaflet": "^1.9.4",
    "zustand": "^4.4.0",
    "date-fns": "^2.30.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.0"
  }
}
```

---

## 9. Estimación de Esfuerzo

| Módulo | Componentes | Estimación |
|--------|-------------|------------|
| Setup inicial + Layout | 4 | 4-6 horas |
| Dashboard | 5 | 6-8 horas |
| Inventario | 7 | 8-10 horas |
| Incidentes | 6 | 6-8 horas |
| Configuración | 4 | 4-5 horas |
| Aurora Oracle | 8 | 10-12 horas |
| Datos mock + tipos | - | 3-4 horas |
| Testing visual + ajustes | - | 4-6 horas |
| **Total** | **34** | **45-59 horas** |

---

## 10. Criterios de Aceptación

### Funcionalidad UI
- [ ] Navegación entre todas las rutas funciona
- [ ] Sidebar colapsa/expande correctamente
- [ ] Búsqueda Cmd+K abre y muestra resultados mock
- [ ] Todas las tablas muestran datos mock
- [ ] Gráficas renderizan con datos de ejemplo
- [ ] Mapa muestra markers con tooltips
- [ ] Modales abren/cierran correctamente
- [ ] Tabs y switches funcionan
- [ ] Oracle chat simula respuestas

### Visual
- [ ] Consistencia con paleta de colores definida
- [ ] Badges muestran colores correctos por estado
- [ ] Responsive básico funciona (sidebar colapsa en mobile)
- [ ] Loading states implementados (skeletons)
- [ ] Hover/active states en elementos interactivos

### Código
- [ ] Tipos TypeScript sin errores
- [ ] Componentes reutilizables y documentados
- [ ] Estructura de carpetas según PRD
- [ ] Sin warnings en consola

---

## 11. Notas de Implementación

### Preparación para Backend
- Todos los datos mock están en `/data/*.json`
- Los tipos en `/types/index.ts` reflejan la estructura esperada de API
- Los componentes reciben props tipadas, no hardcodean datos
- Hooks preparados para reemplazar con fetching real

### Consideraciones UX
- Usar `skeleton` de shadcn para loading states
- Animaciones sutiles con Tailwind (`transition-all duration-200`)
- Feedback visual en todas las acciones (hover, active, disabled)
- Toast notifications para acciones completadas

### Mobile
- Sidebar: usar `Sheet` de shadcn como drawer
- Tablas: scroll horizontal en mobile
- Paneles laterales: stack vertical en mobile
- Touch targets mínimo 44px

---

## 12. Entregables

1. **Repositorio Git** con código fuente completo
2. **README.md** con instrucciones de instalación y desarrollo
3. **Archivos de datos mock** listos para reemplazar por API
4. **Componentes documentados** con props y ejemplos
5. **Build de producción** funcionando (`npm run build`)

---

## Apéndice A: Comandos de Setup

```bash
# Crear proyecto
npx create-next-app@latest aurora-ui --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Inicializar shadcn
npx shadcn@latest init

# Instalar dependencias
npm install recharts react-leaflet leaflet zustand date-fns
npm install -D @types/leaflet

# Instalar componentes shadcn (ver sección 7)
```

---

## Apéndice B: Estructura de API Futura (Referencia)

Aunque no se implementará backend, estos serían los endpoints esperados:

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/stores` | GET | Lista de tiendas con status |
| `/api/inventory` | GET | Lista de SKUs |
| `/api/inventory/:id` | GET | Detalle SKU con forecast |
| `/api/incidents` | GET | Lista de incidentes |
| `/api/incidents/:id` | GET | Detalle incidente |
| `/api/integrations` | GET | Lista integraciones |
| `/api/oracle/sessions` | GET | Sesiones de chat |
| `/api/oracle/chat` | POST | Enviar mensaje a Oracle |