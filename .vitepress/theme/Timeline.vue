<script setup>
const years = [2026, 2025, 2024];
</script>

<template>
  <section class="timeline">
    <h2>🕓 更新时间线</h2>
    <ul>
      <li v-for="y in years" :key="y">
        <strong>{{ y }}</strong>
        <span>词条持续更新中</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.timeline ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.timeline li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
}
.timeline li strong {
  font-size: 1.05rem;
  min-width: 3rem;
}
.timeline li span {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}
</style>
