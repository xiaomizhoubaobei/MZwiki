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
  BarChart3,
  Printer
} from 'lucide-react';
import { SectionDef, ARTICLE_SECTIONS } from '../data/articleData';
import { SANITARY_PAD_SECTIONS } from '../data/sanitaryPadData';
import { WIKI_ENTRIES } from '../data/wikiEntriesData';
import { matchSanitaryPadQuery } from '../pages/HomePage';

interface WikipediaHeaderProps {
  onOpenAppearance: () => void;
  onNavigateSection: (sectionId: string) => void;
  isDarkMode: boolean;
  onOpenPolicy?: (tab: 'privacy' | 'disclaimer' | 'conduct') => void;
  onNavigateHome?: () => void;
  onNavigateArticle?: (sectionId?: string) => void;
  onNavigateSanitaryPad?: (sectionId?: string) => void;
  onNavigateWikiTerm?: (term: string) => void;
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
  onPrint?: () => void;
}

export const WikipediaHeader: React.FC<WikipediaHeaderProps> = ({
  onOpenAppearance,
  onNavigateSection,
  isDarkMode,
  onOpenPolicy,
  onNavigateHome,
  onNavigateArticle,
  onNavigateSanitaryPad,
  onNavigateWikiTerm,
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
  isSidebarOpen = true,
  onPrint
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionItemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions and menu dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
        setActiveSuggestionIndex(-1);
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
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper to highlight matched query text in suggestion titles
  const renderHighlightedText = (text: string, query: string) => {
    const q = query.trim();
    if (!q) return text;
    const lowerText = text.toLowerCase();
    const lowerQ = q.toLowerCase();
    const matchIdx = lowerText.indexOf(lowerQ);
    if (matchIdx === -1) return text;

    const before = text.slice(0, matchIdx);
    const match = text.slice(matchIdx, matchIdx + q.length);
    const after = text.slice(matchIdx + q.length);
    return (
      <>
        {before}
        <mark className="bg-[#eaf3ff] dark:bg-[#2a4b8d]/60 text-[#3366cc] dark:text-[#8ab4f8] font-bold px-0.5 rounded-xs">
          {match}
        </mark>
        {after}
      </>
    );
  };

  // Instant search autocomplete suggestions dynamically built from WIKI_ENTRIES (+ core Tampon entry)
  const wikiEntrySuggestions = React.useMemo(() => {
    const raw = searchQuery.trim();
    if (!raw) return [];
    const q = raw.toLowerCase();

    interface EntrySuggestionItem {
      id: string;
      title: string;
      enTitle: string;
      categoryLabel: string;
      summary: string;
      matchedHint?: string;
      score: number;
      onSelect: () => void;
    }

    const candidates: EntrySuggestionItem[] = [];

    // 1. Dynamically match all entries from WIKI_ENTRIES
    WIKI_ENTRIES.forEach((entry) => {
      const titleLower = entry.title.toLowerCase();
      const enLower = entry.enTitle.toLowerCase();
      const isSanitaryPadEntry = entry.id === 'sanitary-pad';

      const exactTitle = titleLower === q || enLower === q;
      const startsWithTitle = titleLower.startsWith(q) || enLower.startsWith(q);
      const includesTitle = titleLower.includes(q) || enLower.includes(q);
      const matchedAlias = entry.aliases.find(
        (alias) => alias.toLowerCase().includes(q) || q.includes(alias.toLowerCase())
      );
      const matchedTag = entry.tags.find(
        (tag) => tag.toLowerCase().includes(q) || q.includes(tag.toLowerCase())
      );
      const fuzzyPadHit = isSanitaryPadEntry && matchSanitaryPadQuery(q);
      const summaryHit = entry.summary.toLowerCase().includes(q);

      if (exactTitle || startsWithTitle || includesTitle || matchedAlias || matchedTag || fuzzyPadHit || summaryHit) {
        let score = 0;
        if (exactTitle) score = 100;
        else if (startsWithTitle) score = 90;
        else if (fuzzyPadHit || matchedAlias) score = 85;
        else if (includesTitle) score = 75;
        else if (matchedTag) score = 60;
        else score = 40;

        let matchedHint: string | undefined;
        if (matchedAlias && !includesTitle) {
          matchedHint = `匹配别称：${matchedAlias}`;
        } else if (fuzzyPadHit && !includesTitle) {
          matchedHint = `匹配常用词：${raw} → 卫生棉（卫生巾）`;
        } else if (matchedTag && !includesTitle) {
          matchedHint = `关联标签：#${matchedTag}`;
        }

        candidates.push({
          id: `wiki-entry-${entry.id}`,
          title: isSanitaryPadEntry ? '卫生棉（卫生巾）' : entry.title,
          enTitle: entry.enTitle,
          categoryLabel: isSanitaryPadEntry ? '优良主条目 · 体外用品' : entry.categoryLabel,
          summary: entry.summary,
          matchedHint,
          score,
          onSelect: () => {
            if (isSanitaryPadEntry) {
              onNavigateSanitaryPad?.();
            } else {
              onNavigateWikiTerm?.(entry.title);
            }
          }
        });
      }
    });

    // 2. Also include the primary featured article "卫生棉条" if it matches the query
    const tamponAliases = ['卫生棉条', '棉条', '卫生栓', '导管棉条', '指入式棉条', 'tampon'];
    const tamponHit = tamponAliases.find(
      (kw) => kw.toLowerCase().includes(q) || q.includes(kw.toLowerCase())
    );
    if (tamponHit) {
      const exactTampon = q === '卫生棉条' || q === '棉条' || q === 'tampon';
      candidates.push({
        id: 'wiki-entry-tampon-main',
        title: '卫生棉条',
        enTitle: 'Tampon',
        categoryLabel: '典范主条目 · 体内用品',
        summary: '置入阴道中上段“后穹窿无感区”直接吸收经血的圆柱状体内女性生理用品，涵盖导管式与指入式构造、FDA吸收量标准与TSS预防。',
        matchedHint: ! '卫生棉条'.includes(q) ? `匹配同义词：${tamponHit}` : undefined,
        score: exactTampon ? 98 : 82,
        onSelect: () => {
          if (onNavigateArticle) onNavigateArticle();
          else onNavigateSection('top');
        }
      });
    }

    return candidates.sort((a, b) => b.score - a.score).slice(0, 8);
  }, [searchQuery, onNavigateSanitaryPad, onNavigateWikiTerm, onNavigateArticle, onNavigateSection]);

  // Flattened article sections for quick search inside entries
  const searchableSections = React.useMemo(
    () => [
      ...SANITARY_PAD_SECTIONS.flatMap((sec) => [
        { id: sec.id, title: `[卫生棉/卫生巾] ${sec.title}`, number: sec.number, targetPage: 'sanitary-pad' as const },
        ...(sec.subsections || []).map((sub) => ({
          id: sub.id,
          title: `[卫生棉/卫生巾] ${sub.title}`,
          number: sub.number,
          targetPage: 'sanitary-pad' as const
        }))
      ]),
      ...ARTICLE_SECTIONS.flatMap((sec) => [
        { id: sec.id, title: `[卫生棉条] ${sec.title}`, number: sec.number, targetPage: 'article' as const },
        ...(sec.subsections || []).map((sub) => ({
          id: sub.id,
          title: `[卫生棉条] ${sub.title}`,
          number: sub.number,
          targetPage: 'article' as const
        }))
      ])
    ],
    []
  );

  const filteredSections = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return searchableSections
      .filter((s) => s.title.toLowerCase().includes(q) || s.number.includes(q))
      .slice(0, 5);
  }, [searchQuery, searchableSections]);

  // Unified flat list of keyboard-navigable suggestions (WIKI_ENTRIES first, then matching sections)
  const navigableSuggestions = React.useMemo(() => {
    const items: Array<{
      key: string;
      kind: 'entry' | 'section';
      onSelect: () => void;
    }> = [];

    wikiEntrySuggestions.forEach((entry) => {
      items.push({
        key: entry.id,
        kind: 'entry',
        onSelect: entry.onSelect
      });
    });

    filteredSections.forEach((sec) => {
      items.push({
        key: `sec-${sec.targetPage}-${sec.id}`,
        kind: 'section',
        onSelect: () => {
          if (sec.targetPage === 'sanitary-pad') {
            onNavigateSanitaryPad?.(sec.id);
          } else if (onNavigateArticle) {
            onNavigateArticle(sec.id);
          } else {
            onNavigateSection(sec.id);
          }
        }
      });
    });

    return items;
  }, [wikiEntrySuggestions, filteredSections, onNavigateSanitaryPad, onNavigateArticle, onNavigateSection]);

  // Reset or clamp activeSuggestionIndex when searchQuery changes
  useEffect(() => {
    if (!searchQuery.trim() || navigableSuggestions.length === 0) {
      setActiveSuggestionIndex(-1);
    } else {
      setActiveSuggestionIndex(0);
    }
  }, [searchQuery, navigableSuggestions.length]);

  // Keep active suggestion scrolled into view during keyboard navigation
  useEffect(() => {
    if (activeSuggestionIndex >= 0 && suggestionItemRefs.current[activeSuggestionIndex]) {
      suggestionItemRefs.current[activeSuggestionIndex]?.scrollIntoView({
        block: 'nearest'
      });
    }
  }, [activeSuggestionIndex]);

  const executeSuggestionSelect = (action: () => void) => {
    action();
    setIsSearchFocused(false);
    setSearchQuery('');
    setActiveSuggestionIndex(-1);
  };

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors print:hidden no-print ${
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
                    href="/wiki/卫生棉"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateSanitaryPad ? onNavigateSanitaryPad() : onNavigateSection('top');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors cursor-pointer ${
                      currentPage === 'sanitary-pad'
                        ? 'bg-[#3366cc]/10 text-[#3366cc] font-semibold'
                        : 'hover:bg-black/5 dark:hover:bg-white/10 text-[#202122] dark:text-[#eaecf0]'
                    }`}
                  >
                    <span>🌸 典范条目：卫生棉 (卫生巾)</span>
                    <span className="text-[10px] text-[#72777d]">/wiki/卫生棉</span>
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
              </ul>

              <div className="px-2 py-1 font-bold text-[10px] text-[#72777d] uppercase tracking-wider border-t border-black/5 dark:border-white/5 mt-2 mb-1 flex items-center justify-between">
                <span>已收录词条列表（共 2 篇）</span>
                <span className="font-mono text-[9px] text-[#3366cc]">支持持续新增</span>
              </div>
              <div className="space-y-0.5 pr-1">
                <button
                  onClick={() => {
                    onNavigateArticle?.();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10 text-[#3366cc] dark:text-[#6b9eff] font-medium transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span className="truncate">1. 卫生棉条 (Tampon)</span>
                  <span className="text-[9px] text-[#72777d] shrink-0">8章节</span>
                </button>
                <button
                  onClick={() => {
                    onNavigateSanitaryPad?.();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10 text-[#3366cc] dark:text-[#6b9eff] font-medium transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span className="truncate">2. 卫生棉 / 卫生巾</span>
                  <span className="text-[9px] text-[#72777d] shrink-0">7章节</span>
                </button>
              </div>

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
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setTimeout(() => {
                      if (onPrint) onPrint();
                      else window.print();
                    }, 50);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-[#54595d] dark:text-[#a2a9b1] hover:text-[#202122] dark:hover:text-white flex items-center justify-between text-xs cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Printer className="w-3.5 h-3.5 text-[#3366cc]" />
                    <span>打印条目</span>
                  </span>
                  <span className="text-[10px] text-[#72777d]">纯净版</span>
                </button>
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

        {/* Center: Search Bar with Instant WIKI_ENTRIES Autocomplete & Keyboard Navigation */}
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
              ref={searchInputRef}
              type="text"
              role="combobox"
              aria-expanded={isSearchFocused}
              aria-autocomplete="list"
              aria-controls="wiki-header-search-listbox"
              aria-activedescendant={
                activeSuggestionIndex >= 0 && navigableSuggestions[activeSuggestionIndex]
                  ? `header-suggestion-${navigableSuggestions[activeSuggestionIndex].key}`
                  : undefined
              }
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isSearchFocused) setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  if (!isSearchFocused) {
                    setIsSearchFocused(true);
                  }
                  if (navigableSuggestions.length > 0) {
                    setActiveSuggestionIndex((prev) =>
                      prev < navigableSuggestions.length - 1 ? prev + 1 : 0
                    );
                  }
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  if (!isSearchFocused) {
                    setIsSearchFocused(true);
                  }
                  if (navigableSuggestions.length > 0) {
                    setActiveSuggestionIndex((prev) =>
                      prev > 0 ? prev - 1 : navigableSuggestions.length - 1
                    );
                  }
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  setIsSearchFocused(false);
                  setActiveSuggestionIndex(-1);
                } else if (e.key === 'Enter' && searchQuery.trim()) {
                  e.preventDefault();
                  if (
                    activeSuggestionIndex >= 0 &&
                    activeSuggestionIndex < navigableSuggestions.length
                  ) {
                    executeSuggestionSelect(navigableSuggestions[activeSuggestionIndex].onSelect);
                  } else if (matchSanitaryPadQuery(searchQuery.trim())) {
                    executeSuggestionSelect(() => onNavigateSanitaryPad?.());
                  } else if (wikiEntrySuggestions.length > 0) {
                    executeSuggestionSelect(wikiEntrySuggestions[0].onSelect);
                  } else if (filteredSections.length > 0) {
                    const firstSec = filteredSections[0];
                    executeSuggestionSelect(() => {
                      if (firstSec.targetPage === 'sanitary-pad') onNavigateSanitaryPad?.(firstSec.id);
                      else if (onNavigateArticle) onNavigateArticle(firstSec.id);
                      else onNavigateSection(firstSec.id);
                    });
                  } else if (onNavigateWikiTerm) {
                    executeSuggestionSelect(() => onNavigateWikiTerm(searchQuery.trim()));
                  } else {
                    executeSuggestionSelect(() => onNavigateNotFound?.(searchQuery.trim()));
                  }
                }
              }}
              placeholder="搜索 MZ维基 词条与章节（如：卫生巾、月经杯、阴道冠、TSS...）"
              className="w-full bg-transparent px-2.5 text-xs outline-none text-[#202122] dark:text-[#eaecf0] placeholder:text-[#72777d]"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveSuggestionIndex(-1);
                  searchInputRef.current?.focus();
                }}
                aria-label="清空搜索框"
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
            <div
              id="wiki-header-search-listbox"
              role="listbox"
              className={`absolute left-0 right-0 mt-1 rounded-md shadow-xl border overflow-hidden text-xs z-50 animate-in fade-in zoom-in-95 duration-100 ${
                isDarkMode ? 'bg-[#27292d] border-[#54595d] text-[#eaecf0]' : 'bg-white border-[#c8ccd1] text-[#202122]'
              }`}
            >
              {searchQuery.trim() ? (
                <div>
                  {/* 1. Instant WIKI_ENTRIES Title Suggestions */}
                  {wikiEntrySuggestions.length > 0 && (
                    <div className="border-b border-black/5 dark:border-white/5">
                      <div className="px-3 py-1.5 text-[10px] font-bold text-[#72777d] uppercase tracking-wider bg-black/5 dark:bg-white/5 flex items-center justify-between">
                        <span>WIKI_ENTRIES 词条即时联想建议 ({wikiEntrySuggestions.length})</span>
                        <span className="font-mono text-[9px] text-[#3366cc] dark:text-[#6b9eff]">
                          ↑↓ 键盘导航 · Enter 跳转
                        </span>
                      </div>
                      <ul className="max-h-64 overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
                        {wikiEntrySuggestions.map((item, idx) => {
                          const isSelected = activeSuggestionIndex === idx;
                          return (
                            <li key={item.id} role="option" aria-selected={isSelected}>
                              <button
                                ref={(el) => {
                                  suggestionItemRefs.current[idx] = el;
                                }}
                                id={`header-suggestion-${item.id}`}
                                type="button"
                                onMouseEnter={() => setActiveSuggestionIndex(idx)}
                                onClick={() => executeSuggestionSelect(item.onSelect)}
                                className={`w-full px-3 py-2 text-left flex items-center justify-between group transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#3366cc]/15 dark:bg-[#3366cc]/25'
                                    : 'hover:bg-[#3366cc]/10'
                                }`}
                              >
                                <div className="min-w-0 pr-2">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                      className={`font-semibold text-xs ${
                                        isSelected
                                          ? 'text-[#3366cc] dark:text-[#6b9eff]'
                                          : 'text-[#202122] dark:text-white group-hover:text-[#3366cc]'
                                      }`}
                                    >
                                      {renderHighlightedText(item.title, searchQuery)}
                                    </span>
                                    <span className="text-[10px] text-[#72777d] font-serif italic truncate">
                                      {renderHighlightedText(item.enTitle, searchQuery)}
                                    </span>
                                    <span className="px-1.5 py-0.2 text-[10px] rounded-xs bg-black/5 dark:bg-white/10 text-[#54595d] dark:text-[#a2a9b1] font-mono">
                                      {item.categoryLabel}
                                    </span>
                                  </div>

                                  {item.matchedHint && (
                                    <div className="text-[10px] text-[#006400] dark:text-[#5cd68d] mt-0.5">
                                      ↳ {item.matchedHint}
                                    </div>
                                  )}

                                  <div className="text-[10px] text-[#72777d] line-clamp-1 mt-0.5">
                                    {item.summary}
                                  </div>
                                </div>
                                <ChevronRight
                                  className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                                    isSelected
                                      ? 'text-[#3366cc] dark:text-[#6b9eff] translate-x-0.5'
                                      : 'text-[#72777d]'
                                  }`}
                                />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* 2. Matching Article Sections */}
                  {filteredSections.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-[10px] font-bold text-[#72777d] uppercase tracking-wider bg-black/5 dark:bg-white/5">
                        条目内章节检索结果 ({filteredSections.length})
                      </div>
                      <ul className="max-h-48 overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
                        {filteredSections.map((sec, sIdx) => {
                          const globalIdx = wikiEntrySuggestions.length + sIdx;
                          const isSelected = activeSuggestionIndex === globalIdx;
                          return (
                            <li
                              key={`${sec.targetPage}-${sec.id}`}
                              role="option"
                              aria-selected={isSelected}
                            >
                              <button
                                ref={(el) => {
                                  suggestionItemRefs.current[globalIdx] = el;
                                }}
                                id={`header-suggestion-sec-${sec.targetPage}-${sec.id}`}
                                type="button"
                                onMouseEnter={() => setActiveSuggestionIndex(globalIdx)}
                                onClick={() =>
                                  executeSuggestionSelect(() => {
                                    if (sec.targetPage === 'sanitary-pad') {
                                      onNavigateSanitaryPad?.(sec.id);
                                    } else if (onNavigateArticle) {
                                      onNavigateArticle(sec.id);
                                    } else {
                                      onNavigateSection(sec.id);
                                    }
                                  })
                                }
                                className={`w-full px-3 py-2 text-left flex items-center justify-between group transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#3366cc]/15 dark:bg-[#3366cc]/25'
                                    : 'hover:bg-[#3366cc]/10'
                                }`}
                              >
                                <span className="flex items-center gap-2 min-w-0">
                                  <span className="text-[#3366cc] font-mono text-[11px] font-semibold shrink-0">
                                    {sec.number}
                                  </span>
                                  <span
                                    className={`font-medium truncate ${
                                      isSelected
                                        ? 'text-[#3366cc] dark:text-[#6b9eff]'
                                        : 'group-hover:text-[#3366cc]'
                                    }`}
                                  >
                                    {renderHighlightedText(sec.title, searchQuery)}
                                  </span>
                                </span>
                                <ChevronRight
                                  className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                                    isSelected
                                      ? 'text-[#3366cc] dark:text-[#6b9eff] translate-x-0.5'
                                      : 'text-[#72777d] group-hover:translate-x-0.5'
                                  }`}
                                />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* 3. Empty State when no WIKI_ENTRIES or Sections match */}
                  {wikiEntrySuggestions.length === 0 && filteredSections.length === 0 && (
                    <div className="p-4 text-center text-[#72777d]">
                      <p>未在当前条目或知识库中找到「{searchQuery}」</p>
                      <button
                        type="button"
                        onClick={() =>
                          executeSuggestionSelect(() => onNavigateNotFound?.(searchQuery.trim()))
                        }
                        className="mt-2 text-xs text-[#3366cc] dark:text-[#6699ff] hover:underline font-medium cursor-pointer"
                      >
                        前往并查看「{searchQuery}」条目状态 →
                      </button>
                    </div>
                  )}

                  {/* Keyboard Navigation Hint Footer */}
                  {(wikiEntrySuggestions.length > 0 || filteredSections.length > 0) && (
                    <div className="px-3 py-1.5 bg-[#f8f9fa] dark:bg-[#1e2022] border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px] text-[#72777d]">
                      <span>
                        共匹配 {wikiEntrySuggestions.length} 个词条建议
                        {filteredSections.length > 0 ? ` · ${filteredSections.length} 个章节` : ''}
                      </span>
                      <span className="font-mono">
                        ↑↓ 选择 · Enter 确认 · Esc 关闭
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3">
                  <div className="text-[11px] font-semibold text-[#72777d] mb-2 uppercase tracking-wider flex items-center justify-between">
                    <span>已收录正式词条（共 2 篇 · 输入关键词实时联想全库词条）</span>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateCategory?.();
                        setIsSearchFocused(false);
                      }}
                      className="text-[#3366cc] hover:underline font-normal cursor-pointer"
                    >
                      分类目录 →
                    </button>
                  </div>
                  <div className="mb-2.5 grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateArticle?.();
                        setIsSearchFocused(false);
                      }}
                      className="px-2.5 py-1.5 text-left rounded bg-[#3366cc]/10 hover:bg-[#3366cc]/20 text-[#3366cc] dark:text-[#6699ff] font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">词条 #1：卫生棉条 (Tampon)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateSanitaryPad?.();
                        setIsSearchFocused(false);
                      }}
                      className="px-2.5 py-1.5 text-left rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-[#059669] dark:text-[#34d399] font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">词条 #2：卫生棉（卫生巾）</span>
                    </button>
                  </div>

                  {/* Quick WIKI_ENTRIES chips when input is empty */}
                  <div className="text-[10px] font-semibold text-[#72777d] mb-1.5">
                    热门 WIKI_ENTRIES 词条速查：
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {WIKI_ENTRIES.slice(0, 8).map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => {
                          if (entry.id === 'sanitary-pad') {
                            onNavigateSanitaryPad?.();
                          } else {
                            onNavigateWikiTerm?.(entry.title);
                          }
                          setIsSearchFocused(false);
                        }}
                        className="px-2 py-1 rounded border border-black/10 dark:border-white/10 hover:border-[#3366cc] hover:text-[#3366cc] dark:hover:text-[#6b9eff] text-[11px] transition-colors cursor-pointer"
                      >
                        {entry.id === 'sanitary-pad' ? '卫生棉（卫生巾）' : entry.title}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/5 flex items-center gap-2 flex-wrap text-xs">
                    <span className="text-[10px] text-[#72777d]">制度方针独立页面：</span>
                    {[
                      { key: 'privacy' as const, label: '隐私政策' },
                      { key: 'disclaimer' as const, label: '免责声明' },
                      { key: 'conduct' as const, label: '全域行为准则' }
                    ].map(p => (
                      <button
                        key={p.key}
                        type="button"
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

        {/* Right Side: Quick Sanitary Pad Entry, Knowledge Graph, Category, Appearance Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={() => onNavigateSanitaryPad?.()}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors text-xs font-medium cursor-pointer ${
              currentPage === 'sanitary-pad'
                ? 'bg-emerald-500/15 text-[#059669] dark:text-[#34d399] font-semibold ring-1 ring-emerald-500/40'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-[#059669] dark:text-[#34d399]'
            }`}
            title="阅读《卫生巾 / 卫生棉》典范条目"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#059669] dark:text-[#34d399]" />
            <span>卫生巾</span>
          </button>

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
            onClick={() => {
              if (onPrint) onPrint();
              else window.print();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors text-xs font-medium hover:bg-black/5 dark:hover:bg-white/10 text-[#54595d] dark:text-[#a2a9b1] hover:text-[#202122] dark:hover:text-white cursor-pointer"
            title="打印条目（自动隐藏侧边栏、搜索框与底部导航）"
          >
            <Printer className="w-3.5 h-3.5 text-[#3366cc] dark:text-[#6699ff]" />
            <span className="hidden lg:inline">打印条目</span>
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
