#!/usr/bin/env bash
# pre-commit 类型检查包装脚本
#
# 背景：.pre-commit-config.yaml 中的 tsc-typecheck 钩子此前直接以 `pnpm lint` 作为 entry，
# 依赖运行机上已预装 pnpm。CI / 开发容器里常常只有 node + npm（corepack 可用），
# 于是钩子报错 `Executable \`pnpm\` not found`，把整个提交卡死。
#
# 本脚本做三件事，保证钩子在任何装了 Node 的环境都能自愈：
#   1. 优先使用已安装的 pnpm；
#   2. 缺失时用 corepack 自动提供（无需手动 install，可离线复用已缓存的版本）；
#   3. 依赖未安装时先按 lockfile 安装，再执行 pnpm lint（tsc --noEmit）。
#
# 幂等：重复执行安全；已装依赖时不会重复安装。
set -euo pipefail

# 统一切到仓库根目录，保证 pre-commit 从任意 cwd 调用都能找到 package.json
cd "$(dirname "$0")/.."

# 1) 选择一个可用的 pnpm：优先 PATH，其次 corepack
PNPM_CMD=()
if command -v pnpm >/dev/null 2>&1; then
  PNPM_CMD=(pnpm)
elif command -v corepack >/dev/null 2>&1; then
  # corepack 首次会按 packageManager 字段（或最新稳定版）下载 pnpm，之后走缓存
  PNPM_CMD=(corepack pnpm)
else
  echo "❌ 未找到 pnpm，也未找到 corepack：请先安装 Node.js（自带 corepack）或全局安装 pnpm。" >&2
  exit 1
fi

echo "ℹ️  使用命令：${PNPM_CMD[*]}"

# 2) 依赖缺失时按 lockfile 安装（node_modules 存在则跳过，避免每次提交都重装）
if [ ! -d node_modules ]; then
  echo "ℹ️  未检测到 node_modules，先安装依赖（frozen-lockfile）..."
  "${PNPM_CMD[@]}" install --frozen-lockfile
fi

# 3) 执行类型检查（等价 pnpm lint = tsc --noEmit）
"${PNPM_CMD[@]}" lint
