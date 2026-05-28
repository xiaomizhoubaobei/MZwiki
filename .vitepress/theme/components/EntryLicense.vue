<script setup>
import { useData } from 'vitepress'
const { frontmatter } = useData()
</script>

<template>
  <div class="entry-license">
    <hr />
    <p>
      《{{ frontmatter.title }}》采用
      <a
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
        target="_blank"
        rel="noopener"
      >
        CC BY-NC-SA 4.0
      </a>
      许可协议。
    </p>
  </div>
</template>

<style scoped>
.entry-license {
  margin-top: 32px;
  padding-top: 16px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.entry-license a {
  color: var(--vp-c-brand);
  text-decoration: none;
}
hr {
  border: none;
  border-top: 1px solid var(--vp-c-divider);
  margin-bottom: 12px;
}
</style>
