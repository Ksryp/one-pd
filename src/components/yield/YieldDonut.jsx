import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const COLORS = {
  Good:   '#16A34A',
  Repair: '#D97706',
  Scrap:  '#DC2626',
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-lg text-xs">
      <span className="font-semibold text-[var(--text-primary)]">{name}:</span>
      <span className="ml-1 text-[var(--text-secondary)] tabular-nums">{value.toLocaleString()} pcs</span>
    </div>
  )
}

export default function YieldDonut({ title, value, segments, target }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const isAboveTarget = value >= target
  const diff = value - target
  const ctaColor = isAboveTarget ? '#16A34A' : '#DC2626'

  return (
    <div
      className={`relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer
        ${hovered ? 'shadow-xl scale-[1.02]' : 'shadow-sm scale-100 border-transparent'}`}
      style={hovered ? { borderColor: ctaColor, boxShadow: `0 8px 28px ${ctaColor}28` } : { borderColor: 'var(--border)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate('/reports')}
    >
      <div className="p-0">
        <h3 className="text-[12px] font-bold tracking-widest text-[var(--text-primary)] uppercase mb-3 px-0">
          {title}
        </h3>

        <div className="flex items-center gap-4">
          {/* Donut */}
          <div className="relative w-[90px] h-[90px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segments}
                  cx="50%" cy="50%"
                  innerRadius={28} outerRadius={42}
                  dataKey="value" startAngle={90} endAngle={-270}
                  strokeWidth={0}
                >
                  {segments.map((seg, i) => (
                    <Cell key={i} fill={COLORS[seg.label] || seg.color || '#9CA3AF'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center value */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[18px] font-black text-[var(--text-primary)] tabular-nums leading-none">
                {value}%
              </span>
            </div>
          </div>

          {/* Legend — fades on hover */}
          <div className={`flex-1 min-w-0 transition-all duration-300 ${hovered ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}>
            {segments.map((seg) => (
              <div key={seg.label} className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: COLORS[seg.label] || seg.color }} />
                  <span className="text-[11px] text-[var(--text-secondary)]">{seg.label}</span>
                </div>
                <span className="text-[11px] font-semibold tabular-nums text-[var(--text-primary)]">
                  {seg.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Target row — fades on hover */}
        <div className={`mt-3 flex items-center justify-between transition-all duration-300 ${hovered ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}>
          <span className="text-[11px] text-[var(--text-secondary)]">Target: {target}%</span>
          <span className={`text-[11px] font-bold tabular-nums ${isAboveTarget ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
            {isAboveTarget ? `▲ ${diff}%` : `▼ ${Math.abs(diff)}%`}
          </span>
        </div>
      </div>

      {/* Gradient CTA overlay */}
      <div
        className={`absolute inset-x-0 bottom-0 flex items-center justify-center pb-3
          transition-all duration-300 pointer-events-none
          ${hovered ? 'h-[55%] opacity-100' : 'h-[20%] opacity-0'}`}
        style={{ background: `linear-gradient(to top, var(--bg-card) 40%, ${ctaColor}18 78%, transparent 100%)` }}
      >
        <div className={`flex items-center gap-1.5 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <span className="text-[11px] font-bold" style={{ color: ctaColor }}>View Yield Details</span>
          <span className={`text-[13px] font-black transition-transform duration-300 ${hovered ? 'translate-x-1' : ''}`} style={{ color: ctaColor }}>→</span>
        </div>
      </div>
    </div>
  )
}
