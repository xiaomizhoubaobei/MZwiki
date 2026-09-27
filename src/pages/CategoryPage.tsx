import React, { useState } from 'react';
import { GitBranch } from 'lucide-react';

interface CategoryPageProps {
  isDarkMode: boolean;
  onNavigateToArticle: (sectionId?: string) => void;
  onNavigateHome: () => void;
  onNavigateWikiTerm?: (term: string) => void;
  onOpenWikiLink?: (term: string, event: React.MouseEvent) => void;
  onNavigateGraph?: () => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  isDarkMode,
  onNavigateToArticle,
  onNavigateWikiTerm,
  onOpenWikiLink,
  onNavigateGraph
}) => {
  // Category expansion states (MediaWiki CategoryTree behaviour)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    cultureAndMenstruation: true,
    brands: true
  });

  const toggleCategory = (key: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLinkClick = (term: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (term === '卫生棉条' || term === '衛生棉條' || term === 'Tampon') {
      onNavigateToArticle();
    } else if (term === '女性生理用品') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (onNavigateWikiTerm) {
      onNavigateWikiTerm(term);
    }
  };

  const handleLinkHover = (term: string, e: React.MouseEvent) => {
    if (onOpenWikiLink) {
      onOpenWikiLink(term, e);
    }
  };

  return (
    <div className={`space-y-4 font-sans leading-relaxed text-sm ${
      isDarkMode ? 'text-[#eaecf0]' : 'text-[#202122]'
    }`}>
      
      {/* 1. Header Note (维基百科分类顶部的引导文字) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-1 pb-2 border-b border-black/5 dark:border-white/5">
        <div>
          <span>有关本</span>
          <a 
            href="https://zh.wikipedia.org/wiki/Help:%E5%88%86%E7%B1%BB"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3366cc] dark:text-[#6699ff] hover:underline mx-0.5 cursor-pointer"
          >
            分类
          </a>
          <span>的更多信息，请参阅“</span>
          <button 
            onClick={(e) => handleLinkClick('女性生理用品', e)}
            className="text-[#3366cc] dark:text-[#6699ff] font-bold hover:underline cursor-pointer"
          >
            女性生理用品
          </button>
          <span>”。</span>
        </div>

        {onNavigateGraph && (
          <button
            onClick={onNavigateGraph}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#3366cc]/10 hover:bg-[#3366cc]/20 text-[#3366cc] dark:text-[#6699ff] font-medium transition-colors cursor-pointer self-start sm:self-auto"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>以知识图谱模式浏览本分类实体网络 »</span>
          </button>
        )}
      </div>

      {/* 2. Subcategories Section (子分类) */}
      <div id="subcategories" className="border-t border-[#a2a9b1] dark:border-[#54595d] pt-3">
        <h2 className="font-serif text-lg font-bold text-[#202122] dark:text-white mb-1">
          子分类
        </h2>
        <p className="text-xs text-[#54595d] dark:text-[#a2a9b1] mb-4">
          本分类共含有2个子分类，以下显示其中2个。
        </p>

        <div className="space-y-4 pl-1">
          {/* 女 */}
          <div>
            <h3 className="font-bold text-sm text-[#202122] dark:text-white mb-1.5">
              女
            </h3>
            <div className="text-xs pl-2">
              <div className="flex items-center gap-1.5 py-0.5">
                <button
                  type="button"
                  onClick={() => toggleCategory('brands')}
                  className="w-4 h-4 inline-flex items-center justify-center text-[#3366cc] dark:text-[#6699ff] hover:opacity-80 transition-transform cursor-pointer"
                  title={expandedCategories['brands'] ? '折叠' : '展开'}
                >
                  <span className="text-[11px] select-none">
                    {expandedCategories['brands'] ? '▼' : '►'}
                  </span>
                </button>
                <button 
                  onClick={() => toggleCategory('brands')}
                  className="text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer font-medium"
                >
                  女性生理用品品牌
                </button>
                <span className="text-[#72777d] font-mono text-[11px]">
                  (3个页面)
                </span>
              </div>

              {/* Sub-items for 女性生理用品品牌 */}
              {expandedCategories['brands'] && (
                <div className="pl-6 pt-1 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-[#a2a9b1] dark:text-[#54595d] text-[10px] select-none">►</span>
                    <button 
                      onClick={(e) => handleLinkClick('丹碧丝', e)}
                      onMouseEnter={(e) => handleLinkHover('丹碧丝', e)}
                      className="text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer"
                    >
                      丹碧丝 (Tampax)
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-[#a2a9b1] dark:text-[#54595d] text-[10px] select-none">►</span>
                    <button 
                      onClick={(e) => handleLinkClick('高洁丝', e)}
                      onMouseEnter={(e) => handleLinkHover('高洁丝', e)}
                      className="text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer"
                    >
                      高洁丝 (Kotex)
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-[#a2a9b1] dark:text-[#54595d] text-[10px] select-none">►</span>
                    <button 
                      onClick={(e) => handleLinkClick('苏菲', e)}
                      onMouseEnter={(e) => handleLinkHover('苏菲', e)}
                      className="text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer"
                    >
                      苏菲 (Sofy)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 文 */}
          <div>
            <h3 className="font-bold text-sm text-[#202122] dark:text-white mb-1.5">
              文
            </h3>
            <div className="text-xs pl-2">
              <div className="flex items-center gap-1.5 py-0.5">
                <button
                  type="button"
                  onClick={() => toggleCategory('cultureAndMenstruation')}
                  className="w-4 h-4 inline-flex items-center justify-center text-[#3366cc] dark:text-[#6699ff] hover:opacity-80 transition-transform cursor-pointer"
                  title={expandedCategories['cultureAndMenstruation'] ? '折叠' : '展开'}
                >
                  <span className="text-[11px] select-none">
                    {expandedCategories['cultureAndMenstruation'] ? '▼' : '►'}
                  </span>
                </button>
                <button 
                  onClick={() => toggleCategory('cultureAndMenstruation')}
                  className="text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer font-medium"
                >
                  文化与月经
                </button>
                <span className="text-[#72777d] font-mono text-[11px]">
                  (1个分类)
                </span>
              </div>

              {/* Subtree: 宗教中的月经 (1个页面) */}
              {expandedCategories['cultureAndMenstruation'] && (
                <div className="pl-6 pt-1 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs py-0.5">
                    <button
                      type="button"
                      onClick={() => toggleCategory('religionAndMenstruation')}
                      className="w-3.5 h-3.5 inline-flex items-center justify-center text-[#a2a9b1] dark:text-[#72777d] hover:text-[#3366cc] transition-transform cursor-pointer"
                      title={expandedCategories['religionAndMenstruation'] ? '折叠' : '展开'}
                    >
                      <span className="text-[10px] select-none">
                        {expandedCategories['religionAndMenstruation'] ? '▼' : '►'}
                      </span>
                    </button>
                    <button 
                      onClick={() => toggleCategory('religionAndMenstruation')}
                      className="text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer"
                    >
                      宗教中的月经
                    </button>
                    <span className="text-[#72777d] font-mono text-[11px]">
                      (1个页面)
                    </span>
                  </div>

                  {/* Sub-item for 宗教中的月经 */}
                  {expandedCategories['religionAndMenstruation'] && (
                    <div className="pl-6 pt-0.5">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-[#a2a9b1] dark:text-[#54595d] text-[10px] select-none">•</span>
                        <button 
                          onClick={(e) => handleLinkClick('月经禁忌', e)}
                          onMouseEnter={(e) => handleLinkHover('月经禁忌', e)}
                          className="text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer"
                        >
                          月经禁忌与宗教洁净观
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Pages in category Section (分类“女性生理用品”中的页面) */}
      <div id="category-pages" className="border-t border-[#a2a9b1] dark:border-[#54595d] pt-3">
        <h2 className="font-serif text-lg font-bold text-[#202122] dark:text-white mb-1">
          分类“女性生理用品”中的页面
        </h2>
        <p className="text-xs text-[#54595d] dark:text-[#a2a9b1] mb-4">
          本分类共含有9个页面，以下显示其中9个。点击条目可查看详情或访问条目。
        </p>

        {/* 3-Column Standard Wikipedia Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5 text-xs">
          
          {/* Column 1 */}
          <div className="space-y-4">
            {/* D */}
            <div>
              <h3 className="font-bold text-sm text-[#202122] dark:text-white mb-1">
                D
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>
                  <button 
                    onClick={(e) => handleLinkClick('清洗 (医学)', e)}
                    onMouseEnter={(e) => handleLinkHover('清洗 (医学)', e)}
                    className="text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer"
                  >
                    清洗 (醫學)
                  </button>
                </li>
              </ul>
            </div>

            {/* S */}
            <div>
              <h3 className="font-bold text-sm text-[#202122] dark:text-white mb-1">
                S
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>
                  <button 
                    onClick={(e) => handleLinkClick('卫生巾', e)}
                    onMouseEnter={(e) => handleLinkHover('卫生巾', e)}
                    className="text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer"
                  >
                    衛生棉
                  </button>
                </li>
              </ul>
            </div>

            {/* 中 */}
            <div>
              <h3 className="font-bold text-sm text-[#202122] dark:text-white mb-1">
                中
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>
                  <button 
                    onClick={(e) => handleLinkClick('中国大陆铁路卫生巾售卖争议', e)}
                    onMouseEnter={(e) => handleLinkHover('中国大陆铁路卫生巾售卖争议', e)}
                    className="text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer"
                  >
                    中国大陆铁路卫生巾售卖争议
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            {/* 女 */}
            <div>
              <h3 className="font-bold text-sm text-[#202122] dark:text-white mb-1">
                女
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>
                  <button 
                    onClick={(e) => handleLinkClick('女性生理用品', e)}
                    onMouseEnter={(e) => handleLinkHover('女性生理用品', e)}
                    className="text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer font-medium"
                  >
                    女性生理用品
                  </button>
                </li>
              </ul>
            </div>

            {/* 月 */}
            <div>
              <h3 className="font-bold text-sm text-[#202122] dark:text-white mb-1">
                月
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>
                  <button 
                    onClick={(e) => handleLinkClick('月经杯', e)}
                    onMouseEnter={(e) => handleLinkHover('月经杯', e)}
                    className="text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer"
                  >
                    月经杯
                  </button>
                </li>
              </ul>
            </div>

            {/* 粉 */}
            <div>
              <h3 className="font-bold text-sm text-[#202122] dark:text-white mb-1">
                粉
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>
                  <button 
                    onClick={(e) => handleLinkClick('粉红税', e)}
                    onMouseEnter={(e) => handleLinkHover('粉红税', e)}
                    className="text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer"
                  >
                    粉紅稅
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            {/* 卫 */}
            <div>
              <h3 className="font-bold text-sm text-[#202122] dark:text-white mb-1">
                卫
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>
                  <button 
                    onClick={() => onNavigateToArticle()}
                    onMouseEnter={(e) => handleLinkHover('卫生棉条', e)}
                    className="text-[#3366cc] dark:text-[#6699ff] font-semibold hover:underline cursor-pointer"
                    title="点击阅读卫生棉条条目详情"
                  >
                    ★ 衛生棉條 (Tampon)
                  </button>
                </li>
              </ul>
            </div>

            {/* 护 */}
            <div>
              <h3 className="font-bold text-sm text-[#202122] dark:text-white mb-1">
                护
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>
                  <button 
                    onClick={(e) => handleLinkClick('护垫', e)}
                    onMouseEnter={(e) => handleLinkHover('护垫', e)}
                    className="text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer"
                  >
                    護墊
                  </button>
                </li>
              </ul>
            </div>

            {/* 阴 */}
            <div>
              <h3 className="font-bold text-sm text-[#202122] dark:text-white mb-1">
                阴
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>
                  <button 
                    onClick={(e) => handleLinkClick('阴道菌群', e)}
                    onMouseEnter={(e) => handleLinkHover('阴道菌群', e)}
                    className="text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer"
                  >
                    陰道菌群
                  </button>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Parent Categories Box (维基百科页底分类条: 分类：个人卫生 | 女性生殖系统) */}
      <div id="parent-categories" className={`mt-8 p-2.5 rounded border text-xs flex items-center gap-2 flex-wrap transition-colors ${
        isDarkMode ? 'bg-[#27292d] border-[#54595d]' : 'bg-[#f8f9fa] border-[#a2a9b1]'
      }`}>
        <span className="text-[#3366cc] dark:text-[#6699ff] font-bold hover:underline cursor-pointer">
          分类
        </span>
        <span className="text-[#54595d] dark:text-[#a2a9b1]">:</span>
        <button
          onClick={(e) => handleLinkClick('个人卫生', e)}
          onMouseEnter={(e) => handleLinkHover('个人卫生', e)}
          className="text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer"
        >
          个人卫生
        </button>
        <span className="text-[#a2a9b1]">|</span>
        <button
          onClick={(e) => handleLinkClick('女性生殖系统', e)}
          onMouseEnter={(e) => handleLinkHover('女性生殖系统', e)}
          className="text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer"
        >
          女性生殖系统
        </button>
      </div>

    </div>
  );
};
