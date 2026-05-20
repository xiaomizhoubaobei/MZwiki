/**
 * 维基导出脚本
 * 用于将词条导出为 Markdown 格式
 */

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.resolve(__dirname, '../docs');

/**
 * 递归获取所有 .md 文件
 */
function getAllMarkdownFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * 导出所有词条
 */
function exportAll() {
  const files = getAllMarkdownFiles(DOCS_DIR);
  console.log(`共找到 ${files.length} 个词条文件：`);
  files.forEach((file) => {
    const relative = path.relative(DOCS_DIR, file);
    console.log(`  - ${relative}`);
  });
  return files;
}

// 直接运行
exportAll();
