import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="text-[var(--text-secondary)]">{payload[0].name}: <span className="font-bold text-[var(--text-primary)]">{payload[0].value}%</span></p>
    </div>
  )
}

const STATUS_COLORS = {
  NORMAL: '#16A34A',
  ABNORMAL: '#D97706',
  EMERGENCY: '#DC2626',
  PENDING: '#9CA3AF',
}

export default function OEECard({ data }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const { value, availability, performance, quality, timeStart, timeEnd, timeline } = data

  const colorForOEE = value >= 85 ? '#16A34A' : value >= 70 ? '#D97706' : '#DC2626'

  const pieData = [
    { name: 'Avail.', value: availability, color: '#4F8EE8' },
    { name: 'Perf.',  value: performance,  color: '#16A34A' },
    { name: 'Qual.',  value: quality,      color: '#D97706' },
  ]

  return (
    <div
      className={`relative bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden cursor-pointer
        transition-all duration-300 ${hovered ? 'shadow-xl scale-[1.02]' : 'shadow-sm scale-100'}`}
      style={hovered ? { borderColor: colorForOEE, boxShadow: `0 8px 32px ${colorForOEE}30` } : {}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate('/oee')}
    >
      <div className="p-3 sm:p-4">
        {/* Title */}
        <p className="text-[11px] font-bold tracking-widest uppercase text-[var(--text-secondary)] mb-3 truncate"
           title="OEE — Overall Equipment Effectiveness">
          OEE <span className="font-normal normal-case hidden sm:inline">[Overall Equip. Eff.]</span>
        </p>

        {/* Donut + Legend */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[{ value, name: 'OEE' }, { value: 100 - value, name: '' }]}
                  cx="50%" cy="50%" innerRadius={28} outerRadius={38}
                  dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}
                >
                  <Cell fill={colorForOEE} />
                  <Cell fill="var(--border)" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-fluid-2xl font-black tabular-nums leading-none" style={{ color: colorForOEE }}>
                {value}%
              </span>
            </div>
          </div>

          {/* Breakdown — fades on hover */}
          <div className={`flex-1 min-w-0 space-y-1.5 transition-all duration-300 ${hovered ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}>
            {pieData.map(d => (
              <div key={d.name} className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-fluid-xs text-[var(--text-secondary)] truncate">{d.name}</span>
                </div>
                <span className="text-fluid-xs font-bold tabular-nums text-[var(--text-primary)] flex-shrink-0">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Time slider — fades on hover */}
        <div className={`mt-3 transition-all duration-300 ${hovered ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}>
          <div className="flex justify-between text-fluid-xs text-[var(--text-secondary)] tabular-nums mb-1">
            <span>{timeStart}</span><span>{timeEnd}</span>
          </div>
          {timeline && timeline.length > 0 ? (
            <div className="h-1.5 rounded-full flex gap-[1px] overflow-hidden bg-[var(--border)]">
              {timeline.map((segment, idx) => (
                <div 
                  key={idx}
                  className="flex-1 h-full"
                  style={{ backgroundColor: STATUS_COLORS[segment.status] || '#16A34A' }}
                  title={`${segment.time}: ${segment.status}`}
                />
              ))}
            </div>
          ) : (
            <div className="h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: colorForOEE }} />
            </div>
          )}
        </div>
      </div>

      {/* Gradient CTA overlay */}
      <div
        className={`absolute inset-x-0 bottom-0 flex items-center justify-center pb-4
          transition-all duration-300 pointer-events-none
          ${hovered ? 'h-[55%] opacity-100' : 'h-[20%] opacity-0'}`}
        style={{ background: `linear-gradient(to top, var(--bg-card) 45%, ${colorForOEE}18 80%, transparent 100%)` }}
      >
        <div className={`flex items-center gap-1.5 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <span className="text-[12px] font-bold" style={{ color: colorForOEE }}>View OEE Details</span>
          <span className={`text-[13px] font-black transition-transform duration-300 ${hovered ? 'translate-x-1' : ''}`} style={{ color: colorForOEE }}>→</span>
        </div>
      </div>
    </div>
  )
}
