import { useNavigate } from 'react-router-dom'
import { ALERT_CARD_STYLES as LEVEL_MAP } from '../../constants/status'

export default function AlertCard({ title, level, message, timestamp, resolved, stage }) {
  const s = LEVEL_MAP[level] || LEVEL_MAP.NORMAL
  const navigate = useNavigate()
  
  return (
    <div 
      className={`border-l-4 rounded-r-lg px-3 py-3 mb-2 transition-all duration-200 hover:brightness-95 cursor-pointer ${s.border} ${resolved ? 'opacity-50' : ''}`}
      onClick={() => stage && navigate(`/stage/${stage}`)}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${s.badge}`}>
          {level}
        </span>
        {resolved && (
          <span className="text-[10px] text-[#16A34A] font-semibold">✓ Resolved</span>
        )}
      </div>
      <p className="text-[12px] font-bold text-[var(--text-primary)] mt-1 leading-tight">{title}</p>
      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed line-clamp-2">{message}</p>
      <p className="text-[10px] text-[var(--text-secondary)] mt-1.5 tabular-nums text-right">{timestamp}</p>
    </div>
  )
}
