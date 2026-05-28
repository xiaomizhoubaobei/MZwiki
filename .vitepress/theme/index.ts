import Teek from "vitepress-theme-teek";
import "vitepress-theme-teek/style";
import "./style.css";
import { h } from "vue";
import type { Theme } from "vitepress";

// Lumen 组件
import "@theojs/lumen/style";
import "@theojs/lumen/doc-blocks";
import "@theojs/lumen/badge";
import "@theojs/lumen/link-card";

import TagIndex from "./TagIndex.vue";
import TagPage from "./TagPage.vue";
import Backlinks from "./Backlinks.vue";
import NotFound from "./NotFound.vue";
import RelatedTags from "./RelatedTags.vue";
import GraphView from "./GraphView.vue";
import RandomPage from "./RandomPage.vue";
import TodayPage from "./TodayPage.vue";
import SearchWithTags from "./SearchWithTags.vue";
import HeroToday from "./HeroToday.vue";
import CategoryPortal from "./CategoryPortal.vue";
import Timeline from "./Timeline.vue";
import Redlinks from "./Redlinks.vue";
import TocToggle from "./TocToggle.vue";
import EntryMeta from "./components/EntryMeta.vue";
import BlogIndex from "./components/BlogIndex.vue";
import EntryLicense from "./components/EntryLicense.vue";
import ReadingProgress from "./components/ReadingProgress.vue";

export default {
  extends: Teek,
  NotFound,

  // 使用 h() 函数 + Teek Layout 插槽系统注入自定义组件
  Layout() {
    return h(Teek.Layout, null, {
      // 全局阅读进度条（固定在页面顶部）
      "layout-top": () => h(ReadingProgress),

      // 文章页：标题下方插入元信息栏（分类、标签、阅读时间等）
      "doc-before": () => h(EntryMeta),

      // 文章页：正文结束后插入反向链接 + 许可声明
      "doc-after": () => [h(Backlinks), h(EntryLicense)],

      // 侧边栏目录前插入 TOC 切换按钮
      "aside-outline-before": () => h(TocToggle),
    });
  },

  enhanceApp({ app }) {
    app.component("tag-index", TagIndex);
    app.component("tag-page", TagPage);
    app.component("Backlinks", Backlinks);
    app.component("RelatedTags", RelatedTags);
    app.component("graph-view", GraphView);
    app.component("random-page", RandomPage);
    app.component("today-page", TodayPage);
    app.component("search-with-tags", SearchWithTags);
    app.component("HeroToday", HeroToday);
    app.component("CategoryPortal", CategoryPortal);
    app.component("Timeline", Timeline);
    app.component("redlinks", Redlinks);
    app.component("EntryMeta", EntryMeta);
    app.component("BlogIndex", BlogIndex);
    app.component("EntryLicense", EntryLicense);
  },
} satisfies Theme;
