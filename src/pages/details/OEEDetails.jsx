import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { time: '08:00', oee: 72, avail: 80, perf: 85, qual: 98 },
  { time: '09:00', oee: 75, avail: 85, perf: 86, qual: 98 },
  { time: '10:00', oee: 78, avail: 88, perf: 89, qual: 97 },
  { time: '11:00', oee: 82, avail: 92, perf: 91, qual: 98 },
  { time: '12:00', oee: 85, avail: 95, perf: 93, qual: 98 },
  { time: '13:00', oee: 84, avail: 94, perf: 92, qual: 98 },
  { time: '14:00', oee: 86, avail: 96, perf: 94, qual: 99 },
]

export default function OEEDetails() {
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
        <h1 className="text-fluid-2xl font-black text-[var(--text-primary)]">OEE Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)]">
          <p className="text-fluid-sm font-bold text-[var(--text-secondary)] mb-1">Overall OEE</p>
          <p className="text-fluid-4xl font-black text-[#16A34A] tabular-nums">86%</p>
        </div>
        <div className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)]">
          <p className="text-fluid-sm font-bold text-[var(--text-secondary)] mb-1">Availability</p>
          <p className="text-fluid-3xl font-black text-[#4F8EE8] tabular-nums">96%</p>
        </div>
        <div className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)]">
          <p className="text-fluid-sm font-bold text-[var(--text-secondary)] mb-1">Performance</p>
          <p className="text-fluid-3xl font-black text-[#16A34A] tabular-nums">94%</p>
        </div>
        <div className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)]">
          <p className="text-fluid-sm font-bold text-[var(--text-secondary)] mb-1">Quality</p>
          <p className="text-fluid-3xl font-black text-[#D97706] tabular-nums">99%</p>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)] h-[400px]">
        <h3 className="text-fluid-md font-bold mb-4 text-[var(--text-primary)]">OEE Trend (Today)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="time" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
            <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} domain={[60, 100]} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="oee" stroke="#16A34A" strokeWidth={4} dot={{ r: 4 }} activeDot={{ r: 6 }} name="OEE %" />
            <Line type="monotone" dataKey="avail" stroke="#4F8EE8" strokeWidth={2} dot={false} name="Availability %" />
            <Line type="monotone" dataKey="perf" stroke="#16A34A" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Performance %" />
            <Line type="monotone" dataKey="qual" stroke="#D97706" strokeWidth={2} dot={false} name="Quality %" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
