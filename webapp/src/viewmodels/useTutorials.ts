import { ref, computed } from 'vue'
import { tutorials } from '@/data/tutorials'
import type { Tutorial, TutorialLevel } from '@/models/Tutorial'

export function useTutorials() {
  const allTutorials = ref<Tutorial[]>(tutorials)
  const searchQuery = ref('')
  const categoryFilter = ref<string>('all')

  const allCategories = computed(() => {
    const categories = new Set<string>()
    allTutorials.value.forEach(t => categories.add(t.category))
    return Array.from(categories)
  })

  const allTags = computed(() => {
    const tags = new Set<string>()
    allTutorials.value.forEach(t => t.tags.forEach(tag => tags.add(tag)))
    return Array.from(tags)
  })

  const filteredTutorials = computed(() => {
    return allTutorials.value.filter(t => {
      const matchesSearch = !searchQuery.value ||
        t.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        t.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
        t.author.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesCategory = categoryFilter.value === 'all' || t.category === categoryFilter.value
      return matchesSearch && matchesCategory
    })
  })

  const getTutorialById = (id: string): Tutorial | undefined => {
    return allTutorials.value.find(t => t.id === id)
  }

  const levelLabel = (level: TutorialLevel): string => {
    const labels: Record<TutorialLevel, string> = {
      beginner: '入门',
      intermediate: '中级',
      advanced: '高级',
      expert: '专家'
    }
    return labels[level]
  }

  return {
    allTutorials,
    searchQuery,
    categoryFilter,
    allCategories,
    allTags,
    filteredTutorials,
    getTutorialById,
    levelLabel
  }
}
