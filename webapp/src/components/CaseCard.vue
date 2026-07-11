<script setup lang="ts">
import { computed } from 'vue'
import type { VulnerabilityCase, Severity } from '@/models/Case'
import '@/styles/case-card.css'

interface Props {
  caseData: VulnerabilityCase
}

const props = defineProps<Props>()

const severityLabels: Record<Severity, string> = {
  critical: '严重',
  high: '高危',
  medium: '中危',
  low: '低危',
}

const severityIcons: Record<Severity, string> = {
  critical: 'fas fa-skull-crossbones',
  high: 'fas fa-triangle-exclamation',
  medium: 'fas fa-circle-exclamation',
  low: 'fas fa-info-circle',
}

const sectionCount = computed(() => {
  if (!props.caseData.reportSections) return 0
  return props.caseData.reportSections.filter(
    s => !s.heading.includes('善意')
  ).length
})

const cvssColor = computed(() => {
  const score = props.caseData.cvss ?? 0
  if (score >= 9.0) return 'critical'
  if (score >= 7.0) return 'high'
  if (score >= 4.0) return 'medium'
  return 'low'
})
</script>

<template>
  <RouterLink
    :to="`/case/${props.caseData.id}`"
    class="case-card"
    :data-severity="props.caseData.severity"
  >
    <div class="case-card-accent-bar" :data-severity="props.caseData.severity"></div>

    <div class="case-card-header">
      <div class="case-card-header-left">
        <span class="case-card-date">
          <i class="fas fa-calendar-alt case-card-date-icon"></i>
          {{ props.caseData.date }}
        </span>
        <span
          v-if="props.caseData.cnvdId"
          class="case-card-cnvd"
        >
          <i class="fas fa-shield-halved"></i>
          {{ props.caseData.cnvdId }}
        </span>
      </div>
      <span class="case-card-severity" :class="`case-card-severity--${props.caseData.severity}`">
        <i :class="severityIcons[props.caseData.severity]"></i>
        {{ severityLabels[props.caseData.severity] }}
      </span>
    </div>

    <div class="case-card-body">
      <h3 class="case-card-title">
        <i class="case-card-title-icon fas fa-bug"></i>
        {{ props.caseData.title }}
      </h3>

      <div v-if="props.caseData.cvss" class="case-card-cvss" :data-level="cvssColor">
        <i class="fas fa-chart-line"></i>
        <span class="case-card-cvss-label">CVSS</span>
        <span class="case-card-cvss-score">{{ props.caseData.cvss.toFixed(1) }}</span>
      </div>

      <p class="case-card-description">{{ props.caseData.description }}</p>

      <div v-if="props.caseData.framework" class="case-card-framework">
        <i class="fas fa-layer-group"></i>
        <span>{{ props.caseData.framework }}</span>
      </div>

      <div class="case-card-tags">
        <span
          v-for="tag in props.caseData.tags"
          :key="tag.label"
          class="case-card-tag"
          :data-color="tag.color"
        >
          <i :class="tag.icon" class="case-card-tag-icon"></i>
          {{ tag.label }}
        </span>
      </div>
    </div>

    <div class="case-card-footer">
      <div class="case-card-meta">
        <span class="case-card-meta-item">
          <i class="fas fa-crosshairs case-card-meta-icon"></i>
          {{ props.caseData.target }}
        </span>
        <span class="case-card-meta-item">
          <i class="fas fa-map-marker-alt case-card-meta-icon"></i>
          {{ props.caseData.country }}
        </span>
        <span v-if="sectionCount > 0" class="case-card-meta-item case-card-meta-item--sections">
          <i class="fas fa-file-alt case-card-meta-icon"></i>
          {{ sectionCount }} 章节
        </span>
      </div>
      <span class="case-card-view">
        查看详情
        <i class="fas fa-arrow-right case-card-view-arrow"></i>
      </span>
    </div>
  </RouterLink>
</template>
