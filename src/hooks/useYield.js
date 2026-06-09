import { useState, useEffect, useCallback } from 'react'
import { yield_ as mockData } from '../data/mock'
import { api } from '../services/api'

const COLORS = { Good: '#16A34A', Repair: '#D97706', Scrap: '#DC2626' }

function fromMock(type) {
  const m = mockData[type]
  const total = m.good + m.repair + m.scrap
  return {
    title: type === 'clay' ? 'CLAY YIELD' : 'FIRING YIELD',
    value_total: total ? Math.round((m.good + m.repair) / total * 1000) / 10 : 0,
    value_once:  total ? Math.round(m.good / total * 1000) / 10 : 0,
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch_ = useCallback(async () => {
    try {
      const d = await api.get(`/api/yield?type=${type}`)
      setData(d)
      setError(null)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    fetch_()
    const timer = setInterval(fetch_, interval)
    return () => clearInterval(timer)
  }, [fetch_, interval])

  return { data, loading, error, refetch: fetch_ }
}
