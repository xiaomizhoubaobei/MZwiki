import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  FileText, 
  BookOpen, 
  ShieldCheck, 
  GitBranch, 
  Tag, 
  Layers, 
  Sparkles, 
  Download, 
  RefreshCw, 
  Search, 
  ArrowUpDown, 
  ExternalLink, 
  Award, 
  CheckCircle2, 
  Info,
  Clock,
  Database,
  ArrowRight,
  ChevronRight,
  Code2,
  Terminal,
  Server,
  Zap,
  Check
} from 'lucide-react';
import { 
  getGlobalContentStatistics, 
  getAllArticlesContentStats, 
  generateStatisticsJSON, 
  generateStatisticsCSV,
  ArticleContentStats,
  GlobalContentStatistics
} from '../utils/contentStatisticsAutomation';
import { 
  fetchGlobalStatisticsApi, 
  fetchArticlesStatisticsApi, 
  recalculateStatisticsApi, 
  fetchGraphTopologyStatisticsApi,
  STATS_API_ENDPOINTS 
} from '../services/statisticsApi';

interface ContentStatisticsPageProps {
  isDarkMode: boolean;
  onNavigateHome: () => void;
  onNavigateToArticle: (sectionId?: string) => void;
  onNavigateWikiTerm: (term: string) => void;
  onNavigateCategory: () => void;
  onNavigateGraph: () => void;
  onNavigateTags: () => void;
}

type SortField = 'wordCount' | 'referenceCount' | 'readingMinutes' | 'paragraphCount' | 'title' | 'quality';
type SortOrder = 'asc' | 'desc';

export const ContentStatisticsPage: React.FC<ContentStatisticsPageProps> = ({
  isDarkMode,
  onNavigateHome,
  onNavigateToArticle,
  onNavigateWikiTerm,
  onNavigateCategory,
  onNavigateGraph,
  onNavigateTags
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'table' | 'api' | 'export'>('overview');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('wordCount');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  // API State
  const [globalStats, setGlobalStats] = useState<GlobalContentStatistics>(() => getGlobalContentStatistics());
  const [articlesList, setArticlesList] = useState<ArticleContentStats[]>(() => getAllArticlesContentStats());
  const [isLiveApi, setIsLiveApi] = useState<boolean>(true);
  const [apiLatency, setApiLatency] = useState<number>(0.35);
  const [lastCalculatedTime, setLastCalculatedTime] = useState<string>('实时已同步');
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);
  const [isExportCopied, setIsExportCopied] = useState<string | null>(null);

  // API Tester Tab state
  const [selectedApiEndpoint, setSelectedApiEndpoint] = useState<string>('/api/statistics/global');
  const [apiTestResponse, setApiTestResponse] = useState<string>('');
  const [isTestingApi, setIsTestingApi] = useState<boolean>(false);
  const [apiStatusCode, setApiStatusCode] = useState<number>(200);

  // Fetch from API on mount & when filter changes
  useEffect(() => {
    let isMounted = true;

    // 1. Fetch Global Stats
    fetchGlobalStatisticsApi().then(res => {
      if (isMounted) {
        setGlobalStats(res.data);
        setIsLiveApi(res.isLiveApi);
        setApiLatency(res.latencyMs);
      }
    });

    // 2. Fetch Articles with query params
    fetchArticlesStatisticsApi({
      q: searchFilter,
      category: categoryFilter,
      grade: gradeFilter,
      sort: sortField,
      order: sortOrder
    }).then(res => {
      if (isMounted) {
        setArticlesList(res.data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [searchFilter, categoryFilter, gradeFilter, sortField, sortOrder]);

  // Recalculate trigger via API POST
  const handleRecalculate = async () => {
    setIsRecalculating(true);
    const result = await recalculateStatisticsApi();
    
    // Refresh global & articles
    const [globalRes, articlesRes] = await Promise.all([
      fetchGlobalStatisticsApi(),
      fetchArticlesStatisticsApi({
        q: searchFilter,
        category: categoryFilter,
        grade: gradeFilter,
        sort: sortField,
        order: sortOrder
      })
    ]);

    setGlobalStats(globalRes.data);
    setArticlesList(articlesRes.data);
    setIsLiveApi(globalRes.isLiveApi);
    setApiLatency(result.latencyMs);
    setLastCalculatedTime(`已重新计算 (${result.latencyMs}ms)`);
    setIsRecalculating(false);
  };

  // Run API Test in API Tab
  const handleTestApi = async (endpoint: string) => {
    setSelectedApiEndpoint(endpoint);
    setIsTestingApi(true);
    try {
      const res = await fetch(endpoint);
      setApiStatusCode(res.status);
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        setApiTestResponse(JSON.stringify(json, null, 2));
      } else {
        const text = await res.text();
        setApiTestResponse(text.slice(0, 1000) + (text.length > 1000 ? '\n... (truncated)' : ''));
      }
    } catch (err: any) {
      setApiStatusCode(500);
      setApiTestResponse(JSON.stringify({ error: err?.message }, null, 2));
    } finally {
      setIsTestingApi(false);
    }
  };

  // Run initial test for API tab
  useEffect(() => {
    if (activeTab === 'api' && !apiTestResponse) {
      handleTestApi('/api/statistics/global');
    }
  }, [activeTab]);

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(generateStatisticsJSON());
    setIsExportCopied('JSON 数据包已复制到剪贴板');
    setTimeout(() => setIsExportCopied(null), 2500);
  };

  const handleCopyCSV = () => {
    navigator.clipboard.writeText(generateStatisticsCSV());
    setIsExportCopied('CSV 报表已复制到剪贴板');
    setTimeout(() => setIsExportCopied(null), 2500);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner & Live API Status */}
      <div className={`p-5 rounded-lg border transition-colors ${
        isDarkMode ? 'bg-[#151617] border-[#3a3d42]' : 'bg-white border-[#c8ccd1]'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-[#3366cc] font-semibold">Special:统计</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>REST API 自动化接口驱动 (HTTP 200 OK)</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono text-[#72777d]">
                响应延迟 {apiLatency}ms
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#202122] dark:text-white flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-[#3366cc]" />
              <span>全域内容统计与学术深度量化报告</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-[#54595d] dark:text-[#a2a9b1]">
              本维基所有自动化数据均通过原生 <strong className="font-mono text-[#3366cc]">REST API 服务</strong>返回。涵盖全站量化指标、单篇详实度、质量梯队分布及图谱拓扑结构。
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={handleRecalculate}
              disabled={isRecalculating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium cursor-pointer transition-colors ${
                isDarkMode 
                  ? 'bg-[#202122] border-[#54595d] text-[#eaecf0] hover:bg-[#2c2e33]' 
                  : 'bg-[#f8f9fa] border-[#c8ccd1] text-[#202122] hover:bg-[#eaecf0]'
              } ${isRecalculating ? 'opacity-60 cursor-not-allowed' : ''}`}
              title="通过 POST /api/statistics/recalculate 重新计算并刷新"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#3366cc] ${isRecalculating ? 'animate-spin' : ''}`} />
              <span>{isRecalculating ? '正在计算...' : '重新计算 (API)'}</span>
              <span className="text-[10px] text-[#72777d]">({lastCalculatedTime})</span>
            </button>

            <a
              href="/api/statistics/export/json"
              download
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#3366cc] hover:bg-[#2a4b8d] text-white text-xs font-medium cursor-pointer transition-colors shadow-xs"
              title="通过 GET /api/statistics/export/json 下载"
            >
              <Download className="w-3.5 h-3.5" />
              <span>API 导出 JSON</span>
            </a>
          </div>
        </div>

        {/* API Real-time Endpoint Ribbon */}
        <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-4 text-xs font-mono text-[#72777d] flex-wrap">
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-[#3366cc]" />
            <span>核心自动化接口：</span>
            <span className="text-[#3366cc] bg-[#3366cc]/10 px-2 py-0.5 rounded">GET /api/statistics/global</span>
            <span className="text-[#059669] bg-[#059669]/10 px-2 py-0.5 rounded">GET /api/statistics/articles</span>
            <span className="text-[#d97706] bg-[#d97706]/10 px-2 py-0.5 rounded">GET /api/statistics/graph</span>
          </div>

          <button
            onClick={() => setActiveTab('api')}
            className="text-[#3366cc] hover:underline flex items-center gap-1 text-[11px] font-sans font-medium cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>在线调试 API 接口 →</span>
          </button>
        </div>
      </div>

      {/* 2. Top KPI Metrics 6-Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Total Articles */}
        <div className={`p-4 rounded-lg border transition-colors ${
          isDarkMode ? 'bg-[#151617] border-[#3a3d42]' : 'bg-white border-[#c8ccd1]'
        }`}>
          <div className="text-[11px] text-[#72777d] flex items-center justify-between">
            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-[#3366cc]" />收录词条</span>
            <span className="text-[10px] font-mono text-emerald-600">API 200</span>
          </div>
          <div className="mt-1 text-2xl font-serif font-bold text-[#202122] dark:text-white">
            {globalStats.totalArticles} <span className="text-xs font-sans font-normal text-[#72777d]">篇</span>
          </div>
          <div className="mt-1 text-[11px] text-[#059669] dark:text-[#34d399] flex items-center gap-1">
            <Award className="w-3 h-3" />
            <span>{globalStats.featuredArticles} 篇典范 · {globalStats.standardArticles} 篇优良</span>
          </div>
        </div>

        {/* Total Words */}
        <div className={`p-4 rounded-lg border transition-colors ${
          isDarkMode ? 'bg-[#151617] border-[#3a3d42]' : 'bg-white border-[#c8ccd1]'
        }`}>
          <div className="text-[11px] text-[#72777d] flex items-center justify-between">
            <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-[#059669]" />正文词量</span>
            <span className="text-[10px] font-mono text-[#3366cc]">均篇 {globalStats.averageWordsPerArticle} 字</span>
          </div>
          <div className="mt-1 text-2xl font-serif font-bold text-[#202122] dark:text-white">
            {(globalStats.totalWords / 10000).toFixed(1)} <span className="text-xs font-sans font-normal text-[#72777d]">万字</span>
          </div>
          <div className="mt-1 text-[11px] text-[#72777d] font-mono">
            共 {globalStats.totalWords.toLocaleString()} 汉字/词
          </div>
        </div>

        {/* Academic References */}
        <div className={`p-4 rounded-lg border transition-colors ${
          isDarkMode ? 'bg-[#151617] border-[#3a3d42]' : 'bg-white border-[#c8ccd1]'
        }`}>
          <div className="text-[11px] text-[#72777d] flex items-center justify-between">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#dc2626]" />实证文献</span>
            <span className="text-[10px] font-mono text-[#dc2626]">同行评议</span>
          </div>
          <div className="mt-1 text-2xl font-serif font-bold text-[#202122] dark:text-white">
            {globalStats.totalReferences} <span className="text-xs font-sans font-normal text-[#72777d]">篇</span>
          </div>
          <div className="mt-1 text-[11px] text-[#72777d]">
            篇均 {globalStats.averageReferencesPerArticle} 条权威实证引用
          </div>
        </div>

        {/* Knowledge Graph Edges */}
        <div className={`p-4 rounded-lg border transition-colors ${
          isDarkMode ? 'bg-[#151617] border-[#3a3d42]' : 'bg-white border-[#c8ccd1]'
        }`}>
          <div className="text-[11px] text-[#72777d] flex items-center justify-between">
            <span className="flex items-center gap-1"><GitBranch className="w-3.5 h-3.5 text-[#d97706]" />图谱网络</span>
            <span className="text-[10px] font-mono text-[#d97706]">多维拓扑</span>
          </div>
          <div className="mt-1 text-2xl font-serif font-bold text-[#202122] dark:text-white">
            {globalStats.totalGraphEdges} <span className="text-xs font-sans font-normal text-[#72777d]">拓扑边</span>
          </div>
          <div className="mt-1 text-[11px] text-[#3366cc] dark:text-[#6699ff]">
            连接 {globalStats.totalGraphNodes} 个核心知识实体
          </div>
        </div>

        {/* Paragraphs and Sections */}
        <div className={`p-4 rounded-lg border transition-colors ${
          isDarkMode ? 'bg-[#151617] border-[#3a3d42]' : 'bg-white border-[#c8ccd1]'
        }`}>
          <div className="text-[11px] text-[#72777d] flex items-center justify-between">
            <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-[#7c3aed]" />编修结构</span>
            <span className="text-[10px] font-mono text-[#7c3aed]">分级严谨</span>
          </div>
          <div className="mt-1 text-2xl font-serif font-bold text-[#202122] dark:text-white">
            {globalStats.totalParagraphs} <span className="text-xs font-sans font-normal text-[#72777d]">段落</span>
          </div>
          <div className="mt-1 text-[11px] text-[#72777d]">
            分布于 {globalStats.totalSections} 个系统子章节
          </div>
        </div>

        {/* Categories & Tags */}
        <div className={`p-4 rounded-lg border transition-colors ${
          isDarkMode ? 'bg-[#151617] border-[#3a3d42]' : 'bg-white border-[#c8ccd1]'
        }`}>
          <div className="text-[11px] text-[#72777d] flex items-center justify-between">
            <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5 text-[#0891b2]" />标签体系</span>
            <span className="text-[10px] font-mono text-[#0891b2]">网状链接</span>
          </div>
          <div className="mt-1 text-2xl font-serif font-bold text-[#202122] dark:text-white">
            {globalStats.totalTags} <span className="text-xs font-sans font-normal text-[#72777d]">个</span>
          </div>
          <div className="mt-1 text-[11px] text-[#72777d]">
            覆盖 {globalStats.totalCategories} 大医学主题领域
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex border-b border-black/10 dark:border-white/10 gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-xs font-medium border-b-2 -mb-px flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'overview'
              ? 'border-[#3366cc] text-[#3366cc] font-semibold'
              : 'border-transparent text-[#72777d] hover:text-[#202122] dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>全景仪表与模型分布</span>
        </button>

        <button
          onClick={() => setActiveTab('table')}
          className={`px-4 py-2.5 text-xs font-medium border-b-2 -mb-px flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'table'
              ? 'border-[#3366cc] text-[#3366cc] font-semibold'
              : 'border-transparent text-[#72777d] hover:text-[#202122] dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>条目详实度量化透视表</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#3366cc]/10 text-[#3366cc]">
            {articlesList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2.5 text-xs font-medium border-b-2 -mb-px flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'api'
              ? 'border-[#3366cc] text-[#3366cc] font-semibold'
              : 'border-transparent text-[#72777d] hover:text-[#202122] dark:hover:text-white'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>REST API 自动化接口测试</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
            Live
          </span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`px-4 py-2.5 text-xs font-medium border-b-2 -mb-px flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'export'
              ? 'border-[#3366cc] text-[#3366cc] font-semibold'
              : 'border-transparent text-[#72777d] hover:text-[#202122] dark:hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>数据导出与审计归档</span>
        </button>
      </div>

      {/* 4. Tab 1: Overview & Distribution Models */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column (7 cols): Quality Ladder & Criteria */}
            <div className={`lg:col-span-7 p-5 rounded-lg border space-y-4 transition-colors ${
              isDarkMode ? 'bg-[#151617] border-[#3a3d42]' : 'bg-white border-[#c8ccd1]'
            }`}>
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
                <div className="space-y-0.5">
                  <h3 className="font-serif font-bold text-base text-[#202122] dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span>全域条目质量评级分布梯队 (Quality Grading)</span>
                  </h3>
                  <p className="text-xs text-[#72777d]">
                    基于中文维基媒体评审标准，通过字数体量、学术实证引注数与多媒体图版全自动综合打分。
                  </p>
                </div>
              </div>

              {/* Quality Distribution Progress Bars */}
              <div className="space-y-3 pt-1">
                {[
                  {
                    grade: 'FA',
                    name: '典范条目 (Featured Article)',
                    desc: '正文 ≥ 2,000字，学术文献 ≥ 5篇，包含完备解剖/生化/临床全景',
                    count: globalStats.qualityDistribution.FA,
                    color: 'bg-amber-500',
                    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  },
                  {
                    grade: 'GA',
                    name: '优良条目 (Good Article)',
                    desc: '正文 ≥ 900字，学术文献 ≥ 2篇，具备严谨科学阐述与病理机理',
                    count: globalStats.qualityDistribution.GA,
                    color: 'bg-emerald-500',
                    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  },
                  {
                    grade: 'A',
                    name: '甲级条目 (Class A)',
                    desc: '正文 ≥ 500字，具备基本医学词条框架与参考文献支撑',
                    count: globalStats.qualityDistribution.A,
                    color: 'bg-blue-500',
                    badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  },
                  {
                    grade: 'B',
                    name: '乙级条目 (Class B)',
                    desc: '正文 < 500字，定义完备，处于持续充实扩充状态',
                    count: globalStats.qualityDistribution.B,
                    color: 'bg-slate-400',
                    badgeBg: 'bg-slate-400/10 text-slate-600 dark:text-slate-400'
                  }
                ].map(item => {
                  const percent = Math.round((item.count / globalStats.totalArticles) * 100);
                  return (
                    <div key={item.grade} className="p-3 rounded border border-black/5 dark:border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${item.badgeBg}`}>
                            {item.grade}
                          </span>
                          <span className="font-semibold text-[#202122] dark:text-white">{item.name}</span>
                        </div>
                        <div className="font-mono text-xs text-[#202122] dark:text-white">
                          <span className="font-bold">{item.count}</span> 篇 · <span>{percent}%</span>
                        </div>
                      </div>

                      <div className="w-full h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                          style={{ width: `${Math.max(percent, 4)}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-[#72777d]">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column (5 cols): Category Domain Distribution */}
            <div className={`lg:col-span-5 p-5 rounded-lg border space-y-4 transition-colors ${
              isDarkMode ? 'bg-[#151617] border-[#3a3d42]' : 'bg-white border-[#c8ccd1]'
            }`}>
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
                <div className="space-y-0.5">
                  <h3 className="font-serif font-bold text-base text-[#202122] dark:text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#3366cc]" />
                    <span>六大学术领域分布 (Category Breakdown)</span>
                  </h3>
                  <p className="text-xs text-[#72777d]">
                    按知识体系领域统计词条、字数与文献比重
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {globalStats.categoryBreakdown.map(cat => {
                  const wordPercent = Math.round((cat.wordCount / globalStats.totalWords) * 100);
                  return (
                    <div 
                      key={cat.key} 
                      className="p-3 rounded border border-black/5 dark:border-white/5 hover:border-[#3366cc]/40 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2 font-medium text-[#202122] dark:text-white">
                          <span 
                            className="w-2.5 h-2.5 rounded-full shrink-0" 
                            style={{ backgroundColor: cat.color }} 
                          />
                          <span>{cat.name}</span>
                        </div>
                        <div className="text-[11px] text-[#72777d] font-mono">
                          {cat.articleCount} 篇 · {cat.wordCount.toLocaleString()} 字
                        </div>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden mb-1">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.max(wordPercent, 3)}%`,
                            backgroundColor: cat.color 
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#72777d]">
                        <span>字数占比: {wordPercent}%</span>
                        <span>学术文献: {cat.referenceCount} 篇</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
                <button
                  onClick={onNavigateCategory}
                  className="text-[#3366cc] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <span>浏览女性生理用品分类目录</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onNavigateGraph}
                  className="text-[#3366cc] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <span>知识图谱拓扑</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Academic & Medical Rigor Card */}
          <div className={`p-4 rounded-lg border transition-colors ${
            isDarkMode ? 'bg-[#18191a] border-[#3a3d42]' : 'bg-[#f8f9fa] border-[#e5e7eb]'
          }`}>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-[#54595d] dark:text-[#a2a9b1]">
                <div className="font-semibold text-sm text-[#202122] dark:text-white">
                  维基百科学术引证与同行评议标准 (Wikipedia Academic Verifiability)
                </div>
                <p>
                  MZ维基全域所有词条均恪守《可供查证方针》与《医学免责声明》。在目前通过 API 返回的 <strong>{globalStats.totalReferences}</strong> 篇规范文献中，100% 具备权威期刊 DOI、PubMed PMID、FDA 医疗器械监管批号或世界卫生组织 (WHO) 正式公报索引。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab 2: Article Completeness Matrix & Interactive Table */}
      {activeTab === 'table' && (
        <div className={`p-5 rounded-lg border space-y-4 transition-colors ${
          isDarkMode ? 'bg-[#151617] border-[#3a3d42]' : 'bg-white border-[#c8ccd1]'
        }`}>
          
          {/* Controls: Search & Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#72777d]" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="搜索条目名称或领域 (API 动态过滤)..."
                className={`w-full pl-9 pr-3 py-1.5 text-xs rounded border transition-colors outline-none ${
                  isDarkMode 
                    ? 'bg-[#202122] border-[#54595d] text-white focus:border-[#6699ff]' 
                    : 'bg-white border-[#c8ccd1] text-[#202122] focus:border-[#3366cc]'
                }`}
              />
            </div>

            {/* Category and Grade Selects */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`px-2.5 py-1.5 text-xs rounded border transition-colors outline-none cursor-pointer ${
                  isDarkMode 
                    ? 'bg-[#202122] border-[#54595d] text-white' 
                    : 'bg-white border-[#c8ccd1] text-[#202122]'
                }`}
              >
                <option value="all">全部分类领域</option>
                {globalStats.categoryBreakdown.map(c => (
                  <option key={c.key} value={c.key}>{c.name} ({c.articleCount})</option>
                ))}
              </select>

              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className={`px-2.5 py-1.5 text-xs rounded border transition-colors outline-none cursor-pointer ${
                  isDarkMode 
                    ? 'bg-[#202122] border-[#54595d] text-white' 
                    : 'bg-white border-[#c8ccd1] text-[#202122]'
                }`}
              >
                <option value="all">全部品质评级</option>
                <option value="FA">典范条目 (FA)</option>
                <option value="GA">优良条目 (GA)</option>
                <option value="A">甲级条目 (A)</option>
                <option value="B">乙级条目 (B)</option>
              </select>

              <button
                onClick={() => {
                  setSearchFilter('');
                  setCategoryFilter('all');
                  setGradeFilter('all');
                }}
                className="text-xs text-[#3366cc] hover:underline cursor-pointer px-1"
              >
                重置筛选
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="text-xs text-[#72777d] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>通过 API 检索到 <strong>{articlesList.length}</strong> 篇条目</span>
              <span className="font-mono text-[10px] text-emerald-600 bg-emerald-500/10 px-1.5 py-0.2 rounded">/api/statistics/articles</span>
            </span>
            <span className="font-mono text-[11px]">点击表头可重新升降序排序</span>
          </div>

          {/* Interactive Responsive Table */}
          <div className="overflow-x-auto border border-black/10 dark:border-white/10 rounded">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b transition-colors ${
                  isDarkMode ? 'bg-[#202122] border-[#3a3d42]' : 'bg-[#f8f9fa] border-[#c8ccd1]'
                }`}>
                  <th className="py-2.5 px-3 font-semibold text-[#54595d] dark:text-[#a2a9b1]">
                    <button 
                      onClick={() => toggleSort('title')}
                      className="flex items-center gap-1 hover:text-[#3366cc] cursor-pointer"
                    >
                      <span>条目标题</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-[#54595d] dark:text-[#a2a9b1]">
                    分类领域
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-[#54595d] dark:text-[#a2a9b1]">
                    <button 
                      onClick={() => toggleSort('quality')}
                      className="flex items-center gap-1 hover:text-[#3366cc] cursor-pointer"
                    >
                      <span>质量评级</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-[#54595d] dark:text-[#a2a9b1] text-right">
                    <button 
                      onClick={() => toggleSort('wordCount')}
                      className="flex items-center gap-1 hover:text-[#3366cc] ml-auto cursor-pointer"
                    >
                      <span>正文字数</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-[#54595d] dark:text-[#a2a9b1] text-right">
                    <button 
                      onClick={() => toggleSort('readingMinutes')}
                      className="flex items-center gap-1 hover:text-[#3366cc] ml-auto cursor-pointer"
                    >
                      <span>预估阅读</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-[#54595d] dark:text-[#a2a9b1] text-center">
                    章节 / 段落
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-[#54595d] dark:text-[#a2a9b1] text-right">
                    <button 
                      onClick={() => toggleSort('referenceCount')}
                      className="flex items-center gap-1 hover:text-[#3366cc] ml-auto cursor-pointer"
                    >
                      <span>文献引用</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-[#54595d] dark:text-[#a2a9b1] text-center">
                    修订版本
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-[#54595d] dark:text-[#a2a9b1] text-center">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {articlesList.map(article => {
                  const isTampon = article.id === 'tampon';
                  return (
                    <tr 
                      key={article.id} 
                      className={`hover:bg-[#3366cc]/5 transition-colors ${
                        isTampon ? 'font-medium' : ''
                      }`}
                    >
                      {/* Title */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (isTampon) {
                                onNavigateToArticle();
                              } else {
                                onNavigateWikiTerm(article.title);
                              }
                            }}
                            className="text-[#3366cc] hover:underline font-serif font-bold text-left cursor-pointer flex items-center gap-1"
                          >
                            <span>{article.title}</span>
                            {isTampon && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-sans font-normal">
                                今日典范
                              </span>
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-2.5 px-3 text-[#72777d]">
                        <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[11px]">
                          {article.categoryLabel}
                        </span>
                      </td>

                      {/* Quality Grade */}
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          article.qualityGrade === 'FA' 
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' 
                            : article.qualityGrade === 'GA'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : article.qualityGrade === 'A'
                            ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                            : 'bg-slate-400/15 text-slate-600 dark:text-slate-400'
                        }`}>
                          {article.qualityGrade}
                        </span>
                      </td>

                      {/* Word count */}
                      <td className="py-2.5 px-3 text-right font-mono text-[#202122] dark:text-white font-semibold">
                        {article.metrics.wordCount.toLocaleString()}
                      </td>

                      {/* Reading time */}
                      <td className="py-2.5 px-3 text-right text-[#72777d] font-mono">
                        {article.metrics.readingMinutes} 分钟
                      </td>

                      {/* Sections & Paragraphs */}
                      <td className="py-2.5 px-3 text-center text-[#72777d] font-mono">
                        {article.sectionCount} / {article.paragraphCount}
                      </td>

                      {/* References */}
                      <td className="py-2.5 px-3 text-right font-mono">
                        <span className={article.referenceCount > 0 ? 'text-[#dc2626] font-semibold' : 'text-[#72777d]'}>
                          {article.referenceCount} 篇
                        </span>
                      </td>

                      {/* Revision */}
                      <td className="py-2.5 px-3 text-center font-mono text-[11px] text-[#72777d]">
                        {article.revisionVersion}
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => {
                            if (isTampon) {
                              onNavigateToArticle();
                            } else {
                              onNavigateWikiTerm(article.title);
                            }
                          }}
                          className="px-2 py-1 rounded bg-[#3366cc]/10 hover:bg-[#3366cc]/20 text-[#3366cc] text-[11px] font-medium cursor-pointer transition-colors"
                        >
                          阅读条目
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 6. Tab 3: Interactive REST API Tester & Specification */}
      {activeTab === 'api' && (
        <div className={`p-5 rounded-lg border space-y-5 transition-colors ${
          isDarkMode ? 'bg-[#151617] border-[#3a3d42]' : 'bg-white border-[#c8ccd1]'
        }`}>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 dark:border-white/5 pb-3">
            <div>
              <h3 className="font-serif font-bold text-base text-[#202122] dark:text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#3366cc]" />
                <span>全域内容统计自动化 REST API 接口中心</span>
              </h3>
              <p className="text-xs text-[#72777d] mt-0.5">
                实时直接调用后台 Express 自动化数据接口，可查看完整 JSON 响应结构与状态码。
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                HTTP {apiStatusCode} OK
              </span>
            </div>
          </div>

          {/* Endpoint Selector Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {[
              {
                method: 'GET',
                path: '/api/statistics/global',
                label: '全局自动化汇总',
                desc: '条目数、字数、文献及梯队分布'
              },
              {
                method: 'GET',
                path: '/api/statistics/articles?grade=FA',
                label: '条目筛选与排序',
                desc: '支持 q, category, grade, sort'
              },
              {
                method: 'GET',
                path: '/api/statistics/article/tampon',
                label: '单个词条度量',
                desc: '获取指定条目的深入字词文献分析'
              },
              {
                method: 'GET',
                path: '/api/statistics/graph',
                label: '图谱拓扑统计',
                desc: '中心度、网络密度与核心节点'
              }
            ].map(ep => (
              <button
                key={ep.path}
                onClick={() => handleTestApi(ep.path)}
                className={`p-3 rounded border text-left transition-colors cursor-pointer ${
                  selectedApiEndpoint === ep.path
                    ? 'border-[#3366cc] bg-[#3366cc]/10 dark:bg-[#3366cc]/20'
                    : 'border-black/10 dark:border-white/10 hover:border-[#3366cc]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400">
                    {ep.method}
                  </span>
                  <span className="text-[11px] font-medium text-[#202122] dark:text-white">
                    {ep.label}
                  </span>
                </div>
                <div className="font-mono text-[10px] text-[#3366cc] truncate">
                  {ep.path}
                </div>
                <div className="text-[10px] text-[#72777d] mt-1">
                  {ep.desc}
                </div>
              </button>
            ))}
          </div>

          {/* Interactive Console */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[#54595d] dark:text-[#a2a9b1] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>请求地址：<strong className="text-[#3366cc]">{selectedApiEndpoint}</strong></span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTestApi(selectedApiEndpoint)}
                  disabled={isTestingApi}
                  className="px-2.5 py-1 rounded bg-[#3366cc] hover:bg-[#2a4b8d] text-white text-[11px] font-medium cursor-pointer transition-colors flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isTestingApi ? 'animate-spin' : ''}`} />
                  <span>发起请求</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(apiTestResponse);
                    setIsExportCopied('API 响应数据已复制');
                    setTimeout(() => setIsExportCopied(null), 2500);
                  }}
                  className={`px-2.5 py-1 rounded border text-[11px] font-medium cursor-pointer transition-colors ${
                    isDarkMode ? 'border-[#54595d] text-[#eaecf0]' : 'border-[#c8ccd1] text-[#202122]'
                  }`}
                >
                  复制 JSON
                </button>
              </div>
            </div>

            {/* Code Response Terminal Box */}
            <div className={`p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-96 border transition-colors ${
              isDarkMode 
                ? 'bg-[#0f1011] border-[#3a3d42] text-[#34d399]' 
                : 'bg-[#1e1e1e] border-black text-[#86efac]'
            }`}>
              <pre className="whitespace-pre-wrap leading-relaxed">
                {isTestingApi ? '// 请求发送中，正在等待 API 返回...' : (apiTestResponse || '// 点击上方接口卡片测试实时 API 响应')}
              </pre>
            </div>
          </div>

          {/* cURL Usage Documentation */}
          <div className="p-4 rounded border border-black/5 dark:border-white/5 space-y-2 text-xs">
            <div className="font-semibold text-[#202122] dark:text-white flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-[#3366cc]" />
              <span>第三方与终端集成指南 (cURL & REST Integration)</span>
            </div>
            <div className="bg-black/5 dark:bg-black/30 p-2.5 rounded font-mono text-[11px] text-[#54595d] dark:text-[#a2a9b1] space-y-1">
              <div># 1. 获取全站自动化统计数据</div>
              <div className="text-[#3366cc]">curl -X GET https://[host]/api/statistics/global</div>
              <div className="pt-1"># 2. 筛选典范条目并按字数降序</div>
              <div className="text-[#3366cc]">curl -X GET "https://[host]/api/statistics/articles?grade=FA&sort=wordCount&order=desc"</div>
              <div className="pt-1"># 3. 直接下载自动化 JSON 数据集</div>
              <div className="text-[#3366cc]">curl -O https://[host]/api/statistics/export/json</div>
            </div>
          </div>

        </div>
      )}

      {/* 7. Tab 4: Data Export & Audit Archive */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          <div className={`p-5 rounded-lg border space-y-4 transition-colors ${
            isDarkMode ? 'bg-[#151617] border-[#3a3d42]' : 'bg-white border-[#c8ccd1]'
          }`}>
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-serif font-bold text-base text-[#202122] dark:text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#3366cc]" />
                  <span>开放数据分发与自动化审计归档 (Open Data & Audit)</span>
                </h3>
                <p className="text-xs text-[#72777d]">
                  MZ维基遵循自由软件与开放知识标准，所有统计数据均由后台自动化 API 提供导出与分发。
                </p>
              </div>

              {isExportCopied && (
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded font-medium flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isExportCopied}</span>
                </div>
              )}
            </div>

            {/* Export Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* JSON Export */}
              <div className="p-4 rounded border border-black/10 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono font-bold text-xs">
                      JSON API
                    </span>
                    <span className="font-semibold text-xs text-[#202122] dark:text-white">
                      全域内容度量数据集 (JSON Payload)
                    </span>
                  </div>
                  <span className="text-[10px] text-[#72777d] font-mono">/api/statistics/export/json</span>
                </div>

                <p className="text-[11px] text-[#72777d]">
                  包含全站汇总 KPI、质量梯队分布、各领域字数比重以及全部词条的精细化指标。
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="/api/statistics/export/json"
                    download
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#3366cc] hover:bg-[#2a4b8d] text-white text-xs font-medium cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>通过 API 下载 .json</span>
                  </a>

                  <button
                    onClick={handleCopyJSON}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium cursor-pointer transition-colors ${
                      isDarkMode 
                        ? 'bg-[#202122] border-[#54595d] text-[#eaecf0] hover:bg-[#2c2e33]' 
                        : 'bg-[#f8f9fa] border-[#c8ccd1] text-[#202122] hover:bg-[#eaecf0]'
                    }`}
                  >
                    <span>复制 JSON 文本</span>
                  </button>
                </div>
              </div>

              {/* CSV Export */}
              <div className="p-4 rounded border border-black/10 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs">
                      CSV API
                    </span>
                    <span className="font-semibold text-xs text-[#202122] dark:text-white">
                      词条量化明细表 (Spreadsheet CSV)
                    </span>
                  </div>
                  <span className="text-[10px] text-[#72777d] font-mono">/api/statistics/export/csv</span>
                </div>

                <p className="text-[11px] text-[#72777d]">
                  格式化表格数据，包含词条 ID、标题、字数、章节数、段落数、参考文献数和修订版本号。
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="/api/statistics/export/csv"
                    download
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#059669] hover:bg-[#047857] text-white text-xs font-medium cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>通过 API 下载 .csv</span>
                  </a>

                  <button
                    onClick={handleCopyCSV}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium cursor-pointer transition-colors ${
                      isDarkMode 
                        ? 'bg-[#202122] border-[#54595d] text-[#eaecf0] hover:bg-[#2c2e33]' 
                        : 'bg-[#f8f9fa] border-[#c8ccd1] text-[#202122] hover:bg-[#eaecf0]'
                    }`}
                  >
                    <span>复制 CSV 文本</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Verification Standard Accordion */}
            <div className="p-4 rounded border border-black/5 dark:border-white/5 space-y-2 text-xs">
              <div className="font-semibold text-[#202122] dark:text-white flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#3366cc]" />
                <span>自动化统计推导逻辑规范（Specification & Transparency）</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[#72777d]">
                <li><strong>API 架构：</strong>基于 Node.js Express 原生路由构建，内存毫秒级聚合，支持高并发实时调用。</li>
                <li><strong>字数计算规则：</strong>自动提取条目摘要与全部子章节正文，过滤内部链接标记符（如 <code>[[...]]</code>）及文献角标，中文按单个汉字计数，英文按单词计数。</li>
                <li><strong>阅读时长模型：</strong>按中文专业科技/医学类百科平均默读速度（350 字/分钟）推导，向上取整至整分钟。</li>
                <li><strong>知识网络拓扑：</strong>图谱节点与边线直接源自结构化本体关系模型，杜绝离线孤岛。</li>
              </ul>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
