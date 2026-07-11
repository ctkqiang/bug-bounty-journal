import { ref } from 'vue'
import { incidents } from '@/data/incidents'
import type { Incident } from '@/models/Incident'

export function useIncidents() {
  const allIncidents = ref<Incident[]>(incidents)

  const getIncidentById = (id: string): Incident | undefined => {
    return allIncidents.value.find(i => i.id === id)
  }

  return {
    allIncidents,
    getIncidentById
  }
}
