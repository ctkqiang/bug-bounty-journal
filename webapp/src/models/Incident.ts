export interface Incident {
  id: string
  title: string
  date: string
  description: string
  originalUrl: string
  imageAsset?: string
  phases?: IncidentPhase[]
  tags: string[]
}

export interface IncidentPhase {
  phase: string
  color: string
  description: string
  dialogues?: { speaker: string; text: string; isAttacker: boolean }[]
  listItems?: string[]
  images?: string[]
}
