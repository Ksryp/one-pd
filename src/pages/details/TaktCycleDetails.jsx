import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'

const data = [
  { stage: 'Slip Prep', cycle: 38, takt: 42 },
  { stage: 'Glaze Prep', cycle: 35, takt: 42 },
  { stage: 'Casting', cycle: 45, takt: 42 }, // Bottleneck
  { stage: 'Drying', cycle: 40, takt: 42 },
  { stage: 'Spraying', cycle: 39, takt: 42 },
  { stage: 'Firing', cycle: 41, takt: 42 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const cycle = payload[0].value
  const takt = payload[1]?.value || 42
  const diff = cycle - takt
  const isOver = diff > 0

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-3 shadow-lg text-sm">
      <p className="font-bold text-[var(--text-primary)] mb-2">{label}</p>
      <div className="space-y-1">
        <p className="text-[var(--text-secondary)]">Cycle Time: <span className={`font-bold ${isOver ? 'text-[#DC2626]' : 'text-[var(--text-primary)]'}`}>{cycle}s</span></p>
        <p className="text-[var(--text-secondary)]">Takt Time: <span className="font-bold text-[var(--text-primary)]">{takt}s</span></p>
        {isOver && <p className="text-[#DC2626] font-bold mt-1 text-xs">⚠ Over by {diff}s</p>}
      </div>
    </div>
  )
}

export default function TaktCycleDetails() {
  const navigate = useNavigate()

  return (
    <div className="p-5 min-h-full bg-[var(--bg-page)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pl-6 sm:pl-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-[12px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors relative z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Dashboard
        </button>
        <span className="text-[var(--border)]">/</span>
        <h1 className="text-fluid-2xl font-black text-[var(--text-primary)]">Takt vs Cycle Time</h1>
      </div>

      <div className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)] mb-6 flex items-center justify-between">
        <div>
          <p className="text-fluid-sm text-[var(--text-secondary)]">Current Target Takt Time</p>
          <p className="text-fluid-4xl font-black text-[var(--text-primary)]">42 <span className="text-fluid-sm font-normal text-[var(--text-secondary)]">sec/piece</span></p>
        </div>
        <div className="text-right">
          <p className="text-fluid-sm text-[var(--text-secondary)]">System Bottleneck</p>
          <p className="text-fluid-2xl font-black text-[#DC2626]">Casting (45s)</p>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)] h-[450px]">
        <h3 className="text-fluid-md font-bold mb-6 text-[var(--text-primary)]">Cycle Time per Stage</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="stage" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--border)', opacity: 0.4 }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="cycle" name="Cycle Time" fill="#1E6FCC" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.cycle > entry.takt ? '#DC2626' : '#1E6FCC'} />
              ))}
            </Bar>
            <Bar dataKey="takt" name="Takt Target" fill="#9CA3AF" radius={[4, 4, 0, 0]} />
            <ReferenceLine y={42} stroke="#DC2626" strokeDasharray="5 5" label={{ position: 'top', value: 'Takt Limit (42s)', fill: '#DC2626', fontSize: 12 }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
