import { createContentLoader } from "vitepress";

export default createContentLoader("docs/**/*.md", {
  transform(raw) {
    const existing = new Set<string>();
    const mentioned = new Set<string>();

    raw.forEach((page) => {
      if (page.frontmatter?.title) {
        existing.add(page.frontmatter.title);
      }

      const matches =
        page.rawContent?.match(/\[\[([^\]|]+)/g) || [];

      matches.forEach((m) => {
        mentioned.add(m.slice(2));
      });
    });

    return Array.from(mentioned)
      .filter((t) => !existing.has(t))
      .sort();
  },
});
