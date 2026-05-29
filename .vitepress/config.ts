import { defineConfig } from "vitepress";
import { defineTeekConfig } from "vitepress-theme-teek/config";
import { withMermaid } from "vitepress-plugin-mermaid";
import { withPwa } from "@vite-pwa/vitepress";
import { remarkWikiLink } from "./plugins/remark-wiki-link";
import { injectTagsPlugin } from "./plugins/inject-tags";

export default withPwa(
  withMermaid(
    defineConfig({
      title: "VitePedia",
      description: "一座慢慢生长的数字知识花园，涵盖哲学、科学、技术与人文的开放知识库。",
      lang: "zh-CN",

      extends: defineTeekConfig(),

      // ===== SEO =====
      head: [
        // 站点关键词
        ["meta", { name: "keywords", content: "知识库,百科,数字花园,VitePedia,哲学,科学,技术,人文" }],

        // Open Graph（社交分享卡片）
        ["meta", { property: "og:title", content: "VitePedia" }],
        ["meta", { property: "og:description", content: "一座慢慢生长的数字知识花园。" }],
        ["meta", { property: "og:type", content: "website" }],
        ["meta", { property: "og:locale", content: "zh_CN" }],

        // Twitter Card
        ["meta", { name: "twitter:card", content: "summary_large_image" }],

        // 站点图标
        ["link", { rel: "icon", href: "/favicon.svg" }],
      ],

      // ===== Sitemap =====
      sitemap: {
        hostname: "https://wiki.mizhoubaobei.top",
        exclude: ["/404", "/待创建词条"],
      },

      // Vite 配置
      vite: {
        logLevel: "warn",

        optimizeDeps: {
          include: [],
          exclude: [
            'dayjs',
            'debug',
          ],
        },

        ssr: {
          noExternal: [],
          external: [
            'dayjs',
            'debug',
          ],
        },

        plugins: [
          injectTagsPlugin(),
          // 将 pagefind 标记为外部依赖，避免构建时报错
          {
            name: "pagefind-external",
            resolveId(id) {
              if (id.includes("pagefind")) {
                return { id, external: true };
              }
            },
          },
        ],
        build: {
          chunkSizeWarningLimit: 1024,
          rollupOptions: {
            output: {
              manualChunks(id) {
                if (id.includes("node_modules")) {
                  return "vendor";
                }
                if (id.includes("mermaid")) {
                  return "mermaid";
                }

              },
            },
          },
        },
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
          { text: "时间线", link: "/timeline" },
          { text: "🎲 随机", link: "/random" },
          { text: "🔴 待创建", link: "/待创建词条" },
        ],

        // ===== Teek 配置 =====
        teek: {
          // SEO（自动生成 og:image 和 JSON-LD 结构化数据）
          seo: {
            autoOgImage: true,
            jsonLd: true,
          },

          // 侧边栏扫描范围限制
          sidebarResolve: {
            scanDirs: ["docs"],
            ignoreDirs: [
              "node_modules",
              ".pnpm-store",
              "scripts",
              ".git",
              "dist",
              ".vitepress",
              "drafts",
            ],
            ignoreFiles: [
              "README.md",
              "CHANGELOG.md",
            ],
          },
        },
      },

      // ===== Mermaid 配置 =====
      mermaid: {
        theme: "neutral",
      },

      // ===== PWA 配置 =====
      pwa: {
        registerType: "autoUpdate",
        workbox: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
          globPatterns: ["**/*.{js,css,html,svg,png,jpg,gif,webp,woff2}"],
        },
        strict: false,
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
