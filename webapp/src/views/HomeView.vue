<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useCases } from '@/viewmodels/useCases'
import { useSkills } from '@/viewmodels/useSkills'
import { useTutorials } from '@/viewmodels/useTutorials'
import { useProjects } from '@/viewmodels/useProjects'
import { useBlog } from '@/viewmodels/useBlog'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import CaseCard from '@/components/CaseCard.vue'
import type { Severity } from '@/models/Case'
import '@/styles/home.css'

const { stats, searchQuery, severityFilter, filteredCases } = useCases()
const { skillCategories, activeCategoryId, activeCategory, setActiveCategory } = useSkills()
const { allTutorials, levelLabel } = useTutorials()
const { displayedProjects } = useProjects()
const { allPosts } = useBlog()
const { observeElement } = useScrollAnimation()

const heroRef = ref<HTMLElement>()
const statsRef = ref<HTMLElement>()
const casesRef = ref<HTMLElement>()
const skillsRef = ref<HTMLElement>()
const tutorialsRef = ref<HTMLElement>()
const projectsRef = ref<HTMLElement>()
const blogRef = ref<HTMLElement>()
const ctaRef = ref<HTMLElement>()

const heroStats = [
  { label: '年经验', value: '12+', icon: 'fas fa-calendar-check' },
  { label: '安全案例', value: String(stats.value.total), icon: 'fas fa-bug' },
  { label: 'GitHub Stars', value: '400+', icon: 'fas fa-star' },
  { label: '开源仓库', value: '30+', icon: 'fas fa-code-branch' }
]

const statCards: { key: string; label: string; value: number; icon: string; color: string; pct: number }[] = [
  { key: 'total', label: '总案例', value: stats.value.total, icon: 'fas fa-shield-halved', color: 'gold', pct: 100 },
  { key: 'critical', label: '严重漏洞', value: stats.value.critical, icon: 'fas fa-skull-crossbones', color: 'critical', pct: stats.value.total ? (stats.value.critical / stats.value.total) * 100 : 0 },
  { key: 'high', label: '高危漏洞', value: stats.value.high, icon: 'fas fa-fire', color: 'high', pct: stats.value.total ? (stats.value.high / stats.value.total) * 100 : 0 },
  { key: 'medium', label: '中危漏洞', value: stats.value.medium, icon: 'fas fa-triangle-exclamation', color: 'medium', pct: stats.value.total ? (stats.value.medium / stats.value.total) * 100 : 0 }
]

const severityOptions: { value: Severity | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: '全部', icon: 'fas fa-layer-group' },
  { value: 'critical', label: '严重', icon: 'fas fa-skull-crossbones' },
  { value: 'high', label: '高危', icon: 'fas fa-fire' },
  { value: 'medium', label: '中危', icon: 'fas fa-triangle-exclamation' },
  { value: 'low', label: '低危', icon: 'fas fa-info-circle' }
]

const topProjects = computed(() => displayedProjects.value.slice(0, 6))
const latestPosts = computed(() => allPosts.value.slice(0, 3))

const servicesList = [
  { name: '渗透测试', icon: 'fas fa-user-secret', desc: '全方位 Web/移动/云渗透测试服务' },
  { name: '安全审计', icon: 'fas fa-clipboard-check', desc: '代码审计、配置审计、架构审计' },
  { name: '漏洞挖掘', icon: 'fas fa-bomb', desc: '专业漏洞挖掘与 PoC 验证' },
  { name: '红队评估', icon: 'fas fa-crosshairs', desc: '模拟真实攻击的红队作战评估' }
]

const scrollToSection = (selector: string) => {
  const el = document.querySelector(selector)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  if (heroRef.value) observeElement(heroRef.value, () => {})
  if (statsRef.value) observeElement(statsRef.value, () => {})
  if (casesRef.value) observeElement(casesRef.value, () => {})
  if (skillsRef.value) observeElement(skillsRef.value, () => {})
  if (tutorialsRef.value) observeElement(tutorialsRef.value, () => {})
  if (projectsRef.value) observeElement(projectsRef.value, () => {})
  if (blogRef.value) observeElement(blogRef.value, () => {})
  if (ctaRef.value) observeElement(ctaRef.value, () => {})
})
</script>

<template>
  <div class="home-view">
    <!-- HERO -->
    <section ref="heroRef" class="home-hero scroll-hidden">
      <span class="hero-badge">
        <i class="fas fa-fire"></i>
        NEZHA SECURITY
      </span>
      <h1 class="hero-title">哪吒网络安全</h1>
      <p class="hero-subtitle">魔童漏洞案例库 · 专注网络安全，守护数字世界</p>
      <p class="hero-tagline">
        <strong>钟智强</strong> 安全研究档案 — 以魔童之火，照亮暗网漏洞
      </p>

      <div class="hero-stats-row">
        <div
          v-for="(item, idx) in heroStats"
          :key="item.label"
          class="hero-stat-item"
          :style="{ animationDelay: `${idx * 0.1}s` }"
        >
          <i :class="item.icon" class="hero-stat-icon"></i>
          <span class="hero-stat-value">{{ item.value }}</span>
          <span class="hero-stat-label">{{ item.label }}</span>
        </div>
      </div>

      <div class="hero-cta-row">
        <button class="hero-cta-btn hero-cta-btn--primary" @click="scrollToSection('.home-cases')">
          <i class="fas fa-bug"></i>
          浏览案例库
        </button>
        <router-link to="/projects" class="hero-cta-btn hero-cta-btn--secondary">
          <i class="fab fa-github"></i>
          查看开源项目
        </router-link>
      </div>

      <div class="hero-flames">
        <span class="hero-flame"></span>
        <span class="hero-flame"></span>
        <span class="hero-flame"></span>
        <span class="hero-flame"></span>
        <span class="hero-flame"></span>
      </div>
    </section>

    <!-- STATS -->
    <section ref="statsRef" class="home-stats scroll-hidden">
      <div
        v-for="(card, idx) in statCards"
        :key="card.key"
        class="stat-card"
        :data-color="card.color"
        :style="{ animationDelay: `${idx * 0.1}s` }"
      >
        <div class="stat-card-header">
          <div class="stat-card-icon">
            <i :class="card.icon"></i>
          </div>
          <span class="stat-card-label">{{ card.label }}</span>
        </div>
        <div class="stat-card-value">{{ card.value }}</div>
        <div class="stat-bar">
          <div
            class="stat-bar-fill"
            :style="{ '--target-width': `${card.pct}%`, width: `${card.pct}%` }"
          ></div>
        </div>
      </div>
    </section>

    <!-- CONTROLS -->
    <div class="home-controls">
      <div class="search-wrapper">
        <i class="fas fa-search search-icon"></i>
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="搜索漏洞案例、标签、目标..."
        />
      </div>
      <div class="severity-filters">
        <button
          v-for="opt in severityOptions"
          :key="opt.value"
          class="severity-btn"
          :data-severity="opt.value"
          :class="{ active: severityFilter === opt.value }"
          @click="severityFilter = opt.value"
        >
          <i :class="opt.icon"></i>
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- CASES GRID -->
    <section ref="casesRef" class="home-cases scroll-hidden">
      <div class="section-header">
        <i class="fas fa-bug"></i>
        <h2 class="section-title">漏洞案例</h2>
      </div>
      <div v-if="filteredCases.length > 0" class="cases-grid">
        <div
          v-for="(caseItem, idx) in filteredCases"
          :key="caseItem.id"
          class="case-item"
          :style="{ animationDelay: `${idx * 0.08}s` }"
        >
          <CaseCard :case-data="caseItem" />
        </div>
      </div>
      <div v-else class="no-results">
        <i class="fas fa-ghost"></i>
        <p>未找到匹配的漏洞案例</p>
      </div>
    </section>

    <!-- SKILLS SECTION -->
    <section ref="skillsRef" class="home-skills scroll-hidden">
      <div class="section-header">
        <i class="fas fa-fire"></i>
        <h2 class="section-title">攻防兼备 · 十八般武艺</h2>
      </div>
      <p class="section-subtitle">覆盖编程语言、安全工具、攻防领域、框架平台与云基础设施的全栈安全能力</p>

      <div class="skills-tabs">
        <button
          v-for="cat in skillCategories"
          :key="cat.id"
          class="skill-tab"
          :class="{ active: activeCategoryId === cat.id }"
          @click="setActiveCategory(cat.id)"
        >
          <i :class="`fas ${cat.icon}`"></i>
          <span>{{ cat.title }}</span>
        </button>
      </div>

      <div class="skills-content">
        <div class="skills-grid">
          <div
            v-for="(skill, idx) in activeCategory?.skills ?? []"
            :key="skill.name"
            class="skill-item"
            :style="{ animationDelay: `${idx * 0.06}s` }"
          >
            <div class="skill-header">
              <div class="skill-name">
                <i :class="`fas ${skill.icon}`" class="skill-icon"></i>
                <span>{{ skill.name }}</span>
              </div>
              <span class="skill-level">{{ skill.level }}%</span>
            </div>
            <div class="skill-bar">
              <div
                class="skill-bar-fill"
                :style="{ '--target-width': `${skill.level}%`, width: `${skill.level}%` }"
              >
                <span class="skill-bar-glow"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TUTORIALS SECTION -->
    <section ref="tutorialsRef" class="home-tutorials scroll-hidden">
      <div class="section-header">
        <i class="fas fa-book"></i>
        <h2 class="section-title">以战养战 · 实战教程</h2>
      </div>
      <p class="section-subtitle">从真实攻防案例中提炼的系统教程，每一节都是实战经验的结晶</p>

      <div class="tutorials-grid">
        <div
          v-for="(tutorial, idx) in allTutorials.slice(0, 2)"
          :key="tutorial.id"
          class="tutorial-card"
          :style="{ animationDelay: `${idx * 0.1}s` }"
        >
          <div class="tutorial-icon-wrapper">
            <i class="fas fa-graduation-cap tutorial-icon"></i>
          </div>
          <div class="tutorial-badges">
            <span class="tutorial-badge tutorial-badge--category">
              <i class="fas fa-tag"></i>
              {{ tutorial.category }}
            </span>
            <span class="tutorial-badge" :class="`tutorial-badge--${tutorial.level}`">
              <i class="fas fa-signal"></i>
              {{ levelLabel(tutorial.level) }}
            </span>
          </div>
          <h3 class="tutorial-title">{{ tutorial.title }}</h3>
          <p class="tutorial-excerpt">{{ tutorial.excerpt }}</p>
          <div class="tutorial-meta">
            <div class="tutorial-meta-item">
              <i class="fas fa-clock"></i>
              <span>{{ tutorial.duration }}</span>
            </div>
            <div class="tutorial-meta-item">
              <i class="fas fa-list-ol"></i>
              <span>{{ tutorial.chapters.length }} 章节</span>
            </div>
          </div>
          <div class="tutorial-footer">
            <button class="tutorial-btn">
              开始学习
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- PROJECTS SECTION -->
    <section ref="projectsRef" class="home-projects scroll-hidden">
      <div class="section-header section-header--with-action">
        <div class="section-header-left">
          <i class="fab fa-github"></i>
          <h2 class="section-title">开源贡献 · 社区力量</h2>
        </div>
        <router-link to="/projects" class="section-action-btn">
          查看全部
          <i class="fas fa-arrow-right"></i>
        </router-link>
      </div>
      <p class="section-subtitle">Top 6 开源项目 — 从安全工具到实战框架，每一个都源自真实的攻防需求</p>

      <div class="projects-grid">
        <a
          v-for="(project, idx) in topProjects"
          :key="project.id"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="project-card"
          :style="{ animationDelay: `${idx * 0.08}s` }"
        >
          <div class="project-header">
            <h3 class="project-name">
              <i class="fas fa-cube project-name-icon"></i>
              {{ project.name }}
            </h3>
          </div>
          <p class="project-description">{{ project.description }}</p>
          <div class="project-topics">
            <span v-for="topic in project.topics.slice(0, 3)" :key="topic" class="project-topic">
              {{ topic }}
            </span>
          </div>
          <div class="project-footer">
            <div class="project-stats">
              <span v-if="project.language" class="project-language">
                <span class="project-language-dot" :class="`project-language-dot--${project.language.toLowerCase()}`"></span>
                {{ project.language }}
              </span>
              <span class="project-stars">
                <i class="fas fa-star project-star-icon"></i>
                {{ project.stars }}
              </span>
              <span class="project-forks">
                <i class="fas fa-code-branch project-fork-icon"></i>
                {{ project.forks }}
              </span>
            </div>
          </div>
        </a>
      </div>
    </section>

    <!-- BLOG SECTION -->
    <section ref="blogRef" class="home-blog scroll-hidden">
      <div class="section-header section-header--with-action">
        <div class="section-header-left">
          <i class="fas fa-pen-nib"></i>
          <h2 class="section-title">安全思考 · 技术札记</h2>
        </div>
        <router-link to="/blog" class="section-action-btn">
          查看全部
          <i class="fas fa-arrow-right"></i>
        </router-link>
      </div>
      <p class="section-subtitle">最新的安全研究笔记、漏洞分析与技术思考 — 记录每一次成长与突破</p>

      <div class="blog-grid">
        <article
          v-for="(post, idx) in latestPosts"
          :key="post.id"
          class="blog-card"
          :style="{ animationDelay: `${idx * 0.1}s` }"
        >
          <div class="blog-card-date">
            <i class="fas fa-calendar-alt"></i>
            {{ post.date }}
          </div>
          <h3 class="blog-card-title">{{ post.title }}</h3>
          <p class="blog-card-excerpt">{{ post.excerpt }}</p>
          <div class="blog-tags">
            <span v-for="tag in post.tags.slice(0, 4)" :key="tag" class="blog-tag">
              #{{ tag }}
            </span>
          </div>
          <div class="blog-card-footer">
            <div class="blog-author">
              <div class="blog-author-avatar">
                {{ post.author.charAt(0) }}
              </div>
              <span class="blog-author-name">{{ post.author }}</span>
            </div>
            <div class="blog-read-time">
              <i class="fas fa-clock blog-read-time-icon"></i>
              {{ post.readTime }}
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- CTA SECTION -->
    <section ref="ctaRef" class="home-cta scroll-hidden">
      <div class="cta-glow"></div>
      <div class="cta-content">
        <span class="cta-badge">
          <i class="fas fa-fire"></i>
          SECURITY SERVICES
        </span>
        <h2 class="cta-title">
          需要安全服务？
          <br />
          <span class="cta-title-accent">让魔童守护你的数字资产</span>
        </h2>
        <p class="cta-description">
          十二年安全实战经验，为企业提供专业的渗透测试、安全审计、漏洞挖掘与红队评估服务。
          以攻为守，以战养战，守护你的数字疆域。
        </p>

        <div class="cta-services">
          <div
            v-for="(service, idx) in servicesList"
            :key="service.name"
            class="cta-service-item"
            :style="{ animationDelay: `${idx * 0.1}s` }"
          >
            <div class="cta-service-icon">
              <i :class="service.icon"></i>
            </div>
            <div class="cta-service-info">
              <h4 class="cta-service-name">{{ service.name }}</h4>
              <p class="cta-service-desc">{{ service.desc }}</p>
            </div>
          </div>
        </div>

        <div class="cta-contact">
          <div class="cta-contact-item">
            <div class="cta-contact-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <div class="cta-contact-text">
              <span class="cta-contact-label">邮箱</span>
              <span class="cta-contact-value">security@nezha-cyber.com</span>
            </div>
          </div>
          <div class="cta-contact-item">
            <div class="cta-contact-icon">
              <i class="fab fa-weixin"></i>
            </div>
            <div class="cta-contact-text">
              <span class="cta-contact-label">微信</span>
              <span class="cta-contact-value">NezhaCyber_Sec</span>
            </div>
          </div>
        </div>

        <div class="cta-actions">
          <a href="mailto:security@nezha-cyber.com" class="cta-btn cta-btn--primary">
            <i class="fas fa-paper-plane"></i>
            立即咨询
          </a>
          <a href="#" class="cta-btn cta-btn--secondary">
            <i class="fas fa-file-alt"></i>
            服务详情
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
