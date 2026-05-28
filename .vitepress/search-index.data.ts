import { createContentLoader } from "vitepress";

export default createContentLoader("docs/**/*.md", {
  transform(raw) {
    return raw
      .filter((p) => p.frontmatter.title)
      .map((p) => ({
        title: p.frontmatter.title,
        url: p.url,
        words: String(p.frontmatter.title)
          .toLowerCase()
          .split("")
          .join(".*"),
      }));
  },
});
