import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const SITE = '哪吒网络安全'
const BASE_URL = 'https://www.ctkqiang.xin/bug-bounty-journal'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: `${SITE} | 魔童漏洞案例库 - Nezha Cybersecurity Bug Bounty Journal`,
      description: '真实渗透测试漏洞案例库 - 涵盖CNVD漏洞、API密钥泄露、源码泄露、未授权访问等安全研究。Real-world vulnerability cases with PoC verification.',
      keywords: '网络安全,漏洞案例,渗透测试,CNVD,bug bounty,cybersecurity,vulnerability research'
    }
  },
  {
    path: '/case/:id',
    name: 'case-detail',
    component: () => import('@/views/CaseDetailView.vue'),
    meta: {
      title: `漏洞详情 | ${SITE}`,
      description: '安全漏洞技术分析报告 - 包含完整PoC验证、影响评估与修复建议。Vulnerability technical analysis with PoC and remediation.',
      keywords: '漏洞分析,PoC验证,安全报告,vulnerability analysis,security report'
    }
  },
  {
    path: '/incidents',
    name: 'incidents',
    component: () => import('@/views/IncidentsView.vue'),
    meta: {
      title: `实战对抗 | ${SITE}`,
      description: '真实网络安全攻防对抗案例 - 红队渗透、蓝队防御、应急响应实战记录。Real-world red team vs blue team incident cases.',
      keywords: '红队,蓝队,攻防对抗,应急响应,red team,blue team,incident response'
    }
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectsView.vue'),
    meta: {
      title: `开源兵器库 | ${SITE}`,
      description: '网络安全开源工具集 - 渗透测试、漏洞扫描、安全审计工具。Open-source cybersecurity tools and utilities.',
      keywords: '安全工具,开源,渗透工具,security tools,open source,pentest tools'
    }
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/views/BlogView.vue'),
    meta: {
      title: `安全札记 | ${SITE}`,
      description: '网络安全技术博客 - 漏洞研究、安全开发、攻防技术分享。Cybersecurity blog - vulnerability research and security engineering.',
      keywords: '安全博客,技术分享,漏洞研究,security blog,tech articles'
    }
  },
  {
    path: '/blog/:id',
    name: 'blog-detail',
    component: () => import('@/views/BlogDetailView.vue'),
    meta: {
      title: `文章详情 | ${SITE}`,
      description: '网络安全技术文章详情。Cybersecurity technical article.',
      keywords: '安全文章,技术博客,security article'
    }
  },
  {
    path: '/tutorials',
    name: 'tutorials',
    component: () => import('@/views/TutorialView.vue'),
    meta: {
      title: `实战教程 | ${SITE}`,
      description: '网络安全实战教程 - 从入门到进阶的渗透测试与安全审计教程。Hands-on cybersecurity tutorials from beginner to advanced.',
      keywords: '安全教程,渗透测试教程,安全学习,security tutorial,pentest guide'
    }
  },
  {
    path: '/tutorials/:id',
    name: 'tutorial-detail',
    component: () => import('@/views/TutorialDetailView.vue'),
    meta: {
      title: `教程详情 | ${SITE}`,
      description: '网络安全实战教程详情。Cybersecurity tutorial detail.',
      keywords: '安全教程,tutorial,security learning'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

function setMeta(name: string, content: string, attr = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

router.afterEach((to) => {
  const title = (to.meta.title as string) || `${SITE} | 魔童漏洞案例库`
  const description = (to.meta.description as string) || ''
  const keywords = (to.meta.keywords as string) || ''
  const url = `${BASE_URL}${to.fullPath}`

  document.title = title

  if (description) {
    setMeta('description', description)
    setMeta('og:description', description, 'property')
    setMeta('twitter:description', description)
  }

  if (keywords) {
    setMeta('keywords', keywords)
  }

  setMeta('og:title', title, 'property')
  setMeta('og:url', url, 'property')
  setMeta('twitter:title', title)

  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', url)
})

export default router
