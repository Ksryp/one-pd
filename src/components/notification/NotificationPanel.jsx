import AlertCard from './AlertCard'
import YieldDonut from '../yield/YieldDonut'
import { useState } from 'react'
import { useNotifications } from '../../hooks/useNotifications'
import { useYield } from '../../hooks/useYield'
import { useMetrics } from '../../hooks/useMetrics'

const VIEWS = ['Day', 'Week', 'Month', 'Year']

export default function NotificationPanel() {
  const [yieldView, setYieldView] = useState('Day')
  const { data: notifications } = useNotifications()
  const { data: clayYield }    = useYield('clay')
  const { data: firingYield }  = useYield('firing')
  const { data: metrics }      = useMetrics()
  const unresolved = notifications.filter(n => !n.resolved).length

  return (
    <div className="p-4">
      {/* Notifications */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-[13px] font-bold tracking-widest uppercase text-[var(--text-primary)]">
          Notification
        </h2>
        {unresolved > 0 && (
          <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
            {unresolved}
          </span>
        )}
      </div>

      <div className="mb-5">
        {notifications.map(n => (
          <AlertCard key={n.id} {...n} />
        ))}
      </div>

      <div className="h-px bg-[var(--border)] mb-5" />

      {/* Clay Yield */}
      <div className="mb-5">
        <YieldDonut
          title={clayYield.title}
          headerAction={<ViewSelector value={yieldView} onChange={setYieldView} />}
          value={clayYield.value}
          segments={clayYield.segments}
          target={clayYield.target}
        />
      </div>

      <div className="h-px bg-[var(--border)] mb-5" />

      {/* Firing Yield */}
      <div className="mb-5">
        <YieldDonut
          title={firingYield.title}
          headerAction={<ViewSelector value={yieldView} onChange={setYieldView} />}
          value={firingYield.value}
          segments={firingYield.segments}
          target={firingYield.target}
        />
      </div>

      <div className="h-px bg-[var(--border)] mb-5" />

      {/* Production Metrics */}
      <ProductionMetrics data={metrics} />
    </div>
  )
}

function ViewSelector({ value, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="text-[11px] font-semibold text-[var(--text-secondary)] border border-[var(--border)] rounded px-2 py-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors flex items-center gap-1"
      >
        {value}
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && (
        <div className="absolute right-0 top-7 z-10 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden min-w-[90px]">
          {VIEWS.map(v => (
            <button
              key={v}
              onClick={() => { onChange(v); setOpen(false) }}
              className={`w-full text-left px-3 py-1.5 text-[11px] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors
                ${v === value ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-primary)]'}`}
            >
              {v}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ProductionMetrics({ data }) {
  const [metricsView, setMetricsView] = useState('Day')
  const { slipIn, slipYield, warehouseIn } = data

  return (
    <div>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider">Slip In</p>
          <p className="text-fluid-xl font-black tabular-nums text-[var(--text-primary)]">
            {slipIn.pieces.toLocaleString()} <span className="text-[13px] font-semibold text-[var(--text-secondary)]">Piece</span>
          </p>
          <p className="text-[11px] text-[var(--text-secondary)] tabular-nums">{slipIn.kg.toLocaleString()} KG</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider">Slip Yield</p>
          <p className="text-fluid-5xl font-black tabular-nums text-[var(--text-primary)]">{slipYield.value}%</p>
        </div>
      </div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider">Warehouse In</p>
          <p className="text-fluid-xl font-black tabular-nums text-[var(--text-primary)]">
            {warehouseIn.pieces.toLocaleString()} <span className="text-[13px] font-semibold text-[var(--text-secondary)]">Piece</span>
          </p>
          <p className="text-[11px] text-[var(--text-secondary)] tabular-nums">{warehouseIn.kg.toLocaleString()} KG</p>
        </div>
        <div className="text-right">
          <ViewSelector value={metricsView} onChange={setMetricsView} />
        </div>
      </div>
    </div>
  )
}
