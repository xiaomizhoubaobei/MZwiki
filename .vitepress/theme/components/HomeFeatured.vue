<template>
  <section class="home-featured">
    <h2>📖 最近更新</h2>
    <div class="grid">
      <a v-for="item in posts" :href="item.link" class="card">
        <span class="title">{{ item.title }}</span>
        <span class="desc">{{ item.desc }}</span>
      </a>
    </div>
  </section>
</template>

<script setup>
const posts = [
  { title: "量子力学", desc: "微观世界的运动规律", link: "/自然科学/物理/量子力学" },
  { title: "薛定谔方程", desc: "波函数的演化方程", link: "/自然科学/物理/薛定谔方程" },
  { title: "神经网络", desc: "连接主义的复兴", link: "/工程技术/AI/神经网络" },
]
</script>

<style scoped>
.home-featured {
  margin-top: 48px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}
.card {
  display: block;
  padding: 16px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.title {
  font-weight: 600;
  display: block;
}
.desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
}
</style>
