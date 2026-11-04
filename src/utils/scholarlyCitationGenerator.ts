/**
 * Automated Scholarly Citation Generator for MZ Wiki
 * Formats citations adhering strictly to:
 * - GB/T 7714-2015 (China National Standard - Electronic Bulletins [EB/OL])
 * - APA 7th Edition
 * - MLA 9th Edition
 * - Chicago 17th Edition
 * - Harvard Reference Style
 * - BibTeX (LaTeX / Overleaf standard)
 */

export interface ArticleCitationMeta {
  id: string;
  title: string;
  enTitle?: string;
  url: string;
  lastModifiedDate: string;    // e.g. "2026-09-25"
  revisionVersion: string;     // e.g. "r1094821"
  author: string;              // e.g. "MZ维基编修委员会"
  publisher: string;           // e.g. "MZ维基，自由的百科全书"
}

export type CitationStyleKey = 'gbt7714' | 'apa' | 'mla' | 'chicago' | 'harvard' | 'bibtex';

export interface FormattedCitation {
  key: CitationStyleKey;
  label: string;
  standardName: string;
  text: string;
  fileExtension?: string;
  mimeType?: string;
}

/**
 * Formats current date for citation retrieval stamps
 */
export function getRetrievalDate(): {
  iso: string;
  chinese: string;
  english: string;
  year: string;
  month: string;
  day: string;
} {
  const d = new Date();
  const year = d.getFullYear().toString();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const englishMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return {
    iso: `${year}-${month}-${day}`,
    chinese: `${year}年${parseInt(month)}月${parseInt(day)}日`,
    english: `${englishMonths[d.getMonth()]} ${parseInt(day)}, ${year}`,
    year,
    month,
    day
  };
}

/**
 * Generates scholarly citations for an article in all major formats
 */
export function generateAllCitations(meta: ArticleCitationMeta): FormattedCitation[] {
  const retrieval = getRetrievalDate();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://mz-wiki.app';
  const fullUrl = meta.url.startsWith('http') ? meta.url : `${origin}${meta.url}`;
  const encodedUrl = encodeURI(fullUrl);

  // 1. GB/T 7714-2015 (信息与文献 参考文献著录规则 [EB/OL])
  // 著录格式：主要责任者. 题名: 其他题名信息[文献类型标志/文献载体标志]. 出版地: 出版者, 出版年: 引文页码[引用日期]. 获取和访问路径.
  const gbt7714 = `${meta.author}. ${meta.title}[EB/OL]. ${meta.publisher}, ${meta.lastModifiedDate}/${retrieval.iso}. ${fullUrl}.`;

  // 2. APA 7th Edition
  // Format: Author. (Year, Month Day). Title. Site Name. Retrieved Month Day, Year, from URL
  const apa = `${meta.author}. (${meta.lastModifiedDate.slice(0, 4)}). ${meta.title}. In ${meta.publisher}. Retrieved ${retrieval.english}, from ${fullUrl}`;

  // 3. MLA 9th Edition
  // Format: "Title." Site Name, Publisher, Day Month Year, URL. Accessed Day Month Year.
  const mla = `"${meta.title}." ${meta.publisher}, ${meta.lastModifiedDate}, ${fullUrl.replace(/^https?:\/\//, '')}. 访问于 ${retrieval.chinese}.`;

  // 4. Chicago 17th Edition (Author-Date)
  const chicago = `${meta.author}. ${meta.lastModifiedDate.slice(0, 4)}. "${meta.title}." ${meta.publisher}. 最近修订于 ${meta.lastModifiedDate}. ${fullUrl}.`;

  // 5. Harvard Reference Format
  const harvard = `${meta.author} (${meta.lastModifiedDate.slice(0, 4)}) '${meta.title}', ${meta.publisher}. 可访问于: ${fullUrl} (引用日期: ${retrieval.chinese}).`;

  // 6. BibTeX for LaTeX / Overleaf
  const bibtexKey = `mzwiki_${meta.id}_${meta.lastModifiedDate.slice(0, 4)}`;
  const bibtex = `@misc{${bibtexKey},
  author       = {{${meta.author}}},
  title        = {{${meta.title}}},
  howpublished = {\\url{${encodedUrl}}},
  year         = {${meta.lastModifiedDate.slice(0, 4)}},
  note         = {[在线百科; 修订版本号 ${meta.revisionVersion}; 访问于 ${retrieval.iso}]}
}`;

  return [
    {
      key: 'gbt7714',
      label: 'GB/T 7714-2015',
      standardName: '中国国家标准文献著录格式（电子文献）',
      text: gbt7714,
      fileExtension: 'txt'
    },
    {
      key: 'apa',
      label: 'APA 7th',
      standardName: '美国心理学会学术引用格式 (7th Edition)',
      text: apa,
      fileExtension: 'txt'
    },
    {
      key: 'mla',
      label: 'MLA 9th',
      standardName: '美国现代语言学会文献引用格式 (9th Edition)',
      text: mla,
      fileExtension: 'txt'
    },
    {
      key: 'chicago',
      label: 'Chicago 17th',
      standardName: '芝加哥论文引注格式 (Author-Date)',
      text: chicago,
      fileExtension: 'txt'
    },
    {
      key: 'harvard',
      label: 'Harvard',
      standardName: '哈佛文献体系引用格式',
      text: harvard,
      fileExtension: 'txt'
    },
    {
      key: 'bibtex',
      label: 'BibTeX (LaTeX)',
      standardName: 'LaTeX / Overleaf 结构化条目代码',
      text: bibtex,
      fileExtension: 'bib',
      mimeType: 'application/x-bibtex'
    }
  ];
}
