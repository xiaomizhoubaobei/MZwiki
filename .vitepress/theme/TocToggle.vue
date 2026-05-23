<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vitepress";

const open = ref(false);
const route = useRoute();
const tocItems = ref<{ level: number; text: string; id: string }[]>([]);

// 提取当前页面的标题
function extractToc() {
  const items: { level: number; text: string; id: string }[] = [];
  const article = document.querySelector(".vp-doc");
  if (!article) return items;

  article.querySelectorAll("h2, h3").forEach((el) => {
    const heading = el as HTMLElement;
    if (heading.id) {
      items.push({
        level: parseInt(heading.tagName[1]),
        text: heading.textContent || "",
        id: heading.id,
      });
    }
  });

  return items;
}

// 滚动到锚点
function scrollTo(id: string) {
  open.value = false;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// 路由变化时重新提取
watch(
  () => route.path,
  () => {
    open.value = false;
    // 等待页面渲染完成
    setTimeout(() => {
      tocItems.value = extractToc();
    }, 300);
  }
);

onMounted(() => {
  // 首次提取（延迟等页面渲染）
  setTimeout(() => {
    tocItems.value = extractToc();
  }, 500);
});

// 点击遮罩关闭
function onOverlayClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains("toc-drawer")) {
    open.value = false;
  }
}

// ESC 关闭
function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && open.value) {
    open.value = false;
  }
}

onMounted(() => {
  document.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <button class="toc-toggle" @click="open = !open" aria-label="打开目录">
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
    <span>目录</span>
  </button>

  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="toc-drawer" @click="onOverlayClick">
        <div class="toc-panel">
          <div class="toc-header">
            <span>📑 目录</span>
            <button class="toc-close" @click="open = false" aria-label="关闭目录">
              ✕
            </button>
          </div>
          <nav class="toc-nav">
            <ul v-if="tocItems.length" class="toc-list">
              <li
                v-for="item in tocItems"
                :key="item.id"
                :class="['toc-item', `toc-level-${item.level}`]"
              >
                <a :href="`#${item.id}`" @click.prevent="scrollTo(item.id)">
                  {{ item.text }}
                </a>
              </li>
            </ul>
            <p v-else class="toc-empty">暂无目录</p>
          </nav>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 悬浮按钮 */
.toc-toggle {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 999px;
  background: var(--vp-c-brand);
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s, box-shadow 0.2s;
}

.toc-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.toc-toggle:active {
  transform: translateY(0);
}

.toc-toggle svg {
  flex-shrink: 0;
}

/* 桌面端隐藏 */
@media (min-width: 960px) {
  .toc-toggle {
    display: none;
  }
}

/* 遮罩 */
.toc-drawer {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1100;
  display: flex;
  justify-content: flex-end;
}

/* 面板 */
.toc-panel {
  width: 80%;
  max-width: 320px;
  height: 100%;
  background: var(--vp-c-bg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.toc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--vp-c-divider);
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
}

.toc-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  transition: background 0.2s, color 0.2s;
}

.toc-close:hover {
  background: var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

/* 目录列表 */
.toc-nav {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem 0;
  -webkit-overflow-scrolling: touch;
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc-item {
  position: relative;
}

.toc-item a {
  display: block;
  padding: 8px 1.25rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 0.9rem;
  line-height: 1.5;
  transition: color 0.2s, background 0.2s;
}

.toc-item a:hover {
  color: var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
}

/* H2 层级 */
.toc-level-2 {
  font-weight: 600;
}

.toc-level-2 a {
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

/* H3 层级缩进 + 指示线 */
.toc-level-3 a {
  padding-left: 2rem;
  font-size: 0.875rem;
  font-weight: 400;
}

.toc-level-3::before {
  content: "";
  position: absolute;
  left: 1.25rem;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--vp-c-divider);
}

.toc-empty {
  padding: 2rem 1.25rem;
  color: var(--vp-c-text-3);
  text-align: center;
  font-size: 0.9rem;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-active .toc-panel,
.fade-leave-active .toc-panel {
  transition: transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-from .toc-panel {
  transform: translateX(100%);
}

.fade-leave-to .toc-panel {
  transform: translateX(100%);
}
</style>
