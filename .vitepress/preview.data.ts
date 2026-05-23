import { createContentLoader } from "vitepress";

export default createContentLoader("docs/**/*.md", {
  excerpt: true,
  transform(raw) {
    return raw
      .filter((page) => page.frontmatter?.title)
      .map((page) => ({
        title: page.frontmatter.title as string,
        url: page.url,
        desc:
          (page.excerpt as string) ||
          (page.frontmatter.description as string) ||
          "",
        tags: (page.frontmatter.tags as string[]) || [],
      }));
  },
});
