import FilterBar from '../components/parameter-defect/FilterBar'
import DualAxisChart from '../components/parameter-defect/DualAxisChart'
import { useParameterDefect } from '../hooks/useParameterDefect'

function RefreshButton({ loading, onRefresh }) {
  return (
    <button
      onClick={onRefresh}
      disabled={loading}
      title="Refresh now"
      className="flex items-center justify-center w-6 h-6 rounded-md border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
        className={loading ? 'animate-spin' : ''}>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
        <path d="M8 16H3v5"/>
      </svg>
    </button>
  )
}

export default function Reports() {
  const { lastUpdated, loading, refresh } = useParameterDefect()

  const updatedTime = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null

  return (
    <div className="p-5 min-h-full bg-[var(--bg-page)]">
      <h1 className="text-fluid-2xl font-black text-[var(--text-primary)] mb-2">Reports & Trends</h1>
      <p className="text-[13px] text-[var(--text-secondary)] mb-6">ข้อมูลย้อนหลัง Parameter–Defect correlation</p>

      <div className="bg-[var(--bg-card)] border-2 border-[var(--accent)]/30 rounded-xl p-3 sm:p-4 shadow-sm">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[13px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
            Parameter - Defect
          </h2>
          <div className="flex items-center gap-2">
            {loading && (
              <span className="text-[10px] text-[var(--accent)] animate-pulse">Refreshing…</span>
            )}
            {updatedTime && (
              <span className="text-[10px] text-[var(--text-secondary)] tabular-nums">
                Last updated: {updatedTime}
              </span>
            )}
            <RefreshButton loading={loading} onRefresh={refresh} />
          </div>
        </div>

        <FilterBar />
        <DualAxisChart />
      </div>
    </div>
  )
}
