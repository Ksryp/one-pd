# schema.md — SNK MES Dashboard

Reference document for component APIs, data shapes, routing, and design tokens.

---

## 1. Project Overview

| Item | Value |
|---|---|
| Name | SNK MES Dashboard (one-pd) |
| Purpose | Manufacturing Execution System for SNK Ceramics factory |
| Users | Production Manager, MD, C-Level |
| Bundler | Vite |
| UI | React 18 + JSX |
| Routing | React Router v6 (`createBrowserRouter`) |
| Styling | Tailwind CSS + CSS Variables |
| Charts | Recharts (PieChart, ComposedChart) |
| State | React Context + useState |
| Backend | FastAPI + PostgreSQL (`snk_mes`) + TimescaleDB (`mqtt_data`) |

---

## 2. Folder Structure

```
src/
├── App.jsx                          ← Router definition, all routes
├── main.jsx                         ← React root, DashboardProvider wrap
├── index.css                        ← CSS variables (light/dark), global resets
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx            ← Sidebar + Main + RightPanel shell
│   │   ├── RightPanel.jsx           ← Notification drawer (mobile: FAB, desktop: panel)
│   │   └── Sidebar.jsx              ← Nav + dark mode toggle (CSS-in-JS — do not edit styles)
│   │
│   ├── pipeline/
│   │   ├── ProductionPipeline.jsx   ← Renders 6 StageCards in a row
│   │   └── StageCard.jsx            ← Single stage card with status + hover CTA
│   │
│   ├── overview/
│   │   ├── OverviewStrip.jsx        ← Container for 4 KPI cards
│   │   ├── OEECard.jsx              ← OEE donut + timeline slider
│   │   ├── TaktCycleCard.jsx        ← Takt vs Cycle time
│   │   ├── WIPCard.jsx              ← WIP count + progress bar
│   │   └── MTTRCard.jsx             ← MTTR minutes + vs target
│   │
│   ├── parameter-defect/
│   │   ├── ParameterDefectCard.jsx  ← Section wrapper: FilterBar + chart + AIBar + InsightPanel
│   │   ├── FilterBar.jsx            ← Parameter/Defect/Model/View/Date/Refresh dropdowns
│   │   ├── DualAxisChart.jsx        ← ComposedChart: param lines (left Y) + defect bars (right Y)
│   │   ├── InsightPanel.jsx         ← 4 insight cards: top defects, defect rate, by category, param at peak
│   │   └── AIBar.jsx                ← AI insight strip with model/interval/confidence selectors
│   │
│   ├── notification/
│   │   ├── NotificationPanel.jsx    ← Alert feed in RightPanel
│   │   └── AlertCard.jsx            ← Single alert row with level badge
│   │
│   ├── yield/
│   │   └── YieldDonut.jsx           ← Reusable donut: Clay Yield + Firing Yield
│   │
│   └── overview/ (metrics)
│       └── ProductionMetrics.jsx    ← Slip In / Slip Yield / Warehouse In
│
├── pages/
│   ├── Dashboard.jsx                ← Main page: pipeline + overview + param-defect + yield
│   ├── StageDetail.jsx              ← Dynamic stage detail (stageId from URL param)
│   ├── Alerts.jsx                   ← Alert list with stage filter + resolve action
│   ├── Reports.jsx                  ← Parameter-Defect chart + FilterBar (no InsightPanel)
│   ├── Settings.jsx                 ← User profile + threshold config UI
│   ├── ManualKeyIn.jsx              ← Manual parameter data entry
│   └── details/
│       ├── OEEDetails.jsx
│       ├── TaktCycleDetails.jsx
│       ├── WIPDetails.jsx
│       └── MTTRDetails.jsx
│
├── context/
│   └── DashboardContext.jsx         ← Global state provider (see §6)
│
├── hooks/
│   ├── useParameterDefect.js        ← Fetches /api/defects/chart + /insights, auto-refresh
│   ├── usePipeline.js               ← Fetches /pipeline
│   ├── useOverview.js               ← Fetches /overview
│   ├── useYield.js                  ← Fetches /yield
│   ├── useMetrics.js                ← Fetches /metrics
│   ├── useNotifications.js          ← Fetches /notifications
│   ├── useMachineData.js            ← Fetches /latest + /timeseries (TSDB)
│   └── useLive.js                   ← WebSocket /ws/live for real-time alerts
│
├── data/
│   ├── mock.js                      ← Static fallback data (see §3)
│   └── parameterDefectSort.js       ← Sort helpers for parameter-defect chart
│
├── services/
│   └── api.js                       ← Thin fetch wrapper: api.get(path), api.patch(path, body)
│
└── constants/
    └── status.js                    ← ALERT_CARD_STYLES level→style map
```

---

## 3. Data Schema — mock.js

### pipeline `Array<StageItem>`
```js
{
  id:        string,   // "slip-prep" | "glaze-prep" | "casting" | "drying" | "spraying" | "firing"
  label:     string,   // "SLIP PREP" etc.
  status:    string,   // "EMERGENCY" | "ABNORMAL" | "NORMAL" | "MAINTENANCE"
  timestamp: string,   // "DD/MM/YY HH:MM"
}
```

### overview `Object`
```js
{
  oee: {
    value:        number,          // 0–100 overall OEE %
    availability: number,
    performance:  number,
    quality:      number,
    timeStart:    string,          // "HH:MM"
    timeEnd:      string,
    timeline:     Array<{ time: string, status: string }>,
  },
  takt: {
    taktTime:  number,  // seconds/pcs
    cycleTime: number,
    unit:      string,  // "s/pcs"
  },
  wip: {
    value:    number,
    max:      number,
    hotStage: string,  // stage id
  },
  mttr: {
    value:     number,  // minutes
    target:    number,
    incidents: number,
    unit:      string,
  },
}
```

### parameterDefect `Object`
```js
{
  timeseries: Array<{
    hour:            string,   // "HH:MM"
    viscosity:       number,
    temperature:     number,
    moisture:        number,
    defect:          number,
    overViscosity:   boolean,
    overTemperature: boolean,
    overMoisture:    boolean,
  }>,
  ucl: { viscosity: number, temperature: number, moisture: number },
  lcl: { viscosity: number, temperature: number, moisture: number },
  insights: {
    peakDefectHour:  string,
    paramAtPeak:     string,
    correlation:     string,
    totalDefect:     number,
    aiInsight:       { text: string, confidence: number },
  },
}
```

### yield `Object`
```js
{
  clay: {
    value_total: number,   // % (Good+RF)/Total
    value_once:  number,   // % Good/Total
    segments: Array<{ label: "Good"|"Repair"|"Scrap", value: number, color: string }>,
    target:      number,
  },
  firing: { /* same shape as clay */ },
}
```

### metrics `Object`
```js
{
  slipIn:      { value: number, unit: string, change: number },
  slipYield:   { value: number, unit: string, change: number },
  warehouseIn: { value: number, unit: string, change: number },
}
```

### notifications `Array<Alert>`
```js
{
  id:        number,
  title:     string,
  level:     "EMERGENCY" | "ABNORMAL" | "NORMAL" | "MAINTENANCE",
  message:   string,
  timestamp: string,
  resolved:  boolean,
  stage:     string,  // stage id
}
```

---

## 4. Component API

### `<StageCard>`
```jsx
<StageCard
  id="casting"           // string — used for navigate('/stage/:id')
  label="CASTING"        // string — display name
  status="ABNORMAL"      // "EMERGENCY"|"ABNORMAL"|"NORMAL"|"MAINTENANCE"
  timestamp="18/05/69 15:42"  // string — last update time
/>
```

### `<YieldDonut>`
```jsx
<YieldDonut
  title="CLAY YIELD"     // string — card header
  value_total={86}       // number — % yield (Good+RF)/Total
  value_once={74}        // number — % yield Good/Total
  segments={[
    { label: "Good",   value: 10234, color: "#16A34A" },
    { label: "Repair", value: 623,   color: "#D97706" },
    { label: "Scrap",  value: 748,   color: "#DC2626" },
  ]}
  target={90}            // number — target % for colour indicator
  headerAction={null}    // ReactNode | null — injected into header right slot
/>
```
Clicking navigates to `/reports`. Toggle between Total and Once Fire yield mode via dropdown.

### `<AlertCard>`
```jsx
<AlertCard
  title="Viscosity out of range"   // string
  level="EMERGENCY"                // "EMERGENCY"|"ABNORMAL"|"NORMAL"|"MAINTENANCE"
  message="V0 = 920 sec/100ml..."  // string
  timestamp="18/05/69 16:10"       // string
  resolved={false}                 // boolean — dims card when true
  stage="slip-prep"                // string — navigate target on click
/>
```

### `<DualAxisChart>` (no props — reads from context + useParameterDefect)
Renders Recharts `ComposedChart`:
- Left Y-axis: parameter lines (one per selected parameter key)
- Right Y-axis: defect count bars
- UCL/LCL `ReferenceLine` shown only when exactly 1 parameter selected
- `connectNulls={true}` — bridges gaps in sparse data

### `<FilterBar>` (no props — reads/writes DashboardContext)
Dropdowns: Parameter (multi-select), Defect (single), Model (multi), View (Hour/Day/Week/Month), Date (range picker), Refresh interval.

---

## 5. Routing Table

| Path | Page | Description |
|---|---|---|
| `/` | `Dashboard.jsx` | Main overview — pipeline, KPIs, parameter-defect, yield |
| `/stage/slip-prep` | `StageDetail.jsx` | Slip Prep stage detail |
| `/stage/glaze-prep` | `StageDetail.jsx` | Glaze Prep stage detail |
| `/stage/casting` | `StageDetail.jsx` | Casting stage detail |
| `/stage/drying` | `StageDetail.jsx` | Drying stage detail |
| `/stage/spraying` | `StageDetail.jsx` | Spraying stage detail |
| `/stage/firing` | `StageDetail.jsx` | Firing stage detail |
| `/alerts` | `Alerts.jsx` | Alert list with filter + resolve |
| `/reports` | `Reports.jsx` | Parameter-Defect chart + FilterBar |
| `/settings` | `Settings.jsx` | User profile + threshold config |

---

## 6. Context Schema — DashboardContext

```js
{
  // Theme
  theme:            "light" | "dark",
  setTheme:         (value) => void,
  toggleTheme:      () => void,

  // Filters (shared across Dashboard + Reports)
  selectedDate:     string,          // "YYYY-MM-DD to YYYY-MM-DD" (default: last 30 days)
  setSelectedDate:  (value) => void,
  selectedDefect:   string,          // "all" | defect code (lowercase)
  setSelectedDefect:(value) => void,
  selectedParameter:string[],        // parameter keys e.g. ["viscosity_v0"]
  setSelectedParameter: (fn|value) => void,
  selectedModel:    string[],        // ["All"] or model name array
  setSelectedModel: (fn|value) => void,
  selectedView:     "hour"|"day"|"week"|"month",
  setSelectedView:  (value) => void,
  refreshInterval:  "1m"|"5m"|"15m"|"30m"|"1hr"|"4hr"|"Manual",
  setRefreshInterval:(value) => void,

  // UI
  rightPanelOpen:    boolean,
  setRightPanelOpen: (value) => void,
}
```

Default values: `theme="light"`, `selectedParameter=["viscosity_v0"]`, `selectedModel=["All"]`, `selectedView="day"`, `refreshInterval="5m"`, date = last 30 days.

---

## 7. CSS Variables

### Light Theme
```css
--bg-page:        #F0F2F5
--bg-card:        #FFFFFF
--bg-sidebar:     #FFFFFF
--border:         #E5E7EB
--text-primary:   #111827
--text-secondary: #6B7280
--accent:         #1E6FCC
--accent-light:   #EFF6FF
```

### Dark Theme
```css
--bg-page:        #0D1117
--bg-card:        #161B22
--bg-sidebar:     #161B22
--border:         #30363D
--text-primary:   #E6EDF3
--text-secondary: #8B949E
--accent:         #4F8EE8
--accent-light:   #1A2744
```

### Status Colors (both themes)
```
EMERGENCY   bg:#FEE2E2  text:#991B1B  border:#DC2626
ABNORMAL    bg:#FEF3C7  text:#92400E  border:#D97706
NORMAL      bg:#DCFCE7  text:#166534  border:#16A34A
MAINTENANCE bg:#F3F4F6  text:#374151  border:#9CA3AF
```

### Typography
```
Font:    Inter
Numbers: font-variant-numeric: tabular-nums
Scale:   11 · 12 · 14 · 16 · 20 · 24 · 32px
```

---

## 8. Parameter → Defect Mapping

| Parameter | Stage | Unit | Primary Defects |
|---|---|---|---|
| Viscosity V0 | Body Slip | cP | Pinhole, Crack |
| Viscosity V30 | Body Slip | cP | Pinhole, Grain Size |
| % Moisture Content | Drying | % | Crack, Deformation |
| Temperature | Firing | °C | Crack, Discoloration |
| Firing Cycle | Firing | min | Discoloration, Deformation |
| % Particle Size | Glaze Slip | % | Pinhole, Surface |
| Concentration | Glaze Slip | g/L | Color, Surface |
| Thickness | Spraying | μm | Discoloration |
| Mold Cycle | Casting | count | Grain Size, Crack |
| Casting Rate | Body Slip | pcs/hr | Grain Size |

---

## 9. Stage → Parameters Mapping

| Stage ID | Parameters |
|---|---|
| `slip-prep` | viscosity_v0, viscosity_v30, concentration, temperature, casting_rate |
| `glaze-prep` | particle_size, concentration, viscosity_v0, residue |
| `casting` | mold_cycle, mold_no, caster_no |
| `drying` | drying_curve, moisture_content |
| `spraying` | thickness, sprayer_no, robot_no |
| `firing` | temperature, firing_cycle, weight |

---

## 10. API Endpoints (Backend)

| Method | Path | Description |
|---|---|---|
| GET | `/pipeline` | 6-stage status from unresolved alerts |
| GET | `/overview` | OEE, Takt, WIP, MTTR KPIs |
| GET | `/notifications` | Alert feed sorted by severity |
| GET | `/yield?type=clay\|firing` | Yield breakdown |
| GET | `/metrics` | Slip In / Yield / Warehouse metrics |
| GET | `/api/defects/chart` | Parameter lines + defect bars (slip_daily_record + fact_qr_scan) |
| GET | `/api/defects/insights` | Top defects, by category, defect rate |
| GET | `/api/meta/models` | Product model list |
| GET | `/api/meta/defect-types` | Defect type list |
| GET | `/latest` | Latest machine sensor reading (TSDB hpc_shell_2) |
| GET | `/timeseries` | Machine sensor timeseries (TSDB) |
| PATCH | `/alerts/{id}/resolve` | Mark alert resolved |
| WS | `/ws/live` | Live push: alert count + pipeline status (10s interval) |

### `/api/defects/chart` query params
| Param | Default | Description |
|---|---|---|
| `startDate` | required | YYYY-MM-DD |
| `endDate` | required | YYYY-MM-DD |
| `view` | `day` | `day` \| `week` \| `month` |
| `defect` | `all` | defect code or `all` |
| `model` | `All` | comma-separated model names or `All` |
| `parameter` | `viscosity_v0` | comma-separated parameter keys |

Response: `{ points: [...], ucl: {...}, lcl: {...}, has_param_data: bool }`

### Parameter key → DB column mapping (slip_daily_record)
| Key | Column |
|---|---|
| `viscosity_v0` | `v0_sec100ml` |
| `viscosity_v30` | `v30_sec100ml` |
| `temperature` | `temp_c` |
| `concentration` | `conc_g200ml` |
| `casting_rate` | `casting_rate_mm20min` |
| `yield_value` | `yield_value` |
| `thixo` | `thixo_f0_f5` |
