<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'

const progress = ref(0)
const route = useRoute()

function updateProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  if (docHeight > 0) {
    progress.value = Math.min((scrollTop / docHeight) * 100, 100)
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})

// 路由切换时重置进度
route.onBeforeRouteChange = () => {
  progress.value = 0
}
</script>

<template>
  <Transition name="progress-fade">
    <div v-if="progress > 0" class="reading-progress-bar">
      <div class="reading-progress-fill" :style="{ width: progress + '%' }" />
    </div>
  </Transition>
</template>

<style scoped>
.reading-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  height: 3px;
  background: transparent;
}

.reading-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand));
  border-radius: 0 2px 2px 0;
  transition: width 0.1s ease-out;
  will-change: width;
}

.progress-fade-enter-active,
.progress-fade-leave-active {
  transition: opacity 0.3s ease;
}

.progress-fade-enter-from,
.progress-fade-leave-to {
  opacity: 0;
}
</style>
