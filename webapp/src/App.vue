<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import FooterBar from './components/FooterBar.vue'
import NezhaLoader from './components/NezhaLoader.vue'
import FireParticles from './components/FireParticles.vue'

const isLoading = ref(true)

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 2200)
})
</script>

<template>
  <NezhaLoader v-if="isLoading" />
  <div v-else class="app-root">
    <FireParticles />
    <NavBar />
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <FooterBar />
  </div>
</template>
