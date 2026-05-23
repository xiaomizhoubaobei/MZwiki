import fs from "node:fs";
import path from "node:path";

/**
 * 词条信息接口
 */
interface WikiEntry {
  title: string;
  url: string;
  desc: string;
  tags: string[];
}

/**
 * 从 frontmatter 解析 description 和 tags
 */
function parseFrontmatter(content: string): { description?: string; tags?: string[] } {
  const result: { description?: string; tags?: string[] } = {};
  const descMatch = content.match(/^---[\s\S]*?^description:\s*(.+)$/m);
  if (descMatch) {
    result.description = descMatch[1].trim().replace(/^["']|["']$/g, "");
  }
  const tagsMatch = content.match(/^---[\s\S]*?^tags:\s*\[([^\]]*)\]/m);
  if (tagsMatch) {
    result.tags = tagsMatch[1]
      .split(",")
      .map((t) => t.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }
  return result;
}

/**
 * 生成词条名称 → 完整信息的映射表
 * 匹配规则：文件名（去掉 .md）和 frontmatter 中的 title 都作为词条名
 */
function buildWikiMap(): Map<string, WikiEntry> {
  const map = new Map<string, WikiEntry>();
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

        const content = fs.readFileSync(fullPath, "utf-8");
        const { description, tags } = parseFrontmatter(content);

        // 解析 frontmatter title
        const titleMatch = content.match(/^---[\s\S]*?^title:\s*(.+)$/m);
        const title = titleMatch
          ? titleMatch[1].trim().replace(/^["']|["']$/g, "")
          : fileName;

        const entry: WikiEntry = { title, url: urlPath, desc: description || "", tags: tags || [] };
        map.set(fileName, entry);

        if (titleMatch) {
          map.set(title, entry);
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
    // 手动遍历 AST
    function visitText(node: any) {
      if (node.type === "text" && typeof node.value === "string") {
        const regex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
        if (!regex.test(node.value)) return;

        node.type = "html";
        node.value = node.value.replace(regex, (_match: string, targetName: string, alias: string | undefined) => {
          const displayName = (alias || targetName).trim();
          const target = targetName.trim();

          const entry = wikiMap.get(target);

          if (entry) {
            // 词词条存在 → 生成带悬停预览卡片的 HTML
            const tagsHtml = entry.tags.length
              ? `<small>${entry.tags.join(" · ")}</small>`
              : "";
            const descHtml = entry.desc
              ? `<p>${entry.desc}</p>`
              : "";

            return `\n<div class="wiki-popover">\n  <a href="${entry.url}" class="wiki-link" title="${entry.title}">${displayName}</a>\n  <div class="wiki-card">\n    <strong>${entry.title}</strong>\n    ${descHtml}\n    ${tagsHtml}\n  </div>\n</div>\n`;
          }

          // 词条不存在 → 标红 + 问号（使用 span 而非 a 标签）
          return `<span class="wiki-link missing" title="词条不存在: ${target}">${displayName}?</span>`;
        });
      } else if (Array.isArray(node.children)) {
        node.children.forEach(visitText);
      }
    }

    visitText(tree);
  };
};
