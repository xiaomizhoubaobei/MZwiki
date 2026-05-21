import { createContentLoader } from "vitepress";

export default createContentLoader("docs/**/*.md", {
  excerpt: true,
  transform(raw) {
    const tagMap = new Map<string, any[]>();

    raw.forEach((page) => {
      const tags = page.frontmatter?.tags || [];
      tags.forEach((tag: string) => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, []);
        }
        tagMap.get(tag)!.push({
          title: page.frontmatter.title || page.url,
          url: page.url,
        });
      });
    });

    return Array.from(tagMap.entries()).map(([tag, pages]) => ({
      tag,
      pages,
    }));
  },
});
