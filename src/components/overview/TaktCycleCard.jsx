import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TaktCycleCard({ data }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const { taktTime, cycleTime, unit } = data
  const isEfficient = cycleTime <= taktTime
  const cycleColor = isEfficient ? '#16A34A' : '#DC2626'
  const efficiency = Math.round((taktTime / cycleTime) * 100)

  return (
    <div
      className={`relative bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden cursor-pointer
        transition-all duration-300 ${hovered ? 'shadow-xl scale-[1.02]' : 'shadow-sm scale-100'}`}
      style={hovered ? { borderColor: cycleColor, boxShadow: `0 8px 32px ${cycleColor}30` } : {}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate('/takt-cycle')}
    >
      <div className="p-3 sm:p-4">
        <p className="text-[11px] font-bold tracking-widest uppercase text-[var(--text-secondary)] mb-3 truncate">
          Takt Time
        </p>

        <div className="flex items-end gap-4 mb-3">
          <div>
            <p className="text-fluid-xs text-[var(--text-secondary)] mb-0.5">Takt</p>
            <p className="text-fluid-3xl font-black tabular-nums text-[var(--text-primary)] leading-none">{taktTime}</p>
            <p className="text-fluid-xs text-[var(--text-secondary)] mt-0.5">{unit}</p>
          </div>
          <div className="text-[var(--text-secondary)] text-xl pb-4">/</div>
          <div>
            <p className="text-fluid-xs text-[var(--text-secondary)] mb-0.5">Cycle</p>
            <p className="text-fluid-3xl font-black tabular-nums leading-none" style={{ color: cycleColor }}>{cycleTime}</p>
            <p className="text-fluid-xs mt-0.5" style={{ color: cycleColor }}>{unit}</p>
          </div>
        </div>

        {/* Visual separator + label — fades on hover */}
        <div className={`border-t border-[var(--border)] pt-2 transition-all duration-300 ${hovered ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}>
          <div className="flex items-center justify-between">
            <span className="text-fluid-xs text-[var(--text-secondary)]">Cycle Time</span>
            <span className={`text-fluid-xs font-bold tabular-nums ${isEfficient ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
              {isEfficient ? `✓ ${efficiency}% efficient` : `⚠ ${cycleTime - taktTime}s over`}
            </span>
          </div>
        </div>
      </div>

      {/* Gradient CTA */}
      <div
        className={`absolute inset-x-0 bottom-0 flex items-center justify-center pb-4
          transition-all duration-300 pointer-events-none
          ${hovered ? 'h-[45%] opacity-100' : 'h-[20%] opacity-0'}`}
        style={{ background: `linear-gradient(to top, var(--bg-card) 45%, ${cycleColor}18 80%, transparent 100%)` }}
      >
        <div className={`flex items-center gap-1.5 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <span className="text-[12px] font-bold" style={{ color: cycleColor }}>View Takt & Cycle Details</span>
          <span className={`text-[13px] font-black transition-transform duration-300 ${hovered ? 'translate-x-1' : ''}`} style={{ color: cycleColor }}>→</span>
        </div>
      </div>
    </div>
  )
}
