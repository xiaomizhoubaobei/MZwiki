<script setup lang="ts">
import { data as redlinks } from "../redlinks.data";

interface Redlink {
  title: string;
  alias?: string;
}
</script>

<template>
  <div class="redlinks">
    <h1>🔴 待创建词条</h1>
    <p>共 <strong>{{ redlinks.length }}</strong> 条词条已被引用但尚未创建。</p>

    <ul v-if="(redlinks as Redlink[]).length">
      <li v-for="item in redlinks as Redlink[]" :key="item.title">
        <span class="missing">[[{{ item.alias || item.title }}]]</span>
        <span v-if="item.alias" class="target"> → 目标词条：<code>{{ item.title }}</code></span>
      </li>
    </ul>
    <p v-else class="empty">🎉 太棒了！目前没有待创建的词条。</p>
  </div>
</template>

<style scoped>
.redlinks ul {
  list-style: none;
  padding: 0;
}

.redlinks li {
  padding: 8px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.missing {
  color: #c00;
  cursor: help;
  font-weight: 500;
}

.target {
  color: var(--vp-c-text-2);
  font-size: 0.9em;
  margin-left: 4px;
}

.target code {
  background: var(--vp-c-bg-soft);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}

.empty {
  text-align: center;
  color: var(--vp-c-text-2);
  padding: 2rem 0;
}
</style>
