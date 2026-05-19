import { useState } from 'react'
import { useDashboard } from '../../context/DashboardContext'

const PARAMETERS = [
  { key: 'viscosity_v0',  label: 'Viscosity V0'  },
  { key: 'viscosity_v30', label: 'Viscosity V30' },
  { key: 'temperature',   label: 'Temperature'   },
  { key: 'moisture',      label: 'Moisture %'    },
]

const DEFECTS = ['All', 'Pinhole', 'Crack', 'Discoloration', 'Deformation', 'Grain Size']
const MODELS  = ['SNK-MES-v1', 'SNK-MES-v2', 'Manual']
const VIEWS   = ['Hour', 'Batch']
const DATES   = ['Today', 'Yesterday', 'This Week']

export default function FilterBar() {
  const { selectedParameter, setSelectedParameter, selectedDefect, setSelectedDefect,
          selectedModel, setSelectedModel, selectedView, setSelectedView,
          selectedDate, setSelectedDate } = useDashboard()

  const [paramOpen, setParamOpen] = useState(false)
  const [modelOpen, setModelOpen] = useState(false)
  const [viewOpen, setViewOpen]   = useState(false)
  const [dateOpen, setDateOpen]   = useState(false)

  const toggleParam = (key) => {
    setSelectedParameter(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {/* Parameter */}
      <DropdownFilter label="Parameter" display={selectedParameter.length > 0 ? `${selectedParameter.length} selected` : 'Select'} open={paramOpen} setOpen={setParamOpen}>
        {PARAMETERS.map(p => (
          <label key={p.key} className="flex items-center gap-2 px-3 py-1.5 hover:bg-[var(--accent-light)] cursor-pointer rounded">
            <input
              type="checkbox"
              checked={selectedParameter.includes(p.key)}
              onChange={() => toggleParam(p.key)}
              className="accent-[var(--accent)]"
            />
            <span className="text-[12px] text-[var(--text-primary)]">{p.label}</span>
          </label>
        ))}
      </DropdownFilter>

      {/* Defect chips */}
      <div className="flex items-center gap-1">
        <span className="text-[11px] text-[var(--text-secondary)] mr-1">Defect</span>
        {DEFECTS.map(d => (
          <button
            key={d}
            onClick={() => setSelectedDefect(d.toLowerCase())}
            className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors font-medium
              ${selectedDefect === d.toLowerCase()
                ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
              }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Model */}
      <DropdownFilter label="Model" display={selectedModel} open={modelOpen} setOpen={setModelOpen}>
        {MODELS.map(m => (
          <button key={m} onClick={() => { setSelectedModel(m); setModelOpen(false) }}
            className={`w-full text-left px-3 py-1.5 text-[12px] rounded hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors
              ${selectedModel === m ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-primary)]'}`}>
            {m}
          </button>
        ))}
      </DropdownFilter>

      {/* Views */}
      <DropdownFilter label="Views" display={selectedView} open={viewOpen} setOpen={setViewOpen}>
        {VIEWS.map(v => (
          <button key={v} onClick={() => { setSelectedView(v.toLowerCase()); setViewOpen(false) }}
            className={`w-full text-left px-3 py-1.5 text-[12px] rounded hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors
              ${selectedView === v.toLowerCase() ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-primary)]'}`}>
            {v}
          </button>
        ))}
      </DropdownFilter>

      {/* Date */}
      <DropdownFilter label="Date" display={selectedDate === 'today' ? 'Today' : selectedDate} open={dateOpen} setOpen={setDateOpen}>
        {DATES.map(d => (
          <button key={d} onClick={() => { setSelectedDate(d.toLowerCase().replace(' ', '_')); setDateOpen(false) }}
            className={`w-full text-left px-3 py-1.5 text-[12px] rounded hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors
              ${selectedDate === d.toLowerCase().replace(' ', '_') ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-primary)]'}`}>
            {d}
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
        <button
          onClick={() => setOpen(o => !o)}
          className="text-[11px] border border-[var(--border)] rounded px-2 py-0.5 text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 min-w-[80px]"
        >
          <span className="truncate">{display}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>
      {open && (
        <div className="absolute left-0 top-8 z-20 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-xl overflow-hidden min-w-[140px] py-1">
          {children}
        </div>
      )}
    </div>
  )
}
