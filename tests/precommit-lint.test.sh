#!/usr/bin/env bash
# precommit-lint.sh 回归测试
#
# 目的：验证「提交前类型检查包装脚本」在各种 Node 环境下都能跑通，
# 特别是「无 pnpm、无 corepack」这种曾把提交卡死的场景。
#
# 用法：bash tests/precommit-lint.test.sh
# 退出码：0 全通过；1 有失败项。
set -u

SCRIPT="$(cd "$(dirname "$0")/.." && pwd)/scripts/precommit-lint.sh"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
pass=0
fail=0

assert_exit() { # 名称 期望退出码 实际退出码
  if [ "$2" = "$3" ]; then
    echo "  ✅ $1（exit=$3）"
    pass=$((pass + 1))
  else
    echo "  ❌ $1（期望 exit=$2，实际 exit=$3）"
    fail=$((fail + 1))
  fi
}

assert_contains() { # 名称 文件 关键串
  if grep -q "$3" "$2"; then
    echo "  ✅ $1"
    pass=$((pass + 1))
  else
    echo "  ❌ $1（未在输出中找到：$3）"
    fail=$((fail + 1))
  fi
}

echo "① 项目内依赖已就位时，应走 node + 项目内 tsc"
( cd "$REPO_ROOT" && bash "$SCRIPT" ) >/tmp/pcl-a.log 2>&1
assert_exit "正常环境类型检查通过" 0 $?
assert_contains "走了 node+tsc 路径" /tmp/pcl-a.log "使用项目内 tsc"

echo "② 无 pnpm / corepack，仅 node + 基础 PATH，也应通过"
env -i PATH="$(dirname "$(command -v node)"):/usr/bin:/bin" HOME="$HOME" \
  bash -c "cd '$REPO_ROOT' && bash '$SCRIPT'" >/tmp/pcl-b.log 2>&1
assert_exit "仅 node 环境类型检查通过" 0 $?
assert_contains "走了 node+tsc 路径" /tmp/pcl-b.log "使用项目内 tsc"

echo "③ 完全没有 node / 包管理器时，应明确报错并退出 1"
env -i PATH="/usr/bin:/bin" HOME="$HOME" \
  bash -c "cd '$REPO_ROOT' && bash '$SCRIPT'" >/tmp/pcl-c.log 2>&1
assert_exit "缺 node 时快速失败" 1 $?
assert_contains "给出可读错误" /tmp/pcl-c.log "无法执行类型检查"

# ④ 复现「node_modules 缺失 + 有包管理器」这一曾把提交卡死的场景：
#    脚本应先自动安装依赖，再跑通类型检查（不能直接报「未找到项目内 typescript」）。
#    把整个仓库（排除 node_modules/.git）复制到临时目录进行，避免动到真实依赖。
echo "④ node_modules 缺失时，应自动安装依赖后通过"
TMP_REPO="$(mktemp -d)"
trap 'rm -rf "$TMP_REPO" /tmp/pcl-d.log' EXIT
tar -C "$REPO_ROOT" \
  --exclude=./node_modules --exclude=./.git --exclude=./dist \
  -cf - . | tar -C "$TMP_REPO" -xf -
( cd "$TMP_REPO" && timeout 900 bash scripts/precommit-lint.sh ) >/tmp/pcl-d.log 2>&1
assert_exit "缺依赖时自动安装并类型检查通过" 0 $?

# ⑤ pnpm 存在但不可用（模拟安装失败）时，应降级到 npm 兜底，仍能跑通。
#    这正是旧版脚本的缺口：它只试一次 pnpm，失败就直接报「未找到项目内 typescript」。
echo "⑤ pnpm 安装失败时应降级到 npm 兜底"
TMP_REPO5="$(mktemp -d)"
FAKEBIN="$(mktemp -d)"
trap 'rm -rf "$TMP_REPO" "$TMP_REPO5" "$FAKEBIN" /tmp/pcl-d.log /tmp/pcl-e.log' EXIT
tar -C "$REPO_ROOT" \
  --exclude=./node_modules --exclude=./.git --exclude=./dist \
  -cf - . | tar -C "$TMP_REPO5" -xf -
# 造一个必定失败的假 pnpm，并把假 pnpm 放到 PATH 最前；corepack 也一并屏蔽
cat > "$FAKEBIN/pnpm" <<'FAKE'
#!/bin/sh
echo "fake pnpm: simulated install failure" >&2
exit 1
FAKE
chmod +x "$FAKEBIN/pnpm"
( cd "$TMP_REPO5" && PATH="$FAKEBIN:$(dirname "$(command -v node)"):/usr/bin:/bin" \
    timeout 900 bash scripts/precommit-lint.sh ) >/tmp/pcl-e.log 2>&1
assert_exit "pnpm 失败时 npm 兜底并类型检查通过" 0 $?
assert_contains "确实尝试过 npm 兜底" /tmp/pcl-e.log "npm"

echo
echo "通过: $pass  失败: $fail"
[ "$fail" -eq 0 ]
