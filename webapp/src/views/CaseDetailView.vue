<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCases } from '@/viewmodels/useCases'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import type { ReportContent } from '@/models/Case'
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
import '@/styles/case-detail.css'

const route = useRoute()
const router = useRouter()
const { getCaseById } = useCases()
const { observeElement } = useScrollAnimation()

const caseData = computed(() => getCaseById(route.params.id as string))

const heroRef = ref<HTMLElement>()
const sectionsRef = ref<HTMLElement>()
const benevolenceRef = ref<HTMLElement>()
const lightboxSrc = ref<string | null>(null)

const highlightAll = () => {
  nextTick(() => {
    Prism.highlightAll()
  })
}

onMounted(() => {
  if (heroRef.value) observeElement(heroRef.value, () => {})
  if (benevolenceRef.value) observeElement(benevolenceRef.value, () => {})
  if (sectionsRef.value) observeElement(sectionsRef.value, () => {})
  highlightAll()
})

watch(() => route.params.id, () => {
  highlightAll()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

const goBack = () => {
  router.push({ name: 'home' })
}

const severityIcon: Record<string, string> = {
  critical: 'fas fa-skull-crossbones',
  high: 'fas fa-fire',
  medium: 'fas fa-triangle-exclamation',
  low: 'fas fa-info-circle'
}

const severityCn: Record<string, string> = {
  critical: '严重',
  high: '高危',
  medium: '中危',
  low: '低危'
}

const sectionNumber = (idx: number): string => {
  return String(idx + 1).padStart(2, '0')
}

const prismLang = (lang: string): string => {
  const map: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    sh: 'bash',
    shell: 'bash',
    golang: 'go',
    yml: 'yaml',
    properties: 'properties',
    'c++': 'cpp',
    cplusplus: 'cpp',
  }
  return map[lang.toLowerCase()] || lang.toLowerCase()
}

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

const benevolenceContent = computed(() => {
  if (!caseData.value?.reportSections) return null
  for (const section of caseData.value.reportSections) {
    if (section.contents) {
      const found = section.contents.find(
        c => c.type === 'info-box' && c.text.includes('善意')
      )
      if (found && found.type === 'info-box') return found
    }
    if (section.body && section.heading.includes('善意')) {
      return { type: 'info-box' as const, icon: 'fas fa-heart', text: section.body }
    }
  }
  return null
})

const displaySections = computed(() => {
  if (!caseData.value?.reportSections) return []
  return caseData.value.reportSections.filter(s => {
    if (s.contents) {
      return !s.contents.some(c => c.type === 'info-box' && c.text.includes('善意'))
    }
    return !(s.body && s.heading.includes('善意'))
  })
})

function contentKey(c: ReportContent, idx: number): string {
  return `${c.type}-${idx}`
}

async function copyCode(code: string, e: MouseEvent) {
  const btn = e.currentTarget as HTMLButtonElement
  try {
    await navigator.clipboard.writeText(code)
    btn.textContent = '已复制'
    btn.classList.add('copied')
  } catch {
    btn.textContent = '复制失败'
    btn.classList.add('copied')
  }
  setTimeout(() => {
    btn.textContent = '复制'
    btn.classList.remove('copied')
  }, 2000)
}
</script>

<template>
  <div v-if="caseData" class="case-detail">
    <!-- HERO HEADER -->
    <section
      ref="heroRef"
      class="case-detail-hero scroll-hidden"
      :data-severity="caseData.severity"
    >
      <button class="back-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        返回首页
      </button>

      <div class="hero-content">
        <h1 class="case-title">
          <span v-if="caseData.cnvdId" class="case-title-id">{{ caseData.cnvdId }}</span>
          <span class="case-title-main">{{ caseData.title }}</span>
        </h1>

        <p class="case-description">{{ caseData.description }}</p>

        <div class="case-badges">
          <span class="severity-badge" :data-level="caseData.severity">
            <i :class="severityIcon[caseData.severity]"></i>
            {{ severityCn[caseData.severity] }}
          </span>

          <span v-if="caseData.cvss" class="cvss-badge">
            <i class="fas fa-chart-line"></i>
            CVSS {{ caseData.cvss.toFixed(1) }}
          </span>

          <span v-if="caseData.cnvdId" class="cnvd-badge">
            <i class="fas fa-shield-halved"></i>
            {{ caseData.cnvdId }}
          </span>
        </div>

        <div class="case-meta-grid">
          <div class="case-meta-item">
            <i class="fas fa-calendar-alt"></i>
            <div class="meta-detail">
              <span class="meta-label">发现日期</span>
              <span class="meta-value">{{ caseData.date }}</span>
            </div>
          </div>
          <div class="case-meta-item">
            <i class="fas fa-crosshairs"></i>
            <div class="meta-detail">
              <span class="meta-label">攻击目标</span>
              <span class="meta-value">{{ caseData.target }}</span>
            </div>
          </div>
          <div class="case-meta-item">
            <i class="fas fa-map-marker-alt"></i>
            <div class="meta-detail">
              <span class="meta-label">所属区域</span>
              <span class="meta-value">{{ caseData.country }}</span>
            </div>
          </div>
          <div v-if="caseData.framework" class="case-meta-item">
            <i class="fas fa-layer-group"></i>
            <div class="meta-detail">
              <span class="meta-label">技术栈</span>
              <span class="meta-value">{{ caseData.framework }}</span>
            </div>
          </div>
        </div>

        <div v-if="caseData.tags.length > 0" class="case-tags">
          <span v-for="tag in caseData.tags" :key="tag.label" class="case-tag" :data-color="tag.color">
            <i :class="tag.icon"></i>
            {{ tag.label }}
          </span>
        </div>
      </div>
    </section>

    <!-- BENEVOLENCE STATEMENT -->
    <div
      v-if="benevolenceContent"
      ref="benevolenceRef"
      class="benevolence-box scroll-hidden"
    >
      <div class="benevolence-icon">
        <i :class="benevolenceContent.icon || 'fas fa-heart'"></i>
      </div>
      <div class="benevolence-text">
        <strong>善意声明</strong>
        <p>{{ benevolenceContent.text }}</p>
      </div>
    </div>

    <!-- TABLE OF CONTENTS -->
    <nav v-if="displaySections.length > 3" class="toc-card">
      <h3 class="toc-title">
        <i class="fas fa-list-ol"></i>
        报告目录
      </h3>
      <ol class="toc-list">
        <li v-for="(section, sIdx) in displaySections" :key="sIdx" class="toc-item">
          <a :href="`#section-${sIdx}`" class="toc-link">
            <span class="toc-num">{{ sectionNumber(sIdx) }}</span>
            {{ section.heading }}
          </a>
        </li>
      </ol>
    </nav>

    <!-- REPORT SECTIONS -->
    <section
      v-if="displaySections.length > 0"
      ref="sectionsRef"
      class="report-sections scroll-hidden"
    >
      <article
        v-for="(section, sIdx) in displaySections"
        :key="sIdx"
        :id="`section-${sIdx}`"
        class="report-section"
        :data-accent="section.accent || 'fire'"
      >
        <div class="section-header">
          <span class="section-number">{{ sectionNumber(sIdx) }}</span>
          <h2 class="report-heading">
            <span class="report-heading-icon">
              <i :class="section.icon || 'fas fa-chevron-right'"></i>
            </span>
            {{ section.heading }}
          </h2>
        </div>

        <div class="report-contents">
          <!-- NEW FORMAT: contents array -->
          <template v-if="section.contents && section.contents.length > 0">
            <template v-for="(content, cIdx) in section.contents" :key="contentKey(content, cIdx)">
              <!-- PARAGRAPH -->
              <p v-if="content.type === 'paragraph'" class="report-body">
                {{ content.text }}
              </p>

              <!-- SUBHEADING -->
              <h3 v-else-if="content.type === 'subheading'" class="report-subheading">
                <span class="subheading-bar"></span>
                {{ content.text }}
              </h3>

              <!-- CODE BLOCK WITH SYNTAX HIGHLIGHTING -->
              <div v-else-if="content.type === 'code'" class="code-block">
                <div class="code-block-header">
                  <div class="code-dots">
                    <span class="code-dot"></span>
                    <span class="code-dot"></span>
                    <span class="code-dot"></span>
                  </div>
                  <span class="code-lang">{{ content.language }}</span>
                  <button
                    class="code-copy-btn"
                    title="复制代码"
                    @click="(e) => copyCode(content.code, e as MouseEvent)"
                  >复制</button>
                </div>
                <pre><code :class="`language-${prismLang(content.language)}`">{{ content.code }}</code></pre>
              </div>

              <!-- LIST -->
              <ul v-else-if="content.type === 'list'" class="report-list">
                <li v-for="(item, li) in content.items" :key="li">
                  <span class="list-marker"></span>
                  <span class="list-text">{{ item }}</span>
                </li>
              </ul>

              <!-- TABLE -->
              <div v-else-if="content.type === 'table'" class="report-table-wrap">
                <table class="report-table">
                  <thead>
                    <tr>
                      <th v-for="(h, hi) in content.headers" :key="hi">{{ h }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, ri) in content.rows" :key="ri">
                      <td v-for="(cell, ci) in row" :key="ci">{{ cell }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- IMAGE -->
              <figure v-else-if="content.type === 'image'" class="report-image-wrap">
                <img
                  :src="resolveImageSrc(content.src)"
                  :alt="content.alt || ''"
                  class="report-image"
                  loading="lazy"
                  @click="openLightbox(resolveImageSrc(content.src))"
                />
                <figcaption v-if="content.caption" class="report-image-caption">
                  {{ content.caption }}
                </figcaption>
              </figure>

              <!-- INFO BOX -->
              <div v-else-if="content.type === 'info-box'" class="callout callout-info">
                <div class="callout-icon">
                  <i :class="content.icon || 'fas fa-info-circle'"></i>
                </div>
                <div class="callout-content">{{ content.text }}</div>
              </div>

              <!-- WARNING BOX -->
              <div v-else-if="content.type === 'warning-box'" class="callout callout-warning">
                <div class="callout-icon">
                  <i :class="content.icon || 'fas fa-exclamation-triangle'"></i>
                </div>
                <div class="callout-content">{{ content.text }}</div>
              </div>

              <!-- SUCCESS BOX -->
              <div v-else-if="content.type === 'success-box'" class="callout callout-success">
                <div class="callout-icon">
                  <i :class="content.icon || 'fas fa-check-circle'"></i>
                </div>
                <div class="callout-content">{{ content.text }}</div>
              </div>

              <!-- IMPACT GRID -->
              <div v-else-if="content.type === 'impact-grid'" class="impact-grid">
                <div
                  v-for="(card, ci) in content.cards"
                  :key="ci"
                  class="impact-card"
                  :data-color="card.color || 'fire'"
                >
                  <div class="impact-card-icon">
                    <i :class="card.icon"></i>
                  </div>
                  <h4 class="impact-card-title">{{ card.title }}</h4>
                  <p class="impact-card-desc">{{ card.desc }}</p>
                </div>
              </div>

              <!-- CONCLUSION -->
              <div v-else-if="content.type === 'conclusion'" class="conclusion-box">
                <div class="conclusion-glow"></div>
                <h3 class="conclusion-title">
                  <i class="fas fa-flag-checkered"></i>
                  {{ content.title }}
                </h3>
                <p class="conclusion-text">{{ content.text }}</p>
              </div>
            </template>
          </template>

          <!-- OLD FORMAT: body + codeBlock + listItems (backward compatible) -->
          <template v-else>
            <p v-if="section.body" class="report-body">{{ section.body }}</p>

            <div v-if="section.codeBlock" class="code-block">
              <div class="code-block-header">
                <div class="code-dots">
                  <span class="code-dot"></span>
                  <span class="code-dot"></span>
                  <span class="code-dot"></span>
                </div>
                <span v-if="section.codeLang" class="code-lang">{{ section.codeLang }}</span>
                <button
                  v-if="section.codeBlock"
                  class="code-copy-btn"
                  title="复制代码"
                  @click="(e) => copyCode(section.codeBlock!, e as MouseEvent)"
                >复制</button>
              </div>
              <pre><code :class="section.codeLang ? `language-${prismLang(section.codeLang)}` : ''">{{ section.codeBlock }}</code></pre>
            </div>

            <ul v-if="section.listItems && section.listItems.length > 0" class="report-list">
              <li v-for="(item, li) in section.listItems" :key="li">
                <span class="list-marker"></span>
                <span class="list-text">{{ item }}</span>
              </li>
            </ul>
          </template>
        </div>
      </article>
    </section>

    <!-- FALLBACK -->
    <section v-else class="callout callout-info">
      <div class="callout-icon">
        <i class="fas fa-info-circle"></i>
      </div>
      <div class="callout-content">{{ caseData.description }}</div>
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

  <!-- 404 NOT FOUND -->
  <div v-else class="case-not-found">
    <i class="fas fa-ghost not-found-icon"></i>
    <h2 class="not-found-title">案例未找到</h2>
    <p class="not-found-desc">漏洞案例 <code>{{ route.params.id }}</code> 不存在或已被移除</p>
    <RouterLink :to="{ name: 'home' }" class="not-found-link">
      <i class="fas fa-home"></i>
      返回首页
    </RouterLink>
  </div>
</template>
