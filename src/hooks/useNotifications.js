import { useState, useEffect } from 'react'
import { notifications as mockData } from '../data/mock'
import { api } from '../services/api'

const USE_API = import.meta.env.VITE_USE_API === 'true'

function transform(arr) {
  return arr.map(n => ({
    ...n,
    title: n.label ?? n.title,
    timestamp: n.created_at ?? n.timestamp,
  }))
}

export function useNotifications(limit = 20, interval = 60_000) {
  const [data, setData] = useState(mockData)
  const [loading, setLoading] = useState(USE_API)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!USE_API) return
    let active = true
    const fetch_ = async () => {
      try {
        const d = await api.get(`/api/notifications?limit=${limit}`)
        if (active) { setData(transform(d)); setError(null) }
      } catch (e) {
        if (active) setError(e)
      } finally {
        if (active) setLoading(false)
      }
    }
    fetch_()
    const timer = setInterval(fetch_, interval)
    return () => { active = false; clearInterval(timer) }
  }, [limit, interval])

  return { data, loading, error }
}
