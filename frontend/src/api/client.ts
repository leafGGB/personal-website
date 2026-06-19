const API_BASE = import.meta.env.VITE_API_BASE || ""

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token")
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  // Remove Content-Type for FormData uploads
  if (options.body instanceof FormData) {
    delete headers["Content-Type"]
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(error.detail || `Request failed: ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export function apiGet<T>(endpoint: string, params?: Record<string, string>) {
  const search = params ? "?" + new URLSearchParams(params).toString() : ""
  return apiRequest<T>(`${endpoint}${search}`)
}

export function apiPost<T>(endpoint: string, body: unknown) {
  return apiRequest<T>(endpoint, { method: "POST", body: JSON.stringify(body) })
}

export function apiPut<T>(endpoint: string, body: unknown) {
  return apiRequest<T>(endpoint, { method: "PUT", body: JSON.stringify(body) })
}

export function apiDelete<T>(endpoint: string) {
  return apiRequest<T>(endpoint, { method: "DELETE" })
}
