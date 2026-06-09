import { useState, useEffect, useRef } from 'react'
import { useDashboard } from '../context/DashboardContext'
import { api } from '../services/api'

const REFRESH_MS = {
  '1m':    60_000,
  '5m':    300_000,
  '15m':   900_000,
  '30m':   1_800_000,
  '1hr':   3_600_000,
  '4hr':   14_400_000,
  'Manual': null,
}

export function useParameterDefect() {
  const {
    selectedParameter, selectedDefect, selectedModel,
    selectedView, selectedDate, refreshInterval,
  } = useDashboard()

  const [chartData,   setChartData]   = useState([])
  const [insights,    setInsights]    = useState(null)
  const [ucl,         setUcl]         = useState({})
  const [lcl,         setLcl]         = useState({})
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading,     setLoading]     = useState(true)
  const timerRef  = useRef(null)
  const fetchRef  = useRef(null)

  useEffect(() => {
    const parts = (selectedDate || '').split(' to ')
    if (parts.length < 2) return
    const [startDate, endDate] = parts

    const modelStr = (Array.isArray(selectedModel) && selectedModel.includes('All'))
      ? 'All'
      : (Array.isArray(selectedModel) ? selectedModel.join(',') : selectedModel)

    const paramStr = Array.isArray(selectedParameter)
      ? selectedParameter.join(',')
      : (selectedParameter || 'viscosity_v0')

    const qs = new URLSearchParams({
      startDate, endDate,
      view:      selectedView  || 'day',
      defect:    selectedDefect || 'all',
      model:     modelStr,
      parameter: paramStr,
    }).toString()

    const fetch_ = async () => {
      setLoading(true)
      try {
        const [chart, insight] = await Promise.all([
          api.get(`/api/defects/chart?${qs}`),
          api.get(`/api/defects/insights?startDate=${startDate}&endDate=${endDate}&defect=${selectedDefect || 'all'}&model=${modelStr}`),
        ])
        setChartData(chart.points || [])
        if (chart.ucl) setUcl(chart.ucl)
        if (chart.lcl) setLcl(chart.lcl)
        setInsights(insight)
        setLastUpdated(new Date())
      } catch (_) {}
      finally { setLoading(false) }
    }

    fetchRef.current = fetch_

    if (timerRef.current) clearInterval(timerRef.current)
    fetch_()

    const ms = REFRESH_MS[refreshInterval]
    if (ms) timerRef.current = setInterval(fetch_, ms)

    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [selectedParameter, selectedDefect, selectedModel, selectedView, selectedDate, refreshInterval])

  const refresh = () => { if (fetchRef.current) fetchRef.current() }

  return { chartData, insights, ucl, lcl, lastUpdated, loading, refresh }
}
