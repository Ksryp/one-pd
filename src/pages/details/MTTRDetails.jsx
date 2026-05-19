import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts'

const data = [
  { day: 'Mon', mttr: 18 },
  { day: 'Tue', mttr: 22 },
  { day: 'Wed', mttr: 15 },
  { day: 'Thu', mttr: 20 },
  { day: 'Fri', mttr: 26 },
  { day: 'Sat', mttr: 24 },
]

const incidents = [
  { id: 'INC-101', time: '14:30', stage: 'Slip Prep', duration: '15m', status: 'Resolved', type: 'Mechanical' },
  { id: 'INC-102', time: '11:15', stage: 'Casting', duration: '32m', status: 'Resolved', type: 'Electrical' },
  { id: 'INC-103', time: '08:40', stage: 'Glaze Prep', duration: '25m', status: 'Resolved', type: 'Sensor' },
]

export default function MTTRDetails() {
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
        <h1 className="text-fluid-2xl font-black text-[var(--text-primary)]">MTTR Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)] col-span-1 lg:col-span-2 h-[350px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-fluid-md font-bold text-[var(--text-primary)]">MTTR Trend (This Week)</h3>
            <span className="text-fluid-xs font-bold px-2 py-1 bg-[#FEE2E2] text-[#DC2626] rounded">Target: 24 min</span>
          </div>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
              <Line type="monotone" dataKey="mttr" stroke="#DC2626" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="MTTR (min)" />
              <ReferenceLine y={24} stroke="#9CA3AF" strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)] flex flex-col justify-center items-center text-center">
          <p className="text-fluid-sm font-bold text-[var(--text-secondary)] mb-2">Today's MTTR</p>
          <p className="text-[64px] font-black tabular-nums leading-none text-[#DC2626] mb-2">24</p>
          <p className="text-fluid-md font-bold text-[var(--text-secondary)] mb-6">Minutes</p>
          
          <div className="w-full bg-[var(--bg-page)] rounded-lg p-4 border border-[var(--border)] flex justify-between items-center">
            <span className="text-fluid-sm text-[var(--text-secondary)]">Total Incidents Today</span>
            <span className="text-fluid-xl font-black text-[var(--text-primary)]">3</span>
          </div>
        </div>
      </div>

      {/* Incidents List */}
      <div className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)]">
        <h3 className="text-fluid-md font-bold mb-4 text-[var(--text-primary)]">Today's Repair Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-secondary)]">
                <th className="pb-3 font-semibold">Incident ID</th>
                <th className="pb-3 font-semibold">Time</th>
                <th className="pb-3 font-semibold">Stage</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Duration</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc, i) => (
                <tr key={i} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-3 font-bold text-[var(--text-primary)]">{inc.id}</td>
                  <td className="py-3 text-[var(--text-secondary)]">{inc.time}</td>
                  <td className="py-3 font-semibold text-[var(--text-primary)]">{inc.stage}</td>
                  <td className="py-3 text-[var(--text-secondary)]">{inc.type}</td>
                  <td className="py-3 font-bold tabular-nums text-[#DC2626]">{inc.duration}</td>
                  <td className="py-3">
                    <span className="bg-[#DCFCE7] text-[#16A34A] px-2 py-1 rounded-md font-bold text-[10px] uppercase tracking-wide">
                      {inc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
