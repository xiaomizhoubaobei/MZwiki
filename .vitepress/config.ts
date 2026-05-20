import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";
import Teek from "vitepress-theme-teek";
import { defineTeekConfig } from "vitepress-theme-teek";

// Teek 主题配置
const teekConfig = defineTeekConfig({
  // 站点基础信息
  site: {
    logo: "/favicon.svg",
    title: "我的个人百科",
    description: "精选维基词条与个人知识库",
  },

  // 页脚（类似维基百科）
  footer: {
    message: "基于 VitePress + Teek + Lumen 构建",
    copyright: "© 2026 CC BY-SA 3.0",
  },

  // 侧边栏自动生成（推荐）
  sidebar: {
    auto: true,
  },

  // 搜索（内置）
  search: {
    provider: "local",
  },
});

export default withMermaid(
  defineConfig({
    lang: "zh-CN",
    title: "我的百科",
    description: "个人精选维基知识库",

    // 主题继承
    extends: Teek,

    // Teek 配置注入
    themeConfig: teekConfig,

    // Mermaid 全局配置（维基风）
    mermaid: {
      theme: "neutral",
      securityLevel: "loose",
    },

    // 构建优化
    cleanUrls: true,
    lastUpdated: true,
  })
);
