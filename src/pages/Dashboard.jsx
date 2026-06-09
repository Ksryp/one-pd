import ProductionPipeline from '../components/pipeline/ProductionPipeline'
import OverviewStrip from '../components/overview/OverviewStrip'
import ParameterDefectCard from '../components/parameter-defect/ParameterDefectCard'
import { usePipeline } from '../hooks/usePipeline'
import { useLive } from '../hooks/useLive'

export default function Dashboard() {
  const { data: stages, loading: pipelineLoading, error: pipelineError, refetch: refetchPipeline } = usePipeline()
  const { connected } = useLive((msg) => {
    if (msg?.type === 'snapshot') refetchPipeline()
  })

  return (
    <div className="p-3 sm:p-4 lg:p-5 min-h-full bg-[var(--bg-page)]">
      {/* Connection status badges */}
      {(pipelineError || !connected) && (
        <div className="flex gap-2 mb-3">
          {pipelineError && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#991B1B] border border-[#DC2626]">
              Pipeline offline
            </span>
          )}
          {!connected && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#D97706]">
              Live feed reconnecting…
            </span>
          )}
        </div>
      )}
      <ProductionPipeline stages={stages} loading={pipelineLoading} />
      <OverviewStrip />
      <ParameterDefectCard />
    </div>
  )
}
