<script setup>
import { data as pages } from "../pages.data";

const target =
  pages[Math.floor(Math.random() * pages.length)];

if (target) {
  window.location.href = target.url;
}
</script>

<template>
  <p>正在跳转到随机词条…</p>
</template>
