import { useParams, useNavigate } from 'react-router-dom'
import { stageParams } from '../data/mock'
import { STATUS_COLORS as STATUS_MAP } from '../constants/status'

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
