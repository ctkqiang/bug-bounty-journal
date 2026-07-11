export type TutorialLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export interface TutorialSection {
  heading: string
  body: string
  listItems?: string[]
  codeBlock?: string
  codeLang?: string
}

export interface TutorialChapter {
  title: string
  sections: TutorialSection[]
}

export interface Tutorial {
  id: string
  title: string
  date: string
  category: string
  level: TutorialLevel
  duration: string
  excerpt: string
  content: string
  tags: string[]
  author: string
  chapters: TutorialChapter[]
}
