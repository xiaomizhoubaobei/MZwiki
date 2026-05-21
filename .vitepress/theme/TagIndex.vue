<script setup>
import { data as tagData } from "../tag.data";
</script>

<template>
  <div class="tag-index">
    <h1>标签索引</h1>

    <div v-for="item in tagData" :key="item.tag" class="tag-group">
      <h2>{{ item.tag }}</h2>
      <ul>
        <li v-for="page in item.pages" :key="page.url">
          <a :href="page.url">{{ page.title }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.tag-index h1 {
  margin-bottom: 1.5rem;
}
.tag-group {
  margin-bottom: 2rem;
}
.tag-group h2 {
  font-size: 1.2rem;
  border-left: 4px solid var(--vp-c-brand);
  padding-left: 0.5rem;
}
</style>
