<script setup lang="ts">
import type { Incident } from '@/models/Incident'
import '@/styles/incidents.css'

interface Props {
  incident: Incident
}

const props = defineProps<Props>()

const assetBase = import.meta.env.BASE_URL

const resolveImageSrc = (src: string): string => {
  if (src.startsWith('http') || src.startsWith('data:')) return src
  return `${assetBase}${src.replace(/^\/+/, '')}`
}
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

    <div v-if="props.incident.imageAsset" class="incident-cover">
      <img
        :src="resolveImageSrc(props.incident.imageAsset)"
        :alt="props.incident.title"
        class="incident-cover-img"
        loading="lazy"
      />
    </div>

    <div class="incident-tags">
      <span
        v-for="tag in props.incident.tags"
        :key="tag"
        class="incident-tag"
      >
        {{ tag }}
      </span>
    </div>
  </article>
</template>
