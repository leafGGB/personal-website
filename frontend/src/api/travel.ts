import { apiGet, apiPost, apiPut, apiDelete } from "./client"

export interface TravelPost {
  id: string
  title: string
  title_zh: string
  slug: string
  location_name: string
  location_name_zh: string
  description_zh: string
  content_zh: string
  latitude: number
  longitude: number
  date_visited: string | null
  description: string
  content: string
  images: string[]
  tags: string[]
  featured: boolean
  created_at: string
  updated_at: string
}

export interface TravelPostCreate {
  title: string
  title_zh?: string
  slug: string
  location_name: string
  location_name_zh?: string
  latitude: number
  longitude: number
  date_visited?: string | null
  description?: string
  description_zh?: string
  content?: string
  content_zh?: string
  images?: string[]
  tags?: string[]
  featured?: boolean
}

export function fetchTravelPosts(params?: { featured?: string; sort?: string }) {
  return apiGet<TravelPost[]>("/api/travel", params as Record<string, string>)
}

export function fetchTravelPost(slug: string) {
  return apiGet<TravelPost>(`/api/travel/${slug}`)
}

export function createTravelPost(data: TravelPostCreate) {
  return apiPost<TravelPost>("/api/travel", data)
}

export function updateTravelPost(slug: string, data: Partial<TravelPostCreate>) {
  return apiPut<TravelPost>(`/api/travel/${slug}`, data)
}

export function deleteTravelPost(slug: string) {
  return apiDelete<void>(`/api/travel/${slug}`)
}
