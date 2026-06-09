import { useState, useEffect } from 'react'
import { useDashboard } from '../../context/DashboardContext'
import { SORT_CONFIG } from '../../data/parameterDefectSort'

const PARAMETERS = [
  { key: 'viscosity_v0',  label: 'Viscosity V0'  },
  { key: 'viscosity_v30', label: 'Viscosity V30' },
  { key: 'temperature',   label: 'Temperature'   },
  { key: 'moisture',      label: 'Moisture %'    },
]

const DEFECTS = [
  { key: 'All', abbr: 'All', desc: 'All Defects' },
  { key: 'C', abbr: 'C', desc: 'Crack' },
  { key: 'B', abbr: 'B', desc: 'Poor Body' },
  { key: 'P', abbr: 'P', desc: 'Pin Hole' },
  { key: 'J', abbr: 'J', desc: 'Glaze Jump' },
  { key: 'CD', abbr: 'CD', desc: 'Clay Dirt' },
  { key: 'W', abbr: 'W', desc: 'Warp' },
  { key: 'X', abbr: 'X', desc: 'Poor Function' },
  { key: 'G', abbr: 'G', desc: 'Poor Glazing' },
  { key: 'K', abbr: 'K', desc: 'Knock' },
  { key: 'F', abbr: 'F', desc: 'Poor Fire' },
  { key: 'KD', abbr: 'KD', desc: 'Kiln Dirt' },
  { key: 'S', abbr: 'S', desc: 'Spot' },
  { key: 'O', abbr: 'O', desc: 'Other' }
]

const MODELS  = ['C132227', 'C11332', 'C13330', 'C1053', 'C1234']
const VIEWS   = ['1H', '4H', '8H', 'Day', 'Week', 'Month', 'Year']

export default function FilterBar() {
  const { selectedParameter, setSelectedParameter, selectedDefect, setSelectedDefect,
          selectedModel, setSelectedModel, selectedView, setSelectedView,
          selectedDate, setSelectedDate,
          pdSortBy, pdSortDir, setPdSort } = useDashboard()

  const [paramOpen, setParamOpen] = useState(false)
  const [defectOpen, setDefectOpen] = useState(false)
  const [modelOpen, setModelOpen] = useState(false)
  const [viewOpen, setViewOpen]   = useState(false)
  const [dateOpen, setDateOpen]   = useState(false)
  const [sortOpen, setSortOpen]   = useState(false)

  // Parse initial dates from selectedDate or use today
  const todayStr = new Date().toISOString().split('T')[0]
  const [startDate, setStartDate] = useState(todayStr)
  const [endDate, setEndDate] = useState(todayStr)

  useEffect(() => {
    setSelectedDate(`${startDate} to ${endDate}`)
  }, [startDate, endDate, setSelectedDate])

  const toggleParam = (key) => {
    setSelectedParameter(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const toggleModel = (key) => {
    if (key === 'All') {
      setSelectedModel(['All'])
    } else {
      setSelectedModel(prev => {
        let newSelection = Array.isArray(prev) ? prev.filter(k => k !== 'All') : []
        if (newSelection.includes(key)) {
          newSelection = newSelection.filter(k => k !== key)
        } else {
          newSelection = [...newSelection, key]
        }
        return newSelection.length === 0 ? ['All'] : newSelection
      })
    }
  }

  const getDefectDisplay = () => {
    const d = DEFECTS.find(x => x.key.toLowerCase() === selectedDefect.toLowerCase())
    return d ? d.abbr : 'All'
  }

  const getModelDisplay = () => {
    if (!Array.isArray(selectedModel)) return 'All'
    if (selectedModel.includes('All')) return 'All Models'
    return `${selectedModel.length} selected`
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

      {/* Defect */}
      <DropdownFilter label="Defect" display={getDefectDisplay()} open={defectOpen} setOpen={setDefectOpen}>
        {DEFECTS.map(d => (
          <button 
            key={d.key} 
            title={`${d.abbr} (${d.desc})`} 
            onClick={() => { setSelectedDefect(d.key.toLowerCase()); setDefectOpen(false) }}
            className={`w-full text-left px-3 py-1.5 text-[12px] rounded hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors
              ${selectedDefect.toLowerCase() === d.key.toLowerCase() ? 'text-[var(--accent)] font-bold bg-[var(--accent-light)]' : 'text-[var(--text-primary)]'}`}
          >
            {d.abbr} <span className="text-[10px] text-[var(--text-secondary)] font-normal ml-1">({d.desc})</span>
          </button>
        ))}
      </DropdownFilter>

      {/* Model */}
      <DropdownFilter label="Model" display={getModelDisplay()} open={modelOpen} setOpen={setModelOpen}>
        <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-[var(--accent-light)] cursor-pointer rounded">
          <input
            type="checkbox"
            checked={Array.isArray(selectedModel) && selectedModel.includes('All')}
            onChange={() => toggleModel('All')}
            className="accent-[var(--accent)]"
          />
          <span className="text-[12px] text-[var(--text-primary)] font-bold">All Models</span>
        </label>
        {MODELS.map(m => (
          <label key={m} className="flex items-center gap-2 px-3 py-1.5 hover:bg-[var(--accent-light)] cursor-pointer rounded">
            <input
              type="checkbox"
              checked={Array.isArray(selectedModel) && selectedModel.includes(m)}
              onChange={() => toggleModel(m)}
              className="accent-[var(--accent)]"
            />
            <span className="text-[12px] text-[var(--text-primary)]">{m}</span>
          </label>
        ))}
      </DropdownFilter>

      {/* Views */}
      <DropdownFilter label="Views" display={selectedView} open={viewOpen} setOpen={setViewOpen}>
        {VIEWS.map(v => (
          <button key={v} onClick={() => { setSelectedView(v.toLowerCase()); setViewOpen(false) }}
            className={`w-full text-left px-3 py-1.5 text-[12px] rounded hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors
              ${selectedView === v.toLowerCase() ? 'text-[var(--accent)] font-bold bg-[var(--accent-light)]' : 'text-[var(--text-primary)]'}`}>
            {v}
          </button>
        ))}
      </DropdownFilter>

      {/* Sort */}
      <DropdownFilter
        label="Sort"
        display={
          <span className="flex items-center gap-1">
            {SORT_CONFIG.find(c => c.field === pdSortBy)?.label ?? 'Count'}
            <span className="text-[10px] font-black">{pdSortDir === 'asc' ? '▲' : '▼'}</span>
          </span>
        }
        open={sortOpen}
        setOpen={setSortOpen}
      >
        {SORT_CONFIG.map(cfg => (
          <button
            key={cfg.field}
            onClick={() => { setPdSort(cfg.field); setSortOpen(false) }}
            className={`w-full text-left px-3 py-1.5 text-[12px] rounded flex items-center justify-between
              hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors
              ${pdSortBy === cfg.field ? 'text-[var(--accent)] font-bold bg-[var(--accent-light)]' : 'text-[var(--text-primary)]'}`}
          >
            <span>{cfg.label}</span>
            {pdSortBy === cfg.field && (
              <span className="text-[10px] font-black">{pdSortDir === 'asc' ? '▲' : '▼'}</span>
            )}
          </button>
        ))}
      </DropdownFilter>

      {/* Date */}
      <DropdownFilter label="Date" display={`${startDate} - ${endDate}`} open={dateOpen} setOpen={setDateOpen}>
        <div className="p-3 flex flex-col gap-3 min-w-[200px]">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Start Date</span>
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)} 
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[12px] px-2 py-1.5 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] font-medium" 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">End Date</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)} 
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[12px] px-2 py-1.5 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] font-medium" 
            />
          </div>
        </div>
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
          className="text-[11px] border border-[var(--border)] bg-[var(--bg-card)] rounded-lg px-2.5 py-1 text-[var(--text-primary)] font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 min-w-[80px]"
        >
          <span className="truncate">{display}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>
      {open && (
        <div className="absolute left-0 top-10 z-20 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden min-w-[160px] py-1 max-h-[300px] overflow-y-auto scrollbar-thin">
          {children}
        </div>
      )}
    </div>
  )
}
