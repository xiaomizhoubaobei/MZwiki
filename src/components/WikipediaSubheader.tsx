import React from 'react';
import {
  Clock,
  BookOpen,
  GitBranch,
  Layers,
  FileText,
  Tag,
  ChevronRight,
  BarChart3,
  BookmarkCheck,
  Activity,
  Printer
} from 'lucide-react';
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
  onNavigateSanitaryPad?: () => void;
  onNavigateGraph?: () => void;
  onNavigateCategory?: () => void;
  onNavigateTags?: () => void;
  onNavigateStats?: () => void;
  onOpenCitation?: () => void;
  onOpenHealthRadar?: () => void;
  onPrint?: () => void;
  healthScore?: number;
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
  onNavigateSanitaryPad,
  onNavigateGraph,
  onNavigateCategory,
  onNavigateTags,
  onNavigateStats,
  onOpenCitation,
  onOpenHealthRadar,
  onPrint,
  healthScore = 98
}) => {
  const handleTriggerPrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className={`border-b transition-colors ${
      isEntryPage ? 'print:hidden no-print' : ''
    } ${
      isDarkMode
        ? 'bg-[#202122] border-[#54595d]'
        : 'bg-white border-[#a2a9b1]'
    }`}>
      <div className="max-w-[1720px] mx-auto px-4">

        {/* Automated Breadcrumb Navigation (Hidden during print) */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="pt-3 pb-1 flex items-center gap-1.5 text-[11px] text-[#72777d] flex-wrap print:hidden no-print">
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
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] print:text-black tracking-tight">
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
                    <>来自 <strong className="text-[#202122] dark:text-white print:text-black font-medium">MZ维基</strong> 全域官方制度与指引</>
                  ) : (
                    <>来自 <strong className="text-[#202122] dark:text-white print:text-black font-medium">MZ维基</strong>，自由的百科全书</>
                  )}
                </span>

                <span className="text-[#a2a9b1] dark:text-[#54595d] print:hidden">·</span>

                {/* Estimated Reading Time Badge */}
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 text-[#3366cc] dark:text-[#6699ff] font-medium print:hidden"
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
                  <BookOpen className="w-3.5 h-3.5 print:hidden" />
                  <span>全篇约 {wordCount.toLocaleString()} 字</span>
                </span>

                {/* Health Radar Trigger */}
                {onOpenHealthRadar && (currentPage === 'article' || currentPage === 'sanitary-pad' || isEntryPage) && (
                  <>
                    <span className="text-[#a2a9b1] dark:text-[#54595d] print:hidden">·</span>
                    <button
                      onClick={onOpenHealthRadar}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-medium transition-colors cursor-pointer print:hidden no-print"
                      title="查看本词条自动化质检与五维健康度雷达 (Health Radar)"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>条目质检 {healthScore}分</span>
                    </button>
                  </>
                )}

                {/* Scholarly Citation Generator Trigger */}
                {onOpenCitation && (currentPage === 'article' || currentPage === 'sanitary-pad' || isEntryPage) && (
                  <>
                    <span className="text-[#a2a9b1] dark:text-[#54595d] print:hidden">·</span>
                    <button
                      onClick={onOpenCitation}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#3366cc]/30 bg-[#3366cc]/5 hover:bg-[#3366cc]/15 text-[#3366cc] dark:text-[#6699ff] font-medium transition-colors cursor-pointer print:hidden no-print"
                      title="自动生成 GB/T 7714、APA、MLA、BibTeX 等学术引用格式"
                    >
                      <BookmarkCheck className="w-3.5 h-3.5" />
                      <span>引用此条目</span>
                    </button>
                  </>
                )}

                {/* Print Entry Button in Toolbar */}
                <span className="text-[#a2a9b1] dark:text-[#54595d] print:hidden">·</span>
                <button
                  onClick={handleTriggerPrint}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 hover:bg-[#3366cc]/10 hover:border-[#3366cc]/40 hover:text-[#3366cc] dark:hover:text-[#6699ff] text-[#202122] dark:text-[#eaecf0] font-medium transition-colors cursor-pointer print:hidden no-print"
                  title="触发浏览器打印对话框（自动隐藏侧边栏、搜索框与底部导航）"
                >
                  <Printer className="w-3.5 h-3.5 text-[#3366cc] dark:text-[#6699ff]" />
                  <span>打印条目</span>
                </button>
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

          {/* Quick Core View Tabs & Right-Side Print Tool (Hidden during print) */}
          <div className="flex items-center gap-1 text-xs self-start md:self-end flex-wrap print:hidden no-print">
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
                <span>卫生棉条</span>
              </button>
            )}

            {onNavigateSanitaryPad && (
              <button
                onClick={onNavigateSanitaryPad}
                className={`px-3 py-1.5 rounded-t border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentPage === 'sanitary-pad'
                    ? 'border-[#3366cc] text-[#3366cc] dark:text-[#6699ff] font-bold bg-[#3366cc]/5'
                    : 'border-transparent text-[#54595d] dark:text-[#a2a9b1] hover:text-[#202122] dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>卫生棉 (卫生巾)</span>
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

            {/* Right-side Print Entry Action Button */}
            <button
              onClick={handleTriggerPrint}
              className="ml-1 px-3 py-1.5 rounded border border-[#3366cc]/30 bg-[#3366cc]/10 hover:bg-[#3366cc] hover:text-white text-[#3366cc] dark:text-[#6699ff] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="打印当前条目（自动隐藏侧边栏、搜索框与底部导航）"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>打印条目</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
