<script setup>
import DefaultTheme from "vitepress/theme";
import Backlinks from "./Backlinks.vue";
import TocToggle from "./TocToggle.vue";
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-after>
      <Backlinks />
    </template>
    <template #aside-outline-before>
      <TocToggle />
    </template>
  </DefaultTheme.Layout>
</template>
