import { createContentLoader } from "vitepress";

export default createContentLoader("docs/**/*.md", {
  transform(raw) {
    const map = new Map<string, any[]>();

    raw.forEach((page) => {
      const tags = page.frontmatter?.tags || [];
      tags.forEach((tag: string) => {
        if (!map.has(tag)) map.set(tag, []);
        map.get(tag)!.push({
          title: page.frontmatter.title || page.url,
          url: page.url,
        });
      });
    });

    return Array.from(map.entries()).map(([tag, pages]) => ({
      tag,
      slug: encodeURIComponent(tag),
      pages,
    }));
  },
});
