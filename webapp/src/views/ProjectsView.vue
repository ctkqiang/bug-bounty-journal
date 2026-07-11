<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProjects } from '@/viewmodels/useProjects'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import ProjectCard from '@/components/ProjectCard.vue'
import '@/styles/projects.css'

const {
  stats,
  searchQuery,
  showForks,
  languageFilter,
  displayedProjects,
  availableLanguages
} = useProjects()
const { observeElement } = useScrollAnimation()

const headerRef = ref<HTMLElement>()
const statsRef = ref<HTMLElement>()
const gridRef = ref<HTMLElement>()

const statItems: { icon: string; value: number; label: string }[] = [
  { icon: 'fas fa-book-bookmark', value: stats.value.totalRepos, label: '总仓库' },
  { icon: 'fas fa-code-branch', value: stats.value.originalRepos, label: '原创仓库' },
  { icon: 'fas fa-code-fork', value: stats.value.forkedRepos, label: 'Fork 仓库' },
  { icon: 'fas fa-star', value: stats.value.totalStars, label: '总 Stars' }
]

onMounted(() => {
  if (headerRef.value) observeElement(headerRef.value, () => {})
  if (statsRef.value) observeElement(statsRef.value, () => {})
  if (gridRef.value) observeElement(gridRef.value, () => {})
})
</script>

<template>
  <div class="projects-view">
    <!-- PAGE HEADER -->
    <section ref="headerRef" class="projects-header scroll-hidden">
      <h1 class="projects-title">
        <i class="fas fa-khanda"></i>
        开源兵器库
      </h1>
      <p class="projects-subtitle">安全工具 · 开源项目 · 兵器谱</p>
    </section>

    <!-- STATS BAR -->
    <section ref="statsRef" class="projects-stats scroll-hidden">
      <div v-for="(stat, idx) in statItems" :key="idx" class="proj-stat">
        <div class="proj-stat-icon"><i :class="stat.icon"></i></div>
        <div class="proj-stat-value">{{ stat.value }}</div>
        <div class="proj-stat-label">{{ stat.label }}</div>
      </div>
    </section>

    <!-- CONTROLS -->
    <div class="projects-controls">
      <div class="proj-search-wrapper">
        <i class="fas fa-search proj-search-icon"></i>
        <input
          v-model="searchQuery"
          type="text"
          class="proj-search-input"
          placeholder="搜索项目名称、描述、标签..."
        />
      </div>

      <div class="lang-chips">
        <button
          class="lang-chip"
          :class="{ active: languageFilter === null }"
          @click="languageFilter = null"
        >
          全部语言
        </button>
        <button
          v-for="lang in availableLanguages"
          :key="lang"
          class="lang-chip"
          :class="{ active: languageFilter === lang }"
          @click="languageFilter = lang"
        >
          {{ lang }}
        </button>
      </div>

      <label class="fork-toggle">
        <input v-model="showForks" type="checkbox" />
        <span class="toggle-switch"></span>
        <span class="fork-toggle-label">
          <i class="fas fa-code-fork"></i>
          显示 Fork 仓库
        </span>
      </label>
    </div>

    <!-- PROJECTS GRID -->
    <section ref="gridRef" class="projects-grid scroll-hidden">
      <div
        v-for="(project, idx) in displayedProjects"
        :key="project.id"
        class="project-item"
        :style="{ animationDelay: `${idx * 0.06}s` }"
      >
        <ProjectCard :project="project" />
      </div>
    </section>

    <!-- NO RESULTS -->
    <div v-if="displayedProjects.length === 0" class="no-projects">
      <i class="fas fa-box-open"></i>
      <p>未找到匹配的项目</p>
    </div>
  </div>
</template>
