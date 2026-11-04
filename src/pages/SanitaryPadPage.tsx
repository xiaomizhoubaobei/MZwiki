import React, { useState } from 'react';
import {
  Info,
  ExternalLink,
  Droplets,
  Clock,
  BookOpen,
  GitBranch,
  Tag,
  BookmarkCheck,
  Activity,
  ShieldCheck,
  Layers,
  Recycle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Printer
} from 'lucide-react';
import { ReferenceItem, getWikiLinkTargetInfo } from '../data/articleData';
import {
  SANITARY_PAD_SPECS,
  SANITARY_PAD_IMAGES,
  SANITARY_PAD_REFERENCES
} from '../data/sanitaryPadData';
import { WikipediaImageThumb, WikiImageData } from '../components/WikipediaImageThumb';
import { WikipediaMediaViewer } from '../components/WikipediaMediaViewer';

interface SanitaryPadPageProps {
  onOpenWikiLink: (term: string, event: React.MouseEvent) => void;
  onOpenReference: (ref: ReferenceItem, event: React.MouseEvent) => void;
  onNavigateSection: (sectionId: string) => void;
  onNavigateWikiTerm?: (term: string) => void;
  isDarkMode: boolean;
  contentWidth: 'standard' | 'wide';
  onNavigateTamponArticle?: (sectionId?: string) => void;
  onNavigateCategory?: () => void;
  onNavigateGraph?: () => void;
  onNavigateTags?: (tag?: string) => void;
  onOpenCitation?: () => void;
  onOpenHealthRadar?: () => void;
  onPrint?: () => void;
}

export const SanitaryPadPage: React.FC<SanitaryPadPageProps> = ({
  onOpenWikiLink,
  onOpenReference,
  onNavigateSection,
  onNavigateWikiTerm,
  isDarkMode,
  contentWidth,
  onNavigateTamponArticle,
  onNavigateCategory,
  onNavigateGraph,
  onNavigateTags,
  onOpenCitation,
  onOpenHealthRadar,
  onPrint
}) => {
  const [selectedSpecIdx, setSelectedSpecIdx] = useState<number>(2); // Default: Regular Day Pad 240mm
  const [activeSurfaceTab, setActiveSurfaceTab] = useState<'mesh' | 'nonwoven' | 'cotton'>('nonwoven');
  const [activeMediaImageId, setActiveMediaImageId] = useState<string | null>(null);

  const handleOpenMedia = (image: WikiImageData) => {
    setActiveMediaImageId(image.id);
  };

  const renderRef = (id: number) => {
    const refItem = SANITARY_PAD_REFERENCES.find(r => r.id === id);
    if (!refItem) return null;
    return (
      <sup className="ml-0.5 select-none font-sans font-normal text-[11px]">
        <a
          href={`#pad-cite_note-${id}`}
          onClick={(e) => {
            e.preventDefault();
            onOpenReference(refItem, e);
          }}
          onMouseEnter={(e) => onOpenReference(refItem, e)}
          className="text-[#3366cc] dark:text-[#6699ff] hover:underline px-0.5 cursor-pointer"
        >
          [{id}]
        </a>
      </sup>
    );
  };

  const renderWikiLink = (term: string, displayText?: string) => {
    const clean = term.replace(/[（(].*?[）)]/g, '').trim();
    return (
      <a
        href={`/wiki/${encodeURIComponent(clean)}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (clean === '卫生棉条' || clean === '衛生棉條') {
            onNavigateTamponArticle?.();
          } else if (onNavigateWikiTerm) {
            onNavigateWikiTerm(clean);
          } else {
            onOpenWikiLink(term, e);
          }
        }}
        onMouseEnter={(e) => onOpenWikiLink(term, e)}
        title={`访问维基百科条目：${clean}`}
        className="text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer font-normal"
      >
        {displayText || term}
      </a>
    );
  };

  const currentSpec = SANITARY_PAD_SPECS[selectedSpecIdx] || SANITARY_PAD_SPECS[2];

  return (
    <article
      className={`wiki-article-body leading-[1.78] space-y-6 ${
        contentWidth === 'standard' ? 'max-w-[980px]' : 'max-w-none'
      }`}
    >
      {/* Wikipedia Region & Terminology Hatnote (地区词转换与消歧义顶注) */}
      <div
        id="top"
        className={`p-3 rounded border-l-4 border-l-[#3366cc] border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors ${
          isDarkMode
            ? 'bg-[#202122] border-[#54595d] text-[#c8ccd1]'
            : 'bg-[#f8f9fa] border-[#c8ccd1] text-[#54595d]'
        }`}
      >
        <div className="flex items-start sm:items-center gap-2">
          <Info className="w-4 h-4 text-[#3366cc] shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>名称与地区词转换说明：</strong>本条目介绍贴附于内裤内侧的外置经血吸收用品，在台湾、港澳及新马地区常称作「<strong>衛生棉</strong>」（又作生理棉），在中国大陆常称作「<strong>卫生巾</strong>」，粤语口语亦称「<strong>M巾</strong>」。关于置入阴道内部吸收经血的圆柱状生理用品，请参见姊妹典范条目「{renderWikiLink('卫生棉条', '卫生棉条（衛生棉條）')}」。
          </span>
        </div>
        <a
          href="https://zh.wikipedia.org/wiki/%E8%A1%9B%E7%94%9F%E6%A3%89"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[#3366cc] dark:text-[#6699ff] hover:underline shrink-0 font-mono text-[11px]"
        >
          <span>zh.wikipedia.org/wiki/衛生棉</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* ============================================================== */}
      {/* LEAD SECTION & RIGHT INFOBOX                                   */}
      {/* ============================================================== */}
      <div className="clearfix">
        {/* Right-aligned Wikipedia Medical & Hygiene Device Infobox */}
        <aside
          className={`w-full sm:w-[320px] sm:float-right sm:ml-6 mb-5 border rounded p-3 text-xs space-y-2.5 transition-colors select-none ${
            isDarkMode
              ? 'bg-[#202122] border-[#54595d] text-[#eaecf0]'
              : 'bg-[#f8f9fa] border-[#a2a9b1] text-[#202122]'
          }`}
        >
          <div className="bg-[#3366cc]/15 dark:bg-[#3366cc]/25 text-center py-2 px-3 rounded-xs border-b border-[#3366cc]/30">
            <div className="font-serif font-bold text-base text-[#202122] dark:text-white">
              卫生棉 / 卫生巾
            </div>
            <div className="text-[11px] text-[#54595d] dark:text-[#a2a9b1] italic font-serif">
              Sanitary Napkin / Sanitary Pad / Menstrual Pad
            </div>
          </div>

          {/* Infobox Main Image */}
          <div className="flex justify-center">
            <WikipediaImageThumb
              image={SANITARY_PAD_IMAGES[0]}
              width={285}
              align="none"
              isDarkMode={isDarkMode}
              onImageClick={handleOpenMedia}
            />
          </div>

          <table className="w-full text-left border-collapse text-[12px]">
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              <tr>
                <th className="py-1.5 pr-2 font-semibold text-[#54595d] dark:text-[#a2a9b1] w-28 align-top">
                  汉语地区名称
                </th>
                <td className="py-1.5">
                  <div><strong>台湾/港澳/新马：</strong>衛生棉、生理棉</div>
                  <div><strong>中国大陆：</strong>卫生巾、卫生垫</div>
                  <div><strong>香港粤语：</strong>M巾</div>
                </td>
              </tr>
              <tr>
                <th className="py-1.5 pr-2 font-semibold text-[#54595d] dark:text-[#a2a9b1] align-top">
                  作用方式
                </th>
                <td className="py-1.5">
                  体外吸收型（借由底部背胶与两侧蝶翼贴附于内裤裆部内侧）
                </td>
              </tr>
              <tr>
                <th className="py-1.5 pr-2 font-semibold text-[#54595d] dark:text-[#a2a9b1] align-top">
                  四层复合构造
                </th>
                <td className="py-1.5">
                  ① 透水表层（棉柔无纺布 / PE打孔膜）<br />
                  ② 瞬吸导流层（ADL）<br />
                  ③ 吸收芯（木浆 + 高分子吸水树脂 SAP）<br />
                  ④ 防漏透气 PE 底膜 + 热熔压敏背胶
                </td>
              </tr>
              <tr>
                <th className="py-1.5 pr-2 font-semibold text-[#54595d] dark:text-[#a2a9b1] align-top">
                  商业化起点
                </th>
                <td className="py-1.5">
                  1921年（美国金佰利公司推出首款商业抛弃式卫生棉 Kotex 靠得住/高洁丝）
                </td>
              </tr>
              <tr>
                <th className="py-1.5 pr-2 font-semibold text-[#54595d] dark:text-[#a2a9b1] align-top">
                  建议更换时限
                </th>
                <td className="py-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                  日间每 2 至 4 小时更换一次（严防细菌滋生与接触性皮炎）
                </td>
              </tr>
              <tr>
                <th className="py-1.5 pr-2 font-semibold text-[#54595d] dark:text-[#a2a9b1] align-top">
                  质量与卫生标准
                </th>
                <td className="py-1.5 font-mono text-[11px]">
                  • 中国大陆：GB/T 8939-2018、GB 15979-2024<br />
                  • 台湾标准：CNS 9324<br />
                  • 美国监管：FDA 21 CFR 884.5425 / 5435
                </td>
              </tr>
            </tbody>
          </table>
        </aside>

        {/* Lead Paragraphs */}
        <div className="space-y-4 text-sm sm:text-[15.5px] text-[#202122] dark:text-[#eaecf0] text-justify">
          <p>
            <strong>卫生棉</strong>（英语：<strong>Sanitary napkin</strong>、<strong>Sanitary towel</strong>、<strong>Sanitary pad</strong> 或 <strong>Menstrual pad</strong>），在中国大陆通称为<strong>卫生巾</strong>，亦称<strong>生理棉</strong>、<strong>月经垫</strong>或粤语口语中的<strong>M巾</strong>，是一种具高吸液能力的片状个人生理卫生用品{renderRef(1)}。其主要使用方式为贴附于女性内裤裆部内侧，用来吸收女性{renderWikiLink('月经')}来潮期间自阴道排出的经血，或用于吸收产妇分娩后的产后恶露（Lochia）、妇科手术后出血及日常阴道分泌物{renderRef(1)}{renderRef(6)}。
          </p>

          <p>
            与置入阴道腔内吸收经血的{renderWikiLink('卫生棉条')}及在体内收集经血的{renderWikiLink('月经杯')}不同，卫生棉属于<strong>体外吸收型生理用品</strong>{renderRef(1)}。现代商业化一次性（抛弃式）卫生棉通常采用精密的四层复合工程结构：直接接触外阴皮肤的<strong>亲水透液表层</strong>（由纯棉、热风/水刺不织布无纺布或微孔PE打孔膜制成）、促进液体迅速纵向扩散的<strong>导流层（ADL）</strong>、由棉状绒毛木浆与<strong>高分子吸收体（SAP，交联聚丙烯酸钠树脂）</strong>复合而成的<strong>强力锁水内芯</strong>，以及底部的<strong>微孔透气聚乙烯（PE）防漏底膜与压敏背胶</strong>{renderRef(1)}{renderRef(4)}。
          </p>

          <p>
            从人类使用海绵、草木灰、碎布袋与可洗白布条的古代历史，到第一次世界大战期间木浆纤维棉（Cellucotton）催生出1921年世界首款商业抛弃式卫生棉（Kotex 靠得住/高洁丝）{renderRef(2)}，再到1970年代免除生理带的<strong>自粘式背胶</strong>与1989年<strong>防漏蝶翼（侧翼）及丝薄化技术</strong>的问世，卫生棉的工业演进深刻改善了全球数十亿女性的经期健康、行动自由与社会劳动参与度{renderRef(1)}{renderRef(3)}。与此同时，一次性卫生棉所含的高比例不可降解塑胶成分也引发了当代环境科学界的高度关注，推动了<strong>可水洗{renderWikiLink('布卫生巾', '布卫生棉')}</strong>、可生物降解植物基材料以及消除“月经贫困”与“{renderWikiLink('粉红税')}”等全球公共卫生议题的深入发展{renderRef(11)}{renderRef(12)}。
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 1: 历史演进                                            */}
      {/* ============================================================== */}
      <section id="pad-history" className="pt-2 space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1">
          1 历史演进
        </h2>

        <div className="clearfix space-y-4 text-sm sm:text-[15px]">
          <WikipediaImageThumb
            image={SANITARY_PAD_IMAGES[2]}
            width={300}
            align="right"
            isDarkMode={isDarkMode}
            onImageClick={handleOpenMedia}
          />

          <h3 id="pad-history-ancient" className="text-lg font-serif font-bold text-[#202122] dark:text-white pt-1">
            1.1 古代至19世纪：草木灰、布袋与卫生围裙
          </h3>
          <p>
            在工业化抛弃式生理用品问世之前，世界各地的女性主要就地取材，利用天然植物纤维、织物或动物海绵应对经期出血{renderRef(1)}。远古穴居时代的女性曾使用海水中的天然海绵、干草或苔藓吸收经血；古埃及女性使用软化的纸莎草叶（Papyrus），而古希腊女性则使用麻布包裹小木片{renderRef(1)}。
          </p>
          <p>
            在古代中国与东亚传统社会中，妇女普遍使用名为“<strong>月经带</strong>”或“<strong>月事布</strong>”的可缝洗长条白棉布。女性往往将草木灰（富含碳酸钾、经高温煅烧具备一定吸湿与抑菌作用）或干净棉絮装入小布囊中，两端系上细绳绑在腰间，使用后拆开倒去灰烬，再以清水加明矾反复搓洗晾干{renderRef(1)}。由于传统社会视经血为不洁禁忌（参见{renderWikiLink('月经禁忌')}），女性常被迫在背光阴暗处晾晒月经带，极易因潮湿霉变引发外阴与生殖道感染。
          </p>
          <p>
            进入19世纪的欧美地区，女性普遍使用装填棉絮或旧碎布的“碎布袋”（Rag bags），或穿戴所谓的“<strong>卫生围裙</strong>”（Sanitary apron）——一种在臀部衬有不透水生橡胶垫的裙撑式固定带，虽能防止经血沾染外衣，但极为闷热笨重且难以彻底清洁{renderRef(1)}{renderRef(3)}。
          </p>

          <h3 id="pad-history-ww1" className="text-lg font-serif font-bold text-[#202122] dark:text-white pt-2">
            1.2 一战纤维棉与1921年商业抛弃式诞生
          </h3>
          <p>
            现代一次性卫生棉的诞生直接源于第一次世界大战期间的军事医疗材料革新{renderRef(1)}{renderRef(2)}。1914年一战爆发后，医用脱脂棉极度紧缺，美国<strong>金佰利-克拉克公司</strong>（Kimberly-Clark）于1914至1917年间利用高纯度木浆纤维研发出一种名为“<strong>纤维棉</strong>”（Cellucotton）的创伤敷料。实验室测试表明，这种木浆纤维棉的吸水倍率与吸液速度比传统纯棉高出约5倍，且大批量生产成本仅为棉花的一半{renderRef(2)}。
          </p>
          <p>
            在前线战地医院服役的美国红十字会护士们很快发现，用医用纱布包裹这种高吸水性纤维棉，不仅能高效处理士兵创口，更是极佳的经期抛弃式吸收垫{renderRef(1)}{renderRef(2)}。一战结束后，军用绷带订单骤减，金佰利公司采纳战地护士的使用经验，将“棉花质感”（<strong>Cot</strong>ton <strong>tex</strong>ture）缩写为品牌名 <strong>Kotex</strong>（在台湾译作“靠得住”，在中国大陆及港澳译作“高洁丝”），于<strong>1920年底至1921年</strong>正式在美推出人类历史上第一款广泛成功商业化的抛弃式卫生棉{renderRef(1)}{renderRef(2)}。1927年，强生公司（Johnson & Johnson）亦跟进推出了竞争品牌 Modess{renderRef(1)}。
          </p>
          <p>
            然而，1920年代至1960年代的早期抛弃式卫生棉底部<strong>并没有黏胶</strong>。卫生棉两端留有长长的纱布尾条，使用者必须在腰间穿戴一条富有弹性的“<strong>生理带</strong>”（Sanitary belt），将棉垫两端的纱布条穿过生理带前后的金属卡扣或用安全别针固定{renderRef(1)}{renderRef(3)}。这种设计在行走或运动时极易发生前后滑脱与侧漏。
          </p>

          <h3 id="pad-history-modern" className="text-lg font-serif font-bold text-[#202122] dark:text-white pt-2">
            1.3 现代革新：自粘背胶、蝶翼与高分子超薄化
          </h3>
          <p>
            20世纪下半叶，卫生棉先后经历了三次改写行业格局的工程技术飞跃{renderRef(1)}：
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>自粘式压敏背胶的诞生（1969–1970年代）：</strong>1969年底至1970年代初，娇生旗下 Stayfree 与金佰利 New Freedom 率先推出底部涂布热熔压敏背胶（Adhesive strip）并覆有防粘离型纸的“免生理带卫生棉”（Beltless pads）{renderRef(3)}。使用者只需撕下背面的离型纸即可将卫生棉稳固粘贴于紧身内裤裆部，短短数年内彻底淘汰了沿用半个世纪的生理带与安全别针{renderRef(1)}{renderRef(3)}。
            </li>
            <li>
              <strong>防漏蝶翼（侧翼）与干爽打孔网面（1980年代）：</strong>1980年代初，宝洁公司（P&G）在旗下 Always（护舒宝）品牌中引入了漏斗形微孔聚乙烯（PE）打孔表层（Dri-Weave）以及<strong>两侧向外延展的护翼/蝶翼（Wings）</strong>设计（1984–1989年间全球普及）{renderRef(1)}。蝶翼可向外反折牢牢包覆内裤两侧边缘，既防止内裤边沿被经血污染，又大幅提升了卫生棉在剧烈活动中的抗移位能力{renderRef(1)}。
            </li>
            <li>
              <strong>高分子吸收体（SAP）与超薄丝薄化革命（1989–1990年代至今）：</strong>1989至1990年代，随着交联聚丙烯酸钠<strong>高分子吸水树脂（SAP）</strong>与高吸液聚合物复合纸的引入，卫生棉不再依赖厚达1厘米以上的蓬松木浆棉垫，厚度骤降至1至2毫米的“<strong>丝薄/超薄型卫生棉</strong>”以及近年来的“<strong>液体卫生巾</strong>”（高压乳化聚合物泡沫芯体）与“<strong>裤型卫生棉（安睡裤）</strong>”相继问世，兼顾了超大吸收容量与近乎无感的贴身穿着体验{renderRef(1)}{renderRef(4)}。
            </li>
          </ul>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 2: 构造与吸收工程                                      */}
      {/* ============================================================== */}
      <section id="pad-structure" className="pt-2 space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1">
          2 构造与吸收工程
        </h2>

        <div className="clearfix space-y-4 text-sm sm:text-[15px]">
          <WikipediaImageThumb
            image={SANITARY_PAD_IMAGES[1]}
            width={320}
            align="right"
            isDarkMode={isDarkMode}
            onImageClick={handleOpenMedia}
          />

          <h3 id="pad-structure-layers" className="text-lg font-serif font-bold text-[#202122] dark:text-white pt-1">
            2.1 四层复合工程结构剖析
          </h3>
          <p>
            一片标准的现代复合型卫生棉并非单一棉垫，而是按照流体力学单向导流原理精密层压而成的四层（或多层）功能结构体{renderRef(1)}{renderRef(4)}：
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>表层（Top-sheet / 面层）：</strong>直接与女性外阴皮肤及黏膜接触的第一层结构。其核心工程要求是<strong>亲水速渗、低回渗与柔软亲肤</strong>——即当具有一定黏稠度与细胞碎片的经血接触表层时，能迅速穿过纤维间隙或漏斗微孔向下渗透，同时阻断下层液体反流回皮肤表面{renderRef(1)}{renderRef(5)}。
            </li>
            <li>
              <strong>导流扩散层（Acquisition Distribution Layer，简称 ADL / 瞬吸蓝芯）：</strong>位于表层与吸收芯之间的次表层非织造布结构。由于经血往往集中涌向卫生棉中央局部区域，ADL 利用毛细管压力梯度，将向下渗透的液体迅速向前后纵向及左右横向均匀导流扩散，避免中央局部过早饱和溢漏，并进一步起到单向防回渗阀门的作用{renderRef(4)}。
            </li>
            <li>
              <strong>内层吸收锁水芯（Absorbent Core）：</strong>卫生棉的核心储液舱。由经亲水化处理的<strong>棉状绒毛木浆（Fluff pulp）</strong>、<strong>高分子吸收体颗粒（SAP）</strong>或高分子聚合物复合吸水纸（Airlaid）包裹而成，负责将导流下来的经血迅速吸入并锁化为不流动的凝胶状态{renderRef(1)}{renderRef(4)}。
            </li>
            <li>
              <strong>防漏底膜与背胶层（Backsheet & Adhesive）：</strong>位于卫生棉最底部，通常采用微孔透气聚乙烯（PE）薄膜，阻隔经血向下渗透弄脏内裤；底膜外侧及蝶翼背面涂有平行条状的<strong>热熔压敏背胶（Hot-melt pressure-sensitive adhesive）</strong>，出厂时由硅油离型纸或一体式外包膜保护{renderRef(1)}。
            </li>
          </ol>

          <h3 id="pad-structure-wings" className="text-lg font-serif font-bold text-[#202122] dark:text-white pt-2">
            2.2 导流压花槽、立体防漏侧边与蝶翼力学
          </h3>
          <p>
            为了应对人体在站立、行走、久坐及睡眠翻身时大腿根部的挤压变形，现代卫生棉在表面与两侧进行了多重立体防漏设计{renderRef(1)}：
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              <strong>环形导流压花槽（Embossing channels）：</strong>通过热压或超声波压花工艺，在棉垫表面形成前窄后宽的封闭环状或花瓣状导流沟槽，引导经血优先在圈内纵向流动，防止液体直接向两侧边缘漫溢。
            </li>
            <li>
              <strong>立体防漏侧边（Leak guards / 立体护围）：</strong>在中高阶日用与夜用型卫生棉吸收芯两侧，设有内含弹性橡筋的拒水（疏水）无纺布立体隔边。当卫生棉贴合并自然弯曲时，两侧护围自动竖起约0.5至1.5厘米的柔性堤坝，阻挡潮涌时的横向侧漏{renderRef(1)}。
            </li>
            <li>
              <strong>蝶翼/侧翼（Wings）：</strong>从卫生棉中段两侧向外延伸的翼状贴片，向内裤底面反折粘贴后，可有效固定棉身中心位置，防止大腿走动摩擦导致棉垫扭曲成团。
            </li>
          </ul>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 3: 核心材质科学 (含交互式材质对比面板)                 */}
      {/* ============================================================== */}
      <section id="pad-materials" className="pt-2 space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1">
          3 核心材质科学
        </h2>

        <h3 id="pad-materials-surface" className="text-lg font-serif font-bold text-[#202122] dark:text-white pt-1">
          3.1 表层材质：PE打孔干爽网面与棉柔无纺布
        </h3>
        <p className="text-sm sm:text-[15px]">
          卫生棉表层材质直接决定了干爽度、透气性与外阴皮肤致敏率。根据维基百科及材料学分类，市场主流表层主要分为<strong>PE打孔网膜（干爽网面）</strong>、<strong>棉柔不织布（无纺布）</strong>与<strong>100%纯棉表层</strong>三大类{renderRef(1)}{renderRef(5)}：
        </p>

        {/* Interactive Surface Material Selector */}
        <div
          className={`p-4 rounded-lg border transition-colors ${
            isDarkMode ? 'bg-[#1a1c1e] border-[#3a3d42]' : 'bg-[#f8f9fa] border-[#c8ccd1]'
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 mb-3 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#3366cc]" />
              <span className="font-serif font-bold text-sm text-[#202122] dark:text-white">
                表层材料工程学与皮肤科特性交互对比
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {[
                { key: 'nonwoven' as const, label: '棉柔不织布（主流）' },
                { key: 'mesh' as const, label: 'PE打孔网面（干爽）' },
                { key: 'cotton' as const, label: '100%天然纯棉（低敏）' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveSurfaceTab(tab.key)}
                  className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    activeSurfaceTab === tab.key
                      ? 'bg-[#3366cc] text-white font-semibold shadow-xs'
                      : 'bg-black/5 dark:bg-white/5 text-[#54595d] dark:text-[#a2a9b1] hover:bg-black/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeSurfaceTab === 'nonwoven' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded bg-white dark:bg-[#22252a] border border-black/5 dark:border-white/5 space-y-1">
                <div className="font-bold text-[#3366cc]">物理与化学构成</div>
                <p className="text-[#54595d] dark:text-[#a2a9b1]">
                  并非天然棉花，而是由聚丙烯（PP）或聚酯（PET）合成纤维经<strong>热风穿透（Through-air bonded）</strong>或水刺工艺制成的不织布（无纺布），表面经过亲水表面活性剂整理。
                </p>
              </div>
              <div className="p-3 rounded bg-white dark:bg-[#22252a] border border-black/5 dark:border-white/5 space-y-1">
                <div className="font-bold text-emerald-600 dark:text-emerald-400">核心优势</div>
                <p className="text-[#54595d] dark:text-[#a2a9b1]">
                  纤维蓬松柔软，触感接近棉织物，摩擦系数低，不易引起外阴大阴唇内侧皮肤机械性摩擦红肿，性价比高，是目前亚洲市场占有率最高的表层类型。
                </p>
              </div>
              <div className="p-3 rounded bg-white dark:bg-[#22252a] border border-black/5 dark:border-white/5 space-y-1">
                <div className="font-bold text-amber-600 dark:text-amber-400">局限与注意事项</div>
                <p className="text-[#54595d] dark:text-[#a2a9b1]">
                  涌量较大时表面残余湿润感略高于PE打孔网膜，需勤于每2–3小时更换以保持干爽。
                </p>
              </div>
            </div>
          )}

          {activeSurfaceTab === 'mesh' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded bg-white dark:bg-[#22252a] border border-black/5 dark:border-white/5 space-y-1">
                <div className="font-bold text-[#3366cc]">物理与化学构成</div>
                <p className="text-[#54595d] dark:text-[#a2a9b1]">
                  采用聚乙烯（PE）高分子塑胶薄膜，经真空热吸塑或机械打孔制成上宽下窄的<strong>三维微孔漏斗状网膜（Perforated film）</strong>{renderRef(1)}。
                </p>
              </div>
              <div className="p-3 rounded bg-white dark:bg-[#22252a] border border-black/5 dark:border-white/5 space-y-1">
                <div className="font-bold text-emerald-600 dark:text-emerald-400">核心优势</div>
                <p className="text-[#54595d] dark:text-[#a2a9b1]">
                  漏斗形微孔具备极强的单向导流效应：经血一旦下渗即难以逆向回流，且PE材料本身不吸水，表面能始终维持极佳的“瞬吸干爽”感{renderRef(1)}{renderRef(5)}。
                </p>
              </div>
              <div className="p-3 rounded bg-white dark:bg-[#22252a] border border-black/5 dark:border-white/5 space-y-1">
                <div className="font-bold text-amber-600 dark:text-amber-400">局限与注意事项</div>
                <p className="text-[#54595d] dark:text-[#a2a9b1]">
                  质地相对偏硬且透气度较低，部分敏感肤质女性在闷热夏季或长时间行走摩擦后易诱发外阴接触性皮炎（俗称“卫生棉疹”）{renderRef(1)}{renderRef(5)}。
                </p>
              </div>
            </div>
          )}

          {activeSurfaceTab === 'cotton' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded bg-white dark:bg-[#22252a] border border-black/5 dark:border-white/5 space-y-1">
                <div className="font-bold text-[#3366cc]">物理与化学构成</div>
                <p className="text-[#54595d] dark:text-[#a2a9b1]">
                  采用<strong>100%天然植物棉花纤维（或有机棉）</strong>经高压水刺缠结织造而成，不含石化聚丙烯/聚乙烯塑料纤维与化学粘合剂。
                </p>
              </div>
              <div className="p-3 rounded bg-white dark:bg-[#22252a] border border-black/5 dark:border-white/5 space-y-1">
                <div className="font-bold text-emerald-600 dark:text-emerald-400">核心优势</div>
                <p className="text-[#54595d] dark:text-[#a2a9b1]">
                  天然植物纤维温和透气、亲肤性最佳、几乎零致敏性，特别适合外阴皮肤高度敏感、易发湿疹或产后外阴侧切伤口愈合期的女性使用{renderRef(5)}。
                </p>
              </div>
              <div className="p-3 rounded bg-white dark:bg-[#22252a] border border-black/5 dark:border-white/5 space-y-1">
                <div className="font-bold text-amber-600 dark:text-amber-400">局限与注意事项</div>
                <p className="text-[#54595d] dark:text-[#a2a9b1]">
                  纯棉纤维本身具有一定亲水保水性，吸入经血后表层湿度高于合成纤维与PE网膜，且原料成本较高。
                </p>
              </div>
            </div>
          )}
        </div>

        <h3 id="pad-materials-sap" className="text-lg font-serif font-bold text-[#202122] dark:text-white pt-2">
          3.2 吸收芯体：棉状木浆与高分子吸收体（SAP）
        </h3>
        <p className="text-sm sm:text-[15px]">
          卫生棉内层的吸水锁水能力取决于两大核心材料的协同配比{renderRef(1)}{renderRef(4)}：
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm sm:text-[15px]">
          <li>
            <strong>棉状纸浆（Fluff pulp / 绒毛木浆）：</strong>由针叶林木浆经漂白与机械粉碎制成的蓬松纤维素纤维。其微细毛细管网络能快速吸纳初涌出的经血，但单独使用时锁水力较弱，受压（如坐下时）容易将吸收的液体重新挤出。
          </li>
          <li>
            <strong>高分子吸收体（Super Absorbent Polymer，简称 SAP / 高分子吸水树脂）：</strong>化学成分通常为轻度交联的<strong>聚丙烯酸钠（Sodium polyacrylate）</strong>白色微细颗粒{renderRef(4)}。当经血中的水分接触 SAP 颗粒时，钠离子解离产生显著的高分子链静电斥力与渗透压差，使其在数十秒内吸收自身重量<strong>300至500倍</strong>的纯水（或约50至80倍的含盐血液），并发生溶胀转化为高强度的三维立体水凝胶。即使在人体坐卧施加重压下，锁在凝胶网格内的液体也不会回渗外溢，从而使超薄卫生棉（仅1–2毫米厚）具备远超传统厚棉垫的储液量{renderRef(1)}{renderRef(4)}。
          </li>
        </ul>

        <h3 id="pad-materials-backing" className="text-lg font-serif font-bold text-[#202122] dark:text-white pt-2">
          3.3 透气PE底膜与热熔压敏背胶
        </h3>
        <p className="text-sm sm:text-[15px]">
          卫生棉最底层采用防漏聚乙烯（PE）底膜。高品质卫生棉底膜通常混入超细碳酸钙颗粒后经双向拉伸形成纳米至微米级微孔——微孔直径大于水蒸气分子（约0.0004微米）而远小于液态水滴或血细胞（数十微米），从而实现“<strong>透湿气而不漏液态经血</strong>”的透气效果{renderRef(4)}。底膜外侧涂布医用级热熔压敏背胶，需符合国家标准（如 CNS 9324 与 GB/T 8939）的剥离强度规范：既要在行走运动中紧贴内裤不移位，又要在撕下更换时不在内裤织物上残留难以洗净的残胶{renderRef(6)}{renderRef(7)}。
        </p>
      </section>

      {/* ============================================================== */}
      {/* SECTION 4: 分类与规格标准 (含交互式规格探索器)                 */}
      {/* ============================================================== */}
      <section id="pad-types" className="pt-2 space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1">
          4 分类与规格标准
        </h2>

        <h3 id="pad-types-classification" className="text-lg font-serif font-bold text-[#202122] dark:text-white pt-1">
          4.1 按外形与功能用途分类
        </h3>
        <p className="text-sm sm:text-[15px]">
          根据中文维基百科与国际生理护理用品分类规范，一次性卫生棉按外形、吸收量与适用时段可分为以下主要类别{renderRef(1)}：
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-sm sm:text-[15px]">
          <li>
            <strong>基本型（直条无翼型）：</strong>两端呈圆弧状的长条形卫生棉，无两侧凸出护翼，更换便捷，常用于轻量期或与紧身生理裤搭配{renderRef(1)}。
          </li>
          <li>
            <strong>侧翼型（蝶翼型 / Winged pad）：</strong>两侧中段带有翼状贴片，可向外反折包覆内裤裆部两侧，防止侧漏与棉垫移位，是目前最普及的标准形态{renderRef(1)}。
          </li>
          <li>
            <strong>薄型 / 丝薄 / 极薄型（Ultra-thin pad）：</strong>利用高浓度 SAP 吸水复合纸将厚度压缩至 0.1–0.2 公分，大幅降低闷热感与外衣显形尴尬{renderRef(1)}。
          </li>
          <li>
            <strong>量多型 / 夜用加长型（Overnight pad）：</strong>长度通常在 28 公分至 42 公分之间，尾端设计有宽大的扇形尾翼以贴合臀部曲线，防止仰卧睡眠时经血顺股沟向后渗漏{renderRef(1)}。
          </li>
          <li>
            <strong>裤型卫生棉（安睡裤 / 经期安全裤）：</strong>将高弹力无纺布内裤与超长吸收芯融为一体的 360° 全包围穿戴式产品，适合夜间经血量特大或睡眠翻身频繁者。
          </li>
          <li>
            <strong>产妇专用垫（产褥垫 / 恶露垫 / Maternity pad）：</strong>专为分娩后最初 1–2 周排泄大量产后恶露设计，尺寸宽大且棉芯柔软蓬松，减少对会阴侧切或撕裂缝合伤口的摩擦压迫{renderRef(1)}。
          </li>
          <li>
            <strong>护垫（Pantyliner）：</strong>尺寸最小（14–18 公分）且极薄，通常不含或仅含微量吸水树脂，用于非经期排卵期分泌物（白带）增多、经期前后微量点滴出血或作为{renderWikiLink('卫生棉条')}的辅助保护垫{renderRef(1)}。
          </li>
        </ul>

        {/* Interactive Sanitary Pad Specification Selector */}
        <div
          id="pad-types-interactive"
          className={`p-4 rounded-xl border transition-colors my-4 ${
            isDarkMode ? 'bg-[#1a1c1e] border-[#3a3d42]' : 'bg-[#f8f9fa] border-[#c8ccd1]'
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#3366cc]" />
              <span className="font-serif font-bold text-sm text-[#202122] dark:text-white">
                4.2 卫生棉长度、厚度与吸收规格交互式对照表
              </span>
            </div>
            <span className="text-[11px] text-[#72777d] font-mono">
              点击下方规格标签切换尺寸与适用场景
            </span>
          </div>

          {/* Spec Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
            {SANITARY_PAD_SPECS.map((spec, idx) => {
              const isSelected = idx === selectedSpecIdx;
              return (
                <button
                  key={spec.id}
                  onClick={() => setSelectedSpecIdx(idx)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#3366cc] bg-[#3366cc]/10 dark:bg-[#3366cc]/20 ring-1 ring-[#3366cc]'
                      : 'border-black/10 dark:border-white/10 bg-white dark:bg-[#22252a] hover:border-[#3366cc]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: spec.colorCode }}
                    />
                    <span className="text-[10px] font-mono text-[#72777d]">
                      {'💧'.repeat(Math.min(spec.absorbencyDrops, 5))}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-[#202122] dark:text-white truncate">
                    {spec.twName}
                  </div>
                  <div className="text-[10px] font-mono text-[#54595d] dark:text-[#a2a9b1] mt-0.5">
                    {spec.lengthMm.split('（')[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Spec Detail Card */}
          <div
            className={`p-4 rounded-lg border grid grid-cols-1 md:grid-cols-12 gap-4 items-center ${
              isDarkMode ? 'bg-[#22252a] border-[#3a3d42]' : 'bg-white border-[#e2e8f0]'
            }`}
          >
            <div className="md:col-span-7 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="px-2 py-0.5 rounded text-xs font-bold text-white"
                  style={{ backgroundColor: currentSpec.colorCode }}
                >
                  {currentSpec.name}
                </span>
                <span className="text-xs font-mono text-[#72777d]">
                  ({currentSpec.nameEn})
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#202122] dark:text-[#eaecf0] leading-relaxed">
                <strong>临床与日常适用场景：</strong>{currentSpec.recommendedScenario}
              </p>
            </div>

            <div className="md:col-span-5 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-black/3 dark:bg-white/5">
                <div className="text-[10px] text-[#72777d]">标准长度范围</div>
                <div className="font-mono font-bold text-[#202122] dark:text-white mt-0.5">
                  {currentSpec.lengthMm}
                </div>
              </div>
              <div className="p-2.5 rounded bg-black/3 dark:bg-white/5">
                <div className="text-[10px] text-[#72777d]">标称饱和吸液量</div>
                <div className="font-mono font-bold text-[#3366cc] dark:text-[#6699ff] mt-0.5">
                  {currentSpec.typicalCapacityMl}
                </div>
              </div>
              <div className="p-2.5 rounded bg-black/3 dark:bg-white/5">
                <div className="text-[10px] text-[#72777d]">护翼结构形态</div>
                <div className="font-medium text-[#202122] dark:text-white mt-0.5">
                  {currentSpec.wingType}
                </div>
              </div>
              <div className="p-2.5 rounded bg-black/3 dark:bg-white/5">
                <div className="text-[10px] text-[#72777d]">中心厚度范围</div>
                <div className="font-mono font-medium text-[#202122] dark:text-white mt-0.5">
                  {currentSpec.thicknessMm}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 5: 使用方法与临床卫生规范                              */}
      {/* ============================================================== */}
      <section id="pad-hygiene" className="pt-2 space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1">
          5 使用方法与临床卫生规范
        </h2>

        <h3 id="pad-hygiene-interval" className="text-lg font-serif font-bold text-[#202122] dark:text-white pt-1">
          5.1 2至4小时更换原则与微生物学依据
        </h3>
        <p className="text-sm sm:text-[15px]">
          与在阴道无氧环境中吸收经血的{renderWikiLink('卫生棉条')}不同，卫生棉处于女性外阴与内裤构成的半密闭环境中{renderRef(10)}。经血自阴道流出后含有丰富的蛋白质、铁离子、脱落子宫内膜碎片及宫颈黏液，一旦暴露于外阴体表空气并与汗腺、皮脂腺分泌物混合，在人体 37°C 恒温与高湿度条件下，原本少量定植的表皮葡萄球菌、大肠埃希菌或白假丝酵母菌会在<strong>使用2至4小时后呈指数级增殖</strong>，同时细菌分解血液蛋白质会产生明显的胺类腥味{renderRef(10)}。
        </p>
        <p className="text-sm sm:text-[15px]">
          因此，妇产科与公共卫生指南一致强调：<strong>无论经血是否已经浸透整片卫生棉，日间均应每 2 至 4 小时更换一次新棉垫</strong>（经期后半段血量稀少时亦不可一片使用全天）{renderRef(10)}。此外，更换卫生棉前应彻底用肥皂洗手，避免手部杂菌在展平粘贴棉垫时污染亲水表层；卫生棉亦严禁储存在潮湿不见光的浴室柜内，以防霉菌孢子侵入未封口包装{renderRef(8)}。
        </p>

        <h3 id="pad-hygiene-dermatitis" className="text-lg font-serif font-bold text-[#202122] dark:text-white pt-2">
          5.2 外阴接触性皮炎（卫生棉疹）与香料致敏防范
        </h3>
        <p className="text-sm sm:text-[15px]">
          约5%至15%的女性在经期曾经历<strong>外阴刺激性或变应性接触性皮炎</strong>（Vulvar contact dermatitis，俗称“卫生棉疹”），表现为大阴唇外侧、腹股沟或会阴部出现对称性红斑、灼热与剧烈瘙痒{renderRef(5)}。临床皮肤科研究表明，主要诱因包括：
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-sm sm:text-[15px]">
          <li>
            <strong>长时间潮湿闷热与机械摩擦：</strong>更换不及时或穿着过紧的化纤内裤、牛仔裤，导致PE网膜边缘反复摩擦水合过度的外阴角质层{renderRef(5)}。
          </li>
          <li>
            <strong>人工香精、除臭剂与草本添加物致敏：</strong>部分市售香味型、凉感薄荷型或中草药卫生棉添加了芳香烃、薄荷醇及防腐剂。美国 FDA 明确将含香料或除臭剂的卫生棉（Scented menstrual pad）划归为比无香型更高风险等级的 <strong>II类（Class II）医疗器械</strong>{renderRef(9)}。妇科医师普遍建议敏感体质者首选<strong>无香精、无荧光增白剂、无染色印花</strong>的纯棉或热风棉柔表层产品{renderRef(5)}{renderRef(9)}。
          </li>
        </ul>

        <h3 id="pad-hygiene-comparison" className="text-lg font-serif font-bold text-[#202122] dark:text-white pt-2">
          5.3 卫生棉、卫生棉条与月经杯全维度对比
        </h3>
        <div className="overflow-x-auto my-3">
          <table
            className={`w-full border-collapse text-xs border ${
              isDarkMode ? 'border-[#54595d]' : 'border-[#a2a9b1]'
            }`}
          >
            <thead>
              <tr className={isDarkMode ? 'bg-[#27292d]' : 'bg-[#eaecf0]'}>
                <th className="p-2.5 border border-black/10 dark:border-white/10 text-left font-bold">
                  评估维度
                </th>
                <th className="p-2.5 border border-black/10 dark:border-white/10 text-left font-bold text-[#059669] dark:text-[#34d399]">
                  卫生棉 / 卫生巾（本条目）
                </th>
                <th className="p-2.5 border border-black/10 dark:border-white/10 text-left font-bold text-[#3366cc] dark:text-[#6699ff]">
                  {renderWikiLink('卫生棉条')}（Tampon）
                </th>
                <th className="p-2.5 border border-black/10 dark:border-white/10 text-left font-bold text-purple-600 dark:text-purple-400">
                  {renderWikiLink('月经杯')}（Menstrual Cup）
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              <tr>
                <td className="p-2.5 font-semibold">作用位置与机理</td>
                <td className="p-2.5">体外贴附内裤，吸收流出体外的经血</td>
                <td className="p-2.5">置入阴道中上段（后穹窿无感区）体内吸收</td>
                <td className="p-2.5">置入阴道内展开密封，直接收集经血（不吸水）</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">单次建议使用时长</td>
                <td className="p-2.5">日间每 2 – 4 小时（夜间可使用加长夜用型）</td>
                <td className="p-2.5">每 4 – 6 小时，<strong>严禁超过 8 小时</strong></td>
                <td className="p-2.5">最长可达 8 – 12 小时排空清洗一次</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">游泳与水下运动</td>
                <td className="p-2.5 text-red-600 dark:text-red-400">不可下水（遇水即刻吸水膨胀失效）</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400">完全支持游泳、温泉与剧烈运动</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400">完全支持游泳与各类水陆运动</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">TSS（中毒性休克）风险</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400">极低（不进入阴道内部，偶见外阴皮炎）</td>
                <td className="p-2.5 text-amber-600 dark:text-amber-400">罕见但存在（需严格遵循最低吸收量与8小时限）</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400">极低（需保持煮沸消毒与手部清洁）</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">上手门槛与普及度</td>
                <td className="p-2.5">零学习门槛，全球及亚洲普及率最高</td>
                <td className="p-2.5">需掌握 45° 生理倾角推入无感区技巧</td>
                <td className="p-2.5">需练习折叠置入与解除负压取出手法</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 6: 环保影响与可持续替代方案                            */}
      {/* ============================================================== */}
      <section id="pad-environment" className="pt-2 space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1">
          6 环保影响与可持续替代方案
        </h2>

        <div className="clearfix space-y-4 text-sm sm:text-[15px]">
          <WikipediaImageThumb
            image={SANITARY_PAD_IMAGES[3]}
            width={300}
            align="right"
            isDarkMode={isDarkMode}
            onImageClick={handleOpenMedia}
          />

          <h3 id="pad-environment-plastic" className="text-lg font-serif font-bold text-[#202122] dark:text-white pt-1">
            6.1 传统抛弃式卫生棉的塑胶足迹与降解难题
          </h3>
          <p>
            根据联合国环境规划署（UNEP）发布的《一次性经期用品及其替代方案生命周期评估（LCA）》报告，传统抛弃式卫生棉对全球固体废弃物与微塑料污染构成了可观的环境负担{renderRef(11)}。很多人误以为卫生棉主要由天然棉花制成，但实际上，一片常规抛弃式卫生棉按质量计含有高达<strong>up to 90% 的石化塑料等效成分</strong>（包括聚乙烯PE打孔膜或聚丙烯PP无纺布表层、聚丙烯酸钠高分子树脂、PE防漏底膜、热熔压敏胶以及独立塑料包装袋）——<strong>每片卫生棉所含的不可降解塑料约相当于 4 个普通塑料购物袋（约 2 至 3.4 克纯塑料）</strong>{renderRef(1)}{renderRef(11)}。
          </p>
          <p>
            按女性一生平均行经约 38 至 40 年（约 450 至 500 个月经周期）推算，单名女性一生约需消耗 <strong>10,000 至 15,000 片</strong>抛弃式生理用品{renderRef(11)}。由于沾染血液的卫生棉属于无法回收的医疗/生活混合垃圾，且严禁冲入马桶（SAP吸水膨胀后会造成市政排污管道严重堵塞），绝大多数废弃卫生棉最终进入垃圾填埋场或焚烧厂，其中的聚烯烃底膜与交联聚合物在自然环境中需要 <strong>500 至 800 年</strong>才能完全降解为微塑料{renderRef(11)}。
          </p>

          <h3 id="pad-environment-cloth" className="text-lg font-serif font-bold text-[#202122] dark:text-white pt-2">
            6.2 可水洗布卫生棉与生物可降解材质
          </h3>
          <p>
            为了减少一次性塑料垃圾，当代绿色设计界推出了两类核心环保替代方案{renderRef(1)}{renderRef(12)}：
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>现代布卫生棉（可水洗卫生棉 / {renderWikiLink('布卫生巾')}）：</strong>借鉴早期可洗棉布概念并结合现代功能性纺织技术，采用未漂白有机纯棉、竹纤维或纯棉法兰绒作为亲肤表层，内嵌多层超细纤维吸水芯，底层缝合防水透气的聚氨酯薄膜（PUL/TPU），两侧护翼不再使用粘胶，而是通过<strong>金属或树脂子母按扣（Snaps）</strong>环绕内裤底部扣合固定{renderRef(1)}{renderRef(12)}。使用后先以冷水（切忌用热水，以免血液中的血红蛋白受热凝固锁死在纤维中）浸泡搓洗，随后用弱碱性皂液洗净并在阳光紫外线下彻底晾干，单件可循环使用 3 至 5 年{renderRef(12)}。
            </li>
            <li>
              <strong>生物可降解卫生棉（Biodegradable pads）：</strong>采用认证有机棉、竹浆纤维、黄麻或香蕉树茎纤维替代石化表层与木浆，并以玉米淀粉基聚乳酸（PLA）生物塑料制作防漏底膜与外包装，在工业堆肥条件下可在 6 至 12 个月内实现超过 90% 的生物降解{renderRef(1)}{renderRef(11)}。
            </li>
          </ul>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 7: 社会文化、法规标准与经期平权                        */}
      {/* ============================================================== */}
      <section id="pad-society" className="pt-2 space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1">
          7 社会文化、法规标准与经期平权
        </h2>

        <h3 id="pad-society-standards" className="text-lg font-serif font-bold text-[#202122] dark:text-white pt-1">
          7.1 质量安全法规（GB/T 8939、CNS 9324 与 FDA）
        </h3>
        <p className="text-sm sm:text-[15px]">
          全球主要司法管辖区对卫生棉的物理性能、化学残留与微生物卫生指标均制定了严格的技术标准：
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm sm:text-[15px]">
          <li>
            <strong>中国大陆国家标准（GB/T 8939-2018 与 GB 15979-2024）：</strong>《卫生巾（护垫）》（GB/T 8939-2018）强制规范了产品的全长偏差（不得超过标称值 <strong>±4%</strong>）、吸水倍率（卫生巾须 <strong>≥7.0倍</strong>）、吸收速度、酸碱度（<strong>pH 4.0～9.0</strong>）、甲醛含量（≤75 mg/kg）及<strong>严禁检出可迁移性荧光物质</strong>{renderRef(6)}。同时，根据强制性卫生标准 GB 15979-2024，普通级卫生巾的细菌菌落总数须 ≤200 CFU/g，真菌菌落总数 ≤100 CFU/g，且不得检出大肠菌群、铜绿假单胞菌、{renderWikiLink('金黄色葡萄球菌')}与溶血性链球菌{renderRef(8)}。
          </li>
          <li>
            <strong>台湾国家标准（CNS 9324）：</strong>由中华民国经济部标准检验局（BSMI）颁布，对卫生棉的表面透湿度、吸水容量、防渗漏压力测试、pH酸碱值、可迁移性荧光物质及背胶剥离强度均设有严密检验规程{renderRef(7)}。
          </li>
          <li>
            <strong>美国食品药品监督管理局（FDA 21 CFR 884.5425 / 884.5435）：</strong>将卫生棉作为妇产科医疗器械监管，其中无香型卫生棉为 Class I 器械，含香精或除臭成分的卫生棉为 Class II 医疗器械{renderRef(9)}。
          </li>
        </ul>

        <h3 id="pad-society-equity" className="text-lg font-serif font-bold text-[#202122] dark:text-white pt-2">
          7.2 月经贫困、粉红税与公共场所供给争议
        </h3>
        <p className="text-sm sm:text-[15px]">
          尽管卫生棉是全球约19亿育龄女性每月不可或缺的生理刚需品，但“<strong>月经贫困</strong>”（Period poverty，即因经济拮据无法负担合格经期卫生用品）与“{renderWikiLink('粉红税')}”（对卫生棉等女性必需品课征非必需品增值税）仍是严峻的全球公共卫生与性别平权议题{renderRef(11)}。2020年，苏格兰议会全票通过《经期产品（免费提供）法案》，成为全球首个在学校与公共场所依法免费提供卫生棉与卫生棉条的地区。
        </p>
        <p className="text-sm sm:text-[15px]">
          在华人社会，2022年9月发生的“{renderWikiLink('中国大陆铁路卫生巾售卖争议')}”（女性乘客在高铁列车上面临突发月经却无法买到卫生巾，引发公众对高铁将卫生巾排除在基础保障商品之外的广泛讨论），以及2024年底消费者对部分市售卫生巾“实际棉芯长度缩水、全长偏差及绒毛浆原料标准”的公众质量监督，均极大地推动了中文互联网去经期羞耻化、公共场所增设免费/平价“月经互助盒”以及新一轮卫生巾国家标准的修订进程{renderRef(6)}{renderRef(8)}。
        </p>
      </section>

      {/* ============================================================== */}
      {/* SECTION 8: 参见                                                */}
      {/* ============================================================== */}
      <section id="pad-see-also" className="pt-2 print:hidden no-print">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          8 参见
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          {[
            { term: '卫生棉条', desc: '置入阴道内吸收经血的圆柱状棉芯（今日典范条目）', isTampon: true },
            { term: '月经杯', desc: '医用硅胶置入体内收集经血的可重复使用器具' },
            { term: '布卫生巾', desc: '纯棉与防水透气层构成的可重复水洗环保卫生棉' },
            { term: '高洁丝', desc: '1920年问世的全球首款商业抛弃式卫生棉品牌 Kotex' },
            { term: '月经', desc: '子宫内膜周期性脱落出血的生理过程' },
            { term: '粉红税', desc: '针对女性生理必需品的性别溢价与增值税争议' },
            { term: '中国大陆铁路卫生巾售卖争议', desc: '2022年引发广泛关注的公共场所生理用品保障事件' },
            { term: '月经禁忌', desc: '跨文化历史中对经期女性与经血的社会污名与迷思' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                if (item.isTampon && onNavigateTamponArticle) {
                  onNavigateTamponArticle();
                } else if (onNavigateWikiTerm) {
                  onNavigateWikiTerm(item.term);
                } else {
                  onOpenWikiLink(item.term, e);
                }
              }}
              onMouseEnter={(e) => onOpenWikiLink(item.term, e)}
              className={`p-2.5 rounded border text-left transition-colors flex items-start gap-2 cursor-pointer ${
                isDarkMode
                  ? 'bg-[#27292d] border-[#3a3d42] hover:border-[#3366cc]'
                  : 'bg-[#f8f9fa] border-[#eaecf0] hover:border-[#3366cc]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#3366cc] shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="font-semibold text-[#3366cc] truncate">
                  {item.term}
                </div>
                <div className="text-[11px] text-[#72777d] dark:text-[#a2a9b1] line-clamp-2">
                  {item.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* Scholarly Citation & Health Radar Utility Banner               */}
      {/* ============================================================== */}
      <div
        className={`p-4 rounded-xl border transition-colors my-6 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden no-print ${
          isDarkMode
            ? 'bg-[#181a1d] border-[#3a3d42]'
            : 'bg-[#f0f4f9] border-[#c8ccd1]'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-[#3366cc]/10 text-[#3366cc]">
              MZ Wiki 维基质检与著录规范
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>12 篇国家标准与同行评议文献背书</span>
            </span>
          </div>
          <div className="font-serif font-bold text-sm text-[#202122] dark:text-white">
            《卫生棉（卫生巾）》学术研究引用与五维条目健康度雷达
          </div>
          <p className="text-xs text-[#54595d] dark:text-[#a2a9b1]">
            本词条已升格为 <strong>典范条目 (Featured Class, 96分)</strong>，支持一键导出 GB/T 7714-2015、APA 7th、MLA 9th 与 BibTeX 标准学术引用格式。
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {onOpenHealthRadar && (
            <button
              onClick={onOpenHealthRadar}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-colors shadow-xs ${
                isDarkMode
                  ? 'border-[#54595d] bg-[#22252a] text-[#eaecf0] hover:bg-[#2c2f36]'
                  : 'border-[#c8ccd1] bg-white text-[#202122] hover:bg-[#f8f9fa]'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>条目质检雷达 (96分)</span>
            </button>
          )}

          {onOpenCitation && (
            <button
              onClick={onOpenCitation}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#3366cc] hover:bg-[#2a4b8d] text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>引用此条目</span>
            </button>
          )}

          <button
            onClick={() => (onPrint ? onPrint() : window.print())}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-colors shadow-xs ${
              isDarkMode
                ? 'border-[#54595d] bg-[#22252a] text-[#eaecf0] hover:bg-[#2c2f36]'
                : 'border-[#c8ccd1] bg-white text-[#202122] hover:bg-[#f8f9fa]'
            }`}
            title="打印本条目纯净版本（自动隐藏侧边栏、搜索框与底部导航）"
          >
            <Printer className="w-4 h-4 text-[#3366cc] dark:text-[#6699ff]" />
            <span>打印条目</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 9: 参考资料                                            */}
      {/* ============================================================== */}
      <section id="pad-references" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          9 参考资料
        </h2>
        <div className="text-xs leading-relaxed columns-1 md:columns-2 gap-6 space-y-2">
          {SANITARY_PAD_REFERENCES.map((ref) => (
            <div
              key={ref.id}
              id={`pad-cite_note-${ref.id}`}
              className="break-inside-avoid text-[#54595d] dark:text-[#a2a9b1] pl-5 relative"
            >
              <span className="absolute left-0 top-0 font-mono text-[#72777d]">
                ^ [{ref.id}]
              </span>
              <span>
                {ref.authors && (
                  <strong className="font-semibold text-[#202122] dark:text-white">
                    {ref.authors}.{' '}
                  </strong>
                )}
                <span className="italic">"{ref.title}"</span>. {ref.source} ({ref.date}).{' '}
                {ref.doi && (
                  <span className="font-mono text-[11px]">
                    doi:
                    <a
                      href={`https://doi.org/${ref.doi}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#3366cc] hover:underline"
                    >
                      {ref.doi}
                    </a>
                    .{' '}
                  </span>
                )}
                {ref.pmid && (
                  <span className="font-mono text-[11px]">
                    PMID:
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/${ref.pmid}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#3366cc] hover:underline"
                    >
                      {ref.pmid}
                    </a>
                    .{' '}
                  </span>
                )}
                {ref.url && (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#3366cc] hover:underline inline-flex items-center gap-0.5 ml-1"
                  >
                    <span>[原始链接]</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 10: 外部链接                                           */}
      {/* ============================================================== */}
      <section id="pad-external-links" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          10 外部链接
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-xs text-[#3366cc]">
          <li>
            <a
              href="https://zh.wikipedia.org/wiki/%E8%A1%9B%E7%94%9F%E6%A3%89"
              target="_blank"
              rel="noreferrer"
              className="hover:underline inline-flex items-center gap-1"
            >
              <span>中文维基百科：衛生棉（Sanitary napkin）条目原文</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </li>
          <li>
            <a
              href="https://commons.wikimedia.org/wiki/Category:Sanitary_towels"
              target="_blank"
              rel="noreferrer"
              className="hover:underline inline-flex items-center gap-1"
            >
              <span>维基共享资源（Wikimedia Commons）分类：Sanitary towels（卫生棉多语种图集）</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </li>
          <li>
            <a
              href="https://www.lifecycleinitiative.org/library/single-use-menstrual-products-and-their-alternatives/"
              target="_blank"
              rel="noreferrer"
              className="hover:underline inline-flex items-center gap-1"
            >
              <span>联合国环境规划署（UNEP）：一次性经期用品及其替代方案生命周期评估报告</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </li>
        </ul>
      </section>

      {/* ============================================================== */}
      {/* Article Tags Box (维基百科条目主题标签方块)                    */}
      {/* ============================================================== */}
      <div
        className={`p-2.5 rounded border text-xs flex items-center gap-2 flex-wrap transition-colors mb-3 print:hidden no-print ${
          isDarkMode ? 'bg-[#27292d] border-[#54595d]' : 'bg-[#f8f9fa] border-[#a2a9b1]'
        }`}
      >
        <span className="font-bold text-[#54595d] dark:text-[#a2a9b1] shrink-0 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-[#3366cc]" />
          <span>主题标签：</span>
        </span>
        {[
          '卫生棉',
          '卫生巾',
          '外置吸收',
          '经期用品',
          '高吸水芯体',
          'SAP高分子树脂',
          '蝶翼防漏',
          '护垫',
          '布卫生棉',
          '粉红税',
          'GB/T 8939'
        ].map((tag, idx) => (
          <button
            key={idx}
            onClick={() => (onNavigateTags ? onNavigateTags(tag) : onNavigateGraph?.())}
            className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 hover:bg-[#3366cc]/10 hover:text-[#3366cc] dark:hover:text-[#6699ff] text-[#54595d] dark:text-[#a2a9b1] cursor-pointer transition-colors flex items-center gap-1 font-mono text-[11px]"
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
      {/* Wikipedia Categories Bar (页面底部维基分类栏)                  */}
      {/* ============================================================== */}
      <div
        className={`p-3 rounded border text-xs flex items-center gap-2 flex-wrap transition-colors print:hidden no-print ${
          isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-[#f8f9fa] border-[#a2a9b1]'
        }`}
      >
        <button
          onClick={() => onNavigateCategory?.()}
          className="font-bold text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer"
        >
          分类
        </button>
        <span>：</span>
        {[
          '女性生理用品',
          '卫生棉',
          '月经健康与护理',
          '纸制品与无纺布工程',
          '医疗器械 (FDA Class I/II)',
          '1921年推出的产品'
        ].map((cat, idx) => (
          <React.Fragment key={cat}>
            {idx > 0 && <span className="text-[#a2a9b1]">|</span>}
            <button
              onClick={() => onNavigateCategory?.()}
              className="text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer"
            >
              {cat}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Media Viewer Lightbox */}
      <WikipediaMediaViewer
        images={SANITARY_PAD_IMAGES}
        currentImageId={activeMediaImageId}
        onClose={() => setActiveMediaImageId(null)}
        onSelectImage={(id) => setActiveMediaImageId(id)}
      />
    </article>
  );
};
