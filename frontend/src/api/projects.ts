import { apiGet, apiPost, apiPut, apiDelete } from "./client"

export interface Project {
  id: string
  title: string
  title_zh: string
  slug: string
  description: string
  content: string
  tech_stack: string[]
  images: string[]
  live_url: string | null
  github_url: string | null
  featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ProjectCreate {
  title: string
  title_zh?: string
  slug: string
  description: string
  content?: string
  tech_stack?: string[]
  images?: string[]
  live_url?: string | null
  github_url?: string | null
  featured?: boolean
  sort_order?: number
}

export function fetchProjects(params?: { featured?: string; sort?: string }) {
  return apiGet<Project[]>("/api/projects", params as Record<string, string>)
}

export function fetchProject(slug: string) {
  return apiGet<Project>(`/api/projects/${slug}`)
}

export function createProject(data: ProjectCreate) {
  return apiPost<Project>("/api/projects", data)
}

export function updateProject(slug: string, data: Partial<ProjectCreate>) {
  return apiPut<Project>(`/api/projects/${slug}`, data)
}

export function deleteProject(slug: string) {
  return apiDelete<void>(`/api/projects/${slug}`)
}
