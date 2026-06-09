import { useState, useEffect, useRef } from 'react'

const BASE_WS = (import.meta.env.VITE_API_BASE_URL ?? '')
  .replace(/\/+$/, '')
  .replace('https://', 'wss://')
  .replace('http://', 'ws://')

const MIN_DELAY = 1_000
const MAX_DELAY = 30_000

export function useLive(onMessage) {
  const [connected, setConnected] = useState(false)
  const wsRef    = useRef(null)
  const onMsgRef = useRef(onMessage)
  onMsgRef.current = onMessage

  useEffect(() => {
    let retryTimer = null
    let delay = MIN_DELAY

    const connect = () => {
      const ws = new WebSocket(`${BASE_WS}/ws/live`)
      wsRef.current = ws

      ws.onopen = () => {
        setConnected(true)
        delay = MIN_DELAY
      }
      ws.onmessage = (e) => {
        try { onMsgRef.current?.(JSON.parse(e.data)) } catch (_) {}
      }
      ws.onclose = () => {
        setConnected(false)
        retryTimer = setTimeout(() => {
          delay = Math.min(delay * 2, MAX_DELAY)
          connect()
        }, delay)
      }
      ws.onerror = () => ws.close()
    }

    connect()
    return () => {
      clearTimeout(retryTimer)
      wsRef.current?.close()
    }
  }, [])

  return { connected }
}
