import { createContentLoader } from "vitepress";

export default createContentLoader("docs/**/*.md", {
  transform(raw) {
    return raw.map((p) => ({
      title: p.frontmatter.title,
      url: p.url,
      words: p.frontmatter.title
        .toLowerCase()
        .split("")
        .join(".*"),
    }));
  },
});
