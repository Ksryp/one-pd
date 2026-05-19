import StageCard from './StageCard'

export default function ProductionPipeline({ stages }) {
  return (
    <section className="mb-6">
      <h2 className="text-[13px] font-bold tracking-widest text-[var(--text-secondary)] uppercase mb-3">
        Production Pipeline
      </h2>
      {/* Grid: 2-col mobile → 3-col sm → 6-col lg (all in one row) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stages.map((stage) => (
          <StageCard key={stage.id} {...stage} />
        ))}
      </div>
    </section>
  )
}
