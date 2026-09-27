import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  X, 
  SlidersHorizontal, 
  ChevronRight,
  Sparkles,
  ListFilter,
  GitBranch,
  Layers,
  Tag,
  BarChart3
} from 'lucide-react';
import { SectionDef, ARTICLE_SECTIONS } from '../data/articleData';

interface WikipediaHeaderProps {
  onOpenAppearance: () => void;
  onNavigateSection: (sectionId: string) => void;
  isDarkMode: boolean;
  onOpenPolicy?: (tab: 'privacy' | 'disclaimer' | 'conduct') => void;
  onNavigateHome?: () => void;
  onNavigateArticle?: (sectionId?: string) => void;
  onNavigateCategory?: () => void;
  onNavigateGraph?: () => void;
  onNavigateTags?: () => void;
  onNavigateStats?: () => void;
  onNavigateNotFound?: (missingTerm?: string) => void;
  currentSections?: SectionDef[];
  activeSectionId?: string;
  currentPageTitle?: string;
  currentPage?: string;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const WikipediaHeader: React.FC<WikipediaHeaderProps> = ({
  onOpenAppearance,
  onNavigateSection,
  isDarkMode,
  onOpenPolicy,
  onNavigateHome,
  onNavigateArticle,
  onNavigateCategory,
  onNavigateGraph,
  onNavigateTags,
  onNavigateStats,
  onNavigateNotFound,
  currentSections = ARTICLE_SECTIONS,
  activeSectionId = 'top',
  currentPageTitle = '卫生棉条',
  currentPage = 'home',
  onToggleSidebar,
  isSidebarOpen = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions and menu dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K or / to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const input = searchContainerRef.current?.querySelector('input');
        input?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Policy pages list for search
  const policySearchItems = [
    { type: 'graph' as const, key: 'graph' as const, title: 'Special:知识图谱', desc: '卫生棉条与生理健康概念多维拓扑网络' },
    { type: 'category' as const, key: 'category' as const, title: 'Category:女性生理用品', desc: '女性经期护理、体内与体外用品全部分类' },
    { type: 'policy' as const, key: 'privacy' as const, title: 'MZ维基:隐私政策', desc: '官方核心隐私权与数据保护方针' },
    { type: 'policy' as const, key: 'disclaimer' as const, title: 'MZ维基:免责声明', desc: '医学健康、TSS急症与法律免责声明' },
    { type: 'policy' as const, key: 'conduct' as const, title: 'MZ维基:全域行为准则', desc: '普遍行为准则、反经期羞辱与文明公约' },
    { type: 'article' as const, key: 'article' as const, title: '卫生棉条 (Tampon)', desc: '主要医学科普与经期健康百科条目' }
  ];

  // Flattened article sections for quick search inside this entry
  const searchableSections = ARTICLE_SECTIONS.flatMap(sec => [
    { id: sec.id, title: sec.title, number: sec.number },
    ...(sec.subsections || []).map(sub => ({
      id: sub.id,
      title: sub.title,
      number: sub.number
    }))
  ]);

  const filteredSections = searchQuery.trim()
    ? searchableSections.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.number.includes(searchQuery)
      )
    : [];

  const filteredPolicies = searchQuery.trim()
    ? policySearchItems.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors ${
      isDarkMode 
        ? 'bg-[#202122] border-[#54595d] text-[#eaecf0]' 
        : 'bg-white border-[#c8ccd1] text-[#202122]'
    }`}>
      <div className="max-w-[1720px] mx-auto px-4 h-14 flex items-center justify-between gap-4">
        
        {/* Left Side: Navigation Dropdown & Wikipedia Logo */}
        <div ref={menuContainerRef} className="flex items-center gap-3 shrink-0 relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2 rounded transition-colors focus:outline-none cursor-pointer ${
              isMenuOpen 
                ? 'bg-black/10 dark:bg-white/20 text-[#3366cc]' 
                : 'hover:bg-black/5 dark:hover:bg-white/10 text-[#54595d] dark:text-[#a2a9b1]'
            }`}
            aria-label="主菜单"
            title="主菜单"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Compact Dropdown Popover (NOT a drawer, attached to button) */}
          {isMenuOpen && (
            <div className={`absolute left-0 top-full mt-2 w-64 rounded-md shadow-xl border p-2 text-xs z-50 animate-in fade-in zoom-in-95 duration-100 ${
              isDarkMode ? 'bg-[#202122] border-[#54595d] text-[#eaecf0]' : 'bg-white border-[#c8ccd1] text-[#202122]'
            }`}>
              <div className="px-2 py-1 font-bold text-[10px] text-[#72777d] uppercase tracking-wider border-b border-black/5 dark:border-white/5 mb-1 flex items-center justify-between">
                <span>MZ维基 主菜单</span>
                <span className="font-normal font-mono text-[9px] text-[#3366cc]">全站导航</span>
              </div>
              <ul className="space-y-0.5">
                <li>
                  <a
                    href="/wiki/Wikipedia:首页"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateHome?.();
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors cursor-pointer ${
                      currentPage === 'home'
                        ? 'bg-[#3366cc]/10 text-[#3366cc] font-semibold'
                        : 'hover:bg-black/5 dark:hover:bg-white/10 text-[#202122] dark:text-[#eaecf0]'
                    }`}
                  >
                    <span>🏠 MZ维基 首页</span>
                    <span className="text-[10px] text-[#72777d]">/wiki/首页</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/wiki/卫生棉条"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateArticle ? onNavigateArticle() : onNavigateSection('top');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors cursor-pointer ${
                      currentPage === 'article'
                        ? 'bg-[#3366cc]/10 text-[#3366cc] font-semibold'
                        : 'hover:bg-black/5 dark:hover:bg-white/10 text-[#202122] dark:text-[#eaecf0]'
                    }`}
                  >
                    <span>📖 今日典范：卫生棉条</span>
                    <span className="text-[10px] text-[#72777d]">/wiki/卫生棉条</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/wiki/Special:知识图谱"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateGraph?.();
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors cursor-pointer ${
                      currentPage === 'graph'
                        ? 'bg-[#3366cc]/10 text-[#3366cc] font-semibold'
                        : 'hover:bg-black/5 dark:hover:bg-white/10 text-[#202122] dark:text-[#eaecf0]'
                    }`}
                  >
                    <span>🕸️ 知识图谱可视化</span>
                    <span className="text-[10px] text-[#3366cc] font-mono">Special:图谱</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/wiki/Special:统计"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateStats?.();
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors cursor-pointer ${
                      currentPage === 'stats'
                        ? 'bg-[#3366cc]/10 text-[#3366cc] font-semibold'
                        : 'hover:bg-black/5 dark:hover:bg-white/10 text-[#202122] dark:text-[#eaecf0]'
                    }`}
                  >
                    <span>📊 全域内容统计自动化</span>
                    <span className="text-[10px] text-[#3366cc] font-mono">Special:统计</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/wiki/Category:女性生理用品"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateCategory?.();
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors cursor-pointer ${
                      currentPage === 'category'
                        ? 'bg-[#3366cc]/10 text-[#3366cc] font-semibold'
                        : 'hover:bg-black/5 dark:hover:bg-white/10 text-[#202122] dark:text-[#eaecf0]'
                    }`}
                  >
                    <span>📂 分类：女性生理用品</span>
                    <span className="text-[10px] text-[#72777d]">/wiki/Category</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/wiki/卫生棉条#usage-guide"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateArticle ? onNavigateArticle('usage-guide') : onNavigateSection('usage-guide');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-[#54595d] dark:text-[#a2a9b1] hover:text-[#202122] dark:hover:text-white transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>📐 45度置入操作规范</span>
                    <span className="text-[9px] text-[#72777d] font-mono">#usage-guide</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/wiki/卫生棉条#safety-and-tss"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateArticle ? onNavigateArticle('safety-and-tss') : onNavigateSection('safety-and-tss');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-[#54595d] dark:text-[#a2a9b1] hover:text-[#202122] dark:hover:text-white transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>🛡️ TSS 急症安全防护</span>
                    <span className="text-[9px] text-[#72777d] font-mono">#safety-and-tss</span>
                  </a>
                </li>
              </ul>

              <div className="px-2 py-1 font-bold text-[10px] text-[#72777d] uppercase tracking-wider border-t border-black/5 dark:border-white/5 mt-2 mb-1">
                全域方针与指引（独立页面）
              </div>
              <ul className="space-y-0.5">
                {[
                  { label: 'MZ维基:隐私政策', tab: 'privacy' as const, path: '/wiki/Wikipedia:隐私政策' },
                  { label: 'MZ维基:免责声明', tab: 'disclaimer' as const, path: '/wiki/Wikipedia:免责声明' },
                  { label: 'MZ维基:全域行为准则', tab: 'conduct' as const, path: '/wiki/Wikipedia:全域行为准则' }
                ].map(p => (
                  <li key={p.tab}>
                    <a
                      href={p.path}
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenPolicy?.(p.tab);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded transition-colors cursor-pointer flex items-center justify-between ${
                        currentPage === p.tab
                          ? 'bg-[#3366cc]/10 text-[#3366cc] font-semibold'
                          : 'hover:bg-black/5 dark:hover:bg-white/10 text-[#54595d] dark:text-[#a2a9b1] hover:text-[#202122] dark:hover:text-white'
                      }`}
                    >
                      <span>{p.label}</span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="pt-2 mt-1 border-t border-black/5 dark:border-white/5 px-2 flex flex-col gap-1">
                {onOpenAppearance && (
                  <button
                    onClick={() => {
                      onOpenAppearance();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-[#54595d] dark:text-[#a2a9b1] hover:text-[#202122] dark:hover:text-white flex items-center justify-between text-xs cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#3366cc]" />
                      <span>页面显示与外观</span>
                    </span>
                    <span className="text-[10px] text-[#72777d]">深色/字号</span>
                  </button>
                )}
                <div className="flex items-center justify-between text-[10px] text-[#72777d] pt-1">
                  <span>自由知识共享</span>
                  <span className="font-mono text-[9px]">CC BY-SA 4.0</span>
                </div>
              </div>
            </div>
          )}

          <a 
            href="/wiki/Wikipedia:首页" 
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateHome) {
                onNavigateHome();
              } else {
                onNavigateSection('top');
              }
            }}
            className="flex items-center gap-2.5 group select-none cursor-pointer"
          >
            {/* MZ Wiki Globe / Badge Icon */}
            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-[#3366cc] via-[#2a4b8d] to-[#1a365d] border border-[#2a4b8d] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform text-white">
              <span className="font-serif font-black text-sm tracking-tighter leading-none">
                MZ
              </span>
            </div>
            
            {/* Wordmark */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-lg tracking-wide leading-tight text-[#202122] dark:text-white group-hover:text-[#3366cc] transition-colors">
                  MZ维基
                </span>
              </div>
              <span className="text-[10px] text-[#54595d] dark:text-[#a2a9b1] tracking-wider -mt-0.5">
                自由的百科全书
              </span>
            </div>
          </a>

          {/* Side Table of Contents Toggle Button (Wikipedia Vector 2022) */}
          {onToggleSidebar && currentPage !== 'home' && currentPage !== 'category' && currentPage !== '404' && (
            <button
              onClick={onToggleSidebar}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors text-xs font-medium cursor-pointer ${
                isSidebarOpen 
                  ? 'bg-[#3366cc]/10 text-[#3366cc]' 
                  : 'hover:bg-black/5 dark:hover:bg-white/10 text-[#54595d] dark:text-[#a2a9b1]'
              }`}
              title={isSidebarOpen ? '收起左侧目录栏' : '展开左侧目录栏'}
            >
              <ListFilter className="w-4 h-4 text-[#3366cc]" />
              <span className="hidden sm:inline">目录</span>
            </button>
          )}
        </div>

        {/* Center: Search Bar with Autocomplete Dropdown */}
        <div ref={searchContainerRef} className="flex-1 max-w-xl relative">
          <div className={`relative flex items-center h-9 rounded border transition-all ${
            isSearchFocused 
              ? 'border-[#3366cc] ring-1 ring-[#3366cc] bg-white dark:bg-[#202122]' 
              : isDarkMode 
                ? 'border-[#54595d] bg-[#1a1b1c] hover:border-[#a2a9b1]' 
                : 'border-[#a2a9b1] bg-[#f8f9fa] hover:border-[#72777d]'
          }`}>
            <Search className="w-4 h-4 ml-3 text-[#72777d] shrink-0 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  if (filteredPolicies.length > 0) {
                    const firstPolicy = filteredPolicies[0];
                    if (firstPolicy.type === 'category') onNavigateCategory?.();
                    else if (firstPolicy.type === 'graph') onNavigateGraph?.();
                    else if (firstPolicy.type === 'article') onNavigateHome?.();
                    else onOpenPolicy?.(firstPolicy.key as 'privacy' | 'disclaimer' | 'conduct');
                  } else if (filteredSections.length > 0) {
                    const firstSec = filteredSections[0];
                    if (onNavigateArticle) onNavigateArticle(firstSec.id);
                    else onNavigateSection(firstSec.id);
                  } else {
                    onNavigateNotFound?.(searchQuery.trim());
                  }
                  setIsSearchFocused(false);
                }
              }}
              placeholder="搜索 MZ维基 条目与章节..."
              className="w-full bg-transparent px-2.5 text-xs outline-none text-[#202122] dark:text-[#eaecf0] placeholder:text-[#72777d]"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 mr-1 text-[#72777d] hover:text-[#202122] dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="hidden sm:inline-block mr-2 px-1.5 py-0.5 text-[10px] text-[#72777d] border border-black/10 dark:border-white/10 rounded font-mono">
                Ctrl K
              </span>
            )}
          </div>

          {/* Search Autocomplete Suggestions Dropdown */}
          {isSearchFocused && (
            <div className={`absolute left-0 right-0 mt-1 rounded-md shadow-xl border overflow-hidden text-xs z-50 animate-in fade-in zoom-in-95 duration-100 ${
              isDarkMode ? 'bg-[#27292d] border-[#54595d] text-[#eaecf0]' : 'bg-white border-[#c8ccd1] text-[#202122]'
            }`}>
              {searchQuery.trim() ? (
                <div>
                  {filteredPolicies.length > 0 && (
                    <div className="border-b border-black/5 dark:border-white/5">
                      <div className="px-3 py-1.5 text-[10px] font-bold text-[#72777d] uppercase tracking-wider bg-black/5 dark:border-white/5">
                        MZ维基独立页面
                      </div>
                      <ul className="divide-y divide-black/5 dark:divide-white/5">
                        {filteredPolicies.map(item => (
                          <li key={item.key}>
                            <button
                              onClick={() => {
                                if (item.type === 'category') {
                                  onNavigateCategory?.();
                                } else if (item.type === 'graph') {
                                  onNavigateGraph?.();
                                } else if (item.type === 'article') {
                                  onNavigateHome?.();
                                } else {
                                  onOpenPolicy?.(item.key as 'privacy' | 'disclaimer' | 'conduct');
                                }
                                setIsSearchFocused(false);
                                setSearchQuery('');
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-[#3366cc]/10 flex items-center justify-between group transition-colors cursor-pointer"
                            >
                              <div>
                                <div className="font-semibold group-hover:text-[#3366cc] text-[#202122] dark:text-white">
                                  {item.title}
                                </div>
                                <div className="text-[10px] text-[#72777d]">{item.desc}</div>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-[#72777d]" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="px-3 py-2 text-[11px] font-medium text-[#72777d] border-b border-black/5 dark:border-white/5">
                    条目内章节检索结果
                  </div>
                  {filteredSections.length > 0 ? (
                    <ul className="max-h-60 overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
                      {filteredSections.map(sec => (
                        <li key={sec.id}>
                          <button
                            onClick={() => {
                              if (onNavigateArticle) {
                                onNavigateArticle(sec.id);
                              } else {
                                onNavigateSection(sec.id);
                              }
                              setIsSearchFocused(false);
                              setSearchQuery('');
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-[#3366cc]/10 flex items-center justify-between group transition-colors cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-[#3366cc] font-mono text-[11px] font-semibold">{sec.number}</span>
                              <span className="group-hover:text-[#3366cc] font-medium">{sec.title}</span>
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#72777d] group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : filteredPolicies.length === 0 ? (
                    <div className="p-4 text-center text-[#72777d]">
                      <p>未在当前条目或知识库中找到「{searchQuery}」</p>
                      <button
                        onClick={() => {
                          onNavigateNotFound?.(searchQuery.trim());
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="mt-2 text-xs text-[#3366cc] dark:text-[#6699ff] hover:underline font-medium cursor-pointer"
                      >
                        前往并查看「{searchQuery}」条目状态 →
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="p-3">
                  <div className="text-[11px] font-semibold text-[#72777d] mb-2 uppercase tracking-wider">
                    推荐快速跳转
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'history', label: '1 历史与现代发明' },
                      { id: 'structure-and-types', label: '2 导管型与指入式结构' },
                      { id: 'usage-guide', label: '3 核心45度置入步骤' },
                      { id: 'safety-and-tss', label: '4 TSS安全防护与时限' },
                      { id: 'common-myths', label: '5 阴道冠与生理迷思' },
                      { id: 'references', label: '8 参考文献 (15篇)' }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (onNavigateArticle) {
                            onNavigateArticle(item.id);
                          } else {
                            onNavigateHome?.();
                            onNavigateSection(item.id);
                          }
                          setIsSearchFocused(false);
                        }}
                        className="px-2.5 py-1.5 text-left rounded hover:bg-[#3366cc]/10 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#3366cc] shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-black/5 dark:border-white/5 flex items-center gap-2 flex-wrap text-xs">
                    <span className="text-[10px] text-[#72777d]">制度方针独立页面：</span>
                    {[
                      { key: 'privacy' as const, label: '隐私政策' },
                      { key: 'disclaimer' as const, label: '免责声明' },
                      { key: 'conduct' as const, label: '全域行为准则' }
                    ].map(p => (
                      <button
                        key={p.key}
                        onClick={() => {
                          onOpenPolicy?.(p.key);
                          setIsSearchFocused(false);
                        }}
                        className="text-[11px] text-[#3366cc] hover:underline cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Quick Knowledge Graph, Category, Appearance Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={() => onNavigateGraph?.()}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors text-xs font-medium cursor-pointer ${
              currentPage === 'graph'
                ? 'bg-[#3366cc]/10 text-[#3366cc] font-semibold ring-1 ring-[#3366cc]/30'
                : 'hover:bg-black/5 dark:hover:bg-white/10 text-[#54595d] dark:text-[#a2a9b1]'
            }`}
            title="查看全域知识图谱与词条关系网络"
          >
            <GitBranch className="w-3.5 h-3.5 text-[#3366cc] dark:text-[#6699ff]" />
            <span className="hidden md:inline">知识图谱</span>
          </button>

          <button
            onClick={() => onNavigateTags?.()}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors text-xs font-medium cursor-pointer ${
              currentPage === 'tags'
                ? 'bg-[#3366cc]/10 text-[#3366cc] font-semibold ring-1 ring-[#3366cc]/30'
                : 'hover:bg-black/5 dark:hover:bg-white/10 text-[#54595d] dark:text-[#a2a9b1]'
            }`}
            title="查看全域知识标签与主题索引 (Special:Tags)"
          >
            <Tag className="w-3.5 h-3.5 text-[#3366cc] dark:text-[#6699ff]" />
            <span className="hidden md:inline">标签</span>
          </button>

          <button
            onClick={() => onNavigateCategory?.()}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors text-xs font-medium cursor-pointer ${
              currentPage === 'category'
                ? 'bg-[#3366cc]/10 text-[#3366cc] font-semibold ring-1 ring-[#3366cc]/30'
                : 'hover:bg-black/5 dark:hover:bg-white/10 text-[#54595d] dark:text-[#a2a9b1]'
            }`}
            title="女性生理用品分类目录"
          >
            <Layers className="w-3.5 h-3.5 text-[#3366cc] dark:text-[#6699ff]" />
            <span className="hidden md:inline">分类</span>
          </button>

          <button
            onClick={() => onNavigateStats?.()}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors text-xs font-medium cursor-pointer ${
              currentPage === 'stats'
                ? 'bg-[#3366cc]/10 text-[#3366cc] font-semibold ring-1 ring-[#3366cc]/30'
                : 'hover:bg-black/5 dark:hover:bg-white/10 text-[#54595d] dark:text-[#a2a9b1]'
            }`}
            title="全域内容统计自动化与学术量化报告 (Special:统计)"
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#3366cc] dark:text-[#6699ff]" />
            <span className="hidden md:inline">统计</span>
          </button>

          <button
            onClick={onOpenAppearance}
            className="p-2 rounded hover:bg-black/5 dark:hover:bg-white/10 text-[#54595d] dark:text-[#a2a9b1] hover:text-[#202122] dark:hover:text-white transition-colors cursor-pointer"
            title="页面显示设置（深色模式与字号）"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
