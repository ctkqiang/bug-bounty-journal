<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useTutorials } from '@/viewmodels/useTutorials'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import type { TutorialLevel } from '@/models/Tutorial'
import '@/styles/tutorials.css'

const {
  searchQuery,
  categoryFilter,
  allCategories,
  filteredTutorials,
  levelLabel
} = useTutorials()

const { observeElement } = useScrollAnimation()

const levelFilter = ref<TutorialLevel | 'all'>('all')

const headerRef = ref<HTMLElement>()
const gridRef = ref<HTMLElement>()

const levelOptions: { key: TutorialLevel | 'all'; icon: string; label: string }[] = [
  { key: 'all', icon: 'fas fa-layer-group', label: '全部等级' },
  { key: 'beginner', icon: 'fas fa-seedling', label: '入门' },
  { key: 'intermediate', icon: 'fas fa-fire', label: '中级' },
  { key: 'advanced', icon: 'fas fa-bolt', label: '高级' },
  { key: 'expert', icon: 'fas fa-crown', label: '专家' }
]

const categoryIcons: Record<string, string> = {
  'Web安全': 'fas fa-globe',
  '渗透测试': 'fas fa-crosshairs',
  '逆向工程': 'fas fa-microchip',
  '密码学': 'fas fa-key',
  '网络安全': 'fas fa-shield-halved',
  '移动安全': 'fas fa-mobile-screen',
  '漏洞挖掘': 'fas fa-bug',
  '社会工程': 'fas fa-users',
  '取证分析': 'fas fa-magnifying-glass',
  '恶意软件': 'fas fa-virus'
}

const getCategoryIcon = (category: string): string => {
  return categoryIcons[category] || 'fas fa-book'
}

const visibleTutorials = computed(() => {
  return filteredTutorials.value.filter(t => {
    return levelFilter.value === 'all' || t.level === levelFilter.value
  })
})

onMounted(() => {
  if (headerRef.value) observeElement(headerRef.value, () => {})
  if (gridRef.value) observeElement(gridRef.value, () => {})
})
</script>

<template>
  <div class="tutorials-view">
    <!-- PAGE HEADER -->
    <section ref="headerRef" class="tutorials-header scroll-hidden">
      <h1 class="tutorials-title">
        <i class="fas fa-graduation-cap"></i>
        实战教程
      </h1>
      <p class="tutorials-subtitle">从入门到精通 · 系统化安全攻防实战指南</p>
    </section>

    <!-- CONTROLS -->
    <div class="tutorials-controls">
      <div class="tutorials-search-wrapper">
        <i class="fas fa-search tutorials-search-icon"></i>
        <input
          v-model="searchQuery"
          type="text"
          class="tutorials-search-input"
          placeholder="搜索教程标题、摘要、标签..."
        />
      </div>

      <!-- CATEGORY PILLS -->
      <div class="tutorials-category-pills">
        <button
          class="category-pill"
          :class="{ active: categoryFilter === 'all' }"
          @click="categoryFilter = 'all'"
        >
          <i class="fas fa-th-large"></i>
          全部分类
        </button>
        <button
          v-for="cat in allCategories"
          :key="cat"
          class="category-pill"
          :class="{ active: categoryFilter === cat }"
          @click="categoryFilter = cat"
        >
          <i :class="getCategoryIcon(cat)"></i>
          {{ cat }}
        </button>
      </div>

      <!-- LEVEL FILTER -->
      <div class="tutorials-level-filters">
        <button
          v-for="opt in levelOptions"
          :key="opt.key"
          class="level-btn"
          :class="[
            `level-btn--${opt.key}`,
            { active: levelFilter === opt.key }
          ]"
          @click="levelFilter = opt.key"
        >
          <i :class="opt.icon"></i>
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- TUTORIAL CARDS GRID -->
    <section ref="gridRef" class="tutorials-grid scroll-hidden">
      <article
        v-for="(tutorial, idx) in visibleTutorials"
        :key="tutorial.id"
        class="tutorial-card"
        :style="{ animationDelay: `${idx * 0.07}s` }"
      >
        <div class="tutorial-card-header">
          <div class="tutorial-card-icon">
            <i :class="getCategoryIcon(tutorial.category)"></i>
          </div>
          <div class="tutorial-card-badges">
            <span class="tutorial-badge tutorial-badge--category">
              {{ tutorial.category }}
            </span>
            <span
              class="tutorial-badge"
              :class="`tutorial-badge--${tutorial.level}`"
            >
              {{ levelLabel(tutorial.level) }}
            </span>
          </div>
        </div>

        <h2 class="tutorial-card-title">{{ tutorial.title }}</h2>
        <p class="tutorial-card-excerpt">{{ tutorial.excerpt }}</p>

        <div class="tutorial-card-meta">
          <span class="tutorial-meta-item">
            <i class="fas fa-clock"></i>
            {{ tutorial.duration }}
          </span>
          <span class="tutorial-meta-item">
            <i class="fas fa-list-ol"></i>
            {{ tutorial.chapters.length }} 章节
          </span>
        </div>

        <div v-if="tutorial.tags.length > 0" class="tutorial-card-tags">
          <span
            v-for="tag in tutorial.tags.slice(0, 4)"
            :key="tag"
            class="tutorial-tag"
          >
            {{ tag }}
          </span>
          <span v-if="tutorial.tags.length > 4" class="tutorial-tag tutorial-tag--more">
            +{{ tutorial.tags.length - 4 }}
          </span>
        </div>

        <RouterLink
          :to="`/tutorials/${tutorial.id}`"
          class="tutorial-card-action"
        >
          <span>开始学习</span>
          <i class="fas fa-arrow-right"></i>
        </RouterLink>
      </article>
    </section>

    <!-- EMPTY STATE -->
    <div v-if="visibleTutorials.length === 0" class="tutorials-empty">
      <i class="fas fa-scroll tutorials-empty-icon"></i>
      <p class="tutorials-empty-text">未找到匹配的教程</p>
      <p class="tutorials-empty-hint">尝试调整搜索条件或筛选器</p>
    </div>
  </div>
</template>
