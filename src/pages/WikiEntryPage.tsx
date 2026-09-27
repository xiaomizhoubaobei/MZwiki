import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  GitBranch, 
  Tag as TagIcon, 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  Check, 
  Sparkles, 
  Info, 
  Layers,
  ChevronRight,
  Award
} from 'lucide-react';
import { WikiEntry } from '../data/wikiEntriesData';
import { EntityImagePreview } from '../components/EntityImagePreview';
import { GRAPH_NODES } from '../data/knowledgeGraphData';
import { WikiText } from '../utils/wikiLinkScanner';
import { getWikiEntryStats, ArticleContentStats } from '../utils/contentStatisticsAutomation';
import { fetchArticleStatisticsByIdApi } from '../services/statisticsApi';

interface WikiEntryPageProps {
  entry: WikiEntry;
  isDarkMode: boolean;
  onNavigateToArticle: (sectionId?: string) => void;
  onNavigateWikiTerm: (term: string) => void;
  onNavigateGraph: (tagFilter?: string, nodeId?: string) => void;
  onNavigateTags: (tag?: string) => void;
  onNavigateCategory: () => void;
  onOpenWikiLink?: (term: string, event: React.MouseEvent) => void;
}

export const WikiEntryPage: React.FC<WikiEntryPageProps> = ({
  entry,
  isDarkMode,
  onNavigateToArticle,
  onNavigateWikiTerm,
  onNavigateGraph,
  onNavigateTags,
  onNavigateCategory,
  onOpenWikiLink
}) => {
  const [copied, setCopied] = useState(false);

  // Automated Article Content Statistics (synced from API)
  const [entryStats, setEntryStats] = useState<ArticleContentStats>(() => getWikiEntryStats(entry));

  useEffect(() => {
    setEntryStats(getWikiEntryStats(entry));
    fetchArticleStatisticsByIdApi(entry.id).then(res => {
      setEntryStats(res.data);
    });
  }, [entry]);

  // Find matching graph node if available for vector graphics
  const matchingNode = GRAPH_NODES.find(n => n.name === entry.title || n.id === entry.id) || {
    id: entry.id,
    name: entry.title,
    pinyin: entry.enTitle,
    category: entry.category,
    categoryLabel: entry.categoryLabel,
    val: 20,
    summary: entry.summary,
    tags: entry.tags,
    imageUrl: entry.imageUrl
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Wikipedia Breadcrumb Navigation Header */}
      <div className={`p-4 rounded border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
        isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-[#f8f9fa] border-[#c8ccd1]'
      }`}>
        <div className="flex items-center gap-1.5 flex-wrap text-[#54595d] dark:text-[#a2a9b1]">
          <button 
            onClick={() => onNavigateToArticle()} 
            className="text-[#3366cc] dark:text-[#6699ff] hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>典范条目: 卫生棉条</span>
          </button>
          <span>/</span>
          <button 
            onClick={() => onNavigateCategory()} 
            className="hover:underline cursor-pointer"
          >
            {entry.categoryLabel}
          </button>
          <span>/</span>
          <span className="text-[#202122] dark:text-white font-semibold">
            {entry.title}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateGraph(undefined, matchingNode.id)}
            className="px-2.5 py-1 rounded bg-[#3366cc] hover:bg-[#2a4b8d] text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
            title="在知识图谱中查看此实体拓扑"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>知识图谱</span>
          </button>
          <button
            onClick={handleShare}
            className="px-2.5 py-1 rounded border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs text-[#54595d] dark:text-[#a2a9b1] transition-colors cursor-pointer flex items-center gap-1"
            title="复制本词条分享链接"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? '已复制' : '分享'}</span>
          </button>
        </div>
      </div>

      {/* 2. Article Title Block (Vector 2022 Style) */}
      <div className="border-b border-[#a2a9b1] dark:border-[#54595d] pb-2">
        <div className="flex items-center gap-2 text-xs text-[#72777d] mb-1 font-mono">
          <span>词条实体 · 百科全书权威条目</span>
          <span>·</span>
          <span>维基代号: {entry.id}</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#202122] dark:text-white flex items-center gap-3">
          <span>{entry.title}</span>
        </h1>
        <div className="text-sm text-[#54595d] dark:text-[#a2a9b1] mt-1 font-sans">
          外文名：<span lang="en" className="italic font-serif">{entry.enTitle}</span>
          {entry.aliases.length > 0 && (
            <span className="ml-3 text-xs opacity-80">
              别称：{entry.aliases.join('、')}
            </span>
          )}
        </div>
      </div>

      {/* Automated Article Statistics & Quality Metadata Bar */}
      <div className={`px-4 py-2.5 rounded border text-xs flex flex-wrap items-center justify-between gap-3 transition-colors ${
        isDarkMode ? 'bg-[#18191a] border-[#3a3d42]' : 'bg-[#f8f9fa] border-[#e5e7eb]'
      }`}>
        <div className="flex items-center gap-3 flex-wrap text-[#54595d] dark:text-[#a2a9b1]">
          <span className="flex items-center gap-1 font-semibold text-[#059669] dark:text-[#34d399]">
            <Award className="w-3.5 h-3.5" />
            <span>{entryStats.qualityLabel}</span>
          </span>
          <span className="opacity-40">·</span>
          <span>正文约 <strong className="font-semibold text-[#202122] dark:text-white">{entryStats.metrics.wordCount.toLocaleString()}</strong> 字</span>
          <span className="opacity-40">·</span>
          <span>预估阅读需 <strong className="font-semibold text-[#202122] dark:text-white">{entryStats.metrics.readingMinutes}</strong> 分钟</span>
          <span className="opacity-40">·</span>
          <span><strong className="font-semibold text-[#202122] dark:text-white">{entryStats.paragraphCount}</strong> 段落 / <strong className="font-semibold text-[#202122] dark:text-white">{entryStats.sectionCount}</strong> 章节</span>
          <span className="opacity-40">·</span>
          <span><strong className="font-semibold text-[#202122] dark:text-white">{entryStats.referenceCount}</strong> 篇规范文献</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-[#72777d]">
          <span>版本: {entryStats.revisionVersion}</span>
          <span>·</span>
          <span>CC BY-SA 4.0</span>
        </div>
      </div>

      {/* 3. Main Encyclopedic Body & Infobox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Article Sections & References (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Lead Summary Paragraph */}
          <div className={`p-4 rounded border text-sm sm:text-base leading-relaxed text-justify transition-colors ${
            isDarkMode ? 'bg-[#18191a] border-[#3a3d42] text-[#eaecf0]' : 'bg-[#fcfdfd] border-[#e5e7eb] text-[#202122]'
          }`}>
            <p className="font-serif">
              <strong className="font-bold mr-1.5">{entry.title}</strong>
              <WikiText
                onOpenWikiLink={onOpenWikiLink}
                onNavigateWikiTerm={onNavigateWikiTerm}
                excludeTerms={[entry.title, ...entry.aliases]}
              >
                {entry.summary}
              </WikiText>
            </p>
          </div>

          {/* Quick Section Anchor Card (TOC) */}
          {entry.contentSections.length > 0 && (
            <div className={`p-3.5 rounded border text-xs transition-colors ${
              isDarkMode ? 'bg-[#202122] border-[#3a3d42]' : 'bg-[#f8f9fa] border-[#c8ccd1]'
            }`}>
              <div className="font-bold text-[#202122] dark:text-white mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#3366cc]" />
                <span>目录（Contents）</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2">
                {entry.contentSections.map((sec, idx) => (
                  <li key={idx}>
                    <a
                      href={`#sec-${idx}`}
                      className="text-[#3366cc] dark:text-[#6699ff] hover:underline flex items-center gap-1"
                    >
                      <ChevronRight className="w-3 h-3 opacity-60" />
                      <span>{idx + 1}. {sec.title}</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#sec-references"
                    className="text-[#3366cc] dark:text-[#6699ff] hover:underline flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 opacity-60" />
                    <span>{entry.contentSections.length + 1}. 学术参考文献</span>
                  </a>
                </li>
              </ul>
            </div>
          )}

          {/* Detailed Content Sections */}
          <div className="space-y-6">
            {entry.contentSections.map((sec, idx) => (
              <section key={idx} id={`sec-${idx}`} className="space-y-3">
                <h2 className="text-xl font-serif font-bold text-[#202122] dark:text-white border-b border-[#c8ccd1] dark:border-[#54595d] pb-1 flex items-center gap-2">
                  <span className="text-sm font-sans text-[#72777d]">{idx + 1}</span>
                  <span>{sec.title}</span>
                </h2>
                <div className="space-y-3 text-sm leading-relaxed text-justify text-[#202122] dark:text-[#eaecf0]">
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>
                      <WikiText
                        onOpenWikiLink={onOpenWikiLink}
                        onNavigateWikiTerm={onNavigateWikiTerm}
                        excludeTerms={[entry.title, ...entry.aliases]}
                      >
                        {p}
                      </WikiText>
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Academic References Section */}
          <section id="sec-references" className="space-y-3 pt-3 border-t border-[#c8ccd1] dark:border-[#54595d]">
            <h3 className="text-lg font-serif font-bold text-[#202122] dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#3366cc]" />
              <span>学术参考文献（Academic References）</span>
            </h3>
            <ol className="list-decimal pl-5 space-y-2 text-xs text-[#54595d] dark:text-[#a2a9b1]">
              {entry.academicReferences.map((ref, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span className="text-[#202122] dark:text-white font-medium">"{ref.title}"</span>. 
                  <span className="italic ml-1">{ref.journal}</span> ({ref.year}).
                  {ref.doiOrUrl && (
                    <span className="ml-1.5 text-[#3366cc] dark:text-[#6699ff] font-mono">
                      DOI: {ref.doiOrUrl}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </section>

          {/* Related Terms Box */}
          {entry.relatedTerms.length > 0 && (
            <div className={`p-4 rounded border text-xs space-y-2 transition-colors ${
              isDarkMode ? 'bg-[#202122] border-[#3a3d42]' : 'bg-[#f8f9fa] border-[#c8ccd1]'
            }`}>
              <div className="font-bold text-[#202122] dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#e67e22]" />
                <span>相关维基条目（See Also）</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {entry.relatedTerms.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => onNavigateWikiTerm(term)}
                    className="px-2.5 py-1 rounded bg-black/5 dark:bg-white/5 hover:bg-[#3366cc]/10 hover:text-[#3366cc] dark:hover:text-[#6699ff] text-[#202122] dark:text-[#eaecf0] cursor-pointer transition-colors flex items-center gap-1 border border-black/5 dark:border-white/5"
                  >
                    <span>{term}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Article Tags */}
          <div className={`p-3 rounded border text-xs flex items-center gap-2 flex-wrap transition-colors ${
            isDarkMode ? 'bg-[#1a1c1e] border-[#3a3d42]' : 'bg-[#f8f9fa] border-[#c8ccd1]'
          }`}>
            <span className="font-bold text-[#72777d] flex items-center gap-1">
              <TagIcon className="w-3.5 h-3.5 text-[#3366cc]" />
              <span>条目所属标签：</span>
            </span>
            {entry.tags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => onNavigateTags(tag)}
                className="px-2 py-0.5 rounded-full bg-[#3366cc]/10 hover:bg-[#3366cc]/20 text-[#3366cc] dark:text-[#6699ff] cursor-pointer font-mono text-[11px] transition-colors"
                title={`在标签系统中查看包含 #${tag} 的所有条目`}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Link back to Main Featured Article Section */}
          {entry.inArticleSectionId && (
            <div className={`p-4 rounded border text-xs flex items-center justify-between gap-3 ${
              isDarkMode ? 'bg-[#1b2430] border-[#334b6b]' : 'bg-[#f0f6ff] border-[#c2dbff]'
            }`}>
              <div className="space-y-0.5">
                <span className="font-bold text-[#3366cc] dark:text-[#6699ff]">
                  典范条目关联：
                </span>
                <p className="text-[#54595d] dark:text-[#bdc1c6]">
                  本词条在典范条目《卫生棉条》中有深入的对应章节讨论与使用指南。
                </p>
              </div>
              <button
                onClick={() => onNavigateToArticle(entry.inArticleSectionId)}
                className="px-3 py-1.5 rounded bg-[#3366cc] hover:bg-[#2a4b8d] text-white font-medium cursor-pointer shrink-0 transition-colors flex items-center gap-1"
              >
                <span>阅读该章节 »</span>
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Wikipedia Standard Infobox (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Infobox Container */}
          <div className={`rounded border overflow-hidden text-xs transition-colors shadow-xs ${
            isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-[#fdfdfd] border-[#a2a9b1]'
          }`}>
            {/* Infobox Header */}
            <div className="p-3 bg-[#eaecf0] dark:bg-[#2c3036] border-b border-[#c8ccd1] dark:border-[#54595d] text-center">
              <h3 className="font-bold text-sm text-[#202122] dark:text-white">
                {entry.title}
              </h3>
              <p className="text-[11px] text-[#72777d] italic font-serif">
                {entry.enTitle}
              </p>
            </div>

            {/* Infobox Media / Illustration */}
            <div className="p-2 border-b border-[#c8ccd1] dark:border-[#54595d] bg-[#f8f9fa] dark:bg-[#151617]">
              <EntityImagePreview node={matchingNode} isDarkMode={isDarkMode} />
            </div>

            {/* Infobox Key-Value Rows */}
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-[#e5e7eb] dark:border-[#3a3d42]">
                  <th className="p-2.5 font-bold text-[#54595d] dark:text-[#a2a9b1] bg-black/5 dark:bg-white/5 w-1/3 align-top">
                    所属领域
                  </th>
                  <td className="p-2.5 text-[#202122] dark:text-[#eaecf0]">
                    {entry.categoryLabel}
                  </td>
                </tr>
                {entry.infobox.map((row, idx) => (
                  <tr key={idx} className="border-b border-[#e5e7eb] dark:border-[#3a3d42] last:border-0">
                    <th className="p-2.5 font-bold text-[#54595d] dark:text-[#a2a9b1] bg-black/5 dark:bg-white/5 w-1/3 align-top">
                      {row.label}
                    </th>
                    <td className="p-2.5 text-[#202122] dark:text-[#eaecf0] leading-relaxed">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Actions Panel */}
          <div className={`p-4 rounded border text-xs space-y-2.5 transition-colors ${
            isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-[#f8f9fa] border-[#c8ccd1]'
          }`}>
            <span className="font-bold text-[#72777d] uppercase tracking-wider text-[10px]">
              知识导航交互
            </span>
            <div className="space-y-1.5">
              <button
                onClick={() => onNavigateGraph(undefined, matchingNode.id)}
                className="w-full text-left px-3 py-2 rounded bg-black/5 dark:bg-white/5 hover:bg-[#3366cc]/10 hover:text-[#3366cc] dark:hover:text-[#6699ff] text-[#202122] dark:text-[#eaecf0] cursor-pointer transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-[#3366cc]" />
                  <span>在知识图谱中查看此实体拓扑</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => onNavigateTags(entry.tags[0])}
                className="w-full text-left px-3 py-2 rounded bg-black/5 dark:bg-white/5 hover:bg-[#3366cc]/10 hover:text-[#3366cc] dark:hover:text-[#6699ff] text-[#202122] dark:text-[#eaecf0] cursor-pointer transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <TagIcon className="w-3.5 h-3.5 text-[#059669]" />
                  <span>在标签系统中检索 #{entry.tags[0]}</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => onNavigateCategory()}
                className="w-full text-left px-3 py-2 rounded bg-black/5 dark:bg-white/5 hover:bg-[#3366cc]/10 hover:text-[#3366cc] dark:hover:text-[#6699ff] text-[#202122] dark:text-[#eaecf0] cursor-pointer transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#7c3aed]" />
                  <span>返回分类索引（Category）</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
