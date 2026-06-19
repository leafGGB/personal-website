import { apiGet, apiPost, apiPut, apiDelete } from "./client"

export interface JournalPost {
  id: string
  title: string
  title_zh: string
  slug: string
  description: string
  description_zh: string
  content: string
  content_zh: string
  tags: string[]
  images: string[]
  featured: boolean
  created_at: string
  updated_at: string
}

export interface JournalPostCreate {
  title: string
  title_zh?: string
  slug: string
  description?: string
  description_zh?: string
  content?: string
  content_zh?: string
  tags?: string[]
  images?: string[]
  featured?: boolean
}

export function fetchJournalPosts(params?: { featured?: string; sort?: string }) {
  return apiGet<JournalPost[]>("/api/journal", params as Record<string, string>)
}

export function fetchJournalPost(slug: string) {
  return apiGet<JournalPost>(`/api/journal/${slug}`)
}

export function createJournalPost(data: JournalPostCreate) {
  return apiPost<JournalPost>("/api/journal", data)
}

export function updateJournalPost(slug: string, data: Partial<JournalPostCreate>) {
  return apiPut<JournalPost>(`/api/journal/${slug}`, data)
}

export function deleteJournalPost(slug: string) {
  return apiDelete<void>(`/api/journal/${slug}`)
}
