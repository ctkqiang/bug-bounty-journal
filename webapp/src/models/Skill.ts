export interface Skill {
  name: string
  level: number
  category: string
  icon: string
  color: string
}

export interface SkillCategory {
  id: string
  title: string
  icon: string
  color: string
  skills: Skill[]
}
