import React from 'react';
import { Clock, BookOpen, GitBranch, Layers, FileText, Tag, ChevronRight, BarChart3 } from 'lucide-react';
import { BreadcrumbItem } from '../utils/headerAutomation';

interface WikipediaSubheaderProps {
  isDarkMode: boolean;
  readingMinutes?: number;
  wordCount?: number;
  title?: string;
  badge?: string;
  isPolicyPage?: boolean;
  isCategoryPage?: boolean;
  isGraphPage?: boolean;
  isTagsPage?: boolean;
  isStatsPage?: boolean;
  isEntryPage?: boolean;
  currentPage?: string;
  breadcrumbs?: BreadcrumbItem[];
  onNavigatePage?: (page: string) => void;
  onNavigateArticle?: () => void;
  onNavigateGraph?: () => void;
  onNavigateCategory?: () => void;
  onNavigateTags?: () => void;
  onNavigateStats?: () => void;
}

export const WikipediaSubheader: React.FC<WikipediaSubheaderProps> = ({
  isDarkMode,
  readingMinutes = 8,
  wordCount = 3500,
  title = '卫生棉条',
  badge = '[ 经期个人卫生用品 ]',
  isPolicyPage = false,
  isCategoryPage = false,
  isGraphPage = false,
  isTagsPage = false,
  isStatsPage = false,
  isEntryPage = false,
  currentPage = 'article',
  breadcrumbs,
  onNavigatePage,
  onNavigateArticle,
  onNavigateGraph,
  onNavigateCategory,
  onNavigateTags,
  onNavigateStats
}) => {
  return (
    <div className={`border-b transition-colors ${
      isDarkMode 
        ? 'bg-[#202122] border-[#54595d]' 
        : 'bg-white border-[#a2a9b1]'
    }`}>
      <div className="max-w-[1720px] mx-auto px-4">
        
        {/* Automated Breadcrumb Navigation */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="pt-3 pb-1 flex items-center gap-1.5 text-[11px] text-[#72777d] flex-wrap">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3 h-3 opacity-40 shrink-0" />}
                {b.active || !b.page ? (
                  <span className="font-semibold text-[#202122] dark:text-[#eaecf0]">
                    {b.label}
                  </span>
                ) : (
                  <button
                    onClick={() => onNavigatePage?.(b.page!)}
                    className="hover:text-[#3366cc] dark:hover:text-[#6699ff] hover:underline cursor-pointer transition-colors"
                  >
                    {b.label}
                  </button>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Title & Language Indicator Row */}
        <div className="pt-3 pb-4 flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-black/10 dark:border-white/10">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] tracking-tight">
                {title}
              </h1>
              {badge && (
                <span className="text-xs text-[#72777d] font-mono">
                  {badge}
                </span>
              )}
            </div>

            {/* Page Metadata & Reading Time */}
            {!isCategoryPage && !isGraphPage && !isTagsPage && (
              <div className="flex items-center gap-2.5 text-xs text-[#54595d] dark:text-[#a2a9b1] flex-wrap">
                <span>
                  {isPolicyPage ? (
                    <>来自 <strong className="text-[#202122] dark:text-white font-medium">MZ维基</strong> 全域官方制度与指引</>
                  ) : (
                    <>来自 <strong className="text-[#202122] dark:text-white font-medium">MZ维基</strong>，自由的百科全书</>
                  )}
                </span>
                
                <span className="text-[#a2a9b1] dark:text-[#54595d]">·</span>

                {/* Estimated Reading Time Badge */}
                <span 
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 text-[#3366cc] dark:text-[#6699ff] font-medium"
                  title="依据条目字数与中文平均阅读速率计算"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>预估阅读时间：约 {readingMinutes} 分钟</span>
                </span>

                <span className="text-[#a2a9b1] dark:text-[#54595d]">·</span>

                {/* Word Count Badge */}
                <span 
                  className="inline-flex items-center gap-1 text-[#72777d] dark:text-[#9aa0a6]"
                  title="正文总字数"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>全篇约 {wordCount.toLocaleString()} 字</span>
                </span>
              </div>
            )}

            {isGraphPage && (
              <div className="flex items-center gap-2.5 text-xs text-[#54595d] dark:text-[#a2a9b1]">
                <span>来自 <strong className="text-[#202122] dark:text-white font-medium">MZ维基</strong>，自由的百科全书</span>
                <span className="text-[#a2a9b1] dark:text-[#54595d]">·</span>
                <span className="text-[#3366cc] dark:text-[#6699ff] font-medium">多维语义拓扑分析系统</span>
              </div>
            )}

            {isTagsPage && (
              <div className="flex items-center gap-2.5 text-xs text-[#54595d] dark:text-[#a2a9b1]">
                <span>来自 <strong className="text-[#202122] dark:text-white font-medium">MZ维基</strong>，自由的百科全书</span>
                <span className="text-[#a2a9b1] dark:text-[#54595d]">·</span>
                <span className="text-[#3366cc] dark:text-[#6699ff] font-medium">全域实体标签与主题聚合网络</span>
              </div>
            )}

            {isStatsPage && (
              <div className="flex items-center gap-2.5 text-xs text-[#54595d] dark:text-[#a2a9b1]">
                <span>来自 <strong className="text-[#202122] dark:text-white font-medium">MZ维基</strong>，自由的百科全书</span>
                <span className="text-[#a2a9b1] dark:text-[#54595d]">·</span>
                <span className="text-[#059669] dark:text-[#34d399] font-medium font-mono">100% 自动派生全量数据审计与度量</span>
              </div>
            )}
          </div>

          {/* Quick Core View Tabs (Vector 2022 Tabs: 条目 | 统计 | 知识图谱 | 标签 | 分类) */}
          <div className="flex items-center gap-1 text-xs self-start md:self-end">
            {onNavigateArticle && (
              <button
                onClick={onNavigateArticle}
                className={`px-3 py-1.5 rounded-t border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentPage === 'article'
                    ? 'border-[#3366cc] text-[#3366cc] dark:text-[#6699ff] font-bold bg-[#3366cc]/5'
                    : 'border-transparent text-[#54595d] dark:text-[#a2a9b1] hover:text-[#202122] dark:hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>条目</span>
              </button>
            )}

            {onNavigateStats && (
              <button
                onClick={onNavigateStats}
                className={`px-3 py-1.5 rounded-t border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentPage === 'stats'
                    ? 'border-[#3366cc] text-[#3366cc] dark:text-[#6699ff] font-bold bg-[#3366cc]/5'
                    : 'border-transparent text-[#54595d] dark:text-[#a2a9b1] hover:text-[#202122] dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>内容统计</span>
              </button>
            )}

            {onNavigateGraph && (
              <button
                onClick={onNavigateGraph}
                className={`px-3 py-1.5 rounded-t border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentPage === 'graph'
                    ? 'border-[#3366cc] text-[#3366cc] dark:text-[#6699ff] font-bold bg-[#3366cc]/5'
                    : 'border-transparent text-[#54595d] dark:text-[#a2a9b1] hover:text-[#202122] dark:hover:text-white'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>知识图谱</span>
              </button>
            )}

            {onNavigateTags && (
              <button
                onClick={onNavigateTags}
                className={`px-3 py-1.5 rounded-t border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentPage === 'tags'
                    ? 'border-[#3366cc] text-[#3366cc] dark:text-[#6699ff] font-bold bg-[#3366cc]/5'
                    : 'border-transparent text-[#54595d] dark:text-[#a2a9b1] hover:text-[#202122] dark:hover:text-white'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>标签系统</span>
              </button>
            )}

            {onNavigateCategory && (
              <button
                onClick={onNavigateCategory}
                className={`px-3 py-1.5 rounded-t border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentPage === 'category'
                    ? 'border-[#3366cc] text-[#3366cc] dark:text-[#6699ff] font-bold bg-[#3366cc]/5'
                    : 'border-transparent text-[#54595d] dark:text-[#a2a9b1] hover:text-[#202122] dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>分类</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
