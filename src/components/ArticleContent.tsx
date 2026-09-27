import React, { useState } from 'react';
import { 
  Info, 
  ExternalLink, 
  Droplets, 
  Clock,
  BookOpen,
  GitBranch,
  Tag
} from 'lucide-react';
import { 
  ABSORBENCY_GRADES, 
  REFERENCES_DATA, 
  CATEGORIES_LIST,
  ReferenceItem,
  getWikiLinkTargetInfo
} from '../data/articleData';
import { WikipediaImageThumb, WikiImageData } from './WikipediaImageThumb';
import { WikipediaMediaViewer } from './WikipediaMediaViewer';

// Official Wikimedia images on the article page
const WIKI_IMAGES: WikiImageData[] = [
  {
    id: 'cellophane-tampon',
    filename: 'Tampon.JPG',
    title: '玻璃纸包装的卫生棉条',
    caption: '玻璃纸包装的卫生棉条。（图中的尺以公分为单位）',
    author: 'KaurJmeb (Wikimedia Commons)',
    license: '知识共享 署名-相同方式共享 3.0 / GFDL',
    date: '2006年6月8日',
    dimensions: '2,048 × 1,360 像素',
    fileSize: '482 KB',
    commonsUrl: 'https://commons.wikimedia.org/wiki/File:Tampon.JPG',
    type: 'cellophane'
  },
  {
    id: 'applicator-tampon',
    filename: 'Tampon with applicator.jpg',
    title: '导管型的卫生棉条',
    caption: '导管型卫生棉条',
    author: 'Wikimedia Commons 贡献者',
    license: 'CC BY-SA 3.0 / GFDL',
    date: '2007年3月15日',
    dimensions: '1,800 × 1,200 像素',
    fileSize: '340 KB',
    commonsUrl: 'https://commons.wikimedia.org/wiki/File:Tampon_with_applicator.jpg',
    type: 'applicator'
  },
  {
    id: 'tampon-elements',
    filename: 'Elements of a tampon with applicator.jpg',
    title: '导管型卫生棉条的构造拆解',
    caption: '导管型卫生棉条的构造拆解：1. 棉条 2. 外管 3. 内管 4. 绳子 5. 防菌包装纸',
    author: 'Wikimedia Commons 贡献者',
    license: 'CC BY-SA 3.0',
    date: '2008年11月2日',
    dimensions: '1,600 × 1,100 像素',
    fileSize: '310 KB',
    commonsUrl: 'https://commons.wikimedia.org/wiki/File:Elements_of_a_tampon_with_applicator.jpg',
    type: 'elements'
  },
  {
    id: 'tampon-absorbency',
    filename: 'Tamponlable.jpg',
    title: '卫生棉条吸收量级别标示',
    caption: '卫生棉条外包装上的吸收量级别标签标示（Light / Regular / Super / Super Plus）',
    author: 'FDA / Wikimedia Commons',
    license: '公有领域 (Public Domain)',
    date: '2010年4月',
    dimensions: '1,200 × 750 像素',
    fileSize: '220 KB',
    commonsUrl: 'https://commons.wikimedia.org/wiki/File:Tamponlable.jpg',
    type: 'absorbency'
  },
  {
    id: 'tampon-anatomy',
    filename: 'Vaginal tampon placement.svg',
    title: '卫生棉条在阴道内的放置位置',
    caption: '卫生棉条在女性骨盆及阴道内的放置位置剖面示意图',
    author: 'Wikimedia Commons 贡献者',
    license: 'CC BY-SA 4.0',
    date: '2015年9月',
    dimensions: '矢量图 (SVG)',
    fileSize: '85 KB',
    commonsUrl: 'https://commons.wikimedia.org/wiki/File:Vaginal_tampon.png',
    type: 'anatomy'
  }
];

interface ArticleContentProps {
  onOpenWikiLink: (term: string, event: React.MouseEvent) => void;
  onOpenReference: (ref: ReferenceItem, event: React.MouseEvent) => void;
  onNavigateSection: (sectionId: string) => void;
  onNavigateWikiTerm?: (term: string) => void;
  isDarkMode: boolean;
  contentWidth: 'standard' | 'wide';
  onNavigateHome?: () => void;
  onNavigateCategory?: () => void;
  onNavigateGraph?: () => void;
  onNavigateTags?: (tag?: string) => void;
}

export const ArticleContent: React.FC<ArticleContentProps> = ({
  onOpenWikiLink,
  onOpenReference,
  onNavigateSection,
  onNavigateWikiTerm,
  isDarkMode,
  contentWidth,
  onNavigateCategory,
  onNavigateGraph,
  onNavigateTags
}) => {
  const [selectedAbsorbency, setSelectedAbsorbency] = useState<number>(1); // index for Regular
  const [activeMediaImageId, setActiveMediaImageId] = useState<string | null>(null);

  const handleOpenMedia = (image: WikiImageData) => {
    setActiveMediaImageId(image.id);
  };

  const renderRef = (id: number) => {
    const refItem = REFERENCES_DATA.find(r => r.id === id);
    if (!refItem) return null;
    return (
      <sup className="ml-0.5 select-none font-sans font-normal text-[11px]">
        <button
          onClick={(e) => onOpenReference(refItem, e)}
          onMouseEnter={(e) => onOpenReference(refItem, e)}
          className="text-[#3366cc] hover:underline px-0.5"
          title={`参考资料 [${id}]`}
        >
          [{id}]
        </button>
      </sup>
    );
  };

  const renderWikiLink = (term: string, customLabel?: string) => {
    const target = getWikiLinkTargetInfo(term);
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          // Directly navigate according to target mapping:
          if (target.inArticleSectionId) {
            onNavigateSection(target.inArticleSectionId);
          } else if (onNavigateWikiTerm) {
            onNavigateWikiTerm(term);
          } else {
            onOpenWikiLink(term, e);
          }
        }}
        onMouseEnter={(e) => onOpenWikiLink(term, e)}
        className="text-[#3366cc] dark:text-[#6699ff] hover:underline font-inherit inline cursor-pointer text-left font-medium"
        title={target.inArticleSectionId ? `点击跳转至本文章节：${target.inArticleSectionTitle}` : `点击访问条目：${term}`}
      >
        {customLabel || term}
      </button>
    );
  };

  return (
    <article className={`space-y-6 leading-relaxed transition-colors ${
      contentWidth === 'standard' ? 'max-w-[880px]' : 'max-w-none'
    }`}>
      {/* Hatnote (维基百科消歧义提示) */}
      <div className={`p-2.5 rounded border text-xs flex items-start gap-2.5 not-italic italic ${
        isDarkMode 
          ? 'bg-[#27292d] border-[#3a3d42] text-[#bdc1c6]' 
          : 'bg-[#f8f9fa] border-[#c8ccd1] text-[#54595d]'
      }`}>
        <Info className="w-4 h-4 text-[#3366cc] shrink-0 mt-0.5 not-italic" />
        <div>
          本文介绍的是女性月经期间吸收经血的个人卫生用品。关于其他医学外科或急救用途的填塞棉球与止血栓，请见「
          {renderWikiLink('棉球')}
          」与「
          {renderWikiLink('止血栓')}
          」。
        </div>
      </div>

      {/* Article Knowledge Graph Quick Launcher Bar */}
      {onNavigateGraph && (
        <div className={`px-3 py-2 rounded border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-colors ${
          isDarkMode ? 'bg-[#181d24] border-[#2c3d53]' : 'bg-[#f0f7ff] border-[#c2dbff]'
        }`}>
          <div className="flex items-center gap-2 text-[#54595d] dark:text-[#bdc1c6]">
            <GitBranch className="w-3.5 h-3.5 text-[#3366cc] shrink-0" />
            <span>本条目已构建多维知识图谱（包含 TSS 急症机制、解剖定位与历史品牌网络）。</span>
          </div>
          <button
            onClick={onNavigateGraph}
            className="text-[#3366cc] dark:text-[#6699ff] font-semibold hover:underline inline-flex items-center gap-1 shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <span>探索概念网络图谱</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* LEAD SECTION (导言章节 - 完全遵循官方维基百科) */}
      {/* ============================================================== */}
      <div id="top" className="text-[15px] space-y-3.5 relative overflow-hidden">
        {/* Official Wikipedia Thumbnail: 玻璃纸包装的卫生棉条 */}
        <WikipediaImageThumb
          image={WIKI_IMAGES[0]}
          width={240}
          align="right"
          isDarkMode={isDarkMode}
          onImageClick={handleOpenMedia}
        />

        <p className="text-justify leading-[1.8]">
          <strong className="font-bold text-[#202122] dark:text-white">
            卫生棉条
          </strong>
          （英语：<span lang="en">Tampon</span>，又称<strong className="font-bold text-[#202122] dark:text-white">棉条</strong>或<strong className="font-bold text-[#202122] dark:text-white">卫生栓</strong>），是一种圆柱状的吸收材料，作为女性
          {renderWikiLink('月经')}
          来潮时的卫生用品，用以置入阴道中吸收经血。英语中的名称“tampon”借自法语，意为一块堵塞孔洞的布料、栓或塞{renderRef(1)}。
        </p>

        <p className="text-justify leading-[1.8]">
          卫生棉条的材质主要是由棉、
          {renderWikiLink('粘胶纤维')}
          或这两种材质混合而成，有直径1公分到1.9公分等尺寸，尾端附有一条棉线（拉绳），方便使用后拉出。根据置入方式，卫生棉条主要分为带导管的「<strong>导管型卫生棉条</strong>」与不用导管的「<strong>指入式卫生棉条</strong>」{renderRef(2)}{renderRef(3)}。相较于
          {renderWikiLink('卫生巾')}
          ，卫生棉条在体内直接吸收经血，能减少异味和经期闷热感，但在使用时应注意在建议时间（4至8小时）内更换，以防止罕见但严重的
          {renderWikiLink('中毒性休克综合征')}
          （TSS）{renderRef(6)}{renderRef(7)}。
        </p>
      </div>

      <div className="clear-both" />

      {/* ============================================================== */}
      {/* SECTION 1: 卫生棉条的历史 (官方中文维基百科原文核心) */}
      {/* ============================================================== */}
      <section id="history" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          1 卫生棉条的历史
        </h2>

        {/* Official Wikipedia Thumbnail: 导管型卫生棉条 */}
        <WikipediaImageThumb
          image={WIKI_IMAGES[1]}
          width={240}
          align="right"
          isDarkMode={isDarkMode}
          onImageClick={handleOpenMedia}
        />

        <div className="space-y-3.5 text-[15px]">
          <p className="text-justify leading-[1.8]">
            古代希腊的女性常会将麻布包裹在木头上，类似于现代的卫生棉条{renderRef(4)}。古埃及亦有使用软化压制的莎草纸卷吸纳经血的记载{renderRef(11)}。
          </p>

          <p className="text-justify leading-[1.8]">
            导管式的卫生棉条是由美国丹佛的
            {renderWikiLink('厄尔·哈斯')}
            （Earle Haas）医生于1929年发明，1931年申请专利，1936年在美国上市{renderRef(2)}。另一种说法是，卫生棉条是由西德的一位妇科女医师，在1950年所设计出来的女性用品{renderRef(3)}。由于使用卫生棉条不影响衣着和运动，受到了许多人的青睐，欧美女性使用较多。由于多数亚洲人并不习惯使用置入性卫生用品，卫生棉条在亚洲国家的女性中使用比例较少。<span className="text-xs text-[#3366cc] cursor-pointer hover:underline">[来源请求]</span>
          </p>

          <p className="text-justify leading-[1.8]">
            全球有一些地方将卫生棉条列为医用品。美国食品药品监督管理局（FDA）将其列为二级医疗用品。台湾卫生署1989年公告实施法令中，明列卫生棉条归类为2级侵入式医疗用品{renderRef(2)}，与避孕套同级，目的是要国内生产商在医疗等级的环境进行生产及良好的品管，进口商则需要提供输入途径的资讯，食药署也会进行抽检，而在产品包装上则要列明生产商、物料、使用方法、制造日期及有效期间等资料{renderRef(3)}，法令并不限制一般消费者从零售商购买卫生棉条。
          </p>
        </div>
      </section>

      <div className="clear-both" />

      {/* ============================================================== */}
      {/* SECTION 2: 棉条的构造与类型 (官方中文维基百科原文结构) */}
      {/* ============================================================== */}
      <section id="structure-and-types" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          2 棉条的构造与类型
        </h2>

        {/* Official Wikipedia Thumbnail: 导管型卫生棉条的构造拆解 */}
        <WikipediaImageThumb
          image={WIKI_IMAGES[2]}
          width={260}
          align="right"
          isDarkMode={isDarkMode}
          onImageClick={handleOpenMedia}
        />

        <div className="space-y-3.5 text-[15px]">
          <p className="text-justify leading-[1.8]">
            卫生棉条的材质主要是由棉、人造纤维或这两种材质混合而成，有直径1公分到1.9公分等尺寸，尾端附有棉线（拉绳）。卫生棉条的尖端的圆弧程度各家厂牌有所不同，让使用者可依自己的使用习惯选择。卫生棉条的本体上常有直线型或斜纹型的压痕，可增加卫生棉条导流的能力，在吸收经血膨胀时能与阴道壁贴合。
          </p>
        </div>

        {/* 2.1 导管型的卫生棉条 */}
        <div id="applicator-tampons" className="space-y-3 mt-6 mb-6">
          <h3 className="text-lg font-serif font-semibold text-[#202122] dark:text-[#eaecf0]">
            2.1 导管型的卫生棉条
          </h3>
          <p className="text-justify leading-[1.8] text-[15px]">
            导管型的卫生棉条附纸质或塑胶质导管，方便使用者导入棉条。导管整体构造又分为外管和内管：
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-justify text-[14px]">
            <li>
              <strong>外管：</strong> 表面平滑，前端是圆头的，以便插入。外管前端是圆滑的半球状，并有类似花瓣状的开口，圆滑的设计能方便插入阴道{renderRef(1)}。
            </li>
            <li>
              <strong>内管：</strong> 是一枝推杆，以活塞的方式将外管内的导管推出，将吸收体送入阴道深处，随后退出内外导管{renderRef(2)}。
            </li>
          </ul>
        </div>

        {/* 2.2 指入式的卫生棉条 */}
        <div id="digital-tampons" className="space-y-3 mb-6">
          <h3 className="text-lg font-serif font-semibold text-[#202122] dark:text-[#eaecf0]">
            2.2 指入式的卫生棉条
          </h3>
          <p className="text-justify leading-[1.8] text-[15px]">
            指入式的卫生棉条没有导管，使用者需要直接用洗净的手指将棉条推入阴道。相较于导管型，指入式体积小巧便携、无一次性塑胶废弃物，更具环保性{renderRef(3)}。
          </p>
        </div>

        {/* 2.3 吸收量规格与水滴标示 */}
        <div id="absorbency-standards" className="space-y-4 mb-6">
          <h3 className="text-lg font-serif font-semibold text-[#202122] dark:text-[#eaecf0]">
            2.3 吸收量规格与水滴标示
          </h3>

          {/* Official Wikipedia Thumbnail: 吸收量标签说明 */}
          <WikipediaImageThumb
            image={WIKI_IMAGES[3]}
            width={260}
            align="right"
            isDarkMode={isDarkMode}
            onImageClick={handleOpenMedia}
          />

          <p className="text-justify leading-[1.8] text-[15px]">
            卫生棉条与卫生棉一样，有不同的吸收力。大部分的厂牌会将棉条的吸收力以水滴图示标示在包装盒上，从一滴水到六滴水不等，水滴数量越多代表吸收能力越强：
          </p>

          {/* Absorbency Capacity Comparison */}
          <div className={`p-4 rounded border transition-all ${
            isDarkMode ? 'bg-[#1e2022] border-[#54595d]' : 'bg-[#f8f9fa] border-[#c8ccd1]'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-sm flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#3366cc]" />
                <span>FDA / 国际卫生棉条标准吸收量分级</span>
              </div>
              <span className="text-xs text-[#72777d] font-mono">点击查看规格</span>
            </div>

            {/* Segmented Grade Switcher */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mb-4">
              {ABSORBENCY_GRADES.map((grade, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAbsorbency(idx)}
                  className={`p-2 rounded text-left border transition-all ${
                    selectedAbsorbency === idx
                      ? 'bg-white dark:bg-[#34373c] border-[#3366cc] shadow-xs ring-1 ring-[#3366cc]'
                      : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs font-bold text-[#202122] dark:text-white truncate">
                    <span>{grade.name.split(' / ')[0]}</span>
                  </div>
                  <div className="text-[11px] text-[#72777d] dark:text-[#a2a9b1] truncate font-mono">
                    {grade.nameEn}
                  </div>
                  <div className="text-[11px] font-semibold mt-1" style={{ color: grade.colorCode }}>
                    {grade.weightRange}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Grade Detail Card */}
            {ABSORBENCY_GRADES[selectedAbsorbency] && (
              <div className={`p-3.5 rounded border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${
                isDarkMode ? 'bg-[#27292d] border-[#3a3d42]' : 'bg-white border-[#eaecf0]'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#202122] dark:text-white">
                      {ABSORBENCY_GRADES[selectedAbsorbency].name}
                    </span>
                    <span className="font-mono text-[#72777d]">({ABSORBENCY_GRADES[selectedAbsorbency].nameEn})</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/5 dark:bg-white/10" style={{ color: ABSORBENCY_GRADES[selectedAbsorbency].colorCode }}>
                      吸血量：{ABSORBENCY_GRADES[selectedAbsorbency].weightRange}
                    </span>
                  </div>
                  <div className="text-[#54595d] dark:text-[#bdc1c6]">
                    <strong>适用流量：</strong>{ABSORBENCY_GRADES[selectedAbsorbency].flowLevel}
                  </div>
                  <div className="text-[#72777d] dark:text-[#9aa0a6]">
                    <strong>建议选用：</strong>{ABSORBENCY_GRADES[selectedAbsorbency].recommendedUse}
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-black/5 dark:bg-white/10 px-3 py-2 rounded-full shrink-0">
                  <span className="text-[11px] font-medium mr-1">水滴图示：</span>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-base transition-opacity ${
                        i < ABSORBENCY_GRADES[selectedAbsorbency].waterDrops ? 'opacity-100 scale-110' : 'opacity-20'
                      }`}
                    >
                      💧
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="clear-both" />

      {/* ============================================================== */}
      {/* SECTION 3: 使用方法 (官方中文维基百科原文核心步骤) */}
      {/* ============================================================== */}
      <section id="usage-guide" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          3 使用方法
        </h2>

        {/* Official Wikipedia Thumbnail: 骨盆放置位置解剖图解 */}
        <WikipediaImageThumb
          image={WIKI_IMAGES[4]}
          width={250}
          align="right"
          isDarkMode={isDarkMode}
          onImageClick={handleOpenMedia}
        />

        {/* 3.1 置入姿势与清洁准备 */}
        <div id="preparation-posture" className="space-y-3 mb-6">
          <h3 className="text-lg font-serif font-semibold text-[#202122] dark:text-[#eaecf0]">
            3.1 置入姿势与清洁准备
          </h3>
          <p className="text-justify leading-[1.8] text-[15px]">
            在置入卫生棉条前，使用者必须用肥皂和清水<strong>洗净双手</strong>，以避免细菌带入体内引起感染{renderRef(9)}。
          </p>
          <p className="text-justify leading-[1.8] text-[15px]">
            置入时应选择舒适的姿势，例如坐在马桶上且双膝分开、一只脚跨在马桶盖或高处、或是蹲着，使身体肌肉放松，便于找到阴道口并减少摩擦阻力{renderRef(12)}。
          </p>
        </div>

        {/* 3.2 置入步骤与深度 */}
        <div id="insertion-applicator" className="space-y-4 mb-6">
          <h3 className="text-lg font-serif font-semibold text-[#202122] dark:text-[#eaecf0]">
            3.2 置入步骤与深度
          </h3>
          <p className="text-justify leading-[1.8] text-[15px]">
            置入卫生棉条时，应将棉条或导管前端对准阴道口，朝大约45度后上方方向轻轻推入阴道深处。对于导管式棉条，在外管推到手指触及身体后，以食指推动内管将棉条推入阴道后穹窿区域，随后取出导管；指入式棉条则直接以手指推入大约两指节深{renderRef(5)}。
          </p>
          <p className="text-justify leading-[1.8] text-[15px]">
            <strong>位置与异物感：</strong> 由于阴道深部缺乏触觉神经末梢，若棉条推入足够深度，使用者通常完全不会有异物感。如果感到疼痛或异物感，通常是因为推入不够深入，卡在神经敏感的阴道口外段，此时可调整位置或取出重新置入{renderRef(9)}。
          </p>
        </div>

        {/* 3.3 取出与更换时间 */}
        <div id="removal-frequency" className="space-y-3 mb-6">
          <h3 className="text-lg font-serif font-semibold text-[#202122] dark:text-[#eaecf0]">
            3.3 取出与更换时间
          </h3>
          <p className="text-justify leading-[1.8] text-[15px]">
            棉条尾端悬挂于阴道外的棉线是用于取出棉条的。取出时只需放松肌肉，抓住棉线顺着倾斜角度轻轻拉出即可。用过的卫生棉条应包裹后扔进垃圾桶，<strong>切勿冲入马桶</strong>以免堵塞管道{renderRef(1)}。
          </p>
          <div className={`p-3 rounded border border-l-4 border-l-[#eab308] text-xs space-y-1 ${
            isDarkMode ? 'bg-[#27292d] border-[#3a3d42]' : 'bg-[#fffbeb] border-[#fde68a]'
          }`}>
            <div className="font-bold flex items-center gap-1.5 text-[#b45309] dark:text-[#fbbf24]">
              <Clock className="w-4 h-4" />
              <span>更换时间规范</span>
            </div>
            <p className="text-[#92400e] dark:text-[#fde68a] leading-relaxed">
              通常建议<strong>每4至8小时更换一次</strong>，单次放置最长时间<strong>不得超过8小时</strong>。夜间睡眠时间若预计超过8小时，建议改用卫生巾或夜用生理裤{renderRef(1)}{renderRef(6)}。
            </p>
          </div>
        </div>
      </section>

      <div className="clear-both" />

      {/* ============================================================== */}
      {/* SECTION 4: 棉条的迷思 (官方中文维基百科重点章节) */}
      {/* ============================================================== */}
      <section id="common-myths" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          4 棉条的迷思
        </h2>

        {/* 4.1 处女膜与处女使用迷思 */}
        <div id="myth-hymen" className="space-y-3 mb-6">
          <h3 className="text-lg font-serif font-semibold text-[#202122] dark:text-[#eaecf0]">
            4.1 处女膜与处女使用迷思
          </h3>
          <p className="text-justify leading-[1.8] text-[15px]">
            许多人认为处女不能使用卫生棉条，担心棉条会破坏
            {renderWikiLink('阴道冠')}
            （俗称处女膜）。实际上，处女膜并不是一层完全封闭的膜，而是一个富有弹性的黏膜褶皱组织，中间天然存在孔隙供经血流出（孔径通常约为1.5至2.5公分）。而卫生棉条未吸血时的直径多在1.3公分以下，只要放松身体、选择较小规格（如量少型）并正确放置，通常不会损坏处女膜{renderRef(5)}{renderRef(15)}。医学权威机构亦表明，无性经验的女性同样可以安全使用卫生棉条。
          </p>
        </div>

        {/* 4.2 棉条在体内迷失的迷思 */}
        <div id="myth-lost-uterus" className="space-y-3 mb-6">
          <h3 className="text-lg font-serif font-semibold text-[#202122] dark:text-[#eaecf0]">
            4.2 棉条在体内迷失的迷思
          </h3>
          <p className="text-justify leading-[1.8] text-[15px]">
            有人担心棉条会滑入子宫或在身体内部“迷失”。从人体解剖学来看这是不可能的。阴道是一个盲管，顶端被子宫颈口严密封闭，正常情况下子宫颈口仅有数毫米大小，棉条绝不可能穿透子宫颈进入子宫或腹腔内部{renderRef(1)}{renderRef(12)}。棉条最多只能到达阴道后穹窿，即使拉绳断裂，也可以通过蹲姿自行取出或由妇科医生取出。
          </p>
        </div>

        {/* 4.3 如厕排尿与异物感迷思 */}
        <div id="myth-urination" className="space-y-3 mb-6">
          <h3 className="text-lg font-serif font-semibold text-[#202122] dark:text-[#eaecf0]">
            4.3 如厕排尿与异物感迷思
          </h3>
          <p className="text-justify leading-[1.8] text-[15px]">
            女性的尿道口与阴道口是两个独立分离的生理开口，排尿来自尿道，棉条位于阴道内，因此如厕排尿完全不需要将棉条取出，只需在排尿时将体外的拉绳轻轻拨向一侧避免沾湿即可{renderRef(1)}。此外，在游泳或运动时使用棉条能有效防止经血外溢且无外观痕迹。
          </p>
        </div>
      </section>

      <div className="clear-both" />

      {/* ============================================================== */}
      {/* SECTION 5: 相关疾病 (官方中文维基百科重点章节) */}
      {/* ============================================================== */}
      <section id="safety-and-tss" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#ba0000] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          5 相关疾病
        </h2>

        {/* 5.1 中毒性休克综合征 */}
        <div id="tss-mechanism" className="space-y-3 mb-6">
          <h3 className="text-lg font-serif font-semibold text-[#202122] dark:text-[#eaecf0]">
            5.1 中毒性休克综合征（TSS）
          </h3>
          <p className="text-justify leading-[1.8] text-[15px]">
            使用卫生棉条最受医学关注的相关并发症是
            {renderWikiLink('中毒性休克综合征')}
            （Toxic Shock Syndrome, TSS）。TSS是一种罕见但可能致命的细菌感染，主要是由
            {renderWikiLink('金黄色葡萄球菌')}
            （<span className="italic">Staphylococcus aureus</span>）产生的毒素进入血液所引起{renderRef(7)}。症状包括突发高烧、血压急剧下降、呕吐、腹泻、类似于晒伤的皮疹、头晕甚至昏厥等，严重时可导致休克和多器官衰竭{renderRef(6)}{renderRef(14)}。
          </p>
        </div>

        {/* 5.2 病因与预防措施 */}
        <div id="prevention-guidelines" className="space-y-3 mb-6">
          <h3 className="text-lg font-serif font-semibold text-[#202122] dark:text-[#eaecf0]">
            5.2 病因与预防措施
          </h3>
          <p className="text-justify leading-[1.8] text-[15px]">
            棉条引起TSS的主要原因在于长时间未更换或使用了吸收力过强的棉条，导致阴道黏膜干燥受损，并为金黄色葡萄球菌繁殖提供温床。为降低感染风险，建议遵循以下预防措施{renderRef(1)}{renderRef(6)}：
          </p>
          <ul className="list-disc pl-6 space-y-1 text-justify text-[14px]">
            <li>在处理和置入棉条前务必彻底清洁双手。</li>
            <li>根据经血流量选择满足需要的<strong>最低吸收力棉条</strong>，不要为了延长使用时间而盲目使用超强吸收型。</li>
            <li>至少每4至8小时更换一次棉条，单次留置时间绝对不可超过8小时。</li>
            <li>可在经量较少或夜间睡眠时与卫生巾交替使用。</li>
            <li>非经期切勿使用卫生棉条吸收普通分泌物。</li>
            <li>若在使用棉条期间出现高烧、皮疹、呕吐或腹泻等疑似TSS症状，应立即取出棉条并就医。</li>
          </ul>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 6: 环境影响与可持续性 */}
      {/* ============================================================== */}
      <section id="environmental-impact" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          6 环境影响与可持续性
        </h2>
        <div className="space-y-3.5 text-[15px]">
          <p className="text-justify leading-[1.8]">
            传统塑料导管卫生棉条的一次性废弃物对环境产生了一定负担。近年来，环保无导管指入式棉条、生物可降解纸质导管棉条、有机棉棉条，以及可重复利用的
            {renderWikiLink('布卫生巾')}
            和
            {renderWikiLink('月经杯')}
            等替代产品逐渐受到更多关注与选择{renderRef(4)}{renderRef(13)}。
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 7: 相关条目 */}
      {/* ============================================================== */}
      <section id="see-also" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          7 相关条目
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { term: '卫生巾', desc: '女性经期外部吸收用品' },
            { term: '月经杯', desc: '硅胶可重复使用经期用品' },
            { term: '月经', desc: '女性周期性排卵生理现象' },
            { term: '中毒性休克综合征', desc: '金葡菌外毒素严重急症' },
            { term: '阴道冠', desc: '阴道口周围黏膜弹性皱襞' },
            { term: '厄尔·哈斯', desc: '导管型卫生棉条发明者' },
            { term: '布卫生巾', desc: '环保织物经期吸收用品' },
            { term: '粘胶纤维', desc: '人造棉纤维素材料' }
          ].map((item, idx) => {
            const target = getWikiLinkTargetInfo(item.term);
            return (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  if (target.inArticleSectionId) {
                    onNavigateSection(target.inArticleSectionId);
                  } else if (onNavigateWikiTerm) {
                    onNavigateWikiTerm(item.term);
                  } else {
                    onOpenWikiLink(item.term, e);
                  }
                }}
                onMouseEnter={(e) => onOpenWikiLink(item.term, e)}
                title={target.inArticleSectionId ? `点击跳转至本文章节：${target.inArticleSectionTitle}` : `点击访问条目：${item.term}`}
                className={`p-2.5 rounded border text-left transition-colors flex items-start gap-2 cursor-pointer ${
                  isDarkMode 
                    ? 'bg-[#27292d] border-[#3a3d42] hover:border-[#3366cc]' 
                    : 'bg-[#f8f9fa] border-[#eaecf0] hover:border-[#3366cc]'
                }`}
              >
                <BookOpen className="w-4 h-4 text-[#3366cc] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#3366cc]">
                    {item.term}
                  </div>
                  <div className="text-[11px] text-[#72777d] dark:text-[#a2a9b1] truncate">
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 8: 参考资料 */}
      {/* ============================================================== */}
      <section id="references" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          8 参考资料
        </h2>
        <div className="text-xs leading-relaxed columns-1 md:columns-2 gap-6 space-y-2">
          {REFERENCES_DATA.map((ref) => (
            <div 
              key={ref.id} 
              id={`cite_note-${ref.id}`}
              className="break-inside-avoid text-[#54595d] dark:text-[#a2a9b1] pl-5 relative"
            >
              <span className="absolute left-0 top-0 font-mono text-[#72777d]">
                <a href={`#ref-${ref.id}`} className="hover:text-[#3366cc]">^</a> [{ref.id}]
              </span>
              <span>
                {ref.authors && <strong className="font-semibold text-[#202122] dark:text-white">{ref.authors}. </strong>}
                <span className="italic">"{ref.title}"</span>. {ref.source} ({ref.date}).{' '}
                {ref.doi && (
                  <span className="font-mono text-[11px]">
                    doi:<a href={`https://doi.org/${ref.doi}`} target="_blank" rel="noreferrer" className="text-[#3366cc] hover:underline">{ref.doi}</a>.{' '}
                  </span>
                )}
                {ref.pmid && (
                  <span className="font-mono text-[11px]">
                    PMID:<a href={`https://pubmed.ncbi.nlm.nih.gov/${ref.pmid}`} target="_blank" rel="noreferrer" className="text-[#3366cc] hover:underline">{ref.pmid}</a>.{' '}
                  </span>
                )}
                {ref.url && (
                  <a href={ref.url} target="_blank" rel="noreferrer" className="text-[#3366cc] hover:underline inline-flex items-center gap-0.5 ml-1">
                    <span>[在线存档]</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 9: 外部链接 */}
      {/* ============================================================== */}
      <section id="external-links" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          9 外部链接
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-xs text-[#3366cc]">
          <li>
            <a 
              href="https://www.fda.gov/consumers/consumer-updates/facts-tampons-and-how-use-them-safely" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:underline inline-flex items-center gap-1"
            >
              <span>美国食品药品监督管理局（U.S. FDA）：卫生棉条的安全使用与规范说明</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </li>
          <li>
            <a 
              href="https://commons.wikimedia.org/wiki/Category:Tampons" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:underline inline-flex items-center gap-1"
            >
              <span>维基共享资源上的相关多媒体与解剖图解：Tampons</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </li>
          <li>
            <a 
              href="https://www.acog.org/womens-health/faqs/your-first-period" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:underline inline-flex items-center gap-1"
            >
              <span>美国妇产科学会（ACOG）：初潮与青春期经期护理常见问答</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </li>
        </ul>
      </section>

      {/* ============================================================== */}
      {/* Article Tags Box (维基百科条目主题标签方块) */}
      {/* ============================================================== */}
      <div className={`p-2.5 rounded border text-xs flex items-center gap-2 flex-wrap transition-colors mb-3 ${
        isDarkMode ? 'bg-[#27292d] border-[#54595d]' : 'bg-[#f8f9fa] border-[#a2a9b1]'
      }`}>
        <span className="font-bold text-[#54595d] dark:text-[#a2a9b1] shrink-0 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-[#3366cc]" />
          <span>主题标签：</span>
        </span>
        {['经期用品', '体内吸收', '急性重症', 'TSST-1', '8小时安全限', '微生态', '弱酸自净', '无感区', '弹性黏膜', '现代专利', '纯棉', '反羞辱'].map((tag, idx) => (
          <button
            key={idx}
            onClick={() => onNavigateTags ? onNavigateTags(tag) : onNavigateGraph?.()}
            className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 hover:bg-[#3366cc]/10 hover:text-[#3366cc] dark:hover:text-[#6699ff] text-[#54595d] dark:text-[#a2a9b1] cursor-pointer transition-colors flex items-center gap-1 font-mono text-[11px]"
            title={`点击在标签系统中检索所有包含 #${tag} 的知识实体`}
          >
            <span>#{tag}</span>
          </button>
        ))}
        {onNavigateTags && (
          <button
            onClick={() => onNavigateTags()}
            className="text-[#3366cc] dark:text-[#6699ff] hover:underline ml-auto font-medium cursor-pointer flex items-center gap-1"
          >
            <span>全域标签索引 »</span>
          </button>
        )}
      </div>

      {/* ============================================================== */}
      {/* Categories Box (维基百科页底分类方块) */}
      {/* ============================================================== */}
      <div className={`p-2.5 rounded border text-xs flex items-center gap-2 flex-wrap transition-colors ${
        isDarkMode ? 'bg-[#27292d] border-[#54595d]' : 'bg-[#f8f9fa] border-[#a2a9b1]'
      }`}>
        <span className="font-bold text-[#54595d] dark:text-[#a2a9b1] shrink-0">
          分类：
        </span>
        {CATEGORIES_LIST.map((cat, idx) => (
          <React.Fragment key={idx}>
            <a
              href={`/wiki/Category:${encodeURIComponent(cat)}`}
              onClick={(e) => {
                e.preventDefault();
                if (cat === '女性生理用品' && onNavigateCategory) {
                  onNavigateCategory();
                } else if (onNavigateCategory) {
                  onNavigateCategory();
                }
              }}
              className="text-[#3366cc] hover:underline cursor-pointer"
            >
              {cat}
            </a>
            {idx < CATEGORIES_LIST.length - 1 && (
              <span className="text-[#a2a9b1]">|</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Wikipedia MediaViewer Lightbox Modal */}
      <WikipediaMediaViewer
        images={WIKI_IMAGES}
        currentImageId={activeMediaImageId}
        onClose={() => setActiveMediaImageId(null)}
        onSelectImage={(id) => setActiveMediaImageId(id)}
      />
    </article>
  );
};
