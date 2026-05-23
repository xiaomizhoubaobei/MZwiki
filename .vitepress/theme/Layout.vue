<script setup>
import DefaultTheme from "vitepress/theme";
import Backlinks from "./Backlinks.vue";
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-after>
      <Backlinks />
    </template>
  </DefaultTheme.Layout>
</template>
