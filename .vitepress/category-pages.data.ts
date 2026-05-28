import { createContentLoader } from "vitepress";

export default createContentLoader("docs/**/*.md", {
  transform(raw) {
    const map = new Map<string, any[]>();

    raw.forEach((page) => {
      const category = page.frontmatter?.category;
      if (category) {
        if (!map.has(category)) map.set(category, []);
        map.get(category)!.push({
          title: page.frontmatter.title || page.url,
          url: page.url,
        });
      }
    });

    return Array.from(map.entries()).map(([category, pages]) => ({
      category,
      slug: encodeURIComponent(category),
      pages,
    }));
  },
});
