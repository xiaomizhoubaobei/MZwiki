<script setup>
const categories = [
  { name: "自然科学", icon: "🔬", link: "/自然科学/" },
  { name: "人文历史", icon: "📜", link: "/人文/" },
  { name: "工程技术", icon: "🛠️", link: "/工程/" },
];
</script>

<template>
  <section class="portal">
    <h2>📂 精选分类</h2>
    <div class="grid">
      <a v-for="c in categories" :key="c.name" :href="c.link" class="cat">
        <span class="icon">{{ c.icon }}</span>
        <span>{{ c.name }}</span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}
.cat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.2rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  text-align: center;
  transition: all 0.2s;
}
.cat:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
.icon {
  font-size: 1.6rem;
  margin-bottom: 0.5rem;
}
</style>
