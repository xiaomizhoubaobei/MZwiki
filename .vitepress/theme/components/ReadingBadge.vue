<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { page, theme } = useData()

// 从 docAnalysisInfo 中精确匹配当前页面
const stats = computed(() => {
  const info = (theme.value as any)?.docAnalysisInfo
  if (!info || !page.value) return null

  return info.eachFileWords.find(
    (item: any) => item.fileInfo.relativePath === (page.value as any).relativePath
  )
})
</script>

<template>
  <div v-if="stats" class="reading-badge">
    <span class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    </span>
    <span>{{ stats.readingTime }}</span>
    <span class="dot">&middot;</span>
    <span>{{ stats.wordCount }} 字</span>
  </div>
</template>

<style scoped>
.reading-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  padding: 4px 12px;
  border-radius: 999px;
  margin: 6px 0 0;
  user-select: none;
  transition: all 0.2s;
}

.reading-badge .icon {
  display: inline-flex;
  align-items: center;
  opacity: 0.7;
}

.reading-badge .dot {
  opacity: 0.4;
}

/* 长文章（超过15分钟）高亮 */
.reading-badge.long {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

@media (max-width: 768px) {
  .reading-badge {
    font-size: 12px;
    padding: 3px 10px;
  }
}
</style>
