import fs from "node:fs";
import path from "node:path";

const tags = new Set<string>();

function extractFrontmatter(content: string): Record<string, any> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data: Record<string, any> = {};
  const lines = match[1].split("\n");
  for (const line of lines) {
    const m = line.match(/^(\w+):\s*(.*)/);
    if (m) data[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return data;
}

function extractArrayField(content: string, field: string): string[] {
  const result: string[] = [];
  const regex = new RegExp(`^${field}:\\s*\\[([\\s\\S]*?)\\]`, "m");
  const match = content.match(regex);
  if (match) {
    const items = match[1].match(/['"]([^'"]+)['"]/g);
    if (items) items.forEach((item) => result.push(item.replace(/^['"]|['"]$/g, "")));
  } else {
    // 单值
    const data = extractFrontmatter(content);
    if (data[field] && typeof data[field] === "string") {
      result.push(data[field]);
    }
  }
  return result;
}

function scanDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".vitepress", "node_modules", ".git"].includes(entry.name)) continue;
      scanDir(full);
    } else if (entry.name.endsWith(".md")) {
      const content = fs.readFileSync(full, "utf-8");
      const tagList = extractArrayField(content, "tags");
      tagList.forEach((t) => tags.add(t));
    }
  }
}

scanDir("docs");

export default {
  paths: [...tags].map((tag) => ({ params: { tag } })),
};
