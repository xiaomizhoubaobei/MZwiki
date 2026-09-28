import React, { useState, useEffect } from 'react';
import {
  ARTICLE_SECTIONS,
  SectionDef,
  ReferenceItem
} from './data/articleData';
import { WikipediaHeader } from './components/WikipediaHeader';
import { WikipediaSubheader } from './components/WikipediaSubheader';
import { TableOfContents } from './components/TableOfContents';
import { ArticleContent } from './components/ArticleContent';
import { WikipediaFooter } from './components/WikipediaFooter';
import { AppearanceModal } from './components/AppearanceModal';
import { WikiLinkPreview } from './components/WikiLinkPreview';
import { ReferencePreview } from './components/ReferencePreview';
import {
  PRIVACY_SECTIONS,
  DISCLAIMER_SECTIONS,
  CONDUCT_SECTIONS
} from './data/policyData';
import { CATEGORY_SECTIONS } from './data/categoryData';
import { PrivacyPage } from './pages/PrivacyPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { ConductPage } from './pages/ConductPage';
import { CategoryPage } from './pages/CategoryPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { KnowledgeGraphPage } from './pages/KnowledgeGraphPage';
import { TagsPage } from './pages/TagsPage';
import { WikiEntryPage } from './pages/WikiEntryPage';
import { ContentStatisticsPage } from './pages/ContentStatisticsPage';
import { WikiEntry, getWikiEntryByTitle, WIKI_ENTRIES } from './data/wikiEntriesData';
import { AppPage, getWikiPath, parseWikiLocation } from './utils/wikiRoutes';
import { applyPageSEO } from './utils/seoAutomation';
import {
  getAutomatedBreadcrumbs,
  getWikiEntryMetrics,
  getFeaturedArticleMetrics
} from './utils/headerAutomation';
import { ListFilter } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [activeSectionId, setActiveSectionId] = useState<string>('top');
  const [missingPath, setMissingPath] = useState<string>('');
  const [currentWikiEntry, setCurrentWikiEntry] = useState<WikiEntry | null>(null);
  const [selectedTagForTagsPage, setSelectedTagForTagsPage] = useState<string | undefined>();
  const [initialGraphTag, setInitialGraphTag] = useState<string | undefined>();
  const [initialGraphNode, setInitialGraphNode] = useState<string | undefined>();

  // Automated Dynamic Reading Metrics (Words & Minutes)
  const readingStats = React.useMemo(() => {
    if (currentPage === 'entry' && currentWikiEntry) {
      const metrics = getWikiEntryMetrics(currentWikiEntry);
      return { minutes: metrics.readingMinutes, wordCount: metrics.wordCount };
    }
    const metrics = getFeaturedArticleMetrics();
    return { minutes: metrics.readingMinutes, wordCount: metrics.wordCount };
  }, [currentPage, currentWikiEntry]);

  // Automated Dynamic Breadcrumbs
  const automatedBreadcrumbs = React.useMemo(() => {
    return getAutomatedBreadcrumbs(currentPage, currentWikiEntry);
  }, [currentPage, currentWikiEntry]);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'small' | 'standard' | 'large'>('standard');
  const [contentWidth, setContentWidth] = useState<'standard' | 'wide'>('standard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const [isAppearanceOpen, setIsAppearanceOpen] = useState<boolean>(false);

  // Popover state
  const [wikiLinkHover, setWikiLinkHover] = useState<{
    term: string;
    position: {
      x: number;
      y: number;
      rect?: {
        left: number;
        top: number;
        bottom: number;
        right: number;
        width: number;
        height: number;
      };
    };
  } | null>(null);

  const [refHover, setRefHover] = useState<{
    reference: ReferenceItem;
    position: { x: number; y: number };
  } | null>(null);

  // Synchronize dark mode class to document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Read URL Path & Hash on mount & respond to browser Back/Forward (popstate/hashchange)
  useEffect(() => {
    const handleUrlSync = () => {
      const { page, sectionId, missingPath: parsedMissing } = parseWikiLocation();
      setCurrentPage(page);
      setActiveSectionId(sectionId);
      if (page === 'entry') {
        const found = getWikiEntryByTitle(sectionId) || WIKI_ENTRIES[0];
        setCurrentWikiEntry(found);
      }
      if (parsedMissing) {
        setMissingPath(parsedMissing);
      }
      if (sectionId && sectionId !== 'top') {
        setTimeout(() => handleScrollToSection(sectionId), 70);
      }
    };

    handleUrlSync();
    window.addEventListener('popstate', handleUrlSync);
    window.addEventListener('hashchange', handleUrlSync);
    return () => {
      window.removeEventListener('popstate', handleUrlSync);
      window.removeEventListener('hashchange', handleUrlSync);
    };
  }, []);

  // Automated SEO: Meta Description, OpenGraph, Canonical Link, Schema.org JSON-LD
  useEffect(() => {
    switch (currentPage) {
      case 'home':
        applyPageSEO({
          title: '首页',
          description: 'MZ维基是一部自由开放的女性生理健康、经期护理与解剖医学百科全书，致力于提供严谨、无偏见、去羞辱化的科学知识。',
          canonicalPath: '/wiki/首页',
          ogType: 'website',
          schemaType: 'CollectionPage'
        });
        break;
      case 'category':
        applyPageSEO({
          title: '分类:女性生理用品',
          description: 'MZ维基女性生理用品与个人卫生器械全部分类目录，收录卫生棉条、卫生巾、月经杯、布卫生巾等核心生理期护理条目。',
          canonicalPath: '/wiki/Category:女性生理用品',
          ogType: 'website',
          schemaType: 'CollectionPage',
          tags: ['女性生理用品', '经期用品', '个护器械']
        });
        break;
      case 'graph':
        applyPageSEO({
          title: 'Special:知识图谱与拓扑网络',
          description: '多维交互式生理健康与医学概念拓扑关系网络，直观呈现卫生用品、病理机制、解剖构造与历史人物之间的语义连接。',
          canonicalPath: '/wiki/Special:知识图谱',
          ogType: 'website',
          schemaType: 'WebApplication'
        });
        break;
      case 'tags':
        applyPageSEO({
          title: 'Special:知识标签与主题索引',
          description: '全域实体标签与知识主题聚合系统，聚合医学病理、解剖生理、器械用品与社会文化多维度标签网络。',
          canonicalPath: '/wiki/Special:知识标签',
          ogType: 'website',
          schemaType: 'CollectionPage'
        });
        break;
      case 'stats':
        applyPageSEO({
          title: 'Special:内容统计与全域量化分析',
          description: 'MZ维基全域内容统计自动化体系，100% 自动派生运算条目字数、质量评级梯队、学术文献索引密度及知识图谱拓扑网络。',
          canonicalPath: '/wiki/Special:统计',
          ogType: 'website',
          schemaType: 'CollectionPage'
        });
        break;
      case 'entry':
        if (currentWikiEntry) {
          applyPageSEO({
            title: currentWikiEntry.title,
            description: currentWikiEntry.summary,
            canonicalPath: `/wiki/${encodeURIComponent(currentWikiEntry.title)}`,
            ogType: 'article',
            imageUrl: currentWikiEntry.imageUrl,
            schemaType: currentWikiEntry.category === 'medical' ? 'MedicalWebPage' : 'Article',
            tags: currentWikiEntry.tags
          });
        }
        break;
      case 'privacy':
        applyPageSEO({
          title: 'MZ维基:隐私政策',
          description: 'MZ维基官方核心隐私政策方针与数据保护指引。',
          canonicalPath: '/wiki/privacy',
          ogType: 'website',
          schemaType: 'Article'
        });
        break;
      case 'disclaimer':
        applyPageSEO({
          title: 'MZ维基:免责声明',
          description: 'MZ维基医学健康与法律免责通告，本百科仅供健康通识与学术参考，不作为替代执业医师诊断的临床处方依据。',
          canonicalPath: '/wiki/disclaimer',
          ogType: 'website',
          schemaType: 'Article'
        });
        break;
      case 'conduct':
        applyPageSEO({
          title: 'MZ维基:全域行为准则',
          description: 'MZ维基社群文明共建与反歧视公约，倡导包容、严谨、友善的百科协作环境。',
          canonicalPath: '/wiki/conduct',
          ogType: 'website',
          schemaType: 'Article'
        });
        break;
      case '404':
        applyPageSEO({
          title: '页面未找到 (404)',
          description: '您访问的百科词条在MZ维基中尚未创建或已被移动。',
          canonicalPath: missingPath,
          ogType: 'website'
        });
        break;
      case 'article':
      default:
        applyPageSEO({
          title: '卫生棉条',
          description: '卫生棉条是一种圆柱状的吸收材料，作为女性月经期间置入阴道以吸收经血的个人卫生用品。本条目涵盖其解剖学无感区原理、使用指南、TSS预防及历史。',
          canonicalPath: '/wiki/卫生棉条',
          ogType: 'article',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Tampax_Compak.jpg/640px-Tampax_Compak.jpg',
          schemaType: 'MedicalWebPage',
          tags: ['卫生棉条', '女性生理用品', '月经', '经期护理', 'TSS']
        });
        break;
    }
  }, [currentPage, currentWikiEntry, missingPath]);

  // Determine current active section list for TOC and Scrollspy
  const currentSections: SectionDef[] =
    currentPage === 'category' || currentPage === '404' || currentPage === 'graph' || currentPage === 'tags' || currentPage === 'stats' || currentPage === 'entry' ? [] :
    currentPage === 'privacy' ? PRIVACY_SECTIONS :
    currentPage === 'disclaimer' ? DISCLAIMER_SECTIONS :
    currentPage === 'conduct' ? CONDUCT_SECTIONS :
    ARTICLE_SECTIONS;

  // Scrollspy for active section in TOC
  useEffect(() => {
    if (currentPage === 'home') return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (let i = currentSections.length - 1; i >= 0; i--) {
        const sec = currentSections[i];
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSectionId(sec.id);
            return;
          }
        }
      }
      setActiveSectionId('top');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, currentSections]);

  const handleScrollToSection = (sectionId: string) => {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        const yOffset = -70;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        // Visual feedback highlight
        el.classList.add('ring-2', 'ring-[#3366cc]', 'bg-[#3366cc]/10', 'transition-all', 'duration-500', 'rounded');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-[#3366cc]', 'bg-[#3366cc]/10', 'rounded');
        }, 1200);
      } else {
        const fallbackTarget = document.querySelector(`[id*="${sectionId}"]`) as HTMLElement | null;
        const elementPosition = fallbackTarget?.getBoundingClientRect().top ?? 0;
        const offsetPosition = elementPosition + window.pageYOffset - 70;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        if (fallbackTarget) {
          fallbackTarget.classList.add('ring-2', 'ring-[#3366cc]', 'bg-[#3366cc]/10', 'transition-all', 'duration-500', 'rounded');
          setTimeout(() => {
            fallbackTarget.classList.remove('ring-2', 'ring-[#3366cc]', 'bg-[#3366cc]/10', 'rounded');
          }, 1200);
        }
      }
    }
  };

  // Page navigation helper with standard Wikipedia URLs (/wiki/条目名)
  const handleNavigatePage = (page: AppPage, sectionId?: string) => {
    setCurrentPage(page);
    setActiveSectionId(sectionId || 'top');
    const path = getWikiPath(page, sectionId);
    window.history.pushState({ page, sectionId }, '', path);
    if (sectionId && sectionId !== 'top') {
      setTimeout(() => handleScrollToSection(sectionId), 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateArticle = (sectionId?: string) => {
    handleNavigatePage('article', sectionId);
  };

  const handleNavigateTags = (tag?: string) => {
    setSelectedTagForTagsPage(tag);
    handleNavigatePage('tags');
  };

  const handleNavigateGraphWithContext = (tagFilter?: string, nodeId?: string) => {
    setInitialGraphTag(tagFilter);
    setInitialGraphNode(nodeId);
    handleNavigatePage('graph');
  };

  const handleNavigateSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    const path = getWikiPath(currentPage, sectionId);
    window.history.pushState({ page: currentPage, sectionId }, '', path);
    handleScrollToSection(sectionId);
  };

  // Navigate to an arbitrary wiki entry (if not full article, gracefully routes to /wiki/term in 404 page)
  const handleNavigateWikiTerm = (term: string) => {
    setWikiLinkHover(null);
    setRefHover(null);
    const clean = term.replace(/[（(].*?[）)]/g, '').trim();
    if (clean === '卫生棉条' || clean === '衛生棉條' || clean === 'Tampon' || clean === '棉条') {
      handleNavigateArticle();
    } else if (clean === '女性生理用品' || clean.startsWith('Category:')) {
      handleNavigatePage('category');
    } else {
      const entry = getWikiEntryByTitle(clean);
      if (entry) {
        setCurrentWikiEntry(entry);
        handleNavigatePage('entry', entry.title);
      } else {
        const missing = `/wiki/${encodeURIComponent(clean)}`;
        setMissingPath(missing);
        setCurrentPage('404');
        window.history.pushState({ page: '404', missingPath: missing }, '', missing);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleOpenWikiLink = (term: string, e: React.MouseEvent) => {
    setRefHover(null);
    const target = (e.currentTarget || e.target) as HTMLElement;
    const rect = target?.getBoundingClientRect?.();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.bottom : 200;
    setWikiLinkHover({
      term,
      position: {
        x,
        y,
        rect: rect ? {
          left: rect.left,
          top: rect.top,
          bottom: rect.bottom,
          right: rect.right,
          width: rect.width,
          height: rect.height
        } : undefined
      }
    });
  };

  const handleOpenReference = (ref: ReferenceItem, e: React.MouseEvent) => {
    setWikiLinkHover(null);
    const rect = (e.target as HTMLElement)?.getBoundingClientRect?.();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.bottom : 200;
    setRefHover({ reference: ref, position: { x, y } });
  };

  // Subheader titles and category badges for each independent page
  const pageMetaConfig = {
    home: {
      title: '首页',
      badge: '[ 维基全域门户 ]'
    },
    article: {
      title: '卫生棉条',
      badge: '[ 经期个人卫生用品 · 今日典范条目 ]'
    },
    category: {
      title: '分类:女性生理用品',
      badge: ''
    },
    graph: {
      title: 'Special:知识图谱与词条关系网络',
      badge: '[ 特殊页面 · 全域结构化知识实体网络 ]'
    },
    tags: {
      title: 'Special:知识标签与主题索引',
      badge: '[ 特殊页面 · 全域实体标签系统 ]'
    },
    stats: {
      title: 'Special:全域内容统计与学术深度量化',
      badge: '[ 特殊页面 · 全域自动化量化审计与统计模型 ]'
    },
    entry: {
      title: currentWikiEntry?.title || '百科词条',
      badge: currentWikiEntry ? `[ 百科词条 · ${currentWikiEntry.categoryLabel} ]` : '[ 知识实体 ]'
    },
    privacy: {
      title: 'MZ维基:隐私政策',
      badge: '[ 官方核心制度方针 ]'
    },
    disclaimer: {
      title: 'MZ维基:免责声明',
      badge: '[ 医学健康与法律免责通告 ]'
    },
    conduct: {
      title: 'MZ维基:全域行为准则',
      badge: '[ 社群文明与反歧视公约 ]'
    },
    '404': {
      title: '页面未找到 (HTTP 404)',
      badge: '[ 特殊页面 · 条目不存在 ]'
    }
  }[currentPage];

  return (
    <div className={`min-h-screen transition-colors ${
      isDarkMode ? 'bg-[#1e2022] text-[#eaecf0]' : 'bg-white text-[#202122]'
    } ${
      fontSize === 'small' ? 'text-xs' : fontSize === 'large' ? 'text-base' : 'text-sm'
    }`}>
      {/* 1. MZ Wiki Top Navigation Header */}
      <WikipediaHeader
        isDarkMode={isDarkMode}
        onOpenAppearance={() => setIsAppearanceOpen(true)}
        onNavigateSection={handleNavigateSection}
        onOpenPolicy={(tab) => handleNavigatePage(tab)}
        onNavigateHome={() => handleNavigatePage('home')}
        onNavigateArticle={(secId) => handleNavigateArticle(secId)}
        onNavigateCategory={() => handleNavigatePage('category')}
        onNavigateGraph={() => handleNavigatePage('graph')}
        onNavigateTags={() => handleNavigateTags()}
        onNavigateStats={() => handleNavigatePage('stats')}
        onNavigateNotFound={(term) => {
          setMissingPath(term ? `/wiki/${term}` : '/wiki/Special:404');
          handleNavigatePage('404');
        }}
        currentSections={currentSections}
        activeSectionId={activeSectionId}
        currentPageTitle={pageMetaConfig.title}
        currentPage={currentPage}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* 2. Page Title Ribbon (Displayed on article & policy pages) */}
      {currentPage !== 'home' && (
        <WikipediaSubheader
          isDarkMode={isDarkMode}
          readingMinutes={readingStats.minutes}
          wordCount={readingStats.wordCount}
          title={pageMetaConfig.title}
          badge={pageMetaConfig.badge}
          breadcrumbs={automatedBreadcrumbs}
          onNavigatePage={(pageKey) => handleNavigatePage(pageKey as any)}
          isPolicyPage={currentPage !== 'article' && currentPage !== 'category' && currentPage !== 'graph' && currentPage !== 'tags' && currentPage !== 'entry'}
          isCategoryPage={currentPage === 'category'}
          isGraphPage={currentPage === 'graph'}
          isTagsPage={currentPage === 'tags'}
          isStatsPage={currentPage === 'stats'}
          isEntryPage={currentPage === 'entry'}
          currentPage={currentPage}
          onNavigateArticle={() => handleNavigateArticle()}
          onNavigateGraph={() => handleNavigatePage('graph')}
          onNavigateCategory={() => handleNavigatePage('category')}
          onNavigateTags={() => handleNavigateTags()}
          onNavigateStats={() => handleNavigatePage('stats')}
        />
      )}

      {/* 3. Main Container */}
      <div className="max-w-[1720px] mx-auto px-4 py-6">
        {currentPage === 'home' ? (
          <main className="w-full">
            <HomePage
              isDarkMode={isDarkMode}
              onNavigateToArticle={(sectionId) => handleNavigateArticle(sectionId)}
              onNavigatePolicy={(policy) => handleNavigatePage(policy)}
              onNavigateCategory={() => handleNavigatePage('category')}
              onNavigateGraph={() => handleNavigatePage('graph')}
              onNavigateTags={handleNavigateTags}
              onNavigateStats={() => handleNavigatePage('stats')}
            />
          </main>
        ) : (
          <div className="flex gap-6 lg:gap-8 items-start relative">

            {/* Left Column: Side Table of Contents (Vector 2022) - Not displayed on category, graph, tags, stats, entry or 404 page */}
            {currentPage !== 'category' && currentPage !== '404' && currentPage !== 'graph' && currentPage !== 'tags' && currentPage !== 'stats' && currentPage !== 'entry' && (
              isSidebarOpen ? (
                <>
                  {/* Desktop & Tablet Sidebar (Always on the left side) */}
                  <aside className="hidden sm:block w-56 md:w-60 lg:w-64 shrink-0 sticky top-20">
                    <TableOfContents
                      activeSectionId={activeSectionId}
                      onSelectSection={handleNavigateSection}
                      isDarkMode={isDarkMode}
                      sections={currentSections}
                      onToggleSidebar={() => setIsSidebarOpen(false)}
                    />
                  </aside>

                  {/* Mobile (<640px) Side Overlay (Docks strictly to the left edge) */}
                  <div className="sm:hidden fixed inset-0 z-50 flex">
                    <div
                      className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                      onClick={() => setIsSidebarOpen(false)}
                    />
                    <aside className="relative z-10 w-72 max-w-[82vw] h-full shadow-2xl p-3 bg-white dark:bg-[#1e2022] overflow-y-auto">
                      <div className="flex justify-between items-center pb-2 mb-2 border-b border-black/10 dark:border-white/10">
                        <span className="font-bold text-xs">侧边目录</span>
                        <button
                          onClick={() => setIsSidebarOpen(false)}
                          className="text-xs text-[#3366cc] font-medium cursor-pointer"
                        >
                          关闭
                        </button>
                      </div>
                      <TableOfContents
                        activeSectionId={activeSectionId}
                        onSelectSection={(id) => {
                          handleNavigateSection(id);
                          setIsSidebarOpen(false);
                        }}
                        isDarkMode={isDarkMode}
                        sections={currentSections}
                        onToggleSidebar={() => setIsSidebarOpen(false)}
                      />
                    </aside>
                  </div>
                </>
              ) : (
                /* Collapsed side button (Click to show side directory) */
                <aside className="sticky top-20 shrink-0 z-30">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-r-md border border-l-0 shadow-sm text-xs font-medium cursor-pointer transition-colors ${
                      isDarkMode
                        ? 'bg-[#202122] border-[#54595d] text-[#eaecf0] hover:bg-[#2c2e33]'
                        : 'bg-white border-[#c8ccd1] text-[#202122] hover:bg-[#f8f9fa]'
                    }`}
                    title="展开左侧目录栏"
                  >
                    <ListFilter className="w-4 h-4 text-[#3366cc]" />
                    <span className="hidden sm:inline">目录</span>
                  </button>
                </aside>
              )
            )}

            {/* Right Column: Independent Page Content (NO directory box inside text) */}
            <main className="flex-1 min-w-0">

              {currentPage === 'article' && (
                <ArticleContent
                  onOpenWikiLink={handleOpenWikiLink}
                  onOpenReference={handleOpenReference}
                  onNavigateSection={handleNavigateSection}
                  onNavigateWikiTerm={handleNavigateWikiTerm}
                  isDarkMode={isDarkMode}
                  contentWidth={contentWidth}
                  onNavigateHome={() => handleNavigatePage('home')}
                  onNavigateCategory={() => handleNavigatePage('category')}
                  onNavigateGraph={() => handleNavigatePage('graph')}
                  onNavigateTags={handleNavigateTags}
                />
              )}

              {currentPage === 'category' && (
                <CategoryPage
                  isDarkMode={isDarkMode}
                  onNavigateToArticle={(secId) => handleNavigateArticle(secId)}
                  onNavigateHome={() => handleNavigatePage('home')}
                  onNavigateWikiTerm={handleNavigateWikiTerm}
                  onOpenWikiLink={handleOpenWikiLink}
                  onNavigateGraph={() => handleNavigatePage('graph')}
                />
              )}

              {currentPage === 'graph' && (
                <KnowledgeGraphPage
                  isDarkMode={isDarkMode}
                  onNavigateToArticle={(secId) => handleNavigateArticle(secId)}
                  onNavigateCategory={() => handleNavigatePage('category')}
                  onNavigateHome={() => handleNavigatePage('home')}
                  onNavigateWikiTerm={handleNavigateWikiTerm}
                  onNavigateTags={handleNavigateTags}
                  initialTagFilter={initialGraphTag}
                  initialSelectedNodeId={initialGraphNode}
                />
              )}

              {currentPage === 'tags' && (
                <TagsPage
                  isDarkMode={isDarkMode}
                  onNavigateToArticle={(secId) => handleNavigateArticle(secId)}
                  onNavigateCategory={() => handleNavigatePage('category')}
                  onNavigateGraph={handleNavigateGraphWithContext}
                  onNavigateWikiTerm={handleNavigateWikiTerm}
                  initialSelectedTag={selectedTagForTagsPage}
                />
              )}

              {currentPage === 'stats' && (
                <ContentStatisticsPage
                  isDarkMode={isDarkMode}
                  onNavigateHome={() => handleNavigatePage('home')}
                  onNavigateToArticle={(secId) => handleNavigateArticle(secId)}
                  onNavigateWikiTerm={handleNavigateWikiTerm}
                  onNavigateCategory={() => handleNavigatePage('category')}
                  onNavigateGraph={() => handleNavigatePage('graph')}
                  onNavigateTags={handleNavigateTags}
                />
              )}

              {currentPage === 'entry' && (
                <WikiEntryPage
                  entry={currentWikiEntry || WIKI_ENTRIES[0]}
                  isDarkMode={isDarkMode}
                  onNavigateToArticle={(secId) => handleNavigateArticle(secId)}
                  onNavigateWikiTerm={handleNavigateWikiTerm}
                  onNavigateGraph={handleNavigateGraphWithContext}
                  onNavigateTags={handleNavigateTags}
                  onNavigateCategory={() => handleNavigatePage('category')}
                  onOpenWikiLink={handleOpenWikiLink}
                />
              )}

              {currentPage === 'privacy' && (
                <PrivacyPage
                  isDarkMode={isDarkMode}
                  contentWidth={contentWidth}
                  onNavigateHome={() => handleNavigatePage('home')}
                />
              )}

              {currentPage === 'disclaimer' && (
                <DisclaimerPage
                  isDarkMode={isDarkMode}
                  contentWidth={contentWidth}
                  onNavigateHome={() => handleNavigatePage('home')}
                />
              )}

              {currentPage === 'conduct' && (
                <ConductPage
                  isDarkMode={isDarkMode}
                  contentWidth={contentWidth}
                  onNavigateHome={() => handleNavigatePage('home')}
                />
              )}

              {currentPage === '404' && (
                <NotFoundPage
                  isDarkMode={isDarkMode}
                  missingPath={missingPath}
                  onNavigateHome={() => handleNavigatePage('home')}
                  onNavigateArticle={(secId) => handleNavigateArticle(secId)}
                  onNavigateCategory={() => handleNavigatePage('category')}
                  onSearch={(term) => {
                    if (term.includes('棉条') || term.includes('使用') || term.includes('tss') || term.includes('导管')) {
                      handleNavigateArticle();
                    } else if (term.includes('分类') || term.includes('用品')) {
                      handleNavigatePage('category');
                    } else {
                      setMissingPath(`/wiki/${term}`);
                      handleNavigatePage('404');
                    }
                  }}
                />
              )}
            </main>

          </div>
        )}
      </div>

      {/* 4. MZ Wiki Footer */}
      <WikipediaFooter
        isDarkMode={isDarkMode}
        onOpenPolicy={(tab) => handleNavigatePage(tab)}
        onNavigateStats={() => handleNavigatePage('stats')}
      />

      {/* Popovers */}
      {wikiLinkHover && (
        <WikiLinkPreview
          term={wikiLinkHover.term}
          position={wikiLinkHover.position}
          onClose={() => setWikiLinkHover(null)}
          onNavigateSection={handleNavigateSection}
          onNavigateWiki={handleNavigateWikiTerm}
          onNavigateWikiTerm={handleNavigateWikiTerm}
          isDarkMode={isDarkMode}
        />
      )}

      {refHover && (
        <ReferencePreview
          reference={refHover.reference}
          position={refHover.position}
          onClose={() => setRefHover(null)}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Appearance Modal (Vector 2022 Appearance Settings) */}
      <AppearanceModal
        isOpen={isAppearanceOpen}
        onClose={() => setIsAppearanceOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={setIsDarkMode}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        contentWidth={contentWidth}
        onChangeContentWidth={setContentWidth}
      />
    </div>
  );
}
