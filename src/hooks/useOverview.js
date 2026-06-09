import { overview as mockData } from '../data/mock'

// OEE / Takt / WIP / MTTR — no live source yet; always returns mock
export function useOverview() {
  return { data: mockData, loading: false, error: null }
}
