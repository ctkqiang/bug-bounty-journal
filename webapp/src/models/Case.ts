export type Severity = 'critical' | 'high' | 'medium' | 'low'

export interface CaseTag {
  label: string
  icon: string
  color: string
}

export interface VulnerabilityCase {
  id: string
  title: string
  date: string
  severity: Severity
  cvss?: number
  description: string
  tags: CaseTag[]
  target: string
  country: string
  cnvdId?: string
  originalUrl: string
  imageAsset?: string
  framework?: string
  reportSections?: ReportSection[]
}

export type ReportContentType =
  | 'paragraph'
  | 'subheading'
  | 'code'
  | 'list'
  | 'table'
  | 'info-box'
  | 'warning-box'
  | 'success-box'
  | 'impact-grid'
  | 'conclusion'

export interface ReportContentBase {
  type: ReportContentType
}

export interface ParagraphContent extends ReportContentBase {
  type: 'paragraph'
  text: string
}

export interface SubheadingContent extends ReportContentBase {
  type: 'subheading'
  text: string
}

export interface CodeContent extends ReportContentBase {
  type: 'code'
  code: string
  language: string
}

export interface ListContent extends ReportContentBase {
  type: 'list'
  items: string[]
}

export interface TableContent extends ReportContentBase {
  type: 'table'
  headers: string[]
  rows: string[][]
}

export interface InfoBoxContent extends ReportContentBase {
  type: 'info-box'
  icon: string
  text: string
}

export interface WarningBoxContent extends ReportContentBase {
  type: 'warning-box'
  icon: string
  text: string
}

export interface SuccessBoxContent extends ReportContentBase {
  type: 'success-box'
  icon: string
  text: string
}

export interface ImpactCard {
  icon: string
  title: string
  desc: string
  color?: string
}

export interface ImpactGridContent extends ReportContentBase {
  type: 'impact-grid'
  cards: ImpactCard[]
}

export interface ConclusionContent extends ReportContentBase {
  type: 'conclusion'
  title: string
  text: string
}

export type ReportContent =
  | ParagraphContent
  | SubheadingContent
  | CodeContent
  | ListContent
  | TableContent
  | InfoBoxContent
  | WarningBoxContent
  | SuccessBoxContent
  | ImpactGridContent
  | ConclusionContent

export interface ReportSection {
  heading: string
  icon?: string
  accent?: string
  body?: string
  codeBlock?: string
  codeLang?: string
  listItems?: string[]
  contents?: ReportContent[]
}

export interface CaseStats {
  total: number
  critical: number
  high: number
  medium: number
  low: number
}
