<script setup>
import { onMounted } from "vue";
import { data as pages } from "../pages.data";

onMounted(() => {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  const index = dayOfYear % pages.length;
  const target = pages[index];
  if (target) {
    window.location.href = target.url;
  }
});
</script>

<template>
  <p>正在加载今日词条…</p>
</template>
