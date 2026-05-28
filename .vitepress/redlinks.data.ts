import { createContentLoader } from "vitepress";

interface PageData {
  url: string;
  frontmatter: {
    title?: string;
    aliases?: string[];
  };
  rawContent?: string;
}

interface Redlink {
  title: string;
  alias?: string;
}

export default createContentLoader("docs/**/*.md", {
  includeSrc: true,
  transform(raw: PageData[]) {
    // 1. 建立"真实词条索引"
    // Key: 词条标题 (如 "量子力学")
    // Value: 文件路径 (如 "/natural-science/physics/quantum-mechanics/")
    const entryIndex = new Map<string, string>();

    raw.forEach((page) => {
      const title = page.frontmatter?.title;
      if (title) {
        entryIndex.set(title, page.url);
        // 如果有别名也一并注册到索引中
        const aliases = page.frontmatter?.aliases;
        if (Array.isArray(aliases)) {
          aliases.forEach((a) => entryIndex.set(a, page.url));
        }
      }
    });

    // 2. 扫描所有内链
    const referencedLinks = new Set<string>();
    const aliasMap = new Map<string, string>();

    raw.forEach((page) => {
      const src = (page as Record<string, unknown>).src as string | undefined;
      if (!src) return;

      // 正则匹配 [[...]]，支持别名 [[目标|显示文本]]
      const matches = src.match(/\[\[(.*?)\]\]/g);
      if (matches) {
        matches.forEach((match) => {
          const content = match.slice(2, -2);
          if (content.includes("|")) {
            const [target, alias] = content.split("|");
            referencedLinks.add(target.trim());
            aliasMap.set(target.trim(), alias.trim());
          } else {
            referencedLinks.add(content.trim());
          }
        });
      }
    });

    // 3. 计算红链（引用的词条在索引中找不到）
    const redlinks: Redlink[] = [];
    referencedLinks.forEach((link) => {
      if (!entryIndex.has(link)) {
        redlinks.push({
          title: link,
          alias: aliasMap.get(link),
        });
      }
    });

    console.log(
      `[Redlinks] Total entries: ${entryIndex.size}, Referenced: ${referencedLinks.size}, Red: ${redlinks.length}`
    );

    return redlinks;
  },
});
