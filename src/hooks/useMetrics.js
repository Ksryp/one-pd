import { useState, useEffect } from 'react'
import { metrics as mockData } from '../data/mock'
import { api } from '../services/api'

const USE_API = import.meta.env.VITE_USE_API === 'true'

export function useMetrics(interval = 120_000) {
  const [data, setData] = useState(mockData)
  const [loading, setLoading] = useState(USE_API)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!USE_API) return
    let active = true
    const fetch_ = async () => {
      try {
        const d = await api.get('/api/metrics')
        if (active) { setData(d); setError(null) }
      } catch (e) {
        if (active) setError(e)
      } finally {
        if (active) setLoading(false)
      }
    }
    fetch_()
    const timer = setInterval(fetch_, interval)
    return () => { active = false; clearInterval(timer) }
  }, [interval])

  return { data, loading, error }
}
