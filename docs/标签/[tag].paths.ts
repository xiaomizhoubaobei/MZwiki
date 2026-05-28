import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

function extractFrontmatter(content: string): Record<string, unknown> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const frontmatter: Record<string, unknown> = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^(\w[\w-]*):\s*(.+)$/);
    if (m) {
      const key = m[1];
      let value: unknown = m[2].trim();
      if (String(value).startsWith("[") && String(value).endsWith("]")) {
        value = String(value)
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ""));
      }
      frontmatter[key] = value;
    }
  }
  return frontmatter;
}

function getAllMarkdownFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name.startsWith(".") ||
      entry.name === "node_modules" ||
      entry.name === "dist"
    )
      continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllMarkdownFiles(full));
    } else if (extname(entry.name) === ".md") {
      results.push(full);
    }
  }
  return results;
}

export default {
  paths(): { params: { tag: string } }[] {
    const docsDir = join(process.cwd(), "docs");
    const files = getAllMarkdownFiles(docsDir);
    const tags = new Set<string>();
    for (const file of files) {
      const content = readFileSync(file, "utf-8");
      const fm = extractFrontmatter(content);
      const pageTags = fm.tags;
      if (Array.isArray(pageTags)) {
        pageTags.forEach((t: string) => tags.add(t));
      }
    }
    return Array.from(tags).map((tag) => ({ params: { tag } }));
  },
};
