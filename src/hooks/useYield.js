import { useState, useEffect } from 'react'
import { yield_ as mockData } from '../data/mock'
import { api } from '../services/api'

const USE_API = import.meta.env.VITE_USE_API === 'true'

const COLORS = { Good: '#16A34A', Repair: '#D97706', Scrap: '#DC2626' }

function fromMock(type) {
  const m = mockData[type]
  return {
    title: type === 'clay' ? 'CLAY YIELD' : 'FIRING YIELD',
    value: m.value,
    segments: [
      { label: 'Good',   value: m.good,   color: COLORS.Good   },
      { label: 'Repair', value: m.repair, color: COLORS.Repair },
      { label: 'Scrap',  value: m.scrap,  color: COLORS.Scrap  },
    ],
    target: m.target,
  }
}

export function useYield(type = 'clay', interval = 120_000) {
  const [data, setData] = useState(() => fromMock(type))
  const [loading, setLoading] = useState(USE_API)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!USE_API) { setData(fromMock(type)); return }
    let active = true
    const fetch_ = async () => {
      try {
        const d = await api.get(`/api/yield?type=${type}`)
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
  }, [type, interval])

  return { data, loading, error }
}
