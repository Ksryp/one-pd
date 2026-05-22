import { useState } from 'react'
import { parameterDefect } from '../../data/mock'

export default function AIBar() {
  const [model, setModel] = useState('Gemini 1.5 Pro')
  const [interval, setInterval] = useState('1H')
  const [confidence, setConfidence] = useState('80')
  const { aiInsight } = parameterDefect.insights

  const models = ['Gemini 1.5 Pro', 'GPT-4o', 'Claude 3.5 Sonnet', 'Custom SNK Model']
  const intervals = ['1H', '4H', '8H', 'Day', 'Week', 'Month', 'Year']
  const confidenceLevels = [
    { value: '70', label: '> 70% Confidence' },
    { value: '80', label: '> 80% Confidence' },
    { value: '90', label: '> 90% Confidence' },
    { value: '95', label: '> 95% Confidence' },
  ]

  return (
    <div className="mt-3 bg-[var(--accent-light)] border border-[var(--accent)]/30 rounded-xl px-4 py-3 flex flex-col gap-3">
      {/* Main Content */}
      <div className="flex items-center gap-3">
        {/* Brain icon */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-sm">
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

      {/* Footer Settings & Disclaimer */}
      <div className="border-t border-[var(--accent)]/20 pt-2 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-[var(--accent)]/80 uppercase tracking-widest">Model:</span>
            <select 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
              className="bg-transparent border border-[var(--accent)]/30 rounded text-[10px] text-[var(--accent)] font-medium px-2 py-0.5 outline-none focus:border-[var(--accent)] cursor-pointer max-w-[130px]"
            >
              {models.map(m => (
                <option key={m} value={m} className="bg-[var(--bg-card)] text-[var(--text-primary)]">{m}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-[var(--accent)]/80 uppercase tracking-widest">Interval:</span>
            <select 
              value={interval} 
              onChange={(e) => setInterval(e.target.value)}
              className="bg-transparent border border-[var(--accent)]/30 rounded text-[10px] text-[var(--accent)] font-medium px-2 py-0.5 outline-none focus:border-[var(--accent)] cursor-pointer"
            >
              {intervals.map(i => (
                <option key={i} value={i} className="bg-[var(--bg-card)] text-[var(--text-primary)]">Every {i}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-[var(--accent)]/80 uppercase tracking-widest">Filter:</span>
            <select 
              value={confidence} 
              onChange={(e) => setConfidence(e.target.value)}
              className="bg-transparent border border-[var(--accent)]/30 rounded text-[10px] text-[var(--accent)] font-medium px-2 py-0.5 outline-none focus:border-[var(--accent)] cursor-pointer"
            >
              {confidenceLevels.map(c => (
                <option key={c.value} value={c.value} className="bg-[var(--bg-card)] text-[var(--text-primary)]">{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-[9px] text-[var(--accent)]/80 italic leading-relaxed">
          *หมายเหตุ: ข้อมูลนี้เป็นเพียงการวิเคราะห์เบื้องต้นจาก AI แนะนำให้ตรวจสอบหน้างานจริง
        </p>
      </div>
    </div>
  )
}
