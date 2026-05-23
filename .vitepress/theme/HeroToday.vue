<script setup>
import { data as pages } from "../pages.data";

const day = Math.floor(
  (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
);

const page = pages[day % pages.length];
</script>

<template>
  <section class="hero">
    <h1 class="hero-title">📘 我的百科</h1>
    <p class="hero-sub">个人精选知识库</p>

    <div class="featured" v-if="page">
      <h2>📅 今日词条</h2>
      <a :href="page.url" class="card">
        <strong>{{ page.title }}</strong>
        <p>点击阅读完整词条</p>
      </a>
    </div>
  </section>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 3rem 1rem;
}
.hero-title {
  font-size: 2rem;
  margin-bottom: 0.3rem;
}
.hero-sub {
  color: var(--vp-c-text-2);
  margin: 0;
}
.featured {
  margin-top: 2rem;
}
.featured h2 {
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
}
.card {
  display: inline-block;
  padding: 1.2rem 2rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}
.card:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
.card strong {
  display: block;
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}
.card p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}
</style>
