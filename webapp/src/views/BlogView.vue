<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBlog } from '@/viewmodels/useBlog'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import '@/styles/blog.css'

const { searchQuery, selectedTag, allTags, filteredPosts } = useBlog()
const { observeElement } = useScrollAnimation()

const headerRef = ref<HTMLElement>()
const featuredRef = ref<HTMLElement>()
const gridRef = ref<HTMLElement>()

const featuredPost = computed(() => filteredPosts.value[0] ?? null)
const gridPosts = computed(() => filteredPosts.value.slice(1))

const getAuthorInitial = (author: string) => {
  return author ? author.charAt(0).toUpperCase() : '?'
}

const toggleTag = (tag: string) => {
  selectedTag.value = selectedTag.value === tag ? null : tag
}

onMounted(() => {
  if (headerRef.value) observeElement(headerRef.value, () => {})
  if (featuredRef.value) observeElement(featuredRef.value, () => {})
  if (gridRef.value) observeElement(gridRef.value, () => {})
})
</script>

<template>
  <div class="blog">
    <!-- PAGE HEADER -->
    <section ref="headerRef" class="blog-header scroll-hidden">
      <h1 class="blog-title">
        <i class="fas fa-book-open"></i>
        安全札记
      </h1>
      <p class="blog-subtitle">技术深度研究 · 漏洞分析实录 · 安全实践笔记</p>
    </section>

    <!-- CONTROLS -->
    <div class="blog-controls">
      <div class="blog-search-wrapper">
        <i class="fas fa-search blog-search-icon"></i>
        <input
          v-model="searchQuery"
          type="text"
          class="blog-search-input"
          placeholder="搜索文章标题、摘要..."
        />
      </div>

      <div v-if="allTags.length > 0" class="blog-tag-filters">
        <button
          class="blog-tag-pill"
          :class="{ 'is-active': selectedTag === null }"
          @click="selectedTag = null"
        >
          全部标签
        </button>
        <button
          v-for="tag in allTags"
          :key="tag"
          class="blog-tag-pill"
          :class="{ 'is-active': selectedTag === tag }"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- FEATURED POST -->
    <router-link
      v-if="featuredPost"
      ref="featuredRef"
      :to="{ name: 'blog-detail', params: { id: featuredPost.id } }"
      class="blog-featured scroll-hidden"
    >
      <span class="blog-featured-badge">
        <i class="fas fa-fire blog-featured-badge-icon"></i>
        FEATURED
      </span>
      <div class="blog-featured-body">
        <h2 class="blog-featured-title">{{ featuredPost.title }}</h2>
        <p class="blog-featured-excerpt">{{ featuredPost.excerpt }}</p>
        <div class="blog-featured-meta">
          <div class="blog-author">
            <span class="blog-author-avatar">{{ getAuthorInitial(featuredPost.author) }}</span>
            <span class="blog-author-name">{{ featuredPost.author }}</span>
          </div>
          <div class="blog-meta-right">
            <span class="blog-date">
              <i class="fas fa-calendar-alt blog-date-icon"></i>
              {{ featuredPost.date }}
            </span>
            <span class="blog-read-time">
              <i class="fas fa-clock blog-read-time-icon"></i>
              {{ featuredPost.readTime }}
            </span>
          </div>
        </div>
        <div v-if="featuredPost.tags.length > 0" class="blog-tags">
          <span v-for="tag in featuredPost.tags" :key="tag" class="blog-tag">{{ tag }}</span>
        </div>
      </div>
    </router-link>

    <!-- BLOG GRID -->
    <section ref="gridRef" class="blog-grid scroll-hidden">
      <router-link
        v-for="post in gridPosts"
        :key="post.id"
        :to="{ name: 'blog-detail', params: { id: post.id } }"
        class="blog-card"
      >
        <h2 class="blog-card-title">{{ post.title }}</h2>
        <p class="blog-card-excerpt">{{ post.excerpt }}</p>

        <div v-if="post.tags.length > 0" class="blog-tags">
          <span v-for="tag in post.tags" :key="tag" class="blog-tag">{{ tag }}</span>
        </div>

        <span class="blog-read-more">
          Read More
          <i class="fas fa-arrow-right blog-read-more-arrow"></i>
        </span>

        <div class="blog-card-footer">
          <div class="blog-author">
            <span class="blog-author-avatar">{{ getAuthorInitial(post.author) }}</span>
            <span class="blog-author-name">{{ post.author }}</span>
          </div>
          <div class="blog-meta-right">
            <span class="blog-date">
              <i class="fas fa-calendar-alt blog-date-icon"></i>
              {{ post.date }}
            </span>
            <span class="blog-read-time">
              <i class="fas fa-clock blog-read-time-icon"></i>
              {{ post.readTime }}
            </span>
          </div>
        </div>
      </router-link>
    </section>

    <!-- NO RESULTS -->
    <div v-if="filteredPosts.length === 0" class="blog-empty">
      <div class="blog-empty-icon"><i class="fas fa-feather-pointed"></i></div>
      <p class="blog-empty-text">未找到匹配的文章</p>
    </div>

    <!-- WECHAT QR SECTION -->
    <section class="blog-wechat-section">
      <div class="blog-wechat-inner">
        <i class="fab fa-weixin blog-wechat-icon"></i>
        <p class="blog-wechat-text">关注微信公众号获取更多安全资讯</p>
      </div>
    </section>
  </div>
</template>
