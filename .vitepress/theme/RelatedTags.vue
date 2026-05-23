<script setup>
import { useData } from "vitepress";

const { frontmatter } = useData();
const tags = frontmatter.value?.tags || [];
</script>

<template>
  <div v-if="tags.length" class="related-tags">
    <h2>相关标签</h2>
    <div class="tag-list">
      <a
        v-for="tag in tags"
        :key="tag"
        :href="`/标签/${encodeURIComponent(tag)}`"
        class="tag"
      >
        #{{ tag }}
      </a>
    </div>
  </div>
</template>

<style scoped>
.related-tags {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.2s;
}

.tag:hover {
  background: var(--vp-c-brand);
  color: #fff;
}
</style>
