import {
  GlobalContentStatistics,
  ArticleContentStats,
  getGlobalContentStatistics,
  getAllArticlesContentStats,
  getFeaturedTamponStats,
  getWikiEntryStats
} from '../utils/contentStatisticsAutomation';
import { ReadingMetrics, calculateReadingMetrics } from '../utils/headerAutomation';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  code: number;
  data: T;
  source?: string;
  calculatedAt?: string;
  computationLatencyMs?: number;
  message?: string;
  total?: number;
  filtered?: number;
}

export interface GraphTopologyStatistics {
  totalNodes: number;
  totalEdges: number;
  averageDegree: number;
  centralHubNodes: { id: string; label: string; group: string; degree: number }[];
  density: number;
}

export interface RecalculateResult {
  status: string;
  code: number;
  message: string;
  latencyMs: number;
  recalculatedAt: string;
  summary: {
    totalArticles: number;
    totalWords: number;
    totalReferences: number;
    articlesProcessed: number;
  };
}

/**
 * Fetches 100% automated derived global encyclopedia statistics from REST API
 */
export async function fetchGlobalStatisticsApi(): Promise<{
  data: GlobalContentStatistics;
  isLiveApi: boolean;
  latencyMs: number;
  endpoint: string;
}> {
  const t0 = performance.now();
  const endpoint = '/api/statistics/global';

  try {
    const res = await fetch(endpoint, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache'
    });

    if (res.ok) {
      const json: ApiResponse<GlobalContentStatistics> = await res.json();
      const latencyMs = parseFloat((performance.now() - t0).toFixed(2));
      return {
        data: json.data,
        isLiveApi: true,
        latencyMs: json.computationLatencyMs || latencyMs,
        endpoint
      };
    }
  } catch (err) {
    console.warn('API /api/statistics/global not reachable, falling back to isomorphic derivation:', err);
  }

  // Graceful fallback to client calculation
  const fallbackData = getGlobalContentStatistics();
  const latencyMs = parseFloat((performance.now() - t0).toFixed(2));
  return {
    data: fallbackData,
    isLiveApi: false,
    latencyMs,
    endpoint
  };
}

/**
 * Fetches all article statistics with search, filtering, and sorting from REST API
 */
export async function fetchArticlesStatisticsApi(params?: {
  q?: string;
  category?: string;
  grade?: string;
  sort?: string;
  order?: string;
}): Promise<{
  data: ArticleContentStats[];
  total: number;
  filtered: number;
  isLiveApi: boolean;
  latencyMs: number;
  endpoint: string;
}> {
  const t0 = performance.now();
  const query = new URLSearchParams();
  if (params?.q) query.set('q', params.q);
  if (params?.category && params.category !== 'all') query.set('category', params.category);
  if (params?.grade && params.grade !== 'all') query.set('grade', params.grade);
  if (params?.sort) query.set('sort', params.sort);
  if (params?.order) query.set('order', params.order);

  const endpoint = `/api/statistics/articles${query.toString() ? `?${query.toString()}` : ''}`;

  try {
    const res = await fetch(endpoint, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache'
    });

    if (res.ok) {
      const json: ApiResponse<ArticleContentStats[]> = await res.json();
      const latencyMs = parseFloat((performance.now() - t0).toFixed(2));
      return {
        data: json.data,
        total: json.total || json.data.length,
        filtered: json.filtered || json.data.length,
        isLiveApi: true,
        latencyMs: json.computationLatencyMs || latencyMs,
        endpoint
      };
    }
  } catch (err) {
    console.warn('API /api/statistics/articles error, using isomorphic filter:', err);
  }

  // Fallback to client computation
  let list = getAllArticlesContentStats();
  const total = list.length;
  if (params?.q) {
    const q = params.q.toLowerCase();
    list = list.filter(a => a.title.toLowerCase().includes(q) || a.categoryLabel.toLowerCase().includes(q));
  }
  if (params?.category && params.category !== 'all') {
    list = list.filter(a => a.category === params.category);
  }
  if (params?.grade && params.grade !== 'all') {
    list = list.filter(a => a.qualityGrade === params.grade);
  }

  const latencyMs = parseFloat((performance.now() - t0).toFixed(2));
  return {
    data: list,
    total,
    filtered: list.length,
    isLiveApi: false,
    latencyMs,
    endpoint
  };
}

/**
 * Fetches single article automated statistics from REST API
 */
export async function fetchArticleStatisticsByIdApi(idOrTitle: string): Promise<{
  data: ArticleContentStats;
  isLiveApi: boolean;
}> {
  const endpoint = `/api/statistics/article/${encodeURIComponent(idOrTitle)}`;
  try {
    const res = await fetch(endpoint, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const json: ApiResponse<ArticleContentStats> = await res.json();
      return { data: json.data, isLiveApi: true };
    }
  } catch (err) {
    console.warn(`API ${endpoint} error, falling back to local:`, err);
  }

  // Fallback
  if (idOrTitle === 'tampon' || idOrTitle === '卫生棉条') {
    return { data: getFeaturedTamponStats(), isLiveApi: false };
  }
  const all = getAllArticlesContentStats();
  const found = all.find(a => a.id === idOrTitle || a.title === idOrTitle) || all[0];
  return { data: found, isLiveApi: false };
}

/**
 * Triggers on-demand live re-computation via POST /api/statistics/recalculate
 */
export async function recalculateStatisticsApi(): Promise<RecalculateResult> {
  const t0 = performance.now();
  try {
    const res = await fetch('/api/statistics/recalculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API recalculate failed, using local:', err);
  }

  const stats = getGlobalContentStatistics();
  const latencyMs = parseFloat((performance.now() - t0).toFixed(3));
  return {
    status: 'success',
    code: 200,
    message: 'Local recalculate completed',
    latencyMs,
    recalculatedAt: new Date().toISOString(),
    summary: {
      totalArticles: stats.totalArticles,
      totalWords: stats.totalWords,
      totalReferences: stats.totalReferences,
      articlesProcessed: stats.totalArticles
    }
  };
}

/**
 * Fetches knowledge graph topology analytics from API
 */
export async function fetchGraphTopologyStatisticsApi(): Promise<GraphTopologyStatistics | null> {
  try {
    const res = await fetch('/api/statistics/graph', {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {
    console.warn('API /api/statistics/graph error:', err);
  }
  return null;
}

/**
 * Calculate reading metrics via API endpoint
 */
export async function calculateReadingMetricsApi(text: string): Promise<ReadingMetrics> {
  try {
    const res = await fetch('/api/statistics/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {
    console.warn('API /api/statistics/metrics error, using client calculation:', err);
  }
  return calculateReadingMetrics(text);
}

/**
 * Direct API download endpoints
 */
export const STATS_API_ENDPOINTS = {
  GLOBAL: '/api/statistics/global',
  ARTICLES: '/api/statistics/articles',
  ARTICLE_BY_ID: (id: string) => `/api/statistics/article/${encodeURIComponent(id)}`,
  GRAPH: '/api/statistics/graph',
  RECALCULATE: '/api/statistics/recalculate',
  METRICS: '/api/statistics/metrics',
  EXPORT_JSON: '/api/statistics/export/json',
  EXPORT_CSV: '/api/statistics/export/csv'
} as const;
