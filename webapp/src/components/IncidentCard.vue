<script setup lang="ts">
import type { Incident } from '@/models/Incident'
import '@/styles/incidents.css'

interface Props {
  incident: Incident
}

const props = defineProps<Props>()
</script>

<template>
  <article class="incident-card">
    <div class="incident-header">
      <h3 class="incident-title">
        <i class="incident-title-icon fas fa-bolt"></i>
        {{ props.incident.title }}
      </h3>
      <time class="incident-date" :datetime="props.incident.date">
        <i class="fas fa-calendar-alt"></i>
        {{ props.incident.date }}
      </time>
    </div>

    <p class="incident-description">{{ props.incident.description }}</p>

    <div class="incident-tags">
      <span
        v-for="tag in props.incident.tags"
        :key="tag"
        class="incident-tag"
      >
        {{ tag }}
      </span>
    </div>

    <a
      :href="props.incident.originalUrl"
      class="incident-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i class="fas fa-file-lines"></i>
      查看原始报告
      <i class="fas fa-arrow-right incident-link-icon"></i>
    </a>
  </article>
</template>
