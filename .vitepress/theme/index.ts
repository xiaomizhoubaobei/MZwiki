import Teek from "vitepress-theme-teek";
import "vitepress-theme-teek/style";
import "./style.css";

// Lumen 组件
import "@theojs/lumen/style";
import "@theojs/lumen/doc-blocks";
import "@theojs/lumen/badge";
import "@theojs/lumen/link-card";

import Layout from "./Layout.vue";
import TagIndex from "./TagIndex.vue";
import TagPage from "./TagPage.vue";
import Backlinks from "./Backlinks.vue";
import NotFound from "./NotFound.vue";
import RelatedTags from "./RelatedTags.vue";
import GraphView from "./GraphView.vue";

export default {
  extends: Teek,
  Layout: Layout,
  NotFound,
  enhanceApp({ app }) {
    app.component("tag-index", TagIndex);
    app.component("tag-page", TagPage);
    app.component("Backlinks", Backlinks);
    app.component("RelatedTags", RelatedTags);
    app.component("graph-view", GraphView);
  },
};
