<script setup lang="ts">
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
</script>

<template>
  <RouterLink :to="`/case/${props.caseData.id}`" class="case-card">
    <div class="case-card-header">
      <span class="case-card-date">
        <i class="fas fa-calendar-alt case-card-date-icon"></i>
        {{ props.caseData.date }}
      </span>
      <span class="case-card-severity" :class="`case-card-severity--${props.caseData.severity}`">
        <i :class="severityIcons[props.caseData.severity]"></i>
        {{ severityLabels[props.caseData.severity] }}
      </span>
    </div>

    <h3 class="case-card-title">
      <i class="case-card-title-icon fas fa-bug"></i>
      {{ props.caseData.title }}
    </h3>

    <p class="case-card-description">{{ props.caseData.description }}</p>

    <div class="case-card-tags">
      <span
        v-for="tag in props.caseData.tags"
        :key="tag.label"
        class="case-card-tag"
      >
        <i :class="tag.icon" class="case-card-tag-icon"></i>
        {{ tag.label }}
      </span>
    </div>

    <div class="case-card-footer">
      <div class="case-card-meta">
        <span class="case-card-meta-item">
          <i class="fas fa-bullseye case-card-meta-icon"></i>
          {{ props.caseData.target }}
        </span>
        <span class="case-card-meta-item">
          <i class="fas fa-globe case-card-meta-icon"></i>
          {{ props.caseData.country }}
        </span>
      </div>
      <span class="case-card-view">
        详情
        <i class="fas fa-arrow-right case-card-view-arrow"></i>
      </span>
    </div>
  </RouterLink>
</template>
