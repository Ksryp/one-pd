import ProductionPipeline from '../components/pipeline/ProductionPipeline'
import OverviewStrip from '../components/overview/OverviewStrip'
import ParameterDefectCard from '../components/parameter-defect/ParameterDefectCard'
import { usePipeline } from '../hooks/usePipeline'
import { useLive } from '../hooks/useLive'

export default function Dashboard() {
  const { data: stages, refetch: refetchPipeline } = usePipeline()

  useLive((msg) => {
    if (msg?.type === 'snapshot') refetchPipeline()
  })

  return (
    <div className="p-3 sm:p-4 lg:p-5 min-h-full bg-[var(--bg-page)]">
      <ProductionPipeline stages={stages} />
      <OverviewStrip />
      <ParameterDefectCard />
    </div>
  )
}
