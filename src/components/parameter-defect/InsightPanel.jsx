import { Fragment, useState } from 'react'
import { useDashboard } from '../../context/DashboardContext'
import { getParameterDefectInsights } from '../../data/parameterDefectSort'

export default function InsightPanel() {
  const { pdSortBy, pdSortDir, setPdSort } = useDashboard()
  const { peakDefect, paramAtPeak, correlation, totalDefect } = getParameterDefectInsights({
    sortBy: pdSortBy,
    sortDir: pdSortDir,
  })

  return (
    // 2-col grid when stacked (below lg), single col when side panel (lg+)
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 h-full">
      {/* Peak Defect */}
      <InsightCard title="Peak Defect" hoverColor="#DC2626">
        {/* Column headers — click to sort */}
        <div className="grid grid-cols-2 gap-x-3 mt-2 mb-1">
          {[
            { field: 'name',     label: 'Type'      },
            { field: 'count',    label: 'Count'     },
            { field: 'subType',  label: 'Sub Type'  },
            { field: 'subCount', label: 'Sub Count' },
          ].map(col => (
            <button
              key={col.field}
              onClick={() => setPdSort(col.field)}
              className={`flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors
                hover:text-[var(--accent)]
                ${pdSortBy === col.field ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}
            >
              {col.label}
              {pdSortBy === col.field && (
                <span className="text-[9px]">{pdSortDir === 'asc' ? '▲' : '▼'}</span>
              )}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {peakDefect.byType.map((t) => (
            <Fragment key={t.name}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#4F8EE8] font-medium">{t.name}</span>
                <span className="text-[11px] font-bold tabular-nums text-[var(--text-primary)]">{t.count.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-secondary)]">{t.subType}</span>
                <span className="text-[11px] font-bold tabular-nums text-[var(--text-primary)]">{t.subCount.toLocaleString()}</span>
              </div>
            </Fragment>
          ))}
        </div>
      </InsightCard>

      {/* Parameter at Peak */}
      <InsightCard title="Parameter at Peak" hoverColor="#D97706">
        <p className="text-[20px] font-black tabular-nums text-[var(--text-primary)] mt-1">
          {paramAtPeak.value} <span className="text-[13px] font-medium text-[var(--text-secondary)]">{paramAtPeak.unit}</span>
        </p>
        <p className="text-[11px] text-[var(--text-secondary)]">{paramAtPeak.name}</p>
        {paramAtPeak.exceedUCL && (
          <span className="inline-block mt-1 text-[10px] bg-[#FEE2E2] text-[#991B1B] border border-[#DC2626] rounded px-1.5 py-0.5 font-semibold">
            ↑ Exceeded UCL
          </span>
        )}
      </InsightCard>

      {/* Correlation */}
      <InsightCard title="Correlation" hoverColor="#4F8EE8">
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[28px] font-black tabular-nums text-[var(--accent)]">
            r={correlation.value}
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            correlation.strength === 'strong' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEF3C7] text-[#92400E]'
          }`}>
            {correlation.strength}
          </span>
        </div>
        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{correlation.message}</p>
      </InsightCard>

      {/* Total Defect */}
      <InsightCard title="Total Defect" hoverColor="#F59E0B">
        <div className="flex items-start justify-between mt-1">
          <div>
            <p className="text-[24px] font-black tabular-nums" style={{ color: '#D97706' }}>
              {totalDefect.count.toLocaleString()}
              <span className="text-[13px] font-semibold ml-1 text-[var(--text-secondary)]">Point</span>
            </p>
            <p className="text-[11px] text-[var(--text-secondary)]">{totalDefect.rate}% Production</p>
          </div>
          <div className="text-right space-y-0.5">
            {totalDefect.byCategory.map(c => (
              <div key={c.name} className="flex items-center justify-between gap-3 text-[10px]">
                <span className="text-[var(--text-secondary)]">{c.name}</span>
                <span className="font-bold tabular-nums text-[var(--text-primary)]">{c.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </InsightCard>
    </div>
  )
}

function InsightCard({ title, children, hoverColor }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className={`bg-[var(--bg-card)] border rounded-xl p-3 transition-all duration-200 flex-1
        ${hovered ? `shadow-md scale-[1.01]` : 'shadow-sm border-[var(--border)]'}`}
      style={hovered ? { borderColor: hoverColor } : {}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <p className="text-[11px] font-bold tracking-widest uppercase text-[var(--text-secondary)]">{title}</p>
      {children}
    </div>
  )
}
