import React from 'react';
import { ExternalLink, BookCheck } from 'lucide-react';
import { ReferenceItem } from '../data/articleData';

interface ReferencePreviewProps {
  reference: ReferenceItem;
  position: { x: number; y: number };
  onClose: () => void;
  isDarkMode: boolean;
}

export const ReferencePreview: React.FC<ReferencePreviewProps> = ({
  reference,
  position,
  onClose,
  isDarkMode
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        left: Math.min(Math.max(16, position.x - 120), window.innerWidth - 340),
        top: Math.min(position.y + 20, window.innerHeight - 200),
        zIndex: 60
      }}
      onMouseLeave={onClose}
      className={`w-80 rounded-lg shadow-2xl border text-xs p-3 transition-all animate-in fade-in zoom-in-95 duration-150 ${
        isDarkMode
          ? 'bg-[#27292d] border-[#54595d] text-[#eaecf0]'
          : 'bg-white border-[#c8ccd1] text-[#202122]'
      }`}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#3366cc] mb-1.5 pb-1 border-b border-black/5 dark:border-white/5">
        <BookCheck className="w-3.5 h-3.5" />
        <span>参考文献 [{reference.id}]</span>
      </div>

      <div className="space-y-1.5 leading-relaxed text-[#54595d] dark:text-[#bdc1c6]">
        {reference.authors && (
          <div className="font-semibold text-[#202122] dark:text-white">
            {reference.authors}
          </div>
        )}
        <div className="italic">
          "{reference.title}"
        </div>
        <div className="text-[11px] text-[#72777d]">
          {reference.source} {reference.date ? `(${reference.date})` : ''}
        </div>
        {reference.quote && (
          <blockquote className="pl-2 border-l-2 border-[#3366cc] text-[11px] text-[#72777d] dark:text-[#9aa0a6] my-1">
            "{reference.quote}"
          </blockquote>
        )}
        {reference.doi && (
          <div className="text-[11px] font-mono">
            DOI: <span className="text-[#3366cc]">{reference.doi}</span>
          </div>
        )}
      </div>

      {reference.url && (
        <div className="mt-2 pt-1.5 border-t border-black/5 dark:border-white/5 flex items-center justify-end">
          <a
            href={reference.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3366cc] hover:underline inline-flex items-center gap-1 text-[11px] font-medium"
          >
            <span>访问来源链接</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};
