<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBlog } from '@/viewmodels/useBlog'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import '@/styles/blog.css'

const { searchQuery, selectedTag, allTags, filteredPosts } = useBlog()
const { observeElement } = useScrollAnimation()

const headerRef = ref<HTMLElement>()
const postsRef = ref<HTMLElement>()

onMounted(() => {
  if (headerRef.value) observeElement(headerRef.value, () => {})
  if (postsRef.value) observeElement(postsRef.value, () => {})
})

const toggleTag = (tag: string) => {
  selectedTag.value = selectedTag.value === tag ? null : tag
}
</script>

<template>
  <div class="blog-view">
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

      <div v-if="allTags.length > 0" class="tag-pills">
        <button
          class="tag-pill"
          :class="{ active: selectedTag === null }"
          @click="selectedTag = null"
        >
          全部标签
        </button>
        <button
          v-for="tag in allTags"
          :key="tag"
          class="tag-pill"
          :class="{ active: selectedTag === tag }"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- BLOG POSTS -->
    <section ref="postsRef" class="blog-posts scroll-hidden">
      <article
        v-for="(post, idx) in filteredPosts"
        :key="post.id"
        class="blog-post"
        :style="{ animationDelay: `${idx * 0.08}s` }"
      >
        <div class="post-card">
          <div class="post-meta">
            <span><i class="fas fa-calendar"></i> {{ post.date }}</span>
            <span class="post-author"><i class="fas fa-user"></i> {{ post.author }}</span>
            <span class="post-read-time"><i class="fas fa-clock"></i> {{ post.readTime }}</span>
          </div>

          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-excerpt">{{ post.excerpt }}</p>

          <div v-if="post.tags.length > 0" class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="post-tag">{{ tag }}</span>
          </div>
        </div>
      </article>
    </section>

    <!-- NO RESULTS -->
    <div v-if="filteredPosts.length === 0" class="no-posts">
      <i class="fas fa-feather-pointed"></i>
      <p>未找到匹配的文章</p>
    </div>
  </div>
</template>
