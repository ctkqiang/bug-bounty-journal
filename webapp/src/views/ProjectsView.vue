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
  <div class="projects">
    <!-- PAGE HEADER -->
    <section ref="headerRef" class="projects-header scroll-hidden">
      <h1 class="projects-title">
        <i class="fas fa-khanda"></i>
        开源兵器库
      </h1>
      <p class="projects-subtitle">安全工具 · 开源项目 · 兵器谱</p>
    </section>

    <!-- STATS BAR -->
    <section ref="statsRef" class="projects-stats-bar scroll-hidden">
      <div v-for="(stat, idx) in statItems" :key="idx" class="projects-stat">
        <div class="projects-stat-icon"><i :class="stat.icon"></i></div>
        <div class="projects-stat-value">{{ stat.value }}</div>
        <div class="projects-stat-label">{{ stat.label }}</div>
      </div>
    </section>

    <!-- CONTROLS -->
    <div class="projects-controls">
      <div class="projects-search-wrapper">
        <i class="fas fa-search projects-search-icon"></i>
        <input
          v-model="searchQuery"
          type="text"
          class="projects-search-input"
          placeholder="搜索项目名称、描述、标签..."
        />
      </div>

      <div class="language-filters">
        <button
          class="language-chip"
          :class="{ 'is-active': languageFilter === null }"
          @click="languageFilter = null"
        >
          全部语言
        </button>
        <button
          v-for="lang in availableLanguages"
          :key="lang"
          class="language-chip"
          :class="{ 'is-active': languageFilter === lang }"
          @click="languageFilter = lang"
        >
          {{ lang }}
        </button>
      </div>

      <label class="projects-fork-toggle">
        <input v-model="showForks" type="checkbox" class="projects-fork-toggle-input" />
        <span class="projects-fork-toggle-switch"></span>
        <span class="projects-fork-toggle-label">
          <i class="fas fa-code-fork"></i>
          显示 Fork 仓库
        </span>
      </label>
    </div>

    <!-- PROJECTS GRID -->
    <section ref="gridRef" class="projects-grid scroll-hidden">
      <ProjectCard
        v-for="project in displayedProjects"
        :key="project.id"
        :project="project"
      />
    </section>

    <!-- NO RESULTS -->
    <div v-if="displayedProjects.length === 0" class="projects-empty">
      <div class="projects-empty-icon"><i class="fas fa-box-open"></i></div>
      <p class="projects-empty-text">未找到匹配的项目</p>
    </div>
  </div>
</template>
