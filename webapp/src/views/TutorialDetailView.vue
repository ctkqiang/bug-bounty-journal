<script setup lang="ts">
import { ref, computed, onMounted, onUpdated, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useTutorials } from '@/viewmodels/useTutorials'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-dart'
import 'prismjs/components/prism-nginx'
import 'prismjs/components/prism-properties'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-php'
import '@/styles/tutorial-detail.css'

const route = useRoute()
const router = useRouter()
const { getTutorialById, levelLabel } = useTutorials()
const { observeElement } = useScrollAnimation()

const tutorial = computed(() => getTutorialById(route.params.id as string))

const activeChapterIndex = ref(0)

const heroRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()

const authorInitial = computed(() => {
  if (!tutorial.value?.author) return '?'
  return tutorial.value.author.charAt(0).toUpperCase()
})

const progressPercent = computed(() => {
  if (!tutorial.value || tutorial.value.chapters.length === 0) return 0
  return Math.round(((activeChapterIndex.value + 1) / tutorial.value.chapters.length) * 100)
})

const highlightAll = () => {
  nextTick(() => {
    Prism.highlightAll()
  })
}

const scrollToChapter = (index: number) => {
  activeChapterIndex.value = index
  const el = document.getElementById(`chapter-${index}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleScroll = () => {
  if (!tutorial.value) return
  const chapters = tutorial.value.chapters
  for (let i = chapters.length - 1; i >= 0; i--) {
    const el = document.getElementById(`chapter-${i}`)
    if (el) {
      const rect = el.getBoundingClientRect()
      if (rect.top <= 160) {
        activeChapterIndex.value = i
        break
      }
    }
  }
}

const goBack = () => {
  router.push('/tutorials')
}

onMounted(() => {
  highlightAll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  if (heroRef.value) observeElement(heroRef.value, () => {})
  if (contentRef.value) observeElement(contentRef.value, () => {})
})

onUpdated(() => {
  highlightAll()
})

watch(() => route.params.id, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  activeChapterIndex.value = 0
  nextTick(highlightAll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div v-if="tutorial" class="tutorial-detail">
    <!-- HERO HEADER -->
    <section ref="heroRef" class="td-hero scroll-hidden">
      <button class="td-back" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        返回教程列表
      </button>

      <div class="td-hero-content">
        <div class="td-hero-badges">
          <span class="td-badge td-badge--category">
            <i class="fas fa-folder"></i>
            {{ tutorial.category }}
          </span>
          <span class="td-badge" :class="`td-badge--${tutorial.level}`">
            {{ levelLabel(tutorial.level) }}
          </span>
        </div>

        <h1 class="td-title">{{ tutorial.title }}</h1>

        <p class="td-excerpt">{{ tutorial.excerpt }}</p>

        <div class="td-meta">
          <div class="td-author">
            <span class="td-avatar">{{ authorInitial }}</span>
            <span class="td-author-name">{{ tutorial.author }}</span>
          </div>
          <div class="td-meta-item">
            <i class="fas fa-calendar-alt"></i>
            <span>{{ tutorial.date }}</span>
          </div>
          <div class="td-meta-item">
            <i class="fas fa-clock"></i>
            <span>{{ tutorial.duration }}</span>
          </div>
          <div class="td-meta-item">
            <i class="fas fa-list-ol"></i>
            <span>{{ tutorial.chapters.length }} 章节</span>
          </div>
        </div>
      </div>

      <!-- PROGRESS BAR -->
      <div class="td-progress-bar">
        <div class="td-progress-fill" :style="{ width: `${progressPercent}%` }"></div>
        <span class="td-progress-label">{{ progressPercent }}%</span>
      </div>
    </section>

    <!-- MAIN LAYOUT: TOC + CONTENT -->
    <div class="td-layout">
      <!-- TABLE OF CONTENTS (SIDEBAR) -->
      <aside class="td-toc">
        <h3 class="td-toc-title">
          <i class="fas fa-compass"></i>
          目录导航
        </h3>
        <nav class="td-toc-nav">
          <button
            v-for="(chapter, idx) in tutorial.chapters"
            :key="idx"
            class="td-toc-item"
            :class="{ active: activeChapterIndex === idx }"
            @click="scrollToChapter(idx)"
          >
            <span class="td-toc-index">{{ String(idx + 1).padStart(2, '0') }}</span>
            <span class="td-toc-text">{{ chapter.title }}</span>
          </button>
        </nav>
      </aside>

      <!-- CHAPTER CONTENT -->
      <main ref="contentRef" class="td-content scroll-hidden">
        <div
          v-for="(chapter, cIdx) in tutorial.chapters"
          :key="cIdx"
          :id="`chapter-${cIdx}`"
          class="td-chapter"
        >
          <div class="td-chapter-heading">
            <span class="td-chapter-number">{{ String(cIdx + 1).padStart(2, '0') }}</span>
            <h2 class="td-chapter-title">{{ chapter.title }}</h2>
          </div>

          <div
            v-for="(section, sIdx) in chapter.sections"
            :key="sIdx"
            class="td-section"
          >
            <h3 class="td-section-heading">{{ section.heading }}</h3>

            <div v-if="section.body" class="td-section-body">
              <p
                v-for="(para, pIdx) in section.body.split('\n').filter(l => l.trim())"
                :key="pIdx"
                class="td-paragraph"
              >
                {{ para }}
              </p>
            </div>

            <pre
              v-if="section.codeBlock"
              class="td-code-block"
            ><code :class="`language-${section.codeLang || 'text'}`">{{ section.codeBlock }}</code></pre>

            <ul v-if="section.listItems && section.listItems.length > 0" class="td-list">
              <li
                v-for="(item, lIdx) in section.listItems"
                :key="lIdx"
                class="td-list-item"
              >
                <i class="fas fa-chevron-right td-list-icon"></i>
                <span>{{ item }}</span>
              </li>
            </ul>

            <div v-if="(section as any).note" class="td-note">
              <div class="td-note-icon">
                <i class="fas fa-lightbulb"></i>
              </div>
              <div class="td-note-content">
                <strong>提示</strong>
                <p>{{ (section as any).note }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- END OF TUTORIAL -->
        <div class="td-end">
          <i class="fas fa-flag-checkered td-end-icon"></i>
          <p class="td-end-text">恭喜完成本教程！</p>
          <RouterLink to="/tutorials" class="td-end-link">
            <i class="fas fa-arrow-left"></i>
            浏览更多教程
          </RouterLink>
        </div>
      </main>
    </div>
  </div>

  <!-- 404 NOT FOUND -->
  <div v-else class="td-not-found">
    <i class="fas fa-ghost td-not-found-icon"></i>
    <h2 class="td-not-found-title">教程未找到</h2>
    <p class="td-not-found-desc">
      教程 <code>{{ route.params.id }}</code> 不存在或已被移除。
    </p>
    <RouterLink to="/tutorials" class="td-not-found-link">
      <i class="fas fa-arrow-left"></i>
      返回教程列表
    </RouterLink>
  </div>
</template>
