<script setup>
import { useData } from "vitepress";
import { data as backlinks } from "../backlinks.data";

const { frontmatter } = useData();
const title = frontmatter.value?.title;

const links = backlinks[title] || [];
</script>

<template>
  <div v-if="links.length" class="backlinks">
    <h2>被以下词条引用</h2>
    <ul>
      <li v-for="l in links" :key="l.url">
        <a :href="l.url">{{ l.title }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.backlinks {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
}

.backlinks h2 {
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
}
</style>
