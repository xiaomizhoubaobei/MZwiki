import React from 'react';
import { WIKI_ENTRIES } from '../data/wikiEntriesData';
import { WIKILINK_DATA } from '../data/articleData';
import { GRAPH_NODES } from '../data/knowledgeGraphData';

export interface WikiScanOptions {
  onOpenWikiLink?: (term: string, event: React.MouseEvent) => void;
  onNavigateWikiTerm?: (term: string) => void;
  renderRef?: (refId: number) => React.ReactNode;
  autoDetectEntities?: boolean;
  maxPerTerm?: number;
  highlightClass?: string;
  excludeTerms?: string[];
}

/**
 * Builds a compiled, deduplicated entity dictionary sorted by string length descending
 * to ensure longest terms match first (e.g. "中毒性休克综合征毒素-1" matches before "中毒性休克综合征").
 */
let cachedTermDictionary: { term: string; canonical: string }[] | null = null;

export function getWikiTermDictionary(): { term: string; canonical: string }[] {
  if (cachedTermDictionary) {
    return cachedTermDictionary;
  }

  const map = new Map<string, string>();

  // 1. From WIKI_ENTRIES (Primary canonical encyclopedic articles)
  WIKI_ENTRIES.forEach(entry => {
    map.set(entry.title, entry.title);
    entry.aliases.forEach(alias => {
      if (alias.length >= 2 && !map.has(alias)) {
        map.set(alias, entry.title);
      }
    });
  });

  // 2. From Knowledge Graph Nodes
  GRAPH_NODES.forEach(node => {
    if (!map.has(node.name)) {
      map.set(node.name, node.name);
    }
  });

  // 3. From WIKILINK_DATA
  Object.keys(WIKILINK_DATA).forEach(key => {
    const clean = key.replace(/[（(].*?[）)]/g, '').trim();
    if (!map.has(clean)) {
      map.set(clean, clean);
    }
  });

  // Convert to array and sort by length descending
  const list = Array.from(map.entries()).map(([term, canonical]) => ({
    term,
    canonical
  }));

  list.sort((a, b) => b.term.length - a.term.length);
  cachedTermDictionary = list;
  return cachedTermDictionary;
}

/**
 * Scans a plain text string and converts:
 * 1. [[条目名]] or [[条目名|显示文字]] into interactive WikiLinks
 * 2. {{ref:ID}} into superscripts
 * 3. Registered encyclopedic entities into interactive WikiLinks
 */
export function scanAndRenderWikiText(
  text: string,
  options: WikiScanOptions = {}
): React.ReactNode[] {
  const {
    onOpenWikiLink,
    onNavigateWikiTerm,
    renderRef,
    autoDetectEntities = true,
    maxPerTerm = 2,
    highlightClass = 'text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer font-medium decoration-1 underline-offset-2',
    excludeTerms = []
  } = options;

  if (!text) return [];

  // Intermediate token interface
  type Token =
    | { type: 'text'; text: string }
    | { type: 'wikilink'; term: string; label: string; key: string }
    | { type: 'ref'; id: number; key: string };

  let tokens: Token[] = [{ type: 'text', text }];

  // -------------------------------------------------------------
  // PASS 1: Explicit MediaWiki Syntax [[条目名]] or [[条目名|别名]]
  // -------------------------------------------------------------
  const wikiSyntaxRegex = /\[\[([^|\]]+)(?:\|([^\]]+))?\]\]/g;
  let pass1Tokens: Token[] = [];
  let tokenKeyCounter = 0;

  for (const token of tokens) {
    if (token.type !== 'text') {
      pass1Tokens.push(token);
      continue;
    }

    let lastIndex = 0;
    let match: RegExpExecArray | null;
    wikiSyntaxRegex.lastIndex = 0;

    while ((match = wikiSyntaxRegex.exec(token.text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        pass1Tokens.push({
          type: 'text',
          text: token.text.slice(lastIndex, matchIndex)
        });
      }

      const term = match[1].trim();
      const label = match[2]?.trim() || term;
      pass1Tokens.push({
        type: 'wikilink',
        term,
        label,
        key: `syntax-${tokenKeyCounter++}`
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

  // -------------------------------------------------------------
  // PASS 2: References Template {{ref:ID}}
  // -------------------------------------------------------------
  if (renderRef) {
    const refRegex = /\{\{ref:(\d+)\}\}/g;
    let pass2Tokens: Token[] = [];

    for (const token of tokens) {
      if (token.type !== 'text') {
        pass2Tokens.push(token);
        continue;
      }

      let lastIndex = 0;
      let match: RegExpExecArray | null;
      refRegex.lastIndex = 0;

      while ((match = refRegex.exec(token.text)) !== null) {
        const matchIndex = match.index;
        if (matchIndex > lastIndex) {
          pass2Tokens.push({
            type: 'text',
            text: token.text.slice(lastIndex, matchIndex)
          });
        }

        const id = parseInt(match[1], 10);
        pass2Tokens.push({
          type: 'ref',
          id,
          key: `ref-${tokenKeyCounter++}`
        });

        lastIndex = matchIndex + match[0].length;
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

  // -------------------------------------------------------------
  // PASS 3: Automatic Entity Detection (Dictionary Scanning)
  // -------------------------------------------------------------
  if (autoDetectEntities) {
    const dictionary = getWikiTermDictionary().filter(
      item => !excludeTerms.includes(item.term) && !excludeTerms.includes(item.canonical)
    );

    const termOccurrenceMap = new Map<string, number>();

    // Build a single composite regex for all dictionary terms
    // Terms are already sorted by length descending
    const escapedTerms = dictionary.map(d =>
      d.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    const entityRegex = new RegExp(`(${escapedTerms.join('|')})`, 'g');

    let pass3Tokens: Token[] = [];

    for (const token of tokens) {
      if (token.type !== 'text') {
        pass3Tokens.push(token);
        continue;
      }

      let lastIndex = 0;
      let match: RegExpExecArray | null;
      entityRegex.lastIndex = 0;

      while ((match = entityRegex.exec(token.text)) !== null) {
        const matchedTerm = match[1];
        const matchIndex = match.index;

        const currentOccurrences = termOccurrenceMap.get(matchedTerm) || 0;

        // Wikipedia style: Limit link frequency per section/block to prevent overlinking
        if (currentOccurrences < maxPerTerm) {
          if (matchIndex > lastIndex) {
            pass3Tokens.push({
              type: 'text',
              text: token.text.slice(lastIndex, matchIndex)
            });
          }

          const matchedEntry = dictionary.find(d => d.term === matchedTerm);
          const canonical = matchedEntry?.canonical || matchedTerm;

          pass3Tokens.push({
            type: 'wikilink',
            term: canonical,
            label: matchedTerm,
            key: `auto-${tokenKeyCounter++}`
          });

          termOccurrenceMap.set(matchedTerm, currentOccurrences + 1);
          lastIndex = matchIndex + matchedTerm.length;
        }
      }

      if (lastIndex < token.text.length) {
        pass3Tokens.push({
          type: 'text',
          text: token.text.slice(lastIndex)
        });
      }
    }

    tokens = pass3Tokens;
  }

  // -------------------------------------------------------------
  // RENDER: Convert tokens into React VNodes
  // -------------------------------------------------------------
  return tokens.map((token, idx) => {
    if (token.type === 'text') {
      return <React.Fragment key={`t-${idx}`}>{token.text}</React.Fragment>;
    }

    if (token.type === 'ref') {
      return renderRef ? renderRef(token.id) : null;
    }

    if (token.type === 'wikilink') {
      return (
        <span
          key={token.key || `wl-${idx}`}
          onClick={(e) => {
            if (onOpenWikiLink) {
              onOpenWikiLink(token.term, e);
            } else if (onNavigateWikiTerm) {
              onNavigateWikiTerm(token.term);
            }
          }}
          onMouseEnter={(e) => {
            if (onOpenWikiLink) {
              onOpenWikiLink(token.term, e);
            }
          }}
          className={highlightClass}
          title={`查看维基百科条目: ${token.term}`}
        >
          {token.label}
        </span>
      );
    }

    return null;
  });
}

/**
 * WikiText Component
 * Wrapper component for easy scanning and rendering of any encyclopedic paragraph
 */
export const WikiText: React.FC<{
  children: string;
  onOpenWikiLink?: (term: string, event: React.MouseEvent) => void;
  onNavigateWikiTerm?: (term: string) => void;
  renderRef?: (refId: number) => React.ReactNode;
  autoDetectEntities?: boolean;
  maxPerTerm?: number;
  highlightClass?: string;
  excludeTerms?: string[];
  className?: string;
}> = ({
  children,
  onOpenWikiLink,
  onNavigateWikiTerm,
  renderRef,
  autoDetectEntities = true,
  maxPerTerm = 2,
  highlightClass,
  excludeTerms,
  className
}) => {
  const nodes = scanAndRenderWikiText(children, {
    onOpenWikiLink,
    onNavigateWikiTerm,
    renderRef,
    autoDetectEntities,
    maxPerTerm,
    highlightClass,
    excludeTerms
  });

  return <span className={className}>{nodes}</span>;
};
