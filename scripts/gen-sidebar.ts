/**
 * 自动生成侧边栏配置
 * 根据 docs/ 目录结构自动生成 VitePress 侧边栏
 */

import fs from 'fs';
import path from 'path';

interface SidebarItem {
  text: string;
  link?: string;
  items?: SidebarItem[];
  collapsed?: boolean;
}

const DOCS_DIR = path.resolve(__dirname, '../docs');

/**
 * 获取目录下的 index.md 标题
 */
function getTitle(dirPath: string): string {
  const indexPath = path.join(dirPath, 'index.md');
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf-8');
    const match = content.match(/^title:\s*(.+)$/m);
    return match ? match[1].trim() : path.basename(dirPath);
  }
  return path.basename(dirPath);
}

/**
 * 递归生成侧边栏
 */
function generateSidebar(dir: string): SidebarItem[] {
  const items: SidebarItem[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // 先添加 index.md
  const hasIndex = entries.some((e) => e.name === 'index.md');
  if (hasIndex) {
    const title = getTitle(dir);
    items.push({
      text: title,
      link: `/${path.relative(DOCS_DIR, dir)}/`,
    });
  }

  // 处理子目录
  const dirs = entries.filter((e) => e.isDirectory());
  for (const d of dirs) {
    const subDir = path.join(dir, d.name);
    const subItems = generateSidebar(subDir);
    if (subItems.length > 0) {
      items.push({
        text: getTitle(subDir),
        items: subItems,
        collapsed: true,
      });
    }
  }

  // 处理 .md 文件（排除 index.md）
  const mdFiles = entries.filter(
    (e) => e.isFile() && e.name.endsWith('.md') && e.name !== 'index.md'
  );
  for (const f of mdFiles) {
    const name = f.name.replace('.md', '');
    items.push({
      text: name,
      link: `/${path.relative(DOCS_DIR, path.join(dir, f.name))}`,
    });
  }

  return items;
}

// 生成并输出
const sidebar = generateSidebar(DOCS_DIR);
console.log(JSON.stringify(sidebar, null, 2));
