import React, { createContext, useContext, useState } from 'react'

const DashboardContext = createContext(null)

const today = new Date()
const thirtyDaysAgo = new Date(today)
thirtyDaysAgo.setDate(today.getDate() - 30)
const fmt = d => d.toISOString().split('T')[0]
const DEFAULT_DATE_RANGE = `${fmt(thirtyDaysAgo)} to ${fmt(today)}`

export function DashboardProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const [selectedDate, setSelectedDate] = useState(DEFAULT_DATE_RANGE)
  const [selectedDefect, setSelectedDefect] = useState('all')
  const [selectedParameter, setSelectedParameter] = useState(['viscosity_v0'])
  const [selectedModel, setSelectedModel] = useState(['All'])
  const [selectedView, setSelectedView] = useState('day')
  const [refreshInterval, setRefreshInterval] = useState('5m')
  const [rightPanelOpen, setRightPanelOpen] = useState(false)

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  return (
    <DashboardContext.Provider value={{
      theme, setTheme, toggleTheme,
      selectedDate, setSelectedDate,
      selectedDefect, setSelectedDefect,
      selectedParameter, setSelectedParameter,
      selectedModel, setSelectedModel,
      selectedView, setSelectedView,
      refreshInterval, setRefreshInterval,
      rightPanelOpen, setRightPanelOpen,
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
