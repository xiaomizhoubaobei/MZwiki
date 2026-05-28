import Teek from "vitepress-theme-teek";
import "vitepress-theme-teek/index.css";
import "./style.css";
import { h } from "vue";
import type { Theme } from "vitepress";

// 自定义组件（components 目录）
import ReadingProgress from "./components/ReadingProgress.vue";
import EntryMeta from "./components/EntryMeta.vue";
import EntryLicense from "./components/EntryLicense.vue";
import HomeFeatured from "./components/HomeFeatured.vue";
import TocToggle from "./TocToggle.vue";

// 功能页组件
import TagIndex from "./TagIndex.vue";
import TagPage from "./TagPage.vue";
import Backlinks from "./Backlinks.vue";
import GraphView from "./GraphView.vue";
import RandomPage from "./RandomPage.vue";
import Timeline from "./Timeline.vue";
import Redlinks from "./Redlinks.vue";
import CategoryPortal from "./CategoryPortal.vue";
import BlogIndex from "./components/BlogIndex.vue";

export default {
  extends: Teek,

  Layout() {
    return h(Teek.Layout, null, {
      // ====== 全局插槽 ======
      "teek-theme-enhance-top": () => h(ReadingProgress),

      // ====== 首页插槽 ======
      "home-hero-after": () => h(HomeFeatured),

      // ====== 文章页插槽 ======
      "teek-article-analyze-before": () => h(EntryMeta),
      "teek-doc-after-appreciation-before": () => [h(Backlinks), h(EntryLicense)],
      "teek-article-share-after": () => h(TocToggle),
    });
  },

  enhanceApp({ app }) {
    // 注册业务组件
    app.component("tag-index", TagIndex);
    app.component("tag-page", TagPage);
    app.component("Backlinks", Backlinks);
    app.component("graph-view", GraphView);
    app.component("random-page", RandomPage);
    app.component("Timeline", Timeline);
    app.component("redlinks", Redlinks);
    app.component("CategoryPortal", CategoryPortal);
    app.component("EntryMeta", EntryMeta);
    app.component("BlogIndex", BlogIndex);
    app.component("EntryLicense", EntryLicense);
  },
} satisfies Theme;
