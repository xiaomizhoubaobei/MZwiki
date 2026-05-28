<script setup>
import { useData } from "vitepress";
import { data as categories } from "../category-pages.data";

const { params } = useData();
const category = decodeURIComponent(params.value.category);

const current = categories.find((c) => c.category === category);
</script>

<template>
  <div class="category-page">
    <h1>分类：{{ category }}</h1>

    <ul v-if="current">
      <li v-for="p in current.pages" :key="p.url">
        <a :href="p.url">{{ p.title }}</a>
      </li>
    </ul>

    <p v-else>暂无词条。</p>
  </div>
</template>

<style scoped>
.category-page h1 {
  margin-bottom: 1.5rem;
}
.category-page ul {
  padding-left: 1.2rem;
}
.category-page li {
  margin-bottom: 0.5rem;
}
</style>
