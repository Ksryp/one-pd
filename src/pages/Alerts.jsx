import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { STATUS_COLORS as LEVEL_MAP } from '../constants/status'
import { useNotifications } from '../hooks/useNotifications'
import { api } from '../services/api'

const USE_API = import.meta.env.VITE_USE_API === 'true'
const STAGES = ['All', 'slip-prep', 'glaze-prep', 'casting', 'drying', 'spraying', 'firing']

export default function Alerts() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  const { data: liveAlerts } = useNotifications()
  const [alerts, setAlerts] = useState([])

  useEffect(() => { setAlerts(liveAlerts) }, [liveAlerts])

  const filtered = filter === 'All' ? alerts : alerts.filter(a => a.stage === filter)

  const resolve = async (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a))
    if (USE_API) {
      try { await api.patch(`/api/alerts/${id}/resolve`) } catch (_) {}
    }
  }

  return (
    <div className="p-5 min-h-full bg-[var(--bg-page)]">
      <h1 className="text-fluid-2xl font-black text-[var(--text-primary)] mb-5">Alerts</h1>

      {/* Stage filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {STAGES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-[11px] px-3 py-1 rounded-full border font-semibold transition-colors capitalize
              ${filter === s ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Alert table */}
      <div className="space-y-3">
        {filtered.map(alert => {
          const s = LEVEL_MAP[alert.level] || LEVEL_MAP.NORMAL
          return (
            <div key={alert.id} className={`bg-[var(--bg-card)] border border-l-4 rounded-xl p-4 flex items-start justify-between gap-4 ${alert.resolved ? 'opacity-50' : ''}`}
              style={{ borderLeftColor: s.border }}>
              <div 
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => navigate(`/stage/${alert.stage}`)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                    style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border }}>
                    {alert.level}
                  </span>
                  <span className="text-[11px] text-[var(--text-secondary)] capitalize hover:text-[var(--accent)] hover:underline">{alert.stage}</span>
                </div>
                <p className="text-[13px] font-bold text-[var(--text-primary)] mb-0.5 hover:text-[var(--accent)] transition-colors">{alert.title}</p>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{alert.message}</p>
                <p className="text-[10px] text-[var(--text-secondary)] mt-1.5 tabular-nums">{alert.timestamp}</p>
              </div>
              {!alert.resolved && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resolve(alert.id);
                  }}
                  className="flex-shrink-0 text-[11px] px-3 py-1.5 bg-[#DCFCE7] text-[#166534] border border-[#16A34A] rounded-lg font-semibold hover:bg-[#16A34A] hover:text-white transition-colors cursor-pointer relative z-10"
                >
                  Resolve
                </button>
              )}
              {alert.resolved && (
                <span className="flex-shrink-0 text-[11px] text-[#16A34A] font-semibold">✓ Resolved</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
