import { useState, useEffect, useCallback } from 'react'
import { notifications as mockData } from '../data/mock'
import { api } from '../services/api'

function transform(arr) {
  return arr.map(n => ({
    ...n,
    title:     n.label ?? n.title,
    timestamp: n.created_at ?? n.timestamp,
  }))
}

export function useNotifications(limit = 20, interval = 30_000) {
  const [data, setData] = useState(mockData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch_ = useCallback(async () => {
    try {
      const d = await api.get('/api/notifications', { limit })
      setData(transform(d))
      setError(null)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetch_()
    const timer = setInterval(fetch_, interval)
    return () => clearInterval(timer)
  }, [fetch_, interval])

  return { data, loading, error, refetch: fetch_ }
}
