import { useState, useEffect, useRef } from 'react'
import { useDashboard } from '../../context/DashboardContext'

export default function RightPanel({ children }) {
  const { rightPanelOpen, setRightPanelOpen } = useDashboard()
  const [isMobile, setIsMobile] = useState(false)
  const startX = useRef(null)
  const drawerRef = useRef(null)

  // Detect mobile/tablet — drawer mode below 1280px (xl)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1280)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Swipe to close
  const handleTouchStart = (e) => { startX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    if (startX.current === null) return
    const diff = startX.current - e.changedTouches[0].clientX
    if (diff < -50) setRightPanelOpen(false)
    startX.current = null
  }

  if (!isMobile) {
    return (
      <aside className="w-[300px] xl:w-[320px] flex-shrink-0 bg-[var(--bg-card)] border-l border-[var(--border)] overflow-y-auto h-full">
        {children}
      </aside>
    )
  }

  return (
    <>
      {/* FAB */}
      <button
        id="right-panel-fab"
        onClick={() => setRightPanelOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[var(--accent)] text-white shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Open notifications panel"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M18 20a6 6 0 00-12 0" /><circle cx="12" cy="10" r="4" />
        </svg>
      </button>

      {/* Backdrop */}
      {rightPanelOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setRightPanelOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        ref={drawerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`fixed top-0 right-0 z-50 h-full w-[300px] bg-[var(--bg-card)] shadow-2xl border-l border-[var(--border)] overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${rightPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Close button */}
        <button
          onClick={() => setRightPanelOpen(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent)] hover:text-white transition-colors"
        >
          ×
        </button>
        {children}
      </aside>
    </>
  )
}
