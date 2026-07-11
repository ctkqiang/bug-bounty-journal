<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useIncidents } from '@/viewmodels/useIncidents'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import IncidentCard from '@/components/IncidentCard.vue'
import '@/styles/incidents.css'

const { allIncidents } = useIncidents()
const { observeElement } = useScrollAnimation()

const headerRef = ref<HTMLElement>()
const gridRef = ref<HTMLElement>()
const lightboxSrc = ref<string | null>(null)

const assetBase = import.meta.env.BASE_URL

const resolveImageSrc = (src: string): string => {
  if (src.startsWith('http') || src.startsWith('data:')) return src
  return `${assetBase}${src.replace(/^\/+/, '')}`
}

const openLightbox = (src: string) => {
  lightboxSrc.value = src
}

const closeLightbox = () => {
  lightboxSrc.value = null
}

onMounted(() => {
  if (headerRef.value) observeElement(headerRef.value, () => {})
  if (gridRef.value) observeElement(gridRef.value, () => {})
})
</script>

<template>
  <div class="incidents-view">
    <!-- PAGE HEADER -->
    <section ref="headerRef" class="incidents-header scroll-hidden">
      <h1 class="incidents-title">
        <i class="fas fa-fire"></i>
        实战对抗
      </h1>
      <p class="incidents-subtitle">真实攻防场景还原 · 社会工程学反制 · 诈骗警示</p>
    </section>

    <!-- INCIDENTS GRID -->
    <section ref="gridRef" class="incidents-grid scroll-hidden">
      <div
        v-for="(incident, idx) in allIncidents"
        :key="incident.id"
        class="incident-item"
        :style="{ animationDelay: `${idx * 0.15}s` }"
      >
        <IncidentCard :incident="incident" />

        <!-- TIMELINE (phases) -->
        <div v-if="incident.phases && incident.phases.length > 0" class="incident-timeline">
          <div
            v-for="(phase, pi) in incident.phases"
            :key="pi"
            class="timeline-phase"
            :data-color="phase.color"
          >
            <h3 class="phase-title">{{ phase.phase }}</h3>
            <p class="phase-desc">{{ phase.description }}</p>

            <!-- DIALOGUES -->
            <div v-if="phase.dialogues && phase.dialogues.length > 0" class="dialogues">
              <div
                v-for="(dialogue, di) in phase.dialogues"
                :key="di"
                class="dialogue"
                :class="dialogue.isAttacker ? 'dialogue-attacker' : 'dialogue-defender'"
              >
                <span class="dialogue-speaker">{{ dialogue.speaker }}</span>
                <span class="dialogue-text">{{ dialogue.text }}</span>
              </div>
            </div>

            <!-- LIST ITEMS -->
            <ul v-if="phase.listItems && phase.listItems.length > 0" class="phase-list">
              <li v-for="(item, li) in phase.listItems" :key="li">{{ item }}</li>
            </ul>

            <!-- PHASE IMAGES -->
            <div v-if="phase.images && phase.images.length > 0" class="phase-images">
              <figure
                v-for="(img, ii) in phase.images"
                :key="ii"
                class="phase-image-wrap"
              >
                <img
                  :src="resolveImageSrc(img)"
                  :alt="`${incident.title} - ${phase.phase}`"
                  class="phase-image"
                  loading="lazy"
                  @click="openLightbox(resolveImageSrc(img))"
                />
              </figure>
            </div>
          </div>
        </div>

        <!-- TAGS -->
        <div v-if="incident.tags.length > 0" class="incident-tags">
          <span v-for="tag in incident.tags" :key="tag" class="incident-tag">{{ tag }}</span>
        </div>
      </div>
    </section>

    <!-- LIGHTBOX -->
    <Teleport to="body">
      <div v-if="lightboxSrc" class="lightbox" @click="closeLightbox">
        <img :src="lightboxSrc" class="lightbox-img" />
        <button class="lightbox-close" @click="closeLightbox">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </Teleport>
  </div>
</template>
