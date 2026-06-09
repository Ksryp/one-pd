import { useState, useEffect } from 'react'
import { parameterDefect } from '../data/mock'
import { api } from '../services/api'

const USE_API = import.meta.env.VITE_USE_API === 'true'

export function useMachineData(hours = 24, interval = 60_000) {
  const [timeseries, setTimeseries] = useState(parameterDefect.timeseries)
  const [latest, setLatest] = useState(null)
  const [ucl] = useState(parameterDefect.ucl)
  const [lcl] = useState(parameterDefect.lcl)
  const [hasRealData, setHasRealData] = useState(false)

  useEffect(() => {
    if (!USE_API) return
    let active = true

    const fetch_ = async () => {
      try {
        const [ts, lat] = await Promise.all([
          api.get(`/api/machine/timeseries?hours=${hours}`),
          api.get('/api/machine/latest').catch(() => null),
        ])
        if (!active) return
        if (ts.has_data && ts.points.length > 0) {
          setTimeseries(ts.points)
          setHasRealData(true)
        }
        if (lat) setLatest(lat)
      } catch (_) {}
    }

    fetch_()
    const timer = setInterval(fetch_, interval)
    return () => { active = false; clearInterval(timer) }
  }, [hours, interval])

  return { timeseries, latest, ucl, lcl, hasRealData }
}
