import React, { useState, useEffect } from 'react';
import { getGlobalContentStatistics, GlobalContentStatistics } from '../utils/contentStatisticsAutomation';
import { fetchGlobalStatisticsApi } from '../services/statisticsApi';
import { BookOpen, FileText, ShieldCheck, GitBranch } from 'lucide-react';

interface WikipediaFooterProps {
  isDarkMode: boolean;
  onOpenPolicy: (tab: 'privacy' | 'disclaimer' | 'conduct') => void;
  onNavigateStats?: () => void;
}

export const WikipediaFooter: React.FC<WikipediaFooterProps> = ({ isDarkMode, onOpenPolicy, onNavigateStats }) => {
  // Automated Global Content Statistics synced from API
  const [globalStats, setGlobalStats] = useState<GlobalContentStatistics>(() => getGlobalContentStatistics());

  useEffect(() => {
    fetchGlobalStatisticsApi().then(res => {
      setGlobalStats(res.data);
    });
  }, []);

  return (
    <footer className={`mt-16 pt-6 pb-10 border-t text-[11px] leading-relaxed transition-colors ${
      isDarkMode 
        ? 'border-[#54595d] bg-[#1a1b1c] text-[#a2a9b1]' 
        : 'border-[#c8ccd1] bg-[#f8f9fa] text-[#72777d]'
    }`}>
      <div className="max-w-[1720px] mx-auto px-4 space-y-3">
        
        {/* Revision & Streamlined Copyright Notice */}
        <div className="space-y-1">
          <p className="flex items-center gap-2 flex-wrap">
            <span>本页面最后修订于 <strong className="font-semibold text-[#202122] dark:text-[#eaecf0]">{globalStats.latestRevisionTimestamp}</strong>。</span>
            <span className="opacity-40">·</span>
            {onNavigateStats ? (
              <button
                onClick={onNavigateStats}
                className="flex items-center gap-1 font-mono text-[10px] text-[#54595d] dark:text-[#a2a9b1] hover:text-[#3366cc] dark:hover:text-[#6699ff] transition-colors cursor-pointer"
                title="点击查看全域内容深度统计与量化报告 (Special:统计)"
              >
                <BookOpen className="w-3 h-3 text-[#3366cc]" />
                <span>收录 {globalStats.totalArticles} 篇词条</span>
                <span className="opacity-40">/</span>
                <FileText className="w-3 h-3 text-[#059669]" />
                <span>{globalStats.totalWords.toLocaleString()} 字</span>
                <span className="opacity-40">/</span>
                <ShieldCheck className="w-3 h-3 text-[#dc2626]" />
                <span>{globalStats.totalReferences} 篇学术规范文献</span>
                <span className="opacity-40">/</span>
                <GitBranch className="w-3 h-3 text-[#d97706]" />
                <span>{globalStats.totalGraphEdges} 拓扑边</span>
                <span className="ml-1 text-[#3366cc] underline text-[9px]">查看完整统计 →</span>
              </button>
            ) : (
              <span className="flex items-center gap-1 font-mono text-[10px] text-[#54595d] dark:text-[#a2a9b1]">
                <BookOpen className="w-3 h-3 text-[#3366cc]" />
                <span>收录 {globalStats.totalArticles} 篇词条</span>
                <span className="opacity-40">/</span>
                <FileText className="w-3 h-3 text-[#059669]" />
                <span>{globalStats.totalWords.toLocaleString()} 字</span>
                <span className="opacity-40">/</span>
                <ShieldCheck className="w-3 h-3 text-[#dc2626]" />
                <span>{globalStats.totalReferences} 篇学术规范文献</span>
                <span className="opacity-40">/</span>
                <GitBranch className="w-3 h-3 text-[#d97706]" />
                <span>{globalStats.totalGraphEdges} 拓扑边</span>
              </span>
            )}
          </p>
          <p>
            本站全部文本在知识共享 署名-相同方式共享 4.0协议（CC BY-SA 4.0）之条款下提供，附加条款亦可能应用。
          </p>
        </div>

        {/* Essential Policy Navigation Links */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-1 text-[#3366cc]">
          <a
            href="/wiki/Wikipedia:隐私政策"
            onClick={(e) => {
              e.preventDefault();
              onOpenPolicy('privacy');
            }}
            className="hover:underline text-left cursor-pointer font-medium"
          >
            隐私政策
          </a>
          <a
            href="/wiki/Wikipedia:免责声明"
            onClick={(e) => {
              e.preventDefault();
              onOpenPolicy('disclaimer');
            }}
            className="hover:underline text-left cursor-pointer font-semibold text-red-600 dark:text-red-400"
          >
            免责声明（医学与法律）
          </a>
          <a
            href="/wiki/Wikipedia:全域行为准则"
            onClick={(e) => {
              e.preventDefault();
              onOpenPolicy('conduct');
            }}
            className="hover:underline text-left cursor-pointer font-medium"
          >
            全域行为准则
          </a>
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:underline text-left cursor-pointer text-[#72777d] hover:text-[#3366cc] ml-auto sm:ml-0"
          >
            回到顶部 ↑
          </button>
        </div>

      </div>
    </footer>
  );
};
