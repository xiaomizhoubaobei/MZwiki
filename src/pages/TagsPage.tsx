import React, { useState, useMemo } from 'react';
import { 
  Tag as TagIcon, 
  Search, 
  Sparkles, 
  BookOpen, 
  GitBranch, 
  ExternalLink, 
  Layers, 
  Filter, 
  ArrowRight,
  ShieldAlert,
  Activity,
  Cpu,
  History,
  Scale,
  PackageCheck,
  CheckCircle2,
  X
} from 'lucide-react';
import { 
  getAllTags, 
  getTagsByCategories, 
  TAG_CATEGORIES, 
  TagDetail,
  TagCategoryMeta 
} from '../data/tagsData';
import { GraphNode } from '../data/knowledgeGraphData';
import { EntityImagePreview } from '../components/EntityImagePreview';
import { WikiText } from '../utils/wikiLinkScanner';

interface TagsPageProps {
  isDarkMode: boolean;
  onNavigateToArticle: (sectionId?: string) => void;
  onNavigateCategory: () => void;
  onNavigateGraph: (tagFilter?: string, initialNodeId?: string) => void;
  onNavigateWikiTerm?: (term: string) => void;
  initialSelectedTag?: string;
}

export const TagsPage: React.FC<TagsPageProps> = ({
  isDarkMode,
  onNavigateToArticle,
  onNavigateCategory,
  onNavigateGraph,
  onNavigateWikiTerm,
  initialSelectedTag
}) => {
  const allTags = useMemo(() => getAllTags(), []);
  const categorizedTags = useMemo(() => getTagsByCategories(), []);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>(initialSelectedTag || allTags[0]?.name || '');

  // Filter tags by query and category
  const filteredTags = useMemo(() => {
    return allTags.filter(tag => {
      const matchSearch = 
        !searchQuery.trim() || 
        tag.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        tag.description.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        tag.nodes.some(n => n.name.toLowerCase().includes(searchQuery.toLowerCase().trim()));

      const matchCat = selectedCategory === 'all' || tag.categoryKey === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [allTags, searchQuery, selectedCategory]);

  // Current active tag detail
  const activeTagDetail = useMemo(() => {
    return allTags.find(t => t.name === selectedTag) || filteredTags[0] || allTags[0];
  }, [allTags, filteredTags, selectedTag]);

  // Total stats
  const totalTagsCount = allTags.length;
  const totalTaggedNodesCount = useMemo(() => {
    const set = new Set<string>();
    allTags.forEach(t => t.nodes.forEach(n => set.add(n.id)));
    return set.size;
  }, [allTags]);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert': return ShieldAlert;
      case 'PackageCheck': return PackageCheck;
      case 'Activity': return Activity;
      case 'History': return History;
      case 'Cpu': return Cpu;
      case 'Scale': return Scale;
      default: return TagIcon;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Wikipedia Special Page Header Ribbon */}
      <div className={`p-4 sm:p-5 rounded border transition-colors ${
        isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-[#f8f9fa] border-[#c8ccd1]'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#3366cc] dark:text-[#6699ff] bg-[#3366cc]/10 px-2 py-0.5 rounded">
                Special:Tags
              </span>
              <span className="text-xs text-[#72777d]">特殊页面 · 全域知识实体标签系统</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#202122] dark:text-white flex items-center gap-2.5">
              <TagIcon className="w-6 h-6 text-[#3366cc] dark:text-[#6699ff]" />
              <span>知识标签与主题索引</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#54595d] dark:text-[#bdc1c6] max-w-3xl leading-relaxed">
              MZ维基标签系统为全域条目、微观属性与病理/解剖/社会事实建立多维语义索引。通过结构化标签，可跨越单一分类界限，快速聚合跨学科的知识实体与前沿文献。
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateGraph(selectedTag)}
              className="px-3 py-1.5 rounded bg-[#3366cc] hover:bg-[#2a4b8d] text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="在知识图谱中查看此标签实体网络"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>知识图谱联动</span>
            </button>
            <button
              onClick={() => onNavigateCategory()}
              className="px-3 py-1.5 rounded border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs text-[#54595d] dark:text-[#a2a9b1] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>分类总览</span>
            </button>
          </div>
        </div>

        {/* Statistical Summary Pills */}
        <div className="mt-4 pt-3.5 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#72777d] font-medium mr-1">系统规模：</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-black/5 dark:bg-white/5 text-[#202122] dark:text-white font-mono text-xs">
            <strong>{TAG_CATEGORIES.length}</strong> 知识维度
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#3366cc]/10 text-[#3366cc] dark:text-[#6699ff] font-mono text-xs">
            <strong>{totalTagsCount}</strong> 个实体标签
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs">
            <strong>{totalTaggedNodesCount}</strong> 个聚合词条
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-xs">
            <strong>33</strong> 组双向交叉关联
          </span>
        </div>
      </div>

      {/* 2. Search & Dimension Filter Bar */}
      <div className={`p-3.5 rounded border transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
        isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-white border-[#c8ccd1]'
      }`}>
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#72777d]" />
          <input
            type="text"
            placeholder="搜索标签名、词条名或概念描述 (如: TSS、乳杆菌、纯棉、专利...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-8 py-2 rounded text-xs border focus:outline-none focus:ring-1 focus:ring-[#3366cc] transition-colors ${
              isDarkMode 
                ? 'bg-[#151617] border-[#54595d] text-[#eaecf0] placeholder-[#72777d]' 
                : 'bg-[#f8f9fa] border-[#c8ccd1] text-[#202122] placeholder-[#a2a9b1]'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#72777d] hover:text-[#202122] dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dimension Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1.5 rounded transition-all cursor-pointer font-medium ${
              selectedCategory === 'all'
                ? 'bg-[#3366cc] text-white shadow-xs'
                : isDarkMode
                  ? 'bg-[#151617] text-[#a2a9b1] hover:text-white border border-[#3a3d42]'
                  : 'bg-[#f8f9fa] text-[#54595d] hover:text-[#202122] border border-[#e5e7eb]'
            }`}
          >
            全部维度 ({allTags.length})
          </button>
          {TAG_CATEGORIES.map(cat => {
            const Icon = getCategoryIcon(cat.iconName);
            const isCatActive = selectedCategory === cat.key;
            const count = allTags.filter(t => t.categoryKey === cat.key).length;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-2 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
                  isCatActive
                    ? 'bg-[#202122] text-white dark:bg-white dark:text-[#202122] shadow-xs'
                    : isDarkMode
                      ? 'bg-[#151617] text-[#a2a9b1] hover:text-white border border-[#3a3d42]'
                      : 'bg-[#f8f9fa] text-[#54595d] hover:text-[#202122] border border-[#e5e7eb]'
                }`}
              >
                <Icon className="w-3 h-3" style={{ color: isCatActive ? undefined : (isDarkMode ? cat.darkColor : cat.color) }} />
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Split View: Tag Matrix (Left) + Active Tag Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Categorized Tag Cloud & Badges (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {categorizedTags
            .filter(group => selectedCategory === 'all' || group.category.key === selectedCategory)
            .map(group => {
              const Icon = getCategoryIcon(group.category.iconName);
              const visibleTags = group.tags.filter(t => filteredTags.some(ft => ft.name === t.name));
              if (visibleTags.length === 0) return null;

              return (
                <div 
                  key={group.category.key}
                  className={`p-4 rounded border transition-colors ${
                    isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-white border-[#c8ccd1]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" style={{ color: isDarkMode ? group.category.darkColor : group.category.color }} />
                      <h3 className="font-bold text-sm text-[#202122] dark:text-white">
                        {group.category.name}
                      </h3>
                      <span className="text-[11px] text-[#72777d] font-mono">
                        ({group.category.enName})
                      </span>
                    </div>
                    <span className="text-xs text-[#72777d] font-mono">
                      {visibleTags.length} 标签
                    </span>
                  </div>

                  <p className="text-xs text-[#72777d] mb-3 leading-relaxed">
                    {group.category.description}
                  </p>

                  {/* Tag Chips */}
                  <div className="flex flex-wrap gap-2">
                    {visibleTags.map(tag => {
                      const isSelected = selectedTag === tag.name;
                      return (
                        <button
                          key={tag.name}
                          onClick={() => setSelectedTag(tag.name)}
                          className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#3366cc] text-white border-[#3366cc] shadow-sm font-semibold scale-102'
                              : isDarkMode
                                ? 'bg-[#151617] hover:bg-[#2c3036] border-[#3a3d42] text-[#eaecf0]'
                                : 'bg-[#f8f9fa] hover:bg-white border-[#e5e7eb] text-[#202122]'
                          }`}
                        >
                          <TagIcon className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-[#72777d] group-hover:text-[#3366cc]'}`} />
                          <span>#{tag.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : isDarkMode
                                ? 'bg-[#202122] text-[#a2a9b1]'
                                : 'bg-black/5 text-[#54595d]'
                          }`}>
                            {tag.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          {filteredTags.length === 0 && (
            <div className={`p-8 text-center rounded border ${
              isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-white border-[#c8ccd1]'
            }`}>
              <TagIcon className="w-8 h-8 mx-auto text-[#72777d] mb-2 opacity-50" />
              <p className="text-sm font-bold text-[#202122] dark:text-white">未找到匹配标签</p>
              <p className="text-xs text-[#72777d] mt-1">请尝试更换检索关键词或重置维度筛选。</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-3 px-3 py-1.5 rounded bg-[#3366cc] text-white text-xs cursor-pointer"
              >
                重置所有筛选
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Active Tag Details & Associated Wikipedia Articles (5 cols) */}
        <div className="lg:col-span-5">
          {activeTagDetail ? (
            <div className={`sticky top-20 p-5 rounded border transition-colors space-y-4 ${
              isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-white border-[#c8ccd1]'
            }`}>
              {/* Active Tag Header */}
              <div className="flex items-start justify-between gap-3 border-b border-black/5 dark:border-white/5 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider font-semibold" style={{
                      backgroundColor: isDarkMode ? `${activeTagDetail.darkColor}20` : `${activeTagDetail.color}15`,
                      color: isDarkMode ? activeTagDetail.darkColor : activeTagDetail.color
                    }}>
                      {activeTagDetail.categoryName}
                    </span>
                    <span className="text-xs text-[#72777d]">共包含 {activeTagDetail.nodes.length} 个条目</span>
                  </div>
                  <h2 className="text-xl font-bold font-serif text-[#202122] dark:text-white flex items-center gap-1.5">
                    <TagIcon className="w-4 h-4 text-[#3366cc]" />
                    <span>#{activeTagDetail.name}</span>
                  </h2>
                </div>

                <button
                  onClick={() => onNavigateGraph(activeTagDetail.name)}
                  className="px-2.5 py-1.5 rounded bg-[#3366cc] hover:bg-[#2a4b8d] text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
                  title="以此标签在知识图谱中过滤实体"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>图谱展开</span>
                </button>
              </div>

              {/* Tag Semantic Description */}
              <div className={`p-3 rounded text-xs leading-relaxed border ${
                isDarkMode ? 'bg-[#18191a] border-[#3a3d42] text-[#eaecf0]' : 'bg-[#f8f9fa] border-[#e5e7eb] text-[#54595d]'
              }`}>
                <p className="font-sans">
                  <WikiText onNavigateWikiTerm={onNavigateWikiTerm}>
                    {activeTagDetail.description}
                  </WikiText>
                </p>
              </div>

              {/* Direct Encyclopedic Entry Mapping Banner */}
              <div className={`p-3 rounded border flex items-center justify-between gap-2.5 transition-colors ${
                isDarkMode 
                  ? 'bg-blue-950/20 border-blue-900/40 text-[#eaecf0]' 
                  : 'bg-blue-50/60 border-blue-200 text-[#202122]'
              }`}>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#3366cc] dark:text-[#6699ff] font-semibold">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>对应核心百科词条：</span>
                  </div>
                  <div className="text-sm font-bold text-[#202122] dark:text-white truncate">
                    《{activeTagDetail.correspondingEntryTitle}》
                  </div>
                </div>

                <button
                  onClick={() => onNavigateWikiTerm ? onNavigateWikiTerm(activeTagDetail.correspondingEntryTitle) : onNavigateToArticle()}
                  className="px-3 py-1.5 rounded bg-[#3366cc] hover:bg-[#2a4b8d] text-white text-xs font-medium shrink-0 cursor-pointer flex items-center gap-1 shadow-xs transition-colors"
                  title={`阅读《${activeTagDetail.correspondingEntryTitle}》完整百科词条`}
                >
                  <span>阅读百科词条</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Automated Co-occurring Tags Network */}
              {activeTagDetail.coOccurringTags && activeTagDetail.coOccurringTags.length > 0 && (
                <div className="space-y-2 p-3 rounded-lg border border-black/5 dark:border-white/5 bg-black/[0.015] dark:bg-white/[0.015]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#54595d] dark:text-[#a2a9b1]">
                    <span className="flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-[#3366cc] dark:text-[#6699ff]" />
                      <span>拓扑共现标签网络 ({activeTagDetail.coOccurringTags.length})</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#72777d]">点击切换透视</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {activeTagDetail.coOccurringTags.map(co => (
                      <button
                        key={co.tag}
                        onClick={() => setSelectedTag(co.tag)}
                        className="px-2 py-1 rounded text-xs bg-white dark:bg-[#1f2022] hover:bg-[#3366cc]/10 hover:text-[#3366cc] dark:hover:text-[#6699ff] border border-black/10 dark:border-white/10 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                        title={`共同关联于: ${co.sharedNodeNames.join('、')}`}
                      >
                        <TagIcon className="w-2.5 h-2.5 opacity-60 text-[#3366cc]" />
                        <span>#{co.tag}</span>
                        <span className="text-[10px] px-1 py-0.2 rounded-full bg-black/5 dark:bg-white/10 font-mono text-[#72777d]">
                          {co.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Associated Wikipedia Entries */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#72777d]">
                  <span>关联的百科词条与知识实体 ({activeTagDetail.nodes.length})</span>
                </div>

                <div className="space-y-3">
                  {activeTagDetail.nodes.map(node => (
                    <div 
                      key={node.id}
                      className={`p-3 rounded border transition-all ${
                        isDarkMode ? 'bg-[#151617] border-[#3a3d42] hover:border-[#6699ff]/50' : 'bg-white border-[#e5e7eb] hover:border-[#3366cc]/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Micro Image Thumbnail */}
                        <div className="w-20 h-16 shrink-0 rounded overflow-hidden border border-black/10 dark:border-white/10">
                          <EntityImagePreview node={node} isDarkMode={isDarkMode} />
                        </div>

                        {/* Title and summary */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-xs text-[#202122] dark:text-white truncate">
                              {node.name}
                            </h4>
                            <span className="text-[10px] text-[#72777d] font-mono shrink-0">
                              {node.categoryLabel}
                            </span>
                          </div>
                          
                          <p className="text-[11px] text-[#72777d] line-clamp-2 leading-relaxed">
                            {node.summary}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 pt-1 flex-wrap">
                            <button
                              onClick={() => onNavigateWikiTerm ? onNavigateWikiTerm(node.name) : onNavigateToArticle()}
                              className="text-[11px] text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>阅读百科词条</span>
                            </button>

                            {node.inArticleSectionId && (
                              <>
                                <span className="text-[#72777d] text-[10px]">·</span>
                                <button
                                  onClick={() => onNavigateToArticle(node.inArticleSectionId)}
                                  className="text-[11px] text-[#54595d] dark:text-[#a2a9b1] hover:underline cursor-pointer flex items-center gap-1"
                                >
                                  <span>主条目对应章节</span>
                                </button>
                              </>
                            )}

                            <span className="text-[#72777d] text-[10px]">·</span>

                            <button
                              onClick={() => onNavigateGraph(undefined, node.id)}
                              className="text-[11px] text-[#54595d] dark:text-[#a2a9b1] hover:text-[#3366cc] dark:hover:text-[#6699ff] cursor-pointer flex items-center gap-1 font-mono"
                            >
                              <GitBranch className="w-3 h-3" />
                              <span>聚焦实体</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tag Quick Actions Footer */}
              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-[#72777d]">
                <span>标签代码：<code>#{activeTagDetail.name}</code></span>
                <button
                  onClick={() => onNavigateGraph(activeTagDetail.name)}
                  className="text-[#3366cc] dark:text-[#6699ff] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <span>全屏探索关联拓扑</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className={`p-6 rounded border text-center text-xs text-[#72777d] ${
              isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-white border-[#c8ccd1]'
            }`}>
              请选择左侧任意标签查看详细聚合词条。
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
