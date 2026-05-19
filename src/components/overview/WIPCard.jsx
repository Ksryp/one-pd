import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function WIPCard({ data }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const { value, max, hotStage } = data
  const pct = Math.round((value / max) * 100)
  const barColor = pct >= 90 ? '#DC2626' : pct >= 75 ? '#D97706' : '#16A34A'

  return (
    <div
      className={`relative bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden cursor-pointer
        transition-all duration-300 ${hovered ? 'shadow-xl scale-[1.02]' : 'shadow-sm scale-100'}`}
      style={hovered ? { borderColor: barColor, boxShadow: `0 8px 32px ${barColor}30` } : {}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate('/wip')}
    >
      <div className="p-3 sm:p-4">
        <p className="text-[11px] font-bold tracking-widest uppercase text-[var(--text-secondary)] mb-3 truncate"
           title="WIP — Work in Process">
          WIP <span className="font-normal normal-case hidden sm:inline">[Work in Process]</span>
        </p>

        <p className="text-fluid-4xl font-black tabular-nums text-[var(--text-primary)] leading-none">
          {value.toLocaleString()}
        </p>
        <p className="text-fluid-xs text-[var(--text-secondary)] mt-0.5 mb-3">
          / {max.toLocaleString()} max capacity
        </p>

        {/* Progress bar + label — fade on hover */}
        <div className={`transition-all duration-300 ${hovered ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}>
          <div className="h-2 rounded-full bg-[var(--border)] overflow-hidden mb-2">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: barColor }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-fluid-xs text-[var(--text-secondary)]">
              Hot stage: <span className="font-semibold text-[var(--text-primary)] capitalize">{hotStage}</span>
            </span>
            <span className="text-fluid-xs font-bold tabular-nums" style={{ color: barColor }}>{pct}%</span>
          </div>
        </div>
      </div>

      {/* Gradient CTA */}
      <div
        className={`absolute inset-x-0 bottom-0 flex items-center justify-center pb-4
          transition-all duration-300 pointer-events-none
          ${hovered ? 'h-[50%] opacity-100' : 'h-[20%] opacity-0'}`}
        style={{ background: `linear-gradient(to top, var(--bg-card) 45%, ${barColor}18 80%, transparent 100%)` }}
      >
        <div className={`flex items-center gap-1.5 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <span className="text-[12px] font-bold" style={{ color: barColor }}>View WIP Details</span>
          <span className={`text-[13px] font-black transition-transform duration-300 ${hovered ? 'translate-x-1' : ''}`} style={{ color: barColor }}>→</span>
        </div>
      </div>
    </div>
  )
}
