import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ABSORBENCY_GRADES, ARTICLE_SECTIONS } from '../data/articleData';
import { SANITARY_PAD_IMAGES, SANITARY_PAD_SECTIONS, SANITARY_PAD_SPECS } from '../data/sanitaryPadData';
import { WIKI_ENTRIES, WikiEntry } from '../data/wikiEntriesData';
import {
  WikipediaImageThumb,
  WikiImageData,
  renderImageGraphic
} from '../components/WikipediaImageThumb';
import { WikipediaMediaViewer } from '../components/WikipediaMediaViewer';
import {
  getGlobalContentStatistics
} from '../utils/contentStatisticsAutomation';
import {
  FormalArticleApiRecord,
  fetchFormalArticlesApi
} from '../services/articlesApi';

// 首页搜索框模糊匹配映射表：将“卫生巾”、“姨妈巾”、“月经垫”等俗称/同义词映射至对应主条目
export const SANITARY_PAD_FUZZY_KEYWORDS = [
  '卫生巾',
  '衛生巾',
  '姨妈巾',
  '大姨妈巾',
  '月经垫',
  '月經墊',
  '卫生棉',
  '衛生棉',
  '生理棉',
  '生理巾',
  '生理垫',
  '卫生垫',
  '月经巾',
  '护翼卫生巾',
  '夜用卫生巾',
  '日用卫生巾',
  '液体卫生巾',
  '安睡裤',
  '护垫',
  '高洁丝',
  'kotex',
  'sanitary napkin',
  'sanitary pad',
  'sanitary towel'
];

export const TAMPON_FUZZY_KEYWORDS = [
  '卫生棉条',
  '衛生棉條',
  '棉条',
  '卫生栓',
  '月经栓',
  '导管棉条',
  '指入式棉条',
  '丹碧丝',
  'tampon',
  'tampax'
];

/**
 * 判断输入词是否命中“卫生棉（卫生巾）”模糊匹配规则
 */
export function matchSanitaryPadQuery(rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return false;
  // 若精确输入“卫生棉条”或“布卫生巾”，优先交给各自专属词条处理
  if (q.includes('棉条') || q.includes('棉條') || q === '布卫生巾' || q === '布衛生巾') {
    return false;
  }
  return SANITARY_PAD_FUZZY_KEYWORDS.some(
    (kw) => q === kw.toLowerCase() || q.includes(kw.toLowerCase()) || kw.toLowerCase().includes(q)
  );
}

// Official Wikimedia images for the Tampon Featured Article
const TAMPON_FEATURED_IMAGES: WikiImageData[] = [
  {
    id: 'tampon-anatomy',
    filename: 'Vaginal tampon placement.svg',
    title: '卫生棉条在阴道内的放置位置',
    caption: '卫生棉条在女性骨盆及阴道中上段（阴道后穹窿“无感区”）的放置位置剖面示意图',
    author: 'Wikimedia Commons 贡献者',
    license: 'CC BY-SA 4.0',
    date: '2015年9月',
    dimensions: '矢量图 (SVG)',
    fileSize: '85 KB',
    commonsUrl: 'https://commons.wikimedia.org/wiki/File:Vaginal_tampon.png',
    type: 'anatomy'
  },
  {
    id: 'tampon-elements',
    filename: 'Elements of a tampon with applicator.jpg',
    title: '导管型卫生棉条的构造拆解',
    caption: '导管型卫生棉条的构造拆解：1. 压缩棉芯 2. 花瓣口外导管 3. 内推杆 4. 棉线拉绳 5. 无菌外包装纸',
    author: 'Wikimedia Commons 贡献者',
    license: 'CC BY-SA 3.0',
    date: '2008年11月2日',
    dimensions: '1,600 × 1,100 像素',
    fileSize: '310 KB',
    commonsUrl: 'https://commons.wikimedia.org/wiki/File:Elements_of_a_tampon_with_applicator.jpg',
    type: 'elements'
  },
  {
    id: 'applicator-tampon',
    filename: 'Tampon with applicator.jpg',
    title: '导管型的卫生棉条（厄尔·哈斯专利构型）',
    caption: '基于1931年厄尔·哈斯（Earle Haas）专利研发的现代伸缩导管式卫生棉条',
    author: 'Wikimedia Commons 贡献者',
    license: 'CC BY-SA 3.0 / GFDL',
    date: '2007年3月15日',
    dimensions: '1,800 × 1,200 像素',
    fileSize: '340 KB',
    commonsUrl: 'https://commons.wikimedia.org/wiki/File:Tampon_with_applicator.jpg',
    type: 'applicator'
  },
  {
    id: 'tampon-absorbency',
    filename: 'Tamponlable.jpg',
    title: 'FDA卫生棉条吸收量级别标示',
    caption: '卫生棉条外包装上的法定吸收量级别与水滴标示（Light / Regular / Super / Super Plus / Ultra）',
    author: 'FDA / Wikimedia Commons',
    license: '公有领域 (Public Domain)',
    date: '2010年4月',
    dimensions: '1,200 × 750 像素',
    fileSize: '220 KB',
    commonsUrl: 'https://commons.wikimedia.org/wiki/File:Tamponlable.jpg',
    type: 'absorbency'
  }
];

interface HomePageProps {
  isDarkMode: boolean;
  onNavigateToArticle: (sectionId?: string) => void;
  onNavigateSanitaryPad?: (sectionId?: string) => void;
  onNavigatePolicy: (policy: 'privacy' | 'disclaimer' | 'conduct') => void;
  onNavigateCategory?: () => void;
  onNavigateGraph?: () => void;
  onNavigateTags?: (tag?: string) => void;
  onNavigateStats?: () => void;
  onNavigateWikiTerm?: (term: string) => void;
  onOpenWikiLink?: (term: string, event: React.MouseEvent) => void;
  onNavigateApiEntry?: (entry: WikiEntry) => void;
}

export interface UnifiedArticleItem {
  id: string;
  title: string;
  enTitle: string;
  aliases: string[];
  categoryKey: 'featured' | 'product' | 'medical' | 'anatomy' | 'history' | 'society';
  categoryLabel: string;
  qualityGrade: 'FA' | 'GA' | 'A' | 'B';
  qualityBadgeText: string;
  wordCount: number;
  sectionCount: number;
  referenceCount: number;
  summary: string;
  tags: string[];
  sectionsPreview: { id: string; title: string }[];
  onNavigate: (sectionId?: string) => void;
  isBuiltIn?: boolean;
  sourceUrl?: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  isDarkMode,
  onNavigateToArticle,
  onNavigateSanitaryPad,
  onNavigatePolicy,
  onNavigateCategory,
  onNavigateGraph,
  onNavigateTags,
  onNavigateStats,
  onNavigateWikiTerm,
  onOpenWikiLink,
  onNavigateApiEntry,
}) => {
  const [activeLightboxImageId, setActiveLightboxImageId] = useState<string | null>(null);
  const [expandedDykIndex, setExpandedDykIndex] = useState<number | null>(null);
  const [featuredPicIndex, setFeaturedPicIndex] = useState<number>(0);

  // 全站词条列表区的分类筛选与视图切换状态
  const [selectedArticleCategory, setSelectedArticleCategory] = useState<string>('all');
  const [articleListViewMode, setArticleListViewMode] = useState<'cards' | 'directory' | 'chapters'>('cards');
  const [directoryFilterQuery, setDirectoryFilterQuery] = useState<string>('');
  const [standardsTab, setStandardsTab] = useState<'pad' | 'tampon'>('pad');

  // 首页搜索框状态与下拉建议控制
  const [homeSearchQuery, setHomeSearchQuery] = useState<string>('');
  const [isHomeSearchFocused, setIsHomeSearchFocused] = useState<boolean>(false);
  const homeSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (homeSearchRef.current && !homeSearchRef.current.contains(e.target as Node)) {
        setIsHomeSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const globalStats = useMemo(() => getGlobalContentStatistics(), []);

  // =========================================================================
  // 后端 API 动态词条状态（GET /api/articles）
  // =========================================================================
  const [apiDynamicRecords, setApiDynamicRecords] = useState<FormalArticleApiRecord[]>([]);

  // 页面加载时自动从 GET /api/articles 获取当前全站正式词条列表
  useEffect(() => {
    fetchFormalArticlesApi()
      .then((res) => {
        const dynamicOnes = res.data.filter((item) => !item.isBuiltIn);
        setApiDynamicRecords(dynamicOnes);
      })
      .catch(() => {
        // Fallback silently if offline
      });
  }, []);

  // =========================================================================
  // 核心词条列表：当前默认收录的 2 篇维基百科正式词条 + 通过 API 动态拉取的新增词条 (#3, #4...)
  // 1. 《卫生棉条》（zh.wikipedia.org/wiki/衛生棉條）
  // 2. 《卫生棉（卫生巾）》（zh.wikipedia.org/wiki/衛生棉）
  // =========================================================================
  const allEncyclopediaArticles: UnifiedArticleItem[] = useMemo(() => {
    const tamponArticle: UnifiedArticleItem = {
      id: 'tampon',
      title: '卫生棉条',
      enTitle: 'Tampon (zh.wikipedia.org/wiki/衛生棉條)',
      aliases: ['卫生栓', '棉条', '导管棉条', '指入式棉条'],
      categoryKey: 'product',
      categoryLabel: '体内生理用品',
      qualityGrade: 'FA',
      qualityBadgeText: '★ 典范词条 (#1)',
      wordCount: 3820,
      sectionCount: ARTICLE_SECTIONS.length,
      referenceCount: 15,
      summary:
        '置入阴道中上段“后穹窿无感区”直接吸收经血的圆柱状体内女性生理用品，涵盖导管式与指入式构造、FDA吸收量标准、45度置入规范及TSS预防指引。',
      tags: ['体内吸收', '无感区', '导管式', '指入式', 'FDA分级', 'TSS预防'],
      sectionsPreview: ARTICLE_SECTIONS.map((s) => ({ id: s.id, title: `${s.number} ${s.title}` })),
      onNavigate: (secId) => onNavigateToArticle(secId),
      isBuiltIn: true,
      sourceUrl: 'https://zh.wikipedia.org/wiki/%E8%A1%9B%E7%94%9F%E6%A3%89%E6%9D%A1'
    };

    const sanitaryPadArticle: UnifiedArticleItem = {
      id: 'sanitary-pad',
      title: '卫生棉（卫生巾）',
      enTitle: 'Sanitary Napkin / Pad (zh.wikipedia.org/wiki/衛生棉)',
      aliases: ['卫生巾', '姨妈巾', '月经垫', '生理棉', '卫生垫'],
      categoryKey: 'product',
      categoryLabel: '体外生理用品',
      qualityGrade: 'FA',
      qualityBadgeText: '⊕ 优良词条 (#2)',
      wordCount: 4160,
      sectionCount: SANITARY_PAD_SECTIONS.length,
      referenceCount: 12,
      summary:
        '贴附于内裤裆部内侧使用的条状体外女性生理用品（俗称卫生巾、姨妈巾、月经垫），涵盖一战纤维素棉起源、五层复合高分子SAP结构、蝶翼防漏、布卫生棉与经期平权。',
      tags: ['体外吸收', '卫生巾', '姨妈巾', '高分子吸水树脂', '防漏蝶翼', '布卫生巾'],
      sectionsPreview: SANITARY_PAD_SECTIONS.map((s) => ({ id: s.id, title: `${s.number} ${s.title}` })),
      onNavigate: (secId) => onNavigateSanitaryPad?.(secId),
      isBuiltIn: true,
      sourceUrl: 'https://zh.wikipedia.org/wiki/%E8%A1%9B%E7%94%9F%E6%A3%89'
    };

    const dynamicMapped: UnifiedArticleItem[] = apiDynamicRecords.map((rec, idx) => ({
      id: rec.id,
      title: rec.title,
      enTitle: rec.enTitle,
      aliases: rec.aliases,
      categoryKey: rec.categoryKey,
      categoryLabel: rec.categoryLabel,
      qualityGrade: rec.qualityGrade,
      qualityBadgeText: `API 收录词条 (#${idx + 3})`,
      wordCount: rec.wordCount,
      sectionCount: rec.sectionCount,
      referenceCount: rec.referenceCount,
      summary: rec.summary,
      tags: rec.tags,
      sectionsPreview: rec.sectionsPreview,
      isBuiltIn: false,
      sourceUrl: rec.sourceUrl,
      onNavigate: () => {
        if (rec.entryPayload && onNavigateApiEntry) {
          onNavigateApiEntry(rec.entryPayload);
        } else {
          onNavigateWikiTerm?.(rec.title);
        }
      }
    }));

    return [tamponArticle, sanitaryPadArticle, ...dynamicMapped];
  }, [onNavigateToArticle, onNavigateSanitaryPad, apiDynamicRecords, onNavigateApiEntry, onNavigateWikiTerm]);

  // 分类标签页统计计数（仅统计正式词条）
  const articleCategories = useMemo(() => {
    return [
      { key: 'all', label: '全部已收录词条', count: allEncyclopediaArticles.length },
      {
        key: 'product',
        label: '女性生理用品主词条',
        count: allEncyclopediaArticles.filter((a) => a.categoryKey === 'product').length
      }
    ];
  }, [allEncyclopediaArticles]);

  // 根据分类与关键词过滤后的词条列表
  const filteredEncyclopediaArticles = useMemo(() => {
    return allEncyclopediaArticles.filter((article) => {
      const matchesCategory =
        selectedArticleCategory === 'all'
          ? true
          : selectedArticleCategory === 'featured'
          ? article.id === 'tampon' || article.id === 'sanitary-pad'
          : selectedArticleCategory === 'history-society'
          ? article.categoryKey === 'history' || article.categoryKey === 'society'
          : article.categoryKey === selectedArticleCategory;

      if (!matchesCategory) return false;

      const q = directoryFilterQuery.trim().toLowerCase();
      if (!q) return true;

      return (
        article.title.toLowerCase().includes(q) ||
        article.enTitle.toLowerCase().includes(q) ||
        article.aliases.some((a) => a.toLowerCase().includes(q)) ||
        article.tags.some((t) => t.toLowerCase().includes(q)) ||
        article.summary.toLowerCase().includes(q)
      );
    });
  }, [allEncyclopediaArticles, selectedArticleCategory, directoryFilterQuery]);

  // 首页搜索框模糊匹配候选列表生成逻辑
  const homeSearchSuggestions = useMemo(() => {
    const q = homeSearchQuery.trim().toLowerCase();
    if (!q) return [];

    const results: Array<{
      id: string;
      title: string;
      matchedAlias?: string;
      badge: string;
      summary: string;
      onSelect: () => void;
    }> = [];

    // 1. 优先检测是否模糊匹配“卫生棉（卫生巾）”（支持“卫生巾”、“姨妈巾”、“月经垫”等）
    if (matchSanitaryPadQuery(q)) {
      const matchedAlias =
        SANITARY_PAD_FUZZY_KEYWORDS.find(
          (kw) => kw.toLowerCase().includes(q) || q.includes(kw.toLowerCase())
        ) || homeSearchQuery.trim();
      results.push({
        id: 'featured-sanitary-pad',
        title: '卫生棉（卫生巾）',
        matchedAlias:
          matchedAlias !== '卫生棉' ? `重定向自「${matchedAlias}」（卫生巾 / 姨妈巾 / 月经垫）` : undefined,
        badge: '优良主条目',
        summary:
          '贴附于内裤内侧使用的条状体外女性生理用品，俗称卫生巾、姨妈巾、月经垫，具四层复合高分子吸水结构与防漏蝶翼。',
        onSelect: () => onNavigateSanitaryPad?.()
      });
    }

    // 2. 检测是否模糊匹配“卫生棉条”
    if (
      TAMPON_FUZZY_KEYWORDS.some(
        (kw) => q === kw.toLowerCase() || q.includes(kw.toLowerCase()) || kw.toLowerCase().includes(q)
      )
    ) {
      results.push({
        id: 'featured-tampon',
        title: '卫生棉条（Tampon）',
        matchedAlias: q !== '卫生棉条' ? `匹配同义词「${homeSearchQuery.trim()}」` : undefined,
        badge: '典范主条目',
        summary:
          '置入阴道中上段“无感区”直接吸收经血的圆柱状体内生理用品，分导管式与指入式两大类型。',
        onSelect: () => onNavigateToArticle()
      });
    }

    // 3. 遍历百科词条库 WIKI_ENTRIES 进行标题、别名、标签模糊检索
    WIKI_ENTRIES.forEach((entry) => {
      if (entry.id === 'sanitary-pad') {
        if (results.some((r) => r.id === 'featured-sanitary-pad')) return;
      }
      const titleMatch = entry.title.toLowerCase().includes(q) || entry.enTitle.toLowerCase().includes(q);
      const aliasHit = entry.aliases.find(
        (a) => a.toLowerCase().includes(q) || q.includes(a.toLowerCase())
      );
      const tagHit = entry.tags.find((t) => t.toLowerCase().includes(q));

      if (titleMatch || aliasHit || tagHit) {
        results.push({
          id: entry.id,
          title: entry.id === 'sanitary-pad' ? '卫生棉（卫生巾）' : entry.title,
          matchedAlias: aliasHit ? `别名匹配：${aliasHit}` : tagHit ? `标签匹配：${tagHit}` : undefined,
          badge: entry.categoryLabel,
          summary: entry.summary.slice(0, 68) + '...',
          onSelect: () => {
            if (entry.id === 'sanitary-pad') {
              onNavigateSanitaryPad?.();
            } else {
              onNavigateWikiTerm?.(entry.title);
            }
          }
        });
      }
    });

    return results.slice(0, 8);
  }, [homeSearchQuery, onNavigateSanitaryPad, onNavigateToArticle, onNavigateWikiTerm]);

  // 首页搜索提交处理函数（支持回车或点击“前往条目”按钮）
  const handleHomeSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const raw = homeSearchQuery.trim();
    if (!raw) return;

    // 1. 若输入“卫生巾”、“姨妈巾”、“月经垫”或相关模糊词，直接导航到“卫生棉（卫生巾）”页面
    if (matchSanitaryPadQuery(raw)) {
      setIsHomeSearchFocused(false);
      onNavigateSanitaryPad?.();
      return;
    }

    // 2. 若输入“卫生棉条”、“棉条”等，导航到“卫生棉条”页面
    if (
      TAMPON_FUZZY_KEYWORDS.some(
        (kw) => raw.toLowerCase() === kw.toLowerCase() || raw.toLowerCase().includes(kw.toLowerCase())
      )
    ) {
      setIsHomeSearchFocused(false);
      onNavigateToArticle();
      return;
    }

    // 3. 若候选列表中有匹配项，触发第一顺位匹配项导航
    if (homeSearchSuggestions.length > 0) {
      setIsHomeSearchFocused(false);
      homeSearchSuggestions[0].onSelect();
      return;
    }

    // 4. 兜底交由全域词条路由处理
    setIsHomeSearchFocused(false);
    onNavigateWikiTerm?.(raw);
  };

  // Combined gallery of all technical SVG illustrations from both featured articles
  const allFeaturedPictures: Array<{
    asset: WikiImageData;
    articleTitle: string;
    onNavigateArticle: () => void;
    credit: string;
  }> = [
    {
      asset: SANITARY_PAD_IMAGES[1], // layers
      articleTitle: '卫生棉（卫生巾）',
      onNavigateArticle: () => onNavigateSanitaryPad?.('pad-structure'),
      credit: 'MZ维基工程制图组 · 卫生巾四层复合结构与SAP锁水剖面图'
    },
    {
      asset: TAMPON_FEATURED_IMAGES[0], // anatomy
      articleTitle: '卫生棉条',
      onNavigateArticle: () => onNavigateToArticle('usage-guide'),
      credit: 'MZ维基医学插画组 · 矢状面盆腔解剖与阴道后穹窿“无感区”定位图'
    },
    {
      asset: SANITARY_PAD_IMAGES[0], // wings
      articleTitle: '卫生棉（卫生巾）',
      onNavigateArticle: () => onNavigateSanitaryPad?.('pad-types'),
      credit: 'MZ维基工程制图组 · 带有防漏侧翼（蝶翼）与中央导流压花槽的现代卫生棉'
    },
    {
      asset: TAMPON_FEATURED_IMAGES[1], // elements
      articleTitle: '卫生棉条',
      onNavigateArticle: () => onNavigateToArticle('structure-and-types'),
      credit: 'MZ维基工程制图组 · 导管型卫生棉条五部件构造拆解示意图'
    },
    {
      asset: SANITARY_PAD_IMAGES[3], // reusable
      articleTitle: '卫生棉（卫生巾）',
      onNavigateArticle: () => onNavigateSanitaryPad?.('pad-environment'),
      credit: 'MZ维基工程制图组 · 可重复水洗式环保布卫生棉（按扣固定式）织物结构图'
    },
    {
      asset: SANITARY_PAD_IMAGES[2], // history belt
      articleTitle: '卫生棉（卫生巾）',
      onNavigateArticle: () => onNavigateSanitaryPad?.('pad-history'),
      credit: 'Wikimedia Commons 历史档案 · 1920年代生理带固定式与1970年代自粘背胶演进对比'
    },
    {
      asset: TAMPON_FEATURED_IMAGES[2], // applicator
      articleTitle: '卫生棉条',
      onNavigateArticle: () => onNavigateToArticle('history'),
      credit: '美国专利档案重构 · 厄尔·哈斯导管式棉条（Tampax）活塞推入结构'
    },
    {
      asset: TAMPON_FEATURED_IMAGES[3], // absorbency
      articleTitle: '卫生棉条',
      onNavigateArticle: () => onNavigateToArticle('absorbency-standards'),
      credit: '美国FDA 21 CFR 801.430 · 卫生棉条法定吸收量等级与水滴标识规范'
    }
  ];

  const allImagesList = useMemo(
    () => allFeaturedPictures.map((p) => p.asset),
    []
  );

  const currentFeaturedPic = allFeaturedPictures[featuredPicIndex] || allFeaturedPictures[0];

  // Helper for rendering authentic Wikipedia inline blue links with hover preview & click navigation
  const renderWikiLink = (
    term: string,
    label?: string,
    options?: { bold?: boolean; customClick?: () => void }
  ) => {
    const display = label || term;
    return (
      <button
        type="button"
        onClick={() => {
          if (options?.customClick) {
            options.customClick();
          } else if (term === '卫生棉条') {
            onNavigateToArticle();
          } else if (
            term === '卫生棉' ||
            term === '卫生巾' ||
            term === '姨妈巾' ||
            term === '月经垫' ||
            matchSanitaryPadQuery(term)
          ) {
            onNavigateSanitaryPad?.();
          } else if (term === '女性生理用品') {
            onNavigateCategory?.();
          } else if (onNavigateWikiTerm) {
            onNavigateWikiTerm(term);
          }
        }}
        onMouseEnter={(e) => onOpenWikiLink?.(term, e)}
        className={`text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer inline text-left ${
          options?.bold ? 'font-bold' : ''
        }`}
      >
        {display}
      </button>
    );
  };

  // Extended DYK list combining Tampon, Sanitary Pad, and other Wiki Entries
  const combinedDykItems = [
    {
      questionPrefix: '哪一种贴附于内裤裆部内侧的',
      boldTerm: '卫生棉',
      boldLabel: '体外经期生理用品（卫生巾）',
      questionSuffix: '源自第一次世界大战战地救护材料“纤维素棉”，并在1980年代引入高分子吸水树脂（SAP）与防漏蝶翼后实现了超薄化革命？',
      answer: '1914年第一次世界大战期间，美国克林百利公司研发出吸水率远高于纯棉的木浆纤维素棉（Cellucotton），前线红十字会护士发现其极适合作为经期垫巾；1921年商业化品牌“高洁丝（Kotex）”正式上市。1980年代高分子吸水树脂（SAP）与护翼（Wings）的引入则彻底改变了现代卫生巾的厚度与防侧漏性能。',
      onJump: () => onNavigateSanitaryPad?.('pad-history')
    },
    {
      questionPrefix: '为什么正确置入',
      boldTerm: '卫生棉条',
      boldLabel: '卫生棉条',
      questionSuffix: '推至',
      secondTerm: '阴道穹',
      secondLabel: '阴道后穹窿',
      questionSuffix2: '区域后，使用者在日常行走与运动中几乎完全感觉不到它的存在？',
      answer: '人体阴道壁的感觉神经分布具有显著的分段差异：阴道下1/3段（前庭与阴道口周围）富集躯体感觉神经末梢，对触觉、摩擦与扩张极为敏感；而阴道中上2/3段及阴道后穹窿主要由内脏植物神经支配，对机械接触几乎无痛感或异物感，在妇产科学中被称为“生理无感区”。',
      onJump: () => onNavigateToArticle('usage-guide')
    },
    {
      questionPrefix: '为什么单支高吸收量',
      boldTerm: '卫生棉条',
      boldLabel: '卫生棉条',
      questionSuffix: '在体内严格遵守',
      secondTerm: '8小时安全时限',
      secondLabel: '8小时安全更换时限',
      questionSuffix2: '，能够有效预防罕见但凶险的「中毒性休克综合征（TSS）」？',
      answer: '中毒性休克综合征（TSS）主要由金黄色葡萄球菌分泌的 TSST-1 超抗原外毒素引起。超高吸收度棉条若在体内留置超过8小时，会改变阴道弱酸微生态并引入微量氧气，激活细菌合成超抗原毒素。遵循“按经量选择最低吸收度”且每4–8小时更换即可有效阻断风险。',
      onJump: () => onNavigateWikiTerm?.('中毒性休克综合征')
    },
    {
      questionPrefix: '传统俗称“处女膜”的',
      boldTerm: '阴道冠',
      boldLabel: '阴道冠（Vaginal Corona）',
      questionSuffix: '在解剖学上究竟是什么构造？未发生过性行为的女性可以使用卫生棉条或',
      secondTerm: '月经杯',
      secondLabel: '月经杯',
      questionSuffix2: '吗？',
      answer: '现代妇产科学将其规范命名为“阴道冠”，它是环绕在阴道口周缘的一圈富有弹性的黏膜皱襞，中央天生存在直径约1.5–2.5厘米的自然开口（以供经血排出），并非完全封闭的实心膜。在经期润滑状态下，选用量少型（Light）导管式棉条可顺畅通过该自然孔隙而不造成黏膜损伤。',
      onJump: () => onNavigateWikiTerm?.('阴道冠')
    },
    {
      questionPrefix: '健康育龄女性的',
      boldTerm: '阴道菌群',
      boldLabel: '阴道微生态菌群',
      questionSuffix: '是如何依靠乳酸杆菌维持 pH 3.8–4.5 的弱酸自净屏障的？为什么妇科医学反对常规“阴道灌洗”？',
      answer: '健康阴道菌群中卷曲乳杆菌等乳酸杆菌占比达90%以上，它们分解上皮糖原产生乳酸与过氧化氢，抑制致病菌增殖。人为使用洗液灌洗阴道反而会冲刷掉保护性乳杆菌，破坏弱酸屏障并诱发细菌性阴道病。',
      onJump: () => onNavigateWikiTerm?.('阴道菌群')
    },
    {
      questionPrefix: '为什么全球多个国家与地区近年来相继立法废除针对',
      boldTerm: '卫生棉',
      boldLabel: '卫生巾',
      questionSuffix: '与棉条征收的增值税（俗称“',
      secondTerm: '粉红税',
      secondLabel: '粉红税 / 经期税',
      questionSuffix2: '”）？',
      answer: '经期护理用品属于女性不可避免的生理刚需必需品，而非奢侈消费品。苏格兰于2020年立法免费提供经期用品，肯尼亚、英国、加拿大、澳洲及印度等多国亦先后免除经期用品增值税，以消除性别价格歧视与“月经贫困”。',
      onJump: () => onNavigateWikiTerm?.('粉红税')
    }
  ];

  // 维基门户三大核心板块筛选/切换状态（全部板块 | 今日推荐 | 医学科普 | 分类导航）
  const [activePortalModule, setActivePortalModule] = useState<
    'all' | 'featured' | 'medical' | 'categories'
  >('all');

  // 三大门户板块元数据定义（用于顶部维基门户矩阵与板块锚点直达）
  const portalModulesMeta = [
    {
      key: 'featured' as const,
      id: 'portal-featured',
      badge: '板块 01',
      title: '今日推荐',
      enTitle: 'Featured & Curated',
      summary: `全站已收录正式词条（${allEncyclopediaArticles.length}篇）、典范/优良主条目导读与每日特色图谱`,
      accentHeaderBg: 'bg-[#cef2e0] dark:bg-[#1e3a2f]',
      accentTagText: 'text-[#145232] dark:text-[#7ee2a8]'
    },
    {
      key: 'medical' as const,
      id: 'portal-medical',
      badge: '板块 02',
      title: '医学科普',
      enTitle: 'Medical & Physiology',
      summary: '「你知道吗？」循证问答、盆腔解剖与微生态专题、GB/FDA技术标准对比',
      accentHeaderBg: 'bg-[#cedff2] dark:bg-[#1f3147]',
      accentTagText: 'text-[#1b3a63] dark:text-[#8ab4f8]'
    },
    {
      key: 'categories' as const,
      id: 'portal-categories',
      badge: '板块 03',
      title: '分类导航',
      enTitle: 'Category & Topology',
      summary: '六大学科分类门户矩阵、文内专业术语索引、分类树与知识图谱直达',
      accentHeaderBg: 'bg-[#f2e6ce] dark:bg-[#382e1e]',
      accentTagText: 'text-[#5c4314] dark:text-[#e6c47a]'
    }
  ];

  const handleSelectPortalModule = (
    moduleKey: 'all' | 'featured' | 'medical' | 'categories',
    anchorId?: string
  ) => {
    setActivePortalModule(moduleKey);
    if (moduleKey === 'all' && anchorId) {
      setTimeout(() => {
        document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 30);
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto font-sans">
      {/* =====================================================================
          1. WIKIPEDIA NAMESPACE TABS BAR (Wikipedia:首页顶部命名空间标签栏)
          Matches https://zh.wikipedia.org/wiki/Wikipedia:首页
         ===================================================================== */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#a7d7f9] dark:border-[#3a4b5c] mb-3 text-xs sm:text-sm select-none">
        {/* Left: Namespace & Portal Module Quick Tabs */}
        <div className="flex flex-wrap items-center space-x-1">
          <button
            type="button"
            onClick={() => setActivePortalModule('all')}
            className={`px-3 py-1.5 border-t border-l border-r cursor-pointer ${
              activePortalModule === 'all'
                ? 'font-bold border-[#a7d7f9] dark:border-[#3a4b5c] bg-white dark:bg-[#1e2022] text-[#202122] dark:text-[#eaecf0] -mb-[1px]'
                : 'border-transparent bg-[#f8f9fa] dark:bg-[#22252a] text-[#3366cc] dark:text-[#6b9eff] hover:underline'
            }`}
          >
            维基门户首页
          </button>
          <button
            type="button"
            onClick={() => handleSelectPortalModule('all', 'portal-featured')}
            className="px-2.5 py-1.5 text-[#3366cc] dark:text-[#6b9eff] hover:underline bg-[#f8f9fa] dark:bg-[#22252a] border-t border-l border-r border-transparent font-medium cursor-pointer"
          >
            今日推荐（{allEncyclopediaArticles.length}篇词条）
          </button>
          <button
            type="button"
            onClick={() => handleSelectPortalModule('all', 'portal-medical')}
            className="hidden sm:inline-block px-2.5 py-1.5 text-[#3366cc] dark:text-[#6b9eff] hover:underline bg-[#f8f9fa] dark:bg-[#22252a] border-t border-l border-r border-transparent cursor-pointer"
          >
            医学科普
          </button>
          <button
            type="button"
            onClick={() => handleSelectPortalModule('all', 'portal-categories')}
            className="hidden sm:inline-block px-2.5 py-1.5 text-[#3366cc] dark:text-[#6b9eff] hover:underline bg-[#f8f9fa] dark:bg-[#22252a] border-t border-l border-r border-transparent cursor-pointer"
          >
            分类导航
          </button>
          <button
            type="button"
            onClick={() => onNavigateStats?.()}
            className="px-2.5 py-1.5 text-[#3366cc] dark:text-[#6b9eff] hover:underline bg-[#f8f9fa] dark:bg-[#22252a] border-t border-l border-r border-transparent cursor-pointer"
            title="查看百科全域内容量化审计与讨论报告"
          >
            讨论与统计
          </button>
        </div>

        {/* Right: View & Core Articles Quick Tabs */}
        <div className="flex flex-wrap items-center space-x-1 sm:space-x-2 py-1">
          <span className="px-2.5 py-1 font-bold text-[#202122] dark:text-[#eaecf0] border-b-2 border-[#3366cc]">
            门户阅读
          </span>
          <span className="text-[#a2a9b1] dark:text-[#54595d]">|</span>
          <button
            type="button"
            onClick={() => onNavigateSanitaryPad?.()}
            className="px-2 py-1 text-[#3366cc] dark:text-[#6b9eff] hover:underline font-medium cursor-pointer"
          >
            卫生棉（卫生巾）
          </button>
          <span className="text-[#a2a9b1] dark:text-[#54595d]">·</span>
          <button
            type="button"
            onClick={() => onNavigateToArticle()}
            className="px-2 py-1 text-[#3366cc] dark:text-[#6b9eff] hover:underline font-medium cursor-pointer"
          >
            卫生棉条
          </button>
          <span className="text-[#a2a9b1] dark:text-[#54595d]">·</span>
          <button
            type="button"
            onClick={() => onNavigateCategory?.()}
            className="hidden md:inline px-2 py-1 text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
          >
            分类:女性生理用品
          </button>
          <span className="hidden lg:inline text-[#a2a9b1] dark:text-[#54595d]">·</span>
          <button
            type="button"
            onClick={() => onNavigateGraph?.()}
            className="hidden lg:inline px-2 py-1 text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
          >
            知识图谱
          </button>
        </div>
      </div>

      {/* =====================================================================
          2. TOP WELCOME BANNER & 4-MODULE PORTAL MATRIX (mp-topbanner)
          融合中文维基百科首页顶部欢迎框与“今日推荐 / 医学科普 / 分类导航 / 社群动态”四维网格入口
         ===================================================================== */}
      <div className="border border-[#c8ccd1] dark:border-[#3a3e47] bg-[#f8f9fa] dark:bg-[#22252a] mb-4 p-4 sm:px-6 sm:py-4 relative overflow-hidden">
        {/* Subtle Wikipedia-style watermark graphic */}
        <svg
          className="absolute right-4 top-1/2 -translate-y-1/2 w-36 h-36 opacity-[0.04] dark:opacity-[0.06] pointer-events-none select-none"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
          <ellipse cx="50" cy="50" rx="22" ry="45" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="2" />
          <line x1="12" y1="28" x2="88" y2="28" stroke="currentColor" strokeWidth="1.5" />
          <line x1="12" y1="72" x2="88" y2="72" stroke="currentColor" strokeWidth="1.5" />
        </svg>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center relative z-10">
          {/* Left (7 cols): Welcome Title, Live Statistics & Fuzzy Search Box */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-[#54595d] dark:text-[#a2a9b1] mb-0.5">
              <span>Wikipedia:首页</span>
              <span>·</span>
              <span>Portal:女性健康与生理卫生门户</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202122] dark:text-[#eaecf0] leading-snug">
              欢迎来到<span className="font-bold">MZ维基</span>
            </h1>
            <p className="text-xs sm:text-[13px] text-[#54595d] dark:text-[#a2a9b1] mt-0.5">
              海纳百川，有容乃大 · 循证医学与女性生理健康自由百科全书
            </p>
            <p className="text-xs sm:text-[13px] text-[#202122] dark:text-[#eaecf0] mt-1.5">
              目前共收录{' '}
              <button
                type="button"
                onClick={() => handleSelectPortalModule('all', 'all-articles-hub')}
                className="font-bold text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
              >
                {allEncyclopediaArticles.length} 篇独立百科词条
              </button>{' '}
              · 共计{' '}
              <button
                type="button"
                onClick={() => onNavigateStats?.()}
                className="font-bold text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
              >
                {globalStats.totalWords.toLocaleString()}
              </button>{' '}
              汉字 ·{' '}
              <button
                type="button"
                onClick={() => onNavigateStats?.()}
                className="font-bold text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
              >
                {globalStats.totalReferences}
              </button>{' '}
              篇同行评审文献索引
            </p>

            {/* Wikipedia Main Page Search Box with Fuzzy Alias Resolution */}
            <div ref={homeSearchRef} className="mt-2.5 relative max-w-xl mx-auto lg:mx-0">
              <form onSubmit={handleHomeSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  value={homeSearchQuery}
                  onChange={(e) => {
                    setHomeSearchQuery(e.target.value);
                    setIsHomeSearchFocused(true);
                  }}
                  onFocus={() => setIsHomeSearchFocused(true)}
                  placeholder="搜索全部词条（支持模糊匹配：卫生巾、姨妈巾、月经垫、卫生棉条、月经杯、TSS...）"
                  aria-label="搜索MZ维基条目"
                  className="w-full px-3 py-1.5 text-xs sm:text-[13px] bg-white dark:bg-[#181a1d] text-[#202122] dark:text-[#eaecf0] border border-[#a2a9b1] dark:border-[#54595d] focus:border-[#3366cc] focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 px-3.5 py-1.5 text-xs sm:text-[13px] font-bold bg-[#f8f9fa] hover:bg-[#eaecf0] dark:bg-[#2a2e35] dark:hover:bg-[#353a42] text-[#202122] dark:text-[#eaecf0] border border-l-0 border-[#a2a9b1] dark:border-[#54595d] cursor-pointer transition-colors"
                >
                  前往条目
                </button>
              </form>

              {/* Fuzzy Match Autocomplete Dropdown */}
              {isHomeSearchFocused && homeSearchQuery.trim() !== '' && (
                <div className="absolute left-0 right-0 top-full mt-0.5 z-50 bg-white dark:bg-[#1e2022] border border-[#a2a9b1] dark:border-[#54595d] shadow-lg text-left">
                  {homeSearchSuggestions.length > 0 ? (
                    <ul className="divide-y divide-[#eaecf0] dark:divide-[#2e3238]">
                      {homeSearchSuggestions.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setIsHomeSearchFocused(false);
                              setHomeSearchQuery('');
                              item.onSelect();
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-[#eaf3ff] dark:hover:bg-[#263245] transition-colors cursor-pointer block"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-xs sm:text-[13px] text-[#3366cc] dark:text-[#6b9eff]">
                                {item.title}
                              </span>
                              <span className="text-[11px] text-[#54595d] dark:text-[#a2a9b1] font-mono">
                                [{item.badge}]
                              </span>
                            </div>
                            {item.matchedAlias && (
                              <div className="text-[11px] text-[#006400] dark:text-[#5cd68d] mt-0.5">
                                ↳ {item.matchedAlias}
                              </div>
                            )}
                            <p className="text-[11px] text-[#54595d] dark:text-[#a2a9b1] line-clamp-1 mt-0.5">
                              {item.summary}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-3 py-2.5 text-xs text-[#54595d] dark:text-[#a2a9b1] flex items-center justify-between">
                      <span>未找到精确条目，按回车尝试模糊检索「{homeSearchQuery.trim()}」</span>
                      <button
                        type="button"
                        onClick={() => handleHomeSearchSubmit()}
                        className="text-[#3366cc] dark:text-[#6b9eff] font-bold hover:underline"
                      >
                        立即跳转 →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Direct Popular Entries Bar */}
            <div className="mt-2 pt-2 border-t border-[#eaecf0] dark:border-[#32363e] flex flex-wrap items-center justify-center lg:justify-start gap-x-2 gap-y-1 text-xs">
              <span className="text-[#54595d] dark:text-[#a2a9b1] font-medium">常用词条直达：</span>
              <button
                type="button"
                onClick={() => onNavigateSanitaryPad?.()}
                onMouseEnter={(e) => onOpenWikiLink?.('卫生棉', e)}
                className="font-bold text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
              >
                卫生棉（卫生巾）
              </button>
              <span className="text-[#a2a9b1]">·</span>
              <button
                type="button"
                onClick={() => onNavigateToArticle()}
                onMouseEnter={(e) => onOpenWikiLink?.('卫生棉条', e)}
                className="font-bold text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
              >
                卫生棉条
              </button>
              <span className="text-[#a2a9b1]">·</span>
              <button
                type="button"
                onClick={() => onNavigateWikiTerm?.('月经杯')}
                onMouseEnter={(e) => onOpenWikiLink?.('月经杯', e)}
                className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
              >
                月经杯
              </button>
              <span className="text-[#a2a9b1]">·</span>
              <button
                type="button"
                onClick={() => onNavigateWikiTerm?.('月经')}
                onMouseEnter={(e) => onOpenWikiLink?.('月经', e)}
                className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
              >
                月经
              </button>
              <span className="text-[#a2a9b1]">·</span>
              <button
                type="button"
                onClick={() => onNavigateWikiTerm?.('阴道冠')}
                onMouseEnter={(e) => onOpenWikiLink?.('阴道冠', e)}
                className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
              >
                阴道冠（处女膜）
              </button>
              <span className="text-[#a2a9b1]">·</span>
              <button
                type="button"
                onClick={() => onNavigateWikiTerm?.('中毒性休克综合征')}
                onMouseEnter={(e) => onOpenWikiLink?.('中毒性休克综合征', e)}
                className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
              >
                中毒性休克综合征
              </button>
            </div>
          </div>

          {/* Right (5 cols): 3-Module Wikipedia Portal Quick-Jump Grid */}
          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[#c8ccd1] dark:border-[#3a3e47] pt-3 lg:pt-0 lg:pl-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#202122] dark:text-[#eaecf0]">
                维基门户三大板块导航矩阵：
              </span>
              {activePortalModule !== 'all' && (
                <button
                  type="button"
                  onClick={() => setActivePortalModule('all')}
                  className="text-xs text-[#3366cc] dark:text-[#6b9eff] font-bold hover:underline cursor-pointer"
                >
                  显示全部板块 ↺
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {portalModulesMeta.map((mod) => {
                const isSelected = activePortalModule === mod.key;
                return (
                  <div
                    key={mod.key}
                    className={`border p-2.5 transition-colors bg-white dark:bg-[#1b1e23] flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#3366cc] dark:border-[#6b9eff] ring-1 ring-[#3366cc]'
                        : 'border-[#c8ccd1] dark:border-[#3a3e47] hover:border-[#72777d]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <button
                          type="button"
                          onClick={() => handleSelectPortalModule('all', mod.id)}
                          className="font-serif font-bold text-xs sm:text-sm text-[#3366cc] dark:text-[#6b9eff] hover:underline text-left cursor-pointer"
                        >
                          {mod.title}
                        </button>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 ${mod.accentHeaderBg} ${mod.accentTagText} font-semibold`}
                        >
                          {mod.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#54595d] dark:text-[#a2a9b1] leading-snug line-clamp-2 mb-1.5">
                        {mod.summary}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#eaecf0] dark:border-[#2c3038]">
                      <button
                        type="button"
                        onClick={() => handleSelectPortalModule('all', mod.id)}
                        className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
                      >
                        定位板块 ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => setActivePortalModule(isSelected ? 'all' : mod.key)}
                        className={`font-semibold cursor-pointer hover:underline ${
                          isSelected
                            ? 'text-[#006400] dark:text-[#5cd68d]'
                            : 'text-[#54595d] dark:text-[#a2a9b1]'
                        }`}
                      >
                        {isSelected ? '✓ 已聚焦' : '单独聚焦'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Portal Module Filter Bar (门户板块快速筛选栏) */}
        <div className="mt-3 pt-2.5 border-t border-[#c8ccd1] dark:border-[#3a3e47] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-[#54595d] dark:text-[#a2a9b1]">门户板块视图：</span>
            <button
              type="button"
              onClick={() => setActivePortalModule('all')}
              className={`px-2.5 py-1 border cursor-pointer transition-colors ${
                activePortalModule === 'all'
                  ? 'bg-[#3366cc] text-white border-[#3366cc] font-bold'
                  : 'bg-white dark:bg-[#1e2022] text-[#202122] dark:text-[#eaecf0] border-[#a2a9b1] dark:border-[#54595d] hover:bg-[#eaecf0] dark:hover:bg-[#2a2e35]'
              }`}
            >
              全部门户板块 (3)
            </button>
            {portalModulesMeta.map((mod) => (
              <button
                key={mod.key}
                type="button"
                onClick={() => setActivePortalModule(mod.key)}
                className={`px-2.5 py-1 border cursor-pointer transition-colors ${
                  activePortalModule === mod.key
                    ? 'bg-[#3366cc] text-white border-[#3366cc] font-bold'
                    : 'bg-white dark:bg-[#1e2022] text-[#202122] dark:text-[#eaecf0] border-[#a2a9b1] dark:border-[#54595d] hover:bg-[#eaecf0] dark:hover:bg-[#2a2e35]'
                }`}
              >
                {mod.title}
              </button>
            ))}
          </div>
          <div className="text-[11px] text-[#54595d] dark:text-[#a2a9b1] font-mono">
            Wikipedia Portal 12-Column Grid · 三大板块归类展示
          </div>
        </div>
      </div>

      {/* =====================================================================
          板块一：【今日推荐】 (TODAY'S FEATURED & CURATED ARTICLES)
          包含：
          1. 全站已收录词条列表（共 2 篇正式词条：《卫生棉条》、《卫生棉（卫生巾）》，支持卡片/目录表格/章节树视图）
          2. 今日优良条目（卫生棉/卫生巾） & 今日典范条目（卫生棉条）双栏并列深度导读
          3. 每日图片 · 医学与高分子工程矢量图谱（支持全部 8 幅 SVG 切换与全屏灯箱）
         ===================================================================== */}
      {(activePortalModule === 'all' || activePortalModule === 'featured') && (
        <section
          id="portal-featured"
          className="border border-[#a3bfb1] dark:border-[#2d5240] bg-[#f5fffa] dark:bg-[#17211d] p-3.5 sm:p-5 mb-5"
        >
          {/* Module 1 Header Banner */}
          <div className="bg-[#cef2e0] dark:bg-[#1e3a2f] border border-[#7ab396] dark:border-[#2d5240] px-3.5 py-2.5 mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#145232] text-white">
                  板块一 · 今日推荐
                </span>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#202122] dark:text-[#eaecf0]">
                  今日推荐 · 已收录正式词条与典范导读
                </h2>
              </div>
              <p className="text-xs text-[#28523b] dark:text-[#98cfb2] mt-0.5">
                集中展示全站已收录的 {allEncyclopediaArticles.length} 篇正式词条、今日优良/典范主条目深度摘要及每日特色工程图谱
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[#145232] dark:text-[#7ee2a8] font-medium">词条列表视图：</span>
              <button
                type="button"
                onClick={() => setArticleListViewMode('cards')}
                className={`px-2.5 py-1 border cursor-pointer transition-colors ${
                  articleListViewMode === 'cards'
                    ? 'bg-[#145232] text-white border-[#145232] font-bold'
                    : 'bg-white dark:bg-[#1e2022] text-[#202122] dark:text-[#eaecf0] border-[#7ab396] dark:border-[#2d5240]'
                }`}
              >
                词条卡片 ({allEncyclopediaArticles.length}篇)
              </button>
              <button
                type="button"
                onClick={() => setArticleListViewMode('directory')}
                className={`px-2.5 py-1 border cursor-pointer transition-colors ${
                  articleListViewMode === 'directory'
                    ? 'bg-[#145232] text-white border-[#145232] font-bold'
                    : 'bg-white dark:bg-[#1e2022] text-[#202122] dark:text-[#eaecf0] border-[#7ab396] dark:border-[#2d5240]'
                }`}
              >
                目录表格视图
              </button>
              <button
                type="button"
                onClick={() => setArticleListViewMode('chapters')}
                className={`px-2.5 py-1 border cursor-pointer transition-colors ${
                  articleListViewMode === 'chapters'
                    ? 'bg-[#145232] text-white border-[#145232] font-bold'
                    : 'bg-white dark:bg-[#1e2022] text-[#202122] dark:text-[#eaecf0] border-[#7ab396] dark:border-[#2d5240]'
                }`}
              >
                章节树对比
              </button>
            </div>
          </div>

          {/* 1.1 全站已收录正式词条列表 (#all-articles-hub) */}
          <div id="all-articles-hub" className="mb-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#145232] dark:text-[#7ee2a8] flex items-center space-x-2">
                <span>▪</span>
                <span>全站已收录正式词条总览（共 {allEncyclopediaArticles.length} 篇）</span>
              </h3>
              <span className="text-xs text-[#54595d] dark:text-[#a2a9b1]">
                点击词条名称或章节链接即可进入对应百科词条详情页
              </span>
            </div>

            {/* VIEW MODE 1: CARDS GRID */}
            {articleListViewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredEncyclopediaArticles.map((article) => (
                  <div
                    key={article.id}
                    className="border border-[#7ab396] dark:border-[#2d5240] bg-white dark:bg-[#1b2420] p-3.5 flex flex-col justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <button
                            type="button"
                            onClick={() => article.onNavigate()}
                            onMouseEnter={(e) => onOpenWikiLink?.(article.title, e)}
                            className="font-serif text-base sm:text-lg font-bold text-[#3366cc] dark:text-[#6b9eff] hover:underline text-left leading-snug cursor-pointer"
                          >
                            {article.title}
                          </button>
                          <div className="text-[11px] text-[#54595d] dark:text-[#a2a9b1] font-serif italic">
                            {article.enTitle}
                          </div>
                        </div>
                        <span className="shrink-0 px-2 py-0.5 text-[11px] border bg-[#cef2e0] dark:bg-[#1e3a2f] border-[#a3bfb1] dark:border-[#2d5240] text-[#145232] dark:text-[#7ee2a8] font-medium">
                          {article.qualityBadgeText}
                        </span>
                      </div>

                      {article.aliases.length > 0 && (
                        <div className="text-[11px] text-[#006400] dark:text-[#5cd68d] mb-1.5">
                          别称/搜索词：{article.aliases.join(' · ')}
                        </div>
                      )}

                      <p className="text-xs text-[#202122] dark:text-[#d0d4dc] leading-relaxed mb-2.5 text-justify">
                        {article.summary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#c8e6d5] dark:border-[#2a4236] text-[11px]">
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[#54595d] dark:text-[#a2a9b1] mb-2">
                        <span className="font-semibold text-[#202122] dark:text-[#eaecf0]">章节直达：</span>
                        {article.sectionsPreview.map((sec, idx) => (
                          <React.Fragment key={sec.id}>
                            {idx > 0 && <span>·</span>}
                            <button
                              type="button"
                              onClick={() => article.onNavigate(sec.id)}
                              className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
                            >
                              {sec.title}
                            </button>
                          </React.Fragment>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[#54595d] dark:text-[#a2a9b1]">
                        <span>
                          [{article.categoryLabel}] · {article.wordCount.toLocaleString()}字 · {article.sectionCount}大章节 · {article.referenceCount}篇文献
                        </span>
                        <button
                          type="button"
                          onClick={() => article.onNavigate()}
                          className="font-bold text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
                        >
                          进入词条 →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VIEW MODE 2: COMPACT WIKIPEDIA DIRECTORY TABLE */}
            {articleListViewMode === 'directory' && (
              <div className="overflow-x-auto bg-white dark:bg-[#1e2022] border border-[#a2a9b1] dark:border-[#3a3e47]">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#eaecf0] dark:bg-[#272a30] text-left">
                      <th className="border border-[#a2a9b1] dark:border-[#3a3e47] px-3 py-2">序号</th>
                      <th className="border border-[#a2a9b1] dark:border-[#3a3e47] px-3 py-2">正式词条名称</th>
                      <th className="border border-[#a2a9b1] dark:border-[#3a3e47] px-3 py-2">常用俗称 / 重定向别名</th>
                      <th className="border border-[#a2a9b1] dark:border-[#3a3e47] px-3 py-2">类型</th>
                      <th className="border border-[#a2a9b1] dark:border-[#3a3e47] px-3 py-2">字数 / 章节 / 文献</th>
                      <th className="border border-[#a2a9b1] dark:border-[#3a3e47] px-3 py-2">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEncyclopediaArticles.map((article, idx) => (
                      <tr key={article.id} className="hover:bg-[#f8f9fa] dark:hover:bg-[#25282e]">
                        <td className="border border-[#a2a9b1] dark:border-[#3a3e47] px-3 py-2 font-mono font-bold">
                          #{idx + 1}
                        </td>
                        <td className="border border-[#a2a9b1] dark:border-[#3a3e47] px-3 py-2 font-bold">
                          <button
                            type="button"
                            onClick={() => article.onNavigate()}
                            onMouseEnter={(e) => onOpenWikiLink?.(article.title, e)}
                            className="text-[#3366cc] dark:text-[#6b9eff] hover:underline text-left cursor-pointer"
                          >
                            {article.title}
                          </button>
                          <span className="block text-[11px] font-normal text-[#72777d] italic">
                            {article.enTitle}
                          </span>
                        </td>
                        <td className="border border-[#a2a9b1] dark:border-[#3a3e47] px-3 py-2 text-[#54595d] dark:text-[#a2a9b1]">
                          {article.aliases.join('、')}
                        </td>
                        <td className="border border-[#a2a9b1] dark:border-[#3a3e47] px-3 py-2">
                          {article.categoryLabel}
                        </td>
                        <td className="border border-[#a2a9b1] dark:border-[#3a3e47] px-3 py-2 font-mono">
                          {article.wordCount.toLocaleString()}字 / {article.sectionCount}节 / {article.referenceCount}篇
                        </td>
                        <td className="border border-[#a2a9b1] dark:border-[#3a3e47] px-3 py-2">
                          <button
                            type="button"
                            onClick={() => article.onNavigate()}
                            className="text-[#3366cc] dark:text-[#6b9eff] font-bold hover:underline cursor-pointer"
                          >
                            前往阅读 →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* VIEW MODE 3: MULTI-ARTICLE CHAPTER TREE */}
            {articleListViewMode === 'chapters' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredEncyclopediaArticles.map((article, idx) => (
                  <div
                    key={article.id}
                    className="border border-[#7ab396] dark:border-[#2d5240] bg-white dark:bg-[#1e2022] p-3.5"
                  >
                    <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#eaecf0] dark:border-[#2e3238]">
                      <button
                        type="button"
                        onClick={() => article.onNavigate()}
                        className="font-serif font-bold text-sm text-[#3366cc] dark:text-[#6b9eff] hover:underline text-left cursor-pointer"
                      >
                        词条 #{idx + 1}：《{article.title}》章节目录
                      </button>
                      <span className="text-[11px] text-[#72777d]">共 {article.sectionCount} 大章节</span>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                      {article.sectionsPreview.map((sec) => (
                        <li key={sec.id}>
                          <button
                            type="button"
                            onClick={() => article.onNavigate(sec.id)}
                            className="text-[#3366cc] dark:text-[#6b9eff] hover:underline text-left block w-full truncate cursor-pointer"
                          >
                            {sec.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 1.2 今日优良条目 & 今日典范条目 双栏网格 (12-Column Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4 items-stretch">
            {/* LEFT 6 COLS: 优良条目 · 卫生棉（卫生巾） */}
            <div className="lg:col-span-6 border border-[#7ab396] dark:border-[#2d5240] bg-white dark:bg-[#1b2420] p-3.5 sm:p-4 flex flex-col justify-between">
              <div>
                <h3 className="bg-[#cef2e0] dark:bg-[#1e3a2f] border border-[#a3bfb1] dark:border-[#2d5240] px-3 py-1.5 font-serif text-base font-bold text-[#202122] dark:text-[#eaecf0] mb-3 flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <span className="text-[#2e8b57] dark:text-[#5cd68d] text-base" title="优良条目星章">⊕</span>
                    <span>今日优良条目 · 卫生棉（卫生巾）</span>
                  </span>
                  <span className="text-xs font-sans font-normal text-[#54595d] dark:text-[#a2a9b1]">
                    体外护理主条目 (#2)
                  </span>
                </h3>

                <div className="text-xs sm:text-[13px] leading-[1.75] text-[#202122] dark:text-[#eaecf0] clearfix">
                  <WikipediaImageThumb
                    image={SANITARY_PAD_IMAGES[0]}
                    align="right"
                    width={190}
                    isDarkMode={isDarkMode}
                    onImageClick={(img) => setActiveLightboxImageId(img.id)}
                  />

                  <p className="mb-2 text-justify">
                    {renderWikiLink('卫生棉', '卫生棉', { bold: true })}（中国大陆通称
                    {renderWikiLink('卫生棉', '卫生巾', { bold: true })}，民间俗称<strong className="font-semibold">姨妈巾</strong>、<strong className="font-semibold">月经垫</strong>，台湾及港澳亦称<strong className="font-semibold">卫生棉</strong>或<strong className="font-semibold">生理棉</strong>；英语：Sanitary napkin / Sanitary pad），是一种具高吸收力、贴附于内裤裆部内侧使用的条状体外
                    {renderWikiLink('女性生理用品')}。其主要功能是在女性{renderWikiLink('月经')}来潮、产后恶露排出或妇科恢复期于体外承接并锁住经血，维持外阴干爽与衣物清洁。
                  </p>

                  <p className="mb-2 text-justify">
                    现代一次性卫生巾起源于一战期间美国金佰利克拉克研发的木浆纤维素敷料（Cellucotton），并于1921年以“高洁丝”（Kotex）品牌上市；1969年免生理带自粘背胶贴条问世，1980年代防侧漏“{renderWikiLink('卫生棉', '护翼（蝶翼）', { customClick: () => onNavigateSanitaryPad?.('pad-structure') })}”与高分子吸水树脂（SAP）实现了超薄化革命。现代制品由表层、瞬吸导流层（ADL）、绒毛浆与SAP吸收芯体、PE透气防漏底膜及热熔背胶复合而成。（
                    <button
                      type="button"
                      onClick={() => onNavigateSanitaryPad?.()}
                      className="font-bold text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
                    >
                      阅读全文...
                    </button>
                    ）
                  </p>
                </div>
              </div>

              <div className="clear-both pt-2 mt-2 border-t border-[#c8e6d5] dark:border-[#2a4236] flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-[#54595d] dark:text-[#a2a9b1]">
                <span className="font-bold text-[#202122] dark:text-[#eaecf0]">章节直达：</span>
                <button type="button" onClick={() => onNavigateSanitaryPad?.('pad-etymology')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">名称与地区称谓</button>
                <span>·</span>
                <button type="button" onClick={() => onNavigateSanitaryPad?.('pad-history')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">发展历史</button>
                <span>·</span>
                <button type="button" onClick={() => onNavigateSanitaryPad?.('pad-structure')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">物理构造与材料</button>
                <span>·</span>
                <button type="button" onClick={() => onNavigateSanitaryPad?.('pad-types')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">规格与分类对比</button>
                <span>·</span>
                <button type="button" onClick={() => onNavigateSanitaryPad?.('pad-environment')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">布卫生棉与环保</button>
                <span>·</span>
                <button type="button" onClick={() => onNavigateSanitaryPad?.('pad-society')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">法规与经期平权</button>
              </div>
            </div>

            {/* RIGHT 6 COLS: 典范条目 · 卫生棉条 */}
            <div className="lg:col-span-6 border border-[#7ab396] dark:border-[#2d5240] bg-white dark:bg-[#1b2420] p-3.5 sm:p-4 flex flex-col justify-between">
              <div>
                <h3 className="bg-[#cef2e0] dark:bg-[#1e3a2f] border border-[#a3bfb1] dark:border-[#2d5240] px-3 py-1.5 font-serif text-base font-bold text-[#202122] dark:text-[#eaecf0] mb-3 flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <span className="text-[#d4af37] text-base" title="典范条目星章">★</span>
                    <span>今日典范条目 · 卫生棉条</span>
                  </span>
                  <span className="text-xs font-sans font-normal text-[#54595d] dark:text-[#a2a9b1]">
                    体内护理主条目 (#1)
                  </span>
                </h3>

                <div className="text-xs sm:text-[13px] leading-[1.75] text-[#202122] dark:text-[#eaecf0] clearfix">
                  <WikipediaImageThumb
                    image={TAMPON_FEATURED_IMAGES[0]}
                    align="right"
                    width={190}
                    isDarkMode={isDarkMode}
                    onImageClick={(img) => setActiveLightboxImageId(img.id)}
                  />

                  <p className="mb-2 text-justify">
                    {renderWikiLink('卫生棉条', '卫生棉条', { bold: true })}（英语：Tampon），又称
                    <strong className="font-semibold">卫生栓</strong>或简称
                    <strong className="font-semibold">棉条</strong>，是一种圆柱状的体内型
                    {renderWikiLink('女性生理用品')}。其主体由高密度压缩的脱脂纯棉、粘胶纤维（人造丝）或混纺材料制成。在{renderWikiLink('月经')}期间，使用者将其置入{renderWikiLink('阴道穹', '阴道中上段的“后穹窿无感区”')}，在经血离开人体之前直接在体内完成吸收。
                  </p>

                  <p className="mb-2 text-justify">
                    现代自带伸缩导管的卫生棉条由美国丹佛市外科医生{renderWikiLink('厄尔·哈斯')}（Earle Haas）于1929年发明，后创立“{renderWikiLink('丹碧丝')}”（Tampax）推向市场；1950年德国妇科女医生朱迪思·埃瑟-米塔格研发出无需导管的指入式卫生棉条（o.b.）。目前美国FDA强制要求包装标示统一的吸收量分级并附上遵守{renderWikiLink('8小时安全时限')}以预防{renderWikiLink('中毒性休克综合征')}（TSS）的医学指引。（
                    <button
                      type="button"
                      onClick={() => onNavigateToArticle()}
                      className="font-bold text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
                    >
                      阅读全文...
                    </button>
                    ）
                  </p>
                </div>
              </div>

              <div className="clear-both pt-2 mt-2 border-t border-[#c8e6d5] dark:border-[#2a4236] flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-[#54595d] dark:text-[#a2a9b1]">
                <span className="font-bold text-[#202122] dark:text-[#eaecf0]">章节直达：</span>
                <button type="button" onClick={() => onNavigateToArticle('history')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">历史演进</button>
                <span>·</span>
                <button type="button" onClick={() => onNavigateToArticle('structure-and-types')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">构造与类型</button>
                <span>·</span>
                <button type="button" onClick={() => onNavigateToArticle('absorbency-standards')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">吸收量标准</button>
                <span>·</span>
                <button type="button" onClick={() => onNavigateToArticle('usage-guide')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">使用方法</button>
                <span>·</span>
                <button type="button" onClick={() => onNavigateToArticle('common-myths')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">处女膜与迷思</button>
                <span>·</span>
                <button type="button" onClick={() => onNavigateToArticle('safety-and-tss')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">相关疾病与TSS</button>
              </div>
            </div>
          </div>

          {/* 1.3 每日特色图谱 (Today's Featured Picture — 8幅矢量图解切换器) */}
          <div className="border border-[#7ab396] dark:border-[#2d5240] bg-white dark:bg-[#1b2420] p-3.5 sm:p-4">
            <div className="bg-[#cef2e0] dark:bg-[#1e3a2f] border border-[#a3bfb1] dark:border-[#2d5240] px-3 py-1.5 mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-serif text-base font-bold text-[#202122] dark:text-[#eaecf0] flex items-center space-x-2">
                <span>❖</span>
                <span>每日推荐图谱 · 医学解剖与高分子材料工程矢量图库</span>
              </h3>
              <div className="flex flex-wrap items-center gap-1 text-xs">
                <span className="text-[#145232] dark:text-[#7ee2a8] mr-1">
                  切换图谱（{featuredPicIndex + 1}/{allFeaturedPictures.length}）：
                </span>
                {allFeaturedPictures.map((pic, idx) => (
                  <button
                    key={pic.asset.id}
                    type="button"
                    onClick={() => setFeaturedPicIndex(idx)}
                    className={`px-2 py-0.5 border text-xs transition-colors cursor-pointer ${
                      featuredPicIndex === idx
                        ? 'bg-[#145232] text-white border-[#145232] font-bold'
                        : 'bg-white dark:bg-[#1e2022] text-[#3366cc] dark:text-[#6b9eff] border-[#7ab396] dark:border-[#2d5240] hover:underline'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              <div className="lg:col-span-6 bg-[#f8f9fa] dark:bg-[#14171a] border border-[#c8ccd1] dark:border-[#3a3e47] p-3 flex flex-col items-center">
                <div
                  onClick={() => setActiveLightboxImageId(currentFeaturedPic.asset.id)}
                  className="w-full max-w-[420px] cursor-zoom-in hover:opacity-95 transition-opacity"
                  title="点击在维基媒体查看器中全屏放大检视"
                >
                  {renderImageGraphic(currentFeaturedPic.asset.type)}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveLightboxImageId(currentFeaturedPic.asset.id)}
                  className="mt-2 text-xs text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
                >
                  🔍 点击开启维基媒体查看器（支持全屏缩放与多图连播）
                </button>
              </div>

              <div className="lg:col-span-6 text-xs sm:text-sm leading-[1.8] text-[#202122] dark:text-[#eaecf0]">
                <div className="text-xs text-[#54595d] dark:text-[#a2a9b1] mb-1">
                  所属正式词条：
                  <button
                    type="button"
                    onClick={currentFeaturedPic.onNavigateArticle}
                    className="font-bold text-[#3366cc] dark:text-[#6b9eff] hover:underline ml-1 cursor-pointer"
                  >
                    《{currentFeaturedPic.articleTitle}》
                  </button>
                </div>
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#202122] dark:text-[#eaecf0] mb-2">
                  {currentFeaturedPic.asset.title}
                </h4>
                <p className="text-justify mb-3">{currentFeaturedPic.asset.caption}</p>
                <p className="text-xs text-[#54595d] dark:text-[#a2a9b1] mb-3">
                  制图与学术来源：{currentFeaturedPic.credit}（许可协议：{currentFeaturedPic.asset.license}）
                </p>

                <div className="pt-2.5 border-t border-[#c8e6d5] dark:border-[#2a4236]">
                  <div className="text-xs font-bold text-[#54595d] dark:text-[#a2a9b1] mb-1.5">
                    8幅百科工程与解剖图谱快速切换：
                  </div>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs">
                    {allFeaturedPictures.map((item, idx) => (
                      <React.Fragment key={item.asset.id}>
                        {idx > 0 && <span className="text-[#a2a9b1]">·</span>}
                        <button
                          type="button"
                          onClick={() => setFeaturedPicIndex(idx)}
                          className={`text-left hover:underline cursor-pointer ${
                            featuredPicIndex === idx
                              ? 'font-bold text-[#145232] dark:text-[#7ee2a8] underline'
                              : 'text-[#3366cc] dark:text-[#6b9eff]'
                          }`}
                        >
                          {item.asset.title}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          板块二：【医学科普】 (MEDICAL & PHYSIOLOGICAL SCIENCE POPULARIZATION)
          包含：
          1. 「你知道吗？」循证生理与妇产科学科普问答（6项可展开临床解析）
          2. 四大核心生理机制与临床安全专题卡片（后穹窿无感区、阴道冠去魅、乳杆菌pH屏障、TSS预防）
          3. 「法规标准与技术参数对比」（GB/T 8939 卫生巾规格表 vs FDA 21 CFR 801.430 棉条分级表）
         ===================================================================== */}
      {(activePortalModule === 'all' || activePortalModule === 'medical') && (
        <section
          id="portal-medical"
          className="border border-[#8fa8c8] dark:border-[#2e425c] bg-[#f5faff] dark:bg-[#161d26] p-3.5 sm:p-5 mb-5"
        >
          {/* Module 2 Header Banner */}
          <div className="bg-[#cedff2] dark:bg-[#1f3147] border border-[#8fa8c8] dark:border-[#2e425c] px-3.5 py-2.5 mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#1b3a63] text-white">
                  板块二 · 医学科普
                </span>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#202122] dark:text-[#eaecf0]">
                  医学科普 · 生理机制、解剖去魅与法规标准
                </h2>
              </div>
              <p className="text-xs text-[#284870] dark:text-[#9ab8de] mt-0.5">
                基于妇产科学、盆腔解剖学与临床微生物学的新知问答、核心生理机制解析及国家/国际强制标准对比
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => onNavigateToArticle('safety-and-tss')}
                className="px-2.5 py-1 bg-white dark:bg-[#1e2022] border border-[#8fa8c8] dark:border-[#2e425c] text-[#3366cc] dark:text-[#6b9eff] hover:underline font-medium cursor-pointer"
              >
                TSS临床安全指引 →
              </button>
              <button
                type="button"
                onClick={() => onNavigateToArticle('common-myths')}
                className="px-2.5 py-1 bg-white dark:bg-[#1e2022] border border-[#8fa8c8] dark:border-[#2e425c] text-[#3366cc] dark:text-[#6b9eff] hover:underline font-medium cursor-pointer"
              >
                阴道冠与解剖迷思 →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* LEFT 7 COLS: 「你知道吗？」问答 + 四大核心生理科普卡片矩阵 */}
            <div className="lg:col-span-7 space-y-4">
              {/* 2.1 你知道吗？ (Did You Know?) */}
              <div className="border border-[#8fa8c8] dark:border-[#2e425c] bg-white dark:bg-[#1b222c] p-3.5 sm:p-4">
                <h3 className="bg-[#e1edfa] dark:bg-[#22344a] border border-[#a3b0bf] dark:border-[#2e425c] px-3 py-1.5 font-serif text-base font-bold text-[#202122] dark:text-[#eaecf0] mb-3 flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <span className="text-[#3366cc] dark:text-[#6b9eff] font-sans font-bold">？</span>
                    <span>你知道吗？（循证生理与妇产科学科普问答）</span>
                  </span>
                  <span className="text-xs font-sans font-normal text-[#54595d] dark:text-[#a2a9b1]">
                    点击「展开解析」查阅临床依据
                  </span>
                </h3>

                <div className="text-xs sm:text-[13px] leading-[1.7] text-[#202122] dark:text-[#eaecf0] clearfix">
                  <WikipediaImageThumb
                    image={SANITARY_PAD_IMAGES[3]}
                    align="right"
                    width={165}
                    isDarkMode={isDarkMode}
                    onImageClick={(img) => setActiveLightboxImageId(img.id)}
                  />

                  <ul className="list-disc pl-5 space-y-2.5">
                    {combinedDykItems.map((item, idx) => {
                      const isOpen = expandedDykIndex === idx;
                      return (
                        <li key={idx} className="leading-relaxed">
                          <span>
                            {item.questionPrefix}
                            {renderWikiLink(item.boldTerm, item.boldLabel, {
                              bold: true,
                              customClick: item.onJump
                            })}
                            {item.questionSuffix}
                            {item.secondTerm &&
                              renderWikiLink(item.secondTerm, item.secondLabel, {
                                bold: true
                              })}
                            {item.questionSuffix2}
                          </span>{' '}
                          <button
                            type="button"
                            onClick={() => setExpandedDykIndex(isOpen ? null : idx)}
                            className="text-xs text-[#3366cc] dark:text-[#6b9eff] hover:underline ml-1 select-none cursor-pointer font-medium"
                          >
                            [{isOpen ? '收起解析' : '展开解析'}]
                          </button>

                          {isOpen && (
                            <div className="mt-1.5 p-2.5 bg-[#f5faff] dark:bg-[#22262c] border-l-2 border-[#3366cc] text-xs text-[#54595d] dark:text-[#c8ccd1] leading-relaxed">
                              <p>{item.answer}</p>
                              <div className="mt-1 text-right">
                                <button
                                  type="button"
                                  onClick={item.onJump}
                                  className="text-[#3366cc] dark:text-[#6b9eff] font-bold hover:underline cursor-pointer"
                                >
                                  前往对应词条章节详阅 →
                                </button>
                              </div>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* 2.2 四大核心生理与临床安全专题矩阵 (2x2 Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-[#8fa8c8] dark:border-[#2e425c] bg-white dark:bg-[#1b222c] p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono font-bold text-[#1b3a63] dark:text-[#8ab4f8]">
                      解剖神经分段 · 专题 01
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigateToArticle('usage-guide')}
                      className="text-[11px] text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
                    >
                      定位图解 →
                    </button>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#202122] dark:text-[#eaecf0] mb-1">
                    {renderWikiLink('阴道穹', '阴道后穹窿“生理无感区”机制')}
                  </h4>
                  <p className="text-xs text-[#54595d] dark:text-[#a2a9b1] leading-relaxed text-justify">
                    阴道下1/3段富集躯体感觉神经（对触觉摩擦敏感），而中上2/3段及后穹窿由内脏植物神经支配，对机械接触几乎无痛感或异物感。置入棉条若有异物感，多因推入深度不足所致。
                  </p>
                </div>

                <div className="border border-[#8fa8c8] dark:border-[#2e425c] bg-white dark:bg-[#1b222c] p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono font-bold text-[#1b3a63] dark:text-[#8ab4f8]">
                      解剖学去魅 · 专题 02
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigateWikiTerm?.('阴道冠')}
                      className="text-[11px] text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
                    >
                      查阅词条 →
                    </button>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#202122] dark:text-[#eaecf0] mb-1">
                    {renderWikiLink('阴道冠', '阴道冠（处女膜）真实弹性构造')}
                  </h4>
                  <p className="text-xs text-[#54595d] dark:text-[#a2a9b1] leading-relaxed text-justify">
                    现代妇产科学将“处女膜”规范命名为“阴道冠”，系环绕阴道口周缘的一圈弹性黏膜皱襞，中央天生具直径1.5–2.5厘米自然开口以排出经血，并非封闭实心膜。
                  </p>
                </div>

                <div className="border border-[#8fa8c8] dark:border-[#2e425c] bg-white dark:bg-[#1b222c] p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono font-bold text-[#1b3a63] dark:text-[#8ab4f8]">
                      微生态自净 · 专题 03
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigateWikiTerm?.('阴道菌群')}
                      className="text-[11px] text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
                    >
                      微生态词条 →
                    </button>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#202122] dark:text-[#eaecf0] mb-1">
                    {renderWikiLink('阴道菌群', '卷曲乳杆菌与 pH 3.8–4.5 屏障')}
                  </h4>
                  <p className="text-xs text-[#54595d] dark:text-[#a2a9b1] leading-relaxed text-justify">
                    健康阴道菌群中乳酸杆菌占比达90%以上，分解上皮糖原产生乳酸与过氧化氢抑制致病菌。临床医学明确反对常规“阴道内灌洗”，温水清洁外阴即可维持自净屏障。
                  </p>
                </div>

                <div className="border border-[#8fa8c8] dark:border-[#2e425c] bg-white dark:bg-[#1b222c] p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono font-bold text-[#b32424] dark:text-[#f87171]">
                      感染急症预防 · 专题 04
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigateWikiTerm?.('中毒性休克综合征')}
                      className="text-[11px] text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
                    >
                      TSS词条 →
                    </button>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#202122] dark:text-[#eaecf0] mb-1">
                    {renderWikiLink('中毒性休克综合征', 'TSS 预防与 8 小时安全时限')}
                  </h4>
                  <p className="text-xs text-[#54595d] dark:text-[#a2a9b1] leading-relaxed text-justify">
                    由金黄色葡萄球菌分泌{renderWikiLink('中毒性休克综合征毒素-1', 'TSST-1')}超抗原引起。遵循“按经量选择最低吸收度”并严格遵守每 4–8 小时更换（严禁超{renderWikiLink('8小时安全时限')}）即可有效阻断风险。
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT 5 COLS: 法规标准与技术规格参数对比 (GB/T 8939 vs FDA 21 CFR 801.430) */}
            <div className="lg:col-span-5 border border-[#8fa8c8] dark:border-[#2e425c] bg-white dark:bg-[#1b222c] p-3.5 sm:p-4">
              <h3 className="bg-[#e1edfa] dark:bg-[#22344a] border border-[#a3b0bf] dark:border-[#2e425c] px-3 py-1.5 font-serif text-base font-bold text-[#202122] dark:text-[#eaecf0] mb-3 flex items-center justify-between">
                <span>法规标准与技术参数对比</span>
                <span className="text-xs font-sans font-normal text-[#54595d] dark:text-[#a2a9b1]">
                  GB/T 8939 &amp; FDA
                </span>
              </h3>

              <div className="text-xs sm:text-[13px] leading-[1.7] text-[#202122] dark:text-[#eaecf0] clearfix">
                <WikipediaImageThumb
                  image={SANITARY_PAD_IMAGES[1]}
                  align="right"
                  width={155}
                  isDarkMode={isDarkMode}
                  onImageClick={(img) => setActiveLightboxImageId(img.id)}
                />

                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>GB/T 8939 与 GB 15979 卫生巾国家标准</strong>：规范
                    {renderWikiLink('卫生棉', '卫生巾')}、护垫与
                    {renderWikiLink('卫生棉条')}吸水倍率（≥7.0倍）、pH值指标（4.0–9.0）、可迁移性荧光增白剂零检出及微生物限值。
                  </li>
                  <li>
                    <strong>FDA 21 CFR §801.430 联邦法规</strong>：强制规范所有市售{renderWikiLink('卫生棉条')}采用统一的 Syngina 实验室吸收度水滴标识，并遵守{renderWikiLink('8小时安全时限')}预防{renderWikiLink('中毒性休克综合征')}（TSS）。
                  </li>
                </ul>

                {/* Dual-Article Technical Standard Tables Switcher */}
                <div className="clear-both mt-3 pt-2.5 border-t border-[#c4d7ed] dark:border-[#2a3b52]">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setStandardsTab('pad')}
                        className={`px-2 py-1 border cursor-pointer ${
                          standardsTab === 'pad'
                            ? 'bg-[#3366cc] text-white border-[#3366cc] font-bold'
                            : 'bg-white dark:bg-[#1e2022] text-[#3366cc] dark:text-[#6b9eff] border-[#a3b0bf]'
                        }`}
                      >
                        卫生巾规格对比表
                      </button>
                      <button
                        type="button"
                        onClick={() => setStandardsTab('tampon')}
                        className={`px-2 py-1 border cursor-pointer ${
                          standardsTab === 'tampon'
                            ? 'bg-[#3366cc] text-white border-[#3366cc] font-bold'
                            : 'bg-white dark:bg-[#1e2022] text-[#3366cc] dark:text-[#6b9eff] border-[#a3b0bf]'
                        }`}
                      >
                        卫生棉条FDA分级表
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        standardsTab === 'pad'
                          ? onNavigateSanitaryPad?.('pad-types')
                          : onNavigateToArticle('absorbency-standards')
                      }
                      className="text-xs text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
                    >
                      完整技术规范 →
                    </button>
                  </div>

                  {standardsTab === 'pad' ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse border border-[#a2a9b1] dark:border-[#3a3e47] bg-white dark:bg-[#1e2022]">
                        <thead>
                          <tr className="bg-[#eaecf0] dark:bg-[#272a30] text-left">
                            <th className="border border-[#a2a9b1] dark:border-[#3a3e47] px-2 py-1">卫生巾类型</th>
                            <th className="border border-[#a2a9b1] dark:border-[#3a3e47] px-2 py-1">常见长度</th>
                            <th className="border border-[#a2a9b1] dark:border-[#3a3e47] px-2 py-1">适用经量与场景</th>
                          </tr>
                        </thead>
                        <tbody>
                          {SANITARY_PAD_SPECS.slice(0, 5).map((p, idx) => (
                            <tr key={idx} className="hover:bg-[#f8f9fa] dark:hover:bg-[#25282e]">
                              <td className="border border-[#a2a9b1] dark:border-[#3a3e47] px-2 py-1 font-medium text-[#3366cc] dark:text-[#6b9eff]">
                                {p.name}
                              </td>
                              <td className="border border-[#a2a9b1] dark:border-[#3a3e47] px-2 py-1 font-mono">
                                {p.lengthMm}
                              </td>
                              <td className="border border-[#a2a9b1] dark:border-[#3a3e47] px-2 py-1 text-[#54595d] dark:text-[#a2a9b1]">
                                {p.typicalCapacityMl}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse border border-[#a2a9b1] dark:border-[#3a3e47] bg-white dark:bg-[#1e2022]">
                        <thead>
                          <tr className="bg-[#eaecf0] dark:bg-[#272a30] text-left">
                            <th className="border border-[#a2a9b1] dark:border-[#3a3e47] px-2 py-1">水滴标识</th>
                            <th className="border border-[#a2a9b1] dark:border-[#3a3e47] px-2 py-1">法定分级</th>
                            <th className="border border-[#a2a9b1] dark:border-[#3a3e47] px-2 py-1">吸收量 (g)</th>
                            <th className="border border-[#a2a9b1] dark:border-[#3a3e47] px-2 py-1">适用经量</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ABSORBENCY_GRADES.map((g, idx) => (
                            <tr key={idx} className="hover:bg-[#f8f9fa] dark:hover:bg-[#25282e]">
                              <td className="border border-[#a2a9b1] dark:border-[#3a3e47] px-2 py-1 font-mono text-[#3366cc] dark:text-[#6b9eff]">
                                {'💧'.repeat(g.waterDrops)}
                              </td>
                              <td className="border border-[#a2a9b1] dark:border-[#3a3e47] px-2 py-1 font-medium">
                                {g.name}
                              </td>
                              <td className="border border-[#a2a9b1] dark:border-[#3a3e47] px-2 py-1 font-mono">
                                {g.weightRange}
                              </td>
                              <td className="border border-[#a2a9b1] dark:border-[#3a3e47] px-2 py-1 text-[#54595d] dark:text-[#a2a9b1]">
                                {g.flowLevel}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          板块三：【分类导航】 (CATEGORY & KNOWLEDGE TOPOLOGY NAVIGATION)
          包含：
          1. 六大学科领域门户分类网格（体外生理用品、体内生理用品、生殖解剖与生理、临床微生态与感染、材料工程、历史与经期社会学）
          2. 正式词条与文内专业术语全索引 + 四大特殊导航工具卡片（分类树、知识图谱、主题标签、内容统计）
         ===================================================================== */}
      {(activePortalModule === 'all' || activePortalModule === 'categories') && (
        <section
          id="portal-categories"
          className="border border-[#c4b08b] dark:border-[#524328] bg-[#fffdf7] dark:bg-[#1f1c16] p-3.5 sm:p-5 mb-5"
        >
          {/* Module 3 Header Banner */}
          <div className="bg-[#f2e6ce] dark:bg-[#382e1e] border border-[#c4b08b] dark:border-[#524328] px-3.5 py-2.5 mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#5c4314] text-white">
                  板块三 · 分类导航
                </span>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#202122] dark:text-[#eaecf0]">
                  分类导航 · 学科门户与知识拓扑索引
                </h2>
              </div>
              <p className="text-xs text-[#5c4314] dark:text-[#d9be8a] mt-0.5">
                通过六大学科网格归类展示已收录的 {allEncyclopediaArticles.length} 篇正式词条、章节锚点及文内专业术语内链（支持悬停预览）
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => onNavigateCategory?.()}
                className="px-2.5 py-1 bg-white dark:bg-[#1e2022] border border-[#c4b08b] dark:border-[#524328] text-[#3366cc] dark:text-[#6b9eff] hover:underline font-bold cursor-pointer"
              >
                分类:女性生理用品 →
              </button>
              <button
                type="button"
                onClick={() => onNavigateGraph?.()}
                className="px-2.5 py-1 bg-white dark:bg-[#1e2022] border border-[#c4b08b] dark:border-[#524328] text-[#3366cc] dark:text-[#6b9eff] hover:underline font-bold cursor-pointer"
              >
                Special:知识图谱 →
              </button>
              <button
                type="button"
                onClick={() => onNavigateTags?.()}
                className="px-2.5 py-1 bg-white dark:bg-[#1e2022] border border-[#c4b08b] dark:border-[#524328] text-[#3366cc] dark:text-[#6b9eff] hover:underline font-bold cursor-pointer"
              >
                Special:知识标签 →
              </button>
            </div>
          </div>

          {/* 3.1 六大学科分类导航网格 (3x2 Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-4">
            {/* Category 1: 体外生理用品 */}
            <div className="border border-[#c4b08b] dark:border-[#524328] bg-white dark:bg-[#1c1a17] p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#e8dec8] dark:border-[#383124]">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#202122] dark:text-[#eaecf0]">
                    1. 体外经期生理用品
                  </h3>
                  <span className="text-[11px] font-mono px-1.5 py-0.5 bg-[#f2e6ce] dark:bg-[#382e1e] text-[#5c4314] dark:text-[#e6c47a]">
                    正式词条 #2
                  </span>
                </div>
                <p className="text-xs text-[#54595d] dark:text-[#a2a9b1] mb-2 leading-relaxed">
                  贴附于内裤裆部内侧、于体外承接并锁住经血的护理用品：
                </p>
                <div className="text-xs space-y-1.5">
                  <div>
                    <span className="font-semibold text-[#202122] dark:text-[#eaecf0]">主条目：</span>
                    {renderWikiLink('卫生棉', '卫生棉（卫生巾 / 姨妈巾 / 月经垫）', { bold: true })}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[#54595d] dark:text-[#a2a9b1]">
                    <span className="font-semibold text-[#202122] dark:text-[#eaecf0]">细分规格：</span>
                    <button type="button" onClick={() => onNavigateSanitaryPad?.('pad-types')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">日用与夜用加长</button>
                    <span>·</span>
                    <button type="button" onClick={() => onNavigateSanitaryPad?.('pad-types')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">护垫 (Panty liner)</button>
                    <span>·</span>
                    <button type="button" onClick={() => onNavigateSanitaryPad?.('pad-types')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">裤型卫生巾（安睡裤）</button>
                    <span>·</span>
                    <button type="button" onClick={() => onNavigateSanitaryPad?.('pad-types')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">液体卫生棉</button>
                    <span>·</span>
                    <button type="button" onClick={() => onNavigateSanitaryPad?.('pad-environment')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">可水洗布卫生棉</button>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#eaecf0] dark:border-[#2e2c26] flex items-center justify-between text-[11px]">
                <span className="text-[#72777d]">4,160字 · 7大章节 · 12篇文献</span>
                <button
                  type="button"
                  onClick={() => onNavigateSanitaryPad?.()}
                  className="text-[#3366cc] dark:text-[#6b9eff] font-bold hover:underline cursor-pointer"
                >
                  进入卫生棉词条 →
                </button>
              </div>
            </div>

            {/* Category 2: 体内生理用品 */}
            <div className="border border-[#c4b08b] dark:border-[#524328] bg-white dark:bg-[#1c1a17] p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#e8dec8] dark:border-[#383124]">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#202122] dark:text-[#eaecf0]">
                    2. 体内经期生理用品
                  </h3>
                  <span className="text-[11px] font-mono px-1.5 py-0.5 bg-[#f2e6ce] dark:bg-[#382e1e] text-[#5c4314] dark:text-[#e6c47a]">
                    正式词条 #1
                  </span>
                </div>
                <p className="text-xs text-[#54595d] dark:text-[#a2a9b1] mb-2 leading-relaxed">
                  置入阴道中上段直接吸收或收集经血的体内生理护理器具：
                </p>
                <div className="text-xs space-y-1.5">
                  <div>
                    <span className="font-semibold text-[#202122] dark:text-[#eaecf0]">主条目：</span>
                    {renderWikiLink('卫生棉条', '卫生棉条（Tampon / 卫生栓）', { bold: true })}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[#54595d] dark:text-[#a2a9b1]">
                    <span className="font-semibold text-[#202122] dark:text-[#eaecf0]">关联概念：</span>
                    <button type="button" onClick={() => onNavigateToArticle('structure-and-types')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">导管式与指入式</button>
                    <span>·</span>
                    {renderWikiLink('丹碧丝', '丹碧丝 (Tampax)')}
                    <span>·</span>
                    {renderWikiLink('月经杯', '月经杯（医用硅胶杯）')}
                    <span>·</span>
                    {renderWikiLink('女性生理用品')}
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#eaecf0] dark:border-[#2e2c26] flex items-center justify-between text-[11px]">
                <span className="text-[#72777d]">3,820字 · 8大章节 · 15篇文献</span>
                <button
                  type="button"
                  onClick={() => onNavigateToArticle()}
                  className="text-[#3366cc] dark:text-[#6b9eff] font-bold hover:underline cursor-pointer"
                >
                  进入卫生棉条词条 →
                </button>
              </div>
            </div>

            {/* Category 3: 女性生殖解剖与生理 */}
            <div className="border border-[#c4b08b] dark:border-[#524328] bg-white dark:bg-[#1c1a17] p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#e8dec8] dark:border-[#383124]">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#202122] dark:text-[#eaecf0]">
                    3. 女性生殖解剖与生理
                  </h3>
                  <span className="text-[11px] font-mono px-1.5 py-0.5 bg-[#f2e6ce] dark:bg-[#382e1e] text-[#5c4314] dark:text-[#e6c47a]">
                    Anatomy
                  </span>
                </div>
                <p className="text-xs text-[#54595d] dark:text-[#a2a9b1] mb-2 leading-relaxed">
                  盆腔矢状面解剖构造、神经支配分段与周期性生理现象：
                </p>
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-[#54595d] dark:text-[#a2a9b1]">
                  {renderWikiLink('月经', '月经（周期性内膜剥落）', { bold: true })}
                  <span>·</span>
                  {renderWikiLink('阴道穹', '阴道后穹窿（无感区）', { bold: true })}
                  <span>·</span>
                  {renderWikiLink('阴道冠', '阴道冠（处女膜解剖）', { bold: true })}
                  <span>·</span>
                  {renderWikiLink('阴道分泌物', '阴道分泌物（白带）')}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#eaecf0] dark:border-[#2e2c26] flex items-center justify-between text-[11px]">
                <span className="text-[#72777d]">文内专业术语悬停预览</span>
                <button
                  type="button"
                  onClick={() => onNavigateToArticle('usage-guide')}
                  className="text-[#3366cc] dark:text-[#6b9eff] font-bold hover:underline cursor-pointer"
                >
                  查看解剖图解 →
                </button>
              </div>
            </div>

            {/* Category 4: 临床病理与微生态 */}
            <div className="border border-[#c4b08b] dark:border-[#524328] bg-white dark:bg-[#1c1a17] p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#e8dec8] dark:border-[#383124]">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#202122] dark:text-[#eaecf0]">
                    4. 临床病理与阴道微生态
                  </h3>
                  <span className="text-[11px] font-mono px-1.5 py-0.5 bg-[#f2e6ce] dark:bg-[#382e1e] text-[#5c4314] dark:text-[#e6c47a]">
                    Pathology
                  </span>
                </div>
                <p className="text-xs text-[#54595d] dark:text-[#a2a9b1] mb-2 leading-relaxed">
                  超抗原外毒素致病机制、乳杆菌弱酸屏障与留置安全规范：
                </p>
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-[#54595d] dark:text-[#a2a9b1]">
                  {renderWikiLink('中毒性休克综合征', '中毒性休克综合征（TSS）', { bold: true })}
                  <span>·</span>
                  {renderWikiLink('中毒性休克综合征毒素-1', 'TSST-1外毒素')}
                  <span>·</span>
                  {renderWikiLink('阴道菌群', '阴道菌群（乳杆菌）', { bold: true })}
                  <span>·</span>
                  {renderWikiLink('8小时安全时限', '8小时安全更换时限')}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#eaecf0] dark:border-[#2e2c26] flex items-center justify-between text-[11px]">
                <span className="text-[#72777d]">循证妇产科临床安全准则</span>
                <button
                  type="button"
                  onClick={() => onNavigateToArticle('safety-and-tss')}
                  className="text-[#3366cc] dark:text-[#6b9eff] font-bold hover:underline cursor-pointer"
                >
                  查看TSS防治章节 →
                </button>
              </div>
            </div>

            {/* Category 5: 高分子材料与产品工程 */}
            <div className="border border-[#c4b08b] dark:border-[#524328] bg-white dark:bg-[#1c1a17] p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#e8dec8] dark:border-[#383124]">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#202122] dark:text-[#eaecf0]">
                    5. 高分子材料与产品工程
                  </h3>
                  <span className="text-[11px] font-mono px-1.5 py-0.5 bg-[#f2e6ce] dark:bg-[#382e1e] text-[#5c4314] dark:text-[#e6c47a]">
                    Engineering
                  </span>
                </div>
                <p className="text-xs text-[#54595d] dark:text-[#a2a9b1] mb-2 leading-relaxed">
                  从木浆纤维素棉到高倍锁水凝胶、瞬吸导流层与无氯漂白工艺：
                </p>
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-[#54595d] dark:text-[#a2a9b1]">
                  <button type="button" onClick={() => onNavigateSanitaryPad?.('pad-structure')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline font-bold cursor-pointer">高分子吸水树脂 (SAP)</button>
                  <span>·</span>
                  <button type="button" onClick={() => onNavigateSanitaryPad?.('pad-structure')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">瞬吸导流层 (ADL)</button>
                  <span>·</span>
                  <button type="button" onClick={() => onNavigateSanitaryPad?.('pad-structure')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">防漏蝶翼与PE透气底膜</button>
                  <span>·</span>
                  <button type="button" onClick={() => onNavigateToArticle('structure-and-types')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">ECF/TCF无氯漂白人造丝</button>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#eaecf0] dark:border-[#2e2c26] flex items-center justify-between text-[11px]">
                <span className="text-[#72777d]">四层复合剖面与五部件拆解</span>
                <button
                  type="button"
                  onClick={() => onNavigateSanitaryPad?.('pad-structure')}
                  className="text-[#3366cc] dark:text-[#6b9eff] font-bold hover:underline cursor-pointer"
                >
                  查看材料结构图 →
                </button>
              </div>
            </div>

            {/* Category 6: 历史人物与经期社会学 */}
            <div className="border border-[#c4b08b] dark:border-[#524328] bg-white dark:bg-[#1c1a17] p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#e8dec8] dark:border-[#383124]">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#202122] dark:text-[#eaecf0]">
                    6. 专利史与经期社会学
                  </h3>
                  <span className="text-[11px] font-mono px-1.5 py-0.5 bg-[#f2e6ce] dark:bg-[#382e1e] text-[#5c4314] dark:text-[#e6c47a]">
                    History &amp; Society
                  </span>
                </div>
                <p className="text-xs text-[#54595d] dark:text-[#a2a9b1] mb-2 leading-relaxed">
                  现代经期用品发明先驱、反性别价格歧视与消除月经贫困运动：
                </p>
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-[#54595d] dark:text-[#a2a9b1]">
                  {renderWikiLink('厄尔·哈斯', '厄尔·哈斯（导管棉条发明者）', { bold: true })}
                  <span>·</span>
                  {renderWikiLink('粉红税', '粉红税（经期税废除运动）', { bold: true })}
                  <span>·</span>
                  <button type="button" onClick={() => onNavigateSanitaryPad?.('pad-society')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">月经贫困 (Period Poverty)</button>
                  <span>·</span>
                  <button type="button" onClick={() => onNavigateSanitaryPad?.('pad-history')} className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer">一战纤维素棉与高洁丝</button>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#eaecf0] dark:border-[#2e2c26] flex items-center justify-between text-[11px]">
                <span className="text-[#72777d]">1896–2026 历史与社会平权</span>
                <button
                  type="button"
                  onClick={() => onNavigateSanitaryPad?.('pad-society')}
                  className="text-[#3366cc] dark:text-[#6b9eff] font-bold hover:underline cursor-pointer"
                >
                  查阅社会影响章节 →
                </button>
              </div>
            </div>
          </div>

          {/* 3.2 文内专业术语内链全索引（明确区分正式词条与文内悬停术语） */}
          <div className="border border-[#c4b08b] dark:border-[#524328] bg-white dark:bg-[#1c1a17] p-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 mb-2 border-b border-[#e8dec8] dark:border-[#383124]">
              <span className="font-bold text-[#202122] dark:text-[#eaecf0]">
                ▪ 百科正式词条（{allEncyclopediaArticles.length}篇）与文内附属术语内链索引：
              </span>
              <span className="text-[11px] text-[#54595d] dark:text-[#a2a9b1]">
                鼠标悬停任意蓝链即可弹出维基百科词条预览卡片
              </span>
            </div>
            <div className="space-y-1.5">
              <div>
                <span className="font-bold text-[#145232] dark:text-[#7ee2a8] mr-2">
                  [已收录正式词条 · {allEncyclopediaArticles.length}篇]：
                </span>
                {allEncyclopediaArticles.map((art, idx) => (
                  <React.Fragment key={art.id}>
                    {idx > 0 && <span className="mx-1.5 text-[#a2a9b1]">·</span>}
                    <button
                      type="button"
                      onClick={() => art.onNavigate()}
                      onMouseEnter={(e) => onOpenWikiLink?.(art.title, e)}
                      className="font-bold text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
                    >
                      #{idx + 1} {art.title}
                    </button>
                  </React.Fragment>
                ))}
              </div>
              <div>
                <span className="font-bold text-[#54595d] dark:text-[#a2a9b1] mr-2">
                  [文内专业术语内链（悬停预览卡片）]：
                </span>
                {WIKI_ENTRIES.filter((e) => e.id !== 'sanitary-pad').map((entry, idx) => (
                  <React.Fragment key={entry.id}>
                    {idx > 0 && <span className="mx-1.5 text-[#a2a9b1]">·</span>}
                    <button
                      type="button"
                      onClick={() => onNavigateWikiTerm?.(entry.title)}
                      onMouseEnter={(e) => onOpenWikiLink?.(entry.title, e)}
                      className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
                    >
                      {entry.title}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          MZ维基专题工程与全域方针 (Sister Projects / Tools & Policies Footer)
         ===================================================================== */}
      <section className="border border-[#cccccc] dark:border-[#3a3e47] bg-[#fafafa] dark:bg-[#1e2024] p-3.5 mb-3">
        <h3 className="bg-[#eeeeee] dark:bg-[#272a30] border border-[#cccccc] dark:border-[#3a3e47] px-3 py-1.5 font-serif text-base font-bold text-[#202122] dark:text-[#eaecf0] mb-3">
          MZ维基专题工程与全域方针
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-[13px] pb-3 border-b border-[#e0e0e0] dark:border-[#32363e]">
          <div className="flex items-start space-x-2.5">
            <span className="text-lg leading-none mt-0.5">🗂️</span>
            <div>
              <button
                type="button"
                onClick={() => onNavigateCategory?.()}
                className="font-bold text-[#3366cc] dark:text-[#6b9eff] hover:underline block text-left cursor-pointer"
              >
                分类:女性生理用品
              </button>
              <span className="text-[#54595d] dark:text-[#a2a9b1]">
                按A–Z首字母与学科分类检索全部 {allEncyclopediaArticles.length} 篇已收录正式词条
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <span className="text-lg leading-none mt-0.5">🕸️</span>
            <div>
              <button
                type="button"
                onClick={() => onNavigateGraph?.()}
                className="font-bold text-[#3366cc] dark:text-[#6b9eff] hover:underline block text-left cursor-pointer"
              >
                Special:知识图谱
              </button>
              <span className="text-[#54595d] dark:text-[#a2a9b1]">
                交互式力导向节点网络，可视化卫生棉条、卫生巾与临床医学词条关联
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <span className="text-lg leading-none mt-0.5">🏷️</span>
            <div>
              <button
                type="button"
                onClick={() => onNavigateTags?.()}
                className="font-bold text-[#3366cc] dark:text-[#6b9eff] hover:underline block text-left cursor-pointer"
              >
                Special:知识标签
              </button>
              <span className="text-[#54595d] dark:text-[#a2a9b1]">
                多维主题标签聚合检索，支持按临床病理、材料学、法规标准交叉筛选
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <span className="text-lg leading-none mt-0.5">📊</span>
            <div>
              <button
                type="button"
                onClick={() => onNavigateStats?.()}
                className="font-bold text-[#3366cc] dark:text-[#6b9eff] hover:underline block text-left cursor-pointer"
              >
                Special:内容统计
              </button>
              <span className="text-[#54595d] dark:text-[#a2a9b1]">
                全域字数统计（{globalStats.totalWords.toLocaleString()}字）、健康度雷达与温哥华学术引用审计
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Policy & License Links */}
        <div className="pt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#54595d] dark:text-[#a2a9b1]">
          <div>
            全部百科正文与矢量医学插图均遵循 <strong>CC BY-SA 4.0</strong> 知识共享署名-相同方式共享协议开放提供。
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <button
              type="button"
              onClick={() => onNavigatePolicy('privacy')}
              className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
            >
              MZ维基:隐私政策
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onNavigatePolicy('disclaimer')}
              className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
            >
              MZ维基:免责声明（医学声明）
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onNavigatePolicy('conduct')}
              className="text-[#3366cc] dark:text-[#6b9eff] hover:underline cursor-pointer"
            >
              MZ维基:全域行为准则
            </button>
          </div>
        </div>
      </section>

      {/* Media Viewer Lightbox Modal */}
      <WikipediaMediaViewer
        images={allImagesList}
        currentImageId={activeLightboxImageId}
        onClose={() => setActiveLightboxImageId(null)}
        onSelectImage={(id) => setActiveLightboxImageId(id)}
      />
    </div>
  );
};

