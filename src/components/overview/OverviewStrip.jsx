import OEECard from './OEECard'
import TaktCycleCard from './TaktCycleCard'
import WIPCard from './WIPCard'
import MTTRCard from './MTTRCard'
import { useOverview } from '../../hooks/useOverview'

export default function OverviewStrip() {
  const { data: overview } = useOverview()

  return (
    <section className="mb-6">
      <h2 className="text-[13px] font-bold tracking-widest text-[var(--text-secondary)] uppercase mb-3">
        Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-3">
        <OEECard data={overview.oee} />
        <TaktCycleCard data={overview.takt} />
        <WIPCard data={overview.wip} />
        <MTTRCard data={overview.mttr} />
      </div>
    </section>
  )
}
