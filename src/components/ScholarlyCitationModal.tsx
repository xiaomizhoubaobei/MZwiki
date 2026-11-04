import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  BookmarkCheck, 
  BookOpen, 
  ExternalLink, 
  FileText,
  Sparkles,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { 
  generateAllCitations, 
  ArticleCitationMeta, 
  CitationStyleKey, 
  getRetrievalDate 
} from '../utils/scholarlyCitationGenerator';

interface ScholarlyCitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  articleMeta: {
    id: string;
    title: string;
    enTitle?: string;
    revisionVersion?: string;
    lastModifiedDate?: string;
  };
}

export const ScholarlyCitationModal: React.FC<ScholarlyCitationModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  articleMeta
}) => {
  const [activeStyle, setActiveStyle] = useState<CitationStyleKey>('gbt7714');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://mz-wiki.app';
  const articleUrl = `${origin}/wiki/${encodeURIComponent(articleMeta.title)}`;

  const meta: ArticleCitationMeta = {
    id: articleMeta.id,
    title: articleMeta.title,
    enTitle: articleMeta.enTitle,
    url: articleUrl,
    lastModifiedDate: articleMeta.lastModifiedDate || '2026-09-25',
    revisionVersion: articleMeta.revisionVersion || 'r1094821',
    author: 'MZ维基编修委员会',
    publisher: 'MZ维基，自由的百科全书'
  };

  const citations = generateAllCitations(meta);
  const currentCitation = citations.find(c => c.key === activeStyle) || citations[0];
  const retrieval = getRetrievalDate();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const handleDownload = () => {
    const ext = currentCitation.fileExtension || 'txt';
    const mime = currentCitation.mimeType || 'text/plain;charset=utf-8';
    const blob = new Blob([currentCitation.text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `citation-${meta.id}-${activeStyle}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-2xl rounded-xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] transition-colors ${
          isDarkMode 
            ? 'bg-[#18191a] border-[#3a3d42] text-[#eaecf0]' 
            : 'bg-white border-[#c8ccd1] text-[#202122]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3366cc]/10 flex items-center justify-center text-[#3366cc]">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#202122] dark:text-white">
                  引用本条目（Scholarly Citation Generator）
                </h2>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#3366cc]/10 text-[#3366cc] font-mono">
                  {meta.revisionVersion}
                </span>
              </div>
              <p className="text-xs text-[#72777d]">
                条目：<strong className="text-[#3366cc]">{meta.title}</strong> · 自动生成符合学术期刊与论文规范的标准引用格式
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#72777d] hover:text-[#202122] dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Style Selector Tabs */}
        <div className="flex border-b border-black/10 dark:border-white/10 px-4 sm:px-5 gap-1.5 overflow-x-auto bg-black/2 dark:bg-white/2 py-2">
          {citations.map(c => {
            const isActive = c.key === activeStyle;
            return (
              <button
                key={c.key}
                onClick={() => setActiveStyle(c.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#3366cc] text-white shadow-xs font-semibold'
                    : 'hover:bg-black/5 dark:hover:bg-white/10 text-[#54595d] dark:text-[#a2a9b1]'
                }`}
              >
                <span>{c.label}</span>
                {c.key === 'gbt7714' && (
                  <span className={`text-[9px] px-1 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-black/10 dark:bg-white/10'}`}>
                    国标
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Active Standard Description */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#202122] dark:text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#3366cc]" />
              <span>{currentCitation.standardName}</span>
            </span>
            <span className="text-[11px] text-[#72777d] font-mono">
              获取日期：{retrieval.chinese}
            </span>
          </div>

          {/* Formatted Citation Text Box */}
          <div className={`p-4 rounded-lg font-mono text-xs sm:text-[13px] leading-relaxed border select-all transition-colors ${
            isDarkMode 
              ? 'bg-[#0f1011] border-[#3a3d42] text-[#e2e8f0]' 
              : 'bg-[#f8f9fa] border-[#c8ccd1] text-[#1e293b]'
          }`}>
            {currentCitation.key === 'bibtex' ? (
              <pre className="whitespace-pre-wrap font-mono text-xs text-[#059669] dark:text-[#34d399]">
                {currentCitation.text}
              </pre>
            ) : (
              <p className="whitespace-pre-wrap">
                {currentCitation.text}
              </p>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(currentCitation.text, currentCitation.key)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3366cc] hover:bg-[#2a4b8d] text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                {copiedKey === currentCitation.key ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>已复制到剪贴板！</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>复制引用文本</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                  isDarkMode 
                    ? 'border-[#54595d] text-[#eaecf0] hover:bg-[#2c2e33]' 
                    : 'border-[#c8ccd1] text-[#202122] hover:bg-[#eaecf0]'
                }`}
                title={`下载 .${currentCitation.fileExtension || 'txt'} 文件`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>下载文件 (.{currentCitation.fileExtension || 'txt'})</span>
              </button>
            </div>

            <span className="text-[11px] text-[#72777d] hidden sm:inline font-mono">
              永久链接: /wiki/{encodeURIComponent(meta.title)}
            </span>
          </div>

          {/* Academic Attribution & License Notice */}
          <div className="mt-4 p-3 rounded-lg border border-black/5 dark:border-white/5 space-y-1.5 bg-black/2 dark:bg-white/2 text-[11px] text-[#72777d]">
            <div className="flex items-center gap-1.5 font-medium text-[#202122] dark:text-white">
              <Info className="w-3.5 h-3.5 text-[#3366cc]" />
              <span>学术著录与知识共享规范声明</span>
            </div>
            <p>
              MZ维基全部词条文本遵循 <strong>知识共享 署名-相同方式共享 4.0 国际许可协议（CC BY-SA 4.0）</strong>。在学术论文、研究报告、专著或课程讲义中引用本词条时，请标明修订版本号（<strong>{meta.revisionVersion}</strong>）与访问日期，以保证学术研究的可溯源性与可查证性。
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
