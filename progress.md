# ONE-PD · Progress Tracker
## SNK MES Dashboard

> อัปเดตล่าสุด: 19 พฤษภาคม 2569 · 13:45

---

## สถานะรวม

| Phase | ชื่อ | สถานะ | % |
|---|---|---|---|
| Phase 0 | Project Bootstrap | ✅ เสร็จแล้ว | 100% |
| Phase 1 | Layout Shell + Sidebar | ✅ เสร็จแล้ว | 100% |
| Phase 2 | Mock Data | ✅ เสร็จแล้ว | 100% |
| Phase 3 | Main Dashboard (Static) | ✅ เสร็จแล้ว | 100% |
| Phase 4 | Overview Strip | ✅ เสร็จแล้ว | 100% |
| Phase 5 | Parameter–Defect Card + Charts | ✅ เสร็จแล้ว | 100% |
| Phase 6 | Hover States & Navigation | ✅ เสร็จแล้ว | 100% |
| Phase 7 | Stage Detail Pages | ✅ เสร็จแล้ว | 100% |
| Phase 8 | Other Pages | ✅ เสร็จแล้ว | 100% |
| Phase 9 | Dark Mode & Polish | ✅ เสร็จแล้ว | 100% |
| Phase 10 | QA & Responsive Final | ✅ เสร็จแล้ว | 100% |
| **รวม** | **SNK MES Dashboard** | **✅ เสร็จสมบูรณ์** | **100%** |

**Legend:** ⬜ ยังไม่เริ่ม · 🔄 กำลังทำ · ✅ เสร็จแล้ว · ⏸ หยุดชั่วคราว · ❌ บล็อก

---

## Phase 0 — Project Bootstrap
✅ เสร็จแล้ว

- [x] `npm create vite@latest` → React
- [x] Install `react-router-dom` (v6.22.3)
- [x] Install `recharts` (v2.12.3)
- [x] Setup Tailwind CSS (v3.4.3)
- [x] `tailwind.config.js` — custom tokens (colors, fonts)
- [x] `index.css` — CSS variables light/dark theme ✓
- [x] `App.jsx` — Router + routes ครบทุกหน้า ✓
- [x] `main.jsx` ✓
- [x] ทดสอบ: `npm run dev` + Build dist/ ✓

**หมายเหตุ:** vite.config.js, postcss.config.js ตั้งค่าเรียบร้อย · dependencies ครบถ้วน

---

## Phase 1 — Layout Shell + Sidebar
✅ เสร็จแล้ว

- [x] `AppLayout.jsx` — flex row: Sidebar + Main + RightPanel ✓
- [x] `Sidebar.jsx` — nav items → MES context (Overview, Alerts, Reports) ✓
- [x] `Sidebar.jsx` — company name → SNK Ceramics ✓
- [x] `RightPanel.jsx` — wrapper + responsive logic ✓
- [x] `RightPanel.jsx` — FAB button (< 1024px) ✓
- [x] `RightPanel.jsx` — Drawer slide-in จากขวา ✓
- [x] `RightPanel.jsx` — Overlay backdrop + คลิกปิด ✓
- [x] `RightPanel.jsx` — Swipe-to-close (mobile) ✓
- [x] Dark mode toggle ผ่าน DashboardContext ✓
- [x] Responsive: 375px, 768px, 1024px, 1440px ทำงาน ✓

**หมายเหตุ:** Sidebar.jsx เก็บ CSS-in-JS ตามข้อกำหนด · RightPanel ทำงานเต็มที่ทุก breakpoint

---

## Phase 2 — Mock Data
✅ เสร็จแล้ว

- [x] `data/mock.js` — pipeline (6 stages + status) ✓
- [x] `data/mock.js` — overview (OEE, Takt, WIP, MTTR) ✓
- [x] `data/mock.js` — timeseries parameter 24 จุด ✓
- [x] `data/mock.js` — UCL/LCL ทุก parameter ✓
- [x] `data/mock.js` — defect data 5 ประเภท ✓
- [x] `data/mock.js` — notifications 3 รายการ ✓
- [x] `data/mock.js` — yield (Clay + Firing) ✓
- [x] `data/mock.js` — metrics (Slip In/Yield/Warehouse) ✓
- [x] `context/DashboardContext.jsx` — global state ✓

**หมายเหตุ:** Mock data สมบูรณ์ · DashboardContext ใช้ร่วมกันทุก component

---

## Phase 3 — Main Dashboard (Static)
✅ เสร็จแล้ว

- [x] `Dashboard.jsx` — compose ทุก section ✓
- [x] `StageCard.jsx` — status badge 4 states (EMERGENCY, ABNORMAL, NORMAL, MAINTENANCE) ✓
- [x] `StageCard.jsx` — stage name + timestamp ✓
- [x] `ProductionPipeline.jsx` — 6 cards เรียง row ✓
- [x] `AlertCard.jsx` — level color + title + text + timestamp ✓
- [x] `NotificationPanel.jsx` — header + badge dot + list ✓
- [x] `YieldDonut.jsx` — recharts PieChart + legend + % center ✓
- [x] `YieldDonut.jsx` — reusable (Clay + Firing) ✓
- [x] `ProductionMetrics.jsx` — Slip In / Slip Yield / Warehouse In ✓
- [x] Layout เทียบกับ fig-dash.png ✓

**หมายเหตุ:** Dashboard render ถูกต้อง · ใช้ CSS variables + Tailwind

---

## Phase 4 — Overview Strip
✅ เสร็จแล้ว

- [x] `OverviewStrip.jsx` — container 4 KPI ✓
- [x] `OEECard.jsx` — donut recharts + tooltip ✓
- [x] `OEECard.jsx` — time range slider ✓
- [x] `TaktCycleCard.jsx` — 2 ตัวเลข + สีสถานะ ✓
- [x] `WIPCard.jsx` — ตัวเลข + progress bar + sub-label ✓
- [x] `MTTRCard.jsx` — ตัวเลขนาที + vs target + incident count ✓
- [x] Color state logic: green / amber / red ทุก card ✓

**หมายเหตุ:** OEE/Takt/WIP/MTTR cards ทำงาน · Status-color logic นำมาจาก mock data

---

## Phase 5 — Parameter–Defect Card + Charts
✅ เสร็จแล้ว

- [x] `FilterBar.jsx` — Parameter multi-select dropdown ✓
- [x] `FilterBar.jsx` — Defect chips (เลือกได้ 1) ✓
- [x] `FilterBar.jsx` — Model / Views / Date dropdowns ✓
- [x] `DualAxisChart.jsx` — recharts ComposedChart ✓
- [x] `DualAxisChart.jsx` — Line (parameter) + Bar (defect) ✓
- [x] `DualAxisChart.jsx` — UCL/LCL dashed lines ✓
- [x] `DualAxisChart.jsx` — จุดสีแดงเมื่อเกิน limit ✓
- [x] `DualAxisChart.jsx` — Custom Tooltip ✓
- [x] `InsightPanel.jsx` — Peak Defect card ✓
- [x] `InsightPanel.jsx` — Param at Peak card ✓
- [x] `InsightPanel.jsx` — Correlation card ✓
- [x] `InsightPanel.jsx` — Total Defect card ✓
- [x] `AIBar.jsx` — blue bar + icon + text + confidence % ✓
- [x] Filter → Chart reactivity ✓

**หมายเหตุ:** ParameterDefectCard ทำงาน · Insights render จากตรรมชาติของ mock data

---

## Phase 6 — Hover States & Navigation
✅ เสร็จแล้ว

- [x] `StageCard` — hover: border glow + shadow ✓
- [x] `StageCard` — hover: label "View Dashboard →" ✓
- [x] `StageCard` — click: navigate('/stage/:id') ✓
- [x] `AlertCard` — hover: background + border accent ✓
- [x] `YieldDonut` — hover: recharts custom tooltip ✓
- [x] `OEECard` — hover: tooltip breakdown ✓
- [x] `InsightCard` — hover: scale + border accent ✓
- [x] `ProductionMetrics` — hover: background change ✓
- [x] Navigation ทุก stage + interactive elements ✓

**หมายเหตุ:** Hover transitions smooth 200ms · Navigation ผ่าน React Router

---

## Phase 7 — Stage Detail Pages
✅ เสร็จแล้ว

- [x] `StageDetail.jsx` — template รับ stageId จาก URL ✓
- [x] slip-prep → Viscosity V0/V30, Concentration, Temperature, Casting Rate ✓
- [x] glaze-prep → % Particle Size, Concentration, V0/V30, % Residue ✓
- [x] casting → Mold Cycle, Mold NO., Caster NO. ✓
- [x] drying → Drying Curve, % Moisture Content ✓
- [x] spraying → Thickness, Sprayer NO., Robot NO. ✓
- [x] firing → Temperature, Firing Cycle, Weight ✓
- [x] Back button → กลับ Dashboard ✓
- [x] ทุก stage → ข้อมูลต่างกัน ✓

**หมายเหตุ:** StageDetail dynamic params ตาม stage-param mapping

---

## Phase 8 — Other Pages
✅ เสร็จแล้ว

- [x] `Alerts.jsx` — alert list + filtering ✓
- [x] `Alerts.jsx` — filter by stage ✓
- [x] `Alerts.jsx` — resolve action logic ✓
- [x] `Reports.jsx` — trend chart + date range ✓
- [x] `Settings.jsx` — User profile UI ✓
- [x] `Settings.jsx` — Threshold config UI ✓
- [x] `ManualKeyIn.jsx` — data entry page ✓
- [x] Detail pages (OEE/Takt/WIP/MTTR) ✓

**หมายเหตุ:** ทั้งหมดใช้ DashboardContext + Responsive design

---

## Phase 9 — Dark Mode & Polish
✅ เสร็จแล้ว

- [x] CSS variables ทั้งหมด (light/dark) ✓
- [x] Dark mode toggle ผ่าน DashboardContext ✓
- [x] Loading skeleton states ✓
- [x] Empty state handling ✓
- [x] Transitions + animations smooth ✓
- [x] Font weights + typography ✓

**หมายเหตุ:** `--bg-page`, `--bg-card`, `--text-primary` ฯลฯ ใช้ทั่วไป · Dark mode toggle ผ่าน Sidebar

---

## Phase 10 — QA & Responsive Final
✅ เสร็จแล้ว

- [x] ทดสอบ 375px (mobile) ✓
- [x] ทดสอบ 768px (tablet portrait) ✓
- [x] ทดสอบ 1024px (tablet landscape) ✓
- [x] ทดสอบ 1440px (desktop) ✓
- [x] RightPanel Drawer บน mobile ทำงาน ✓
- [x] Navigation ครบทุก route (/dashboard, /stage/:id, /alerts, /reports, /settings) ✓
- [x] Dark mode ทั้ง app ✓
- [x] Hover states ทุก interactive element ✓
- [x] Build + dist/ production ready ✓

**หมายเหตุ:** `npm run build` ✓ · `npm run preview` ✓ · สำเร็จสมบูรณ์

---

## Issues / Blockers

| # | รายละเอียด | Phase | สถานะ |
|---|---|---|---|
| — | — | — | — |

---

## Notes / Decisions

| วันที่ | รายการ |
|---|---|
| 19 พ.ค. 2569 | เริ่มโปรเจค · วิเคราะห์จาก fig-dash.png |
| 19 พ.ค. 2569 | Tech: Vite + React Router + Tailwind + Recharts |
| 19 พ.ค. 2569 | Font: Inter · Accent: #1E6FCC |
| 19 พ.ค. 2569 | Responsive: RightPanel เป็น Drawer < 1024px |
| 19 พ.ค. 2569 13:45 | ✅ **Project Complete** — ทั้ง 10 Phases เสร็จแล้ว (100%) |
| 19 พ.ค. 2569 13:45 | Built + Production ready · npm run dev/build/preview ทำงาน |
| 19 พ.ค. 2569 13:45 | ตรวจ: 31 JSX files · Mock data complete · DashboardContext centralized |
