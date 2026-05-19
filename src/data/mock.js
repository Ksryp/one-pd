// src/data/mock.js — SNK MES Dashboard mock data

// ─── Pipeline ─────────────────────────────────────────────────
export const pipeline = [
  { id: "slip-prep",  label: "SLIP PREP",  status: "EMERGENCY",   timestamp: "18/05/69 16:10" },
  { id: "glaze-prep", label: "GLAZE PREP", status: "NORMAL",      timestamp: "18/05/69 15:45" },
  { id: "casting",    label: "CASTING",    status: "ABNORMAL",    timestamp: "18/05/69 15:42" },
  { id: "drying",     label: "DRYING",     status: "NORMAL",      timestamp: "18/05/69 15:30" },
  { id: "spraying",   label: "SPRAYING",   status: "NORMAL",      timestamp: "18/05/69 15:00" },
  { id: "firing",     label: "FIRING",     status: "MAINTENANCE", timestamp: "18/05/69 15:31" },
]

// ─── Overview KPIs ────────────────────────────────────────────
export const overview = {
  oee: {
    value: 78,
    availability: 82,
    performance: 74,
    quality: 81,
    timeStart: "07:30",
    timeEnd: "16:30",
    timeline: [
      { time: "07:30", status: "NORMAL" },
      { time: "08:30", status: "NORMAL" },
      { time: "09:30", status: "NORMAL" },
      { time: "10:30", status: "ABNORMAL" },
      { time: "11:30", status: "EMERGENCY" },
      { time: "12:30", status: "NORMAL" },
      { time: "13:30", status: "ABNORMAL" },
      { time: "14:30", status: "NORMAL" },
      { time: "15:30", status: "PENDING" },
    ]
  },
  takt: {
    taktTime: 42,
    cycleTime: 38,
    unit: "s/pcs",
  },
  wip: {
    value: 1840,
    max: 2000,
    hotStage: "casting",
  },
  mttr: {
    value: 24,
    target: 30,
    incidents: 3,
    unit: "min",
  },
}

// ─── Parameter–Defect Timeseries (24h: 07:00–06:00) ──────────
const generateTimeseries = () => {
  const hours = []
  const baseHour = 7
  const ucl = { viscosity: 900, temperature: 1280, moisture: 15 }
  const lcl = { viscosity: 700, temperature: 1180, moisture: 8  }

  for (let i = 0; i < 24; i++) {
    const h = (baseHour + i) % 24
    const label = `${String(h).padStart(2, '0')}:00`

    // Simulate slight spike around 10:00–11:00
    const spike = (i >= 3 && i <= 4) ? 1.15 : 1.0
    const viscosity = Math.round((790 + Math.random() * 100) * spike)
    const temperature = Math.round(1220 + Math.random() * 60)
    const moisture = parseFloat((11 + Math.random() * 4).toFixed(1))
    const defect = Math.round((20 + Math.random() * 280) * spike)

    hours.push({
      hour: label,
      viscosity,
      temperature,
      moisture,
      defect,
      overViscosity: viscosity > ucl.viscosity || viscosity < lcl.viscosity,
      overTemperature: temperature > ucl.temperature || temperature < lcl.temperature,
      overMoisture: moisture > ucl.moisture || moisture < lcl.moisture,
    })
  }
  return hours
}

export const parameterDefect = {
  timeseries: generateTimeseries(),
  ucl: { viscosity: 900, temperature: 1280, moisture: 15 },
  lcl: { viscosity: 700, temperature: 1180, moisture: 8  },
  insights: {
    peakDefect: {
      hour: "10:00",
      count: 312,
      byType: [
        { name: "Pinhole",    count: 6513, subType: "Trap curve", subCount: 6513 },
        { name: "Crack",      count: 1234, subType: "Rim",        subCount: 1234 },
        { name: "Glaze Skip", count: 678,  subType: "Base",       subCount: 678  },
      ],
    },
    paramAtPeak: {
      name: "Viscosity (V0)",
      value: 940,
      unit: "cP",
      exceedUCL: true,
    },
    correlation: {
      value: 0.82,
      direction: "positive",
      strength: "strong",
      message: "Viscosity มีความสัมพันธ์เชิงบวกกับ Pinhole defect (r = 0.82)",
    },
    totalDefect: {
      count: 10468,
      rate: 22,
      byCategory: [
        { name: "Body & Forming",    count: 7034 },
        { name: "Glaze Defects",     count: 878  },
        { name: "Contamination",     count: 550  },
        { name: "Firing & Handling", count: 1566 },
        { name: "Function & Others", count: 440  },
      ],
    },
    aiInsight: {
      text: "Viscosity V0 เกิน UCL ช่วง 10:00–11:00 มีความสัมพันธ์สูงกับ Pinhole ที่เพิ่มขึ้น 312% — แนะนำตรวจสอบ Ball Mill speed และอุณหภูมิน้ำ",
      confidence: 87,
    },
  },
}

// ─── Notifications / Alerts ───────────────────────────────────
export const notifications = [
  {
    id: 1,
    stage: "slip-prep",
    title: "SLIP PREPERATION : SNK 1",
    level: "ABNORMAL",
    message: "Viscosity V0 เกินค่า UCL (940 cP > 900 cP) ต่อเนื่อง 45 นาที กระทบอัตราการผลิต",
    timestamp: "18/05/69 16:10",
    resolved: false,
  },
  {
    id: 2,
    stage: "casting",
    title: "CASTING : HPC SHELL NO.1",
    level: "ABNORMAL",
    message: "Mold Cycle สูงผิดปกติ — รอบที่ 147 ใช้เวลา 38 นาที (ปกติ 28 นาที) ตรวจสอบ mold condition",
    timestamp: "18/05/69 15:42",
    resolved: false,
  },
  {
    id: 3,
    stage: "firing",
    title: "KILN NO.2",
    level: "MAINTENANCE",
    message: "เข้าสู่โหมด Maintenance ตามแผน — อุณหภูมิ cooling zone ต่ำกว่าเกณฑ์ รอ technician",
    timestamp: "18/05/69 15:31",
    resolved: false,
  },
]

// ─── Yield ────────────────────────────────────────────────────
export const yield_ = {
  clay: {
    value: 86,
    good:   10234,
    repair: 623,
    scrap:  748,
    target: 90,
  },
  firing: {
    value: 81,
    good:   9840,
    repair: 1102,
    scrap:  1198,
    target: 88,
  },
}

// ─── Production Metrics ───────────────────────────────────────
export const metrics = {
  slipIn:      { pieces: 67400,  kg: 1341260 },
  slipYield:   { value: 62, target: 75 },
  warehouseIn: { pieces: 42013,  kg: 836058  },
}

// ─── Stage Detail Params ──────────────────────────────────────
export const stageParams = {
  "slip-prep": {
    title: "Body Slip Preparation",
    params: [
      { key: "viscosity_v0",   label: "Viscosity V0",       value: 940, unit: "cP",     ucl: 900, lcl: 700, status: "EMERGENCY" },
      { key: "viscosity_v30",  label: "Viscosity V30",       value: 820, unit: "cP",     ucl: 880, lcl: 680, status: "NORMAL"    },
      { key: "concentration",  label: "Concentration",       value: 1.62, unit: "g/cm³", ucl: 1.68, lcl: 1.58, status: "NORMAL"  },
      { key: "temperature",    label: "Temperature",         value: 28.5, unit: "°C",   ucl: 32, lcl: 24,    status: "NORMAL"    },
      { key: "casting_rate",   label: "Casting Rate",        value: 58, unit: "pcs/hr",  ucl: 65, lcl: 50,   status: "NORMAL"    },
    ],
  },
  "glaze-prep": {
    title: "Glaze Slip Preparation",
    params: [
      { key: "particle_size",  label: "% Particle Size",    value: 3.2, unit: "%",      ucl: 4.0, lcl: 2.0,  status: "NORMAL"   },
      { key: "concentration",  label: "Concentration",      value: 1.44, unit: "g/L",   ucl: 1.50, lcl: 1.38, status: "NORMAL"  },
      { key: "viscosity_v0",   label: "Viscosity V0",       value: 760, unit: "cP",     ucl: 850, lcl: 650,  status: "NORMAL"   },
      { key: "residue",        label: "% Residue",          value: 0.8, unit: "%",      ucl: 1.5, lcl: 0.2,  status: "NORMAL"   },
    ],
  },
  "casting": {
    title: "Casting",
    params: [
      { key: "mold_cycle",   label: "Mold Cycle",         value: 38, unit: "min",  ucl: 32, lcl: 24, status: "ABNORMAL" },
      { key: "mold_no",      label: "Active Molds",       value: 147, unit: "molds", ucl: 160, lcl: 100, status: "NORMAL" },
      { key: "caster_no",    label: "Active Casters",     value: 12, unit: "casters", ucl: 14, lcl: 8, status: "NORMAL"  },
    ],
  },
  "drying": {
    title: "Drying",
    params: [
      { key: "moisture",       label: "% Moisture Content", value: 13.2, unit: "%", ucl: 15, lcl: 8,  status: "NORMAL"  },
      { key: "drying_curve",   label: "Drying Curve",       value: 98.5, unit: "%", ucl: 100, lcl: 92, status: "NORMAL" },
    ],
  },
  "spraying": {
    title: "Spraying",
    params: [
      { key: "thickness",   label: "Glaze Thickness",   value: 0.42, unit: "mm", ucl: 0.50, lcl: 0.35, status: "NORMAL" },
      { key: "sprayer_no",  label: "Active Sprayers",   value: 4, unit: "units", ucl: 5, lcl: 2, status: "NORMAL"       },
      { key: "robot_no",    label: "Active Robots",     value: 3, unit: "units", ucl: 4, lcl: 2, status: "NORMAL"       },
    ],
  },
  "firing": {
    title: "Firing",
    params: [
      { key: "temperature",  label: "Temperature",   value: 1238, unit: "°C",  ucl: 1280, lcl: 1180, status: "NORMAL"      },
      { key: "firing_cycle", label: "Firing Cycle",  value: 18.5, unit: "hr",  ucl: 20, lcl: 16,     status: "NORMAL"      },
      { key: "weight",       label: "Piece Weight",  value: 3.82, unit: "kg",  ucl: 4.10, lcl: 3.50, status: "NORMAL"      },
    ],
  },
}

// ─── Default export (combined) ────────────────────────────────
const mockData = {
  pipeline,
  overview,
  parameterDefect,
  notifications,
  yield: yield_,
  metrics,
  stageParams,
}

export default mockData
