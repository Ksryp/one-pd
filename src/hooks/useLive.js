import { useState, useEffect, useRef } from 'react'

const USE_API = import.meta.env.VITE_USE_API === 'true'
const BASE_WS = (import.meta.env.VITE_API_BASE_URL ?? '')
  .replace('https://', 'wss://')
  .replace('http://', 'ws://')

export function useLive(onMessage) {
  const [connected, setConnected] = useState(false)
  const wsRef = useRef(null)
  const onMsgRef = useRef(onMessage)
  onMsgRef.current = onMessage

  useEffect(() => {
    if (!USE_API) return

    let retryTimer = null

    const connect = () => {
      const ws = new WebSocket(`${BASE_WS}/ws/live`)
      wsRef.current = ws
      ws.onopen = () => setConnected(true)
      ws.onmessage = (e) => {
        try { onMsgRef.current?.(JSON.parse(e.data)) } catch (_) {}
      }
      ws.onclose = () => {
        setConnected(false)
        retryTimer = setTimeout(connect, 3_000)
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
