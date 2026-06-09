// ── Sort config — add ONE entry here to make a new field sortable ──────────
export const SORT_CONFIG = [
  { field: 'count',    label: 'Count',       type: 'number', accessor: r => r.count    },
  { field: 'subCount', label: 'Sub Count',   type: 'number', accessor: r => r.subCount },
  { field: 'name',     label: 'Defect Type', type: 'string', accessor: r => r.name     },
  { field: 'subType',  label: 'Sub Type',    type: 'string', accessor: r => r.subType  },
]

export const STATUS_ORDER = { EMERGENCY: 1, ABNORMAL: 2, NORMAL: 3, MAINTENANCE: 4 }

function compare(a, b, type, dir) {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  let result
  switch (type) {
    case 'number': result = a - b; break
    case 'date':   result = new Date(a) - new Date(b); break
    case 'status': result = (STATUS_ORDER[a] ?? 99) - (STATUS_ORDER[b] ?? 99); break
    default:       result = String(a).localeCompare(String(b))
  }
  return dir === 'asc' ? result : -result
}

// Accepts the insights object + sort options — no mock dependency
export function sortInsights(insights, { sortBy = 'count', sortDir = 'desc' } = {}) {
  if (!insights?.peakDefect?.byType) return insights
  const cfg = SORT_CONFIG.find(c => c.field === sortBy) ?? SORT_CONFIG[0]
  const sorted = [...insights.peakDefect.byType].sort((a, b) =>
    compare(cfg.accessor(a), cfg.accessor(b), cfg.type, sortDir)
  )
  return {
    ...insights,
    peakDefect: { ...insights.peakDefect, byType: sorted },
  }
}
