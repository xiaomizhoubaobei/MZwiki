<p align="center">
  <img src="https://img.shields.io/badge/XMZZUZHI_Wiki-1.0.0-blue?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/VitePress-1.x-green?style=for-the-badge" alt="VitePress">
  <img src="https://img.shields.io/badge/Teek-Lumen-orange?style=for-the-badge" alt="Theme">
  <img src="https://img.shields.io/badge/PWA-Ready-purple?style=for-the-badge" alt="PWA">
</p>

<p align="center">
  <b>一个像维基百科一样生长的组织知识库。</b><br>
  基于 VitePress + Teek + Lumen，支持图谱、内链、红链追踪与离线访问。
</p>

---

## ✨ 功能特性

| 核心能力 | 说明 |
| --- | --- |
| 🔗 **维基级内链** | `[[词条]]` 语法，自动解析路径，双向引用 |
| 🔴 **红链追踪** | 自动发现未创建词条，驱动创作 |
| 🕸️ **图谱可视化** | Force Graph 展示知识网络关系 |
| 🏷️ **标签系统** | 自动索引、筛选、聚合 |
| 📊 **元数据自动化** | 字数、阅读时间、Frontmatter 自动补齐 |
| 🔍 **本地全文搜索** | Pagefind 驱动，毫秒级响应，支持标签过滤 |
| 📱 **PWA 离线百科** | 手机桌面安装，断网可用 |
| 🎲 **随机词条** | 每次刷新随机跳转到一篇词条 |
| 📅 **今日词条** | 当天固定一条，全年不重复，跨年循环 |
| 🎨 **Teek + Lumen** | 优雅的 UI，专注阅读体验 |

## 🚀 快速开始

### 1️⃣ 克隆仓库

```bash
git clone https://cnb.cool/XMZZUZHI/wiki.git
cd wiki
```

### 2️⃣ 安装依赖

```bash
pnpm install
```

### 3️⃣ 启动开发服务器

```bash
pnpm dev
```

浏览器访问：http://localhost:5173

### 4️⃣ 构建 & 预览

```bash
pnpm build
pnpm preview
```

## 📂 目录结构

```
wiki/
├── docs/                  # 文档目录
│   ├── index.md           # 首页
│   ├── 使用规范.md         # 词条编写规范
│   ├── CONTRIBUTING.md    # 贡献指南
│   ├── 随机词条.md         # 随机词条页面
│   ├── 今日词条.md         # 今日词条页面
│   ├── 搜索.md            # 全文搜索页面
│   ├── 待创建词条.md       # 红链追踪页面
│   ├── 图谱.md            # 知识图谱页面
│   ├── 站点统计.md         # 站点数据统计
│   ├── 自然科学/           # 自然科学分类
│   ├── 人文/              # 人文分类
│   ├── 标签/              # 标签聚合页
│   ├── 索引/              # 索引页
│   └── .vitepress/        # VitePress 配置与组件
│       ├── config.ts      # 站点配置
│       ├── theme/         # 自定义主题与组件
│       └── plugins/       # Vite 插件
├── public/                # 静态资源
├── package.json
└── README.md
```

## 📝 编写你的第一条词条

### 1️⃣ 新建文件

```
docs/自然科学/物理/量子力学.md
```

### 2️⃣ 填写 Frontmatter

```yaml
---
title: 量子力学
category: 自然科学
tags: [物理, 量子理论]
author: 你的名字
date: 2026-05-28
---
```

### 3️⃣ 编写内容

```markdown
# 量子力学

量子力学是描述微观粒子行为的物理学理论。

参见 [[薛定谔方程]]。
```

保存后，系统会自动：生成阅读时间 → 更新图谱 → 索引标签 → 刷新搜索。

## 🤝 贡献指南

我们非常欢迎你的贡献！

- 🐞 发现错误？提交 [Issue](https://cnb.cool/XMZZUZHI/wiki/-/issues)
- 📖 想写新词条？查看 [使用规范](./docs/使用规范.md)
- 🔴 发现红链？查看 [待创建词条](./docs/待创建词条.md)

请先阅读 [CONTRIBUTING.md](./docs/CONTRIBUTING.md)。

## 🛠️ 技术栈

| 技术 | 用途 |
| --- | --- |
| [VitePress](https://vitepress.dev/) | 静态站点生成 |
| [vitepress-theme-teek](https://teek.vercel.app/) | 主题框架 |
| [@theojs/lumen](https://lumen.theojs.cn/) | UI 主题 |
| [Pagefind](https://pagefind.app/) | 本地全文搜索 |
| [force-graph](https://github.com/vasturiano/force-graph) | 知识图谱可视化 |
| [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) | PWA 离线支持 |
| [Mermaid](https://mermaid.js.org/) | 图表渲染 |

## 📜 许可证

MIT License

---

<p align="center">
  Made with ❤️ by <a href="https://cnb.cool/XMZZUZHI">XMZZUZHI</a>
</p>
