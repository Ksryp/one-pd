import { useState, useEffect } from 'react'
import { useDashboard } from '../../context/DashboardContext'
import { api } from '../../services/api'

const PARAMETERS = [
  { key: 'viscosity_v0',  label: 'Viscosity V0'    },
  { key: 'viscosity_v30', label: 'Viscosity V30'   },
  { key: 'temperature',   label: 'Temperature'     },
  { key: 'concentration', label: 'Concentration'   },
  { key: 'casting_rate',  label: 'Casting Rate'    },
  { key: 'yield_value',   label: 'Yield'           },
  { key: 'thixo',         label: 'Thixotropy'      },
]

const VIEWS = [
  { key: 'hour',  label: 'Hour'  },
  { key: 'day',   label: 'Day'   },
  { key: 'week',  label: 'Week'  },
  { key: 'month', label: 'Month' },
]

const REFRESH_OPTIONS = [
  { key: '1m',     label: '1 min'  },
  { key: '5m',     label: '5 min'  },
  { key: '15m',    label: '15 min' },
  { key: '30m',    label: '30 min' },
  { key: '1hr',    label: '1 hr'   },
  { key: '4hr',    label: '4 hr'   },
  { key: 'Manual', label: 'Manual' },
]

export default function FilterBar() {
  const {
    selectedParameter, setSelectedParameter,
    selectedDefect,    setSelectedDefect,
    selectedModel,     setSelectedModel,
    selectedView,      setSelectedView,
    selectedDate,      setSelectedDate,
    refreshInterval,   setRefreshInterval,
  } = useDashboard()

  // Dropdown open states
  const [paramOpen,    setParamOpen]    = useState(false)
  const [defectOpen,   setDefectOpen]   = useState(false)
  const [modelOpen,    setModelOpen]    = useState(false)
  const [viewOpen,     setViewOpen]     = useState(false)
  const [dateOpen,     setDateOpen]     = useState(false)
  const [refreshOpen,  setRefreshOpen]  = useState(false)

  // Dynamic options from API
  const [modelOptions,  setModelOptions]  = useState([])
  const [defectOptions, setDefectOptions] = useState([])

  // Date range local state
  const parts = (selectedDate || '').split(' to ')
  const today = new Date().toISOString().split('T')[0]
  const [startDate, setStartDate] = useState(parts[0] || today)
  const [endDate,   setEndDate]   = useState(parts[1] || today)

  // Keep context in sync with date pickers
  useEffect(() => {
    setSelectedDate(`${startDate} to ${endDate}`)
  }, [startDate, endDate, setSelectedDate])

  // Load models + defect types from DB
  useEffect(() => {
    api.get('/api/meta/models').then(d => setModelOptions(d)).catch(() => {})
    api.get('/api/meta/defect-types').then(d => setDefectOptions(d)).catch(() => {})
  }, [])

  const toggleParam = key =>
    setSelectedParameter(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )

  const toggleModel = name => {
    if (name === 'All') { setSelectedModel(['All']); return }
    setSelectedModel(prev => {
      const next = prev.filter(k => k !== 'All')
      const updated = next.includes(name) ? next.filter(k => k !== name) : [...next, name]
      return updated.length === 0 ? ['All'] : updated
    })
  }

  const modelDisplay = Array.isArray(selectedModel) && selectedModel.includes('All')
    ? 'All Models'
    : `${(selectedModel || []).length} model(s)`

  const defectDisplay = selectedDefect === 'all'
    ? 'All'
    : (defectOptions.find(d => d.code.toLowerCase() === selectedDefect)?.code ?? selectedDefect.toUpperCase())

  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">

      {/* Parameter */}
      <DropdownFilter label="Parameter"
        display={`${(selectedParameter || []).length} selected`}
        open={paramOpen} setOpen={setParamOpen}>
        {PARAMETERS.map(p => (
          <label key={p.key} className="flex items-center gap-2 px-3 py-1.5 hover:bg-[var(--accent-light)] cursor-pointer rounded">
            <input type="checkbox" className="accent-[var(--accent)]"
              checked={(selectedParameter || []).includes(p.key)}
              onChange={() => toggleParam(p.key)} />
            <span className="text-[12px] text-[var(--text-primary)]">{p.label}</span>
          </label>
        ))}
      </DropdownFilter>

      {/* Defect */}
      <DropdownFilter label="Defect" display={defectDisplay} open={defectOpen} setOpen={setDefectOpen}>
        <button onClick={() => { setSelectedDefect('all'); setDefectOpen(false) }}
          className={`w-full text-left px-3 py-1.5 text-[12px] rounded hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors
            ${selectedDefect === 'all' ? 'text-[var(--accent)] font-bold bg-[var(--accent-light)]' : 'text-[var(--text-primary)]'}`}>
          All Defects
        </button>
        {defectOptions.map(d => (
          <button key={d.code}
            onClick={() => { setSelectedDefect(d.code.toLowerCase()); setDefectOpen(false) }}
            className={`w-full text-left px-3 py-1.5 text-[12px] rounded hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors
              ${selectedDefect === d.code.toLowerCase() ? 'text-[var(--accent)] font-bold bg-[var(--accent-light)]' : 'text-[var(--text-primary)]'}`}>
            <span className="font-semibold">{d.code}</span>
            <span className="text-[10px] text-[var(--text-secondary)] ml-1.5">{d.label}</span>
          </button>
        ))}
      </DropdownFilter>

      {/* Model */}
      <DropdownFilter label="Model" display={modelDisplay} open={modelOpen} setOpen={setModelOpen}>
        <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-[var(--accent-light)] cursor-pointer rounded">
          <input type="checkbox" className="accent-[var(--accent)]"
            checked={Array.isArray(selectedModel) && selectedModel.includes('All')}
            onChange={() => toggleModel('All')} />
          <span className="text-[12px] font-bold text-[var(--text-primary)]">All Models</span>
        </label>
        {modelOptions.slice(0, 20).map(m => (
          <label key={m.name} className="flex items-center gap-2 px-3 py-1.5 hover:bg-[var(--accent-light)] cursor-pointer rounded">
            <input type="checkbox" className="accent-[var(--accent)]"
              checked={Array.isArray(selectedModel) && selectedModel.includes(m.name)}
              onChange={() => toggleModel(m.name)} />
            <span className="text-[11px] text-[var(--text-primary)] truncate max-w-[180px]" title={m.name}>{m.name}</span>
          </label>
        ))}
      </DropdownFilter>

      {/* Views */}
      <DropdownFilter label="Views" display={VIEWS.find(v => v.key === selectedView)?.label ?? 'Day'} open={viewOpen} setOpen={setViewOpen}>
        {VIEWS.map(v => (
          <button key={v.key} onClick={() => { setSelectedView(v.key); setViewOpen(false) }}
            className={`w-full text-left px-3 py-1.5 text-[12px] rounded hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors
              ${selectedView === v.key ? 'text-[var(--accent)] font-bold bg-[var(--accent-light)]' : 'text-[var(--text-primary)]'}`}>
            {v.label}
          </button>
        ))}
      </DropdownFilter>

      {/* Date */}
      <DropdownFilter label="Date" display={`${startDate} – ${endDate}`} open={dateOpen} setOpen={setDateOpen}>
        <div className="p-3 flex flex-col gap-3 min-w-[200px]">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Start</span>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[12px] px-2 py-1.5 text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">End</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[12px] px-2 py-1.5 text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" />
          </div>
        </div>
      </DropdownFilter>

      {/* Auto-Refresh */}
      <DropdownFilter label="Refresh"
        display={REFRESH_OPTIONS.find(r => r.key === refreshInterval)?.label ?? '5 min'}
        open={refreshOpen} setOpen={setRefreshOpen}>
        {REFRESH_OPTIONS.map(r => (
          <button key={r.key} onClick={() => { setRefreshInterval(r.key); setRefreshOpen(false) }}
            className={`w-full text-left px-3 py-1.5 text-[12px] rounded hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors
              ${refreshInterval === r.key ? 'text-[var(--accent)] font-bold bg-[var(--accent-light)]' : 'text-[var(--text-primary)]'}`}>
            {r.label}
          </button>
        ))}
      </DropdownFilter>

    </div>
  )
}

function DropdownFilter({ label, display, open, setOpen, children }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        <span className="text-[11px] text-[var(--text-secondary)]">{label}</span>
        <button onClick={() => setOpen(o => !o)}
          className="text-[11px] border border-[var(--border)] bg-[var(--bg-card)] rounded-lg px-2.5 py-1 text-[var(--text-primary)] font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 min-w-[80px]">
          <span className="truncate max-w-[140px]">{display}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>
      {open && (
        <div className="absolute left-0 top-10 z-20 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden min-w-[160px] py-1 max-h-[320px] overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  )
}
