import { createContentLoader } from "vitepress";

export default createContentLoader("docs/**/*.md", {
  transform(raw) {
    const backlinks = new Map<string, any[]>();

    raw.forEach((page) => {
      const title = page.frontmatter?.title;
      if (!title) return;

      const content = page.rawContent || "";

      const matches = content.match(/\[\[([^\]|]+)/g);
      if (!matches) return;

      matches.forEach((m) => {
        const target = m.slice(2);
        if (!backlinks.has(target)) {
          backlinks.set(target, []);
        }

        backlinks.get(target)!.push({
          title: page.frontmatter.title,
          url: page.url,
        });
      });
    });

    return Object.fromEntries(backlinks);
  },
});
