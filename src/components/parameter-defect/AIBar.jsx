import { parameterDefect } from '../../data/mock'

export default function AIBar() {
  const { aiInsight } = parameterDefect.insights

  return (
    <div className="mt-3 bg-[var(--accent-light)] border border-[var(--accent)]/30 rounded-xl px-4 py-3 flex items-center gap-3">
      {/* Brain icon */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
          <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
          <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
          <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
          <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
        </svg>
      </div>

      {/* AI text */}
      <p className="flex-1 text-[11px] text-[var(--accent)] leading-relaxed">
        <span className="font-bold">AI Insight: </span>
        {aiInsight.text}
      </p>

      {/* Confidence */}
      <div className="flex-shrink-0 text-right">
        <p className="text-[18px] font-black tabular-nums text-[var(--accent)]">{aiInsight.confidence}%</p>
        <p className="text-[9px] text-[var(--accent)]/70 font-semibold uppercase tracking-wider">confidence</p>
      </div>
    </div>
  )
}
