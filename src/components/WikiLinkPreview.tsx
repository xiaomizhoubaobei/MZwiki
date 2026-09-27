import React, { useState, useMemo } from 'react';
import { Settings, ExternalLink, BookOpen } from 'lucide-react';
import { WIKILINK_DATA, getWikiLinkTargetInfo } from '../data/articleData';
import { WIKI_ENTRIES, getWikiEntryByTitle } from '../data/wikiEntriesData';
import { GRAPH_NODES } from '../data/knowledgeGraphData';

export interface WikiLinkMatch {
  raw: string;
  target: string;
  label: string;
  section?: string;
  index: number;
}

export interface ScanWikiOptions {
  onNavigateWikiTerm?: (term: string) => void;
  excludeTerm?: string;
  maxOccurrencesPerTerm?: number;
  highlightClass?: string;
  isDarkMode?: boolean;
}

/**
 * Regex for MediaWiki link syntax:
 * Matches [[Target]], [[Target|Display]], or [[Target#Section|Display]]
 */
export const WIKILINK_SYNTAX_REGEX = /\[\[([^|\]\n#]+)(?:#([^|\]\n]+))?(?:\|([^\]\n]+))?\]\]/g;

/**
 * Builds a dynamic, cached dictionary of all registered Wikipedia terms and aliases,
 * sorted by length descending so longer composite terms (e.g. "中毒性休克综合征毒素-1")
 * take precedence over shorter substrings (e.g. "中毒性休克综合征").
 */
let cachedDynamicTermDict: { term: string; canonical: string }[] | null = null;

export function getDynamicWikiTermDictionary(): { term: string; canonical: string }[] {
  if (cachedDynamicTermDict) {
    return cachedDynamicTermDict;
  }

  const map = new Map<string, string>();

  // 1. From encyclopedic articles
  WIKI_ENTRIES.forEach(entry => {
    map.set(entry.title, entry.title);
    entry.aliases.forEach(alias => {
      const cleanAlias = alias.replace(/[（(].*?[）)]/g, '').trim();
      if (cleanAlias.length >= 2 && !map.has(cleanAlias)) {
        map.set(cleanAlias, entry.title);
      }
    });
  });

  // 2. From knowledge graph nodes
  GRAPH_NODES.forEach(node => {
    if (!map.has(node.name)) {
      map.set(node.name, node.name);
    }
  });

  // 3. From article link metadata
  Object.keys(WIKILINK_DATA).forEach(key => {
    const clean = key.replace(/[（(].*?[）)]/g, '').trim();
    if (!map.has(clean)) {
      map.set(clean, clean);
    }
  });

  const list = Array.from(map.entries()).map(([term, canonical]) => ({
    term,
    canonical
  }));

  // Sort descending by length
  list.sort((a, b) => b.term.length - a.term.length);
  cachedDynamicTermDict = list;
  return list;
}

/**
 * Extracts all explicit [[wikilinks]] from a given text using regular expressions.
 */
export function extractWikiLinksFromText(text: string): WikiLinkMatch[] {
  if (!text) return [];
  const matches: WikiLinkMatch[] = [];
  let match: RegExpExecArray | null;
  const regex = new RegExp(WIKILINK_SYNTAX_REGEX);

  while ((match = regex.exec(text)) !== null) {
    const raw = match[0];
    const target = match[1]?.trim() || '';
    const section = match[2]?.trim();
    const label = match[3]?.trim() || target;

    matches.push({
      raw,
      target,
      label,
      section,
      index: match.index
    });
  }

  return matches;
}

/**
 * Powerful WikiLink Scanner and Transformer:
 * 1. Uses RegExp to parse explicit [[Target|Label]] wikilinks.
 * 2. Uses dynamically compiled RegExp to detect known encyclopedic entities in plain text.
 * 3. Transforms matches into clickable elements connected to handleNavigateWikiTerm.
 */
export function scanAndTransformWikiLinks(
  text: string,
  options: ScanWikiOptions = {}
): React.ReactNode[] {
  if (!text) return [];

  const {
    onNavigateWikiTerm,
    excludeTerm = '',
    maxOccurrencesPerTerm = 2,
    highlightClass = 'text-[#3366cc] dark:text-[#6699ff] hover:underline font-medium cursor-pointer transition-colors decoration-1 underline-offset-2'
  } = options;

  type InternalToken =
    | { type: 'text'; text: string }
    | { type: 'link'; target: string; label: string; key: string };

  let tokens: InternalToken[] = [{ type: 'text', text }];
  let keyCounter = 0;

  // Pass 1: Parse explicit [[MediaWiki]] syntax via RegExp
  const syntaxRegex = new RegExp(WIKILINK_SYNTAX_REGEX);
  let pass1Tokens: InternalToken[] = [];

  for (const token of tokens) {
    if (token.type !== 'text') {
      pass1Tokens.push(token);
      continue;
    }

    let lastIndex = 0;
    let match: RegExpExecArray | null;
    syntaxRegex.lastIndex = 0;

    while ((match = syntaxRegex.exec(token.text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        pass1Tokens.push({
          type: 'text',
          text: token.text.slice(lastIndex, matchIndex)
        });
      }

      const target = match[1]?.trim() || '';
      const label = match[3]?.trim() || target;

      pass1Tokens.push({
        type: 'link',
        target,
        label,
        key: `explicit-link-${keyCounter++}`
      });

      lastIndex = matchIndex + match[0].length;
    }

    if (lastIndex < token.text.length) {
      pass1Tokens.push({
        type: 'text',
        text: token.text.slice(lastIndex)
      });
    }
  }

  tokens = pass1Tokens;

  // Pass 2: Parse plain text for registered encyclopedic entities using dynamic RegExp
  const dictionary = getDynamicWikiTermDictionary().filter(item => {
    if (!item.term || item.term.length < 2) return false;
    if (excludeTerm && (item.term === excludeTerm || item.canonical === excludeTerm)) {
      return false;
    }
    return true;
  });

  if (dictionary.length > 0) {
    const escapedTerms = dictionary.map(d =>
      d.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    const dynamicEntityRegex = new RegExp(`(${escapedTerms.join('|')})`, 'g');
    const termCountMap = new Map<string, number>();

    let pass2Tokens: InternalToken[] = [];

    for (const token of tokens) {
      if (token.type !== 'text') {
        pass2Tokens.push(token);
        continue;
      }

      let lastIndex = 0;
      let match: RegExpExecArray | null;
      dynamicEntityRegex.lastIndex = 0;

      while ((match = dynamicEntityRegex.exec(token.text)) !== null) {
        const matchedStr = match[1];
        const matchIndex = match.index;
        const currentCount = termCountMap.get(matchedStr) || 0;

        if (currentCount < maxOccurrencesPerTerm) {
          if (matchIndex > lastIndex) {
            pass2Tokens.push({
              type: 'text',
              text: token.text.slice(lastIndex, matchIndex)
            });
          }

          const matchedDictEntry = dictionary.find(d => d.term === matchedStr);
          const canonicalTarget = matchedDictEntry ? matchedDictEntry.canonical : matchedStr;

          pass2Tokens.push({
            type: 'link',
            target: canonicalTarget,
            label: matchedStr,
            key: `auto-entity-${keyCounter++}`
          });

          termCountMap.set(matchedStr, currentCount + 1);
          lastIndex = matchIndex + matchedStr.length;
        }
      }

      if (lastIndex < token.text.length) {
        pass2Tokens.push({
          type: 'text',
          text: token.text.slice(lastIndex)
        });
      }
    }

    tokens = pass2Tokens;
  }

  // Pass 3: Convert tokens into React VNodes with click handlers
  return tokens.map((token, index) => {
    if (token.type === 'text') {
      return <React.Fragment key={`text-node-${index}`}>{token.text}</React.Fragment>;
    }

    return (
      <span
        key={token.key}
        className={highlightClass}
        title={`点击查看维基条目: ${token.target}`}
        onClick={(e) => {
          e.stopPropagation();
          if (onNavigateWikiTerm) {
            onNavigateWikiTerm(token.target);
          }
        }}
      >
        {token.label}
      </span>
    );
  });
}

/**
 * Standalone WikiLink text parser component for convenient inclusion anywhere.
 */
export const WikiLinkScannerText: React.FC<{
  children: string;
  onNavigateWikiTerm?: (term: string) => void;
  excludeTerm?: string;
  maxOccurrencesPerTerm?: number;
  highlightClass?: string;
  className?: string;
}> = ({
  children,
  onNavigateWikiTerm,
  excludeTerm,
  maxOccurrencesPerTerm = 2,
  highlightClass,
  className
}) => {
  const transformed = useMemo(() => {
    return scanAndTransformWikiLinks(children, {
      onNavigateWikiTerm,
      excludeTerm,
      maxOccurrencesPerTerm,
      highlightClass
    });
  }, [children, onNavigateWikiTerm, excludeTerm, maxOccurrencesPerTerm, highlightClass]);

  return <span className={className}>{transformed}</span>;
};

export interface WikiLinkPreviewProps {
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
      height: number 
    };
  };
  onClose: () => void;
  onNavigateSection?: (sectionId: string) => void;
  onNavigateWiki?: (term: string) => void;
  onNavigateWikiTerm?: (term: string) => void;
  onNavigate?: () => void;
  isDarkMode: boolean;
}

export const WikiLinkPreview: React.FC<WikiLinkPreviewProps> = ({
  term,
  position,
  onClose,
  onNavigateSection,
  onNavigateWiki,
  onNavigateWikiTerm,
  onNavigate,
  isDarkMode
}) => {
  const [imageError, setImageError] = useState(false);

  // Unified callback prioritizing onNavigateWikiTerm or onNavigateWiki
  const handleNavigateWikiTerm = onNavigateWikiTerm || onNavigateWiki;

  // Retrieve wiki data from wiki entries first, then article WIKILINK_DATA or fallback
  const cleanKey = term.trim();
  const entry = getWikiEntryByTitle(cleanKey);
  const data = entry ? {
    title: entry.title,
    boldTerm: entry.title,
    category: entry.categoryLabel,
    summary: entry.summary,
    imageUrl: entry.imageUrl,
    iconType: (entry.category === 'anatomy' ? 'anatomy' : entry.category === 'medical' ? 'medical' : 'product') as 'anatomy' | 'medical' | 'product'
  } : (
    WIKILINK_DATA[cleanKey] || 
    WIKILINK_DATA[cleanKey.replace(/[（(].*?[）)]/g, '').trim()] || {
      title: cleanKey,
      boldTerm: cleanKey,
      category: '维基百科条目',
      summary: `是一种收录于MZ维基的知识条目。点击可前往完整条目页面查阅更多文献与详细信息。`,
      iconType: 'product' as const
    }
  );

  const targetInfo = getWikiLinkTargetInfo(term);

  const handleClick = (e: React.MouseEvent) => {
    // If clicking settings icon or an internal wikilink, don't execute card fallback navigation
    if ((e.target as HTMLElement).closest('.preview-settings-btn')) {
      return;
    }
    onClose();
    if (targetInfo.inArticleSectionId && onNavigateSection) {
      onNavigateSection(targetInfo.inArticleSectionId);
    } else if (handleNavigateWikiTerm) {
      handleNavigateWikiTerm(term);
    } else if (onNavigate) {
      onNavigate();
    }
  };

  // Dimensions & Coordinates
  const cardWidth = 310;
  const rect = position.rect;
  
  // Decide whether card is positioned below or above the hovered link
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

  const targetTop = rect ? rect.top : position.y;
  const targetBottom = rect ? rect.bottom : position.y;
  const targetCenterX = rect ? rect.left + rect.width / 2 : position.x;

  // Space check: if not enough room below (card height ~350px) and plenty room above, flip above
  const isBelow = targetBottom + 360 <= viewportHeight || targetTop < 360;

  // Horizontal clamp: keep card inside screen with 12px margin
  const idealLeft = targetCenterX - cardWidth / 2;
  const cardLeft = Math.max(12, Math.min(idealLeft, viewportWidth - cardWidth - 12));

  // Vertical placement: 8px away from link
  const cardTop = isBelow ? targetBottom + 8 : targetTop - 350;

  // Triangle pointer position (relative to card left edge)
  const pointerOffset = Math.max(18, Math.min(targetCenterX - cardLeft, cardWidth - 18));

  // Prepare extract text: strip leading boldTerm if already present to avoid duplication
  const boldText = data.boldTerm || data.title;
  let bodyText = data.summary;
  if (bodyText.startsWith(boldText)) {
    bodyText = bodyText.slice(boldText.length).replace(/^[，,\s]+/, '');
  }

  // Scan and render wikilinks inside preview summary
  const scannedBodyNodes = useMemo(() => {
    return scanAndTransformWikiLinks(bodyText, {
      onNavigateWikiTerm: (clickedTerm) => {
        onClose();
        if (handleNavigateWikiTerm) {
          handleNavigateWikiTerm(clickedTerm);
        }
      },
      excludeTerm: boldText,
      maxOccurrencesPerTerm: 1,
      isDarkMode
    });
  }, [bodyText, handleNavigateWikiTerm, boldText, onClose, isDarkMode]);

  return (
    <div
      style={{
        position: 'fixed',
        left: cardLeft,
        top: cardTop,
        width: cardWidth,
        zIndex: 90
      }}
      onMouseEnter={() => {}}
      onMouseLeave={onClose}
      onClick={handleClick}
      className={`rounded-lg shadow-[0_30px_90px_-20px_rgba(0,0,0,0.35),0_0_1px_1px_rgba(0,0,0,0.08)] border transition-all animate-in fade-in zoom-in-95 duration-150 cursor-pointer select-none ${
        isDarkMode 
          ? 'bg-[#202122] border-[#54595d] text-[#eaecf0]' 
          : 'bg-white border-[#c8ccd1] text-[#202122]'
      }`}
    >
      {/* 1. Wikipedia Upward/Downward Pointer Caret */}
      {isBelow ? (
        <div 
          className={`absolute -top-2 w-3.5 h-3.5 rotate-45 border-t border-l z-20 transition-colors ${
            data.imageUrl && !imageError
              ? (isDarkMode ? 'bg-[#18191a] border-[#54595d]' : 'bg-[#f4f5f7] border-[#c8ccd1]')
              : (isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-white border-[#c8ccd1]')
          }`}
          style={{ left: pointerOffset - 7 }}
        />
      ) : (
        <div 
          className={`absolute -bottom-2 w-3.5 h-3.5 rotate-45 border-b border-r z-20 ${
            isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-white border-[#c8ccd1]'
          }`}
          style={{ left: pointerOffset - 7 }}
        />
      )}

      {/* 2. Top Lead Image (Wikipedia Page Previews Header Photo) */}
      {data.imageUrl && !imageError && (
        <div className="w-full h-44 overflow-hidden rounded-t-lg bg-[#eaecf0] dark:bg-[#1a1b1c] relative border-b border-black/5 dark:border-white/5 group">
          <img 
            src={data.imageUrl} 
            alt={data.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover select-none pointer-events-none"
            loading="eager"
          />
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs flex items-center gap-1">
            <BookOpen className="w-2.5 h-2.5" />
            <span>{data.category}</span>
          </div>
        </div>
      )}

      {/* 3. Text Excerpt (Wikipedia Page Previews Body with Dynamic WikiLinks) */}
      <div className="p-4 pt-3.5 pb-2.5 relative space-y-2">
        <div className="text-[13px] leading-[1.6] text-[#202122] dark:text-[#eaecf0] font-sans">
          <strong className="font-bold text-[#101418] dark:text-white mr-1.5">
            {boldText}
          </strong>
          {scannedBodyNodes}
        </div>

        {/* 4. Bottom Action & Settings Bar */}
        <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5 text-[11px] text-[#72777d]">
          <span className="flex items-center gap-1 text-[#3366cc] dark:text-[#6699ff] hover:underline">
            <span>点击阅读完整条目</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </span>

          <button
            type="button"
            className="preview-settings-btn p-1 text-[#72777d] hover:text-[#202122] dark:hover:text-white transition-colors cursor-pointer rounded"
            title="页面预览设置"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
