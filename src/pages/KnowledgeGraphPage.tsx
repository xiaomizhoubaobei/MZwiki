import React, { useState } from 'react';
import {
  GitBranch,
  BookOpen,
  Layers,
  ExternalLink,
  ShieldAlert,
  Clock,
  History,
  Activity,
  Sparkles,
  Info,
  HelpCircle,
  Compass,
  Tag
} from 'lucide-react';
import { KnowledgeGraphViewer } from '../components/KnowledgeGraphViewer';

interface KnowledgeGraphPageProps {
  isDarkMode: boolean;
  onNavigateToArticle: (sectionId?: string) => void;
  onNavigateCategory: () => void;
  onNavigateHome: () => void;
  onNavigateWikiTerm?: (term: string) => void;
  onNavigateTags?: (tag?: string) => void;
  initialTagFilter?: string;
  initialSelectedNodeId?: string;
}

export const KnowledgeGraphPage: React.FC<KnowledgeGraphPageProps> = ({
  isDarkMode,
  onNavigateToArticle,
  onNavigateCategory,
  onNavigateHome,
  onNavigateWikiTerm,
  onNavigateTags,
  initialTagFilter,
  initialSelectedNodeId
}) => {
  const [activePresetNode, setActivePresetNode] = useState<string>(initialSelectedNodeId || 'tampon');

  const presets = [
    {
      id: 'tampon',
      title: '卫生棉条',
      desc: '体内经期用品核心条目，连接导管结构、吸收材质与微生态。',
      icon: Compass,
      color: 'text-[#3366cc]'
    },
    {
      id: 'sanitary-pad',
      title: '卫生巾',
      desc: '外置经期吸收用品条目，连接大众普及、材料工艺与公共倡议。',
      icon: Layers,
      color: 'text-emerald-500'
    },
    {
      id: 'menstrual-cup',
      title: '月经杯',
      desc: '硅胶体内收集型经期用品，连接环保经济、使用方式与竞品替代。',
      icon: Activity,
      color: 'text-cyan-500'
    },
    {
      id: 'tss',
      title: '中毒性休克综合征',
      desc: '临床急症医学条目，探究金葡菌、外毒素与超时滞留病理机制。',
      icon: ShieldAlert,
      color: 'text-red-500'
    },
    {
      id: 'female-reproductive',
      title: '女性生殖系统',
      desc: '人体解剖学主条目，涵盖子宫、阴道穹与月经生理周期。',
      icon: Activity,
      color: 'text-purple-500'
    },
    {
      id: 'earle-haas',
      title: '厄尔·哈斯',
      desc: '历史人物条目，1929年双套管专利发明人与品牌商业化溯源。',
      icon: History,
      color: 'text-amber-500'
    },
    {
      id: 'pink-tax',
      title: '粉红税',
      desc: '社会经济学条目，聚焦女性必需品性别溢价与免税政策争议。',
      icon: Sparkles,
      color: 'text-pink-500'
    },
    {
      id: 'vaginal-flora',
      title: '阴道菌群',
      desc: '微生态条目，阐述乳杆菌弱酸微生态及屏障生理功能。',
      icon: HelpCircle,
      color: 'text-indigo-500'
    }
  ];

  return (
    <div className="space-y-6">

      {/* 1. Wikipedia Special Page Header Ribbon */}
      <div className={`p-4 sm:p-5 rounded border transition-colors ${
        isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-[#f8f9fa] border-[#c8ccd1]'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#3366cc] dark:text-[#6699ff] bg-[#3366cc]/10 px-2 py-0.5 rounded">
                Special:KnowledgeGraph
              </span>
              <span className="text-xs text-[#72777d]">特殊页面 · 全域实体概念关系网络</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#202122] dark:text-white">
              知识图谱与词条网络
            </h1>
            <p className="text-xs sm:text-sm text-[#54595d] dark:text-[#bdc1c6] max-w-3xl leading-relaxed">
              MZ维基知识图谱基于自由百科全书条目、结构化数据（Wikidata）与同行评审文献构建，支持探索百科全域词条之间的实体归属、衍生发明、医学病理、解剖构造与社会文化跨学科关联。
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onNavigateTags && (
              <button
                onClick={() => onNavigateTags()}
                className="px-3 py-1.5 rounded border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs text-[#54595d] dark:text-[#a2a9b1] transition-colors cursor-pointer flex items-center gap-1.5"
                title="浏览全域知识标签与主题索引"
              >
                <Tag className="w-3.5 h-3.5 text-[#3366cc]" />
                <span>标签系统</span>
              </button>
            )}
            <button
              onClick={() => onNavigateToArticle()}
              className="px-3 py-1.5 rounded bg-[#3366cc] hover:bg-[#2a4b8d] text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>阅读典范条目</span>
            </button>
            <button
              onClick={() => onNavigateCategory()}
              className="px-3 py-1.5 rounded border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs text-[#54595d] dark:text-[#a2a9b1] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>分类总览</span>
            </button>
          </div>
        </div>

        {/* Focal Entity Quick Switcher */}
        <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5">
          <div className="text-[11px] font-bold text-[#72777d] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#e67e22]" />
            <span>切换视角 · 核心词条快捷聚焦：</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {presets.map(p => {
              const Icon = p.icon;
              const isActive = activePresetNode === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePresetNode(p.id)}
                  className={`p-2.5 rounded text-left transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-[#2c3036] border-[#3366cc] shadow-xs'
                      : isDarkMode
                        ? 'bg-[#18191a] border-[#3a3d42] hover:border-[#6699ff]/40'
                        : 'bg-white border-[#e5e7eb] hover:border-[#3366cc]/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${p.color}`} />
                    <span className="font-bold text-xs text-[#202122] dark:text-white">
                      {p.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#72777d] mt-1 leading-snug line-clamp-2">
                    {p.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Interactive Knowledge Graph Canvas Component */}
      <KnowledgeGraphViewer
        isDarkMode={isDarkMode}
        onNavigateArticle={onNavigateToArticle}
        onNavigateCategory={onNavigateCategory}
        onNavigateWikiTerm={onNavigateWikiTerm}
        onNavigateTags={onNavigateTags}
        initialSelectedNodeId={activePresetNode}
        initialTagFilter={initialTagFilter}
      />

      {/* 3. Methodology & Graph Reference Information */}
      <div className={`p-4 rounded border text-xs space-y-3 transition-colors ${
        isDarkMode ? 'bg-[#1a1b1c] border-[#54595d]' : 'bg-[#f8f9fa] border-[#c8ccd1]'
      }`}>
        <div className="flex items-center gap-2 font-bold text-sm text-[#202122] dark:text-white">
          <Info className="w-4 h-4 text-[#3366cc]" />
          <span>图谱构建方法论与知识图例规范</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[#54595d] dark:text-[#a2a9b1] leading-relaxed">
          <div className="space-y-1">
            <h4 className="font-semibold text-[#202122] dark:text-white">节点实体权重</h4>
            <p>
              图谱节点尺寸正比于条目在权威文献中的被引频次与连接度（Degree Centrality），中心节点「卫生棉条」连接所有主要分类与概念。
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-[#202122] dark:text-white">关系连线语义</h4>
            <p>
              实线代表强因果或直接结构分类（如套管/指入分类、TSS感染链），虚线代表竞品对比或同类参照（如卫生巾、月经杯）。
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-[#202122] dark:text-white">双向交互探索</h4>
            <p>
              支持平移、缩放、节点物理拖拽以及全屏沉浸模式；右侧详情抽屉可一键直达条目对应正文章节或分类词典。
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
