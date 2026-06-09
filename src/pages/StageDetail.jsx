import { useParams, useNavigate } from 'react-router-dom'
import { STATUS_COLORS as STATUS_MAP } from '../constants/status'

const stageParams = {
  "slip-prep": {
    title: "Body Slip Preparation",
    params: [
      { key: "viscosity_v0",  label: "Viscosity V0",    value: 940,  unit: "cP",      ucl: 900,  lcl: 700,  status: "EMERGENCY" },
      { key: "viscosity_v30", label: "Viscosity V30",   value: 820,  unit: "cP",      ucl: 880,  lcl: 680,  status: "NORMAL"    },
      { key: "concentration", label: "Concentration",   value: 1.62, unit: "g/cm³",   ucl: 1.68, lcl: 1.58, status: "NORMAL"    },
      { key: "temperature",   label: "Temperature",     value: 28.5, unit: "°C",      ucl: 32,   lcl: 24,   status: "NORMAL"    },
      { key: "casting_rate",  label: "Casting Rate",    value: 58,   unit: "pcs/hr",  ucl: 65,   lcl: 50,   status: "NORMAL"    },
    ],
  },
  "glaze-prep": {
    title: "Glaze Slip Preparation",
    params: [
      { key: "particle_size", label: "% Particle Size", value: 3.2,  unit: "%",    ucl: 4.0,  lcl: 2.0,  status: "NORMAL" },
      { key: "concentration", label: "Concentration",   value: 1.44, unit: "g/L",  ucl: 1.50, lcl: 1.38, status: "NORMAL" },
      { key: "viscosity_v0",  label: "Viscosity V0",    value: 760,  unit: "cP",   ucl: 850,  lcl: 650,  status: "NORMAL" },
      { key: "residue",       label: "% Residue",       value: 0.8,  unit: "%",    ucl: 1.5,  lcl: 0.2,  status: "NORMAL" },
    ],
  },
  "casting": {
    title: "Casting",
    params: [
      { key: "mold_cycle",  label: "Mold Cycle",      value: 38,  unit: "min",     ucl: 32,  lcl: 24,  status: "ABNORMAL" },
      { key: "mold_no",     label: "Active Molds",    value: 147, unit: "molds",   ucl: 160, lcl: 100, status: "NORMAL"   },
      { key: "caster_no",   label: "Active Casters",  value: 12,  unit: "casters", ucl: 14,  lcl: 8,   status: "NORMAL"   },
    ],
  },
  "drying": {
    title: "Drying",
    params: [
      { key: "moisture",     label: "% Moisture Content", value: 13.2, unit: "%", ucl: 15,  lcl: 8,  status: "NORMAL" },
      { key: "drying_curve", label: "Drying Curve",       value: 98.5, unit: "%", ucl: 100, lcl: 92, status: "NORMAL" },
    ],
  },
  "spraying": {
    title: "Spraying",
    params: [
      { key: "thickness",  label: "Glaze Thickness", value: 0.42, unit: "mm",    ucl: 0.50, lcl: 0.35, status: "NORMAL" },
      { key: "sprayer_no", label: "Active Sprayers", value: 4,    unit: "units", ucl: 5,    lcl: 2,    status: "NORMAL" },
      { key: "robot_no",   label: "Active Robots",   value: 3,    unit: "units", ucl: 4,    lcl: 2,    status: "NORMAL" },
    ],
  },
  "firing": {
    title: "Firing",
    params: [
      { key: "temperature",  label: "Temperature",  value: 1238, unit: "°C", ucl: 1280, lcl: 1180, status: "NORMAL" },
      { key: "firing_cycle", label: "Firing Cycle", value: 18.5, unit: "hr", ucl: 20,   lcl: 16,   status: "NORMAL" },
      { key: "weight",       label: "Piece Weight", value: 3.82, unit: "kg", ucl: 4.10, lcl: 3.50, status: "NORMAL" },
    ],
  },
}

function GaugeParam({ param }) {
  const { label, value, unit, ucl, lcl, status } = param
  const s = STATUS_MAP[status] || STATUS_MAP.NORMAL
  const range = ucl - lcl
  const pct = Math.min(Math.max(((value - lcl) / range) * 100, 0), 100)
  const barColor = status === 'EMERGENCY' ? '#DC2626' : status === 'ABNORMAL' ? '#D97706' : '#16A34A'

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 hover:shadow-md hover:border-[var(--accent)] transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[12px] font-bold text-[var(--text-primary)]">{label}</p>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
          style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border }}>
          {status}
        </span>
      </div>

      <div className="flex items-end gap-1 mb-3">
        <span className="text-[28px] font-black tabular-nums text-[var(--text-primary)] leading-none">{value}</span>
        <span className="text-[12px] text-[var(--text-secondary)] pb-1">{unit}</span>
      </div>

      {/* Range bar */}
      <div className="relative h-2 rounded-full bg-[var(--border)] overflow-hidden mb-1">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
      <div className="flex justify-between text-[9px] text-[var(--text-secondary)] tabular-nums">
        <span>LCL: {lcl}</span>
        <span>UCL: {ucl}</span>
      </div>
    </div>
  )
}

export default function StageDetail() {
  const { stageId } = useParams()
  const navigate = useNavigate()
  const stage = stageParams[stageId]

  if (!stage) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-[var(--text-secondary)] text-lg">Stage not found</p>
          <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm">← Back</button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 min-h-full bg-[var(--bg-page)]">
      {/* Header — Added pl-6 to avoid overlapping with Sidebar expand button */}
      <div className="flex items-center gap-3 mb-6 pl-6 sm:pl-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-[12px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Dashboard
        </button>
        <span className="text-[var(--border)]">/</span>
        <h1 className="text-[20px] font-black text-[var(--text-primary)]">{stage.title}</h1>
        <span className="text-[11px] text-[var(--text-secondary)] bg-[var(--border)] rounded-full px-2 py-0.5 capitalize">{stageId}</span>
      </div>

      {/* Parameters grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stage.params.map(param => (
          <GaugeParam key={param.key} param={param} />
        ))}
      </div>
    </div>
  )
}
