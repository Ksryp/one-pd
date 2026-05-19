import ProductionPipeline from '../components/pipeline/ProductionPipeline'
import OverviewStrip from '../components/overview/OverviewStrip'
import ParameterDefectCard from '../components/parameter-defect/ParameterDefectCard'
import { pipeline } from '../data/mock'

export default function Dashboard() {
  return (
    <div className="p-3 sm:p-4 lg:p-5 min-h-full bg-[var(--bg-page)]">
      <ProductionPipeline stages={pipeline} />
      <OverviewStrip />
      <ParameterDefectCard />
    </div>
  )
}
