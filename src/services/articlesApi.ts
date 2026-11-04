import { WikiEntry } from '../data/wikiEntriesData';

export interface FormalArticleApiRecord {
  id: string;
  orderIndex: number;
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
  sourceUrl: string;
  isBuiltIn: boolean;
  fetchedAt?: string;
  entryPayload?: WikiEntry;
}

export interface FormalArticlesListResponse {
  status: 'success' | 'error';
  code: number;
  endpoint: string;
  totalFormalArticles: number;
  fetchedAt: string;
  data: FormalArticleApiRecord[];
}

export interface FetchWikipediaArticleResponse {
  status: 'success' | 'error';
  code: number;
  message: string;
  source: 'zh.wikipedia.org_live_api' | 'encyclopedia_structured_api';
  article: FormalArticleApiRecord;
  totalFormalArticles: number;
  allArticles: FormalArticleApiRecord[];
}

/**
 * GET /api/articles
 * 从后端 API 获取全站当前所有正式词条列表（默认包含 #1 卫生棉条、#2 卫生棉（卫生巾），以及后续通过 API 新增的 #3、#4... 词条）
 */
export async function fetchFormalArticlesApi(): Promise<FormalArticlesListResponse> {
  const res = await fetch('/api/articles', {
    method: 'GET',
    headers: { Accept: 'application/json' }
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: Failed to fetch /api/articles`);
  }
  return res.json();
}

/**
 * POST /api/articles/fetch-wikipedia
 * 通过后端 API 实时从中文维基百科（或输入词条名/URL）获取数据、解析章节并注册为全站第 #3、#4... 篇正式词条
 */
export async function importWikipediaArticleViaApi(
  queryOrUrl: string
): Promise<FetchWikipediaArticleResponse> {
  const res = await fetch('/api/articles/fetch-wikipedia', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ queryOrUrl })
  });
  const json = await res.json();
  if (!res.ok || json.status === 'error') {
    throw new Error(json.message || `API 请求失败 (${res.status})`);
  }
  return json;
}

/**
 * DELETE /api/articles/:id
 * 移除通过 API 动态新增的词条（内置的 #1 卫生棉条 与 #2 卫生棉（卫生巾）受保护不可删除）
 */
export async function deleteDynamicArticleViaApi(
  articleId: string
): Promise<FormalArticlesListResponse> {
  const res = await fetch(`/api/articles/${encodeURIComponent(articleId)}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' }
  });
  const json = await res.json();
  if (!res.ok || json.status === 'error') {
    throw new Error(json.message || `删除词条失败 (${res.status})`);
  }
  return json;
}
