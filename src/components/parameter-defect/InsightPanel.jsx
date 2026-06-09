import { useState } from 'react'
import { useParameterDefect } from '../../hooks/useParameterDefect'

const CAT_COLOR = {
  crack:         '#DC2626',
  glaze:         '#D97706',
  contamination: '#7C5CBF',
  deformation:   '#F59E0B',
  mechanical:    '#6B7280',
  firing:        '#EF4444',
  surface:       '#10B981',
}

export default function InsightPanel() {
  const { insights, loading } = useParameterDefect()

  if (loading && !insights) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 h-full">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 animate-pulse h-[90px]" />
        ))}
      </div>
    )
  }

  if (!insights) return null

  const { top_defects, by_category, total_defects, total_scans, defect_rate } = insights

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 h-full">

      {/* Top Defects */}
      <InsightCard title="Top Defects" hoverColor="#DC2626">
        <div className="mt-1 space-y-1">
          {top_defects.slice(0, 4).map(d => (
            <div key={d.code} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CAT_COLOR[d.category] ?? '#9CA3AF' }} />
                <span className="text-[11px] font-semibold text-[#4F8EE8] truncate">{d.code}</span>
                <span className="text-[10px] text-[var(--text-secondary)] truncate">{d.label}</span>
              </div>
              <span className="text-[11px] font-bold tabular-nums text-[var(--text-primary)] flex-shrink-0">
                {d.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </InsightCard>

      {/* Defect Rate */}
      <InsightCard title="Defect Rate" hoverColor="#D97706">
        <div className="flex items-end gap-2 mt-1">
          <p className="text-[28px] font-black tabular-nums" style={{ color: defect_rate > 30 ? '#DC2626' : '#D97706' }}>
            {defect_rate}%
          </p>
          <p className="text-[11px] text-[var(--text-secondary)] mb-1">
            {total_defects.toLocaleString()} / {total_scans.toLocaleString()} pcs
          </p>
        </div>
        {/* Mini bar */}
        <div className="w-full h-1.5 rounded-full bg-[var(--border)] overflow-hidden mt-1">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(defect_rate, 100)}%`, backgroundColor: defect_rate > 30 ? '#DC2626' : '#D97706' }} />
        </div>
      </InsightCard>

      {/* By Category */}
      <InsightCard title="By Category" hoverColor="#4F8EE8">
        <div className="mt-1 space-y-1">
          {by_category.slice(0, 4).map(c => (
            <div key={c.category} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: CAT_COLOR[c.category] ?? '#9CA3AF' }} />
                <span className="text-[11px] text-[var(--text-secondary)] capitalize">{c.category}</span>
              </div>
              <span className="text-[11px] font-bold tabular-nums text-[var(--text-primary)]">
                {c.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </InsightCard>

      {/* Parameter — placeholder until MQTT connects */}
      <InsightCard title="Parameter at Peak" hoverColor="#F59E0B">
        <p className="text-[13px] text-[var(--text-secondary)] mt-2">
          Awaiting machine data
        </p>
        <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">
          hpc_shell_2 empty — connect MQTT to enable
        </p>
      </InsightCard>

    </div>
  )
}

function InsightCard({ title, children, hoverColor }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className={`bg-[var(--bg-card)] border rounded-xl p-3 transition-all duration-200 flex-1
        ${hovered ? 'shadow-md scale-[1.01]' : 'shadow-sm border-[var(--border)]'}`}
      style={hovered ? { borderColor: hoverColor } : {}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <p className="text-[11px] font-bold tracking-widest uppercase text-[var(--text-secondary)]">{title}</p>
      {children}
    </div>
  )
}
