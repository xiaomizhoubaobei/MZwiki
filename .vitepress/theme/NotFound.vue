<script setup>
import { useRoute } from "vitepress";
import { data as index } from "../search-index.data";

const route = useRoute();
const path = decodeURIComponent(route.path);

const suggestions = index
  .filter(p =>
    p.title.toLowerCase().includes(path.split("/").pop())
  )
  .slice(0, 3);
</script>

<template>
  <div class="not-found">
    <h1>404</h1>
    <p>页面未找到。</p>

    <div v-if="suggestions.length">
      <p>你可能想找的是：</p>
      <ul>
        <li v-for="p in suggestions" :key="p.url">
          <a :href="p.url">{{ p.title }}</a>
        </li>
      </ul>
    </div>

    <a href="/">返回首页</a>
  </div>
</template>

<style scoped>
.not-found {
  padding: 4rem 2rem;
  text-align: center;
}
.not-found h1 {
  font-size: 3rem;
}
.not-found ul {
  list-style: none;
  padding: 0;
}
.not-found li {
  margin: 0.5rem 0;
}
</style>
