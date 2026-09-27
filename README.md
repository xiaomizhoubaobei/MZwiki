# MZ维基 (MZ Wikipedia) — 自由的百科全书

[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

一个高保真、沉浸式、深度对标 **Wikipedia Vector 2022** 现代规范的自由知识百科全书系统。项目不仅呈现了符合国际医学审阅标准与同行评审标准的精编典范条目——**「卫生棉条 (Tampon)」**，还构建了完整的全域门户首页、官方标准路由体系、交互式解剖与医学指南，以及维基百科核心全域制度方针。

---

## 🌟 核心特性与功能亮点

### 1. 官方标准 URL 路由体系（HTML5 History API）
完全对标中文维基百科官方 URL 路径结构，无缝支持浏览器前进、后退（`popstate`）与书签分享：
- **全站门户首页**：`/wiki/Wikipedia:首页` 或根路径 `/`
- **今日典范条目**：`/wiki/卫生棉条`
- **条目章节锚点**：`/wiki/卫生棉条#usage-guide`、`#safety-and-tss`、`#references` 等
- **全域方针制度**：
  - 隐私政策：`/wiki/Wikipedia:隐私政策`
  - 免责声明：`/wiki/Wikipedia:免责声明`
  - 全域行为准则：`/wiki/Wikipedia:全域行为准则`
  - 关于项目：`/wiki/Wikipedia:关于`
- **全站语义化超链接**：所有超链接均附带真实 `/wiki/...` 的 `href` 属性，鼠标悬停时浏览器状态栏真实可见。

---

### 2. 维基百科 Vector 2022 经典交互复刻
- **智能顶部导航（Header）**：
  - MZ维基标志与主菜单抽屉（快速直达门户首页、特色条目、置入指南、TSS急症及各方针政策）。
  - 实时站内全局搜索建议：支持按条目章节和方针标题多维度即时匹配。
  - 阅读外观设置：支持字号切换（小 / 标准 / 大）、主题切换（浅色 / 深色 Vector Dark）、版心宽度自适应（标准 880px 黄金阅读列 / 全宽）。
- **侧边自适应目录栏（Table of Contents）**：
  - 左侧常驻固定与智能吸顶。
  - 实时滚动监听高亮（Scrollspy）。
  - 支持多级展开/折叠与一键快速收起。
- **维基百科原装交互卡片**：
  - **WikiLink 词条即时预览（Page Previews）**：鼠标移入文中内链（如「月经」、「阴道冠」、「金黄色葡萄球菌」），即时浮现生动卡片与词条摘要。
  - **Reference 浮动文献卡片（Cite Tooltips）**：正文右上角角标（如 `[1]`、`[6]`）悬浮即看文献标题、作者、刊物与年份，点击可平滑高亮定位至底部文末文献列表。
  - **MediaViewer 媒体查看器**：点击插图开启全屏纯净查看模式，查看真实摄影参数、像素分辨率、CC BY-SA 版权许可协议与 Wikimedia Commons 原作地址。

---

### 3. 「卫生棉条」精选典范条目架构
条目内容涵盖 8 大主章节、20 余项子议题与 15 篇权威同行评审文献（NEJM、Lancet、FDA、CDC、ACOG 等）：
1. **导言章节与消歧义提示**：维基百科官方标准首段导言、顶部消歧义提示（Hatnote）与页底分类条（Catlinks）。
2. **历史溯源**：古埃及莎草纸塞、1931 年美国厄尔·哈斯医生申请导管专利、格特鲁德·坦德里希创建 Tampax 商业化历程。
3. **结构形态与吸收分级**：指入式 vs 导管式（塑料导管/环保纸导管）、FDA 统一标准吸水量量表（Light ~ Ultra 换算）。
4. **核心使用指南**：清洁消毒、放松盆底肌、45°斜向置入法、正确推入深度与取出棉绳操作。
5. **健康安全与 TSS 专题**：中毒性休克综合征流行病学历史、致病机理（TSST-1外毒素）、早期识别症状（高热、皮疹、低血压休克）与 8 小时红线防护。
6. **常见迷思与事实破除**：阴道冠（处女膜）弹性孔隙、解剖盲端不会在体内走失、睡眠与运动游泳使用建议。
7. **全球法规与质量控制**：FDA 二类医疗器械分类标准、棉绳抗拉力测试（≥3 kg）。
8. **社会、文化与月经贫困**：消除 Tampon Tax 月经税、学校与公共场所免费提供法案倡导。
9. **学术参考文献列表**：15 篇规范的引用格式、DOI 外链与维基式跳转闪烁动画。

---

### 4. 独立制度与全域方针页
- **MZ维基:隐私政策**：不追踪个人行为、零遥测探针、开源透明。
- **MZ维基:免责声明**：医学内容仅供科普参考，急症立即就医免责说明。
- **MZ维基:全域行为准则 (UCoC)**：反歧视、社群文明交流准则。
- **MZ维基:关于**：自由知识共享计划愿景与 CC BY-SA 4.0 协议规范。

---

## 🛠️ 技术选型与架构

| 模块 | 技术栈 / 工具 | 描述 |
| :--- | :--- | :--- |
| **视图层** | React 19 + TypeScript | 函数式组件、React Hooks、强类型定义 |
| **构建工具** | Vite 6 | 秒级极速热重载与模块打包 |
| **样式框架** | Tailwind CSS v4 (`@tailwindcss/vite`) | 现代原子化 CSS、深色模式支持 |
| **图标库** | Lucide React | 清晰优雅的开源矢量图标集 |
| **路由模式** | HTML5 History API + Popstate | 仿 Wikipedia 原生 `/wiki/...` 路由机制 |

---

## 📁 目录结构概览

```text
├── index.html                   # HTML 模板入口，包含预载字体、Meta SEO 与 OpenGraph
├── metadata.json                # 项目元数据与平台环境声明
├── package.json                 # 依赖包与运行脚本
├── tsconfig.json                # TypeScript 编译配置
├── vite.config.ts               # Vite 6 与 Tailwind v4 配置
├── src/
│   ├── main.tsx                 # 应用程序根挂载入口
│   ├── App.tsx                  # 核心路由分发、历史记录同步、外观与全局布局
│   ├── index.css                # 全局样式导入与 Tailwind 指令
│   ├── components/
│   │   ├── WikipediaHeader.tsx       # Vector 2022 风格主导航栏、搜索栏与菜单
│   │   ├── WikipediaSubheader.tsx    # 条目头部标题带、分类标识与阅读统计
│   │   ├── TableOfContents.tsx       # 左侧自适应侧边目录栏与进度指示
│   │   ├── ArticleContent.tsx        # 「卫生棉条」精编正文与交互组件
│   │   ├── WikipediaImageThumb.tsx   # 维基百科标淮缩略图容器与图注
│   │   ├── WikipediaMediaViewer.tsx  # 原生 MediaViewer 大图灯箱与元数据
│   │   ├── WikiLinkPreview.tsx       # 内链鼠标悬浮词条卡片预览
│   │   ├── ReferencePreview.tsx      # 文献引用即时悬浮卡片
│   │   ├── AppearanceModal.tsx       # 阅读外观调节弹窗（字号/宽度/主题）
│   │   └── WikipediaFooter.tsx       # 维基百科官方标准底栏与版权声明
│   ├── pages/
│   │   ├── HomePage.tsx              # MZ维基全域门户首页（典范条目/你知道吗/方针倡导）
│   │   ├── PrivacyPage.tsx           # 独立页面：MZ维基:隐私政策
│   │   ├── DisclaimerPage.tsx        # 独立页面：MZ维基:免责声明
│   │   └── ConductPage.tsx           # 独立页面：MZ维基:全域行为准则
│   ├── utils/
│   │   └── wikiRoutes.ts             # 维基百科官方标准 URL 路由生成与解析器
│   └── data/
│       ├── articleData.ts            # 「卫生棉条」章节大纲、吸水量表与15篇参考文献
│       └── policyData.ts             # 三大核心方针政策结构化数据
```

---

## 🚀 本地开发与构建

### 1. 安装依赖
```bash
npm install
```

### 2. 启动本地开发服务器
```bash
npm run dev
```
启动后访问 `http://localhost:3000` 即可在本地体验应用。

### 3. 代码类型检查
```bash
npm run lint
```

### 4. 生产构建打包
```bash
npm run build
```
构建生成的文件将存放于 `dist/` 目录下，可直接部署于任何现代 Web 托管平台。

---

## 📄 知识共享协议

本项目内容与文字参考维基百科在 **[知识共享 署名-相同方式共享 4.0 国际许可协议 (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hans)** 之条款下提供。
医学知识仅用于大众健康教育普及，具体临床治疗请遵医嘱。
