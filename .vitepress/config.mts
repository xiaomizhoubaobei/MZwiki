import { defineConfig } from 'vitepress'
import { defineTeekConfig } from 'vitepress-theme-teek/config'
import Sidebar from 'vitepress-plugin-sidebar-resolve'

// Teek 主题配置
const teekConfig = defineTeekConfig({
  siteAnalytics: [
    { provider: "google", options: { id: "G-22HLSJXMGWh" } },
    { provider: "baidu", options: { id: "42e6f8bd423ef428b0f9a1a80980da7f" } },
  ],

  // 站点分析配置（docAnalysis）
  docAnalysis: {
    wordCount: true,    // 开启字数统计
    readingTime: true,  // 开启阅读时间预估
  },
})

// VitePress 配置
export default defineConfig({
  extends: teekConfig,
  title: 'XMZZUZHI Wiki',
  description: 'XMZZUZHI 组织知识库',
  lang: 'zh-CN',

  vite: {
    plugins: [Sidebar({
      ignoreList: [/\.git/, /\.gemini/, /node_modules/],
      sortNumFromFileName: true,
      titleFormMd: true,
      ignoreWarn: true,
    })],
  },

  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/01.指南/01.简介' },
      { text: '配置', link: '/02.配置/01.主题配置' }
    ],

    // 侧边栏由 vitepress-plugin-sidebar-resolve 自动生成
    // 按 docs/ 目录结构生成多级嵌套分类

    socialLinks: [
      { icon: 'github', link: 'https://cnb.cool/XMZZUZHI/wiki' }
    ],

    footer: {
      message: '基于 VitePress 构建',
      copyright: '© 2026 XMZZUZHI'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    outline: {
      label: '页面导航'
    },

    lastUpdated: {
      text: '最后更新于'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    }
  }
})
