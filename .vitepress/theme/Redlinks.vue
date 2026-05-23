<script setup>
import { data as redlinks } from "../redlinks.data";
</script>

<template>
  <div class="redlinks">
    <h1>待创建词条</h1>
    <p>共 {{ redlinks.length }} 条</p>

    <ul v-if="redlinks.length">
      <li v-for="t in redlinks" :key="t">
        <span class="missing">[[{{ t }}]]</span>
      </li>
    </ul>
    <p v-else class="empty">🎉 所有词条均已创建，暂无待创建词条。</p>
  </div>
</template>

<style scoped>
.redlinks ul {
  list-style: none;
  padding: 0;
}

.redlinks li {
  padding: 6px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.missing {
  color: #c00;
  cursor: help;
  font-weight: 500;
}

.empty {
  text-align: center;
  color: var(--vp-c-text-2);
  padding: 2rem 0;
}
</style>
