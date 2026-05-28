import { defineConfig } from "vitepress";
import Teek from "vitepress-theme-teek";
import { withMermaid } from "vitepress-plugin-mermaid";
import { withPwa } from "@vite-pwa/vitepress";
import { remarkWikiLink } from "./plugins/remark-wiki-link";
import { injectTagsPlugin } from "./plugins/inject-tags";

export default withPwa(
  withMermaid(
    defineConfig({
      title: "VitePedia",
      description: "一座慢慢生长的数字知识花园",
      lang: "zh-CN",

      extends: Teek,

      // Vite 插件
      vite: {
        plugins: [injectTagsPlugin()],
      },

      themeConfig: {
        logo: "/favicon.svg",
        siteTitle: "VitePedia",

        // ===== Lumen（由 Teek 托管）=====
        lumen: {
          enabled: true,
          docBlocks: true,
          badge: true,
          linkCard: true,
        },

        // ===== 最后更新 =====
        lastUpdated: {
          text: "最后更新于",
        },

        // ===== 编辑链接 =====
        editLink: {
          pattern: "https://github.com/your-repo/edit/main/docs/:path",
          text: "在 GitHub 上编辑此页",
        },

        // ===== 页脚 =====
        footer: {
          message: "采用 CC BY-NC-SA 4.0 许可协议",
          copyright: "Copyright © 2026 VitePedia",
        },

        // ===== 搜索（Pagefind）=====
        search: {
          provider: "pagefind",
        },

        // ===== 导航 =====
        nav: [
          { text: "首页", link: "/" },
          { text: "归档", link: "/archives" },
          { text: "分类", link: "/categories" },
          { text: "标签", link: "/tags" },
          { text: "图谱", link: "/graph" },
          { text: "时间线", link: "/timeline" },
          { text: "🎲 随机", link: "/random" },
          { text: "🔴 待创建", link: "/待创建词条" },
        ],
      },

      // ===== Mermaid 配置 =====
      mermaid: {
        theme: "neutral",
      },

      // ===== PWA 配置 =====
      pwa: {
        registerType: "autoUpdate",
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,jpg,gif,webp,woff2}"],
        },
      },

      // ===== Markdown 增强 =====
      markdown: {
        remarkPlugins: [remarkWikiLink],
        image: {
          lazyLoading: true,
        },
        lineNumbers: true,
        codeTransformers: [],
      },

      // ===== 构建优化 =====
      cleanUrls: true,
      metaChunk: true,
    })
  )
);
