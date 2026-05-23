import { createContentLoader } from "vitepress";

interface GraphNode {
  id: string;
  type: "page" | "tag";
  url?: string;
}

interface GraphLink {
  source: string;
  target: string;
  type?: string;
}

export default createContentLoader("docs/**/*.md", {
  transform(raw) {
    const nodeMap = new Map<string, GraphNode>();
    const links: GraphLink[] = [];

    raw.forEach((page) => {
      const title = page.frontmatter?.title;
      if (!title) return;

      // 添加页面节点
      if (!nodeMap.has(title)) {
        nodeMap.set(title, {
          id: title,
          type: "page",
          url: page.url,
        });
      }

      const content = page.rawContent || "";

      // 解析 [[内链]]
      const matches = content.match(/\[\[([^\]|]+)/g) || [];
      matches.forEach((m) => {
        const target = m.slice(2);
        // 添加目标节点（如果不存在）
        if (!nodeMap.has(target)) {
          nodeMap.set(target, {
            id: target,
            type: "page",
          });
        }
        links.push({ source: title, target });
      });

      // 解析标签关系
      (page.frontmatter?.tags || []).forEach((tag: string) => {
        if (!nodeMap.has(tag)) {
          nodeMap.set(tag, {
            id: tag,
            type: "tag",
          });
        }
        links.push({ source: title, target: tag, type: "tag" });
      });
    });

    return {
      nodes: Array.from(nodeMap.values()),
      links,
    };
  },
});
