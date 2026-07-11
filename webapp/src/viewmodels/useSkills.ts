import { ref, computed } from 'vue'
import { skillCategories, allSkills } from '@/data/skills'
import type { Skill, SkillCategory } from '@/models/Skill'

export function useSkills() {
  const categories = ref<SkillCategory[]>(skillCategories)
  const skills = ref<Skill[]>(allSkills)

  const activeCategoryId = ref<string>(skillCategories[0]?.id ?? '')

  const activeCategory = computed<SkillCategory | undefined>(() =>
    categories.value.find(c => c.id === activeCategoryId.value)
  )

  const setActiveCategory = (id: string) => {
    activeCategoryId.value = id
  }

  const getSkillsByCategory = (categoryId: string): Skill[] => {
    const category = categories.value.find(c => c.id === categoryId)
    return category ? category.skills : []
  }

  const totalSkills = computed(() => {
    return skills.value.length
  })

  const averageLevel = computed(() => {
    if (skills.value.length === 0) return 0
    const sum = skills.value.reduce((acc, skill) => acc + skill.level, 0)
    return Math.round(sum / skills.value.length)
  })

  const expertSkills = computed(() => {
    return skills.value.filter(s => s.level >= 90).length
  })

  return {
    skillCategories: categories,
    allSkills: skills,
    activeCategoryId,
    activeCategory,
    setActiveCategory,
    getSkillsByCategory,
    totalSkills,
    averageLevel,
    expertSkills
  }
}
