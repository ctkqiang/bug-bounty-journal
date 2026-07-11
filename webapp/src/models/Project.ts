export interface GitHubProject {
  id: number
  name: string
  description: string
  language: string | null
  stars: number
  forks: number
  topics: string[]
  url: string
  updatedAt: string
  isFork: boolean
}

export interface ProjectStats {
  totalRepos: number
  originalRepos: number
  forkedRepos: number
  totalStars: number
  languages: string[]
}
