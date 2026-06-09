import React, { createContext, useContext, useState } from 'react'

const DashboardContext = createContext(null)

export function DashboardProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const [selectedDate, setSelectedDate] = useState('today')
  const [selectedDefect, setSelectedDefect] = useState('all')
  const [selectedParameter, setSelectedParameter] = useState(['viscosity_v0'])
  const [selectedModel, setSelectedModel] = useState(['All'])
  const [selectedView, setSelectedView] = useState('hour')
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [pdSortBy, setPdSortBy] = useState('count')
  const [pdSortDir, setPdSortDir] = useState('desc')

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    // Apply dark class to root element for Tailwind dark mode
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  return (
    <DashboardContext.Provider value={{
      theme,
      setTheme,
      toggleTheme,
      selectedDate,
      setSelectedDate,
      selectedDefect,
      setSelectedDefect,
      selectedParameter,
      setSelectedParameter,
      selectedModel,
      setSelectedModel,
      selectedView,
      setSelectedView,
      rightPanelOpen,
      setRightPanelOpen,
      pdSortBy,
      pdSortDir,
      setPdSort: (field) => {
        setPdSortBy(prev => {
          if (prev === field) setPdSortDir(d => d === 'asc' ? 'desc' : 'asc')
          else { setPdSortDir('desc'); return field }
          return prev
        })
      },
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider')
  return ctx
}

export default DashboardContext
