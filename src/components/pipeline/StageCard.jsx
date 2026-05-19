import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const STATUS_MAP = {
  EMERGENCY:   { bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]', border: 'border-[#DC2626]', glow: '#DC2626', cta: '#DC2626' },
  ABNORMAL:    { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', border: 'border-[#D97706]', glow: '#D97706', cta: '#D97706' },
  NORMAL:      { bg: 'bg-[#DCFCE7]', text: 'text-[#166534]', border: 'border-[#16A34A]', glow: '#16A34A', cta: '#16A34A' },
  MAINTENANCE: { bg: 'bg-[#F3F4F6]', text: 'text-[#374151]', border: 'border-[#9CA3AF]', glow: '#9CA3AF', cta: '#6B7280' },
}

export default function StageCard({ id, label, status, timestamp }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const s = STATUS_MAP[status] || STATUS_MAP.NORMAL

  return (
    <div
      className={`relative bg-[var(--bg-card)] rounded-xl border-2 cursor-pointer
        select-none overflow-hidden w-full
        transition-all duration-300
        ${s.border}
        ${hovered ? 'shadow-xl scale-[1.03]' : 'shadow-sm scale-100'}
      `}
      style={hovered
        ? { boxShadow: `0 8px 32px ${s.glow}40, 0 0 0 2px ${s.glow}55` }
        : {}
      }
      onClick={() => navigate(`/stage/${id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/stage/${id}`)}
      aria-label={`${label} stage — ${status}`}
    >
      {/* ── Card Content (pads internally) ── */}
      <div className="p-3 sm:p-4">

        {/* Status Badge */}
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide border ${s.bg} ${s.text} ${s.border}`}>
          {status}
        </span>

        {/* Stage Name */}
        <p className={`mt-2 sm:mt-3 text-fluid-lg font-bold text-[var(--text-primary)] tracking-tight truncate
          transition-all duration-300
          ${hovered ? 'translate-y-[-4px]' : 'translate-y-0'}
        `}>
          {label}
        </p>

        {/* Divider + Timestamp — fade & slide down on hover */}
        <div className={`transition-all duration-300 ${hovered ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <div className="my-1.5 sm:my-2 h-px bg-[var(--border)]" />
          <p className="text-fluid-xs text-[var(--text-secondary)] tabular-nums">
            {timestamp}
          </p>
        </div>
      </div>

      {/* ── Gradient Overlay — rises from bottom on hover ── */}
      <div
        className={`absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-3 sm:pb-4
          transition-all duration-300 pointer-events-none
          ${hovered ? 'h-[65%] opacity-100' : 'h-[30%] opacity-0'}
        `}
        style={{
          background: `linear-gradient(to top,
            var(--bg-card) 40%,
            ${s.glow}22 75%,
            transparent 100%
          )`,
        }}
      >
        {/* CTA */}
        <div className={`flex items-center gap-1.5 transition-all duration-300
          ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
        `}>
          <span
            className="text-[11px] sm:text-[12px] font-bold tracking-wide"
            style={{ color: s.cta }}
          >
            View Full Dashboard
          </span>
          {/* Arrow — slides right on hover */}
          <span
            className={`text-[13px] font-black transition-all duration-300
              ${hovered ? 'translate-x-1' : 'translate-x-0'}
            `}
            style={{ color: s.cta }}
          >
            →
          </span>
        </div>
      </div>
    </div>
  )
}
