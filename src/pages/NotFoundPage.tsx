import React, { useState } from 'react';
import { 
  FileQuestion, 
  Search, 
  Home, 
  ArrowLeft, 
  Layers, 
  FileText,
  HelpCircle,
  FolderTree
} from 'lucide-react';

interface NotFoundPageProps {
  isDarkMode: boolean;
  missingPath?: string;
  onNavigateHome: () => void;
  onNavigateCategory: () => void;
  onSearch?: (term: string) => void;
  onNavigateArticle?: (sectionId?: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  isDarkMode,
  missingPath = '',
  onNavigateHome,
  onNavigateCategory,
  onSearch,
}) => {
  const [localQuery, setLocalQuery] = useState('');

  // Extract article/page name if URL was /wiki/something
  const displayTerm = missingPath
    ? decodeURIComponent(missingPath.replace(/^\/wiki\//, '').replace(/^#/, ''))
    : '';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim() && onSearch) {
      onSearch(localQuery.trim());
    }
  };

  return (
    <div className={`space-y-6 font-sans leading-relaxed text-sm ${
      isDarkMode ? 'text-[#eaecf0]' : 'text-[#202122]'
    }`}>
      
      {/* 1. Wikipedia Standard Notice Banner: 条目不存在 / 404 */}
      <div className={`p-4 sm:p-5 rounded border border-l-4 transition-colors ${
        isDarkMode 
          ? 'bg-[#27292d] border-[#54595d] border-l-[#e67300]' 
          : 'bg-[#fffaf0] border-[#f0c36d] border-l-[#d33]'
      }`}>
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 shrink-0 mt-0.5">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h1 className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-[#202122] dark:text-white">
              MZ维基目前还没有名为“{displayTerm || '此页面'}”的条目
            </h1>
            <p className="text-xs sm:text-sm text-[#54595d] dark:text-[#a2a9b1]">
              HTTP 404 · 您访问的页面可能已被移动、更名、删除，或输入的链接地址有误。
            </p>
          </div>
        </div>
      </div>

      {/* 2. MediaWiki Standard Guidance Box (维基百科标准搜索与指引模块) */}
      <div className={`p-5 rounded border transition-colors space-y-5 ${
        isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-white border-[#c8ccd1]'
      }`}>
        
        {/* Search tool inside 404 */}
        <div>
          <h2 className="font-serif font-bold text-sm text-[#202122] dark:text-white mb-2 flex items-center gap-1.5">
            <Search className="w-4 h-4 text-[#3366cc]" />
            <span>在 MZ维基 中搜索条目</span>
          </h2>
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-xl">
            <div className={`flex-1 flex items-center h-9 px-3 rounded border transition-all ${
              isDarkMode 
                ? 'border-[#54595d] bg-[#1a1b1c]' 
                : 'border-[#a2a9b1] bg-[#f8f9fa]'
            }`}>
              <Search className="w-4 h-4 text-[#72777d] shrink-0 mr-2" />
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="输入关键词搜索现有条目..."
                className="w-full bg-transparent text-xs outline-none text-[#202122] dark:text-white placeholder:text-[#72777d]"
              />
            </div>
            <button
              type="submit"
              className="px-4 h-9 rounded bg-[#3366cc] hover:bg-[#2a4b8d] text-white text-xs font-medium cursor-pointer transition-colors shadow-xs"
            >
              搜索
            </button>
          </form>
        </div>

        {/* Wikipedia Help Instructions */}
        <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-3 text-xs leading-relaxed text-[#54595d] dark:text-[#a2a9b1]">
          <p className="font-semibold text-[#202122] dark:text-white">
            您可以尝试以下操作：
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>检查网址拼写</strong>：确认浏览器地址栏中的条目名称、大小写及繁简中文字符是否正确。
            </li>
            <li>
              <strong>使用全站搜索</strong>：尝试使用别名、缩写或相关关键词重新搜索已有内容。
            </li>
            <li>
              <strong>浏览分类索引</strong>：访问分类目录，按学科或主题分类查找相关条目。
            </li>
            <li>
              <strong>返回维基首页</strong>：回到 
              <button
                type="button"
                onClick={() => onNavigateHome()}
                className="text-[#3366cc] dark:text-[#6699ff] hover:underline font-semibold mx-1 cursor-pointer"
              >
                MZ维基首页
              </button>
              查看精选条目与导航索引。
            </li>
          </ul>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-[#3366cc] hover:bg-[#2a4b8d] text-white text-xs font-medium cursor-pointer transition-colors shadow-xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>返回维基首页</span>
          </button>
          
          <button
            type="button"
            onClick={onNavigateCategory}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded border text-xs font-medium cursor-pointer transition-colors ${
              isDarkMode 
                ? 'border-[#54595d] bg-[#27292d] hover:bg-[#32363c] text-white' 
                : 'border-[#c8ccd1] bg-[#f8f9fa] hover:bg-[#f1f2f3] text-[#202122]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#3366cc]" />
            <span>浏览分类目录</span>
          </button>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs text-[#72777d] hover:text-[#3366cc] cursor-pointer transition-colors ml-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回上一页</span>
          </button>
        </div>

      </div>

      {/* 3. MediaWiki 条目指引说明卡片 */}
      <div className={`p-4 sm:p-5 rounded border transition-colors ${
        isDarkMode ? 'bg-[#1a1b1c] border-[#54595d]' : 'bg-[#f8f9fa] border-[#c8ccd1]'
      }`}>
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-black/5 dark:border-white/5">
          <HelpCircle className="w-4 h-4 text-[#3366cc]" />
          <h3 className="font-serif font-bold text-xs sm:text-sm text-[#202122] dark:text-white">
            关于在 MZ维基 创建与查找条目
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded bg-white dark:bg-[#202122] border border-black/5 dark:border-white/5">
            <div className="font-semibold text-[#202122] dark:text-white flex items-center gap-1.5 mb-1">
              <FileText className="w-3.5 h-3.5 text-[#3366cc]" />
              <span>条目收录标准</span>
            </div>
            <p className="text-[11px] text-[#72777d] dark:text-[#a2a9b1] leading-relaxed">
              维基条目需具备关注度并附有可靠来源引证。若您希望创建此词条，建议先进行检索避免重复建立。
            </p>
          </div>

          <div className="p-3 rounded bg-white dark:bg-[#202122] border border-black/5 dark:border-white/5">
            <div className="font-semibold text-[#202122] dark:text-white flex items-center gap-1.5 mb-1">
              <FolderTree className="w-3.5 h-3.5 text-[#3366cc]" />
              <span>分类与知识体系</span>
            </div>
            <p className="text-[11px] text-[#72777d] dark:text-[#a2a9b1] leading-relaxed">
              您也可以通过全站分类体系定位所属学科或领域，查阅相关已收录条目与文献资料。
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
