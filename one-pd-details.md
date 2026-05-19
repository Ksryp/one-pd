# ONE-PD — Project Details
## SNK MES Dashboard · Full System Plan

> วิเคราะห์จากภาพ `fig-dash.png` + `Flow and Param.md`
> อัปเดต: 19 พฤษภาคม 2569

---

## 1. Tech Stack

| Layer | เครื่องมือ | เหตุผล |
|---|---|---|
| Framework | Vite + React | Fast dev server, lightweight |
| Routing | React Router v6 | Multi-page, dynamic routes |
| Styling | Tailwind CSS + CSS Variables | Utility-first + theme switching |
| Charts | Recharts | Compatible กับ React, lightweight |
| Icons | SVG inline | ตาม pattern ของ Sidebar.jsx |
| State | React Context + useState | ไม่ซับซ้อนเกิน, ไม่ต้องใช้ Redux |
| Data | mock.js (JSON) | Phase แรก → เชื่อม API จริงทีหลัง |

---

## 2. Design System

### 2.1 Typography
- **Font:** `Inter` (มีใน Sidebar.jsx อยู่แล้ว)
- **Numbers/Data:** `Inter` + `font-variant-numeric: tabular-nums`
- Scale: 11px · 12px · 14px · 16px · 20px · 24px · 32px

### 2.2 Color Palette

#### Light Theme
| Token | Hex | ใช้กับ |
|---|---|---|
| `--bg-page` | `#F0F2F5` | Page background |
| `--bg-card` | `#FFFFFF` | Card, Panel |
| `--bg-sidebar` | `#FFFFFF` | Sidebar |
| `--border` | `#E5E7EB` | Dividers, Card borders |
| `--text-primary` | `#111827` | Headings, Labels |
| `--text-secondary` | `#6B7280` | Sub-labels, Timestamps |
| `--accent` | `#1E6FCC` | Selected, Active, AI Bar |
| `--accent-light` | `#EFF6FF` | Hover backgrounds |

#### Dark Theme
| Token | Hex | ใช้กับ |
|---|---|---|
| `--bg-page` | `#0D1117` | Page background |
| `--bg-card` | `#161B22` | Card, Panel |
| `--bg-sidebar` | `#161B22` | Sidebar |
| `--border` | `#30363D` | Dividers |
| `--text-primary` | `#E6EDF3` | Headings |
| `--text-secondary` | `#8B949E` | Sub-labels |
| `--accent` | `#4F8EE8` | Selected, Active |
| `--accent-light` | `#1A2744` | Hover backgrounds |

#### Status Colors (ใช้ทั้ง Light & Dark)
| สถานะ | Background | Text | Border |
|---|---|---|---|
| EMERGENCY | `#FEE2E2` | `#991B1B` | `#DC2626` |
| ABNORMAL | `#FEF3C7` | `#92400E` | `#D97706` |
| NORMAL | `#DCFCE7` | `#166534` | `#16A34A` |
| MAINTENANCE | `#F3F4F6` | `#374151` | `#9CA3AF` |

---

## 3. Pages & Routing

```
/                        → Main Dashboard (fig-dash.png)
/stage/slip-prep         → Slip Prep Detail
/stage/glaze-prep        → Glaze Prep Detail
/stage/casting           → Casting Detail
/stage/drying            → Drying Detail
/stage/spraying          → Spraying Detail
/stage/firing            → Firing Detail
/alerts                  → Full Alerts Page
/reports                 → Reports & Trends
/settings                → Settings
```

Sidebar Nav Items:
```
📊  MES Overview      →  /
🔔  Alerts            →  /alerts   (badge = unresolved count)
📈  Reports           →  /reports
⚙️  Settings          →  /settings
```

---

## 4. Parameters → Defect Mapping
(เลือกจาก Flow and Param.md ตาม Correlation กับ Defect)

| Parameter | Stage | หน่วย | Defect ที่เกี่ยวข้อง |
|---|---|---|---|
| **Viscosity (V0)** | Body Slip | cP | Pinhole, Crack |
| **Viscosity (V30)** | Body Slip | cP | Pinhole, Grain Size |
| **% Moisture Content** | Drying | % | Crack, Deformation |
| **Temperature** | Firing | °C | Crack, Discoloration |
| **Firing Cycle** | Firing | min | Discoloration, Deformation |
| **% Particle Size** | Glaze Slip | % | Pinhole, Surface |
| **Concentration** | Glaze Slip | g/L | Color & Surface |
| **Thickness** | Spraying | μm | Discoloration |
| **Mold Cycle** | Casting | count | Grain Size, Crack |
| **Casting Rate** | Body Slip | pcs/hr | Grain Size, Density |

Defect Types ที่แสดงใน Dashboard:
- **Pinhole** — รูเล็กบนผิว
- **Crack** — รอยแตก
- **Discoloration** — สีผิดปกติ
- **Deformation** — รูปทรงผิด
- **Grain Size** — เนื้อดินหยาบ

---

## 5. Responsive Strategy

| Breakpoint | ความกว้าง | Behavior |
|---|---|---|
| Desktop | ≥ 1280px | Full layout — Sidebar + Main + RightPanel |
| Laptop | 1024–1279px | เหมือน Desktop แต่ RightPanel แคบลง (~280px) |
| Tablet | 768–1023px | RightPanel ซ่อน → ปุ่ม "📊" มุมขวาล่าง คลิกเปิด Drawer |
| Mobile | < 768px | RightPanel Drawer + Sidebar collapse เป็น overlay |

RightPanel บน Mobile/Tablet:
- ซ่อนโดย default
- มี FAB button มุมขวาล่าง → คลิกเปิด slide-in Drawer จากขวา
- ปิดโดยคลิกพื้นที่ด้านนอก หรือกด ×
- ปัด (swipe left) เพื่อปิดก็ได้

---

## 6. Mock Data Schema

```js
// mock.js structure
{
  pipeline: [
    { id: "slip-prep", label: "SLIP PREP", status: "EMERGENCY", timestamp: "..." },
    { id: "glaze-prep", label: "GLAZE PREP", status: "NORMAL", timestamp: "..." },
    { id: "casting", label: "CASTING", status: "ABNORMAL", timestamp: "..." },
    { id: "drying", label: "DRYING", status: "NORMAL", timestamp: "..." },
    { id: "spraying", label: "SPRAYING", status: "NORMAL", timestamp: "..." },
    { id: "firing", label: "FIRING", status: "MAINTENANCE", timestamp: "..." },
  ],
  overview: {
    oee: { value: 78, availability: 82, performance: 74, quality: 81, timeStart: "07:30", timeEnd: "16:30" },
    takt: { taktTime: 42, cycleTime: 38, unit: "s/pcs" },
    wip: { value: 1840, max: 2000, hotStage: "casting" },
    mttr: { value: 24, target: 30, incidents: 3 },
  },
  parameterDefect: {
    timeseries: [
      { hour: "07:00", viscosity: 820, temperature: 1230, moisture: 12.4, defect: 42 },
      // ...24 data points
    ],
    ucl: { viscosity: 900, temperature: 1280, moisture: 15 },
    lcl: { viscosity: 700, temperature: 1180, moisture: 8 },
    insights: {
      peakDefect: { hour: "10:00", count: 312 },
      paramAtPeak: { name: "Viscosity", value: 940, unit: "cP" },
      correlation: { value: 0.82, direction: "positive", strength: "strong" },
      totalDefect: { count: 10468, rate: 22, byCategory: [...] },
    },
  },
  notifications: [
    { id: 1, stage: "slip-prep", title: "SLIP PREPERATION : SNK 1", level: "ABNORMAL", timestamp: "...", resolved: false },
    { id: 2, stage: "casting", title: "CASTING : HPC SHELL NO.1", level: "ABNORMAL", timestamp: "...", resolved: false },
    { id: 3, stage: "firing", title: "KILN NO.2", level: "ABNORMAL", timestamp: "...", resolved: false },
  ],
  yield: {
    clay: { value: 86, good: 10234, repair: 623, scrap: 748, target: 90 },
    firing: { value: 81, good: 9840, repair: 1102, scrap: 1198, target: 88 },
  },
  metrics: {
    slipIn: { pieces: 67400, kg: 1341260 },
    slipYield: { value: 62, target: 75 },
    warehouseIn: { pieces: 42013, kg: 836058 },
  },
}
```

---

## 7. Hover States (ทุก Component)

| Component | Hover Effect |
|---|---|
| StageCard | Border glow (status color) + label "View Dashboard →" + cursor pointer |
| AlertCard | Background สว่างขึ้น + border left เข้มขึ้น |
| YieldDonut | Tooltip แสดง % + pcs + shadow เพิ่ม |
| OEECard | Tooltip แสดง Availability/Performance/Quality |
| Chart (Line/Bar) | Crosshair tooltip แสดงค่าทุก param + defect count |
| InsightCard | Border accent + scale(1.01) subtle |
| MetricsCard | Background เปลี่ยน + underline text |
| Sidebar NavItem | มีอยู่แล้วใน Sidebar.jsx |

---

## 8. File Structure

```
one-pd/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx       ← Sidebar + Main + RightPanel
│   │   │   ├── RightPanel.jsx      ← Drawer behavior on mobile
│   │   │   └── Sidebar.jsx         ← มีแล้ว (ปรับ nav items)
│   │   ├── pipeline/
│   │   │   ├── ProductionPipeline.jsx
│   │   │   └── StageCard.jsx
│   │   ├── overview/
│   │   │   ├── OverviewStrip.jsx
│   │   │   ├── OEECard.jsx
│   │   │   ├── TaktCycleCard.jsx
│   │   │   ├── WIPCard.jsx
│   │   │   └── MTTRCard.jsx
│   │   ├── parameter-defect/
│   │   │   ├── ParameterDefectCard.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── DualAxisChart.jsx
│   │   │   ├── InsightPanel.jsx
│   │   │   └── AIBar.jsx
│   │   ├── notification/
│   │   │   ├── NotificationPanel.jsx
│   │   │   └── AlertCard.jsx
│   │   ├── yield/
│   │   │   └── YieldDonut.jsx      ← reusable (Clay + Firing)
│   │   └── metrics/
│   │       └── ProductionMetrics.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx           ← หน้าหลัก
│   │   ├── StageDetail.jsx         ← template สำหรับ 6 stages
│   │   ├── Alerts.jsx
│   │   ├── Reports.jsx
│   │   └── Settings.jsx
│   ├── data/
│   │   └── mock.js                 ← Mock data ทั้งหมด
│   ├── context/
│   │   └── DashboardContext.jsx    ← Global state (date, filters, theme)
│   ├── App.jsx                     ← Router setup
│   ├── main.jsx
│   └── index.css                   ← CSS variables + Tailwind base
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 9. Implementation Phases

### Phase 0 — Project Bootstrap
**ไฟล์ที่สร้าง:** `package.json` · `vite.config.js` · `tailwind.config.js` · `index.html` · `main.jsx` · `App.jsx` · `index.css`

ทำ:
- `npm create vite@latest` → React
- Install: `react-router-dom` · `recharts`
- ตั้ง Tailwind CSS พร้อม custom tokens
- CSS Variables สำหรับ light/dark theme ทั้งหมด
- Router setup พร้อม routes ครบทุกหน้า
- ทดสอบ: `npm run dev` → เห็นหน้าว่างพร้อม router

---

### Phase 1 — Layout Shell + Sidebar
**ไฟล์ที่สร้าง:** `AppLayout.jsx` · `RightPanel.jsx` · ปรับ `Sidebar.jsx`

ทำ:
- `AppLayout.jsx`: flex row → Sidebar + Main + RightPanel
- ปรับ Sidebar.jsx nav items → MES context (Overview/Alerts/Reports/Settings)
- `RightPanel.jsx`: responsive logic
  - ≥1024px: แสดงปกติ
  - <1024px: ซ่อน + FAB button คลิกเปิด Drawer slide-in จากขวา
  - Overlay backdrop + swipe-to-close
- Dark mode toggle ทำงานกับ CSS variables

ทดสอบ: resize browser ดู breakpoints ทุกจุด

---

### Phase 2 — Mock Data
**ไฟล์ที่สร้าง:** `data/mock.js` · `context/DashboardContext.jsx`

ทำ:
- `mock.js`: ข้อมูลครบทุก section ตาม schema ใน Section 6
- timeseries parameter 24 จุด (ทุกชั่วโมง 07:00–06:00)
- UCL/LCL ทุก parameter
- Defect data ครบ 5 ประเภท
- Alert 3 รายการ ครบ fields
- `DashboardContext.jsx`: global state → `selectedDate`, `selectedDefect`, `selectedParameter[]`, `selectedView`, `alerts[]`

---

### Phase 3 — Main Dashboard (Static)
**ไฟล์ที่สร้าง:** `Dashboard.jsx` · `ProductionPipeline.jsx` · `StageCard.jsx` · `NotificationPanel.jsx` · `AlertCard.jsx` · `YieldDonut.jsx` · `ProductionMetrics.jsx`

ทำ:
- `Dashboard.jsx`: compose ทุก section จาก mock data
- `StageCard.jsx`: status badge (4 states) + stage name + timestamp
- `ProductionPipeline.jsx`: 6 StageCards เรียง row
- `NotificationPanel.jsx`: header + badge dot + รายการ alerts
- `AlertCard.jsx`: level color + title + text + timestamp
- `YieldDonut.jsx`: static donut (recharts PieChart) + legend + % center
- `ProductionMetrics.jsx`: Slip In / Slip Yield / Warehouse In

ทดสอบ: ภาพรวมหน้า Dashboard ตรงกับ fig-dash.png

---

### Phase 4 — Overview Strip
**ไฟล์ที่สร้าง:** `OverviewStrip.jsx` · `OEECard.jsx` · `TaktCycleCard.jsx` · `WIPCard.jsx` · `MTTRCard.jsx`

ทำ:
- `OEECard.jsx`: donut recharts + time range slider
- `TaktCycleCard.jsx`: 2 ตัวเลขคู่กัน + สีบ่งสถานะ (Cycle vs Takt)
- `WIPCard.jsx`: ตัวเลข + progress bar + sub-label stage ที่สูงสุด
- `MTTRCard.jsx`: ตัวเลขนาที + สถานะ vs target + incident count
- Color state logic: green/amber/red ตาม threshold

---

### Phase 5 — Parameter–Defect Card + Charts
**ไฟล์ที่สร้าง:** `ParameterDefectCard.jsx` · `FilterBar.jsx` · `DualAxisChart.jsx` · `InsightPanel.jsx` · `AIBar.jsx`

ทำ:
- `FilterBar.jsx`: Parameter multi-select dropdown + Defect chips + Model/Views/Date dropdown
- `DualAxisChart.jsx`: recharts ComposedChart — Line (parameter) + Bar (defect) + UCL/LCL dashed lines + red dots เมื่อเกิน limit
- `InsightPanel.jsx`: 4 cards → Peak Defect · Param at Peak · Correlation · Total Defect
- `AIBar.jsx`: blue bar + brain icon + insight text + confidence %

---

### Phase 6 — Hover States & Navigation
ทำ (ไม่สร้างไฟล์ใหม่ — แก้ทุก component):
- StageCard: `onMouseEnter/Leave` → border glow + "View Dashboard →" label ปรากฏ
- StageCard `onClick` → `navigate('/stage/:id')`
- AlertCard: hover background เปลี่ยน
- YieldDonut: recharts Tooltip ที่ custom
- InsightCard: hover scale + border
- OEECard, TaktCycleCard: tooltip breakdown

---

### Phase 7 — Stage Detail Pages
**ไฟล์ที่สร้าง:** `StageDetail.jsx`

ทำ:
- Template เดียว รับ `stageId` จาก URL params
- แสดง parameters เฉพาะของ stage นั้น (จาก Flow and Param.md)
- Stage-to-parameter mapping:
  - slip-prep → Viscosity V0/V30, Concentration, Temperature, Casting Rate
  - glaze-prep → % Particle Size, Concentration, V0/V30, % Residue
  - casting → Mold Cycle, Mold NO., Caster NO.
  - drying → Drying Curve, % Moisture Content
  - spraying → Thickness, Sprayer NO., Robot NO.
  - firing → Temperature, Firing Cycle, Weight
- Back button → กลับ Dashboard

---

### Phase 8 — Other Pages (Skeleton)
**ไฟล์ที่สร้าง:** `Alerts.jsx` · `Reports.jsx` · `Settings.jsx`

ทำ:
- `Alerts.jsx`: ตาราง alert ทั้งหมด + filter by stage + resolve action
- `Reports.jsx`: Trend chart ย้อนหลัง (ใช้ DualAxisChart reuse)
- `Settings.jsx`: User profile + Threshold config UI

---

### Phase 9 — Dark Mode & Polish
ทำ (ทุกไฟล์):
- ตรวจทุก component ว่าใช้ CSS variables ถูกต้อง
- Dark mode toggle จาก Sidebar ใช้ DashboardContext
- Loading skeleton states
- Empty states (ไม่มีข้อมูล / ไม่ได้เลือก filter)

---

### Phase 10 — QA & Responsive Final
ทำ:
- ทดสอบทุก breakpoint: 375px / 768px / 1024px / 1440px
- ทดสอบ RightPanel Drawer บน mobile
- ทดสอบ navigation ครบทุก route
- ทดสอบ dark mode ทุกหน้า
- ทดสอบ hover states ทุก component

---

## 10. สรุป Deliverables ต่อ Phase

| Phase | สิ่งที่ได้ | ทดสอบด้วย |
|---|---|---|
| 0 | Project พร้อม run | `npm run dev` |
| 1 | Layout shell + Sidebar ทำงาน | Resize browser |
| 2 | Mock data + Context พร้อม | Console log |
| 3 | หน้า Dashboard ตรงกับภาพ | เทียบกับ fig-dash.png |
| 4 | Overview Strip ครบ 4 KPI | ตัวเลขแสดงถูกต้อง |
| 5 | Chart + Filter ทำงาน | เปลี่ยน filter → chart อัปเดต |
| 6 | Hover + Navigation ทำงาน | คลิก StageCard → ไป detail |
| 7 | 6 Stage pages | เปิดแต่ละ stage ดูข้อมูลต่างกัน |
| 8 | 3 หน้าที่เหลือ | Navigate ครบ |
| 9 | Dark mode + Polish | Toggle theme |
| 10 | Production-ready Demo | ทดสอบทุก device |

---

*SNK MES Dashboard · one-pd project*
*19 พฤษภาคม 2569*
