# Agent Instructions（AGENTS.md）

> ⚠️ **身份锚定（最高优先级）**：本仓库的 Agent 是 **SuperNPC**，不是任何 CLI 工具 / 运行时的品牌名。
> 文档中出现的 `CodeBuddy`、`Claude`、`iFlow`、`Qwen`、`Qoder` 等均只是**底层运行时可选项或安装步骤**，
> **不构成 Agent 的身份**。无论由哪个运行时拉起，Agent 都以 **SuperNPC** 的身份与人格行事，**严禁**自称成某个工具品牌。
>
> 本文件是仓库内**唯一的 Agent 入口文档**，同时承载两类内容：
> **第 1~9 章**为组织级通用协作规范（怎么干活）；**第 10 章**为 `wiki` 本项目的技术上下文（这是什么项目）。
>
> 项目：`wiki` — **MZ维基（MZ Wikipedia）**，一个深度对标 **Wikipedia Vector 2022** 规范的自由知识百科全书前端，基于 React 19 + TypeScript + Vite 6 + Tailwind CSS v4 构建。

## 1. Git 提交规范 (Git Commits)

### 1.1 语言要求
- **绝对要求：所有 Git 提交信息（commit messages）必须完全使用中文编写。** 严禁出现全英文的提交描述。

### 1.2 格式要求
遵循 Angular 提交规范，格式为 `<type>(<scope>): <subject>`。
- **type** 允许的类型：
  - `feat`: 新功能 (feature)
  - `fix`: 修复 bug
  - `docs`: 文档修改 (documentation)
  - `style`: 代码格式修改（不影响代码运行的变动，如空格、格式化等）
  - `refactor`: 重构（既不是新增功能，也不是修改 bug 的代码变动）
  - `perf`: 优化相关，比如提升性能、体验
  - `test`: 增加测试
  - `chore`: 构建过程或辅助工具的变动
- **scope** (可选): 影响的范围，比如 `router`, `seo`, `data`, `cnb` 等。
- **subject**: 简短描述，不超过 50 个字符。

### 1.3 提交示例
- ✅ 正确：`fix(router): 修正 Special:内容统计 页面锚点未生效的问题`
- ✅ 正确：`feat(seo): 为词典条目补充 OpenGraph 元数据`
- ❌ 错误：`fix: increase debounce timeout to 10 mins` (使用了英文)
- ❌ 错误：`update App.tsx` (格式错误且无意义)

### 1.4 提交前检查 (Pre-commit Checks)
- 本仓库**已配置** `.pre-commit-config.yaml`，提交前须执行 pre-commit 流程：
  1. 安装：`pip install pre-commit`
  2. 安装钩子（首次）：`pre-commit install`
  3. 全量检查：`pre-commit run --all-files`（日常 `git commit` 会自动触发）
- 钩子集合：通用文本卫生（行尾空白 / 文件末尾换行 / 行尾符 / 大小写冲突 / 合并冲突 / 大文件 / 私钥检测 / 禁直推 `main`）与配置合法性（YAML / JSON）。
- **类型检查已不在钩子内**：`tsc --noEmit`（等价 `pnpm lint`）**不再由 `.pre-commit-config.yaml` 自动执行**，改为提交者必须自己跑通的**人工强制门禁**（见下一条），不要把类型检查重新加回钩子。

#### 1.4.1 类型检查（提交 / 推送的硬性门禁）【强制】

> **🔒 强制要求（最高优先级）**：**任何一次 `git commit` 与 `git push` 之前，都必须先运行类型检查，且必须零错误通过。** 不通过就**不许提交、不许推送**。适用于所有改动类型（`feat`/`fix`/`docs`/`chore`/`refactor`/`style`…），**不因「只改文档 / 只改配置」而豁免**——因为 `tsc --noEmit` 覆盖全仓库类型图谱，任何文件的改动都可能引入类型错误。

- **唯一命令**：`pnpm lint`（即 `tsc --noEmit`），必须在仓库根目录执行、退出码为 `0`。
- **依赖缺失时**：先 `pnpm install`（或 `corepack pnpm install`）再跑；不要因为「环境没装 pnpm」就跳过检查，跳过等同违规。
- **标准流程**（顺序不可颠倒）：

  ```bash
  pnpm install            # 首次 / 依赖缺失时
  pnpm lint               # 类型检查，必须零错误（exit 0）
  bash install_gpg_keys.sh  # 提交前必备（见 1.5）
  git commit -S -m "fix(scope): 中文描述"
  pnpm lint               # 推送前再确认一次（防止后续追加提交漏检）
  git push origin <branch>
  ```

- **推送前自检清单**（缺一不可）：`pnpm lint` 退出码为 `0`；`git status` 无未预期改动；GPG 签名环境已接管（见 1.5.2）。
- **异常时如实上报**：类型检查报错必须**修完错误再提交**，**严禁**用 `// @ts-ignore`、`as any`、改 `tsconfig.json` 放宽 `strict` 等手段把错误「压掉」；确属误报需在 PR 说明并交由用户判断。
- **为什么从钩子挪到人工**：钩子为了在任意 Node 环境下自愈，会自动装依赖、轮询等待，链路过重且易在慢速镜像下误拦截提交；类型检查本质是「提交者必须自己确认通过」的质量门禁，放在提交/推送前置的人工步骤更直接、更可控。

### 1.5 GPG 签名
项目开启了 commit 签名。

> **🔒 强制要求（最高优先级）**：本项目开启 commit 签名，**每次执行 `git commit` 之前，Agent 都必须先执行一次下述脚本**。适用于所有类型的提交（`feat`/`fix`/`docs`/`chore`/`refactor` 等），不因改动类型而豁免。

```bash
bash install_gpg_keys.sh
```

> 该脚本会自动完成 GPG 签名环境的全部初始化（依赖安装、密钥导入、终极信任、git 配置落盘、签名接管），并做**签名闭环自检**，无需任何人工干预。**严禁跳过脚本直接 `git commit`**；未执行脚本或初始化失败却强行提交，视为**违规操作**。

> 说明：脚本位于仓库根目录 `install_gpg_keys.sh`，**自包含、幂等、无人工干预**，可在任意工作目录用 `bash install_gpg_keys.sh` 直接执行。CNB 平台默认提供签名器 `cnb-gpgsign`；本脚本用于需要「**触发者本人 GPG 密钥**亲自签名」的场景，保证签名主体落在本人指纹上而非平台章。若脚本执行失败，**如实上报**并交由用户判断，**严禁**以未初始化的签名环境强行提交。

> 📌 **签名方案约定（已生效，勿再引用旧做法）**：早期曾依赖容器启动期脚本（`entrypoint.sh`）与仓库内的 `scripts/gpg-setup.sh` / `scripts/gpg-verify-lib.sh` / `tests/verify-personal-signature.test.sh` / `docs/GPG-Signature-Closure-Test.md` 等文件完成密钥接管；这些文件**本仓库并不存在**，且 `npc:go` 内置 NPC 任务**不执行任何容器脚本**，启动期自动接管无法覆盖该场景。**现行唯一做法就是提交前手动执行本节脚本**，不要再引用上述已废弃的脚本或文档。

#### 1.5.1 脚本行为与设计要点（`install_gpg_keys.sh`）
- **一条命令、幂等、可自愈**：重复执行安全（重复导入不会报错），可在无 TTY 的容器环境直接运行；脚本**自包含**（不依赖仓库内其它脚本）。
- **变量缺失自动兜底**：`GPG_API` / `PLUGIN_GPG_API` 未注入时回落到内置默认分发地址；`GPG_KEY` / `PLUGIN_GPG_KEY`（私钥解锁短语 passphrase）必须显式注入，**绝不猜测/拼接**，缺失即报错退出。
- **依赖自动安装**：逐项探测 `gpg` / `curl` / `jq`，缺哪个装哪个（幂等）。
- **无 TTY 下走 loopback**：自动写 `pinentry-mode loopback` + `allow-loopback-pinentry` + `no-tty` 配置，并生成 `$GNUPGHOME/gpg-wrapper.sh`（默认 `~/.gnupg/gpg-wrapper.sh`）包装器统一带 passphrase 解锁，权限收紧为 `700`，避免明文口令落在全局可见的 `/tmp`。
- **终极信任**：用 `--with-colons` 非交互方式设置 ownertrust（不依赖交互输入，避免无 TTY 挂起）。
- **精确选键**：在隔离密钥环中提取**本次下载私钥**的主+子完整指纹，避免误取密钥环中历史遗留密钥。
- **平台定向（关键修复）**：分发 API 的 `?key=` 参数**不可靠**（实测被忽略，同一 key 会随机返回不同平台），直接用其返回的 URL 会**装错平台的密钥**。脚本改为从返回 URL 推导平台，并按 `GIT_PLATFORM`（或 `PLUGIN_GIT_PLATFORM`）把 URL 定向改写为期望平台 `<base>/<platform>_{private,public}_key.asc`；未显式指定时采用 API 返回平台并**打印告警**。可用平台：`gitee` / `gitLab` / `coding` / `codeup` / `github` / `cnb` / `mobile_only`。
- **指纹校验（可选）**：设置 `GPG_EXPECT_FINGERPRINT`（或 `PLUGIN_GPG_EXPECT_FINGERPRINT`）后，若导入密钥指纹不匹配则**直接失败**，杜绝「装错钥」静默通过。
- **签名配置落盘优先级**：优先写**仓库级**（`git config --local`，落盘可见、即时生效），再冗余写全局；非 Git 仓库目录时回落到全局。修正旧实现仅写 `--global`、在已存在仓库级配置时不生效的问题。
- **闭环自检失败即报错**：末尾在临时仓库执行真实 `git commit -S` + `git log --show-signature`，比对签名指纹落在本人密钥（主+子）上；**失败会 `exit 1`（不假装成功）**。

#### 1.5.2 提交与推送前的校验（强制）
- 初始化完成后追加判定（用「`git config --get user.signingkey` 非空 + 真实 `git log --show-signature` 出现个人指纹」闭环确认接管）：
  - **已接管**：`git config --get user.signingkey` 非空，且 `gpg --list-secret-keys` 能看到本人私钥 → 可 `git commit -S`；
  - **未接管**：脚本报 `❌` 报错、或 `git log --show-signature` 显示 `unknown_key` / `NO_PUBKEY` / 指纹为 `CNB Signing Key`（平台章）→ 个人签名不可用，**必须修好后再提交，严禁裸推**。
- **推送前主动自检（每次推送前强制执行）**：`git config --get user.signingkey` 非空、`git config --get commit.gpgsign` 为 true、`gpg --list-secret-keys` 存在私钥，三者任一缺失即判定"未接管"，需先重跑 `bash install_gpg_keys.sh` 接管后再推送。
- **签名未通过即禁止 push**：不得推送未签名 / 验签未通过的 commit；须先在本地修正签名环境再重新提交。该要求同样适用于 `docs`/`chore` 等非代码提交。
- 提交后可用 `git log --show-signature`（或平台 verified 状态）确认签名被平台认可。

#### 1.5.3 如实上报（异常时）
- **严禁自行生成 GPG 密钥**：新密钥公钥未登记到平台，会被判定为 `unknown_key`（verified 为 false），等同未签名。
- 若签名异常（`403 "Author is invalid"` / verified 为 false），优先核对 `user.name` / `user.email` 是否与 CNB 账号验证身份一致。
- 脚本执行失败时，**如实汇报**所见的报错行、`curl` 退出码、已执行步骤及结果，交由用户/人工判断。
- 若为变量未注入（脚本报 `未设置私钥解锁短语`）或分发 API 不可达，真实出路是修密钥仓库（如 `key/npc.yml`）的变量注入或排查网络链路，**禁止**在业务代码里打补丁掩盖。

## 2. 编码与代码规范 (Coding Standards)

### 2.1 语言与类型
- 核心代码库使用 **TypeScript** 编写（React 19 + Vite 6，`tsconfig.json` 已开启 `strict`）。
- 组件 Props、函数入参/返回值、数据模型必须提供**显式类型**；提交与推送前必须通过 `pnpm lint`（`tsc --noEmit`）且零错误（见 1.4.1）。
- 禁止为图省事滥用 `any`；能用具体类型、联合类型或 `interface` / `type` 表达的地方必须明确类型（本项目以 `AppPage`、`WikiEntry` 等联合/接口类型为范例）。

### 2.2 命名与注释
- 命名必须具备明确语义：变量/函数用 `camelCase`，React 组件与类型用 `PascalCase`，模块级常量用 `UPPER_SNAKE_CASE`（本项目数据常量如 `WIKI_ENTRIES`、`GRAPH_NODES` 即为此风格）。
- **必须提供中文注释**。特别是在以下场景：
  - 核心逻辑（如路由解析、URL 同步、知识图谱布局计算）。
  - 关键阈值与特殊逻辑（如图片代理白名单 `ALLOWED_HOSTS`、爬虫/抓取边界、防抖与滚动监听阈值）。
  - 正则表达式与复杂的数据派生规则（`src/utils/*Automation.ts`）。

### 2.3 错误处理与日志
- 所有异步调用（`async` / `await`）与可能失败的外部请求必须有妥善的 `try/catch`，避免异常逃逸导致页面白屏或接口 500。
- 服务端（`server.ts`）的 REST API 统一返回 `{ status, code, data, message }` 结构，异常经 `catch` 转为结构化错误响应；前端（`services/`）消费该结构，避免把原始堆栈直接抛给用户。
- 日志使用 `console`（服务端）或前端错误边界，禁止用 `alert` / 静默吞异常；异常须保留上下文（如接口名、参数、`request_id`）便于诊断。

## 3. 工作流与文件操作行为准则 (Workflow Guidelines)

### 3.1 阅读先于修改（禁止盲猜代码）
- 在编辑任何文件之前，**必须先使用专用工具（如 `view_file`、`cat`、`grep` 等）读取文件的真实内容**。
- 严禁凭记忆或通用经验盲猜代码结构。

### 3.2 局部精准修改
- 在修改配置或代码（如调整路由表 `wikiRoutes.ts`、图片代理白名单 `ALLOWED_HOSTS`、默认端口 `PORT`）时，**必须进行局部精准的正则或行号匹配**。
- **绝对禁止全量覆盖**或意外替换无关内容，避免破坏其他已稳定的逻辑。

### 3.3 修改验证与闭环
- 修改代码后，必须通过 `git diff` 检查实际的变更内容是否符合预期。
- 确认没有混入无关修改后，方可进行 `git add` 和 `git commit` 操作。
- 每次完成任务后，必须确保所有修改已成功推送并提交 PR 到远程仓库的主分支（通过 PR 合并）。

### 3.4 主分支推送约束
- **除非用户明确要求直接推送到主分支**（如"推到主分支""直接合并到主分支""直接 push main"等），否则**禁止直接推送到主分支**。
- 所有代码变更一律通过创建 PR 将代码合并到主分支，确保变更可审查、可追溯。

### 3.5 Github 镜像仓库同步 PR（强制性提示词）
- **判定标准：只要 `.cnb.yml` 中存在将代码同步到 Github 的配置，即属于"同步到 Github 镜像仓库"的情况**（常见形式为在 `main: push` 事件下使用 `git-sync` 镜像同步 stage，或 `github-mirror` / `sync-github` / 镜像同步等类似 stage，目标指向 `github.com/...`）。**只要 `.cnb.yml` 里有这类配置，就必须在对应的 Github 镜像仓库创建一模一样的 PR**（同名、同分支、同变更内容）。
- 这是**强制性要求**，不得遗漏，确保 CNB 与 Github 镜像仓库的代码变更保持同步、可追踪。
- 创建 CNB PR 前，先检查本仓库 `.cnb.yml` 是否配置了到 Github 的同步/镜像能力（重点 grep `git-sync` / `github-mirror` / `sync-github` / `github.com` 等关键字）；若存在，则同步在 Github 镜像仓库创建完全一致的 PR。
- 若 `.cnb.yml` 中**没有任何**同步到 Github 的 stage（如仅有 `docker build & push`、知识库更新、代码扫描、NPC 触发等），则该仓库不适用本条双端同步要求，本 PR 只需在 CNB 维护即可。

## 4. 持续集成与部署规范 (CI/CD - .cnb.yml)

### 4.1 配置文件规范
- 本项目使用 CNB (Cloud Native Build) 构建流水线（基于 `.cnb.yml`）。
- 在修改 `.cnb.yml` 时，必须严格遵守 YAML 的缩进规范（通常为 2 个空格）。

### 4.2 环境依赖
- 如果在流水线的某一个 stage 中引入了需要构建或运行容器镜像的操作（如 `docker build`、`docker run`、基于其他镜像执行脚本等），**必须在该事件或作业级别明确声明 `services: - docker`**，否则会导致流水线无法正常挂载 Docker 守护进程。
- 参考示例：
```yaml
.npc: &npc
  - runner:
      cpus: 16
    services:
      - docker
    stages:
      - name: 启动NPC
```

## 5. 特定业务逻辑指导 (Domain Specifics)

### 5.1 路由与页面分发（HTML5 History API）
- 全站路由由 `src/utils/wikiRoutes.ts` 统一定义：`getWikiPath(page, sectionId?)` 生成标准 Wikipedia 路径，`parseWikiPath()` / `parseLocation()` 解析现有 `window.location`，**新增页面必须同时改这两侧**（生成 + 解析），否则出现「能跳转不能识别」。
- 路由基元是 `AppPage` 联合类型，新增页面（如新的 `Special:` 页）须同步扩展该类型、更新 `getWikiPath`，并在 `src/App.tsx` 的页面分发处补上分支。
- 所有跳转一律走 `window.history.pushState`（见 `src/App.tsx`），并监听 `popstate` / `hashchange` 以支持浏览器前进、后退与书签；**禁止**用 `location.href = ...` 做站内跳转（会导致整页刷新，破坏 SPA 体验与锚点滚动）。
- 路径须用 `encodeURIComponent` 编码（中文标题、`Category:`、`Special:`、`Wikipedia:` 命名空间前缀均含非 ASCII 字符）。

### 5.2 内容与数据模型（`src/data/`）
- 站点内容全部为**结构化 TypeScript 常量**，与视图分离，**禁止**把长文案硬编码进组件 JSX：
  - `articleData.ts` — 典范条目「卫生棉条」的章节大纲、吸水量表与参考文献（约 15 篇）。
  - `wikiEntriesData.ts` — 词条库（约 49 个词条），供内链预览与词条页使用。
  - `knowledgeGraphData.ts` — 知识图谱节点 `GRAPH_NODES` 与边 `GRAPH_EDGES`（约 60 个节点）。
  - `categoryData.ts` / `tagsData.ts` / `policyData.ts` — 分类、标签、三大方针结构化数据。
- 新增词条 / 节点 / 标签时，**优先改数据文件**，而不是在组件里写死；跨文件的引用关系（内链、图谱边、标签归属）需保持一致，避免出现红链或悬空边。

### 5.3 自动化派生模块（`src/utils/*Automation.ts`）
- 本项目的统计、SEO、图谱拓扑、页头指标等均为**从数据自动派生**，非人工填写：
  - `contentStatisticsAutomation.ts` — 全站 / 逐篇内容统计的派生引擎。
  - `seoAutomation.ts` — 动态写入 `<title>` / `meta description` / OpenGraph / Twitter Card / Canonical / Schema.org JSON-LD。
  - `graphTopologyAutomation.ts` — 图谱节点度、密度、中心节点等拓扑指标。
  - `headerAutomation.ts` — 阅读时长、字数等页头指标。
- 修改规则时务必保持「数据源 → 派生 → 展示」单向链路，**不要在组件里重复实现派生逻辑**；派生结果应可被服务端 API（见 5.4）与前端共用。

### 5.4 服务端 API（`server.ts`）
- 本地开发与生产均由 `server.ts`（Express 5 + Vite 中间件）承载，PORT 默认 `3000`（`process.env.PORT` 可覆盖）。
- 已提供内容统计 REST API：`/api/statistics/global`、`/api/statistics/articles`、`/api/statistics/tampon`、`/api/statistics/entries`、`/api/statistics/graph` 等，统一返回 `{ status, code, data, source, calculatedAt, computationLatencyMs }` 结构；新增接口须沿用该响应约定。
- **图片代理安全红线**：`server.ts` 内置 `ALLOWED_HOSTS` 白名单（`upload.wikimedia.org`、`commons.wikimedia.org`、`en.wikipedia.org`、`zh.wikipedia.org`）。任何新增的代理 / 抓取逻辑**必须**沿用白名单校验，**严禁**放开为任意域名（防开放重定向 / SSRF）。

### 5.5 交互复刻约定（Vector 2022）
- 组件命名与职责对齐维基百科原生交互：`WikipediaHeader`（主导航 + 搜索 + 外观入口）、`WikipediaSubheader`（标题带）、`TableOfContents`（侧边目录 + scrollspy）、`WikiLinkPreview`（内链悬浮卡片）、`ReferencePreview`（文献悬浮卡片）、`WikipediaMediaViewer`（大图灯箱）、`AppearanceModal`（字号 / 主题 / 版心宽度）。
- 外观状态（`fontSize` / 深色模式 / `contentWidth`）在 `App.tsx` 统一管理并向下传递；**新增外观项须同时接入 `AppearanceModal` 与全局状态**，不要各自为政。
- 内容与文案遵循 **CC BY-SA 4.0**；医学内容仅为科普，页面需保留免责声明提示，禁止削弱或移除既有的免责 / 隐私 / 行为准则入口。

## 6. CNB OpenAPI 操作规范 (CNB OpenAPI Operations)

- **使用 curl 调用 API**：在执行任何与 CNB (Cloud Native Build) 相关的操作时，通过 shell 执行 curl 命令直接调用 CNB OpenAPI。
- **从 swagger.json 获取 API 信息**：调用接口前，先从 https://api.cnb.cool/swagger.json 获取最新 API 定义（含接口路径、请求方法、请求参数与鉴权要求），确保参数结构准确后再用 curl 执行。
- **强制查看帮助文档**：在调用 API 之前，请通过 OpenAPI 文档确认参数结构。

## 7. 运行时预装能力（按需使用）

- 本仓库 NPC 运行时镜像已**预装 Playwright 及 Google 浏览器内核（chromium）**，浏览器二进制位于 `PLAYWRIGHT_BROWSERS_PATH=/ms-playwright`，chromium 的系统依赖、CJK 中文字体（`fonts-noto-cjk`）与 fontconfig 均已装好，无头渲染中文页面不会出现"豆腐块"乱码。
- Agent 在**需要时**（浏览器自动化 / 网页抓取 / 前端页面截图等场景）可按需调用，无需额外安装或联网下载浏览器内核。
- **推荐：优先用现成的浏览器自动化便捷脚本** `/app/scripts/browser-automation.js`，无需手写样板代码：
  ```bash
  node /app/scripts/browser-automation.js title <url>                          # 页面标题（连通性自检）
  node /app/scripts/browser-automation.js text  <url> [--selector sel]         # 页面可见文本
  node /app/scripts/browser-automation.js html  <url> [--selector sel]         # 页面 HTML
  node /app/scripts/browser-automation.js shot  <url> /tmp/shot.png            # 整页截图
  node /app/scripts/browser-automation.js eval  <url> 'document.title'         # 页面内求值 JS 表达式
  ```
  脚本已内置 root 沙箱关闭参数、等待渲染缓冲与中文乱码规避等处理，详见脚本头注释。
- 若需在自研脚本中直接调用 Playwright API，请注意以下约定：
  - playwright 为**全局安装**，非项目依赖。任意路径的裸脚本里 `require('playwright')` 会因不在默认模块解析路径而失败，需先补全局搜索路径：
    ```js
    // 在 require('playwright') 之前执行
    if (!process.env.NODE_PATH) {
      const { execSync } = require('child_process');
      process.env.NODE_PATH = execSync('npm root -g', { encoding: 'utf8' }).trim();
      require('module')._initPaths(); // 让 NODE_PATH 立即生效
    }
    ```
    或在命令行加 `NODE_PATH="$(npm root -g)" node 你的脚本.js`。
  - 仅 Google 的 chromium 内核已预装并完成启动冒烟自检，以**无头（headless）**模式运行为主，运行时为 root，启动必须关闭沙箱与 /dev/shm，推荐统一传入（已在构建期冒烟自检验证）：
    ```js
    const { chromium } = require('playwright');
    const browser = await chromium.launch({
      chromiumSandbox: false,
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
    ```
  - 请勿重复执行 `playwright install`，以免浪费下载与磁盘。

- **已预装 CodeQL CLI**（GitHub 官方静态代码安全扫描引擎，`/opt/codeql`），覆盖 JS/TS、Python、Java/Kotlin、C/C++、Go 等主流语言的语义级安全漏洞扫描。用法：
  ```bash
  # 构建 codeql 数据库并执行默认安全扫描（以 Python 为例）
  codeql database create /tmp/codeql-db --language=python --source-root=<项目路径>
  codeql database analyze /tmp/codeql-db python-code-scanning.qls --format=sarif-latest --output=results.sarif
  ```
  默认支持全部 codeql 标准查询包，无需额外下载。

## 9. 阿里云百炼记忆库（长期记忆）(Bailian Memory)

SuperNPC 通过 `scripts/bailian-memory.py` 接入**阿里云百炼记忆库 API**，为 NPC / Agent 提供跨会话的长期记忆能力：把对话或结论写入记忆库，后续会话再按语义检索召回，避免「每次任务都从零开始」。

- 官方文档：<https://docs.agent.bailian.aliyun.com/zh/api/memory/fragments/add-memory>（同组还有「搜索 / 列出 / 更新 / 删除记忆」与「用户画像」接口）。

### 9.1 记忆库使用引导（第一次接触请从这里开始）【必读】

> 本节是**入口**，面向「刚知道有记忆库、想用起来」的读者，回答三个问题：**它是什么 · 何时生效 · 我能怎么管**。
> 读完后按顺序往下看：`9.2 使用时机`（该不该调）→ `9.3 接口约定`（调什么）→ `9.6 快速开始`（怎么跑通）。

#### 一、一句话说清它是什么

**记忆库 = 一个按「人」归口、本组织所有仓库共用的语义知识池。**

- Agent 每完成一次任务，可以把「跨仓库可复用的结论」写进去（`add`）；
- 下次在**任意仓库**接到相关任务，可以先按语义检索召回（`search`），复用历史结论，**不必重新踩坑、不必重复问用户**。
- 它不是聊天记录、不是日志仓库、也不是代码仓库——**只存结论性知识**（平台约定 / 排查经验 / 用户长期偏好 / 业务规则）。

由此推出两条与「用哪个仓库」无关的设计（细节见 9.5）：

- **库只有一份**：所有仓库共用同一个 `memory_library_id`，无需每个仓库单独配置；
- **人只有一个键**：`user_id` 就是**触发者登录名**本身（如 `qixiaoxin`），不拼组织、不拼仓库 → 同一个人在本组织所有仓库写入的记忆，**用同一个 user-id 就能全部检索到**。

#### 二、触发链路：记忆库什么时候真的被用上

```text
用户在 Issue / PR 评论里 @NPC 派发任务
        ↓
CNB 平台拉起 NPC 容器（npc:go）并注入环境变量
        ↓
NPC 读取 AGENTS.md 第 9 章（本章）决定「要不要用记忆库」
        ↓
命中 9.2 的触发场景 → 任务开始先 search；产出可复用结论 → 任务收尾 add
        ↓
调用 scripts/bailian-memory.py（唯一入口）写入 / 检索同一个记忆库
```

- **无需手动开启**：只要密钥仓库注入了 `DASHSCOPE_API_KEY`，NPC 在需要时**自行判断**是否读写；未注入时脚本会**快速失败并跳过**记忆环节，任务照常完成（不阻断主流程）。
- **不由用户逐次指定**：是否 search / add 由 Agent 依据 9.2 的场景表自行决定，用户无法也不需要在指令里写「请使用记忆库」。
- **用户可以使用的四个开关**（都可选，按优先级从高到低）：

  | 想做的事 | 做法 | 生效范围 |
  | --- | --- | --- |
  | 强制统一到某个实体 | 密钥仓库注入 `MEMORY_USER_ID`（如 `qixiaoxin`） | 该密钥仓库覆盖的所有仓库 |
  | 临时指定某次调用的实体 | 调脚本时显式传 `--user-id` | 仅本次调用 |
  | 切到另一个记忆库 | `MEMORY_LIBRARY_ID` 或 `--memory-library-id` | 注入范围 / 本次调用 |
  | 关闭仓库溯源元数据 | `MEMORY_AUTO_META_DATA=0` | 注入范围 |

- **模型不属于记忆库**：记忆库调用与「NPC 用哪个大模型」是两件事。模型由 `.cnb.yml` 的 NPC 配置与密钥仓库变量（如 `PLUGIN_AI_MODEL`）决定，**不是**记忆库的配置项——排查记忆问题时不要往模型上找原因。

#### 三、一条记忆的完整生命周期

```text
① 产生  任务收尾，Agent 判断「这条结论跨仓库可复用」→ add（≤ 512 字符，讲清「结论 + 适用场景」）
② 召回  后续任一仓库的 Agent 任务开始时 search（语义匹配，相似度阈值默认 0.6）→ 命中即作为先验复用
③ 纠偏  结论过时/不准确 → 先 search 拿到 memory_node_id，再 update 改写（不要重复 add）
④ 退役  结论彻底失效 → delete（不可恢复，删前必须用 search / list 确认 node_id 正确）
```

- 第 ① 步是**唯一入口**：内容质量决定后续召回质量，所以「写成一句可复用的结论」比「写得多」更重要。
- 第 ③ 步是**纪律**：同一结论重复 `add` 会产生多个近似片段，**污染召回结果**（召回时互相挤占名额），必须用 `update`。

#### 四、用户能做的四件事（人话版）

| 我想… | 怎么做 | 去哪里看结果 |
| --- | --- | --- |
| 知道记忆库到底存了什么 | 让 NPC「列出我的记忆」（它会用同一 user-id 调 `list`） | NPC 评论里的 `[memory] 本页 N 条记忆` + 逐条内容 |
| 手动写入一条结论 | 让 NPC「记住：<结论>」，或直接在容器 / 本地跑 `scripts/bailian-memory.py add --content "…"` | `[memory] 写入成功，变更片段 1 条` |
| 验证某条结论是否已入库 | 让 NPC「检索记忆：<关键词>」 | `[memory] 命中 N 条记忆`（命中 0 条属正常，说明还没沉淀过） |
| 检查接线是否正常 | 跑只读自检：`bash tests/bailian-memory-guide.test.sh`（不发真实请求、不需要 API Key） | 末行 `通过: N  失败: 0`（当前为 8 项） |

> ⚠️ 手动 `delete` 前务必先检索确认 `memory_node_id`：**删除不可恢复**，误删只能重新写入。

#### 五、常见误解澄清（先看这几条，少走弯路）

| 误解 | 事实 |
| --- | --- |
| 「每个仓库要单独配一套记忆库」 | **不用**。库与实体都跨仓库共享（见 9.5），零配置即可跨仓库召回 |
| 「记忆是按仓库隔离的，A 仓库看不到 B 仓库」 | **不是**。`user_id` 与仓库无关，A 仓库写入的结论在 B 仓库可直接召回；仓库信息只作 `meta_data` 溯源 |
| 「要把整段对话原样丢进去才记得住」 | **不需要**，只写提炼后的结论；整段对话灌入会稀释检索质量，`--content` 上限 512 字符 |
| 「记忆库坏了任务就该失败」 | **不会**。记忆是增强能力，调用失败只告警、继续完成任务（见 9.10 使用纪律） |
| 「没注入 Key 就是坏了」 | **不是**。未注入 `DASHSCOPE_API_KEY` 时脚本按设计**快速失败并跳过**，属预期行为（见 9.8 常见报错与排错） |

#### 六、概念速查表（后文高频术语）

| 术语 | 含义 | 对应参数 / 变量 |
| --- | --- | --- |
| 记忆库 | 记忆的隔离边界，本组织所有仓库共用一份 | `memory_library_id` / `MEMORY_LIBRARY_ID` |
| 记忆实体 | 记忆的归属人（**本组织内一个人一个键**） | `user_id` / `MEMORY_USER_ID` |
| 记忆片段 | 一条被存下来的结论（可增删改查） | 响应里的 `memory_nodes[]` |
| 记忆节点 ID | 单条片段的唯一标识，`update` / `delete` 必须用它 | `memory_node_id` / `--node-id` |
| 画像模板 | 可选能力，指定后额外提取用户画像（不传则只存片段） | `profile_schema` / `MEMORY_PROFILE_SCHEMA` |
| 溯源元数据 | 自动附加的来源仓库等信息，**不参与主键** | `meta_data`（`repo_slug` 等） |

### 9.2 使用时机（何时读、何时写、何时不用）【强制必读】

> 本节回答「**Agent 什么时候该用这个记忆库**」。没有这一节，后面 9.6~9.9 只是「怎么调、怎么排错」，Agent 不知道「该不该调」。

**总原则：记忆库是「增强能力」而非「必经环节」——只在「本次任务能从中获益 / 能留下可复用结论」时读写，其余情况一律不用。**

#### 一、开始任务前：先 `search` 召回（读）

**满足以下任一条件时，应先在任务开始阶段 `search` 一次**（`--query` 用任务关键词或用户原话）：

| 触发场景 | 说明 | 示例 query |
| --- | --- | --- |
| 任务涉及**本组织平台约定 / 规范** | 流水线模板、密钥仓库注入、GPG 签名链路、目录结构等组织级约定 | `镜像构建复用模板怎么用` |
| 疑似**踩过的坑 / 历史排查经验** | 报错、构建失败、鉴权 403、网络偶发 EOF 等 | `GPG 签名 unknown_key 怎么办` |
| 用户提到**「上次 / 之前 / 老规矩 / 照旧」** | 用户显式指向历史结论 | `上次说这个字段怎么处理` |
| 用户提出**个人偏好 / 长期约定** | 编码风格、工具选型、提醒事项等 | `我的编码风格偏好` |
| **长任务 / 多轮任务**的后续轮次 | 上一轮结论已入库，本轮需接着干 | `这个 PR 之前的结论` |

- 召回命中（`similarity_threshold` 建议 0.5~0.7）后，**优先复用历史结论**，避免重复踩坑 / 重复问用户。
- 召回为空属**正常结果**，不必重试、不必报错，按常规流程继续即可（长期记忆本就该「没有就返回空」）。

#### 二、任务结束时：再 `add` 沉淀（写）

**仅当产出「跨仓库可复用」的结论性知识时，才在任务收尾 `add` 写入**，典型是这四类：

| 可写入（推荐） | 反例（禁止写入） |
| --- | --- |
| 组织级**平台约定 / 规范**（如 `docker.yml` 复用模板） | 逐次任务流水、命令执行日志 |
| **排查经验 / 踩坑结论**（含错误码与解法） | 本次 PR 的临时上下文、一次性 diff |
| 用户**明确表达的长期偏好** | 未脱敏的 Token / 密钥 / 隐私 / 内部链接 |
| 可复用的**业务规则 / 字段口径** | 只在单个仓库成立的临时信息（应放 `meta_data`） |

- 一次只写**一条结论**（`--content` 控制在 512 字符内，讲清「结论 + 适用场景」），不要把整段对话原样灌入。
- 同一结论若**已存在**（`search` 已召回）→ 用 `update` 补充，**不要**重复 `add` 制造重复片段。
- 结论**已失效 / 被推翻** → 用 `update` 修正或 `delete` 删除，别留着污染后续召回（`delete` 不可恢复，先确认 `memory_node_id`）。
- 用户未授权时不要擅自把用户隐私偏好入库；不确定某条是否「可公开复用」，**宁可不写**。

#### 三、什么情况**不要用**记忆库

- **纯一次性任务**：单次问答、改个错别字、看一眼状态——读写都是噪音。
- **答案只依赖本次上下文 / 代码本身**：直接读代码 / 看日志更快，不要绕道记忆库。
- **鉴权缺失**（`DASHSCOPE_API_KEY` 未注入）：**跳过**记忆环节，按 9.10「失败不阻断主流程」继续完成任务，**不要**反复重试或中断任务。
- **涉及敏感信息**：脱敏后仍无法安全复用的，直接不写。
- **仓库特有的临时信息**：不该进共享记忆线（会污染其它仓库检索），需要时放 `meta_data`。

#### 四、标准动作顺序（一句话流程）

```text
任务开始 → 判断「是否需要历史结论？」→ 是 → search 召回 → 复用/纠偏
任务收尾 → 判断「是否产出可复用结论？」→ 是 → 已存在则 update，否则 add
任一记忆调用失败 → 告警 + 继续任务（绝不阻断主流程）
```

> 若本次任务**既不 search 也不 add**，属正常情况（大多数一次性任务如此），无需在评论里解释原因。

### 9.3 接口约定（以官方文档为准，勿凭记忆臆测）

- **服务地址**：`https://dashscope.aliyuncs.com/api/v2/apps/memory`
- **鉴权**：请求头 `Authorization: Bearer $DASHSCOPE_API_KEY`。该 Key 为**账号级凭证**，**严禁**写入代码仓库 / 日志 / 评论，只能通过密钥仓库导入环境变量。
- **协议**：仅 HTTPS；请求体与响应体均为 JSON（UTF-8）。
- **方法约定**：写入 / 检索用 `POST`，列表查询用 `GET`，更新用 `PATCH`，删除用 `DELETE`。
- **记忆片段接口一览**：

  | 能力 | 方法 | 路径 |
  | --- | --- | --- |
  | 添加记忆 | POST | `/add` |
  | 搜索记忆 | POST | `/memory_nodes/search` |
  | 列出记忆 | GET | `/memory_nodes` |
  | 更新记忆 | PATCH | `/memory_nodes/{memory_node_id}` |
  | 删除记忆 | DELETE | `/memory_nodes/{memory_node_id}` |

- **添加记忆关键参数**：`user_id`（记忆实体 ID，最大 64 字符；**省略时自动推导为触发者登录名，如 `qixiaoxin`**，见 9.5）；`messages`（数组，最多 50 条，每项含 `role`=user/assistant 与 `content`）与 `custom_content`（字符串，最大 512 字符）**二者互斥**，填 `custom_content` 后会**忽略** `messages`；`profile_schema` 不传则**仅写记忆片段、不提取用户画像**；`memory_library_id` **已默认写死为 `22fcd3f37eee42d6ac99cf25d03ac6c3`**（见下），`project_id` 不传则使用默认规则。
- **搜索记忆关键参数**：`query`（必填）、`max_results`（1~100）、`rewrite` / `rerank`（默认建议开启）、`similarity_threshold`（0.0~1.0，建议 0.5~0.7）、`plan_version`（`Pro` / `Lite`，默认 Pro）。
- **响应字段**：成功响应统一含 `request_id` 与 `memory_nodes[]`；`memory_nodes[].event` 为操作类型 `ADD / UPDATE / DELETE`，`old_content` 仅在 `event` 为 `UPDATE` 时有效。
- **错误码与重试**：`4xx`（限流除外）为参数 / 鉴权问题，**快速失败不重试**；`429 限流`与 `5xx` 采用 **1s / 2s / 4s 指数退避，最多 3 次**；错误响应结构为 `{code, message, request_id}`，排错务必带上 `request_id`。

### 9.4 环境变量（全部经密钥仓库注入，禁止硬编码）

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `DASHSCOPE_API_KEY` | 是 | 百炼 API Key；缺失时脚本直接报错退出（**不裸调**） |
| `MEMORY_USER_ID` | 否 | 记忆实体 ID；显式注入时**优先级最高**，可强制统一到指定实体 |
| `MEMORY_AUTO_META_DATA` | 否 | 是否自动注入仓库溯源元数据（默认 `1`；置 `0` 关闭） |
| `CNB_BUILD_USER` / `CNB_COMMITTER` | 否 | 触发用户（登录名），**默认 `user_id` 即取其值**（如 `qixiaoxin`），不带组织/仓库前缀 |
| `CNB_BUILD_USER_EMAIL` / `CNB_COMMITTER_EMAIL` | 否 | 触发用户邮箱；无登录名时取其 local-part 兜底（同一人多来源归一化到同一实体） |
| `CNB_ROOT_SLUG` / `CNB_GROUP_SLUG` | 否 | 根组织 slug，**仅**用于无人上下文（定时任务）回落组织级实体与元数据，**不参与** `user_id` 主键 |
| `MEMORY_LIBRARY_ID` | 否 | 记忆库 ID，**默认已写死为 `22fcd3f37eee42d6ac99cf25d03ac6c3`**，显式注入可覆盖 |
| `MEMORY_PROJECT_ID` | 否 | 记忆片段规则 ID，不传使用默认规则 |
| `MEMORY_PROFILE_SCHEMA` | 否 | 画像模板 ID，不传则不提取用户画像 |
| `MEMORY_API_BASE_URL` | 否 | 覆盖服务地址（仅测试 / 私有网关场景使用） |
| `MEMORY_REQUEST_TIMEOUT` | 否 | 单次请求超时秒数（默认 30） |
| `MEMORY_MAX_RETRIES` | 否 | 429 / 5xx 最大重试次数（默认 3） |

### 9.5 记忆共享策略（本组织所有仓库、同一个人共用一条记忆线）【强制】

**核心诉求**：**同一个人**在本组织下的**所有仓库**，长期记忆写入**同一个记忆库、同一个记忆实体**，实现「A 仓库踩过的坑，B 仓库能直接召回」，且检索时**只需记住自己的登录名**。

- **库（`memory_library_id`）是隔离边界**，已写死为 `22fcd3f37eee42d6ac99cf25d03ac6c3`，所有仓库共用。
- **实体（`user_id`）统一为触发者登录名本身**（如 `qixiaoxin`），**不内嵌组织、不内嵌仓库**，默认按下列优先级推导（见脚本 `default_user_id()`）：

  | 优先级 | 取值来源 | 结果示例 | 说明 |
  | --- | --- | --- | --- |
  | 1 | `--user-id` 显式传参 | `team_shared` | 最高优先级 |
  | 2 | `MEMORY_USER_ID` 环境变量 | `qixiaoxin` | 密钥仓库可强制统一 |
  | 3 | **触发者登录名（默认）** | `qixiaoxin` | **推荐**：与组织 / 仓库上下文**完全无关**，同一人在所有仓库、所有根组织解析结果完全一致 |
  | 4 | `usr_<根组织>` | `usr_XMZZUZHI` | **仅**无人上下文（如定时任务）时回落，避免无人任务污染某个人的记忆线 |

  第 3 级的登录名取值链（同一人在不同仓库可能只注入其中某一个，故需多级互为回退）：

  | 子优先级 | 取值来源 | 说明 |
  | --- | --- | --- |
  | 3.1 | `CNB_BUILD_USER` | 登录名，最稳定 |
  | 3.2 | `CNB_COMMITTER` | 可能是昵称/全名，统一小写归一化后仍可用 |
  | 3.3 | `CNB_BUILD_USER_EMAIL` → `CNB_COMMITTER_EMAIL` 的 local-part | 兜底；邮箱取 `@` 前、并剥离 `+` 别名 |

- **本条是强制纪律**：
  1. **禁止**把 `repo_slug`（仓库路径）当作 `user_id`——按仓库切分会让记忆碎片化，同组织其它仓库检索不到，违背长期记忆初衷；
  2. **禁止**把组织上下文（`CNB_ROOT_SLUG` / `CNB_GROUP_SLUG`）拼进 `user_id`——**同一人就该是同一个键**（如 `qixiaoxin`），拼组织会让同一人在不同根组织被拆成多个实体，检索时必须先知道组织名，违背「一个 user-id 贯穿」的诉求；
  3. **同一人必须命中同一 `user_id`**：不要依赖「本次运行恰好注入了哪些用户变量」——脚本已对登录名/昵称/邮箱做归一化，保证同一个人在**所有仓库、所有组织**解析出同一个登录名；
  4. 确需租户级隔离时，**换记忆库**（`memory_library_id`）而**不是**改 `user_id`；
  5. 仓库维度只作为**元数据**保留：`add` 时脚本自动把 `repo_slug` / `repo_scope` / `user_identity` 合并进 `meta_data`（可用 `--meta-data` 覆盖，或用 `MEMORY_AUTO_META_DATA=0` 关闭），既能跨仓库召回，又能追溯记忆来源与归属人；
  6. 只有确实需要「项目独立记忆」时才显式传 `--user-id`，并需在 PR 中说明原因。

- **跨仓库召回示例**：在 `XMZZUZHI/SuperNPC` 写入的结论，可在本组织其它仓库（乃至其它组织下）用**同一个登录名**检索到：

  ```bash
  # 仓库 A（XMZZUZHI/SuperNPC）由 qixiaoxin 写入
  # → 实体自动推导为 qixiaoxin（无需传 --user-id）
  python3 scripts/bailian-memory.py add --content "本组织镜像构建统一走 docker.yml 复用模板"

  # 仓库 B（任何其它仓库，同一人 qixiaoxin）检索
  # → 实体同样为 qixiaoxin，无需任何额外配置即可召回上述结论
  python3 scripts/bailian-memory.py search --query "镜像构建复用模板怎么用？"

  # 如需显式确认检索实体，看日志里的 user_id（或 add 时 meta_data.user_identity）
  ```

- **同一人统一检索示例**（同一个 `user-id` 贯穿所有仓库）：

  ```bash
  # 无论从哪个仓库调用，同一人的 user_id 恒为登录名本身
  python3 scripts/bailian-memory.py list   # user_id=qixiaoxin
  ```

- **定时任务 / 无用户上下文**（如 `crontab`）场景下拿不到任何用户标识，会回落到组织级实体 `usr_<根组织>`，与人工触发时的「人」实体**不是同一个**（这是刻意设计：避免无人任务污染某个人的记忆线）；如需完全统一，请在密钥仓库注入 `MEMORY_USER_ID`（如 `qixiaoxin`）。

### 9.6 快速开始（5 分钟跑通）

> 本节面向**第一次用**的读者：先跑通「写入 → 召回」两条命令，确认接线正常，再去看 9.7 的完整参数。

#### 一、前置条件（缺一不可）

| 条件 | 检查方式 | 不满足时怎么办 |
| --- | --- | --- |
| 已注入 `DASHSCOPE_API_KEY` | `[ -n "$DASHSCOPE_API_KEY" ] && echo 已注入` | 到**密钥仓库**（如 `key/npc.yml`）注入后重跑，**不要**写死进代码 / `.cnb.yml` |
| 环境有 `python3`（≥ 3.8） | `python3 --version` | 镜像已预装（实测 3.11 系）；缺失时先补装再调用 |
| 处于仓库根目录（脚本相对路径正确） | `ls scripts/bailian-memory.py` | 用绝对路径调用，或先 `cd` 到仓库根 |
| 已知触发者登录名（用于确认写入哪个实体） | `echo "$CNB_BUILD_USER"` | 为空时脚本会按 9.5 优先级继续推导，无需手工传 `--user-id` |

#### 二、三步跑通

```bash
# 第 1 步：写入一条可复用结论（不传 --user-id，自动落到触发者登录名）
python3 scripts/bailian-memory.py add --content "本组织镜像构建统一走 docker.yml 复用模板"
# 期望输出：
#   [memory] 写入记忆: user_id=qixiaoxin
#   [memory] 写入成功，变更片段 1 条
#   [memory]   [ADD] node_xxx 本组织镜像构建统一走 docker.yml 复用模板

# 第 2 步：语义召回（同一登录名，换任意仓库都行）
python3 scripts/bailian-memory.py search --query "镜像构建复用模板怎么用"
# 期望输出：
#   [memory] 检索记忆: user_id=qixiaoxin query='镜像构建复用模板怎么用'
#   [memory] 命中 1 条记忆
#   [memory]   node_xxx 本组织镜像构建统一走 docker.yml 复用模板

# 第 3 步：确认落到了预期实体（看 user_id 是否为本人登录名）
python3 scripts/bailian-memory.py list --page-size 5
# 期望输出：
#   [memory] 列出记忆: user_id=qixiaoxin page_num=1
#   [memory] 本页 1 条记忆
```

#### 三、接线自检（一句话判定）

- 三步都打印 `[memory] ...` 且**退出码为 0** ⇒ 接线正常，可投入使用。
- 第 1 步报 `未注入 DASHSCOPE_API_KEY` ⇒ 属**预期快速失败**（不裸调），到密钥仓库注入后重试即可，**不要**反复重试或中断任务（见 9.2 三、9.10）。
- 日志里 `user_id=` 不是本人登录名 ⇒ 先看 9.5 的推导优先级，再用 `--user-id` 或 `MEMORY_USER_ID`（最高优先级）显式指定。

#### 四、Agent 自检（不依赖 API Key，可随时跑）

```bash
bash tests/bailian-memory-guide.test.sh
# 期望末行：通过: 8  失败: 0
```

- 覆盖三件事：**必要条件**（python3 / 脚本就位）、**默认实体推导**（同一人跨仓库为同一个 `user-id`）、**鉴权缺失快速失败**。
- 该脚本**只读、不发真实请求**，因此可以在任何环境下安全执行；接口契约级的回归仍以 `tests/bailian-memory.test.sh` 为准（见 9.7 五）。

### 9.7 用法与参数速查（优先复用脚本，勿手写 curl 样板）

脚本为**零依赖**（仅标准库），签名与参数校验已内置，直接调用即可。

> 提示：`--user-id` **一般无需手写**，省略时会自动推导为**触发者登录名**（如 `qixiaoxin`，同一个人在所有仓库共用同一 user-id，详见 9.5）。下方示例中的 `--user-id user_001` 仅为展示显式传参写法。

#### 一、子命令与参数总览

| 子命令 | 作用 | 必填参数 | 可选参数 |
| --- | --- | --- | --- |
| `add` | 添加记忆 | `--message ROLE:CONTENT`（可重复）或 `--content`（二者**互斥**） | `--user-id`、`--profile-schema`、`--project-id`、`--memory-library-id`、`--meta-data` |
| `search` | 语义检索 | `--query` | `--user-id`、`--max-results`（1~100，默认 10）、`--rewrite`（默认 true）、`--rerank`（默认 true）、`--similarity-threshold`（0.0~1.0，默认 0.6）、`--plan-version`（`Pro`/`Lite`，**大小写敏感**，默认 Pro）、`--memory-library-id` |
| `list` | 分页列出 | 无 | `--user-id`、`--page-size`（默认 10）、`--page-num`（默认 1）、`--memory-library-id` |
| `update` | 更新片段内容 | `--node-id` | `--user-id`、`--content` |
| `delete` | 删除片段（不可恢复） | `--node-id` | `--user-id` |
| 全局 | — | — | `--json`（额外输出完整 JSON 响应）、`-h` |

参数与脚本 `build_parser()` **逐项对齐**，改动能以 `python3 scripts/bailian-memory.py <子命令> --help` 为准。

> 取值细节：`--rewrite` / `--rerank` 为布尔参数，接受 `true/false`、`1/0`、`yes/no`（**大小写不敏感**）；`--plan-version` 仅接受 `Pro` / `Lite`（**大小写敏感**）。

#### 二、常用命令示例

```bash
# 添加记忆：对话形式（最多 50 条消息，role 仅支持 user / assistant）
python3 scripts/bailian-memory.py add --user-id user_001 \
  --message user:"每天上午9点提醒我喝水" --message assistant:"好的，已记录"

# 添加记忆：自定义内容形式（与 --message 互斥，max 512 字符）
python3 scripts/bailian-memory.py add --user-id user_001 --content "用户偏好用 pnpm 管理依赖、提交信息用中文"

# 搜索记忆：语义检索（默认开启改写与重排，相似度阈值 0.6）
python3 scripts/bailian-memory.py search --user-id user_001 --query "我需要做什么？" --max-results 10

# 列出记忆：分页查看
python3 scripts/bailian-memory.py list --user-id user_001 --page-size 10 --page-num 1

# 更新 / 删除记忆：需先拿到 memory_node_id
python3 scripts/bailian-memory.py update --user-id user_001 --node-id NODE_ID --content "还要提醒我10点吃药"
python3 scripts/bailian-memory.py delete --user-id user_001 --node-id NODE_ID

# 需要完整响应体时追加 --json（便于解析 memory_node_id）
python3 scripts/bailian-memory.py --json search --user-id user_001 --query "我的偏好？"
```

#### 三、输出格式（敲完能看到什么）

- **默认**：只打印人类可读摘要，行首统一带 `[memory]` 前缀，便于在日志里过滤。
  - `add` → `[memory] 写入记忆: user_id=...` / `[memory] 写入成功，变更片段 N 条` / 逐条 `[memory]   [ADD] <memory_node_id> <content>`（`event` 取值为 `ADD`/`UPDATE`/`DELETE`）。
  - `search` → `[memory] 检索记忆: ...` / `[memory] 命中 N 条记忆` / 逐条 `<memory_node_id> <content>`。
  - `list` → `[memory] 列出记忆: ...` / `[memory] 本页 N 条记忆` / 逐条 `<memory_node_id> <content>`。
  - `update` / `delete` → 打印 `更新成功` / `删除成功`。
- **`--json`**：在上述摘要后追加完整 JSON（`ensure_ascii=False`，中文不转义），形如：

  ```json
  {
    "request_id": "req-xxx",
    "memory_nodes": [
      { "memory_node_id": "node_xxx", "content": "…", "event": "ADD" }
    ]
  }
  ```

- **怎么拿 `memory_node_id` 做后续 update/delete**：`add` / `search` / `list` 的默认摘要里**每行第二列**就是它；需要结构化解析时用 `--json` 取 `memory_nodes[].memory_node_id`。

#### 四、端到端闭环示例（写 → 查 → 改 → 删）

```bash
# ① 写入
python3 scripts/bailian-memory.py add --content "GPG 签名 unknown_key 需把公钥登记到平台"
# ② 召回（拿到 memory_node_id，假设为 node_abc）
python3 scripts/bailian-memory.py search --query "GPG unknown_key 怎么处理"
# ③ 内容纠偏（用 ② 拿到的 node_abc）
python3 scripts/bailian-memory.py update --node-id node_abc --content "GPG 签名 unknown_key：需重新登记公钥后再提交"
# ④ 结论失效时删除（不可恢复，删前先 search 确认 node_id）
python3 scripts/bailian-memory.py delete --node-id node_abc
```

#### 五、取值回落与退出码

- **退出码**：`0` 成功；`1` 调用失败（鉴权缺失 / 网络异常 / 业务错误）；`2` 参数错误（含超长、互斥、缺必填校验）。
- `--user-id` 省略时回落到 `MEMORY_USER_ID` → **触发者登录名**（`CNB_BUILD_USER`/`CNB_COMMITTER`，如 `qixiaoxin`）→ 无人上下文才用 `usr_<根组织>`；`--project-id` / `--profile-schema` 同理回落到对应环境变量。**默认即跨仓库共享**，无需每个仓库单独配置。
- **记忆库 ID 已写死**：脚本内置 `DEFAULT_MEMORY_LIBRARY_ID = "22fcd3f37eee42d6ac99cf25d03ac6c3"`，所有接口默认携带该记忆库，**无需每次传参**；仅需临时切库时用 `--memory-library-id` 或 `MEMORY_LIBRARY_ID` 显式覆盖（显式优先级最高）。
- **`meta_data` 自动注入**：`add` 时脚本自动把仓库溯源信息合并进 `meta_data`（仅在能取到对应环境变量时注入）：

  | 键 | 含义 | 取值来源 |
  | --- | --- | --- |
  | `repo_slug` | 完整仓库路径，用于回溯来源仓库 | `CNB_REPO_SLUG` |
  | `repo_scope` | 根组织 slug，用于按组织辅助过滤 | `CNB_ROOT_SLUG` / `CNB_GROUP_SLUG` |
  | `user_identity` | 人的稳定登录名，便于检索后确认归属人 | 同 `user_id` 的推导结果 |

  合并规则：**自动注入在前、`--meta-data` 显式指定在后（显式覆盖自动值）**；用 `MEMORY_AUTO_META_DATA=0` 可整体关闭自动注入。

### 9.8 常见报错与排错

| 现象 | 真实报错文案（stderr，带 `[memory] 错误:` 前缀） | 退出码 | 处置 |
| --- | --- | --- | --- |
| 未注入 API Key | `未注入 DASHSCOPE_API_KEY，无法调用百炼记忆库 API。请在密钥仓库（如 key/npc.yml）中注入该变量后重试。` | 1 | 属**预期快速失败**（不裸调）；去密钥仓库注入后重试，**不要**反复重试或中断任务 |
| 无法推导实体 | `缺少 --user-id（记忆实体 ID）：未显式传参，且环境变量 … 均为空，无法推导默认实体` | 2 | 显式传 `--user-id`，或注入 `MEMORY_USER_ID` / 用户类环境变量 |
| `user_id` 超长 | `--user-id 超长（N > 64 字符）` | 2 | 截短到 ≤ 64 字符 |
| 内容与对话混传 | `--content 与 --message 互斥，请二选一` | 2 | 二者只留一个（填 `--content` 时服务端会忽略 `messages`） |
| `add` 什么都没给 | `必须提供 --message（对话）或 --content（自定义内容）之一` | 2 | 至少给一种写入形式 |
| 内容超长 | `--content 超长（N > 512 字符）` | 2 | 拆成多条结论分别写入 |
| 消息条数超限 | `消息条数超限（N > 50 条）` | 2 | 精简对话条数 |
| `--message` 格式错 | `--message 格式错误（应为 role:content）: <原文>` | 2 | 用 `user:` / `assistant:` 前缀；正文含冒号不影响（只按**第一个**冒号切分） |
| 429 限流 / 5xx | 由脚本自动 **1s / 2s / 4s 指数退避重试，最多 3 次**，仍失败才报错 | 1 | 等退避结束即可；持续失败看返回值里的 `request_id` 排查 |
| 4xx（非限流） | 参数 / 鉴权问题，**快速失败不重试** | 1 | 按 `code` / `message` 修正入参或凭证 |
| 响应非 JSON | `调用 <METHOD> <path> 返回非 JSON 响应，无法解析` | 1 | 属服务端异常，重试无意义；保留原文与 `request_id` 上报 |
| 重试耗尽 | `调用 <METHOD> <path> 失败: <最后一次错误>`（HTTP 错误带 `request_id`；网络异常为 `网络异常: <reason>`） | 1 | 结合 `request_id` / 原因定位；记忆失败**不阻断**主流程 |

> 排错纪律：日志中只保留 `user_id` / `memory_node_id` / `request_id` 等**非敏感**字段，**严禁**把 `DASHSCOPE_API_KEY` 原文贴进评论或日志。

### 9.9 Agent 接入清单（把记忆用起来的落地步骤）

1. **首次使用 / 排查接线**：先跑 `bash tests/bailian-memory-guide.test.sh`（只读、无需 Key，末行 `通过: 8  失败: 0` 即接线正常）；若报鉴权缺失属预期，按 9.2 三 跳过记忆环节继续任务。
2. **任务开始**：判断本次是否属 9.2 一 的 5 类触发场景；命中则先跑一次 `search`（`--query` 用任务关键词或用户原话）。
3. **收到结果**：命中则把历史结论作为**先验**采纳（若与现状冲突，以现状为准并走第 5 步纠偏）；未命中则按常规流程继续，**不重试、不报错**。
4. **任务收尾**：判断是否产出 9.2 二 的 4 类可复用结论；有则 `add` 一条（`--content` ≤ 512 字符，讲清「结论 + 适用场景」）。
5. **已存在同结论**：用 `update` 补充（先 `search` 拿 `memory_node_id`），**不要**重复 `add` 制造重复片段；结论已被推翻则 `update` 修正。
6. **失败兜底**：任一记忆调用报错 → 打一条告警日志后**继续任务**，绝不因记忆库不可用而中断 NPC 主流程。

### 9.10 使用纪律（强制）

- **凭证不入库**：`DASHSCOPE_API_KEY` 只能来自密钥仓库注入，**禁止**写死进代码、`.cnb.yml`、文档或评论。
- **写入前先脱敏**：记忆库是持久化存储且会被语义检索召回，**严禁**写入 Token、密钥、用户隐私、未脱敏的内部链接等敏感信息；只写入可复用的结论性知识（如业务约定、排查经验、用户明确偏好）。
- **删除不可恢复**：`delete` 无回收站，执行前必须先 `search` / `list` 确认 `memory_node_id` 指向正确，**不要**凭猜测删除。
- **先查后写**：写入前先 `search` 确认是否已有同结论，避免重复片段；同结论用 `update` 而非再 `add`。
- **不滥用为日志仓**：记忆片段面向「长期可复用语义记忆」，不要把逐次任务流水当作记忆写入，避免污染检索结果。
- **失败不阻断主流程**：记忆读写属**增强能力**，调用失败（尤其鉴权缺失）时应告警并继续完成任务，**不得**因记忆库不可用而中断 NPC 主流程。
- **跨仓库共享勿破坏**：`user_id` 会被**所有仓库**共用，写入时须确保是「跨仓库可复用」的结论性知识（平台约定、排查经验、通用规范）；仓库特有的临时信息请写进 `meta_data` 或不要入库，避免污染其它仓库的检索结果。
- **勿给 `user_id` 加组织/仓库前缀**：`user_id` 统一为登录名本身（如 `qixiaoxin`），**禁止**改写成 `usr_<根组织>/<登录名>`、`<组织>_<登录名>` 或拼接 `repo_slug` 等形态，否则同一人会被拆成多个实体，「一个 user-id 检索全部记录」失效。
- **文档与脚本同源**：本章参数表 / 示例 / 报错文案均须与 `scripts/bailian-memory.py` 保持一致；改脚本时同步改文档（以 `--help` 为准）。
- **改动需回归**：修改脚本后必须运行 `bash tests/bailian-memory.test.sh`，确保 5 个接口的方法 / 路径 / 请求体与官方契约一致、参数校验与重试策略未被破坏，且「默认实体推导」用例（同一人跨仓库/跨组织统一为同一登录名）保持通过。
- **引导需自检**：改动本章或脚本参数后，必须同步跑 `bash tests/bailian-memory-guide.test.sh`（只读自检，8 项应全绿），确保「使用引导」与脚本实际行为未脱节。

---

## 10. 本项目技术上下文（wiki / MZ维基）

> 本章描述**本仓库实际代码**，供 Agent 快速建立项目认知。
> 原先独立存在的 `AGENT.md` 已合并至此，**不再保留该文件**（与 `AGENTS.md` 仅差一个字母，易被误判为重复文件）。

### 10.1. 项目概览

| 项目 | 说明 |
| --- | --- |
| 名称 | `wiki`（MZ维基 / MZ Wikipedia） |
| 类型 | 前端 Web 应用（SPA）+ 轻量 SSR 服务端 |
| 定位 | 高保真复刻 **Wikipedia Vector 2022** 规范的自由知识百科全书 |
| 技术栈 | React 19 · TypeScript 5.7 · Vite 6 · Tailwind CSS v4 · Express 5 |
| 路由 | HTML5 History API（`pushState` + `popstate`），仿维基 `/wiki/...` 路径 |
| 运行环境 | Node 20.11.1（见 `.nvmrc`），包管理器 pnpm（`pnpm-lock.yaml`） |
| 默认端口 | `3000`（`server.ts` 中 `process.env.PORT` 可覆盖） |
| 典范条目 | 「卫生棉条」——8 大章节、20 余子议题、约 15 篇同行评审文献 |
| 许可 | 内容遵循 **CC BY-SA 4.0**，医学内容仅作科普 |

项目同时提供：全域门户首页、官方标准路由体系、交互式知识图谱、标签体系、内容统计页，以及隐私政策 / 免责声明 / 全域行为准则等方针页。

---

### 10.2. 目录结构

```text
.
├── index.html                  # HTML 模板入口：预载字体、Meta SEO、OpenGraph、JSON-LD
├── server.ts                   # Express 入口：静态托管 + Vite 中间件 + 内容统计 REST API
├── vite.config.ts              # Vite 6 + React + Tailwind v4 配置（dev server port 3000, host true）
├── tsconfig.json               # TypeScript 严格模式配置（strict: true）
├── package.json                # 依赖与脚本（dev / build / start / lint / preview）
├── install_gpg_keys.sh         # GPG 签名链脚本（提交前必跑，见 1.5）
├── .cnb.yml                    # CNB 流水线（本地开发环境 + 同步至 GitHub 镜像仓库）
├── .github/                    # Issue 模板、PR 模板、行为准则
└── src/
    ├── main.tsx                # 应用根挂载入口
    ├── App.tsx                 # 核心路由分发、URL 同步、外观与全局布局
    ├── index.css               # 全局样式与 Tailwind 指令
    ├── components/             # Vector 2022 交互组件（Header / TOC / 预览卡片 / 灯箱 等）
    ├── pages/                  # 页面级组件（首页 / 词条 / 分类 / 图谱 / 标签 / 统计 / 方针 / 404）
    ├── data/                   # 结构化内容数据（条目 / 词条 / 图谱 / 分类 / 标签 / 方针）
    ├── services/               # 前端数据访问层（statisticsApi.ts → 后端 REST API）
    └── utils/                  # 路由、SEO、统计、图谱拓扑、内链扫描等工具与自动化模块
```

- `src/components/`：`WikipediaHeader`、`WikipediaSubheader`、`TableOfContents`、`ArticleContent`、`WikipediaImageThumb`、`WikipediaMediaViewer`、`WikiLinkPreview`、`ReferencePreview`、`AppearanceModal`、`WikipediaFooter`、`Infobox`、`KnowledgeGraphViewer`、`EntityImagePreview`。
- `src/pages/`：`HomePage`、`WikiEntryPage`、`CategoryPage`、`KnowledgeGraphPage`、`TagsPage`、`ContentStatisticsPage`、`PrivacyPage`、`DisclaimerPage`、`ConductPage`、`NotFoundPage`。
- `src/utils/`：`wikiRoutes`、`wikiLinkScanner`、`seoAutomation`、`contentStatisticsAutomation`、`graphTopologyAutomation`、`headerAutomation`、`imageProxy`。

---

### 10.3. 核心架构与数据流

```text
浏览器 URL（/wiki/卫生棉条#usage-guide）
      │
      ▼
parseLocation()  ── src/utils/wikiRoutes.ts 解析为 { page, sectionId }
      │
      ▼
App.tsx  按 page 分发到对应页面组件（useState + useEffect 管理路由状态）
      │
      ├── components/*        Vector 2022 交互（Header/TOC/预览/灯箱/外观）
      ├── data/*              结构化内容（条目/词条/图谱/分类/标签/方针）
      └── utils/*Automation.ts 从数据派生 SEO / 统计 / 图谱拓扑 / 页头指标
      │
      ▼
window.history.pushState + popstate / hashchange  ── 前进后退与锚点滚动同步

（可选）前端 services/statisticsApi.ts  →  server.ts REST API  →  utils/*Automation.ts 派生
```

- **路由单一入口**：URL 解析在 `wikiRoutes.ts`，状态分发在 `App.tsx`，二者职责不重叠。
- **数据驱动视图**：页面渲染的原材料都在 `src/data/`，组件只负责呈现与交互。
- **派生而非硬编码**：统计 / SEO / 图谱指标均由 `src/utils/*Automation.ts` 从数据实时算出，服务端 API 与前端共用同一套派生函数。

---

### 10.4. 路由与页面

标准路径（由 `getWikiPath` 生成，全部含 `/wiki/` 前缀）：

| 页面 | 路径示例 | 说明 |
| --- | --- | --- |
| 门户首页 | `/wiki/Wikipedia:首页` 或 `/` | 全域门户（典范条目 / 你知道吗 / 方针倡导） |
| 典范条目 | `/wiki/卫生棉条` | 主条目 |
| 条目锚点 | `/wiki/卫生棉条#usage-guide` | 章节级深链（`#safety-and-tss`、`#references` 等） |
| 词条 | `/wiki/<词条名>` | 由 `wikiEntriesData` 提供的普通词条 |
| 分类 | `/wiki/Category:女性生理用品` | 分类页 |
| 知识图谱 | `/wiki/Special:知识图谱` | 交互式图谱 |
| 标签 | `/wiki/Special:标签` | 标签聚合 |
| 内容统计 | `/wiki/Special:内容统计` | 内容统计页 |
| 方针页 | `/wiki/Wikipedia:隐私政策` / `免责声明` / `全域行为准则` | 制度页 |
| 404 | `/wiki/Special:404` | 未匹配路径 |

- `AppPage` 联合类型是路由的**单一事实源**：`'home' | 'article' | 'entry' | 'privacy' | 'disclaimer' | 'conduct' | 'category' | 'graph' | 'tags' | 'stats' | '404'`。
- 新增页面 = 扩展 `AppPage` + 补 `getWikiPath` 分支 + 补 `App.tsx` 分发分支 + （可选）新建 `src/pages/*Page.tsx`。

---

### 10.5. 关键约定

- **组件与数据分层**：UI 在 `components/` 与 `pages/`，内容在 `data/`，派生逻辑在 `utils/`，网络访问在 `services/`——不要把三类职责混进一个文件。
- **路径权威**：所有 `/wiki/...` 路径统一由 `wikiRoutes.ts` 生成与解析，禁止在组件里手拼字符串（易漏 `encodeURIComponent` 与锚点处理）。
- **导航一律 SPA 化**：站内跳转用 `pushState`，配合 `popstate` / `hashchange` 监听；禁止整页刷新式跳转。
- **代理白名单不可放开**：`server.ts` 的 `ALLOWED_HOSTS` 仅允许维基媒体域名，新增代理务必先过白名单。
- **图像走代理**：外链图片统一经 `src/utils/imageProxy.ts` 处理，避免直接裸链导致跨域 / 加载失败。
- **SEO 动态化**：页面级 SEO 元数据统一走 `seoAutomation.applyPageSEO()`，不要在组件里手改 `document.head`。
- **类型严格**：`tsconfig.json` 开启 `strict`；提交与推送前必须跑 `pnpm lint`（`tsc --noEmit`）并零错误通过（见 1.4.1）。
- **样式统一走 Tailwind v4**：原子类优先，避免散落的行内样式与自造 CSS 命名。

---

### 10.6. 开发环境

```bash
# 1. 克隆
git clone https://cnb.cool/XMZZUZHI/wiki.git
cd wiki

# 2. 安装依赖（pnpm）
pnpm install

# 3. 启动本地开发服务器（Express + Vite 中间件）
pnpm dev
# 访问 http://localhost:3000
```

- 脚本（`package.json`）：`dev` / `start`（`tsx server.ts`）、`build`（`tsc && vite build`）、`lint`（`tsc --noEmit`）、`preview`（`vite preview`）。
- 包管理统一使用 **pnpm**（仓库含 `pnpm-lock.yaml` 与 `pnpm-workspace.yaml`），**不要**改用 npm / yarn 提交锁文件，以免产生不一致。
- npm registry 已在 `.npmrc` 指向华为云镜像；Node 版本以 `.nvmrc`（`20.11.1`）为准。
- CNB 云端开发环境由 `.cnb.yml` 定义（预装 vscode、多个 CLI 等）。

---

### 10.7. 代码质量与提交规范

- **类型检查**：`pnpm lint`（`tsc --noEmit`）是**提交与推送的硬性门禁**，必须零错误通过（见 1.4.1）；`build` 亦会先跑 `tsc`。该检查**已从 `.pre-commit-config.yaml` 钩子中移除**，改由提交者人工执行——不要再把它加回钩子，也不要以为 `pre-commit run` 通过就等于类型检查通过。
- **pre-commit**：仓库配置了 `.pre-commit-config.yaml`，钩子仅覆盖文本卫生与配置合法性（不含类型检查）；`git commit` 前需先 `pre-commit install` 完成钩子挂载（见 1.4），类型检查须单独执行（见 1.4.1）。
- **提交信息**：遵循第 1 章 Angular 规范，**中文描述**，如 `feat(router): 新增 Special:内容统计 页面路由`、`fix(seo): 修正 canonical 路径未编码的问题`。
- **GPG 签名**：提交前必须先执行 `bash install_gpg_keys.sh`（见 1.5），本仓库已开启 commit 签名。
- **提交/推送顺序**：`pnpm lint` 通过 → `bash install_gpg_keys.sh` → `git commit -S` → 推送前再跑一次 `pnpm lint` → `git push`（见 1.4.1）。
- **分支与 PR**：从 `main` 拉出特性分支，完成后提交 PR，说明变更点与验证方式；面向 Issue / PR 的自动化模板见 `.github/`。

---

### 10.8. CI / 自动化（`.cnb.yml` 与 `.github/`）

- **`.cnb.yml`**：定义 CNB 本地开发环境（镜像、CLI 安装、GPG 脚本授权等），并在 `main` 分支 push 时**同步代码到 GitHub 镜像仓库**（`tencentcom/git-sync`，目标 `github.com/xiaomizhoubaobei/MZwiki.git`）。
  - ⚠️ 因存在该同步配置，本仓库**适用第 3.5 条**：变更须在 CNB 与 GitHub 镜像仓库**双端建 PR**。
- **`.github/`**：`PULL_REQUEST_TEMPLATE.md`、`CODE_OF_CONDUCT.md`、以及 Issue 模板（`bug_report` / `entry_request` / `feature_request` / `question` / `redlink_tracker` / `config`）。

---

### 10.9. Agent 工作指引

1. **改路由三处齐动**：`AppPage` 类型 + `getWikiPath` + `App.tsx` 分发，缺一处即出现「能跳不能认」。
2. **改内容先改数据**：新增词条 / 图谱节点 / 标签优先改 `src/data/*`，组件保持通用。
3. **复用派生工具**：统计 / SEO / 图谱指标统一走 `src/utils/*Automation.ts`，不要在组件里重算。
4. **守住安全边界**：图片代理白名单（`server.ts` 的 `ALLOWED_HOSTS`）只增维基媒体域名，**绝不**放开为通配；不要把外链拉取逻辑写成开放代理。
5. **保持 SPA 体感**：站内导航用 `pushState` + `popstate`/`hashchange`，禁止 `location.href` 跳转。
6. **提交/推送前自检**：先 `pnpm lint`（`tsc --noEmit`）零错误，再 `bash install_gpg_keys.sh`，然后 `git commit -S`；推送前再确认一次 `pnpm lint`（见 1.4.1）。
7. **提交信息**：Angular 规范 + 中文；分支拉 PR，不直推 `main`（除非用户明确要求，见 3.4）。
8. **双端同步**：因 `.cnb.yml` 配置了 GitHub 镜像同步，CNB 建 PR 的同时须在 GitHub 镜像仓库建同名同变更 PR（见 3.5）。
9. **不要把密钥写进代码或文档**；任何凭证一律经密钥仓库注入。

---

### 10.10. 参考文档

- `README.md` — 项目介绍、功能亮点、技术选型与目录结构
- `.github/CODE_OF_CONDUCT.md` — 社区行为准则
- `.github/PULL_REQUEST_TEMPLATE.md` — PR 模板
- Wikipedia Vector 2022 设计规范 — 组件与交互的对照标准
