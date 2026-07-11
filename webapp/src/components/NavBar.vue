<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import '@/styles/navbar.css'

const route = useRoute()
const isMobileMenuOpen = ref(false)

interface NavLink {
  label: string
  to: string
  icon: string
}

const navLinks: NavLink[] = [
  { label: '首页', to: '/', icon: 'fas fa-house' },
  { label: '实战对抗', to: '/incidents', icon: 'fas fa-khanda' },
  { label: '开源兵器库', to: '/projects', icon: 'fas fa-code-branch' },
  { label: '实战教程', to: '/tutorials', icon: 'fas fa-graduation-cap' },
  { label: '安全札记', to: '/blog', icon: 'fas fa-scroll' },
]

function toggleMobileMenu(): void {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu(): void {
  isMobileMenuOpen.value = false
}

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

watch(() => route.path, closeMobileMenu)
</script>

<template>
  <nav class="nz-navbar">
    <div class="nz-navbar__inner">
      <RouterLink to="/" class="nz-navbar__logo" @click="closeMobileMenu">
        <i class="nz-navbar__logo-icon fas fa-fire"></i>
        <span class="nz-navbar__logo-text">哪吒网络安全</span>
      </RouterLink>

      <ul class="nz-navbar__links">
        <li v-for="link in navLinks" :key="link.to">
          <RouterLink
            :to="link.to"
            class="nz-navbar__link"
            :class="{ 'nz-navbar__link--active': isActive(link.to) }"
          >
            <i :class="link.icon"></i>
            <span>{{ link.label }}</span>
          </RouterLink>
        </li>
      </ul>

      <button
        class="nz-navbar__hamburger"
        :class="{ 'nz-navbar__hamburger--open': isMobileMenuOpen }"
        :aria-expanded="isMobileMenuOpen"
        aria-label="切换菜单"
        @click="toggleMobileMenu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <ul
      class="nz-navbar__mobile-menu"
      :class="{ 'nz-navbar__mobile-menu--open': isMobileMenuOpen }"
    >
      <li v-for="link in navLinks" :key="link.to">
        <RouterLink
          :to="link.to"
          class="nz-navbar__mobile-link"
          :class="{ 'nz-navbar__mobile-link--active': isActive(link.to) }"
        >
          <i :class="link.icon"></i>
          <span>{{ link.label }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
