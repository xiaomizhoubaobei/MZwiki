<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { page, frontmatter, theme } = useData()

/* 1. 分类 / 标签 */
const categories = computed(() => {
  const cats = frontmatter.value.categories
  if (!cats) return ''
  return Array.isArray(cats) ? cats.join(' › ') : cats
})
const tags = computed(() => frontmatter.value.tags || [])

/* 2. doc-analysis 数据 */
const stats = computed(() => {
  const info = (theme.value as any)?.docAnalysisInfo
  if (!info || !page.value) return null

  return info.eachFileWords.find(
    (item: any) => item.fileInfo.relativePath === (page.value as any).relativePath
  )
})

/* 3. 作者 / 日期 */
const author = computed(() => frontmatter.value.author || '')
const date = computed(() => {
  const d = frontmatter.value.date
  if (!d) return ''
  return new Date(d).toLocaleDateString('zh-CN')
})

/* 4. 最后更新时间 */
const lastUpdated = computed(() => {
  if (!page.value?.lastUpdated) return ''
  return new Date(page.value.lastUpdated).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
})

// 仅当更新时间与创建时间不同时才显示徽章
const showUpdateBadge = computed(() => {
  if (!lastUpdated.value) return false
  const d = frontmatter.value.date
  if (!d) return true
  return new Date(d).toLocaleDateString('zh-CN') !== lastUpdated.value
})
</script>

<template>
  <div v-if="stats || categories || tags.length" class="entry-meta">
    <!-- 左侧：分类 / 标签 -->
    <span class="left">
      <span v-if="categories" class="cat">📁 {{ categories }}</span>
      <span v-for="t in tags" :key="t" class="tag">#{{ t }}</span>
    </span>

    <!-- 右侧：阅读时间 / 字数 / 作者 / 日期 -->
    <span v-if="stats || author || date" class="right">
      <template v-if="stats">
        <span class="reading-time">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {{ stats.readingTime }}
        </span>
        <span class="dot">·</span>
        <span>{{ stats.wordCount }} 字</span>
      </template>
      <template v-if="author">
        <span class="dot">·</span>
        <span>✍️ {{ author }}</span>
      </template>
      <template v-if="date">
        <span class="dot">·</span>
        <span>📅 {{ date }}</span>
      </template>
      <span v-if="showUpdateBadge" class="update-badge">
        🔄 {{ lastUpdated }}
      </span>
    </span>
  </div>
</template>

<style scoped>
.entry-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;

  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: 6px 0 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.left {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
}

.cat {
  opacity: 0.85;
}

.tag {
  background: var(--vp-c-bg-soft);
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.right {
  display: flex;
  gap: 6px;
  white-space: nowrap;
  align-items: center;
}

.reading-time {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.dot {
  opacity: 0.4;
}

/* 最后更新时间徽章 */
.update-badge {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-dark);
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 500;
  font-size: 12px;
  margin-left: 4px;
}

@media (max-width: 768px) {
  .entry-meta {
    font-size: 12px;
    gap: 6px;
  }
}
</style>
