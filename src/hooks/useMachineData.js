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
        const [ts, defects, lat] = await Promise.all([
          api.get(`/api/machine/timeseries?hours=${hours}`),
          api.get('/api/machine/defects/hourly').catch(() => []),
          api.get('/api/machine/latest').catch(() => null),
        ])
        if (!active) return

        // Build defect lookup: { "08:00": 12, ... }
        const defectMap = Object.fromEntries(
          (defects || []).map(d => [d.hour, d.defects])
        )

        if (ts.has_data && ts.points.length > 0) {
          // Real machine data — merge in defect counts
          setTimeseries(ts.points.map(p => ({
            ...p,
            defect: defectMap[p.hour] ?? 0,
          })))
          setHasRealData(true)
        } else if (defects && defects.length > 0) {
          // No machine data yet — use mock params but real defect bars
          const mockByHour = Object.fromEntries(
            parameterDefect.timeseries.map((p, i) => [p.hour, i])
          )
          setTimeseries(
            defects.map(d => {
              const mockPt = parameterDefect.timeseries[mockByHour[d.hour]] || {}
              return { ...mockPt, hour: d.hour, defect: d.defects }
            })
          )
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
