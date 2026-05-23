import fs from "node:fs";
import path from "node:path";

/**
 * 生成词条名称 → URL 路径的映射表
 * 匹配规则：文件名（去掉 .md）和 frontmatter 中的 title 都作为词条名
 */
function buildWikiMap(): Map<string, string> {
  const map = new Map<string, string>();
  const root = process.cwd();
  const docsDir = path.join(root, "docs");

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith(".md")) {
        const relativePath = path.relative(root, fullPath);
        const urlPath = "/" + relativePath.replace(/\.md$/, "");
        const fileName = entry.name.replace(/\.md$/, "");

        map.set(fileName, urlPath);

        // 解析 frontmatter title
        const content = fs.readFileSync(fullPath, "utf-8");
        const titleMatch = content.match(/^---[\s\S]*?^title:\s*(.+)$/m);
        if (titleMatch) {
          const title = titleMatch[1].trim().replace(/^["']|["']$/g, "");
          map.set(title, urlPath);
        }
      }
    }
  }

  walk(docsDir);
  return map;
}

export const remarkWikiLink = () => {
  const wikiMap = buildWikiMap();

  return (tree: any) => {
    // 手动遍历 AST（避免引入 ESM-only 的 unist-util-visit）
    function visitText(node: any) {
      if (node.type === "text" && typeof node.value === "string") {
        const regex = /\[\[([^\]]+)\]\]/g;
        if (!regex.test(node.value)) return;

        node.type = "html";
        node.value = node.value.replace(regex, (_match: string, content: string) => {
          // 支持别名语法：[[显示名|目标名]]
          const parts = content.split("|");
          const targetName = parts.length > 1 ? parts[1].trim() : content.trim();
          const displayName = parts.length > 1 ? parts[0].trim() : content.trim();

          const url = wikiMap.get(targetName);

          if (url) {
            return `<a href="${url}" class="wiki-link" title="${targetName}">${displayName}</a>`;
          }

          // 词条不存在 → 标红样式
          return `<a href="#" class="wiki-link broken" title="词条不存在: ${targetName}">${displayName}</a>`;
        });
      } else if (Array.isArray(node.children)) {
        node.children.forEach(visitText);
      }
    }

    visitText(tree);
  };
};
