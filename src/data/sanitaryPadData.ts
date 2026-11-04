import { ReferenceItem, SectionDef } from './articleData';
import { WikiImageData } from '../components/WikipediaImageThumb';

export interface SanitaryPadSpec {
  id: string;
  name: string;
  twName: string;
  nameEn: string;
  lengthMm: string;
  absorbencyDrops: number;
  wingType: string;
  thicknessMm: string;
  typicalCapacityMl: string;
  colorCode: string;
  recommendedScenario: string;
}

export const SANITARY_PAD_SPECS: SanitaryPadSpec[] = [
  {
    id: 'pantyliner',
    name: '护垫（日常/经期前后）',
    twName: '護墊',
    nameEn: 'Pantyliner',
    lengthMm: '140 – 180 mm',
    absorbencyDrops: 1,
    wingType: '无护翼（基本直条型）',
    thicknessMm: '0.8 – 1.5 mm',
    typicalCapacityMl: '2 – 5 mL',
    colorCode: '#38bdf8',
    recommendedScenario: '排卵期白带分泌物较多、经期第1天初潮点滴出血或经期最后1–2天尾声使用，亦可作为卫生棉条的辅助防漏垫。'
  },
  {
    id: 'day-mini',
    name: '迷你型 / 丝薄日用型',
    twName: '量少日用型衛生棉',
    nameEn: 'Mini / Light Day Pad',
    lengthMm: '190 – 210 mm',
    absorbencyDrops: 2,
    wingType: '轻巧蝶翼 / 无护翼',
    thicknessMm: '1.0 – 2.0 mm',
    typicalCapacityMl: '8 – 12 mL',
    colorCode: '#34d399',
    recommendedScenario: '经期流量较少阶段、少女初潮期或夏季穿着贴身轻薄衣物时日间频繁更换使用。'
  },
  {
    id: 'day-regular',
    name: '标准日用型（主力规格）',
    twName: '一般日用型衛生棉（蝶翼）',
    nameEn: 'Regular Day Pad with Wings',
    lengthMm: '230 – 250 mm（标准240mm）',
    absorbencyDrops: 3,
    wingType: '标准双向防漏蝶翼（侧翼）',
    thicknessMm: '1.5 – 3.0 mm（丝薄/棉柔）',
    typicalCapacityMl: '15 – 25 mL',
    colorCode: '#eab308',
    recommendedScenario: '经期第2–4天日间正常中等流量使用，带有双向反折蝶翼固定于内裤裆部，建议每2–3小时更换一次。'
  },
  {
    id: 'day-heavy',
    name: '量多加长日用 / 日夜两用型',
    twName: '量多加長型衛生棉',
    nameEn: 'Heavy Flow / Long Day Pad',
    lengthMm: '280 – 290 mm',
    absorbencyDrops: 4,
    wingType: '加宽护翼 + 立体防漏侧边',
    thicknessMm: '2.0 – 3.5 mm',
    typicalCapacityMl: '25 – 35 mL',
    colorCode: '#f97316',
    recommendedScenario: '经期第2天流量高峰期、久坐办公或外出不便频繁如厕时的日间强效防后漏保护。'
  },
  {
    id: 'night-extra',
    name: '夜用加长 / 特长扇尾型',
    twName: '夜用加長型衛生棉',
    nameEn: 'Overnight / Extra Long Pad',
    lengthMm: '330 – 420 mm',
    absorbencyDrops: 5,
    wingType: '前后双护翼 + 超大扇形尾翼',
    thicknessMm: '2.5 – 5.0 mm',
    typicalCapacityMl: '40 – 65 mL',
    colorCode: '#8b5cf6',
    recommendedScenario: '夜间睡眠平躺或翻身时使用，加宽扇形尾端覆盖臀部沟槽，阻断经血顺臀缝向后漫溢。'
  },
  {
    id: 'pants-maternity',
    name: '裤型卫生棉（安睡裤）/ 产妇垫',
    twName: '褲型衛生棉 / 產婦專用惡露墊',
    nameEn: 'Period Underwear Pad / Maternity Pad',
    lengthMm: '480 – 600 mm（360°环抱）',
    absorbencyDrops: 6,
    wingType: '一体式高弹内裤型 / 加厚宽幅',
    thicknessMm: '3.0 – 8.0 mm',
    typicalCapacityMl: '80 – 150 mL',
    colorCode: '#ec4899',
    recommendedScenario: '经血量特大（月经过多）夜间整晚安睡、睡眠姿势大幅翻动者，以及分娩后前2周排泄大量产后恶露（Lochia）的产妇。'
  }
];

export const SANITARY_PAD_SECTIONS: SectionDef[] = [
  {
    id: 'top',
    number: '0',
    title: '序言与名称考辨',
    level: 2
  },
  {
    id: 'pad-history',
    number: '1',
    title: '历史演进',
    level: 2,
    subsections: [
      { id: 'pad-history-ancient', number: '1.1', title: '古代至19世纪：草木灰、布袋与卫生围裙', level: 3 },
      { id: 'pad-history-ww1', number: '1.2', title: '一战纤维棉与1921年商业抛弃式诞生', level: 3 },
      { id: 'pad-history-modern', number: '1.3', title: '现代革新：自粘背胶、蝶翼与高分子超薄化', level: 3 }
    ]
  },
  {
    id: 'pad-structure',
    number: '2',
    title: '构造与吸收工程',
    level: 2,
    subsections: [
      { id: 'pad-structure-layers', number: '2.1', title: '四层复合工程结构剖析', level: 3 },
      { id: 'pad-structure-wings', number: '2.2', title: '导流压花槽、立体防漏侧边与蝶翼力学', level: 3 }
    ]
  },
  {
    id: 'pad-materials',
    number: '3',
    title: '核心材质科学',
    level: 2,
    subsections: [
      { id: 'pad-materials-surface', number: '3.1', title: '表层材质：PE打孔干爽网面与棉柔无纺布', level: 3 },
      { id: 'pad-materials-sap', number: '3.2', title: '吸收芯体：棉状木浆与高分子吸收体（SAP）', level: 3 },
      { id: 'pad-materials-backing', number: '3.3', title: '透气PE底膜与热熔压敏背胶', level: 3 }
    ]
  },
  {
    id: 'pad-types',
    number: '4',
    title: '分类与规格标准',
    level: 2,
    subsections: [
      { id: 'pad-types-classification', number: '4.1', title: '按外形与功能用途分类', level: 3 },
      { id: 'pad-types-interactive', number: '4.2', title: '卫生棉长度、厚度与吸收规格交互对照', level: 3 }
    ]
  },
  {
    id: 'pad-hygiene',
    number: '5',
    title: '使用方法与临床卫生规范',
    level: 2,
    subsections: [
      { id: 'pad-hygiene-interval', number: '5.1', title: '2至4小时更换原则与微生物学依据', level: 3 },
      { id: 'pad-hygiene-dermatitis', number: '5.2', title: '外阴接触性皮炎（卫生棉疹）与香料致敏防范', level: 3 },
      { id: 'pad-hygiene-comparison', number: '5.3', title: '卫生棉、卫生棉条与月经杯全维度对比', level: 3 }
    ]
  },
  {
    id: 'pad-environment',
    number: '6',
    title: '环保影响与可持续替代方案',
    level: 2,
    subsections: [
      { id: 'pad-environment-plastic', number: '6.1', title: '传统抛弃式卫生棉的塑胶足迹与降解难题', level: 3 },
      { id: 'pad-environment-cloth', number: '6.2', title: '可水洗布卫生棉与生物可降解材质', level: 3 }
    ]
  },
  {
    id: 'pad-society',
    number: '7',
    title: '社会文化、法规标准与经期平权',
    level: 2,
    subsections: [
      { id: 'pad-society-standards', number: '7.1', title: '质量安全法规（GB/T 8939、CNS 9324 与 FDA）', level: 3 },
      { id: 'pad-society-equity', number: '7.2', title: '月经贫困、粉红税与公共场所供给争议', level: 3 }
    ]
  },
  {
    id: 'pad-see-also',
    number: '8',
    title: '参见',
    level: 2
  },
  {
    id: 'pad-references',
    number: '9',
    title: '参考资料',
    level: 2
  },
  {
    id: 'pad-external-links',
    number: '10',
    title: '外部链接',
    level: 2
  }
];

export const SANITARY_PAD_IMAGES: WikiImageData[] = [
  {
    id: 'sanitary-pad-wings',
    filename: 'Sanitary_towel_with_wings.jpg',
    title: '带有防漏侧翼（蝶翼）的现代抛弃式卫生棉',
    caption: '一片带有防漏侧翼（蝶翼）与中央环形导流压花槽的现代抛弃式卫生棉。（对应维基共享资源 File:Sanitary_towel_with_wings.jpg）',
    author: 'Wikimedia Commons 贡献者',
    license: 'CC BY-SA 3.0 / GFDL',
    date: '2008年5月12日',
    dimensions: '1,920 × 1,280 像素（高精度矢量重构）',
    fileSize: '365 KB',
    commonsUrl: 'https://commons.wikimedia.org/wiki/File:Sanitary_towel_with_wings.jpg',
    type: 'pad-wings'
  },
  {
    id: 'sanitary-pad-layers',
    filename: 'Sanitary_napkin_cross_section_zh.svg',
    title: '现代复合卫生棉四层吸收结构解剖图',
    caption: '现代超薄复合卫生棉横截面工程解剖图：1. 亲水打孔/无纺布表层 2. 瞬吸导流层（ADL） 3. 绒毛木浆与高分子吸水树脂（SAP）复合锁水芯 4. PE微孔透气防漏底膜与背胶。',
    author: 'MZ维基工程制图组 / Wikimedia Commons',
    license: '知识共享 署名-相同方式共享 4.0 (CC BY-SA 4.0)',
    date: '2024年11月',
    dimensions: '矢量图 (SVG)',
    fileSize: '94 KB',
    commonsUrl: 'https://commons.wikimedia.org/wiki/Category:Sanitary_towels',
    type: 'pad-layers'
  },
  {
    id: 'sanitary-pad-history',
    filename: 'Historical_sanitary_belt_and_kotex_pad.svg',
    title: '1920年代生理带固定式卫生棉与1970年代自粘背胶演进',
    caption: '卫生棉固定方式的历史演进对比：左为1920–1960年代需搭配弹性生理带（Sanitary belt）与安全别针固定的早期无胶纤维棉垫；右为1970年代问世的自粘式压敏背胶与1989年蝶翼护翼设计。',
    author: 'Wikimedia Commons 历史档案重构',
    license: 'CC BY-SA 4.0',
    date: '2022年3月',
    dimensions: '矢量图 (SVG)',
    fileSize: '112 KB',
    commonsUrl: 'https://commons.wikimedia.org/wiki/Category:History_of_menstrual_hygiene',
    type: 'pad-history-belt'
  },
  {
    id: 'sanitary-pad-reusable',
    filename: 'Cloth_menstrual_pad_with_snaps.svg',
    title: '可重复水洗式环保布卫生棉（Cloth Menstrual Pad）',
    caption: '可水洗重复使用的现代布卫生棉（Cloth pad）：采用有机纯棉亲肤面层、超细纤维吸水内芯、TPU防水透气底膜，两侧翼通过金属或塑胶按扣（Snaps）在底裤外侧扣合固定。',
    author: 'Wikimedia Commons 贡献者',
    license: 'CC BY-SA 3.0',
    date: '2016年8月20日',
    dimensions: '矢量图 (SVG)',
    fileSize: '88 KB',
    commonsUrl: 'https://commons.wikimedia.org/wiki/Category:Cloth_menstrual_pads',
    type: 'pad-reusable'
  }
];

export const SANITARY_PAD_REFERENCES: ReferenceItem[] = [
  {
    id: 1,
    authors: '中文维基百科编者',
    title: '衛生棉（Sanitary napkin）条目历史与构造综述',
    source: '维基百科，自由的百科全书',
    date: '2026-10-18',
    url: 'https://zh.wikipedia.org/wiki/%E8%A1%9B%E7%94%9F%E6%A3%89',
    quote: '卫生棉，亦称卫生巾、生理棉，是一种具吸收力的物质，主要的材质为棉、不织布、纸浆或以上材质复合物所形成的高分子聚合物与高分子聚合物复合纸，用来吸收女性月经来潮时，自阴道流出的经血。'
  },
  {
    id: 2,
    authors: 'Heinrich, Thomas & Batchelor, Bob',
    title: 'Kotex, Kleenex, Huggies: Kimberly-Clark and the Consumer Revolution in American Business',
    source: 'Ohio State University Press（俄亥俄州立大学出版社）',
    date: '2004-05-01',
    quote: '第一次世界大战期间金佰利公司研发出吸水能力比普通纯棉高5倍的木浆纤维棉（Cellucotton），战地护士将其用于经期吸收，促使1920–1921年世界首款商业抛弃式卫生棉 Kotex（高洁丝/靠得住）诞生。'
  },
  {
    id: 3,
    authors: 'Vostral, Sharra L.',
    title: 'Under Wraps: A History of Menstrual Hygiene Technology',
    source: 'Lexington Books',
    date: '2008-03-15',
    quote: '1969至1970年代初，Stayfree 与 New Freedom 率先推出底部附带压敏背胶条与离型纸的免生理带自粘式卫生棉，彻底终结了困扰女性数十年的生理带（Sanitary belt）与别针固定历史。'
  },
  {
    id: 4,
    authors: 'Woeller, K. E. & Hochwalt, A. E.',
    title: 'Safety assessment of sanitary pads with a polymeric foam absorbent core',
    source: 'Regulatory Toxicology and Pharmacology',
    date: '2015-10-01',
    doi: '10.1016/j.yrtph.2015.07.028',
    pmid: '26241775',
    quote: '现代复合卫生棉由亲水透液表层、导流扩散层（ADL）、含交联聚丙烯酸钠高分子吸水树脂（SAP）的吸收芯以及微孔透气聚乙烯（PE）防漏底膜组成。'
  },
  {
    id: 5,
    authors: 'Farage, Miranda A. et al.',
    title: 'Cutaneous and Sensory Effects of Two Types of Sanitary Pads with Different Surface Top-sheets',
    source: 'Journal of Cutaneous Medicine and Surgery',
    date: '2007-09-01',
    doi: '10.2310/7750.2007.00027',
    quote: '临床皮肤科对照试验显示，热风/水刺棉柔无纺布表层在降低外阴皮肤摩擦与红斑发生率方面优于早期较硬的传统PE打孔塑料网膜，而打孔漏斗网面则在防经血回渗率上表现突出。'
  },
  {
    id: 6,
    authors: '中华人民共和国国家市场监督管理总局、中国国家标准化管理委员会',
    title: 'GB/T 8939-2018《卫生巾（护垫）》中华人民共和国国家标准',
    source: '全国标准信息公共服务平台',
    date: '2018-06-07',
    url: 'https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=B3078916B1F6863E1212EE4D762D4C00',
    quote: '明确规定卫生巾及护垫的全长偏差（±4%）、吸水倍率（卫生巾≥7.0倍）、吸收速度、pH值（4.0～9.0）、甲醛含量及可迁移性荧光物质等强制性技术指标。'
  },
  {
    id: 7,
    authors: '中华民国经济部标准检验局（BSMI）',
    title: 'CNS 9324《衛生棉》中华民国国家标准（Taiwan National Standards）',
    source: '经济部标准检验局公报',
    date: '2019-11-15',
    quote: '规定卫生棉表面材质、吸水量、渗漏试验、酸碱值、可迁移性荧光物质及背面黏胶剥离强度等安全检验标准。'
  },
  {
    id: 8,
    authors: '中华人民共和国国家卫生健康委员会',
    title: 'GB 15979-2024《一次性使用卫生用品卫生要求》强制性国家标准',
    source: '国家疾病预防控制局 / 国家标准委',
    date: '2024-07-24',
    quote: '规定妇女经期卫生用品的微生物学指标：普通级卫生巾细菌菌落总数须 ≤200 CFU/g，真菌菌落总数 ≤100 CFU/g，且不得检出大肠菌群、绿脓杆菌、金黄色葡萄球菌与溶血性链球菌。'
  },
  {
    id: 9,
    authors: '美国食品药品监督管理局（U.S. FDA）',
    title: 'Code of Federal Regulations Title 21, Sec. 884.5425 & 884.5435 (Scented and Unscented Menstrual Pad)',
    source: 'U.S. Food and Drug Administration',
    date: '2023-04-01',
    url: 'https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfcfr/CFRSearch.cfm?fr=884.5435',
    quote: '美国FDA将无香味卫生棉（Unscented menstrual pad）列为I类（Class I）医疗器械，而含香料或除臭剂的卫生棉（Scented menstrual pad）则列为II类（Class II）监管医疗器械。'
  },
  {
    id: 10,
    authors: 'Das, Padma et al.',
    title: 'Menstrual Hygiene Practices, WASH Access and the Risk of Urogenital Infection in Women: A Case-Control Study',
    source: 'PLOS ONE',
    date: '2015-06-30',
    doi: '10.1371/journal.pone.0130777',
    pmid: '26125184',
    quote: '卫生巾连续使用超过4–6小时未更换时，局部温湿度升高与经血蛋白质富集会导致外阴部位条件致病菌倍增，显著提高外阴瘙痒、接触性皮炎及下生殖道感染风险。'
  },
  {
    id: 11,
    authors: '联合国环境规划署（UNEP）生命周期倡议',
    title: 'Single-Use Menstrual Products and Their Alternatives: Recommendations from Life Cycle Assessments (LCA)',
    source: 'United Nations Environment Programme',
    date: '2021-09-20',
    url: 'https://www.lifecycleinitiative.org/library/single-use-menstrual-products-and-their-alternatives/',
    quote: '传统抛弃式卫生棉按重量计约含高达 90% 的塑料等效物（包括PE打孔表层、SAP丙烯酸聚合物、PE防漏底膜、热熔胶与独立塑料外袋），单名女性一生约消耗1万至1.5万片，在自然填埋环境中需数百年方可降解。'
  },
  {
    id: 12,
    authors: 'van Eijk, Anna Maria et al.',
    title: 'Menstrual hygiene management among adolescent girls in India: a systematic review and meta-analysis',
    source: 'BMJ Open',
    date: '2016-03-02',
    doi: '10.1136/bmjopen-2015-010290',
    pmid: '26936906',
    quote: '可重复水洗的布卫生棉（Cloth pads）在减少固体废弃物与降低经期贫困支出方面效益显著，但必须确保以洁净水源洗涤并在阳光（紫外线）与通风环境下彻底晾干，以防霉菌与细菌滋生。'
  }
];
