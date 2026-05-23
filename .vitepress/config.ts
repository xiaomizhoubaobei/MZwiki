import { defineConfig } from "vitepress";
import { withPWA } from "@vite-pwa/vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";
import Teek from "vitepress-theme-teek";
import { defineTeekConfig } from "vitepress-theme-teek";
import { remarkWikiLink } from "./plugins/remark-wiki-link";
import { injectTagsPlugin } from "./plugins/inject-tags";
import tagPages from "./tag-pages.data";
import previewData from "./preview.data";
import graphData from "./graph.data";
import redlinksData from "./redlinks.data";

// Teek 主题配置
const teekConfig = defineTeekConfig({
  // 站点基础信息
  site: {
    logo: "/favicon.svg",
    title: "我的个人百科",
    description: "精选维基词条与个人知识库",
  },

  // 默认作者
  author: {
    name: "祁筱欣",
  },

  // 文章元信息栏（作者、日期、分类、标签、字数、阅读时长）
  articleAnalyze: {
    showInfo: ["article"],
    showIcon: true,
    showAuthor: ["article"],
    showCreateDate: ["article"],
    showUpdateDate: true,
    showCategory: ["article"],
    showTag: ["article"],
    dateFormat: "yyyy-MM-dd",
    dateUTC: false,
  },

  // 文档分析（字数统计、阅读时长）
  docAnalysis: {
    wordCount: true,
    readingTime: true,
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

  // TOC 配置（桌面端侧边栏大纲 + 高亮同步滚动）
  outline: {
    level: [2, 3],
    label: "目录",
  },

  // 搜索（内置）
  search: {
    provider: "local",
  },

  // 站点统计
  siteAnalytics: [
    {
      provider: "google",
      options: {
        id: "G-22HLSJXMGWh",
      },
    },
    {
      provider: "baidu",
      options: {
        id: "42e6f8bd423ef428b0f9a1a80980da7f",
      },
    },
  ],
});

export default withMermaid(
  withPWA(
    defineConfig({
      lang: "zh-CN",
      title: "我的百科",
      description: "个人精选维基知识库",

      // Vite 插件
      vite: {
        plugins: [injectTagsPlugin()],
      },

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

      // Markdown 配置
      markdown: {
        remarkPlugins: [remarkWikiLink],
      },

      // 动态生成标签页面路由
      transformPageData(pageData) {
        if (pageData.relativePath === "标签/[tag].md") {
          return {
            params: {
              tag: pageData.params?.tag || "",
            },
          };
        }
      },

      // 注册数据
      data: {
        tags: tagPages,
        preview: previewData,
        graph: graphData,
        redlinks: redlinksData,
      },
    }),
    {
      // PWA 配置
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt"],
      manifest: {
        name: "XMZZUZHI Wiki",
        short_name: "Wiki",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#42a5f5",
        icons: [
          {
            src: "/favicon.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "/favicon.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,md,png,svg,webp}"],
      },
    }
  )
);
