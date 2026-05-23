import type { Plugin } from "vite";

/**
 * 将 frontmatter 中的 tags 注入到 HTML 中
 * 使用 Pagefind 的 data-pagefind-meta 属性使其可作为元数据过滤
 * https://pagefind.app/docs/metadata/
 */
export function injectTagsPlugin(): Plugin {
  return {
    name: "inject-tags-for-pagefind",
    transformIndexHtml(html: string, ctx) {
      const pageData = (ctx as any).vitePressData;
      const tags = pageData?.frontmatter?.tags;
      const title = pageData?.frontmatter?.title;

      if (tags && Array.isArray(tags)) {
        const tagsStr = tags.join(",");
        // Pagefind 会将 data-pagefind-meta="tags:xxx" 解析为可用的 meta 字段
        // 同时将标签文本放入一个隐藏但可被索引的元素中
        const tagMarker = `<span data-pagefind-meta="tags:${tagsStr}" style="display:none">${tags.join(" ")}</span>`;

        // 在 <body> 开始后注入
        html = html.replace(/<body([^>]*)>/, `<body$1>${tagMarker}`);
      }

      return html;
    },
  };
}
