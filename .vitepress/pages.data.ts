import { createContentLoader } from "vitepress";

export default createContentLoader("docs/**/*.md", {
  transform(raw) {
    return raw
      .filter((page) => page.frontmatter?.title)
      .map((page) => ({
        title: page.frontmatter.title as string,
        url: page.url,
      }));
  },
});
