# ONE-PD · Progress Tracker
## SNK MES Dashboard

> อัปเดตล่าสุด: 19 พฤษภาคม 2569

---

## สถานะรวม

| Phase | ชื่อ | สถานะ | % |
|---|---|---|---|
| Phase 0 | Project Bootstrap | ⬜ ยังไม่เริ่ม | 0% |
| Phase 1 | Layout Shell + Sidebar | ⬜ ยังไม่เริ่ม | 0% |
| Phase 2 | Mock Data | ⬜ ยังไม่เริ่ม | 0% |
| Phase 3 | Main Dashboard (Static) | ⬜ ยังไม่เริ่ม | 0% |
| Phase 4 | Overview Strip | ⬜ ยังไม่เริ่ม | 0% |
| Phase 5 | Parameter–Defect Card + Charts | ⬜ ยังไม่เริ่ม | 0% |
| Phase 6 | Hover States & Navigation | ⬜ ยังไม่เริ่ม | 0% |
| Phase 7 | Stage Detail Pages | ⬜ ยังไม่เริ่ม | 0% |
| Phase 8 | Other Pages | ⬜ ยังไม่เริ่ม | 0% |
| Phase 9 | Dark Mode & Polish | ⬜ ยังไม่เริ่ม | 0% |
| Phase 10 | QA & Responsive Final | ⬜ ยังไม่เริ่ม | 0% |

**Legend:** ⬜ ยังไม่เริ่ม · 🔄 กำลังทำ · ✅ เสร็จแล้ว · ⏸ หยุดชั่วคราว · ❌ บล็อก

---

## Phase 0 — Project Bootstrap
⬜ ยังไม่เริ่ม

- [ ] `npm create vite@latest` → React
- [ ] Install `react-router-dom`
- [ ] Install `recharts`
- [ ] Setup Tailwind CSS
- [ ] `tailwind.config.js` — custom tokens (colors, fonts)
- [ ] `index.css` — CSS variables light/dark theme
- [ ] `App.jsx` — Router + routes ครบทุกหน้า
- [ ] `main.jsx`
- [ ] ทดสอบ: `npm run dev` เห็นหน้าว่าง ✓

**หมายเหตุ:**

---

## Phase 1 — Layout Shell + Sidebar
⬜ ยังไม่เริ่ม

- [ ] `AppLayout.jsx` — flex row: Sidebar + Main + RightPanel
- [ ] `Sidebar.jsx` — ปรับ nav items → MES context
- [ ] `Sidebar.jsx` — ปรับ company name/logo → SNK
- [ ] `RightPanel.jsx` — wrapper + responsive logic
- [ ] `RightPanel.jsx` — FAB button (< 1024px)
- [ ] `RightPanel.jsx` — Drawer slide-in จากขวา
- [ ] `RightPanel.jsx` — Overlay backdrop + คลิกปิด
- [ ] `RightPanel.jsx` — Swipe-to-close (mobile)
- [ ] Dark mode toggle ทำงานกับ CSS variables
- [ ] ทดสอบ: resize ครบ 4 breakpoints ✓

**หมายเหตุ:**

---

## Phase 2 — Mock Data
⬜ ยังไม่เริ่ม

- [ ] `data/mock.js` — pipeline (6 stages + status)
- [ ] `data/mock.js` — overview (OEE, Takt, WIP, MTTR)
- [ ] `data/mock.js` — timeseries parameter 24 จุด
- [ ] `data/mock.js` — UCL/LCL ทุก parameter
- [ ] `data/mock.js` — defect data 5 ประเภท
- [ ] `data/mock.js` — notifications 3 รายการ
- [ ] `data/mock.js` — yield (Clay + Firing)
- [ ] `data/mock.js` — metrics (Slip In/Yield/Warehouse)
- [ ] `context/DashboardContext.jsx` — global state

**หมายเหตุ:**

---

## Phase 3 — Main Dashboard (Static)
⬜ ยังไม่เริ่ม

- [ ] `Dashboard.jsx` — compose ทุก section
- [ ] `StageCard.jsx` — status badge 4 states
- [ ] `StageCard.jsx` — stage name + timestamp
- [ ] `ProductionPipeline.jsx` — 6 cards เรียง row
- [ ] `AlertCard.jsx` — level color + title + text + timestamp
- [ ] `NotificationPanel.jsx` — header + badge dot + list
- [ ] `YieldDonut.jsx` — recharts PieChart + legend + % center
- [ ] `YieldDonut.jsx` — ใช้ได้ทั้ง Clay และ Firing (reusable)
- [ ] `ProductionMetrics.jsx` — Slip In / Slip Yield / Warehouse In
- [ ] ทดสอบ: เทียบกับ fig-dash.png ✓

**หมายเหตุ:**

---

## Phase 4 — Overview Strip
⬜ ยังไม่เริ่ม

- [ ] `OverviewStrip.jsx` — container 4 KPI
- [ ] `OEECard.jsx` — donut recharts
- [ ] `OEECard.jsx` — time range slider
- [ ] `TaktCycleCard.jsx` — 2 ตัวเลข + สีสถานะ
- [ ] `WIPCard.jsx` — ตัวเลข + progress bar + sub-label
- [ ] `MTTRCard.jsx` — ตัวเลขนาที + vs target + incident count
- [ ] Color state logic: green / amber / red ทุก card

**หมายเหตุ:**

---

## Phase 5 — Parameter–Defect Card + Charts
⬜ ยังไม่เริ่ม

- [ ] `FilterBar.jsx` — Parameter multi-select dropdown
- [ ] `FilterBar.jsx` — Defect chips (เลือกได้ 1)
- [ ] `FilterBar.jsx` — Model / Views / Date dropdowns
- [ ] `DualAxisChart.jsx` — recharts ComposedChart
- [ ] `DualAxisChart.jsx` — Line (parameter) + Bar (defect)
- [ ] `DualAxisChart.jsx` — UCL/LCL dashed lines
- [ ] `DualAxisChart.jsx` — จุดสีแดงเมื่อเกิน limit
- [ ] `DualAxisChart.jsx` — Custom Tooltip
- [ ] `InsightPanel.jsx` — Peak Defect card
- [ ] `InsightPanel.jsx` — Param at Peak card
- [ ] `InsightPanel.jsx` — Correlation card
- [ ] `InsightPanel.jsx` — Total Defect card
- [ ] `AIBar.jsx` — blue bar + icon + text + confidence %
- [ ] ทดสอบ: เปลี่ยน filter → chart อัปเดต ✓

**หมายเหตุ:**

---

## Phase 6 — Hover States & Navigation
⬜ ยังไม่เริ่ม

- [ ] `StageCard` — hover: border glow (status color)
- [ ] `StageCard` — hover: label "View Dashboard →"
- [ ] `StageCard` — click: navigate('/stage/:id')
- [ ] `AlertCard` — hover: background + border left
- [ ] `YieldDonut` — hover: recharts custom tooltip
- [ ] `OEECard` — hover: tooltip breakdown 3 ตัว
- [ ] `InsightCard` — hover: scale + border accent
- [ ] `ProductionMetrics` — hover: background change
- [ ] ทดสอบ: hover ทุก component + navigate ทุก stage ✓

**หมายเหตุ:**

---

## Phase 7 — Stage Detail Pages
⬜ ยังไม่เริ่ม

- [ ] `StageDetail.jsx` — template รับ stageId จาก URL
- [ ] slip-prep → Viscosity V0/V30, Concentration, Temperature, Casting Rate
- [ ] glaze-prep → % Particle Size, Concentration, V0/V30, % Residue
- [ ] casting → Mold Cycle, Mold NO., Caster NO.
- [ ] drying → Drying Curve, % Moisture Content
- [ ] spraying → Thickness, Sprayer NO., Robot NO.
- [ ] firing → Temperature, Firing Cycle, Weight
- [ ] Back button → กลับ Dashboard
- [ ] ทดสอบ: เปิดทุก stage → ข้อมูลต่างกัน ✓

**หมายเหตุ:**

---

## Phase 8 — Other Pages
⬜ ยังไม่เริ่ม

- [ ] `Alerts.jsx` — ตารางทุก alert
- [ ] `Alerts.jsx` — filter by stage
- [ ] `Alerts.jsx` — resolve action
- [ ] `Reports.jsx` — trend chart ย้อนหลัง
- [ ] `Settings.jsx` — User profile UI
- [ ] `Settings.jsx` — Threshold config UI

**หมายเหตุ:**

---

## Phase 9 — Dark Mode & Polish
⬜ ยังไม่เริ่ม

- [ ] ตรวจทุก component — CSS variables ถูกต้อง
- [ ] Dark mode toggle ผ่าน DashboardContext
- [ ] Loading skeleton states
- [ ] Empty state — ไม่มีข้อมูล
- [ ] Empty state — ไม่ได้เลือก filter

**หมายเหตุ:**

---

## Phase 10 — QA & Responsive Final
⬜ ยังไม่เริ่ม

- [ ] ทดสอบ 375px (mobile)
- [ ] ทดสอบ 768px (tablet portrait)
- [ ] ทดสอบ 1024px (tablet landscape)
- [ ] ทดสอบ 1440px (desktop)
- [ ] RightPanel Drawer บน mobile ทำงาน
- [ ] Navigation ครบทุก route
- [ ] Dark mode ทุกหน้า
- [ ] Hover states ทุก component

**หมายเหตุ:**

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
