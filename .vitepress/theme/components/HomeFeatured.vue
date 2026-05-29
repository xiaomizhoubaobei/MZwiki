<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { theme } = useData()

interface Post {
  title: string
  path: string
  categories: string[]
  readingTime: string
  updated: number
}

const posts = computed((): Post[] => {
  const info = (theme.value as any)?.docAnalysisInfo
  if (!info?.eachFileWords) return []

  return info.eachFileWords
    .map((item: any) => {
      const fm = item.frontmatter || {}
      const relativePath = item.fileInfo?.relativePath || ''

      return {
        title: fm.title || relativePath.replace(/\.md$/, '').split('/').pop()?.replace(/-/g, ' ') || '',
        path: '/' + relativePath.replace(/\.md$/, ''),
        categories: fm.categories || [],
        readingTime: item.readingTime || '几分钟',
        updated: item.fileInfo?.lastCommitTime || 0,
      }
    })
    // 过滤非词条页面
    .filter((p: Post) =>
      p.path !== '/' &&
      !p.path.includes('使用规范') &&
      !p.path.includes('待创建词条') &&
      !p.path.includes('标签') &&
      !p.path.includes('索引') &&
      !p.path.endsWith('/index') &&
      !p.path.includes('CONTRIBUTING')
    )
    // 按 Git 提交时间倒序
    .sort((a, b) => b.updated - a.updated)
    // 取前 6 条
    .slice(0, 6)
})
</script>

<template>
  <section class="home-featured">
    <div class="hero-actions">
      <a href="/random" class="hero-btn brand">🎲 随机漫游</a>
    </div>
    <h2>📖 最近更新</h2>
    <div class="grid">
      <a v-for="item in posts" :key="item.path" :href="item.path" class="card">
        <div class="meta">
          <span v-if="item.categories.length" class="cat">📁 {{ item.categories[0] }}</span>
          <span v-else class="cat">📁 未分类</span>
          <span class="time">🕒 {{ item.readingTime }}</span>
        </div>
        <h3 class="title">{{ item.title }}</h3>
        <div class="date">
          🔄 {{ item.updated ? new Date(item.updated).toLocaleDateString('zh-CN') : '' }}
        </div>
      </a>
    </div>
    <div v-if="posts.length === 0" class="empty-hint">
      <span>暂无词条，快去添加第一篇吧 🌱</span>
    </div>
  </section>
</template>

<style scoped>
.home-featured {
  margin-top: 48px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  justify-content: center;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.hero-btn.brand {
  background: var(--vp-c-brand);
  color: #fff;
}

.hero-btn.brand:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}


h2 {
  font-size: 1.4rem;
  margin-bottom: 16px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.card {
  display: block;
  padding: 16px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  color: inherit;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.card:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
}

.title {
  font-size: 1rem;
  font-weight: 600;
  margin: 8px 0;
  color: var(--vp-c-text-1);
}

.date {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.empty-hint {
  text-align: center;
  padding: 2rem;
  color: var(--vp-c-text-3);
}
</style>
