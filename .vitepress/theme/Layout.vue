<script setup>
import DefaultTheme from "vitepress/theme";
import Backlinks from "./Backlinks.vue";
import TocToggle from "./TocToggle.vue";
import DocMeta from "./components/DocMeta.vue";
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-after>
      <Backlinks />
    </template>
    <template #doc-footer-before>
      <DocMeta />
    </template>
    <template #aside-outline-before>
      <TocToggle />
    </template>
  </DefaultTheme.Layout>
</template>
