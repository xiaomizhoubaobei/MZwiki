import Teek from "vitepress-theme-teek";
import "vitepress-theme-teek/index.css";
import { TkArticleAnalyze, teekConfigContext } from "vitepress-theme-teek";
import { h, provide } from "vue";

// 样式增强 - 推荐引入
import "vitepress-theme-teek/theme-chalk/tk-doc-h1-gradient.css"; // 标题渐变色
import "vitepress-theme-teek/theme-chalk/tk-sidebar.css"; // 侧边栏样式增强
import "vitepress-theme-teek/theme-chalk/tk-aside.css"; // 目录栏样式增强
import "vitepress-theme-teek/theme-chalk/tk-doc-fade-in.css"; // 文章淡入效果
import "vitepress-theme-teek/theme-chalk/tk-container.css"; // 容器样式增强
import "vitepress-theme-teek/theme-chalk/tk-nav.css"; // 导航栏增强
import "vitepress-theme-teek/theme-chalk/tk-table.css"; // 表格样式美化

// 提供 docAnalysis 和 articleAnalyze 配置
provide(teekConfigContext, {
  docAnalysis: {
    wordCount: true,
    readingTime: true,
  },
  articleAnalyze: {
    showIcon: true,
    dateFormat: "yyyy-MM-dd",
    showAuthor: true,
    showCreateDate: true,
    showUpdateDate: false,
    showCategory: false,
    showTag: false,
  },
});

export default {
  extends: Teek,
  Layout: () =>
    h(Teek.Layout, null, {
      "doc-before": () => h(TkArticleAnalyze),
    }),
};
