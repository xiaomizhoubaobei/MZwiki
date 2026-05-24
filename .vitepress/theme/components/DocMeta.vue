<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { page, theme } = useData()

const info = computed(() => {
  const list = (theme.value as any)?.docAnalysisInfo?.eachFileWords || []
  return list.find(
    (i: any) => i.fileInfo.relativePath === (page.value as any).relativePath
  )
})
</script>

<template>
  <div v-if="info" class="doc-meta">
    <span class="doc-meta-item">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      {{ info.wordCount }} 字
    </span>
    <span class="doc-meta-divider">·</span>
    <span class="doc-meta-item">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      {{ info.readingTime }}
    </span>
  </div>
</template>

<style scoped>
.doc-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 24px 0 8px;
  padding: 8px 0;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.doc-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.doc-meta-divider {
  opacity: 0.5;
}
</style>
