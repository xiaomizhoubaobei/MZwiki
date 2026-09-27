import React, { useState } from 'react';
import { ListFilter, ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { SectionDef, ARTICLE_SECTIONS } from '../data/articleData';

interface TableOfContentsProps {
  activeSectionId: string;
  onSelectSection: (sectionId: string) => void;
  isDarkMode: boolean;
  sections?: SectionDef[];
  onToggleSidebar?: () => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  activeSectionId,
  onSelectSection,
  isDarkMode,
  sections = ARTICLE_SECTIONS,
  onToggleSidebar
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [isTocHidden, setIsTocHidden] = useState(false);

  const toggleSectionCollapse = (e: React.MouseEvent, sectionId: string) => {
    e.stopPropagation();
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <nav 
      aria-label="目录"
      className={`rounded-lg border p-3 text-xs transition-colors select-none shadow-xs ${
        isDarkMode 
          ? 'bg-[#1e2022] border-[#54595d] text-[#eaecf0]' 
          : 'bg-[#f8f9fa] border-[#c8ccd1] text-[#202122]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-1.5 font-bold font-serif text-sm">
          <ListFilter className="w-4 h-4 text-[#3366cc]" />
          <span>目录</span>
        </div>
        <div className="flex items-center gap-2">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="text-[11px] text-[#72777d] hover:text-[#3366cc] cursor-pointer"
              title="收起侧边目录"
            >
              收起
            </button>
          )}
          <button
            onClick={() => setIsTocHidden(!isTocHidden)}
            className="text-[11px] text-[#3366cc] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            {isTocHidden ? (
              <>
                <Eye className="w-3 h-3" />
                <span>展开</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3" />
                <span>折叠</span>
              </>
            )}
          </button>
        </div>
      </div>

      {!isTocHidden && (
        <div className="space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
          {/* Top of article anchor */}
          <button
            onClick={() => onSelectSection('top')}
            className={`w-full text-left px-2 py-1 rounded transition-colors text-[11px] font-medium flex items-center gap-1.5 cursor-pointer ${
              activeSectionId === 'top'
                ? 'bg-[#3366cc]/15 text-[#3366cc] font-bold'
                : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#54595d] dark:text-[#a2a9b1]'
            }`}
          >
            <span>（序言导论）</span>
          </button>

          {/* Section Items */}
          {sections.map((section) => {
            const hasSub = section.subsections && section.subsections.length > 0;
            const isCollapsed = collapsedSections[section.id];
            const isCurrent = activeSectionId === section.id;
            const isChildActive = section.subsections?.some((sub: SectionDef) => sub.id === activeSectionId);

            return (
              <div key={section.id} className="space-y-0.5">
                <div
                  onClick={() => onSelectSection(section.id)}
                  className={`group flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors ${
                    isCurrent || isChildActive
                      ? 'bg-[#3366cc]/10 text-[#3366cc] font-semibold'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#202122] dark:text-[#eaecf0]'
                  }`}
                >
                  <div className="flex items-baseline gap-1.5 min-w-0 pr-1">
                    <span className="font-mono text-[10px] text-[#72777d] shrink-0">
                      {section.number}
                    </span>
                    <span className="truncate group-hover:text-[#3366cc] transition-colors">
                      {section.title}
                    </span>
                  </div>

                  {hasSub && (
                    <button
                      onClick={(e) => toggleSectionCollapse(e, section.id)}
                      className="p-0.5 text-[#72777d] hover:text-[#202122] dark:hover:text-white shrink-0"
                    >
                      {isCollapsed ? (
                        <ChevronRight className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>

                {/* Subsections List */}
                {hasSub && !isCollapsed && (
                  <div className="pl-4 space-y-0.5 border-l border-black/5 dark:border-white/10 ml-2">
                    {section.subsections!.map((sub: SectionDef) => {
                      const isSubActive = activeSectionId === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => onSelectSection(sub.id)}
                          className={`w-full text-left px-2 py-0.5 rounded text-[11px] flex items-baseline gap-1.5 transition-colors ${
                            isSubActive
                              ? 'text-[#3366cc] font-bold bg-[#3366cc]/10'
                              : 'text-[#54595d] dark:text-[#a2a9b1] hover:text-[#202122] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                        >
                          <span className="font-mono text-[9px] text-[#72777d] shrink-0">
                            {sub.number}
                          </span>
                          <span className="truncate">{sub.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
};
