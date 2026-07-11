import { ref, computed } from 'vue'
import { blogPosts } from '@/data/blog'
import type { BlogPost } from '@/models/Blog'

export function useBlog() {
  const allPosts = ref<BlogPost[]>(blogPosts)
  const searchQuery = ref('')
  const selectedTag = ref<string | null>(null)

  const allTags = computed(() => {
    const tags = new Set<string>()
    allPosts.value.forEach(p => p.tags.forEach(t => tags.add(t)))
    return Array.from(tags)
  })

  const filteredPosts = computed(() => {
    return allPosts.value.filter(p => {
      const matchesSearch = !searchQuery.value ||
        p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesTag = !selectedTag.value || p.tags.includes(selectedTag.value)
      return matchesSearch && matchesTag
    })
  })

  const getPostById = (id: string): BlogPost | undefined => {
    return allPosts.value.find(p => p.id === id)
  }

  return {
    allPosts,
    searchQuery,
    selectedTag,
    allTags,
    filteredPosts,
    getPostById
  }
}
