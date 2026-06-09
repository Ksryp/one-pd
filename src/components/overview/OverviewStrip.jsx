import OEECard from './OEECard'
import TaktCycleCard from './TaktCycleCard'
import WIPCard from './WIPCard'
import MTTRCard from './MTTRCard'
import { useOverview } from '../../hooks/useOverview'

function SkeletonCard() {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 animate-pulse">
      <div className="h-3 w-24 bg-[var(--border)] rounded mb-3" />
      <div className="h-8 w-16 bg-[var(--border)] rounded mb-2" />
      <div className="h-2 w-32 bg-[var(--border)] rounded" />
    </div>
  )
}

export default function OverviewStrip() {
  const { data: overview, loading, error } = useOverview()

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-[13px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
          Overview
        </h2>
        {error && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#991B1B] border border-[#DC2626]">
            API Error
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-3">
        {loading && !overview
          ? [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
          : <>
              <OEECard data={overview.oee} />
              <TaktCycleCard data={overview.takt} />
              <WIPCard data={overview.wip} />
              <MTTRCard data={overview.mttr} />
            </>
        }
      </div>
    </section>
  )
}
