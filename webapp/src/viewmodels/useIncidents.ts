import { ref, computed } from 'vue'
import { incidents } from '@/data/incidents'
import type { Incident } from '@/models/Incident'

export function useIncidents() {
  const allIncidents = ref<Incident[]>(incidents)
  const searchQuery = ref('')

  const filteredIncidents = computed(() => {
    return allIncidents.value.filter(i => {
      if (!searchQuery.value) return true
      const q = searchQuery.value.toLowerCase()
      return (
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.tags.some(t => t.toLowerCase().includes(q))
      )
    })
  })

  const getIncidentById = (id: string): Incident | undefined => {
    return allIncidents.value.find(i => i.id === id)
  }

  return {
    allIncidents,
    searchQuery,
    filteredIncidents,
    getIncidentById
  }
}
