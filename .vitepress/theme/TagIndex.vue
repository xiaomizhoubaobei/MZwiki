<script setup>
import { data } from "../tag.data";
</script>

<template>
  <div class="tag-index">
    <h1>标签索引</h1>

    <section v-for="item in data" :key="item.tag">
      <h2>
        <a :href="`/标签/${encodeURIComponent(item.tag)}.html`">{{ item.tag }}</a>
      </h2>
      <ul>
        <li v-for="p in item.pages" :key="p.url">
          <a :href="p.url">{{ p.title }}</a>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.tag-index h1 {
  margin-bottom: 1.5rem;
}
.tag-index section {
  margin-bottom: 2rem;
}
.tag-index h2 {
  font-size: 1.2rem;
  border-left: 4px solid var(--vp-c-brand);
  padding-left: 0.5rem;
}
</style>
