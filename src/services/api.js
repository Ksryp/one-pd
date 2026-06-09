const BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

export class ApiError extends Error {
  constructor(status, path) {
    super(`API error ${status}: ${path}`)
    this.status = status
    this.path = path
  }
}

function buildUrl(path, params = {}) {
  const url = new URL(BASE + path, window.location.origin)
  Object.entries(params).forEach(([k, v]) => {
    if (v != null) url.searchParams.set(k, v)
  })
  return url
}

async function get(path, params) {
  const url = buildUrl(path, params)
  const res = await fetch(url)
  if (!res.ok) throw new ApiError(res.status, path)
  return res.json()
}

async function patch(path, body = {}) {
  const res = await fetch(BASE + path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new ApiError(res.status, path)
  return res.json()
}

export const api = { get, patch }
