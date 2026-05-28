<script setup>
import DefaultTheme from "vitepress/theme";
import Backlinks from "./Backlinks.vue";
import TocToggle from "./TocToggle.vue";
import EntryMeta from "./components/EntryMeta.vue";
import EntryLicense from "./components/EntryLicense.vue";
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-before>
      <EntryMeta />
    </template>
    <template #doc-after>
      <Backlinks />
      <EntryLicense />
    </template>
    <template #aside-outline-before>
      <TocToggle />
    </template>
  </DefaultTheme.Layout>
</template>
