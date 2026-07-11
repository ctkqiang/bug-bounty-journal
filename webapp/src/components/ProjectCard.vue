<script setup lang="ts">
import type { GitHubProject } from '@/models/Project'
import '@/styles/projects.css'

interface Props {
  project: GitHubProject
}

const props = defineProps<Props>()

const languageColors: Record<string, string> = {
  Go: '#00ADD8',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Rust: '#dea584',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Dart: '#00B4AB',
  Erlang: '#B83998',
  Shell: '#89e051',
  Kotlin: '#A97BFF',
  Vue: '#41b883',
}

function langColor(lang: string | null): string {
  if (!lang) return '#6B6B80'
  return languageColors[lang] ?? '#FF6B1A'
}
</script>

<template>
  <article class="project-card">
    <div class="project-header">
      <h3 class="project-name">
        <i class="fas fa-book-bookmark"></i>
        {{ props.project.name }}
      </h3>
      <span v-if="props.project.isFork" class="project-fork-badge">
        <i class="fas fa-code-fork project-fork-badge-icon"></i> Fork
      </span>
    </div>

    <p class="project-description">{{ props.project.description }}</p>

    <div class="project-topics">
      <span
        v-for="topic in props.project.topics"
        :key="topic"
        class="project-topic"
      >
        {{ topic }}
      </span>
    </div>

    <div class="project-footer">
      <div class="project-stats">
        <span class="project-language">
          <span
            class="project-language-dot"
            :style="{ background: langColor(props.project.language) }"
          ></span>
          {{ props.project.language ?? 'Unknown' }}
        </span>
        <span class="project-stars">
          <i class="fas fa-star project-star-icon"></i>
          {{ props.project.stars }}
        </span>
        <span class="project-forks">
          <i class="fas fa-code-fork project-fork-icon"></i>
          {{ props.project.forks }}
        </span>
      </div>
    </div>

    <a
      :href="props.project.url"
      class="project-view-btn"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i class="fab fa-github project-view-btn-icon"></i>
      View on GitHub
      <i class="fas fa-arrow-up-right-from-square"></i>
    </a>
  </article>
</template>
