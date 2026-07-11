<script setup lang="ts">
import '@/styles/loader.css'
</script>

<template>
  <div class="nezha-loader">
    <div class="loader-corners">
      <span class="loader-corner loader-corner--tl"></span>
      <span class="loader-corner loader-corner--tr"></span>
      <span class="loader-corner loader-corner--bl"></span>
      <span class="loader-corner loader-corner--br"></span>
    </div>

    <div class="loader-fire-container">
      <span class="loader-pulse-ring"></span>
      <span class="loader-pulse-ring loader-pulse-ring--2"></span>
      <span class="loader-pulse-ring loader-pulse-ring--3"></span>
      <span class="loader-ring loader-ring--outer"></span>
      <span class="loader-ring loader-ring--middle"></span>
      <span class="loader-ring loader-ring--inner"></span>
      <div class="loader-fire">
        <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="nz-flame-gradient" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stop-color="#FF2D2D" />
              <stop offset="50%" stop-color="#FF6B1A" />
              <stop offset="100%" stop-color="#FFD700" />
            </linearGradient>
            <filter id="nz-flame-glow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M60 8 C 42 30, 32 48, 40 68 C 44 78, 52 84, 60 84 C 68 84, 76 78, 80 68 C 88 48, 78 30, 60 8 Z"
            fill="url(#nz-flame-gradient)"
            filter="url(#nz-flame-glow)"
          />
          <path
            d="M60 38 C 52 52, 48 62, 54 74 C 57 80, 60 82, 60 82 C 60 82, 63 80, 66 74 C 72 62, 68 52, 60 38 Z"
            fill="#FFD700"
            opacity="0.6"
          />
        </svg>
      </div>
    </div>

    <span class="loader-ember loader-ember--1"></span>
    <span class="loader-ember loader-ember--2"></span>
    <span class="loader-ember loader-ember--3"></span>
    <span class="loader-ember loader-ember--4"></span>
    <span class="loader-ember loader-ember--5"></span>

    <h1 class="loader-title">哪吒网络安全</h1>

    <p class="loader-text">
      正在唤醒魔童<span class="loader-cursor"></span>
    </p>

    <div class="loader-progress">
      <div class="loader-progress-fill"></div>
    </div>
  </div>
</template>
