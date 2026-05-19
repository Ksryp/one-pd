import { useNavigate } from 'react-router-dom'

const LEVEL_MAP = {
  EMERGENCY:   { border: 'border-l-[#DC2626] bg-[#FEE2E2]/40', badge: 'bg-[#FEE2E2] text-[#991B1B] border border-[#DC2626]' },
  ABNORMAL:    { border: 'border-l-[#D97706] bg-[#FEF3C7]/40', badge: 'bg-[#FEF3C7] text-[#92400E] border border-[#D97706]' },
  NORMAL:      { border: 'border-l-[#16A34A] bg-[#DCFCE7]/20', badge: 'bg-[#DCFCE7] text-[#166534] border border-[#16A34A]' },
  MAINTENANCE: { border: 'border-l-[#9CA3AF] bg-[#F3F4F6]/40',  badge: 'bg-[#F3F4F6] text-[#374151] border border-[#9CA3AF]' },
}

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
