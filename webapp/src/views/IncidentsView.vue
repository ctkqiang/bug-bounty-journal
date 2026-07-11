<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useIncidents } from '@/viewmodels/useIncidents'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import IncidentCard from '@/components/IncidentCard.vue'
import '@/styles/incidents.css'

const { searchQuery, filteredIncidents } = useIncidents()
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
  <div class="incidents">
    <!-- PAGE HEADER -->
    <section ref="headerRef" class="incidents-header scroll-hidden">
      <h1 class="incidents-title">
        <i class="fas fa-fire"></i>
        实战对抗
      </h1>
      <p class="incidents-subtitle">真实攻防场景还原 · 社会工程学反制 · 诈骗警示</p>
    </section>

    <!-- SEARCH -->
    <div class="incidents-search-wrapper">
      <i class="fas fa-search incidents-search-icon"></i>
      <input v-model="searchQuery" type="text" class="incidents-search-input" placeholder="搜索安全事件..." />
    </div>

    <!-- INCIDENTS LIST -->
    <section ref="gridRef" class="incidents-list scroll-hidden">
      <div
        v-for="(incident, idx) in filteredIncidents"
        :key="incident.id"
        class="incident-item"
        :style="{ animationDelay: `${idx * 0.15}s` }"
      >
        <IncidentCard :incident="incident" />

        <!-- PHASES TIMELINE -->
        <div v-if="incident.phases && incident.phases.length > 0" class="incident-phases">
          <div
            v-for="(phase, pi) in incident.phases"
            :key="pi"
            class="incident-phase"
            :class="`incident-phase--${phase.color}`"
          >
            <div class="incident-phase-header">
              <span class="incident-phase-name">{{ phase.phase }}</span>
            </div>
            <p class="incident-phase-desc">{{ phase.description }}</p>

            <!-- DIALOGUES -->
            <div v-if="phase.dialogues && phase.dialogues.length > 0" class="incident-dialogues">
              <div
                v-for="(dialogue, di) in phase.dialogues"
                :key="di"
                class="dialogue-box"
                :class="dialogue.isAttacker ? 'dialogue-box--attacker' : 'dialogue-box--defender'"
              >
                <div class="dialogue-speaker">
                  <i class="fas dialogue-speaker-icon" :class="dialogue.isAttacker ? 'fa-skull' : 'fa-shield'"></i>
                  {{ dialogue.speaker }}
                </div>
                <div class="dialogue-text">{{ dialogue.text }}</div>
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
