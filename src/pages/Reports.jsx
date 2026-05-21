import DualAxisChart from '../components/parameter-defect/DualAxisChart'

export default function Reports() {
  return (
    <div className="p-5 min-h-full bg-[var(--bg-page)]">
      <h1 className="text-fluid-2xl font-black text-[var(--text-primary)] mb-2">Reports & Trends</h1>
      <p className="text-[13px] text-[var(--text-secondary)] mb-6">ข้อมูลย้อนหลัง Parameter–Defect correlation</p>

      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 shadow-sm">
        <h2 className="text-[13px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
          Parameter vs Defect — 24h Trend
        </h2>
        <DualAxisChart />
      </div>

      {/* Placeholder sections */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {['Defect Summary by Stage', 'OEE Weekly Trend', 'Yield Analysis', 'MTTR History'].map(t => (
          <div key={t} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 shadow-sm">
            <h3 className="text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">{t}</h3>
            <div className="h-24 rounded-lg bg-[var(--bg-page)] flex items-center justify-center">
              <span className="text-[11px] text-[var(--text-secondary)]">Coming in Phase 8</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
