import { ref, computed } from 'vue'
import { cases, caseStats } from '@/data/cases'
import type { VulnerabilityCase, CaseStats, Severity } from '@/models/Case'

export function useCases() {
  const allCases = ref<VulnerabilityCase[]>(cases)
  const stats = ref<CaseStats>(caseStats)
  const searchQuery = ref('')
  const severityFilter = ref<Severity | 'all'>('all')

  const filteredCases = computed(() => {
    return allCases.value.filter(c => {
      const matchesSearch = !searchQuery.value ||
        c.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        c.tags.some(t => t.label.toLowerCase().includes(searchQuery.value.toLowerCase()))
      const matchesSeverity = severityFilter.value === 'all' || c.severity === severityFilter.value
      return matchesSearch && matchesSeverity
    })
  })

  const getCaseById = (id: string): VulnerabilityCase | undefined => {
    return allCases.value.find(c => c.id === id)
  }

  const severityLabel = (severity: Severity): string => {
    const labels: Record<Severity, string> = {
      critical: '严重',
      high: '高危',
      medium: '中危',
      low: '低危'
    }
    return labels[severity]
  }

  return {
    allCases,
    stats,
    searchQuery,
    severityFilter,
    filteredCases,
    getCaseById,
    severityLabel
  }
}
