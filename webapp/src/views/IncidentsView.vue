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
          </div>
        </div>

        <!-- TAGS -->
        <div v-if="incident.tags.length > 0" class="incident-tags">
          <span v-for="tag in incident.tags" :key="tag" class="incident-tag">{{ tag }}</span>
        </div>
      </div>
    </section>
  </div>
</template>
