# SNK MES Dashboard — Architecture, Flow & Scale Plan

> **Project:** SNK MES Dashboard (`one-pd`)  
> **Stack:** React 18 · Vite · Tailwind CSS · Recharts · React Router v6  
> **Updated:** 2026-05-19

---

## 1. Data Flow Overview

ข้อมูลในระบบปัจจุบันไหลแบบ **Unidirectional** จาก mock data → Context → Component → UI

```
src/data/mock.js
      │
      │  named exports: pipeline, overview, parameterDefect,
      │                 notifications, yield_, metrics, stageParams
      ▼
DashboardContext.jsx  (React Context — wrap ทั้ง app ใน App.jsx)
      │
      │  state: theme, selectedDate, selectedDefect,
      │          selectedParameter, selectedModel,
      │          selectedView, rightPanelOpen
      │
      │  setters ส่งผ่าน Context value → ทุก component อ่านได้
      ▼
AppLayout.jsx  (Layout shell)
  ├── Sidebar.jsx          ← รับ isDark, onThemeToggle จาก AppLayout
  ├── <Outlet />           ← Page component ที่ router inject
  └── RightPanel.jsx
        └── NotificationPanel.jsx
```

### 1.1 Context State → UI

```
useDashboard() hook
  │
  ├── theme ──────────────────── AppLayout, Sidebar (dark/light class)
  │
  ├── selectedParameter ─────── FilterBar (checkbox state)
  │                              DualAxisChart (กรอง Line ที่แสดง)
  │
  ├── selectedDefect ─────────── FilterBar (active button)
  │                              DualAxisChart (กรองข้อมูล — future)
  │
  ├── selectedModel ──────────── FilterBar (multi-select)
  │
  ├── selectedView ───────────── FilterBar (1H/4H/Day…)
  │
  ├── selectedDate ───────────── FilterBar (date range → string)
  │
  └── rightPanelOpen ─────────── RightPanel (drawer open/close)
                                  Sidebar (FAB trigger — future)
```

### 1.2 Mock Data → Component Mapping

| Export | Component ที่ใช้ | หน้าที่ |
|---|---|---|
| `pipeline` | `Dashboard` → `ProductionPipeline` → `StageCard` | แสดง 6 stage cards |
| `overview.oee` | `OverviewStrip` → `OEECard` | Donut + timeline strip |
| `overview.takt` | `OverviewStrip` → `TaktCycleCard` | Takt vs Cycle bar |
| `overview.wip` | `OverviewStrip` → `WIPCard` | Progress bar |
| `overview.mttr` | `OverviewStrip` → `MTTRCard` | MTTR vs target |
| `parameterDefect` | `ParameterDefectCard` → `DualAxisChart`, `InsightPanel` | Chart + Insight |
| `notifications` | `NotificationPanel` → `AlertCard` | Alert list |
| `yield_` | `NotificationPanel` → `YieldDonut` (×2) | Clay + Firing donut |
| `metrics` | `NotificationPanel` → `ProductionMetrics` | Slip In / WH In |
| `stageParams` | `StageDetail` → `GaugeParam` | Parameter gauges |

---

## 2. Component Architecture

### 2.1 Component Tree

```
App.jsx
└── DashboardProvider (Context)
    └── RouterProvider
        └── AppLayout.jsx
            ├── Sidebar.jsx ──────────────────── [CSS-in-JS, ห้ามแก้ style]
            │
            ├── <main> (Outlet)
            │   │
            │   ├── Dashboard.jsx
            │   │   ├── ProductionPipeline.jsx
            │   │   │   └── StageCard.jsx (×6)        props: id, label, status, timestamp
            │   │   ├── OverviewStrip.jsx
            │   │   │   ├── OEECard.jsx               props: data (overview.oee)
            │   │   │   ├── TaktCycleCard.jsx          props: data (overview.takt)
            │   │   │   ├── WIPCard.jsx                props: data (overview.wip)
            │   │   │   └── MTTRCard.jsx               props: data (overview.mttr)
            │   │   └── ParameterDefectCard.jsx
            │   │       ├── FilterBar.jsx              [reads/writes Context]
            │   │       ├── DualAxisChart.jsx          [reads Context + mock]
            │   │       ├── InsightPanel.jsx           [reads mock]
            │   │       └── AIBar.jsx                  [local state only]
            │   │
            │   ├── StageDetail.jsx                    params: stageId (URL)
            │   │   └── GaugeParam.jsx (inline)        props: param object
            │   │
            │   ├── Alerts.jsx                         [local state: filter, alerts]
            │   ├── Reports.jsx                        [uses DualAxisChart]
            │   ├── Settings.jsx                       [reads/writes Context theme]
            │   ├── ManualKeyIn.jsx                    [local state only]
            │   │
            │   └── /details/*
            │       ├── OEEDetails.jsx
            │       ├── TaktCycleDetails.jsx
            │       ├── WIPDetails.jsx
            │       └── MTTRDetails.jsx
            │
            └── RightPanel.jsx
                └── NotificationPanel.jsx
                    ├── AlertCard.jsx (×n)             props: spread notification object
                    ├── YieldDonut.jsx (×2)            props: title, value, segments, target, headerAction
                    └── ProductionMetrics (inline fn)  props: data (metrics)
```

### 2.2 Shared Utilities & Constants

```
src/constants/
  └── status.js
        ├── STATUS_COLORS    → StageDetail.jsx, Alerts.jsx
        └── ALERT_CARD_STYLES → AlertCard.jsx
```

### 2.3 Routing Map

```
/                     → Dashboard.jsx         (index route)
/stage/:stageId       → StageDetail.jsx       (slip-prep | glaze-prep | casting | drying | spraying | firing)
/alerts               → Alerts.jsx
/reports              → Reports.jsx
/settings             → Settings.jsx
/manual-key-in        → ManualKeyIn.jsx
/oee                  → OEEDetails.jsx
/takt-cycle           → TaktCycleDetails.jsx
/wip                  → WIPDetails.jsx
/mttr                 → MTTRDetails.jsx
```

### 2.4 State Scope Summary

| State | Scope | Location |
|---|---|---|
| theme | Global | DashboardContext |
| selectedParameter, selectedDefect, selectedModel, selectedView, selectedDate | Global (Filter state) | DashboardContext |
| rightPanelOpen | Global | DashboardContext |
| hovered (card hover) | Local | แต่ละ Card component |
| dropdown open/close | Local | FilterBar, ViewSelector, NotificationPanel |
| alerts (resolve action) | Local | Alerts.jsx |
| AI model, interval, confidence | Local | AIBar.jsx |
| metricsView | Local | ProductionMetrics (ใน NotificationPanel) |
| thresholds | Local | Settings.jsx |
| activeStage | Local | ManualKeyIn.jsx |

---

## 3. Feature Roadmap

### Phase 0 — Bootstrap ✅ (ปัจจุบัน)
- Project setup (Vite + React + Tailwind + Recharts)
- Mock data ครบทุก entity
- Layout shell (Sidebar + Main + RightPanel responsive)
- Dark/Light theme

### Phase 1 — Core UI ✅ (ปัจจุบัน)
- Dashboard: ProductionPipeline (6 StageCards), OverviewStrip (4 KPI Cards)
- ParameterDefectCard: FilterBar, DualAxisChart, InsightPanel, AIBar
- RightPanel: Notifications, YieldDonut ×2, ProductionMetrics
- StageDetail: GaugeParam grid
- Alerts, Reports (placeholder), Settings, ManualKeyIn pages
- Detail pages: OEE, TaktCycle, WIP, MTTR

### Phase 2 — Real API Integration 🔜
**เป้าหมาย:** แทน `src/data/mock.js` ด้วย API calls จริง

```
สิ่งที่ต้องทำ:
- สร้าง src/services/api.js  (axios/fetch wrapper + base URL)
- สร้าง src/hooks/useStageData.js, useAlerts.js, useKPIs.js
  (React Query หรือ SWR สำหรับ caching + refetch interval)
- แยก DashboardContext เป็น:
    └── ThemeContext (UI state)
    └── FilterContext (filter state)
    └── ข้อมูล → React Query hooks
- เพิ่ม loading skeleton และ error boundary ในทุก card
- WebSocket connection สำหรับ realtime alerts
```

**API Endpoints ที่ต้องการ (แนะนำ REST):**
| Endpoint | Method | ใช้ที่ |
|---|---|---|
| `/api/pipeline` | GET | ProductionPipeline |
| `/api/kpi/oee` | GET | OEECard |
| `/api/kpi/takt` | GET | TaktCycleCard |
| `/api/kpi/wip` | GET | WIPCard |
| `/api/kpi/mttr` | GET | MTTRCard |
| `/api/parameters?stage=&from=&to=` | GET | DualAxisChart |
| `/api/alerts?resolved=false` | GET | NotificationPanel, Alerts |
| `/api/alerts/:id/resolve` | PATCH | Alerts.jsx |
| `/api/yield?type=clay&view=day` | GET | YieldDonut |
| `/api/metrics` | GET | ProductionMetrics |
| `/api/stage/:stageId/params` | GET | StageDetail |
| `ws://…/alerts` | WebSocket | realtime alert push |

### Phase 3 — Authentication & Authorization 🔜
```
สิ่งที่ต้องทำ:
- เพิ่ม /login page (ไม่ผ่าน AppLayout)
- AuthContext: user, role, token, logout
- Protected Route wrapper
- Role-based UI:
    Production Manager  → full access
    Operator            → อ่านอย่างเดียว, ไม่เห็น Settings
    MD / C-Level        → Dashboard + Reports เท่านั้น
- Refresh token logic
```

### Phase 3.5 — Security Hardening 🔒 (ต้องทำก่อน Production)

> ⚠️ **ทำก่อน go-live เสมอ** — ข้อมูล production parameter และ defect ของโรงงานเป็นข้อมูลธุรกิจที่ต้องปกป้อง

---

#### Layer 1 — Frontend Security (Browser)

```
1. Content Security Policy (CSP)
   - เพิ่ม meta tag หรือ HTTP header เพื่อ block inline scripts ที่ไม่รู้จัก
   - อนุญาตเฉพาะ: 'self', fonts.googleapis.com, cdnjs.cloudflare.com
   ตัวอย่าง header:
     Content-Security-Policy:
       default-src 'self';
       script-src 'self' 'nonce-{random}';
       style-src 'self' 'unsafe-inline' fonts.googleapis.com;
       font-src fonts.gstatic.com;
       connect-src 'self' wss://your-api.domain;

2. XSS Prevention
   - React escape HTML โดย default — ห้ามใช้ dangerouslySetInnerHTML กับ user input
   - ทุก input field ใน ManualKeyIn และ Settings → sanitize ก่อน submit
   - ใช้ DOMPurify ถ้าต้องแสดง HTML จาก API

3. Sensitive Data ใน Browser
   - ห้ามเก็บ token ใน localStorage (XSS อ่านได้)
   - ใช้ httpOnly Cookie สำหรับ refresh token (server set)
   - Access token → memory only (React state / variable)
   - ถ้า reload หน้า → silent refresh ผ่าน /auth/refresh endpoint

4. Dependency Security
   - npm audit ทุก sprint (หรือ CI/CD pipeline)
   - ใช้ dependabot / Renovate สำหรับ auto-update
   - lock file (package-lock.json) ต้อง commit เสมอ
```

---

#### Layer 2 — API & Authentication Security

```
1. HTTPS บังคับทุก endpoint
   - ห้าม HTTP ใน production — redirect 301 ทั้งหมด
   - TLS 1.2 ขึ้นไป (ปิด TLS 1.0/1.1)
   - HSTS header: Strict-Transport-Security: max-age=31536000

2. JWT Hardening
   - Access token TTL: 15 นาที (สั้น)
   - Refresh token TTL: 8 ชั่วโมง (เท่ากับ 1 กะงาน)
   - Algorithm: RS256 (asymmetric) ไม่ใช้ HS256
   - Refresh token rotation: ใช้ครั้งเดียวแล้วออก token ใหม่
   - Revocation list ใน Redis สำหรับ logout กลางคัน

3. Rate Limiting (ป้องกัน brute force)
   - /auth/login          → 5 ครั้ง / นาที / IP
   - /api/* (ทั่วไป)      → 100 req / นาที / user
   - /api/manual-entry   → 30 req / นาที / user
   - ใช้ Redis + sliding window algorithm

4. CORS Policy
   - whitelist เฉพาะ domain โรงงาน (ไม่ใช้ *)
   - Access-Control-Allow-Origin: https://mes.snk.co.th
   - Credentials: true เฉพาะ origin ที่อนุญาต

5. Input Validation (Server-side)
   - Zod / Pydantic schema ทุก endpoint — ห้าม trust client input
   - SQL Parameterized queries — ห้าม string concat ใน query
   - File upload (ถ้ามี): ตรวจ MIME type + size limit

6. Security Headers (ทุก response)
   X-Content-Type-Options: nosniff
   X-Frame-Options: DENY
   Referrer-Policy: no-referrer
   Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

#### Layer 3 — Audit Logging & Compliance

> สำคัญมากสำหรับโรงงาน — ต้องพิสูจน์ได้ว่า "ใครแก้ parameter อะไร เมื่อไหร่"

```
1. Audit Log ที่ต้องเก็บทุก action:
   ┌─────────────────────────────────────────────────┐
   │ timestamp | user_id | role | action | resource  │
   │ ip_address | user_agent | result (success/fail) │
   │ old_value | new_value (สำหรับ data change)       │
   └─────────────────────────────────────────────────┘

   Events ที่ต้อง log:
   - Login / Logout / Failed login
   - Manual key-in: บันทึก parameter ทุกครั้ง (old + new value)
   - Resolve alert: ใครกด, เวลาไหน
   - Settings change: threshold เปลี่ยนจากเท่าไหร่ → เท่าไหร่
   - Export report: ใครดาวน์โหลด, ช่วงเวลาไหน
   - Role change: ใครถูก promote/demote

2. Audit Log Storage
   - เก็บแยก table/collection จาก business data
   - Immutable: ห้าม UPDATE/DELETE audit records
   - Retention: เก็บ 1 ปี (หรือตาม policy โรงงาน)
   - Index: timestamp + user_id สำหรับ query เร็ว

3. Audit Log Viewer (UI — Phase 3.5)
   - หน้า /audit ใน Settings (เฉพาะ Admin role)
   - Filter: by user, date range, action type
   - Export CSV สำหรับ auditor ภายนอก

4. Non-Repudiation
   - ทุก manual key-in มี digital signature (user + timestamp + hash ของ data)
   - พิสูจน์ได้ว่าข้อมูลไม่ถูกแก้ไขหลัง submit
```

---

#### Layer 4 — Network & Infrastructure Security

```
1. Network Segmentation (สำหรับ on-premise)
   ┌─────────────────────────────────────────────┐
   │  Internet                                   │
   │      │                                      │
   │  [Firewall/WAF]  ← block ทุก port ยกเว้น    │
   │      │            443 (HTTPS) + 80 redirect  │
   │  [Reverse Proxy]  ← Nginx / Traefik          │
   │      │                                      │
   │  [App Server]     ← Docker network isolated  │
   │      │                                      │
   │  [DB Server]      ← ไม่ expose port ออก      │
   └─────────────────────────────────────────────┘

2. Docker Hardening
   - ไม่ run container as root (ใช้ non-root user ใน Dockerfile)
   - Read-only filesystem ที่ทำได้
   - Resource limits: --memory, --cpus
   - ไม่ mount /var/run/docker.sock ใน app container
   - Network: สร้าง custom bridge network — DB ไม่ต่อ internet โดยตรง

3. Secrets Management
   - ห้าม hardcode secrets ใน code หรือ Dockerfile
   - ใช้ Docker Secrets หรือ .env file ที่ไม่ commit (gitignore)
   - Secret rotation: เปลี่ยน DB password ทุก 90 วัน
   - Key vault: ถ้า scale ขึ้น → HashiCorp Vault

4. Server Hardening (on-premise Linux)
   - SSH key only — ปิด password authentication
   - Fail2ban สำหรับ SSH brute force
   - Auto security update (unattended-upgrades)
   - Disable unused services/ports
   - ติดตั้ง intrusion detection: AIDE หรือ Wazuh

5. VPN สำหรับ Remote Access
   - Admin/developer ต้อง VPN ก่อน access server
   - WireGuard หรือ OpenVPN (on-premise)
   - 2FA สำหรับ VPN login
```

---

#### Security Checklist ก่อน Go-Live

```
Frontend:
  [ ] CSP header ติดตั้งแล้ว
  [ ] ไม่มี token ใน localStorage
  [ ] npm audit ผ่าน (0 critical, 0 high)
  [ ] Input sanitization ใน ManualKeyIn

API/Auth:
  [ ] HTTPS บังคับ (HTTP redirect แล้ว)
  [ ] JWT TTL ตั้งถูก (15min access / 8hr refresh)
  [ ] Rate limiting เปิดแล้ว
  [ ] CORS whitelist เฉพาะ domain โรงงาน
  [ ] Security headers ครบ

Audit:
  [ ] Audit log table สร้างแล้ว
  [ ] ทุก write action บันทึก audit
  [ ] Audit viewer สำหรับ Admin พร้อม
  [ ] Backup audit log แยกจาก backup ปกติ

Infrastructure:
  [ ] Firewall เปิดเฉพาะ port 443
  [ ] Docker container ไม่ run as root
  [ ] Secrets ไม่อยู่ใน git
  [ ] SSH key-only authentication
  [ ] Backup + restore drill ผ่าน
```

---

#### RBAC Matrix (Role × Permission)

| Action | Production Manager | Operator | MD / C-Level | Admin |
|---|:---:|:---:|:---:|:---:|
| ดู Dashboard | ✓ | ✓ | ✓ | ✓ |
| ดู Stage Detail | ✓ | ✓ | ✗ | ✓ |
| ดู Alerts | ✓ | ✓ | ✓ (summary) | ✓ |
| Resolve Alert | ✓ | ✗ | ✗ | ✓ |
| Manual Key-In | ✓ | ✓ | ✗ | ✓ |
| ดู Reports | ✓ | ✗ | ✓ | ✓ |
| Export Reports | ✓ | ✗ | ✓ | ✓ |
| แก้ Settings/Threshold | ✗ | ✗ | ✗ | ✓ |
| ดู Audit Log | ✗ | ✗ | ✗ | ✓ |
| จัดการ Users | ✗ | ✗ | ✗ | ✓ |

---

### Phase 4 — Manual Key-In Workflow 🔜
**ปัจจุบัน:** ManualKeyIn.jsx เป็น UI เท่านั้น ยังไม่มี submit

```
สิ่งที่ต้องทำ:
- Form state management (React Hook Form + Zod validation)
- POST /api/manual-entry
- Optimistic update → invalidate React Query cache
- Offline queue (IndexedDB) สำหรับ network ไม่เสถียรในโรงงาน
- ประวัติการ key-in ย้อนหลัง
```

### Phase 5 — Advanced Analytics & Alerts 🔜
```
สิ่งที่ต้องทำ:
- Alert rules engine (ตั้ง threshold ใน Settings → trigger alert อัตโนมัติ)
- Email / LINE Notify integration สำหรับ EMERGENCY alerts
- Predictive maintenance: แสดง trend ก่อน EMERGENCY จะเกิด
- Export รายงาน: PDF / Excel ต่อกะ / ต่อวัน
- Drill-down: กดที่ defect bar → แสดง breakdown by mold/caster
```

### Phase 6 — Reports ครบวงจร 🔜
```
สิ่งที่ต้องทำ:
- Reports.jsx: ต่อ DualAxisChart กับ filter จริง
- เพิ่ม section:
    Defect Summary by Stage   (Recharts BarChart)
    OEE Weekly Trend          (LineChart)
    Yield Analysis            (AreaChart)
    MTTR History              (BarChart)
- Date range picker ที่ share state กับ FilterBar
- Scheduled report: ส่ง email สรุปกะอัตโนมัติ
```

### Phase 7 — Mobile & PWA 🔜
```
สิ่งที่ต้องทำ:
- vite-plugin-pwa (installable, offline cache)
- Push notifications (Web Push API)
- Touch gesture บน RightPanel drawer (swipe ทำได้แล้ว — ขยาย coverage)
- Bottom navigation สำหรับ mobile แทน Sidebar
```

---

## 4. Technical Scaling Plan

### 4.1 State Management Migration

ปัจจุบัน DashboardContext เก็บทั้ง UI state และ filter state ร่วมกัน
เมื่อ data จริงเข้ามา ควรแยกออก:

```
Before (ปัจจุบัน):
  DashboardContext ─── theme, filters, UI state, alerts[]

After (เมื่อ scale):
  ThemeContext      ─── theme, toggleTheme         (ไม่ค่อย re-render)
  FilterContext     ─── selectedDate/Defect/Param… (re-render เฉพาะ filter zone)
  React Query       ─── server state: pipeline, kpis, alerts, yield
                        (caching, background refetch, staleTime config)
```

**Recommended libraries:**
- `@tanstack/react-query` v5 — server state
- Context API — ยังคงใช้ได้สำหรับ UI/filter state

### 4.2 Performance

| ปัญหาที่จะเกิดเมื่อ scale | แนวทางแก้ |
|---|---|
| DualAxisChart re-render ทุกครั้งที่ filter เปลี่ยน | `React.memo` + `useMemo` สำหรับ timeseries data |
| NotificationPanel render ทุก alert ใหม่ | Virtualized list (`react-virtual`) เมื่อ alerts > 100 |
| Bundle size ใหญ่ (760 kB ปัจจุบัน) | Code splitting: `lazy()` + `Suspense` สำหรับ detail pages |
| Recharts re-render บ่อย | `isAnimationActive={false}` เมื่อ realtime data |

**Code splitting ตัวอย่าง:**
```jsx
// App.jsx — lazy load detail pages
const OEEDetails      = lazy(() => import('./pages/details/OEEDetails'))
const TaktCycleDetails = lazy(() => import('./pages/details/TaktCycleDetails'))
// ...

// ครอบด้วย Suspense
<Suspense fallback={<PageSkeleton />}>
  <Outlet />
</Suspense>
```

### 4.3 Real-Time Data Strategy

```
Option A — Polling (ง่าย, เหมาะระยะแรก)
  React Query refetchInterval: 10_000   // 10 วินาที
  ใช้กับ: pipeline status, KPIs, yield

Option B — WebSocket (realtime, เหมาะ Phase 2+)
  ใช้กับ: alerts (ต้องการ push ทันที)
  Library: native WebSocket หรือ socket.io-client

Option C — Server-Sent Events (SSE)
  ใช้กับ: parameter timeseries (stream ข้อมูลเข้า chart)
  เหมาะถ้า backend เป็น Node.js / Python FastAPI
```

### 4.4 Folder Structure เมื่อ Scale

```
src/
├── components/          (เหมือนเดิม — แยก domain folder)
├── constants/
│   └── status.js        ✅ มีแล้ว
├── context/
│   ├── ThemeContext.jsx  (แยกออกจาก DashboardContext)
│   └── FilterContext.jsx
├── hooks/               (NEW — custom hooks)
│   ├── useAlerts.js      (React Query wrapper)
│   ├── useKPIs.js
│   ├── usePipeline.js
│   └── useStageParams.js
├── services/            (NEW — API layer)
│   ├── api.js            (axios instance + interceptors)
│   ├── alertsService.js
│   └── kpiService.js
├── types/               (NEW — JSDoc / TypeScript migration path)
│   └── index.js          (/** @typedef */ หรือ .ts เมื่อ migrate)
├── pages/
├── data/
│   └── mock.js           (ยังคงใช้ใน dev/test environment)
└── utils/
    ├── formatters.js     (toLocaleString, formatDate ฯลฯ)
    └── statusHelpers.js  (getStatusColor, getStatusLabel)
```

### 4.5 TypeScript Migration Path

ปัจจุบันเป็น `.jsx` ทั้งหมด — สามารถ migrate แบบ incremental:

```
Step 1: เพิ่ม tsconfig.json + rename files เป็น .tsx ทีละไฟล์
Step 2: เริ่มจาก constants/status.js → status.ts (type ชัดเจนที่สุด)
Step 3: types/index.ts → define Stage, Alert, KPI interfaces
Step 4: services/ → typed API responses
Step 5: components → typed props interfaces
```

**ตัวอย่าง types ที่ควรมี:**
```typescript
type Status = 'EMERGENCY' | 'ABNORMAL' | 'NORMAL' | 'MAINTENANCE'

interface Stage {
  id: string
  label: string
  status: Status
  timestamp: string
}

interface Alert {
  id: string
  title: string
  level: Status
  message: string
  timestamp: string
  resolved: boolean
  stage: string
}

interface KpiOEE {
  value: number
  availability: number
  performance: number
  quality: number
  timeStart: string
  timeEnd: string
  timeline: { time: string; status: Status }[]
}
```

### 4.6 Backend Recommendation

| Layer | แนะนำ | เหตุผล |
|---|---|---|
| API Server | **FastAPI (Python)** หรือ Node.js/Express | ทีม factory มักถนัด Python; FastAPI มี auto-docs |
| Database | **PostgreSQL** | Timeseries + relational data; รองรับ `timescaledb` extension |
| Realtime | **Redis Pub/Sub** + WebSocket gateway | Alert push โดยไม่ต้อง poll |
| Auth | **JWT + refresh token** | Stateless, เหมาะ mobile + web |
| Deployment | **Docker Compose** (factory on-premise) | โรงงานมักไม่มี cloud; run ได้บน local server |

---

## 5. Quick Reference — สิ่งที่ต้อง Test ก่อน Scale

- [ ] ทุก KPI card navigate ไป detail page ถูกต้อง
- [ ] Dark mode toggle ไม่มี flash (CSS vars apply ทันที)
- [ ] FilterBar ปิด dropdown เมื่อ click outside (ยังไม่มี `useClickOutside`)
- [ ] StageDetail แสดง "Stage not found" เมื่อ stageId ผิด
- [ ] Alerts resolve แล้วกลับมาดูใหม่ — state ยังคงถูก (local state → ต้องต่อ API)
- [ ] ManualKeyIn submit ยังไม่ทำงาน — ต้อง wire ใน Phase 4
- [ ] `AIBar.jsx` model/interval/confidence เป็น local state — ยังไม่ได้ส่งไปไหน

---

*เอกสารนี้ update ตาม codebase เวอร์ชัน 2026-05-19*  
*อ้างอิง `CLAUDE.md` สำหรับ design tokens และ conventions*
