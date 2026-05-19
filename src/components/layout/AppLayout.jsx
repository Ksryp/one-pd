import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import RightPanel from './RightPanel'
import NotificationPanel from '../notification/NotificationPanel'
import { useDashboard } from '../../context/DashboardContext'

export default function AppLayout() {
  const { theme, toggleTheme } = useDashboard()
  const isDark = theme === 'dark'

  return (
    <div
      className={`flex h-screen overflow-hidden bg-[var(--bg-page)] ${isDark ? 'dark' : ''}`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Sidebar */}
      <div className="flex-shrink-0 p-2 h-full relative z-50">
        <Sidebar isDark={isDark} onThemeToggle={toggleTheme} />
      </div>

      {/* Main content — gets full width on mobile/tablet, shares with RightPanel on xl+ */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <Outlet />
      </main>

      {/* Right panel — fixed width on xl+, hidden drawer on smaller */}
      <RightPanel>
        <NotificationPanel />
      </RightPanel>
    </div>
  )
}
