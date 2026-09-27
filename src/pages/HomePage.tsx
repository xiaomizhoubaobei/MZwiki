import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Award, 
  ArrowRight, 
  CheckCircle2,
  ShieldCheck,
  FileText,
  BookmarkCheck,
  Layers,
  ExternalLink,
  Info,
  Calendar,
  Image as ImageIcon,
  Compass,
  Search,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  GitBranch,
  Tag,
  ChevronRight
} from 'lucide-react';
import { ABSORBENCY_GRADES } from '../data/articleData';
import { WikipediaImageThumb, WikiImageData } from '../components/WikipediaImageThumb';
import { WikipediaMediaViewer } from '../components/WikipediaMediaViewer';
import { 
  getGlobalContentStatistics, 
  getFeaturedTamponStats,
  GlobalContentStatistics
} from '../utils/contentStatisticsAutomation';
import { fetchGlobalStatisticsApi } from '../services/statisticsApi';

// Official Wikimedia featured image on the home portal
const HOME_FEATURED_IMAGE: WikiImageData = {
  id: 'featured-applicator-tampon',
  filename: 'Tampon with applicator.jpg',
  title: '导管型卫生棉条（Tampon with applicator）',
  caption: '导管型卫生棉条外观：圆弧花瓣状导管（外管）、活塞推杆（内管）与预置吸收棉芯。',
  author: 'Wikimedia Commons 贡献者',
  license: 'CC BY-SA 3.0 / GFDL',
  date: '2007年3月15日',
  dimensions: '1,800 × 1,200 像素',
  fileSize: '340 KB',
  commonsUrl: 'https://commons.wikimedia.org/wiki/File:Tampon_with_applicator.jpg',
  type: 'applicator'
};

interface HomePageProps {
  isDarkMode: boolean;
  onNavigateToArticle: (sectionId?: string) => void;
  onNavigatePolicy: (policy: 'privacy' | 'disclaimer' | 'conduct') => void;
  onNavigateCategory?: () => void;
  onNavigateGraph?: () => void;
  onNavigateTags?: () => void;
  onNavigateStats?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  isDarkMode,
  onNavigateToArticle,
  onNavigatePolicy,
  onNavigateCategory,
  onNavigateGraph,
  onNavigateTags,
  onNavigateStats
}) => {
  const [selectedMedia, setSelectedMedia] = useState<WikiImageData | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Automated Derived Content Statistics with REST API synchronization
  const [globalStats, setGlobalStats] = useState<GlobalContentStatistics>(() => getGlobalContentStatistics());
  const featuredStats = React.useMemo(() => getFeaturedTamponStats(), []);

  useEffect(() => {
    fetchGlobalStatisticsApi().then(res => {
      setGlobalStats(res.data);
    });
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => prev === index ? null : index);
  };

  const FAQS = [
    {
      q: '置入棉条后为什么完全感觉不到它的存在？',
      a: '女性阴道上 2/3 区域受植物神经（自主神经）支配，缺乏敏锐的痛觉与触觉神经末梢。只要依照45°自然生理倾角将棉条推入后穹窿无感区（约两指深），身体即可处于完全无异物感的状态。'
    },
    {
      q: '卫生棉条有可能会在身体内「丢失」或滑入腹腔吗？',
      a: '绝无可能。子宫颈外口直径仅约 2 至 3 毫米（经期微张亦不超过数毫米），阴道深处是闭合的盲端穹窿，棉条在物理结构上完全不可能穿过宫颈进入腹腔或体内其他器官。'
    },
    {
      q: '为什么必须遵照「按经血量选择最低合适吸收量」原则？',
      a: '若在经血较少时使用超强吸收型棉条，棉纤维会过度吸干阴道黏膜自身的保护性润滑黏液，造成黏膜微创擦伤，并在阴道内部形成高需氧微环境，从而增加金黄色葡萄球菌过度增殖并释放 TSST-1 毒素的风险。'
    },
    {
      q: '棉条尾部的拉绳能承受多大拉力？会断在体内吗？',
      a: '根据国际 ISO 23418 与美国 FDA 标准，棉绳与棉条芯体通过多重环绕紧密缝合，出厂前需经受至少 3 公斤（约 30 牛顿）以上的连续垂直拉拔测试，正常轻柔拉取极难发生断裂。'
    },
    {
      q: '使用卫生棉条可以正常小便或运动游泳吗？',
      a: '完全可以。女性尿道口与阴道口是两个独立分隔的生理管道，排尿时只需将棉线轻轻拉向一侧避免弄湿即可；棉条在体内吸血且不外露，在游泳、温泉及各类剧烈运动中均能提供可靠的防漏防护。'
    }
  ];

  const PORTAL_ENTRIES = [
    {
      title: '女性生理用品',
      tag: '核心分类',
      desc: '收录卫生棉条、卫生棉、月经杯、布卫生棉、月经裤及品牌子分类。',
      target: () => onNavigateCategory && onNavigateCategory()
    },
    {
      title: '中毒性休克综合征 (TSS)',
      tag: '医学安全',
      desc: '金葡菌外毒素致病机理、前驱警示症状与严格8小时安全更换准则。',
      target: () => onNavigateToArticle('safety-and-tss')
    },
    {
      title: '人体解剖与阴道冠',
      tag: '生理科普',
      desc: '破除传统文化道德迷思，认识阴道冠弹性黏膜皱襞与后穹窿解剖构造。',
      target: () => onNavigateToArticle('common-myths')
    },
    {
      title: '厄尔·哈斯与棉条发明史',
      tag: '历史科技',
      desc: '1931年导管专利诞生，丹碧丝、德国o.b.指入式棉条的发展历史演进。',
      target: () => onNavigateToArticle('history')
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Wikipedia Welcome Header Banner (Vector 2022 Classic Style) */}
      <div className={`p-4 sm:p-5 rounded border transition-colors ${
        isDarkMode 
          ? 'bg-[#1e2329] border-[#54595d] text-[#eaecf0]' 
          : 'bg-[#f8f9fa] border-[#c8ccd1] text-[#202122]'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-[#202122] dark:text-white">
              欢迎来到 MZ维基
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded bg-[#3366cc]/10 text-[#3366cc] dark:text-[#6699ff] font-medium font-serif">
              自由的百科全书
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#54595d] dark:text-[#a2a9b1] shrink-0">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>中文维基 Vector 2022 规范编排</span>
          </div>
        </div>
      </div>

      {/* 2. Automated Global Content Statistics Dashboard Bar */}
      <div className={`p-4 rounded border transition-colors ${
        isDarkMode ? 'bg-[#151617] border-[#3a3d42]' : 'bg-white border-[#c8ccd1]'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-serif font-bold text-sm text-[#202122] dark:text-white">
              MZ维基 全域典藏与内容统计
            </h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
              100% 自动计算派生
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-[#72777d]">
              最新版本修订：{globalStats.latestRevisionTimestamp}
            </span>
            {onNavigateStats && (
              <button
                onClick={onNavigateStats}
                className="text-xs px-2.5 py-1 rounded bg-[#3366cc]/10 hover:bg-[#3366cc]/20 text-[#3366cc] font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>查看全域量化透视表</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* 6 Grid Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3">
          <div className="space-y-0.5">
            <div className="text-[10px] text-[#72777d] flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-[#3366cc]" />
              <span>典藏条目</span>
            </div>
            <div className="text-lg font-bold font-serif text-[#202122] dark:text-white">
              {globalStats.totalArticles} <span className="text-xs font-sans font-normal text-[#72777d]">篇</span>
            </div>
            <div className="text-[10px] text-[#059669] dark:text-[#34d399]">
              {globalStats.featuredArticles} 篇典范 · {globalStats.standardArticles} 篇优良
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[10px] text-[#72777d] flex items-center gap-1">
              <FileText className="w-3 h-3 text-[#059669]" />
              <span>权威正文字数</span>
            </div>
            <div className="text-lg font-bold font-serif text-[#202122] dark:text-white">
              {(globalStats.totalWords / 10000).toFixed(1)} <span className="text-xs font-sans font-normal text-[#72777d]">万字</span>
            </div>
            <div className="text-[10px] text-[#72777d] font-mono">
              共 {globalStats.totalWords.toLocaleString()} 字
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[10px] text-[#72777d] flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#7c3aed]" />
              <span>编修段落 / 章节</span>
            </div>
            <div className="text-lg font-bold font-serif text-[#202122] dark:text-white">
              {globalStats.totalParagraphs} <span className="text-xs font-sans font-normal text-[#72777d]">段落</span>
            </div>
            <div className="text-[10px] text-[#72777d]">
              涵盖 {globalStats.totalSections} 个系统章节
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[10px] text-[#72777d] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#dc2626]" />
              <span>学术实证文献</span>
            </div>
            <div className="text-lg font-bold font-serif text-[#202122] dark:text-white">
              {globalStats.totalReferences} <span className="text-xs font-sans font-normal text-[#72777d]">篇</span>
            </div>
            <div className="text-[10px] text-[#72777d]">
              均篇 {globalStats.averageReferencesPerArticle} 篇权威引用
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[10px] text-[#72777d] flex items-center gap-1">
              <GitBranch className="w-3 h-3 text-[#d97706]" />
              <span>知识图谱拓扑</span>
            </div>
            <div className="text-lg font-bold font-serif text-[#202122] dark:text-white">
              {globalStats.totalGraphEdges} <span className="text-xs font-sans font-normal text-[#72777d]">关系连线</span>
            </div>
            <div className="text-[10px] text-[#3366cc] dark:text-[#6699ff]">
              连接 {globalStats.totalGraphNodes} 个核心知识实体
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[10px] text-[#72777d] flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#0891b2]" />
              <span>全域主题标签</span>
            </div>
            <div className="text-lg font-bold font-serif text-[#202122] dark:text-white">
              {globalStats.totalTags} <span className="text-xs font-sans font-normal text-[#72777d]">个</span>
            </div>
            <div className="text-[10px] text-[#72777d]">
              贯通 {globalStats.totalCategories} 大知识领域
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Portal Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 cols on lg): Featured Article + Did You Know + History Today */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section: 今日典范条目 (Featured Article) */}
          <div className={`rounded border overflow-hidden transition-colors ${
            isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-white border-[#c8ccd1]'
          }`}>
            <div className="bg-[#eaecf0] dark:bg-[#2c3036] px-4 py-2.5 border-b border-[#c8ccd1] dark:border-[#54595d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#e67e22]" />
                <h2 className="font-serif font-bold text-sm tracking-wide text-[#202122] dark:text-white">
                  今日典范条目
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#72777d]">
                本期精选 · 特色评级 ★★★★★
              </span>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <a
                      href="/wiki/卫生棉条"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigateToArticle();
                      }}
                      className="font-serif font-bold text-xl sm:text-2xl text-[#3366cc] hover:underline cursor-pointer text-left"
                    >
                      卫生棉条 (Tampon)
                    </a>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#3366cc]/10 text-[#3366cc] dark:text-[#6699ff] font-medium">
                      女性个人卫生用品
                    </span>
                  </div>
                  <p className="text-xs text-[#72777d] dark:text-[#9aa0a6] flex items-center gap-2">
                    <span>阅读全文需 {featuredStats.metrics.readingMinutes} 分钟</span>
                    <span>·</span>
                    <span>正文约 {featuredStats.metrics.wordCount.toLocaleString()} 字</span>
                  </p>
                </div>

                <button
                  onClick={() => onNavigateToArticle()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#3366cc] hover:bg-[#2a4b8d] text-white text-xs font-medium shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  <span>阅读完整条目</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Lead Excerpt with Thumbnail Preview */}
              <div className="space-y-3">
                <WikipediaImageThumb
                  image={HOME_FEATURED_IMAGE}
                  width={220}
                  align="right"
                  isDarkMode={isDarkMode}
                  onImageClick={(img) => setSelectedMedia(img)}
                />

                <p className="text-xs sm:text-sm text-[#202122] dark:text-[#eaecf0] leading-relaxed text-justify">
                  <strong>卫生棉条</strong>（英语：<span lang="en">Tampon</span>），简称<strong>棉条</strong>，是一种由高吸收性医用脱脂纯棉或人造粘胶纤维压缩制成的圆柱形吸收材料。作为女性经期生理用品，用以置入阴道后穹窿区域在经血流出体外前直接吸收。现代双导管式卫生棉条由美国骨科医生<strong>厄尔·哈斯</strong>（Earle Haas）于1929年发明并获得专利。相较于外置卫生巾，其在体内直接吸纳经血，能大幅减少经期异味、闷热潮湿与摩擦破皮感，并允许使用者在经期自如参与游泳和体育运动。
                </p>
              </div>

              <div className="clear-both" />

              {/* Key Features Callout Box inside Lead */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <div 
                  onClick={() => onNavigateToArticle('usage-guide')}
                  className="p-2.5 rounded border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-[#3366cc]/40 transition-colors cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-[#202122] dark:text-white flex items-center justify-between">
                    <span>45°斜向置入法</span>
                    <ArrowRight className="w-3 h-3 text-[#72777d] group-hover:text-[#3366cc] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-[#72777d] mt-1 leading-snug">
                    顺应阴道向后上方的生理倾角，无痛且无异物感。
                  </p>
                </div>

                <div 
                  onClick={() => onNavigateToArticle('safety-and-tss')}
                  className="p-2.5 rounded border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-[#3366cc]/40 transition-colors cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-[#202122] dark:text-white flex items-center justify-between">
                    <span>TSS 8小时安全时限</span>
                    <ArrowRight className="w-3 h-3 text-[#72777d] group-hover:text-[#3366cc] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-[#72777d] mt-1 leading-snug">
                    严格4~8小时更换，避免超量吸收型号，遏制毒素产生。
                  </p>
                </div>

                <div 
                  onClick={() => onNavigateToArticle('common-myths')}
                  className="p-2.5 rounded border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-[#3366cc]/40 transition-colors cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-[#202122] dark:text-white flex items-center justify-between">
                    <span>阴道冠与生理迷思</span>
                    <ArrowRight className="w-3 h-3 text-[#72777d] group-hover:text-[#3366cc] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-[#72777d] mt-1 leading-snug">
                    破除贞洁与生理羞辱，弹性瓣膜组织与型号科学匹配。
                  </p>
                </div>
              </div>

              {/* Bottom Quick Jump Bar */}
              <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs text-[#54595d] dark:text-[#a2a9b1]">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#72777d]">章节直达：</span>
                  <a 
                    href="/wiki/卫生棉条#history" 
                    onClick={(e) => { e.preventDefault(); onNavigateToArticle('history'); }} 
                    className="text-[#3366cc] hover:underline cursor-pointer"
                  >
                    发明历史
                  </a>
                  <a 
                    href="/wiki/卫生棉条#structure-and-types" 
                    onClick={(e) => { e.preventDefault(); onNavigateToArticle('structure-and-types'); }} 
                    className="text-[#3366cc] hover:underline cursor-pointer"
                  >
                    结构形态
                  </a>
                  <a 
                    href="/wiki/卫生棉条#references" 
                    onClick={(e) => { e.preventDefault(); onNavigateToArticle('references'); }} 
                    className="text-[#3366cc] hover:underline cursor-pointer"
                  >
                    参考文献
                  </a>
                </div>
                <a
                  href="/wiki/卫生棉条"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToArticle();
                  }}
                  className="text-[#3366cc] font-medium hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>全文阅读 »</span>
                </a>
              </div>
            </div>
          </div>

          {/* Section: 你知道吗？(Did You Know - DYK) 交互式折叠解答 */}
          <div className={`rounded border overflow-hidden transition-colors ${
            isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-white border-[#c8ccd1]'
          }`}>
            <div className="bg-[#eaecf0] dark:bg-[#2c3036] px-4 py-2.5 border-b border-[#c8ccd1] dark:border-[#54595d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#3366cc]" />
                <h2 className="font-serif font-bold text-sm tracking-wide text-[#202122] dark:text-white">
                  你知道吗？（Did You Know）
                </h2>
              </div>
              <span className="text-[11px] text-[#72777d]">
                常见生理与使用常识速查
              </span>
            </div>

            <div className="p-4 sm:p-5 space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div 
                    key={idx}
                    className={`rounded border transition-colors ${
                      isOpen 
                        ? 'border-[#3366cc]/40 bg-[#3366cc]/[0.03]' 
                        : 'border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left p-3 flex items-start justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-start gap-2.5 text-xs font-semibold text-[#202122] dark:text-white">
                        <span className="text-[#3366cc] font-bold shrink-0 mt-0.5">Q{idx + 1}.</span>
                        <span>{faq.q}</span>
                      </div>
                      <div className="text-[#72777d] shrink-0 mt-0.5">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-3 pb-3 text-xs text-[#54595d] dark:text-[#a2a9b1] leading-relaxed pl-8 border-t border-black/5 dark:border-white/5 pt-2">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-2 flex items-center justify-between text-xs text-[#72777d]">
                <span>内容审核：基于中华医学会妇产科分会与 FDA 临床指导意见</span>
                <a
                  href="/wiki/卫生棉条#common-myths"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToArticle('common-myths');
                  }}
                  className="text-[#3366cc] hover:underline cursor-pointer font-medium"
                >
                  查看条目详细生理迷思解答 »
                </a>
              </div>
            </div>
          </div>

          {/* Section: 历史上的今天 (On This Day In History) */}
          <div className={`rounded border overflow-hidden transition-colors ${
            isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-white border-[#c8ccd1]'
          }`}>
            <div className="bg-[#eaecf0] dark:bg-[#2c3036] px-4 py-2 border-b border-[#c8ccd1] dark:border-[#54595d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#3366cc]" />
                <h2 className="font-serif font-bold text-sm tracking-wide text-[#202122] dark:text-white">
                  历史回顾：女性经期卫生用品演进里程碑
                </h2>
              </div>
              <span className="text-[11px] text-[#72777d]">Chronology</span>
            </div>

            <div className="p-4 text-xs space-y-3">
              <div className="flex items-start gap-3">
                <span className="font-mono font-bold text-[#3366cc] shrink-0 w-12">1931年</span>
                <div className="text-[#54595d] dark:text-[#a2a9b1] leading-relaxed">
                  美国医生<strong>厄尔·哈斯</strong>（Earle Haas）提交现代双套管导管型棉条发明专利，开启了女性经期内置吸收用品工业化先河。
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-mono font-bold text-[#3366cc] shrink-0 w-12">1950年</span>
                <div className="text-[#54595d] dark:text-[#a2a9b1] leading-relaxed">
                  德国妇科女医师朱迪丝·埃瑟-米塔格与团队研发出环保且无需导管的<strong>指入式棉条</strong>（o.b.品牌诞生），提供更紧凑便携的选择。
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-mono font-bold text-[#3366cc] shrink-0 w-12">1982年</span>
                <div className="text-[#54595d] dark:text-[#a2a9b1] leading-relaxed">
                  美国 FDA 制定《联邦法规汇编》21 CFR §801.430，在全美及国际范围内推行强制性统一吸收量命名标准，有效抑制了 TSS 的发生风险。
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols on lg): Quick Standards, Core Concepts & Policy Card */}
        <div className="lg:col-span-5 space-y-6">

          {/* Section: 吸收量分级与选型速查 (FDA 标准规格) */}
          <div className={`rounded border overflow-hidden transition-colors ${
            isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-white border-[#c8ccd1]'
          }`}>
            <div className="bg-[#eaecf0] dark:bg-[#2c3036] px-4 py-2.5 border-b border-[#c8ccd1] dark:border-[#54595d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#3366cc]" />
                <h2 className="font-serif font-bold text-sm tracking-wide text-[#202122] dark:text-white">
                  棉条吸收量国际分级速查
                </h2>
              </div>
              <span className="text-[11px] text-[#72777d]">FDA 21 CFR §801.430</span>
            </div>

            <div className="p-3.5 space-y-2">
              <div className="text-[11px] text-[#72777d] dark:text-[#a2a9b1] pb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#3366cc] shrink-0" />
                <span>所有正规上市棉条均统一遵循以下标准吸收量标注：</span>
              </div>

              <div className="space-y-1.5">
                {ABSORBENCY_GRADES.map((grade) => (
                  <div
                    key={grade.nameEn}
                    onClick={() => onNavigateToArticle('absorbency-standards')}
                    className="p-2 rounded border border-black/5 dark:border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0" 
                        style={{ backgroundColor: grade.colorCode }}
                      />
                      <div>
                        <div className="text-xs font-semibold text-[#202122] dark:text-white flex items-center gap-1.5">
                          <span>{grade.name}</span>
                          <span className="text-[10px] text-[#72777d] font-normal">({grade.nameEn})</span>
                        </div>
                        <div className="text-[10px] text-[#72777d]">{grade.flowLevel}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 pl-2">
                      <span className="text-xs font-mono font-medium text-[#3366cc] dark:text-[#6699ff]">
                        {grade.weightRange}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => onNavigateToArticle('absorbency-standards')}
                  className="text-[11px] text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <span>查看吸收量选型详细说明</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Section: 全域分类索引 (Portal Entries Grid) */}
          <div className={`rounded border overflow-hidden transition-colors ${
            isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-white border-[#c8ccd1]'
          }`}>
            <div className="bg-[#eaecf0] dark:bg-[#2c3036] px-4 py-2 border-b border-[#c8ccd1] dark:border-[#54595d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#3366cc]" />
                <h2 className="font-serif font-bold text-sm tracking-wide text-[#202122] dark:text-white">
                  全域主题巡礼
                </h2>
              </div>
              <span className="text-[11px] text-[#72777d]">Knowledge Portals</span>
            </div>
            
            <div className="p-3.5 space-y-2.5 text-xs">
              {PORTAL_ENTRIES.map((entry, idx) => (
                <div
                  key={idx}
                  onClick={entry.target}
                  className="p-2.5 rounded bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-[#3366cc]/40 transition-colors cursor-pointer group flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#3366cc] dark:text-[#6699ff] group-hover:underline">
                        {entry.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/10 text-[#72777d] dark:text-[#a2a9b1]">
                        {entry.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#54595d] dark:text-[#a2a9b1] mt-1 leading-snug">
                      {entry.desc}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#72777d] group-hover:text-[#3366cc] group-hover:translate-x-0.5 transition-transform shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Section: 经期解剖与健康速查 (Core Concepts) */}
          <div className={`rounded border overflow-hidden transition-colors ${
            isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-white border-[#c8ccd1]'
          }`}>
            <div className="bg-[#eaecf0] dark:bg-[#2c3036] px-4 py-2 border-b border-[#c8ccd1] dark:border-[#54595d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-[#00af89]" />
                <h2 className="font-serif font-bold text-sm tracking-wide text-[#202122] dark:text-white">
                  核心解剖与生理概念
                </h2>
              </div>
              <span className="text-[11px] text-[#72777d]">医学概念</span>
            </div>

            <div className="p-3.5 space-y-2.5 text-xs">
              <div 
                onClick={() => onNavigateToArticle('common-myths')}
                className="p-2.5 rounded bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-[#3366cc]/40 transition-colors cursor-pointer"
              >
                <div className="font-semibold text-[#202122] dark:text-white flex items-center justify-between">
                  <span className="text-[#3366cc] dark:text-[#6699ff]">阴道冠（Vaginal Corona）</span>
                  <ExternalLink className="w-3 h-3 text-[#72777d]" />
                </div>
                <p className="text-[11px] text-[#54595d] dark:text-[#a2a9b1] mt-1 leading-relaxed">
                  传统旧称“处女膜”。实为具有弹性孔隙的黏膜组织皱襞，正确置入小号棉条不会对其造成异常撕裂。
                </p>
              </div>

              <div 
                onClick={() => onNavigateToArticle('usage-guide')}
                className="p-2.5 rounded bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-[#3366cc]/40 transition-colors cursor-pointer"
              >
                <div className="font-semibold text-[#202122] dark:text-white flex items-center justify-between">
                  <span className="text-[#3366cc] dark:text-[#6699ff]">阴道后穹窿（Posterior Fornix）</span>
                  <ExternalLink className="w-3 h-3 text-[#72777d]" />
                </div>
                <p className="text-[11px] text-[#54595d] dark:text-[#a2a9b1] mt-1 leading-relaxed">
                  阴道顶端环绕宫颈的深凹陷处。此处自主神经末梢稀疏，棉条推入此区域后呈现真正的“无感状态”。
                </p>
              </div>

              <div 
                onClick={() => onNavigateToArticle('safety-and-tss')}
                className="p-2.5 rounded bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-[#3366cc]/40 transition-colors cursor-pointer"
              >
                <div className="font-semibold text-[#202122] dark:text-white flex items-center justify-between">
                  <span className="text-[#3366cc] dark:text-[#6699ff]">TSST-1 外毒素防范</span>
                  <ExternalLink className="w-3 h-3 text-[#72777d]" />
                </div>
                <p className="text-[11px] text-[#54595d] dark:text-[#a2a9b1] mt-1 leading-relaxed">
                  金葡菌产生毒素需要特定温湿与高吸收材料环境，单支使用严禁超过 8 小时，即可筑牢安全防线。
                </p>
              </div>
            </div>
          </div>

          {/* Section: 知识图谱概念网络 (Knowledge Graph Spotlight) */}
          <div className={`p-4 sm:p-5 rounded border text-xs space-y-3 transition-colors ${
            isDarkMode ? 'bg-[#181d24] border-[#2c3d53]' : 'bg-[#f0f7ff] border-[#b9d5fc]'
          }`}>
            <div className="flex items-center justify-between">
              <div className="font-bold text-sm text-[#202122] dark:text-white flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#3366cc]" />
                <span>知识图谱可视化</span>
              </div>
              <span className="text-[10px] font-mono text-[#3366cc] bg-[#3366cc]/10 px-1.5 py-0.5 rounded">
                NEW
              </span>
            </div>
            
            <p className="text-[#54595d] dark:text-[#bdc1c6] leading-relaxed">
              探索涵盖卫生棉条、中毒性休克综合征、阴道菌群、厄尔·哈斯等真实百科条目的多维实体关联拓扑网络，支持力导向、同心环与关系矩阵交互。
            </p>

            <button
              onClick={() => onNavigateGraph ? onNavigateGraph() : null}
              className="w-full text-center px-3 py-2 rounded bg-[#3366cc] hover:bg-[#2a4b8d] text-white font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>打开知识图谱探索器 »</span>
            </button>
          </div>

          {/* Section: 全域实体标签系统 (Special:Tags) */}
          <div className={`p-4 sm:p-5 rounded border text-xs space-y-3 transition-colors ${
            isDarkMode ? 'bg-[#1b221c] border-[#294231]' : 'bg-[#f0fdf4] border-[#bbf7d0]'
          }`}>
            <div className="flex items-center justify-between">
              <div className="font-bold text-sm text-[#202122] dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>知识标签与主题索引</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                58 标签
              </span>
            </div>
            
            <p className="text-[#54595d] dark:text-[#bdc1c6] leading-relaxed">
              跨越学科与分类体系，通过微生态、急症病理、人体解剖、专利品牌等多维实体标签，瞬间聚合全域高相关条目。
            </p>

            <button
              onClick={() => onNavigateTags ? onNavigateTags() : null}
              className="w-full text-center px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>浏览标签系统索引 »</span>
            </button>
          </div>

          {/* Section: MZ维基 全域方针与核心原则 */}
          <div className={`p-4 sm:p-5 rounded border text-xs space-y-4 ${
            isDarkMode ? 'bg-[#1b2430] border-[#334b6b]' : 'bg-[#f0f6ff] border-[#c2dbff]'
          }`}>
            <div className="font-bold text-sm text-[#202122] dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3366cc]" />
              <span>MZ维基 方针与自由倡导</span>
            </div>
            
            <p className="text-[#54595d] dark:text-[#bdc1c6] leading-relaxed">
              维基百科秉持中立的观点（NPOV）、可供查证（V）与非原创研究（NOR）三大核心原则，共同维护客观、开放与准确的自由知识共享体系。
            </p>

            <div className="space-y-2 pt-1 border-t border-black/5 dark:border-white/5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#202122] dark:text-[#eaecf0] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00af89]" />
                  <span>核心方针</span>
                </span>
                <span className="text-[11px] text-[#72777d]">全域通用</span>
              </div>
              <p className="text-[11px] text-[#72777d] leading-normal">
                所有医学与健康内容需严格遵循同行评审文献引用规范，保障客观与科学中立。
              </p>
            </div>

            <div className="pt-1 flex flex-col gap-2">
              <a 
                href="/wiki/Wikipedia:全域行为准则"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigatePolicy('conduct');
                }}
                className="w-full text-center px-3 py-2 rounded bg-white dark:bg-black/30 border border-[#3366cc]/30 text-[#3366cc] dark:text-[#6699ff] hover:bg-[#3366cc]/10 font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>全域行为准则 »</span>
              </a>
              <a 
                href="/wiki/Wikipedia:免责声明"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigatePolicy('disclaimer');
                }}
                className="w-full text-center px-3 py-2 rounded bg-white dark:bg-black/30 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>医学免责声明 »</span>
              </a>
              <a 
                href="/wiki/Wikipedia:隐私政策"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigatePolicy('privacy');
                }}
                className="w-full text-center px-3 py-2 rounded bg-white dark:bg-black/30 border border-black/10 dark:border-white/10 text-[#54595d] dark:text-[#bdc1c6] hover:bg-black/5 font-medium transition-colors cursor-pointer"
              >
                <span>隐私政策与数据使用 »</span>
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* Media Viewer Modal if user clicks on featured image */}
      {selectedMedia && (
        <WikipediaMediaViewer
          images={[selectedMedia]}
          currentImageId={selectedMedia.id}
          onClose={() => setSelectedMedia(null)}
          onSelectImage={() => {}}
        />
      )}

    </div>
  );
};
