import { getWikiEntryByTitle } from '../data/wikiEntriesData';

export type AppPage = 'home' | 'article' | 'entry' | 'privacy' | 'disclaimer' | 'conduct' | 'category' | 'graph' | 'tags' | 'stats' | '404';

export const ARTICLE_TITLE = '卫生棉条';
export const CATEGORY_TITLE = 'Category:女性生理用品';
export const GRAPH_TITLE = 'Special:知识图谱';
export const TAGS_TITLE = 'Special:标签';
export const STATS_TITLE = 'Special:内容统计';

export const POLICY_PATHS: Record<'privacy' | 'disclaimer' | 'conduct', string> = {
  privacy: 'Wikipedia:隐私政策',
  disclaimer: 'Wikipedia:免责声明',
  conduct: 'Wikipedia:全域行为准则'
};

/**
 * Returns the standard Wikipedia URL path:
 * e.g. /wiki/卫生棉条#usage-guide, /wiki/Wikipedia:首页, /wiki/Category:女性生理用品, /wiki/Special:知识图谱, /wiki/Special:标签, /wiki/Special:统计
 */
export function getWikiPath(page: AppPage, sectionId?: string): string {
  switch (page) {
    case 'home':
      return '/wiki/Wikipedia:首页';
    case 'article':
      return `/wiki/${encodeURIComponent(ARTICLE_TITLE)}${sectionId && sectionId !== 'top' ? `#${sectionId}` : ''}`;
    case 'entry':
      return `/wiki/${encodeURIComponent(sectionId || '卫生棉条')}`;
    case 'category':
      return `/wiki/${encodeURIComponent(CATEGORY_TITLE)}${sectionId && sectionId !== 'top' ? `#${sectionId}` : ''}`;
    case 'graph':
      return `/wiki/${encodeURIComponent(GRAPH_TITLE)}`;
    case 'tags':
      return `/wiki/${encodeURIComponent(TAGS_TITLE)}${sectionId && sectionId !== 'top' ? `#${sectionId}` : ''}`;
    case 'stats':
      return `/wiki/${encodeURIComponent(STATS_TITLE)}`;
    case 'privacy':
      return `/wiki/${encodeURIComponent(POLICY_PATHS.privacy)}${sectionId && sectionId !== 'top' ? `#${sectionId}` : ''}`;
    case 'disclaimer':
      return `/wiki/${encodeURIComponent(POLICY_PATHS.disclaimer)}${sectionId && sectionId !== 'top' ? `#${sectionId}` : ''}`;
    case 'conduct':
      return `/wiki/${encodeURIComponent(POLICY_PATHS.conduct)}${sectionId && sectionId !== 'top' ? `#${sectionId}` : ''}`;
    case '404':
      return '/wiki/Special:404';
  }
}

/**
 * Parses current window.location into AppPage and target section ID
 */
export function parseWikiLocation(): { page: AppPage; sectionId: string; missingPath?: string } {
  let decodedPath = '';
  try {
    decodedPath = decodeURIComponent(window.location.pathname);
  } catch {
    decodedPath = window.location.pathname;
  }

  let decodedHash = '';
  try {
    decodedHash = decodeURIComponent(window.location.hash.replace('#', ''));
  } catch {
    decodedHash = window.location.hash.replace('#', '');
  }

  // 1. Direct match on pathname
  if (
    decodedPath.includes('女性生理用品') ||
    decodedPath.includes('Category:') ||
    decodedPath.includes('/category')
  ) {
    return { page: 'category', sectionId: decodedHash || 'top' };
  }

  if (
    decodedPath.includes('/wiki/卫生棉条') ||
    decodedPath.includes('/wiki/Tampon') ||
    decodedPath.includes('/wiki/article')
  ) {
    return { page: 'article', sectionId: decodedHash || 'top' };
  }

  if (
    decodedPath.includes('知识图谱') ||
    decodedPath.includes('KnowledgeGraph') ||
    decodedPath.includes('/graph') ||
    decodedHash === 'graph'
  ) {
    return { page: 'graph', sectionId: 'top' };
  }

  if (
    decodedPath.includes('标签') ||
    decodedPath.includes('Special:Tags') ||
    decodedPath.includes('/tags') ||
    decodedHash === 'tags'
  ) {
    return { page: 'tags', sectionId: decodedHash || 'top' };
  }

  if (
    decodedPath.includes('统计') ||
    decodedPath.includes('Statistics') ||
    decodedPath.includes('Stats') ||
    decodedPath.includes('/stats') ||
    decodedHash === 'stats'
  ) {
    return { page: 'stats', sectionId: 'top' };
  }

  if (decodedPath.includes('隐私政策') || decodedPath.includes('/privacy')) {
    return { page: 'privacy', sectionId: decodedHash || 'top' };
  }

  if (decodedPath.includes('免责声明') || decodedPath.includes('/disclaimer')) {
    return { page: 'disclaimer', sectionId: decodedHash || 'top' };
  }

  if (decodedPath.includes('全域行为准则') || decodedPath.includes('/conduct')) {
    return { page: 'conduct', sectionId: decodedHash || 'top' };
  }

  if (decodedPath.includes('Wikipedia:首页') || decodedPath === '/' || decodedPath === '') {
    return { page: 'home', sectionId: 'top' };
  }

  // 2. Compatibility fallback for old hash-based URLs (e.g. #article, #usage-guide, #category)
  if (decodedHash === 'category') {
    return { page: 'category', sectionId: 'top' };
  }

  if (decodedHash === 'article' || [
    'history',
    'structure-and-types',
    'usage-guide',
    'safety-and-tss',
    'common-myths',
    'regulations',
    'society-and-culture',
    'references'
  ].includes(decodedHash)) {
    return { page: 'article', sectionId: decodedHash === 'article' ? 'top' : decodedHash };
  }

  if (['privacy', 'disclaimer', 'conduct'].includes(decodedHash)) {
    return { page: decodedHash as AppPage, sectionId: 'top' };
  }

  // 3. If URL starts with /wiki/, check if matching entry exists
  if (decodedPath.startsWith('/wiki/')) {
    const rawTerm = decodedPath.replace('/wiki/', '').trim();
    if (getWikiEntryByTitle(rawTerm)) {
      return { page: 'entry', sectionId: rawTerm };
    }
    return { page: '404', sectionId: 'top', missingPath: decodedPath };
  }

  if (decodedPath.includes('404') || decodedHash === '404') {
    return { page: '404', sectionId: 'top', missingPath: decodedPath };
  }

  // 4. Main page / Home portal
  return { page: 'home', sectionId: 'top' };
}
