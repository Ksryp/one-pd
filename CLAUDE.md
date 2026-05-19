# CLAUDE.md — ONE-PD / SNK MES Dashboard

> อ่านไฟล์นี้ก่อนทุกครั้งที่เริ่ม session ใหม่
> อ้างอิง `one-pd-details.md` สำหรับ spec ละเอียด · `progress.md` สำหรับสถานะปัจจุบัน

---

## 1. Project Identity

**ชื่อโปรเจค:** SNK MES Dashboard (one-pd)
**ระบบ:** Manufacturing Execution System — โรงงานเซรามิค SNK
**ผู้ใช้:** Production Manager · MD · C-Level
**หน้าหลัก:** Dashboard overview + 6 Stage Detail pages + Alerts + Reports + Settings
**ภาพ reference:** `fig-dash.png` — ใช้เป็น ground truth ของ layout และ data

---

## 2. Commands

```bash
# ติดตั้ง (ครั้งแรก)
npm install

# Dev server
npm run dev        # http://localhost:5173

# Build
npm run build

# Preview build
npm run preview
```

---

## 3. Tech Stack

| Layer | เครื่องมือ | หมายเหตุ |
|---|---|---|
| Bundler | Vite | |
| UI | React 18 | JSX |
| Routing | React Router v6 | `createBrowserRouter` |
| Styling | Tailwind CSS | + CSS Variables สำหรับ theme |
| Charts | Recharts | PieChart, ComposedChart |
| Icons | SVG inline | ไม่ใช้ icon library |
| State | React Context + useState | ไม่ใช้ Redux |
| Data | `src/data/mock.js` | JSON object |

---

## 4. Design Tokens (อ้างอิงก่อน style ทุกครั้ง)

### Colors — Light Theme
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

### Colors — Dark Theme
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

### Status Colors (ใช้ทั้ง light/dark)
```
EMERGENCY  bg:#FEE2E2  text:#991B1B  border:#DC2626
ABNORMAL   bg:#FEF3C7  text:#92400E  border:#D97706
NORMAL     bg:#DCFCE7  text:#166534  border:#16A34A
MAINTENANCE bg:#F3F4F6 text:#374151  border:#9CA3AF
```

### Typography
```
Font: Inter (มีใน Sidebar.jsx อยู่แล้ว — ไม่ต้อง import ซ้ำ)
Numbers: font-variant-numeric: tabular-nums
Scale: 11 · 12 · 14 · 16 · 20 · 24 · 32px
```

### Breakpoints
```
mobile:  < 768px   → RightPanel ซ่อน, Sidebar overlay
tablet:  768–1023px → RightPanel เป็น Drawer (FAB button)
laptop:  1024–1279px → Full layout, RightPanel แคบลง
desktop: ≥ 1280px  → Full layout (design base 1440×900)
```

---

## 5. Sidebar.jsx — Integration Rule

**⚠️ สำคัญ:** `Sidebar.jsx` ใช้ CSS-in-JS (CSS string inject ผ่าน `<style>`) — **ห้าม migrate เป็น Tailwind**

- เก็บ Sidebar.jsx ในรูปแบบเดิมทุกอย่าง
- แก้ได้เฉพาะ: nav items data, company name/logo, user profile
- component อื่นทั้งหมดใช้ Tailwind + CSS variables
- Sidebar ต่อเข้า `AppLayout.jsx` โดยตรง

**Nav items ที่ต้องใช้ใน Sidebar:**
```js
const NAV_TOP = [
  { id: "overview",  label: "MES Overview", notification: false, badge: null },
  { id: "alerts",    label: "Alerts",       notification: true,  badge: null },
  { id: "reports",   label: "Reports",      notification: false, badge: null },
]
// Routes section → ซ่อน หรือใช้เป็น stage shortcuts
// Bottom → Settings, Support (เหมือนเดิม)
```

---

## 6. Routing Map

```
/                     → pages/Dashboard.jsx
/stage/slip-prep      → pages/StageDetail.jsx  (stageId = "slip-prep")
/stage/glaze-prep     → pages/StageDetail.jsx  (stageId = "glaze-prep")
/stage/casting        → pages/StageDetail.jsx  (stageId = "casting")
/stage/drying         → pages/StageDetail.jsx  (stageId = "drying")
/stage/spraying       → pages/StageDetail.jsx  (stageId = "spraying")
/stage/firing         → pages/StageDetail.jsx  (stageId = "firing")
/alerts               → pages/Alerts.jsx
/reports              → pages/Reports.jsx
/settings             → pages/Settings.jsx
```

---

## 7. Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx       ← Sidebar + Main + RightPanel wrapper
│   │   ├── RightPanel.jsx      ← Drawer logic สำหรับ mobile/tablet
│   │   └── Sidebar.jsx         ← ห้ามเปลี่ยน style
│   ├── pipeline/
│   │   ├── ProductionPipeline.jsx
│   │   └── StageCard.jsx
│   ├── overview/
│   │   ├── OverviewStrip.jsx
│   │   ├── OEECard.jsx
│   │   ├── TaktCycleCard.jsx
│   │   ├── WIPCard.jsx
│   │   └── MTTRCard.jsx
│   ├── parameter-defect/
│   │   ├── ParameterDefectCard.jsx
│   │   ├── FilterBar.jsx
│   │   ├── DualAxisChart.jsx
│   │   ├── InsightPanel.jsx
│   │   └── AIBar.jsx
│   ├── notification/
│   │   ├── NotificationPanel.jsx
│   │   └── AlertCard.jsx
│   ├── yield/
│   │   └── YieldDonut.jsx      ← reusable props: { title, value, segments, target }
│   └── metrics/
│       └── ProductionMetrics.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── StageDetail.jsx
│   ├── Alerts.jsx
│   ├── Reports.jsx
│   └── Settings.jsx
├── data/
│   └── mock.js
├── context/
│   └── DashboardContext.jsx
├── App.jsx
├── main.jsx
└── index.css
```

---

## 8. Component Conventions

### Props Naming
```jsx
// Status → ใช้ string ตรงๆ ไม่ใช้ enum
status="EMERGENCY" | "ABNORMAL" | "NORMAL" | "MAINTENANCE"

// YieldDonut — reusable interface
<YieldDonut
  title="CLAY YIELD"
  value={86}
  segments={[
    { label: "Good",   value: 10234, color: "#16A34A" },
    { label: "Repair", value: 623,   color: "#D97706" },
    { label: "Scrap",  value: 748,   color: "#DC2626" },
  ]}
  target={90}
/>
```

### Hover State Pattern
```jsx
// ทุก card ที่ navigate ได้ → ใช้ pattern นี้
<div
  className="... cursor-pointer transition-all duration-200
             hover:shadow-md hover:border-[var(--accent)]"
  onClick={() => navigate('/stage/slip-prep')}
>
```

### CSS Variable ใน Tailwind
```jsx
// ใช้ arbitrary value สำหรับ CSS variables
className="bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border)]"
```

---

## 9. State Management

### Global (DashboardContext)
```js
{
  theme: "light" | "dark",           // toggle จาก Sidebar
  selectedDate: "today" | "yesterday" | string,
  selectedDefect: "all" | "pinhole" | "crack" | "discoloration" | "deformation" | "grain-size",
  selectedParameter: string[],       // multi-select
  selectedModel: string,
  selectedView: "hour" | "batch",
  alerts: Alert[],
  setTheme, setSelectedDate, ...     // setters
}
```

### Local State (ใน component)
- Hover states
- Dropdown open/close
- RightPanel drawer open/close
- Chart tooltip

---

## 10. Parameter → Defect Mapping
(จาก `Flow and Param.md`)

| Parameter | Stage | หน่วย | Defect หลัก |
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

### Stage → Parameters (ใน StageDetail.jsx)
```js
const STAGE_PARAMS = {
  "slip-prep":  ["viscosity_v0", "viscosity_v30", "concentration", "temperature", "casting_rate"],
  "glaze-prep": ["particle_size", "concentration", "viscosity_v0", "residue"],
  "casting":    ["mold_cycle", "mold_no", "caster_no"],
  "drying":     ["drying_curve", "moisture_content"],
  "spraying":   ["thickness", "sprayer_no", "robot_no"],
  "firing":     ["temperature", "firing_cycle", "weight"],
}
```

---

## 11. Do's and Don'ts

### ✅ Do
- อ้างอิง `fig-dash.png` เสมอเมื่อไม่แน่ใจเรื่อง layout
- ใช้ CSS variables สำหรับทุกสี (`var(--bg-card)` ไม่ใช่ hardcode)
- เขียน component ให้ reusable — `YieldDonut` ใช้ได้ทั้ง Clay และ Firing
- ทุก interactive element ต้องมี hover state
- ใช้ `tabular-nums` กับตัวเลขทุกตัว

### ❌ Don't
- **ห้าม** แก้ CSS string ใน `Sidebar.jsx`
- **ห้าม** hardcode hex color โดยไม่ผ่าน CSS variable
- **ห้าม** ใช้ localStorage (ใช้ Context แทน)
- **ห้าม** สร้าง page ใหม่นอก `/pages/` folder
- **ห้าม** install chart library อื่นนอกจาก Recharts

---

## 12. Current Status

ดูสถานะปัจจุบันได้ที่ `progress.md`

**เริ่มต้นที่:** Phase 0 — Project Bootstrap
