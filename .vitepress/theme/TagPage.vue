<script setup>
import { useData } from "vitepress";
import { data as tags } from "../tag-pages.data";

const { params } = useData();
const tag = decodeURIComponent(params.value.tag);

const current = tags.find((t) => t.tag === tag);
</script>

<template>
  <div class="tag-page">
    <h1>标签：{{ tag }}</h1>

    <ul v-if="current">
      <li v-for="p in current.pages" :key="p.url">
        <a :href="p.url">{{ p.title }}</a>
      </li>
    </ul>

    <p v-else>暂无词条。</p>
  </div>
</template>

<style scoped>
.tag-page h1 {
  margin-bottom: 1.5rem;
}
.tag-page ul {
  padding-left: 1.2rem;
}
.tag-page li {
  margin-bottom: 0.5rem;
}
</style>
