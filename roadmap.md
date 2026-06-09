# SNK MES Dashboard — Project Roadmap

> อ้างอิง `CLAUDE.md` สำหรับ spec และ convention · อัปเดต `progress.md` เมื่อแต่ละ step เสร็จ

**Timeline รวม:** ~4–5 สัปดาห์ (มี Claude ช่วยเขียนโค้ดและ config)
**Stack:** React/Vite · FastAPI · TimescaleDB · Redis · EMQX · Keycloak · Kong · Node-RED · Tailscale · Grafana

---

## สัญลักษณ์

| สัญลักษณ์ | ความหมาย |
|---|---|
| 🤖 | Claude เขียนให้ได้เลย |
| 👤 | ต้องทำเอง (physical / approve) |
| 🤝 | ทำด้วยกัน |
| ⚠️ | Critical — ต้องระวัง |
| ✅ | เสร็จแล้ว |
| 🔄 | กำลังทำ |
| ⏳ | รอ dependency |

---

## Phase 0 — Project Bootstrap & UI Foundation
**ระยะเวลา:** 3–5 วัน · **สถานะ:** 🔄 กำลังทำ

> ทำ UI ให้ครบด้วย mock data ก่อน — ไม่รอ backend

- [ ] 🤖 Setup Vite + React + Tailwind CSS
  - config CSS variables (light/dark theme)
  - `createBrowserRouter` routing ครบทุก path
  - `index.css` design tokens

- [ ] 🤖 `Sidebar.jsx` + `AppLayout.jsx`
  - ⚠️ ห้ามแก้ CSS string ใน Sidebar.jsx
  - nav items: MES Overview, Alerts, Reports
  - dark/light theme toggle
  - mobile responsive (overlay drawer)

- [ ] 🤖 Mock data structure (`src/data/mock.js`)
  - ครอบคลุม: stages, KPI, alerts, parameters, defects
  - ใช้เป็น ground truth จนกว่า backend จะพร้อม

- [ ] 🤖 `Dashboard.jsx` — หน้าหลัก
  - `ProductionPipeline.jsx` + `StageCard.jsx`
  - `OverviewStrip.jsx` (OEE, Takt, WIP, MTTR)
  - `YieldDonut.jsx` (Clay + Firing)
  - `NotificationPanel.jsx`

- [ ] 🤖 `StageDetail.jsx` — 6 stages
  - slip-prep · glaze-prep · casting · drying · spraying · firing
  - `ParameterDefectCard.jsx` + `DualAxisChart.jsx`
  - `FilterBar.jsx` + `InsightPanel.jsx`

- [ ] 🤖 `Alerts.jsx` / `Reports.jsx` / `Settings.jsx`
  - โครงสร้างหน้าครบ พร้อม mock data

---

## Phase 1 — Cloud VPS Infrastructure
**ระยะเวลา:** 1–2 วัน · **สถานะ:** ⏳ รอ Phase 0

> ตั้ง server บน cloud ให้ frontend เรียกได้จาก internet

- [ ] 👤 เช่า Cloud VPS
  - แนะนำ: Hetzner CX21 (€6/mo) หรือ DigitalOcean $6/mo
  - OS: Ubuntu 22.04 LTS
  - ติดตั้ง Docker + Docker Compose

- [ ] 👤 Cloudflare account + domain
  - ชี้ A record ไป VPS IP
  - เปิด Cloudflare proxy (Free plan)
  - HTTPS auto via Cloudflare

- [ ] 🤖 `docker-compose.yml` — Cloud stack
  - Keycloak (Auth/SSO)
  - Kong Gateway (API Gateway)
  - Redis (Cache)
  - EMQX (MQTT Message Broker)
  - Certbot / SSL config

- [ ] 🤖 Keycloak config
  - สร้าง realm: `snk-mes`
  - สร้าง client สำหรับ frontend
  - กำหนด roles: `admin` · `manager` · `viewer`

- [ ] 🤖 Kong Gateway config
  - route `/api/*` → FastAPI backend
  - JWT plugin ต่อ Keycloak
  - rate limiting plugin

---

## Phase 2 — Backend API + Cloud Database
**ระยะเวลา:** 3–4 วัน · **สถานะ:** ⏳ รอ Phase 1

> เขียน API ให้ frontend ดึงข้อมูลได้จริง

- [ ] 🤖 TimescaleDB schema (Cloud)
  ```sql
  -- tables หลัก
  production_data   -- raw sensor readings (time-series)
  kpi_snapshots     -- OEE, Takt, MTTR, Yield ทุก 1 นาที
  alerts            -- alert events + status
  defect_records    -- defect counts per stage per batch
  users             -- user accounts
  ```

- [ ] 🤖 FastAPI Backend
  - `GET /api/kpi` — OEE, Takt Time, WIP, MTTR
  - `GET /api/stages` — status ทุก stage
  - `GET /api/stage/{id}` — parameter + defect ของ stage
  - `GET /api/alerts` — alert list + filter
  - `GET /api/reports` — historical data + export CSV
  - JWT auth middleware ต่อ Keycloak
  - Redis cache layer (TTL 30 วินาที)

- [ ] 🤖 Deploy Frontend ไป Cloudflare Pages
  - git push → auto deploy
  - config `VITE_API_URL` → VPS backend
  - `VITE_KEYCLOAK_URL` → Keycloak

- [ ] 🤖 ⚠️ Switch mock.js → Real API
  - แทนที่ mock data ด้วย React Query
  - loading states + error states ทุก component
  - fallback UI กรณี API ล่ม

- [ ] 🤖 EMQX MQTT topics structure
  ```
  snk/stage/slip-prep/data
  snk/stage/casting/data
  snk/alerts/new
  snk/kpi/snapshot
  ```

---

## Phase 3 — Factory Infrastructure
**ระยะเวลา:** 1–2 สัปดาห์ · **สถานะ:** ⏳ (ทำคู่ขนานกับ Phase 1–2 ได้)

> ตั้ง infrastructure ในโรงงาน — ส่วนนี้ต้องทำ physical เอง

- [ ] 👤 ⚠️ ติดตั้ง OPNsense Firewall
  - mini-PC หรือ hardware firewall ในโรงงาน
  - config VLAN แยก OT network ออกจาก IT network
  - firewall rules: เปิดเฉพาะ port ที่จำเป็น

- [ ] 👤 ติดตั้ง Tailscale VPN
  - ติดตั้งบน factory server
  - ติดตั้งบน cloud VPS
  - ทดสอบ tunnel ส่งข้อมูลได้ทั้ง 2 ทาง
  - (ใช้เวลาจริงไม่เกิน 1 ชั่วโมง)

- [ ] 🤖 Node-RED flows
  - flow: PLC/Sensor → OPC-UA/Modbus → MQTT topics
  - flow: data validation + anomaly detection เบื้องต้น
  - flow: push ไป Mosquitto local broker

- [ ] 🤖 Mosquitto MQTT broker config
  - bridge config ส่ง topics ไป EMQX บน Cloud ผ่าน Tailscale
  - TLS encryption

- [ ] 🤖 Factory PostgreSQL + TimescaleDB
  - เก็บ raw data local ในโรงงาน
  - logical replication → Cloud TimescaleDB ผ่าน Tailscale VPN

- [ ] 🤖 Pre-Calc Server scripts (Python)
  - คำนวณ OEE, Takt Time, MTTR, Yield จาก raw data
  - run ทุก 1 นาที via cron
  - insert ผลลัพธ์ลง `kpi_snapshots`

---

## Phase 4 — Real Data Integration & Alerts
**ระยะเวลา:** 1 สัปดาห์ · **สถานะ:** ⏳ รอ Phase 2+3

> เชื่อมข้อมูลจริงจากโรงงานเข้า dashboard

- [ ] 👤 ⚠️ Connect real sensor/PLC data
  - map parameter จริงลง Node-RED flows
  - Viscosity V0/V30 · Moisture% · Temperature · Thickness · Mold Cycle
  - validate ค่าที่รับเข้ามา (range check)

- [ ] 🤖 Real-time dashboard via MQTT WebSocket
  - Frontend subscribe EMQX WebSocket
  - KPI cards update อัตโนมัติ ไม่ต้อง reload
  - แสดง timestamp ล่าสุดของข้อมูล

- [ ] 🤖 Alert engine
  - rule-based: parameter เกิน threshold → สร้าง alert
  - severity levels: NORMAL · ABNORMAL · EMERGENCY
  - push notification ไปยัง NotificationPanel
  - เชื่อม Alerts.jsx แสดงผล real-time

- [ ] 🤖 Parameter → Defect correlation
  - `DualAxisChart.jsx` แสดง parameter vs defect rate
  - ใช้ mapping จาก `CLAUDE.md` section 10
  - filter ตาม defect type และ stage

- [ ] 🤖 Historical Reports
  - `Reports.jsx` ดึงข้อมูลย้อนหลังจาก TimescaleDB
  - date range picker
  - export CSV
  - กราฟ trend รายวัน/รายสัปดาห์

---

## Phase 5 — Monitoring, Security & Go-Live
**ระยะเวลา:** 1 สัปดาห์ · **สถานะ:** ⏳ รอ Phase 4

> hardening + monitoring ก่อน production จริง

- [ ] 🤖 Grafana + Prometheus + Loki
  - dashboard: server CPU/RAM/disk · API latency · MQTT throughput
  - alert: VPS CPU > 80% · disk > 85% · API error rate > 1%
  - Loki: เก็บ logs ทุก service

- [ ] 🤖 Restic + rclone backup
  - cron job: backup TimescaleDB ทุกคืน 02:00
  - encrypt + upload ไป Cloudflare R2 / S3
  - ทดสอบ restore จริงก่อน go-live

- [ ] 🤝 Security hardening
  - Cloudflare WAF rules (Cloudflare Pro $20/mo)
  - rate limiting บน Kong
  - rotate Keycloak client secrets
  - disable unused ports บน VPS

- [ ] 👤 ⚠️ User Acceptance Testing (UAT)
  - ให้ Production Manager ทดสอบ dashboard จริง
  - ให้ MD / C-Level เข้าดูจาก device ของตัวเอง
  - เก็บ feedback · แก้ UX ตามความต้องการ

- [ ] 👤 Training + Documentation
  - สอนทีม factory: Node-RED maintenance พื้นฐาน
  - เขียน runbook: restart service, troubleshoot VPN
  - go-live checklist

- [ ] 🤝 ⚠️ Production Go-Live
  - switch DNS ไป production URL
  - monitor 48 ชั่วโมงแรกอย่างใกล้ชิด
  - on-call support plan สัปดาห์แรก

---

## สรุป Timeline

```
สัปดาห์ 1    Phase 0 (UI) + Phase 1 (VPS setup)
สัปดาห์ 2    Phase 2 (Backend API) + Phase 3 เริ่มต้น (Factory HW)
สัปดาห์ 3    Phase 3 ต่อ (Node-RED, DB, Pre-Calc)
สัปดาห์ 4    Phase 4 (Integration + Real data)
สัปดาห์ 5    Phase 5 (Monitor + Security + Go-Live)
```

## ขวดคอที่ต้องระวัง

1. **PLC Protocol** — ต้องรู้ก่อนว่า PLC ในโรงงานใช้ Modbus / OPC-UA / อื่น
2. **Factory Network** — ต้องได้รับอนุญาตจาก IT ก่อนติดตั้ง OPNsense
3. **UAT** — MD/Manager ต้องมีเวลานั่ง test จริง
