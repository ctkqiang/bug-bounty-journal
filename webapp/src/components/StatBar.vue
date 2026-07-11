<script setup lang="ts">
import { computed } from 'vue'
import '@/styles/home.css'

type StatColor = 'red' | 'orange' | 'gold' | 'purple' | 'green'

interface Props {
  label: string
  value: number
  max: number
  color?: StatColor
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'orange',
  icon: 'fas fa-fire',
})

const colorMap: Record<StatColor, string> = {
  red: 'var(--nz-fire-red)',
  orange: 'var(--nz-fire-orange)',
  gold: 'var(--nz-fire-gold)',
  purple: 'var(--nz-lotus)',
  green: 'var(--nz-low)',
}

const fillPercent = computed(() => {
  const ratio = props.max > 0 ? props.value / props.max : 0
  return Math.min(Math.max(ratio * 100, 0), 100)
})

const barStyle = computed(() => ({
  width: `${fillPercent.value}%`,
  background: colorMap[props.color],
  boxShadow: `0 0 10px ${colorMap[props.color]}, 0 0 20px rgba(255, 107, 26, 0.2)`,
}))
</script>

<template>
  <div class="nz-stat">
    <div class="nz-stat__header">
      <span class="nz-stat__label">
        <i :class="icon"></i>
        {{ label }}
      </span>
      <span class="nz-stat__value">{{ value }} / {{ max }}</span>
    </div>
    <div class="nz-stat__track">
      <div class="nz-stat__fill" :style="barStyle"></div>
    </div>
  </div>
</template>
