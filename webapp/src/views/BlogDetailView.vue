<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlog } from '@/viewmodels/useBlog'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import '@/styles/blog-detail.css'

const route = useRoute()
const router = useRouter()
const { getPostById, allPosts } = useBlog()
const { observeElement } = useScrollAnimation()

const post = computed(() => getPostById(route.params.id as string))

const contentParagraphs = computed(() => {
  if (!post.value?.content) return []
  return post.value.content.split('\n').filter(line => line.trim().length > 0)
})

const authorInitial = computed(() => {
  if (!post.value?.author) return '?'
  return post.value.author.charAt(0).toUpperCase()
})

const relatedPosts = computed(() => {
  if (!post.value) return []
  const currentTags = new Set(post.value.tags)
  return allPosts.value
    .filter(p => p.id !== post.value!.id && p.tags.some(t => currentTags.has(t)))
    .slice(0, 3)
})

const heroRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const relatedRef = ref<HTMLElement>()

onMounted(() => {
  if (heroRef.value) observeElement(heroRef.value, () => {})
  if (contentRef.value) observeElement(contentRef.value, () => {})
  if (relatedRef.value) observeElement(relatedRef.value, () => {})
})

watch(() => route.params.id, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

const goBack = () => {
  router.push({ name: 'blog' })
}

const navigateToPost = (id: string) => {
  router.push({ name: 'blog-detail', params: { id } })
}
</script>

<template>
  <div v-if="post" class="blog-detail">
    <!-- HERO HEADER -->
    <section ref="heroRef" class="blog-detail-hero scroll-hidden">
      <button class="blog-detail-back" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        Back to Blog
      </button>

      <div class="blog-detail-hero-content">
        <div class="blog-detail-tags-row">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="blog-detail-tag"
          >
            <i class="fas fa-hashtag"></i>
            {{ tag }}
          </span>
        </div>

        <h1 class="blog-detail-title">{{ post.title }}</h1>

        <p class="blog-detail-excerpt">{{ post.excerpt }}</p>

        <div class="blog-detail-meta">
          <div class="blog-detail-author">
            <span class="blog-detail-avatar">{{ authorInitial }}</span>
            <span class="blog-detail-author-name">{{ post.author }}</span>
          </div>

          <div class="blog-detail-meta-item">
            <i class="fas fa-calendar-alt"></i>
            <span>{{ post.date }}</span>
          </div>

          <div class="blog-detail-meta-item">
            <i class="fas fa-clock"></i>
            <span>{{ post.readTime }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ARTICLE CONTENT -->
    <article ref="contentRef" class="blog-detail-content scroll-hidden">
      <div class="blog-detail-body">
        <p
          v-for="(paragraph, idx) in contentParagraphs"
          :key="idx"
          class="blog-detail-paragraph"
        >
          {{ paragraph }}
        </p>
      </div>
    </article>

    <!-- RELATED POSTS -->
    <section
      v-if="relatedPosts.length > 0"
      ref="relatedRef"
      class="blog-detail-related scroll-hidden"
    >
      <h2 class="blog-detail-related-title">
        <i class="fas fa-fire"></i>
        Related Posts
      </h2>

      <div class="blog-detail-related-grid">
        <article
          v-for="related in relatedPosts"
          :key="related.id"
          class="blog-detail-related-card"
          @click="navigateToPost(related.id)"
        >
          <div class="related-card-tags">
            <span
              v-for="tag in related.tags.slice(0, 2)"
              :key="tag"
              class="related-card-tag"
            >
              {{ tag }}
            </span>
          </div>

          <h3 class="related-card-title">{{ related.title }}</h3>

          <p class="related-card-excerpt">{{ related.excerpt }}</p>

          <div class="related-card-footer">
            <span class="related-card-date">
              <i class="fas fa-calendar-alt"></i>
              {{ related.date }}
            </span>
            <span class="related-card-read-time">
              <i class="fas fa-clock"></i>
              {{ related.readTime }}
            </span>
          </div>
        </article>
      </div>
    </section>
  </div>

  <!-- 404 NOT FOUND -->
  <div v-else class="blog-detail-not-found">
    <i class="fas fa-ghost blog-detail-not-found-icon"></i>
    <h2 class="blog-detail-not-found-title">Post Not Found</h2>
    <p class="blog-detail-not-found-desc">
      The blog post <code>{{ route.params.id }}</code> does not exist or has been removed.
    </p>
    <RouterLink :to="{ name: 'blog' }" class="blog-detail-not-found-link">
      <i class="fas fa-arrow-left"></i>
      Back to Blog
    </RouterLink>
  </div>
</template>
