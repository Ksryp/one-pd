import FilterBar from './FilterBar'
import DualAxisChart from './DualAxisChart'
import InsightPanel from './InsightPanel'
import AIBar from './AIBar'
import { useParameterDefect } from '../../hooks/useParameterDefect'

function LastUpdated({ date }) {
  if (!date) return null
  const t = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  return (
    <span className="text-[10px] text-[var(--text-secondary)] tabular-nums">
      Last updated: {t}
    </span>
  )
}

export default function ParameterDefectCard() {
  const { lastUpdated, loading, refresh } = useParameterDefect()

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[13px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
          Parameter - Defect
        </h2>
        <div className="flex items-center gap-2">
          {loading && (
            <span className="text-[10px] text-[var(--accent)] animate-pulse">Refreshing…</span>
          )}
          <LastUpdated date={lastUpdated} />
          <button
            onClick={refresh}
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
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border-2 border-[var(--accent)]/30 rounded-xl p-3 sm:p-4 shadow-sm">
        <FilterBar />
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <DualAxisChart />
            <AIBar />
          </div>
          <div className="w-full lg:w-[240px] xl:w-[270px] flex-shrink-0">
            <InsightPanel />
          </div>
        </div>
      </div>
    </section>
  )
}
