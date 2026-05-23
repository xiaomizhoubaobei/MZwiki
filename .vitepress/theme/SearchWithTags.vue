<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { data as tags } from "../tag.data";

const keyword = ref("");
const selectedTags = ref<string[]>([]);
const results = ref<any[]>([]);
const loading = ref(false);
const pagefindInstance = ref<any>(null);

// 获取所有唯一标签
const allTags = tags.map((t) => t.tag);

// 初始化 Pagefind
onMounted(async () => {
  try {
    const { Pagefind } = await import(/* @vite-ignore */ "/pagefind/pagefind.js");
    const pagefind = await Pagefind.new();
    pagefindInstance.value = pagefind;
  } catch (e) {
    console.warn("Pagefind 未加载（开发模式下不可用）:", e);
  }
});

// 搜索函数
async function performSearch() {
  if (!pagefindInstance.value) {
    results.value = [];
    return;
  }

  loading.value = true;

  try {
    const filters: Record<string, string[]> = {};

    // 使用 Pagefind 的 filter 功能进行标签过滤
    if (selectedTags.value.length > 0) {
      filters.tags = selectedTags.value;
    }

    let searchResult;

    if (keyword.value.trim()) {
      searchResult = await pagefindInstance.value.search(keyword.value.trim(), {
        filters,
      });
    } else if (selectedTags.value.length > 0) {
      // 有标签但无关键词时，搜索所有内容并过滤
      searchResult = await pagefindInstance.value.search("", {
        filters,
      });
    } else {
      results.value = [];
      loading.value = false;
      return;
    }

    const items = searchResult.results || [];
    const loaded = await Promise.all(items.map((item: any) => item.data()));
    results.value = loaded;
  } catch (e) {
    console.error("搜索失败:", e);
    results.value = [];
  } finally {
    loading.value = false;
  }
}

// 防抖搜索
let debounceTimer: ReturnType<typeof setTimeout>;
watch([keyword, selectedTags], () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    performSearch();
  }, 300);
});

function toggleTag(tag: string) {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((t) => t !== tag);
  } else {
    selectedTags.value.push(tag);
  }
}

function clearFilters() {
  keyword.value = "";
  selectedTags.value = [];
  results.value = [];
}

function highlightText(text: string) {
  if (!keyword.value.trim()) return text;
  const escaped = keyword.value.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}
</script>

<template>
  <div class="search-page">
    <h1>搜索百科</h1>
    <p class="search-desc">
      基于 Pagefind 的本地全文搜索，支持标签过滤 · 秒级响应 · 离线可用
    </p>

    <!-- 搜索框 -->
    <div class="search-box">
      <div class="search-input-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18">
          <path
            fill="currentColor"
            d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
          />
        </svg>
        <input
          v-model="keyword"
          type="text"
          placeholder="输入关键词搜索词条…"
          class="search-input"
          autofocus
        />
        <button
          v-if="keyword || selectedTags.length"
          class="clear-btn"
          @click="clearFilters"
          title="清除"
        >
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- 标签过滤 -->
    <div class="tag-filter" v-if="allTags.length">
      <span class="tag-filter-label">标签过滤：</span>
      <button
        v-for="tag in allTags"
        :key="tag"
        @click="toggleTag(tag)"
        :class="['tag-btn', { active: selectedTags.includes(tag) }]"
      >
        #{{ tag }}
      </button>
    </div>

    <!-- 搜索状态 -->
    <div v-if="loading" class="search-status">
      <span class="loading-spinner"></span> 搜索中…
    </div>
    <div v-else-if="results.length" class="search-status">
      共找到 <strong>{{ results.length }}</strong> 个结果
    </div>

    <!-- 搜索结果 -->
    <div v-if="results.length" class="search-results">
      <a
        v-for="item in results"
        :key="item.url"
        :href="item.url"
        class="search-result-item"
      >
        <h3
          class="result-title"
          v-html="highlightText(item.meta?.title || '')"
        ></h3>
        <p v-if="item.excerpt" class="result-excerpt" v-html="item.excerpt"></p>
        <div v-if="item.meta?.tags" class="result-tags">
          <span
            v-for="t in item.meta.tags.split(',')"
            :key="t"
            class="result-tag"
          >
            #{{ t.trim() }}
          </span>
        </div>
      </a>
    </div>

    <!-- 空状态 -->
    <div
      v-if="!loading && (keyword || selectedTags.length) && !results.length"
      class="empty-state"
    >
      <p>未找到匹配的词条</p>
      <button class="clear-btn-text" @click="clearFilters">清除搜索条件</button>
    </div>

    <!-- 初始提示 -->
    <div
      v-if="!keyword && !selectedTags.length && !results.length"
      class="initial-hint"
    >
      <p>输入关键词或选择标签开始搜索</p>
      <div class="hint-features">
        <div class="hint-item">⚡ 秒级全文搜索</div>
        <div class="hint-item">🏷️ 标签过滤</div>
        <div class="hint-item">📱 离线可用</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.search-page h1 {
  margin-bottom: 0.5rem;
}

.search-desc {
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

/* 搜索框 */
.search-box {
  margin-bottom: 1.2rem;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  transition: border-color 0.2s;
}

.search-input-wrapper:focus-within {
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px rgba(var(--vp-c-brand-rgb), 0.15);
}

.search-icon {
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-3);
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

/* 标签过滤 */
.tag-filter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1.5rem;
}

.tag-filter-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-right: 0.2rem;
}

.tag-btn {
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-btn:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.tag-btn.active {
  background: var(--vp-c-brand);
  color: #fff;
  border-color: var(--vp-c-brand);
}

/* 搜索状态 */
.search-status {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

/* 搜索结果 */
.search-results {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.search-result-item {
  display: block;
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.search-result-item:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.result-title {
  margin: 0 0 0.3rem 0;
  font-size: 1.05rem;
  color: var(--vp-c-text-1);
}

.result-excerpt {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.result-excerpt :deep(mark) {
  background: rgba(var(--vp-c-brand-rgb), 0.2);
  color: var(--vp-c-text-1);
  padding: 0 2px;
  border-radius: 2px;
}

.result-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.5rem;
}

.result-tag {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--vp-c-text-2);
}

.clear-btn-text {
  margin-top: 0.5rem;
  border: none;
  background: transparent;
  color: var(--vp-c-brand);
  cursor: pointer;
  font-size: 0.9rem;
}

.clear-btn-text:hover {
  text-decoration: underline;
}

/* 初始提示 */
.initial-hint {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--vp-c-text-2);
}

.initial-hint p {
  margin-bottom: 1.2rem;
}

.hint-features {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.hint-item {
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
}

/* 加载动画 */
.loading-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
