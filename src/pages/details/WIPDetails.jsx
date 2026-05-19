import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const data = [
  { time: '08:00', casting: 400, drying: 600, spraying: 300, total: 1300 },
  { time: '09:00', casting: 450, drying: 620, spraying: 350, total: 1420 },
  { time: '10:00', casting: 500, drying: 650, spraying: 400, total: 1550 },
  { time: '11:00', casting: 600, drying: 700, spraying: 380, total: 1680 },
  { time: '12:00', casting: 800, drying: 750, spraying: 420, total: 1970 },
  { time: '13:00', casting: 750, drying: 720, spraying: 400, total: 1870 },
  { time: '14:00', casting: 780, drying: 700, spraying: 360, total: 1840 },
]

export default function WIPDetails() {
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
        <h1 className="text-fluid-2xl font-black text-[var(--text-primary)]">Work In Process Details</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)]">
          <p className="text-fluid-sm font-bold text-[var(--text-secondary)] mb-1">Total WIP</p>
          <p className="text-fluid-4xl font-black text-[var(--text-primary)] tabular-nums">1,840</p>
          <p className="text-fluid-xs text-[var(--text-secondary)] mt-1">/ 2,000 max capacity</p>
        </div>
        <div className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)] border-l-4 border-l-[#DC2626]">
          <p className="text-fluid-sm font-bold text-[var(--text-secondary)] mb-1">Hot Stage (Highest WIP)</p>
          <p className="text-fluid-3xl font-black text-[#DC2626]">Casting</p>
          <p className="text-fluid-xs text-[#DC2626] mt-1 font-bold">780 pieces</p>
        </div>
        <div className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)]">
          <p className="text-fluid-sm font-bold text-[var(--text-secondary)] mb-1">WIP Trend (vs Yesterday)</p>
          <p className="text-fluid-3xl font-black text-[#D97706] tabular-nums">+12%</p>
          <p className="text-fluid-xs text-[var(--text-secondary)] mt-1">Increasing buildup</p>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)] h-[400px]">
        <h3 className="text-fluid-md font-bold mb-4 text-[var(--text-primary)]">WIP Accumulation by Stage</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="time" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
            <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
            <Legend verticalAlign="top" height={36} iconType="square" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
            <Area type="monotone" dataKey="casting" stackId="1" stroke="#DC2626" fill="#FEE2E2" name="Casting" />
            <Area type="monotone" dataKey="drying" stackId="1" stroke="#D97706" fill="#FEF3C7" name="Drying" />
            <Area type="monotone" dataKey="spraying" stackId="1" stroke="#16A34A" fill="#DCFCE7" name="Spraying" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
