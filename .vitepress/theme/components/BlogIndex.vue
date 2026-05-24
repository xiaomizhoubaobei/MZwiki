<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { theme } = useData()

const info = computed(() => (theme.value as any)?.docAnalysisInfo || {})

// 过滤掉索引页、标签页、功能页，只保留文章词条
const posts = computed(() => {
  const files: any[] = info.value.eachFileWords || []
  return files
    .filter((f: any) => {
      const p = f.fileInfo?.relativePath || ''
      if (p === 'index.md' || p === '404.md') return false
      if (p.startsWith('标签/')) return false
      if (p.startsWith('索引/')) return false
      if (p.endsWith('/index.md')) return false
      // 过滤功能页（非词条）
      const fname = p.replace(/\.md$/, '')
      if (['random', 'today', 'search', '图谱', '待创建词条', '站点统计'].includes(fname)) return false
      return true
    })
    .map((f: any) => ({
      path: '/' + (f.fileInfo?.relativePath || '').replace(/\.md$/, ''),
      title: f.frontmatter?.title || (f.fileInfo?.relativePath || '').replace(/\.md$/, '').replace(/-/g, ' '),
      wordCount: f.wordCount ?? 0,
      readingTime: f.readingTime ?? '0 分钟',
      tags: f.frontmatter?.tags || [],
      categories: f.frontmatter?.categories || [],
      date: f.frontmatter?.date || '',
    }))
    .sort((a: any, b: any) => (b.date || '').localeCompare(a.date || ''))
})

function formatWords(count: number) {
  if (count < 1000) return count.toString()
  if (count < 10000) return (count / 1000).toFixed(1) + 'k'
  return (count / 10000).toFixed(1) + 'w'
}
</script>

<template>
  <div class="blog-index">
    <div class="blog-header">
      <h1>📚 全部词条</h1>
      <p class="blog-desc">共 {{ posts.length }} 篇文章</p>
    </div>

    <div v-if="posts.length" class="post-list">
      <a
        v-for="post in posts"
        :key="post.path"
        :href="post.path"
        class="post-card"
      >
        <div class="post-card-main">
          <h3 class="post-title">{{ post.title }}</h3>
          <div class="post-meta">
            <span class="post-meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              {{ formatWords(post.wordCount) }} 字
            </span>
            <span class="post-meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {{ post.readingTime }}
            </span>
            <span v-if="post.date" class="post-meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {{ post.date }}
            </span>
          </div>
        </div>
        <div class="post-tags" v-if="post.tags.length">
          <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="tag">#{{ tag }}</span>
        </div>
      </a>
    </div>

    <div v-else class="empty-state">
      <p>暂无词条内容</p>
    </div>
  </div>
</template>

<style scoped>
.blog-index {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.blog-header {
  margin-bottom: 2rem;
}

.blog-header h1 {
  margin: 0 0 0.5rem;
}

.blog-desc {
  color: var(--vp-c-text-2);
  margin: 0;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.post-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s;
}

.post-card:hover {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-brand-1);
  transform: translateY(-1px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.post-card-main {
  flex: 1;
  min-width: 0;
}

.post-title {
  margin: 0 0 0.3rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.post-card:hover .post-title {
  color: var(--vp-c-brand-1);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.post-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.post-tags {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.tag {
  font-size: 0.75rem;
  padding: 2px 8px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 12px;
  white-space: nowrap;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .post-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .post-tags {
    margin-top: 0.25rem;
  }
}
</style>
