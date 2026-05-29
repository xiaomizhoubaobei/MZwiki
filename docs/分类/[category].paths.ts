import fs from "node:fs";
import path from "node:path";

const categories = new Set<string>();

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

function scanDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".vitepress", "node_modules", ".git"].includes(entry.name)) continue;
      scanDir(full);
    } else if (entry.name.endsWith(".md")) {
      const content = fs.readFileSync(full, "utf-8");
      const data = extractFrontmatter(content);
      const cat = data.category || data.categories;
      if (cat) categories.add(cat);
    }
  }
}

scanDir("docs");

export default {
  paths: [...categories].map((category) => ({ params: { category } })),
};
