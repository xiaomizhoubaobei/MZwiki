import Teek from "vitepress-theme-teek";
import "vitepress-theme-teek/style";

// Lumen 组件
import "@theojs/lumen/style";
import "@theojs/lumen/doc-blocks";
import "@theojs/lumen/badge";
import "@theojs/lumen/link-card";

import TagIndex from "./TagIndex.vue";

export default {
  extends: Teek,
  enhanceApp({ app }) {
    app.component("tag-index", TagIndex);
  },
};
