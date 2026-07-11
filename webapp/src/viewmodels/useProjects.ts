import { ref, computed } from 'vue'
import { projects, forkedProjects, allProjects, projectStats } from '@/data/projects'
import type { GitHubProject, ProjectStats } from '@/models/Project'

export function useProjects() {
  const originalProjects = ref<GitHubProject[]>(projects)
  const forked = ref<GitHubProject[]>(forkedProjects)
  const all = ref<GitHubProject[]>(allProjects)
  const stats = ref<ProjectStats>(projectStats)
  const searchQuery = ref('')
  const showForks = ref(false)
  const languageFilter = ref<string | null>(null)

  const displayedProjects = computed(() => {
    let result = showForks.value ? all.value : originalProjects.value
    if (languageFilter.value) {
      result = result.filter(p => p.language === languageFilter.value)
    }
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.description?.toLowerCase().includes(query) ?? false) ||
        p.topics.some(t => t.toLowerCase().includes(query))
      )
    }
    return result.sort((a, b) => b.stars - a.stars)
  })

  const availableLanguages = computed(() => {
    const langs = new Set<string>()
    originalProjects.value.forEach(p => {
      if (p.language) langs.add(p.language)
    })
    return Array.from(langs)
  })

  return {
    originalProjects,
    forked,
    all,
    stats,
    searchQuery,
    showForks,
    languageFilter,
    displayedProjects,
    availableLanguages
  }
}
