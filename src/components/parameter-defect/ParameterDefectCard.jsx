import FilterBar from './FilterBar'
import DualAxisChart from './DualAxisChart'
import InsightPanel from './InsightPanel'
import AIBar from './AIBar'

export default function ParameterDefectCard() {
  return (
    <section className="mb-6">
      <h2 className="text-[13px] font-bold tracking-widest text-[var(--text-secondary)] uppercase mb-3">
        Parameter - Defect
      </h2>
      <div className="bg-[var(--bg-card)] border-2 border-[var(--accent)]/30 rounded-xl p-3 sm:p-4 shadow-sm">
        <FilterBar />
        {/* Stack vertically on md and below, side-by-side on lg+ */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Chart area */}
          <div className="flex-1 min-w-0">
            <DualAxisChart />
            <AIBar />
          </div>
          {/* Insight panel — full width on small, fixed on large */}
          <div className="w-full lg:w-[240px] xl:w-[270px] flex-shrink-0">
            <InsightPanel />
          </div>
        </div>
      </div>
    </section>
  )
}
