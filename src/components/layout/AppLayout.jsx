import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import RightPanel from './RightPanel'
import NotificationPanel from '../notification/NotificationPanel'
import { useDashboard } from '../../context/DashboardContext'

export default function AppLayout() {
  const { theme, toggleTheme } = useDashboard()
  const isDark = theme === 'dark'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // ปิด sidebar เมื่อหน้าจอขยายออกไป desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = (e) => { if (e.matches) setMobileSidebarOpen(false) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // ล็อค body scroll เมื่อ mobile drawer เปิด
  useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileSidebarOpen])

  return (
    <div
      className={`flex h-screen overflow-hidden bg-[var(--bg-page)] ${isDark ? 'dark' : ''}`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Hamburger button — mobile only ── */}
      <button
        className="md:hidden fixed top-3 left-3 z-[60] flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--bg-card)] shadow-md border border-[var(--border)] text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--accent)] hover:shadow-lg"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Open navigation menu"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M2 4h14M2 9h14M2 14h14" />
        </svg>
      </button>

      {/* ── Backdrop — mobile only ── */}
      <div
        className={`md:hidden fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          mobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* ── Sidebar wrapper ──
          Desktop : flex item ปกติ (static)
          Mobile  : fixed drawer slide-in จากซ้าย
      ── */}
      <div
        className={[
          // desktop — อยู่ใน flex flow ปกติ
          'md:flex-shrink-0 md:p-2 md:h-full md:relative md:z-50',
          'md:translate-x-0 md:!translate-x-0',
          // mobile — fixed drawer
          'fixed top-0 left-0 h-full p-2 z-[56]',
          'transition-transform duration-300 ease-in-out',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <Sidebar isDark={isDark} onThemeToggle={toggleTheme} />
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto min-w-0 md:ml-0">
        {/* spacer บน mobile สำหรับ hamburger button */}
        <div className="md:hidden h-14" />
        <Outlet />
      </main>

      {/* ── Right panel ── */}
      <RightPanel>
        <NotificationPanel />
      </RightPanel>
    </div>
  )
}
