#!/usr/bin/env bash
# pre-commit 类型检查包装脚本（等价 `pnpm lint` = `tsc --noEmit`）
#
# 背景：.pre-commit-config.yaml 的 tsc-typecheck 钩子需要做 TypeScript 类型检查。
# 早期 entry 直接写 `pnpm lint`，依赖运行机预装 pnpm；CI / 开发容器往往只有 node
# 而无 pnpm（部分环境连 corepack 也没挂到 PATH），于是钩子报错
#   `Executable \`pnpm\` not found` / `未找到 pnpm，也未找到 corepack`
# 把提交直接卡死。
#
# 本脚本按「依赖最少 → 依赖更多」的顺序挑选执行方式，保证任何装了 Node 的环境都能跑通：
#   1. 首选：用 node 直接执行项目内 typescript 的 bin 入口
#      （`node node_modules/typescript/bin/tsc`）。只依赖 node 本身，绕开
#      node_modules/.bin 下的 shell shim，也不依赖 pnpm / corepack，
#      与 `pnpm lint` 语义完全一致（都是 tsc --noEmit），是最稳的路径；
#   2. 若项目内尚无 typescript，则用可用的包管理器补装依赖：
#      pnpm（PATH 已装）＞ corepack pnpm ＞ npm（Node 自带，最后兜底）；
#   3. 装完依赖后仍回到第 1 步执行；仍缺 typescript 才报错退出。
#
# 幂等：重复执行安全；依赖已安装时不会重复安装。
set -euo pipefail

# 统一切到仓库根目录，保证 pre-commit 从任意 cwd 调用都能找到 package.json
cd "$(dirname "$0")/.."

# 项目内 typescript 的 tsc 入口（相对路径，配合 node 执行，绕开 .bin shell shim）
TSC_ENTRY="node_modules/typescript/bin/tsc"

# 执行类型检查（node 直跑项目内 tsc）
run_tsc() {
  echo "ℹ️  使用项目内 tsc 执行类型检查（node $TSC_ENTRY --noEmit）"
  exec node "$TSC_ENTRY" --noEmit
}

# 1) 首选：node + 项目内 tsc 已就位（只需 node，无需 pnpm / corepack）
if command -v node >/dev/null 2>&1 && [ -f "$TSC_ENTRY" ]; then
  run_tsc
fi

# 2) 依赖缺失：挑选可用的包管理器安装（pnpm > corepack pnpm > npm）
PM_CMD=()
if command -v pnpm >/dev/null 2>&1; then
  PM_CMD=(pnpm)
elif command -v corepack >/dev/null 2>&1; then
  PM_CMD=(corepack pnpm)
elif command -v npm >/dev/null 2>&1; then
  PM_CMD=(npm)
fi

if [ "${#PM_CMD[@]}" -ne 0 ]; then
  echo "ℹ️  未检测到项目内 tsc，先安装依赖：${PM_CMD[*]}"
  if [ "${PM_CMD[0]}" = "npm" ]; then
    # npm 兜底路径：无 pnpm-lock 语义，直接装即可
    "${PM_CMD[@]}" install --no-audit --no-fund
  else
    "${PM_CMD[@]}" install --frozen-lockfile
  fi
fi

# 3) 依赖就位后再次尝试执行（此时应已可用）
if command -v node >/dev/null 2>&1 && [ -f "$TSC_ENTRY" ]; then
  run_tsc
fi

echo "❌ 无法执行类型检查：未找到 node 或项目内 typescript（$TSC_ENTRY）。" >&2
echo "   请先安装 Node.js，并在仓库根目录执行 pnpm install（或 npm install）后重试。" >&2
exit 1
