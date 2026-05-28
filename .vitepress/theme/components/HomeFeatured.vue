<template>
  <section class="home-featured">
    <h2>📖 最近更新</h2>
    <div class="grid">
      <a v-for="item in recentPosts" :key="item.path" :href="item.path" class="card">
        <span class="title">{{ item.title }}</span>
        <span class="desc">{{ item.readingTime }} · {{ formatDate(item.updated) }}</span>
      </a>
    </div>
    <div v-if="recentPosts.length === 0" class="empty-hint">
      <span>暂无词条，快去添加第一篇吧 🌱</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { theme } = useData()

// 从 docAnalysisInfo 获取所有词条文件信息
const files = computed(() => {
  const info = (theme.value as any)?.docAnalysisInfo
  if (!info?.eachFileWords) return []

  return info.eachFileWords
    .filter((f: any) => {
      const p = f.fileInfo?.relativePath || ''
      // 过滤索引页、标签页、功能页
      if (p === 'index.md' || p === '404.md') return false
      if (p.startsWith('标签/')) return false
      if (p.startsWith('索引/')) return false
      if (p.endsWith('/index.md')) return false
      const fname = p.replace(/\.md$/, '')
      if (['random', 'today', 'search', '图谱', '待创建词条', '站点统计', '使用规范', 'CONTRIBUTING'].includes(fname)) return false
      return true
    })
    .map((f: any) => ({
      path: '/' + (f.fileInfo?.relativePath || '').replace(/\.md$/, ''),
      title: f.frontmatter?.title || (f.fileInfo?.relativePath || '').replace(/\.md$/, '').split('/').pop()?.replace(/-/g, ' ') || '',
      readingTime: f.readingTime || '几分钟',
      updated: f.fileInfo?.lastCommitTime || 0,
    }))
})

// 按更新时间倒序，取前 6 个
const recentPosts = computed(() => {
  return [...files.value]
    .sort((a, b) => b.updated - a.updated)
    .slice(0, 6)
})

function formatDate(timestamp: number) {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
.home-featured {
  margin-top: 48px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}
.card {
  display: block;
  padding: 16px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.title {
  font-weight: 600;
  display: block;
}
.desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.empty-hint {
  text-align: center;
  padding: 2rem;
  color: var(--vp-c-text-3);
}
</style>
