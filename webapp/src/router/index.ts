import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '哪吒网络安全 | 魔童漏洞案例库' }
  },
  {
    path: '/case/:id',
    name: 'case-detail',
    component: () => import('@/views/CaseDetailView.vue'),
    meta: { title: '漏洞详情 | 哪吒网络安全' }
  },
  {
    path: '/incidents',
    name: 'incidents',
    component: () => import('@/views/IncidentsView.vue'),
    meta: { title: '实战对抗 | 哪吒网络安全' }
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectsView.vue'),
    meta: { title: '开源兵器库 | 哪吒网络安全' }
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/views/BlogView.vue'),
    meta: { title: '安全札记 | 哪吒网络安全' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

router.afterEach((to) => {
  const title = to.meta.title as string
  if (title) document.title = title
})

export default router
