import { useState, useEffect, useCallback } from 'react'
import { metrics as mockData } from '../data/mock'
import { api } from '../services/api'

export function useMetrics(interval = 120_000) {
  const [data, setData] = useState(mockData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch_ = useCallback(async () => {
    try {
      const d = await api.get('/api/metrics')
      setData(d)
      setError(null)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch_()
    const timer = setInterval(fetch_, interval)
    return () => clearInterval(timer)
  }, [fetch_, interval])

  return { data, loading, error, refetch: fetch_ }
}
