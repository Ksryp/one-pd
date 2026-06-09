# Phase A — SNK MES Digital Transformation

> อัปเดต: มิถุนายน 2569  
> ทีม: Kla + Claude  
> เป้าหมาย: ลดต้นทุน 2,300 → 1,700 บาท/Set ผ่านการลด Defect Loss ทุก Stage

---

## Overview

Phase A ประกอบด้วย 4 Step ที่เชื่อมกันเป็น chain:

```
[Step 0: Feasibility & Demo]  →  [Step 1: Defect Watchdog]  →  [Step 2: Defect Analysis]  →  [Step 3: Agentic AI]
   ศึกษา · Mockup · Demo จริง       รู้ทันที ที่ไหน เกิดอะไร      รู้สาเหตุ Parameter ไหน        AI Suggest → Human Decide
```

---

## Step 0 · Feasibility & Demo Preparation
**Understand Before Build**

> จุดประสงค์: ตรวจสอบความเป็นไปได้จริงก่อน build · สร้าง mockup ให้ทีมเห็นภาพ · Demo ด้วยข้อมูลจริงเพื่อ validate concept กับ COO / Production Manager

### P1 — Process Feasibility Study

**System / Backend**
- ศึกษา QR Code system ปัจจุบัน: fields ที่ scan ได้มีอะไรบ้าง
- Map data flow ทุก stage: ข้อมูลไหลจากไหน → ไปที่ไหน → format อะไร
- ระบุ Gap: parameter ไหน **มีอยู่แล้ว** / ไหน **ต้องเพิ่ม** sensor หรือ collection point
- ประเมิน technical feasibility ของ Step 1–3 บน infrastructure จริง

**one-pd Web App**
- `fig-dash.png` + `Flow and Param.md` — อ่านและทำความเข้าใจ reference ทั้งหมด
- ออกแบบ data schema เบื้องต้นให้ตรงกับ source ที่มีจริง

### P2 — Mockup (one-pd Dashboard)

**one-pd Web App**
- `mock.js` — ใส่ **sample data จริง** จากระบบที่มีอยู่แทน random mock `[NEW]`
- สร้าง high-fidelity mockup ของ Dashboard ทั้งหน้า อ้างอิง `fig-dash.png`
- Web App Phase 0–3: Bootstrap → Layout → Dashboard static
- Validate mockup กับ Production Manager ก่อนเดินหน้า Step 1

### P3 — Demo with Real Data

**System / Backend**
- Export sample data จริงจากระบบปัจจุบัน (Excel / CSV / DB query)
- เลือก 1–2 stage ที่มีข้อมูลพร้อมที่สุดมาทำ demo ก่อน

**one-pd Web App**
- นำ sample data จริงใส่ใน `mock.js` แทนตัวเลขสมมติ
- สร้าง demo ที่แสดง Dashboard + Notification + Chart จาก data จริง
- นำเสนอ Proof of Concept ต่อ COO / ทีม ก่อนเริ่ม build จริง

---

## Step 1 · Defect Watchdog
**Real-time Detection**

### P1 — API Pull from QR-Code Server

**System / Backend**
- ออกแบบ API endpoint `GET /defects`
- Map QR fields → defect record schema
- Fields: `stage`, `defect_type`, `count`, `timestamp`, `machine_id`, `shift`
- Test pull + log ข้อมูล real-time

**one-pd Web App**
- `mock.js` — เขียน defect schema ให้ตรงกับ API `[NEW]`
- `DashboardContext` — เพิ่ม defect data state
- `StageCard.jsx` — แสดง defect count badge ต่อ stage `[NEW]`
- `ProductionPipeline.jsx` — อ่านค่า defect จาก context

### P2 — Alarm & Notification System

**System / Backend**
- กำหนด threshold แต่ละ defect type ต่อ stage
- Alarm logic: rate เกิน threshold → trigger alert
- Alert schema: `id`, `level`, `stage`, `title`, `timestamp`, `resolved`
- Push notification channel (Line / Email)

**one-pd Web App**
- `NotificationPanel.jsx` — แสดง alert list real-time `[NEW]`
- `AlertCard.jsx` — level color (EMERGENCY / ABNORMAL / NORMAL) `[NEW]`
- `Sidebar.jsx` — badge dot บน "Alerts" nav item `[EDIT]`
- `Alerts.jsx` — ตาราง alert ทั้งหมด + resolve action `[NEW]`
- `StageCard.jsx` — status badge เปลี่ยนสีตาม alert level `[EDIT]`

---

## Step 2 · Defect Analysis
**Root Cause Intelligence**

### P1 — Collective Slip Parameter System

**System / Backend**
- Log V0, V30, Concentration, Casting Rate ทุก shift
- เชื่อม parameter record กับ defect count ของ shift เดียวกัน
- คำนวณ UCL / LCL ต่อ parameter

**one-pd Web App**
- `mock.js` — timeseries 24 จุดต่อ parameter + UCL/LCL values `[EDIT]`
- `FilterBar.jsx` — parameter multi-select (V0, V30, Conc…) `[NEW]`
- `DualAxisChart.jsx` — Line(param) + Bar(defect) + UCL/LCL dashed lines `[NEW]`
- `StageDetail.jsx` (slip-prep) — แสดง V0/V30/Conc/Casting Rate `[NEW]`

### P2 — Collective Casting Machine System

**System / Backend**
- Log Mold Cycle, Mold NO., Caster NO. ต่อ shift
- Map เครื่องแต่ละเครื่อง → defect rate ของเครื่องนั้น
- คำนวณน้ำดินที่ส่งออก × จำนวนหล่อ ต่อเครื่อง

**one-pd Web App**
- `StageDetail.jsx` (casting) — แสดง Mold Cycle / Caster NO. / Mold NO. `[EDIT]`
- `mock.js` — casting machine data per machine ID `[EDIT]`
- `ProductionMetrics.jsx` — slip in vs casting output ratio `[EDIT]`

### P3 — Analysis System

**System / Backend**
- Correlation score: parameter ↔ defect rate
- Trend ย้อนหลัง 7 / 30 วัน per parameter
- Export insights: peak hour, param at peak, correlation value

**one-pd Web App**
- `InsightPanel.jsx` — Peak Defect / Param at Peak / Correlation / Total `[NEW]`
- `Reports.jsx` — Trend chart ย้อนหลัง (reuse DualAxisChart) `[NEW]`
- `FilterBar.jsx` — date range picker (7d / 30d) `[EDIT]`

### P4 — Find Root Cause

**System / Backend**
- Rule-based: param เกิน UCL/LCL → tag สาเหตุ
- Pareto: defect type × parameter ranking
- ส่ง root cause payload → Step 3 AI

**one-pd Web App**
- `InsightPanel.jsx` — แสดง root cause tag ใต้ correlation card `[EDIT]`
- `DualAxisChart.jsx` — red dot เมื่อ param เกิน UCL/LCL `[EDIT]`
- `AIBar.jsx` — แสดง root cause hint + confidence % `[NEW]`

---

## Step 3 · Agentic AI
**Decision Intelligence**

### Function — Summary Data

**AI / Backend**
- รับ output จาก Step 1 + Step 2
- สรุป defect trend + parameter ที่ผิดปกติ
- Daily / Shift summary auto-generate → push JSON → API endpoint

**one-pd Web App**
- `Dashboard.jsx` — AI Summary banner บนสุดของหน้า `[NEW]`
- `Reports.jsx` — AI-generated shift/daily summary section `[EDIT]`

### Function — Suggest Solution

**AI / Backend**
- Map root cause → corrective action library
- Rank solutions ตาม confidence score
- Push suggestion payload → web

**one-pd Web App**
- `AIBar.jsx` — แสดง suggested action + confidence % `[EDIT]`
- `InsightPanel.jsx` — "Recommended Action" card `[EDIT]`

### Function — Helping for Decision

**AI / Backend**
- ให้ context + trade-off ต่อ Production Manager
- Log การตัดสินใจ + ผลลัพธ์จริง (feedback loop → improve model)

**one-pd Web App**
- `AIBar.jsx` — interactive: กด "Accept" / "Dismiss" suggestion `[EDIT]`
- `Settings.jsx` — threshold config + AI sensitivity `[NEW]`
- `Alerts.jsx` — resolve action log + outcome tracking `[EDIT]`

---

## Timeline

| สัปดาห์ | งาน | Milestone |
|---|---|---|
| W1 | Step 0 P1: Feasibility Study · Map data flow · ระบุ Gap | — |
| W2 | Step 0 P2–P3: Mockup + ดึง sample data จริง + Demo | **W2: Demo to COO** |
| W3 | Step 1 P1: QR API design + mock.js ใส่ data จริง | — |
| W4–5 | Step 1 P2: Alarm logic + Web Ph1–3 (Layout, Dashboard) | **W5: Dashboard Live** |
| W5–6 | Step 2 P1–P2: Parameter/Casting data + Web Ph4–5 (Charts) | — |
| W7–8 | Step 2 P3–P4: Analysis + Root Cause + Web Ph6–7 (Stage Detail) | **W8: Insight Ready** |
| W9–10 | Step 3: Agentic AI + Web Ph8–10 (Reports, Polish, QA) | **W10: AI Online** |
| W11 | Buffer: ทดสอบจริงกับโรงงาน + แก้ตาม feedback | **W11: Ship** |

---

## Component Legend

| Tag | ความหมาย |
|---|---|
| `[NEW]` | สร้าง component ใหม่ |
| `[EDIT]` | แก้ component ที่มีอยู่ให้รองรับ real data |

ทุก component ใช้ `mock.js` ก่อน → swap เป็น API จริงเมื่อ backend พร้อม

---

## กฎการทำงานร่วมกัน

- **Kla** — domain knowledge: กำหนด threshold, validate logic, ทดสอบกับข้อมูลจริง
- **Claude** — build code ฝั่ง web ทั้งหมด
- **Cadence** — 2–3 session/สัปดาห์ · session ละ 1–2 ชม.
- **Sync point** — backend เตรียม schema ก่อน → web ใช้ mock → swap API เมื่อพร้อม

---

*Phase A · SNK Factory Modernization · one-pd project*
