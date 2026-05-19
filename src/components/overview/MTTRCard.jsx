import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MTTRCard({ data }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const { value, target, incidents, unit } = data
  const isGood = value <= target
  const statusColor = isGood ? '#16A34A' : '#DC2626'

  return (
    <div
      className={`relative bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden cursor-pointer
        transition-all duration-300 ${hovered ? 'shadow-xl scale-[1.02]' : 'shadow-sm scale-100'}`}
      style={hovered ? { borderColor: statusColor, boxShadow: `0 8px 32px ${statusColor}30` } : {}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate('/mttr')}
    >
      <div className="p-3 sm:p-4">
        <p className="text-[11px] font-bold tracking-widest uppercase text-[var(--text-secondary)] mb-3 truncate"
           title="MTTR — Mean Time to Repair">
          MTTR <span className="font-normal normal-case hidden sm:inline">[Mean Time to Repair]</span>
        </p>

        <div className="flex items-end gap-2 mb-1">
          <p className="text-fluid-4xl font-black tabular-nums leading-none" style={{ color: statusColor }}>{value}</p>
          <p className="text-fluid-sm font-semibold text-[var(--text-secondary)] pb-1">{unit}</p>
        </div>

        <p className="text-fluid-xs text-[var(--text-secondary)] mb-3">
          Target: <span className="font-semibold text-[var(--text-primary)] tabular-nums">{target} {unit}</span>
        </p>

        {/* Incident count — fades on hover */}
        <div className={`border-t border-[var(--border)] pt-2 flex items-center justify-between transition-all duration-300 ${hovered ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}>
          <span className="text-fluid-xs text-[var(--text-secondary)]">
            Incidents today: <span className="font-bold text-[var(--text-primary)] tabular-nums">{incidents}</span>
          </span>
          <span className={`text-fluid-xs font-bold ${isGood ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
            {isGood ? `✓ On target` : `⚠ Over by ${value - target}min`}
          </span>
        </div>
      </div>

      {/* Gradient CTA */}
      <div
        className={`absolute inset-x-0 bottom-0 flex items-center justify-center pb-4
          transition-all duration-300 pointer-events-none
          ${hovered ? 'h-[45%] opacity-100' : 'h-[20%] opacity-0'}`}
        style={{ background: `linear-gradient(to top, var(--bg-card) 45%, ${statusColor}18 80%, transparent 100%)` }}
      >
        <div className={`flex items-center gap-1.5 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <span className="text-[12px] font-bold" style={{ color: statusColor }}>View MTTR Details</span>
          <span className={`text-[13px] font-black transition-transform duration-300 ${hovered ? 'translate-x-1' : ''}`} style={{ color: statusColor }}>→</span>
        </div>
      </div>
    </div>
  )
}
