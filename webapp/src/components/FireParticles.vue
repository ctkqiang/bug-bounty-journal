<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import '@/styles/fire-particles.css'

interface Particle {
  x: number
  y: number
  radius: number
  speed: number
  drift: number
  opacity: number
  color: string
}

const FIRE_COLORS = ['#FF2D2D', '#FF6B1A', '#FFD700', '#FF4500', '#FF8C00']
const MAX_PARTICLES = 80

const canvas = ref<HTMLCanvasElement | null>(null)
let animationId = 0
let particles: Particle[] = []
let ctx: CanvasRenderingContext2D | null = null

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: height + Math.random() * 40,
    radius: Math.random() * 2.5 + 0.8,
    speed: Math.random() * 1.2 + 0.4,
    drift: (Math.random() - 0.5) * 0.6,
    opacity: Math.random() * 0.6 + 0.15,
    color: FIRE_COLORS[Math.floor(Math.random() * FIRE_COLORS.length)],
  }
}

function initParticles(width: number, height: number): void {
  particles = Array.from({ length: MAX_PARTICLES }, () => createParticle(width, height))
}

function updateParticle(p: Particle, width: number, height: number): void {
  p.y -= p.speed
  p.x += p.drift
  p.opacity -= 0.003
  p.radius *= 0.998

  if (p.y < -10 || p.opacity <= 0 || p.radius < 0.3) {
    Object.assign(p, createParticle(width, height))
  }
}

function draw(): void {
  if (!ctx || !canvas.value) return
  const { width, height } = canvas.value

  ctx.clearRect(0, 0, width, height)

  for (const p of particles) {
    updateParticle(p, width, height)
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.globalAlpha = p.opacity
    ctx.shadowBlur = 8
    ctx.shadowColor = p.color
    ctx.fill()
  }

  ctx.globalAlpha = 1
  ctx.shadowBlur = 0
  animationId = requestAnimationFrame(draw)
}

function resizeCanvas(): void {
  if (!canvas.value) return
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  initParticles(canvas.value.width, canvas.value.height)
}

onMounted(() => {
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d')
  resizeCanvas()
  draw()
  window.addEventListener('resize', resizeCanvas)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<template>
  <canvas ref="canvas" class="fire-particles"></canvas>
</template>
