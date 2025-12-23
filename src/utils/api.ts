const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

const withBase = (path: string) => {
  if (!API_BASE) return path
  return `${API_BASE}${path}`
}

export const apiGet = async <T>(path: string): Promise<T> => {
  const res = await fetch(withBase(path), { credentials: 'include' })
  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status}`)
  }
  return (await res.json()) as T
}

export const apiPost = async <T>(path: string, body: unknown): Promise<T> => {
  const res = await fetch(withBase(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error(`POST ${path} failed: ${res.status}`)
  }
  return (await res.json()) as T
}
