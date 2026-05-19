import { useState } from 'react'
import { useDashboard } from '../context/DashboardContext'

const THRESHOLDS = [
  { param: 'Viscosity V0 UCL', value: 900, unit: 'cP' },
  { param: 'Viscosity V0 LCL', value: 700, unit: 'cP' },
  { param: 'Temperature UCL',  value: 1280, unit: '°C' },
  { param: 'Temperature LCL',  value: 1180, unit: '°C' },
  { param: 'Moisture UCL',     value: 15, unit: '%' },
  { param: 'Moisture LCL',     value: 8,  unit: '%' },
]

export default function Settings() {
  const { theme, toggleTheme } = useDashboard()
  const [thresholds, setThresholds] = useState(THRESHOLDS)

  const updateThreshold = (i, val) => {
    setThresholds(prev => prev.map((t, idx) => idx === i ? { ...t, value: Number(val) } : t))
  }

  return (
    <div className="p-5 min-h-full bg-[var(--bg-page)]">
      <h1 className="text-fluid-2xl font-black text-[var(--text-primary)] mb-6">Settings</h1>

      {/* User Profile */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-5 shadow-sm">
        <h2 className="text-[13px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-4">User Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white text-xl font-black">P</div>
          <div>
            <p className="font-bold text-[var(--text-primary)]">Production Manager</p>
            <p className="text-[12px] text-[var(--text-secondary)]">prod.manager@snk.co.th</p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">SNK Ceramics Factory</p>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-5 shadow-sm">
        <h2 className="text-[13px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-[var(--text-primary)]">Dark Mode</p>
            <p className="text-[11px] text-[var(--text-secondary)]">Switch between light and dark theme</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${theme === 'dark' ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Thresholds */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
        <h2 className="text-[13px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-4">Alert Thresholds</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {thresholds.map((t, i) => (
            <div key={t.param} className="flex items-center justify-between gap-3 border border-[var(--border)] rounded-lg px-3 py-2">
              <div>
                <p className="text-[12px] font-semibold text-[var(--text-primary)]">{t.param}</p>
                <p className="text-[10px] text-[var(--text-secondary)]">{t.unit}</p>
              </div>
              <input
                type="number"
                value={t.value}
                onChange={e => updateThreshold(i, e.target.value)}
                className="w-24 text-right text-[13px] font-bold tabular-nums bg-[var(--bg-page)] border border-[var(--border)] rounded-lg px-2 py-1 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
          ))}
        </div>
        <button className="mt-4 px-4 py-2 bg-[var(--accent)] text-white text-[12px] font-bold rounded-lg hover:opacity-90 transition-opacity">
          Save Thresholds
        </button>
      </div>
    </div>
  )
}
