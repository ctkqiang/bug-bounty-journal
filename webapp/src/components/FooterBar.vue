<script setup lang="ts">
import '@/styles/footer.css'

const githubUrl = 'https://github.com/ctkqiang'
const email = 'johnmelodyme@gmail.com'
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="footer-brand-header">
            <i class="fas fa-fire footer-brand-icon"></i>
            <span class="footer-brand-name">哪吒网络安全</span>
          </div>
          <p class="footer-brand-tagline">NEZHA CYBER SECURITY</p>
          <p class="footer-brand-desc">魔童漏洞案例库 — 专注网络安全，守护数字世界。以魔童之火，照亮暗网漏洞。</p>
        </div>

        <div class="footer-column">
          <h4 class="footer-column-title">导航</h4>
          <RouterLink to="/" class="footer-link">首页</RouterLink>
          <RouterLink to="/incidents" class="footer-link">实战对抗</RouterLink>
          <RouterLink to="/projects" class="footer-link">开源兵器库</RouterLink>
          <RouterLink to="/blog" class="footer-link">安全札记</RouterLink>
        </div>

        <div class="footer-column">
          <h4 class="footer-column-title">资源</h4>
          <a :href="githubUrl" class="footer-link" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a :href="`${githubUrl}/BBtool`" class="footer-link" target="_blank" rel="noopener noreferrer">BBtool</a>
          <a :href="`${githubUrl}/QianKunQuan`" class="footer-link" target="_blank" rel="noopener noreferrer">QianKunQuan</a>
          <a :href="`${githubUrl}/nezha_cyber`" class="footer-link" target="_blank" rel="noopener noreferrer">nezha_cyber</a>
        </div>

        <div class="footer-column">
          <h4 class="footer-column-title">合规</h4>
          <span class="footer-link">CNVD 认证</span>
          <span class="footer-link">PDPA 2010</span>
          <span class="footer-link">ISO 27001</span>
          <span class="footer-link">OWASP Top 10</span>
        </div>
      </div>

      <div class="footer-middle">
        <div class="footer-social">
          <span class="footer-social-label">FOLLOW</span>
          <a :href="githubUrl" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <i class="fab fa-github social-link-icon"></i>
          </a>
          <a :href="`mailto:${email}`" class="social-link" aria-label="Email">
            <i class="fas fa-envelope social-link-icon"></i>
          </a>
        </div>

        <div class="footer-iso-badge">
          <i class="fas fa-shield-halved footer-iso-icon"></i>
          <div class="footer-iso-text">
            <span class="footer-iso-title">ISO/IEC 27001:2022</span>
            <span class="footer-iso-subtitle">Information Security Management</span>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">
          <i class="fas fa-fire footer-copyright-icon"></i>
          <span class="footer-copyright-text">© 2026 <strong>哪吒网络安全</strong> · 钟智强 · 专注网络安全，守护数字世界</span>
        </p>
        <div class="footer-legal">
          <a href="#" class="footer-legal-link">Privacy</a>
          <a href="#" class="footer-legal-link">Terms</a>
          <a href="#" class="footer-legal-link">Security</a>
        </div>
        <span class="footer-made-with">
          <i class="fas fa-fire footer-made-with-icon"></i>
          Made with Fire
        </span>
      </div>
    </div>
  </footer>
</template>
