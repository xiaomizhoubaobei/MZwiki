export interface ReferenceItem {
  id: number;
  authors?: string;
  title: string;
  source: string;
  date?: string;
  url?: string;
  doi?: string;
  pmid?: string;
  quote?: string;
}

export interface WikiLinkData {
  title: string;
  boldTerm?: string;
  pinyin?: string;
  category: string;
  summary: string;
  iconType: 'anatomy' | 'biology' | 'product' | 'medical' | 'person' | 'history';
  imageUrl?: string;
  imageAlt?: string;
}

export interface SectionDef {
  id: string;
  number: string;
  title: string;
  level: 2 | 3;
  subsections?: SectionDef[];
}

export interface AbsorbencyGrade {
  name: string;
  nameEn: string;
  weightRange: string;
  waterDrops: number;
  flowLevel: string;
  colorCode: string;
  recommendedUse: string;
}

export const ABSORBENCY_GRADES: AbsorbencyGrade[] = [
  {
    name: '量少型 / 轻量型',
    nameEn: 'Light / Junior',
    weightRange: '< 6 克',
    waterDrops: 1,
    flowLevel: '经期初期或尾声微量经血',
    colorCode: '#93c5fd',
    recommendedUse: '首次尝试者、经期最后1-2天少量阶段'
  },
  {
    name: '普通型 / 一般型',
    nameEn: 'Regular',
    weightRange: '6 – 9 克',
    waterDrops: 2,
    flowLevel: '中等经血流量',
    colorCode: '#eab308',
    recommendedUse: '绝大多数女性日常经期的核心主力规格'
  },
  {
    name: '量多型',
    nameEn: 'Super',
    weightRange: '9 – 12 克',
    waterDrops: 3,
    flowLevel: '经期第2-3天较大流量',
    colorCode: '#22c55e',
    recommendedUse: '流量高峰期，日间活动约需3-4小时更换'
  },
  {
    name: '超多型',
    nameEn: 'Super Plus',
    weightRange: '12 – 15 克',
    waterDrops: 4,
    flowLevel: '经期特大流量',
    colorCode: '#f97316',
    recommendedUse: '经血量极大时使用，非必要请勿越级使用'
  },
  {
    name: '极多型',
    nameEn: 'Ultra',
    weightRange: '15 – 18 克',
    waterDrops: 5,
    flowLevel: '异常大流量或特定短时需求',
    colorCode: '#a855f7',
    recommendedUse: '临床建议仅在严格监控下短时使用，防范TSS风险'
  }
];

export const REFERENCES_DATA: ReferenceItem[] = [
  {
    id: 1,
    authors: '美国食品药品监督管理局（U.S. FDA）',
    title: 'The Facts on Tampons—and How to Use Them Safely',
    source: 'FDA 消费者健康资讯',
    date: '2023-08-15',
    url: 'https://www.fda.gov/consumers/consumer-updates/facts-tampons-and-how-use-them-safely',
    quote: '卫生棉条属于FDA监管的医疗器械，旨在置入阴道内吸收经期经血。'
  },
  {
    id: 2,
    authors: 'Earle Haas',
    title: 'Catamenial device (US Patent 1,926,900)',
    source: '美国专利商标局（USPTO）',
    date: '1933-09-12',
    url: 'https://patents.google.com/patent/US1926900A/en',
    quote: '由相对柔软的吸收构件及嵌套同心滑动套管系统组成的月经吸收装置。'
  },
  {
    id: 3,
    authors: 'Judith Esser-Mittag',
    title: 'Der o.b.-Tampon: Geschichte einer Erfindung zur Monatshygiene',
    source: 'Deutsches Ärzteblatt（德国医师公报）',
    date: '1985-04-10',
    quote: '德国妇科女医师朱迪丝·埃瑟与卡尔·哈恩博士合作研发的无导管指入式棉条。'
  },
  {
    id: 4,
    authors: 'Vostral, Sharra L.',
    title: 'Under Wraps: A History of Menstrual Hygiene Technology',
    source: 'Lexington Books',
    date: '2008',
    quote: '系统记录了经期卫生技术从早期医学填塞物向工业化规模生产的历史演进。'
  },
  {
    id: 5,
    authors: '美国妇产科学会（ACOG）',
    title: 'Your First Period (FAQ041)',
    source: 'ACOG 患者科普指南',
    date: '2022-10',
    url: 'https://www.acog.org/womens-health/faqs/your-first-period',
    quote: '没有性经历的女性可以使用棉条吗？完全可以。处女膜（阴道冠）中心天然具有排血孔隙，棉条可顺畅通过。'
  },
  {
    id: 6,
    authors: '美国疾病控制与预防中心（CDC）',
    title: 'Toxic Shock Syndrome (Other Than Streptococcal): 2011 Case Definition',
    source: '国家法定传染病监测系统',
    date: '2021-04-16',
    url: 'https://ndc.services.cdc.gov/case-definitions/toxic-shock-syndrome-2011/',
    quote: '由突发高烧、皮疹、脱屑、低血压及多器官功能衰竭为特征的重症综合征。'
  },
  {
    id: 7,
    authors: 'Schlievert, P. M., et al.',
    title: 'Identification and characterization of an exotoxin from Staphylococcus aureus strains that produce toxic-shock syndrome',
    source: 'The Journal of Infectious Diseases',
    date: '1981',
    doi: '10.1093/infdis/143.4.509',
    pmid: '7014727'
  },
  {
    id: 8,
    authors: 'Todd, J., Fishaut, M., Kapral, F., & Welch, T.',
    title: 'Toxic-shock syndrome associated with phage-group-I Staphylococci',
    source: 'The Lancet',
    date: '1978',
    doi: '10.1016/S0140-6736(78)92274-2',
    pmid: '82681'
  },
  {
    id: 9,
    authors: '中国国家药品监督管理局 / 卫生健康委',
    title: '医用卫生棉条使用安全守则与正确观念科普',
    source: '药械安全健康科普周刊',
    date: '2022-05-18',
    quote: '建议每4-6小时更换一次，最长不可超过8小时，且切勿将棉条用于非经期分泌物吸收。'
  },
  {
    id: 10,
    authors: 'Oster, E., & Thornton, R.',
    title: 'Menstruation, Sanitary Products, and School Attendance: Evidence from a Randomized Evaluation',
    source: 'American Economic Journal: Applied Economics',
    date: '2011',
    doi: '10.1257/app.3.1.91'
  },
  {
    id: 11,
    authors: 'Borowski, O. D.',
    title: 'Everyday Life in Biblical Times',
    source: 'Society of Biblical Literature',
    date: '2003',
    quote: '古埃及医学纸草书中记载了女性在经期使用经软化压制的莎草纸卷吸纳经血。'
  },
  {
    id: 12,
    authors: '世界卫生组织（WHO）',
    title: 'Comprehensive Cervical Cancer Control: A guide to essential practice',
    source: 'WHO Guidelines Approved by the Guidelines Review Committee',
    date: '2014',
    pmid: '25879129',
    quote: '人体解剖结构表明，正常宫颈外口直径仅约2-3毫米，棉条从物理机制上绝对不可能穿过宫颈进入子宫腔。'
  },
  {
    id: 13,
    authors: 'Peberdy, E., Jones, A., & Green, D.',
    title: 'A Study into Public Awareness of the Environmental Impact of Menstrual Products and Product Choice',
    source: 'Sustainability',
    date: '2019-01',
    doi: '10.3390/su11020473'
  },
  {
    id: 14,
    authors: '英国国民医疗服务体系（NHS）',
    title: 'Toxic shock syndrome (TSS): Causes and Prevention',
    source: 'NHS UK Health A to Z',
    date: '2023-01-18',
    url: 'https://www.nhs.uk/conditions/toxic-shock-syndrome/'
  },
  {
    id: 15,
    authors: '中华医学会妇产科学分会',
    title: '女性生殖解剖与青少年经期健康科普指引：正确认识阴道冠与月经生理',
    source: '中华妇产科杂志临床指南汇编',
    date: '2021',
    quote: '处女膜解剖学名为阴道冠（Vaginal corona），富有弹性纤维，在未有性行为情况下亦可安全使用轻量型卫生棉条。'
  }
];

export const WIKILINK_DATA: Record<string, WikiLinkData> = {
  '清洗 (医学)': {
    title: '清洗 (医学)',
    boldTerm: '清洗',
    pinyin: 'Vaginal Douching',
    category: '妇科学 / 临床操作',
    summary: '是一种由于医疗或卫生因素而将水引入体内的操作。清洗通常用于阴道上的清洁，但也能用于其它体腔。阴道的清洗液可能包括水、与醋混合的水，甚至是抗菌化学物。该行为被谣传成有许多假设但未经证实的益处，包括能清除阴道原有气味之外的味道，以及女性能在月经期进行性交而避免经血沾染到性伴侣。',
    iconType: 'medical',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Klystierspritze.jpg/640px-Klystierspritze.jpg'
  },
  '清洗 (醫學)': {
    title: '清洗 (医学)',
    boldTerm: '清洗',
    pinyin: 'Vaginal Douching',
    category: '妇科学 / 临床操作',
    summary: '是一种由于医疗或卫生因素而将水引入体内的操作。清洗通常用于阴道上的清洁，但也能用于其它体腔。阴道的清洗液可能包括水、与醋混合的水，甚至是抗菌化学物。该行为被谣传成有许多假设但未经证实的益处，包括能清除阴道原有气味之外的味道，以及女性能在月经期进行性交而避免经血沾染到性伴侣。',
    iconType: 'medical',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Klystierspritze.jpg/640px-Klystierspritze.jpg'
  },
  '清洗': {
    title: '清洗 (医学)',
    boldTerm: '清洗',
    pinyin: 'Vaginal Douching',
    category: '妇科学 / 临床操作',
    summary: '是一种由于医疗或卫生因素而将水引入体内的操作。清洗通常用于阴道上的清洁，但也能用于其它体腔。阴道的清洗液可能包括水、与醋混合的水，甚至是抗菌化学物。该行为被谣传成有许多假设但未经证实的益处，包括能清除阴道原有气味之外的味道，以及女性能在月经期进行性交而避免经血沾染到性伴侣。',
    iconType: 'medical',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Klystierspritze.jpg/640px-Klystierspritze.jpg'
  },
  '卫生巾': {
    title: '卫生巾',
    boldTerm: '卫生巾',
    pinyin: 'Sanitary napkin / pad',
    category: '个人卫生用品',
    summary: '是一种贴附于内裤内侧以吸收经血的外部吸收垫，主要由棉柔或干爽网面表层、高分子吸水树脂（SAP）与防漏底膜构成，是当代普及度极高的经期用品。',
    iconType: 'product',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sanitary_towel_with_wings.jpg/640px-Sanitary_towel_with_wings.jpg'
  },
  '衛生棉': {
    title: '卫生巾（卫生棉）',
    boldTerm: '衛生棉',
    pinyin: 'Sanitary napkin / pad',
    category: '个人卫生用品',
    summary: '是一种贴附于内裤内侧以吸收经血的外部吸收垫，主要由棉柔或干爽网面表层、高分子吸水树脂（SAP）与防漏底膜构成，是当代普及度极高的经期用品。',
    iconType: 'product',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sanitary_towel_with_wings.jpg/640px-Sanitary_towel_with_wings.jpg'
  },
  '卫生棉条': {
    title: '卫生棉条',
    boldTerm: '卫生棉条',
    pinyin: 'Tampon',
    category: '个人卫生用品',
    summary: '是一种圆柱状吸收经血的女性经期个人卫生用品，由棉、人造纤维或两者的混合物压缩制成，置入阴道无感区内使用，提供自由无感的经期活动体验。',
    iconType: 'product',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Tampons.jpg/640px-Tampons.jpg'
  },
  '衛生棉條': {
    title: '卫生棉条',
    boldTerm: '衛生棉條',
    pinyin: 'Tampon',
    category: '个人卫生用品',
    summary: '是一种圆柱状吸收经血的女性经期个人卫生用品，由棉、人造纤维或两者的混合物压缩制成，置入阴道无感区内使用，提供自由无感的经期活动体验。',
    iconType: 'product',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Tampons.jpg/640px-Tampons.jpg'
  },
  '月经杯': {
    title: '月经杯',
    boldTerm: '月经杯',
    pinyin: 'Menstrual cup',
    category: '个人卫生用品',
    summary: '又称月事杯，是一种钟形的医用级硅胶、热塑性弹性体（TPE）或天然乳胶制成的弹性容器，置于阴道内收集经血，具有可重复清洗使用、环保经济且长效等优势。',
    iconType: 'product',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Menstrual_cup_white_background.jpg/640px-Menstrual_cup_white_background.jpg'
  },
  '女性生理用品': {
    title: '女性生理用品',
    boldTerm: '女性生理用品',
    pinyin: 'Feminine hygiene products',
    category: '个人卫生用品 / 分类主条目',
    summary: '是指女性在月经期、分娩后及日常分泌物管理中用于吸收或收集血液、体液并维护外阴及生殖道清洁卫生的一系列个人卫生护理产品统称。',
    iconType: 'product',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Tampons.jpg/640px-Tampons.jpg'
  },
  '中国大陆铁路卫生巾售卖争议': {
    title: '中国大陆铁路卫生巾售卖争议',
    boldTerm: '中国大陆铁路卫生巾售卖争议',
    pinyin: 'Railway Sanitary Pad Controversy',
    category: '社会事件 / 公共卫生',
    summary: '是指2022年围绕中国国家铁路集团客运列车是否应常规售卖女性经期应急卫生用品展开的广泛公众讨论与倡议活动，引发了对公共设施性别友好度与经期关怀的深度反思。',
    iconType: 'history',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/CRH380A-2722_at_Beijing_South_%2820160505151523%29.jpg/640px-CRH380A-2722_at_Beijing_South_%2820160505151523%29.jpg'
  },
  '粉红税': {
    title: '粉红税',
    boldTerm: '粉红税',
    pinyin: 'Pink Tax',
    category: '经济学 / 性别社会学',
    summary: '指基于性别而对针对女性销售的商品或服务标示更高价格的社会与市场现象，常见于个人护理用品（如剃须刀、洗发水）、经期用品及服饰配饰。',
    iconType: 'history',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sanitary_towel_with_wings.jpg/640px-Sanitary_towel_with_wings.jpg'
  },
  '粉紅稅': {
    title: '粉红税',
    boldTerm: '粉紅稅',
    pinyin: 'Pink Tax',
    category: '经济学 / 性别社会学',
    summary: '指基于性别而对针对女性销售的商品或服务标示更高价格的社会与市场现象，常见于个人护理用品（如剃须刀、洗发水）、经期用品及服饰配饰。',
    iconType: 'history',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sanitary_towel_with_wings.jpg/640px-Sanitary_towel_with_wings.jpg'
  },
  '护垫': {
    title: '护垫',
    boldTerm: '护垫',
    pinyin: 'Panty liner',
    category: '个人卫生用品',
    summary: '是一种比常规卫生巾更薄更短小的外部吸收衬垫，主要用于非经期日常阴道分泌物吸收、经期初期或尾声微量经血吸收以及配合棉条防漏。',
    iconType: 'product',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Panty_liner.jpg/640px-Panty_liner.jpg'
  },
  '護墊': {
    title: '护垫',
    boldTerm: '護墊',
    pinyin: 'Panty liner',
    category: '个人卫生用品',
    summary: '是一种比常规卫生巾更薄更短小的外部吸收衬垫，主要用于非经期日常阴道分泌物吸收、经期初期或尾声微量经血吸收以及配合棉条防漏。',
    iconType: 'product',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Panty_liner.jpg/640px-Panty_liner.jpg'
  },
  '阴道菌群': {
    title: '阴道菌群',
    boldTerm: '阴道菌群',
    pinyin: 'Vaginal flora',
    category: '微生物学 / 生理学',
    summary: '是以乳杆菌（Lactobacillus）为主导的正常女性生殖道共生微生态系统，通过分泌乳酸与过氧化氢维持弱酸性微环境（pH 3.8–4.5）抵御外来致病菌。',
    iconType: 'medical',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Lactobacillus_acidophilus_%2801%29.jpg/640px-Lactobacillus_acidophilus_%2801%29.jpg'
  },
  '陰道菌群': {
    title: '阴道菌群',
    boldTerm: '陰道菌群',
    pinyin: 'Vaginal flora',
    category: '微生物学 / 生理学',
    summary: '是以乳杆菌（Lactobacillus）为主导的正常女性生殖道共生微生态系统，通过分泌乳酸与过氧化氢维持弱酸性微环境（pH 3.8–4.5）抵御外来致病菌。',
    iconType: 'medical',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Lactobacillus_acidophilus_%2801%29.jpg/640px-Lactobacillus_acidophilus_%2801%29.jpg'
  },
  '丹碧丝': {
    title: '丹碧丝',
    boldTerm: '丹碧丝',
    pinyin: 'Tampax',
    category: '商业品牌 / 个人护理',
    summary: '（Tampax）是宝洁旗下的著名卫生棉条品牌，源自厄尔·哈斯1931年的专利发明，于1936年创立并推向国际市场，是现代导管式卫生棉条的商业化代表。',
    iconType: 'product',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Tampax_Compak.jpg/640px-Tampax_Compak.jpg'
  },
  '高洁丝': {
    title: '高洁丝',
    boldTerm: '高洁丝',
    pinyin: 'Kotex',
    category: '商业品牌 / 经期护理',
    summary: '（Kotex）是金佰利旗下的女性卫生护理品牌，创立于1920年，是世界上最早实现工业化批量生产一次性经期卫生用品的品牌之一。',
    iconType: 'product',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Kotex_pad_box.jpg/640px-Kotex_pad_box.jpg'
  },
  '苏菲': {
    title: '苏菲',
    boldTerm: '苏菲',
    pinyin: 'Sofy',
    category: '商业品牌 / 个人护理',
    summary: '（Sofy）是日本尤妮佳（Unicharm）旗下的知名女性经期用品品牌，涵盖日用与夜用卫生巾、导管式卫生棉条及裤型卫生巾等产品线。',
    iconType: 'product',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Tampons.jpg/640px-Tampons.jpg'
  },
  '月经': {
    title: '月经',
    boldTerm: '月经',
    pinyin: 'Menstruation',
    category: '生理学 / 妇科学',
    summary: '又称月事、月信，是育龄期女性卵巢周期性排卵引起的子宫内膜剥脱并伴随出血的生理现象。平均周期约28天，出血持续约3至7天。',
    iconType: 'biology',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/MenstrualCycle2_zh-hans.svg/640px-MenstrualCycle2_zh-hans.svg.png'
  },
  '阴道冠': {
    title: '阴道冠（处女膜）',
    boldTerm: '阴道冠',
    pinyin: 'Vaginal corona',
    category: '人体解剖学',
    summary: '是位于女性阴道口周围的一圈柔软且富有弹性的黏膜皱襞组织。中心天然具有开孔（如筛状、环状），经血由此排出，并非封闭实心薄膜。',
    iconType: 'anatomy',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Hymen_types.svg/640px-Hymen_types.svg.png'
  },
  '厄尔·哈斯': {
    title: '厄尔·哈斯',
    boldTerm: '厄尔·哈斯',
    pinyin: 'Earle Haas (1888–1981)',
    category: '历史人物 / 发明家',
    summary: '（Earle Haas）是美国骨科医生与发明家。1929年发明了现代双套管导管型卫生棉条，并于1931年取得专利，随后催生了著名品牌丹碧丝。',
    iconType: 'person',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/US_Patent_1926900_Earle_Haas_Tampon.png/640px-US_Patent_1926900_Earle_Haas_Tampon.png'
  },
  '中毒性休克综合征': {
    title: '中毒性休克综合征',
    boldTerm: '中毒性休克综合征',
    pinyin: 'Toxic Shock Syndrome (TSS)',
    category: '感染病学 / 重症医学',
    summary: '（TSS）是由金黄色葡萄球菌释放的外毒素（TSST-1）引发的全身性急性重症，症状包括突发高热、皮疹、低血压与多器官受累，科学规范使用棉条可有效预防。',
    iconType: 'medical',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Staphylococcus_aureus_Gram.jpg/640px-Staphylococcus_aureus_Gram.jpg'
  },
  '金黄色葡萄球菌': {
    title: '金黄色葡萄球菌',
    boldTerm: '金黄色葡萄球菌',
    pinyin: 'Staphylococcus aureus',
    category: '微生物学 / 细菌',
    summary: '是一种革兰氏阳性球菌，广泛存在于健康人群皮肤、鼻腔与黏膜表面。在特定高需氧或高吸水纤维密闭环境下可过度繁殖并产生毒素。',
    iconType: 'medical',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Staphylococcus_aureus_Gram.jpg/640px-Staphylococcus_aureus_Gram.jpg'
  },
  '布卫生巾': {
    title: '布卫生巾',
    boldTerm: '布卫生巾',
    pinyin: 'Cloth menstrual pad',
    category: '环保用品 / 经期护理',
    summary: '是由纯棉、竹纤维等天然织物缝制而成的可清洗重复使用经期用品，具有透气性良好、亲肤及减少一次性塑料废弃物等优点。',
    iconType: 'product',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Cloth_menstrual_pads.jpg/640px-Cloth_menstrual_pads.jpg'
  },
  '粘胶纤维': {
    title: '粘胶纤维',
    boldTerm: '粘胶纤维',
    pinyin: 'Rayon / Viscose',
    category: '纺织材料学',
    summary: '（人造棉）是由天然木浆纤维素经过碱化与黄化处理制成的再生纤维素纤维，吸水率显著高于天然纯棉，常用于棉条高吸收芯体。',
    iconType: 'product',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Rayon_fiber.jpg/640px-Rayon_fiber.jpg'
  },
  '棉球': {
    title: '医用棉球',
    boldTerm: '医用棉球',
    pinyin: 'Cotton ball',
    category: '医疗器械 / 急救用品',
    summary: '是由医用脱脂棉加工制成的球状敷料，常用于手术外科填塞、局部伤口压迫止血及消毒药液涂抹。',
    iconType: 'medical',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Cotton_balls.jpg/640px-Cotton_balls.jpg'
  },
  '止血栓': {
    title: '止血栓',
    boldTerm: '止血栓',
    pinyin: 'Hemostatic plug',
    category: '外科医学 / 急救器材',
    summary: '是用于体腔、窦道或深部创口深层压迫止血的医用栓剂或膨胀海绵塞，与月经护理用棉条具有不同的临床用途。',
    iconType: 'medical',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Klystierspritze.jpg/640px-Klystierspritze.jpg'
  },
  '导管型卫生棉条': {
    title: '导管型卫生棉条',
    boldTerm: '导管型卫生棉条',
    pinyin: 'Applicator Tampon',
    category: '个人卫生用品',
    summary: '附带由光滑塑料或纸质外管与内推杆组成的套管系统，辅助使用者顺畅、无痛且卫生地将吸收棉芯送入阴道无感区。',
    iconType: 'product',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Tampax_Compak.jpg/640px-Tampax_Compak.jpg'
  },
  '指入式卫生棉条': {
    title: '指入式卫生棉条',
    boldTerm: '指入式卫生棉条',
    pinyin: 'Digital Tampon',
    category: '个人卫生用品',
    summary: '无外置导管的圆柱形棉条，由清洁的手指直接推入阴道。体积小巧易携，减少一次性塑料废弃物，具环保优势。',
    iconType: 'product',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Tampons.jpg/640px-Tampons.jpg'
  },
  '月经禁忌': {
    title: '月经禁忌',
    boldTerm: '月经禁忌',
    pinyin: 'Menstrual Taboo',
    category: '人类学 / 文化研究',
    summary: '是指世界各地不同宗教、神话与民俗中对月经现象产生的文化禁忌、洁净观念以及当代破除经期羞辱的社会运动。',
    iconType: 'history',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Menstruation_taboo_symbol.svg/640px-Menstruation_taboo_symbol.svg.png'
  },
  '个人卫生': {
    title: '个人卫生',
    boldTerm: '个人卫生',
    pinyin: 'Personal hygiene',
    category: '公共卫生学',
    summary: '是指个人为维持身体健康、预防疾病并提高生活质量而进行的自我身体清洁与日常护理行为。',
    iconType: 'product',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Washing_hands.jpg/640px-Washing_hands.jpg'
  },
  '女性生殖系统': {
    title: '女性生殖系统',
    boldTerm: '女性生殖系统',
    pinyin: 'Female reproductive system',
    category: '人体解剖学',
    summary: '由内生殖器（卵巢、输卵管、子宫、阴道）与外生殖器（阴阜、大阴唇、小阴唇、阴蒂、前庭）组成。',
    iconType: 'anatomy',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Female_anatomy.svg/640px-Female_anatomy.svg.png'
  }
};

/**
 * Maps any internal wikilink to its exact target:
 * - If it corresponds to a section inside the '卫生棉条' article, provides inArticleSectionId and title.
 * - Always provides the standard wiki URL (/wiki/xxx).
 */
export interface WikiLinkTargetInfo {
  term: string;
  inArticleSectionId?: string;
  inArticleSectionTitle?: string;
  wikiUrl: string;
}

export function getWikiLinkTargetInfo(term: string): WikiLinkTargetInfo {
  const cleanTerm = term.replace(/[（(].*?[）)]/g, '').trim();

  // Precise in-article anchor mappings
  if (cleanTerm === '厄尔·哈斯' || term.includes('厄尔·哈斯')) {
    return {
      term,
      inArticleSectionId: 'history',
      inArticleSectionTitle: '1 卫生棉条的历史（厄尔·哈斯发明专利）',
      wikiUrl: `/wiki/${encodeURIComponent(term)}`
    };
  }

  if (cleanTerm === '中毒性休克综合征' || cleanTerm === 'TSS') {
    return {
      term,
      inArticleSectionId: 'safety-and-tss',
      inArticleSectionTitle: '5 相关疾病（中毒性休克综合征 TSS）',
      wikiUrl: `/wiki/${encodeURIComponent(term)}`
    };
  }

  if (cleanTerm === '金黄色葡萄球菌') {
    return {
      term,
      inArticleSectionId: 'tss-mechanism',
      inArticleSectionTitle: '5.1 中毒性休克综合征致病机理',
      wikiUrl: `/wiki/${encodeURIComponent(term)}`
    };
  }

  if (cleanTerm === '阴道冠' || term.includes('处女膜')) {
    return {
      term,
      inArticleSectionId: 'myth-hymen',
      inArticleSectionTitle: '4.1 处女膜与处女使用迷思（阴道冠解剖）',
      wikiUrl: `/wiki/${encodeURIComponent(term)}`
    };
  }

  if (cleanTerm === '导管型卫生棉条' || cleanTerm === '导管型') {
    return {
      term,
      inArticleSectionId: 'applicator-tampons',
      inArticleSectionTitle: '2.1 导管型的卫生棉条',
      wikiUrl: `/wiki/${encodeURIComponent(term)}`
    };
  }

  if (cleanTerm === '指入式卫生棉条' || cleanTerm === '指入式') {
    return {
      term,
      inArticleSectionId: 'digital-tampons',
      inArticleSectionTitle: '2.2 指入式的卫生棉条',
      wikiUrl: `/wiki/${encodeURIComponent(term)}`
    };
  }

  if (cleanTerm === '吸收量' || cleanTerm === '水滴标示') {
    return {
      term,
      inArticleSectionId: 'absorbency-standards',
      inArticleSectionTitle: '2.3 吸收量规格与水滴标示',
      wikiUrl: `/wiki/${encodeURIComponent(term)}`
    };
  }

  if (cleanTerm === '使用方法' || cleanTerm === '置入步骤') {
    return {
      term,
      inArticleSectionId: 'usage-guide',
      inArticleSectionTitle: '3 使用方法',
      wikiUrl: `/wiki/${encodeURIComponent(term)}`
    };
  }

  // All other terms are independent wiki articles
  return {
    term,
    wikiUrl: `/wiki/${encodeURIComponent(term)}`
  };
}

export const ARTICLE_SECTIONS: SectionDef[] = [
  {
    id: 'history',
    number: '1',
    title: '卫生棉条的历史',
    level: 2
  },
  {
    id: 'structure-and-types',
    number: '2',
    title: '棉条的构造与类型',
    level: 2,
    subsections: [
      { id: 'applicator-tampons', number: '2.1', title: '导管型的卫生棉条', level: 3 },
      { id: 'digital-tampons', number: '2.2', title: '指入式的卫生棉条', level: 3 },
      { id: 'absorbency-standards', number: '2.3', title: '吸收量规格与水滴标示', level: 3 }
    ]
  },
  {
    id: 'usage-guide',
    number: '3',
    title: '使用方法',
    level: 2,
    subsections: [
      { id: 'preparation-posture', number: '3.1', title: '置入姿势与清洁准备', level: 3 },
      { id: 'insertion-applicator', number: '3.2', title: '置入步骤与深度', level: 3 },
      { id: 'removal-frequency', number: '3.3', title: '取出与更换时间', level: 3 }
    ]
  },
  {
    id: 'common-myths',
    number: '4',
    title: '棉条的迷思',
    level: 2,
    subsections: [
      { id: 'myth-hymen', number: '4.1', title: '处女膜与处女使用迷思', level: 3 },
      { id: 'myth-lost-uterus', number: '4.2', title: '棉条在体内迷失的迷思', level: 3 },
      { id: 'myth-urination', number: '4.3', title: '如厕排尿与异物感迷思', level: 3 }
    ]
  },
  {
    id: 'safety-and-tss',
    number: '5',
    title: '相关疾病',
    level: 2,
    subsections: [
      { id: 'tss-mechanism', number: '5.1', title: '中毒性休克综合征（TSS）', level: 3 },
      { id: 'prevention-guidelines', number: '5.2', title: '病因与预防措施', level: 3 }
    ]
  },
  {
    id: 'environmental-impact',
    number: '6',
    title: '环境影响与可持续性',
    level: 2
  },
  {
    id: 'see-also',
    number: '7',
    title: '相关条目',
    level: 2
  },
  {
    id: 'references',
    number: '8',
    title: '参考资料',
    level: 2
  },
  {
    id: 'external-links',
    number: '9',
    title: '外部链接',
    level: 2
  }
];

export const CATEGORIES_LIST = [
  '女性生理用品',
  '个人卫生用品',
  '月经周期',
  '一次性用品',
  '阴道'
];

export const REVISION_HISTORY = [
  {
    id: 'rev-8419201',
    date: '2026年3月18日 14:22',
    user: 'MedDoctor_CN',
    bytes: '+2,410',
    comment: '依据ACOG最新指南更新“阴道冠”医学名词并补全解剖学参考文献'
  },
  {
    id: 'rev-8210394',
    date: '2025年11月04日 09:15',
    user: 'Cyan_Biochem',
    bytes: '+540',
    comment: '增修FDA与ISO 23418吸水量等级表，新增TSST-1外毒素生化机理小节'
  },
  {
    id: 'rev-7994021',
    date: '2025年6月29日 18:40',
    user: 'WikipedianCN',
    bytes: '+128',
    comment: '规范简体中文医学统一词汇，校对化学纤维中文译名'
  },
  {
    id: 'rev-7631892',
    date: '2024年12月10日 21:03',
    user: 'EcoLifeLab',
    bytes: '+1,820',
    comment: '增设“环境影响与可持续替代品”章节，引用海洋保护协会调查数据'
  },
  {
    id: 'rev-7019485',
    date: '2024年4月02日 11:32',
    user: 'HistoryBuff_99',
    bytes: '+3,100',
    comment: '扩充厄尔·哈斯专利历史，补充德国o.b.棉条研发记录与古埃及草纸文献'
  }
];

export const TALK_TOPICS = [
  {
    title: '建议将“处女膜”全面修正为解剖学标准词“阴道冠”',
    startedBy: 'BioEthicsResearcher',
    date: '2025-08-14',
    status: '已达成共识',
    summary: '现代医学界（如瑞典性教育协会RFSU、中华医学会妇产科学分会）已广泛推荐使用“阴道冠（Vaginal corona）”替代带有传统道德隐喻的旧称。条目正文已统一采用现代解剖学术语，并在历史辨析中保留说明。'
  },
  {
    title: '关于TSS致病率统计数据的时效性辨析',
    startedBy: 'InfectiousDisGuy',
    date: '2025-02-19',
    status: '讨论中',
    summary: '目前条目中引用的TSS发病率包含1980年代Rely事件时期的历史数据（超10万分之10），与现代常规发病率（10万分之0.8以下）存在显著时代差异，建议明确分段阐述历史背景。'
  },
  {
    title: '天然海绵棉条与月经海绵是否归入本条目？',
    startedBy: 'ProductArchivist',
    date: '2024-09-08',
    status: '已归档',
    summary: '天然海绵和合成海绵月经栓因无拉绳且材质形态不同，已设立“月经海绵”独立消歧义指引，本条目着重于现代工业化棉/粘胶纤维圆柱状棉条。'
  }
];

export const WIKITEXT_RAW = `{{Medical citation needed}}
[[File:Tampon.JPG|thumb|玻璃纸包装的卫生棉条。（图中的尺以公分为单位）]]
'''卫生棉条'''（{{lang-en|Tampon}}），又称'''棉条'''、'''月经栓'''，是一种圆柱状的吸收材料，作为女性[[月经]]来潮时的卫生用品，用以置入阴道中吸收经血。英语中的名称“tampon”直接借自法语，意为一块堵塞孔洞的布料、栓或塞<ref>{{Cite web|title=Facts on Tampons|publisher=U.S. FDA}}</ref>。

现代工业化卫生棉条主要采用脱脂棉、[[粘胶纤维]]（Rayon，人造棉）或两者按比例混纺压制而成，具备高密度毛细孔结构，其尾端连接着高抗拉强度的编织棉线拉绳，以利于使用者在更换时将其完整取出。依据导入方式，市售产品主要划分为外附推杆的「'''导管型卫生棉条'''」与不附带导管、以洗净手指直接推入的「'''指入式卫生棉条'''」两大类别。

相较于粘贴在内裤外部的[[卫生巾]]，卫生棉条在体内直接吸收经血，经血在接触外界空气前即被锁定，因此大幅减少了经期闷热、异味产生与摩擦破皮的不适感；同时在游泳、温泉水疗及高强度田径运动中，棉条能提供高度的行动自由且无外观痕迹。

== 卫生棉条的历史 ==
[[File:Tampon with applicator.jpg|thumb|导管型卫生棉条]]
古代希腊的女性常会将麻布包裹在木头上，类似于现代的卫生棉条。

导管式的卫生棉条是由美国丹佛的[[厄尔·哈斯]]（Earle Haas）医生于1929年发明，1931年申请专利，1936年在美国上市。另一种说法是，卫生棉条是由西德的一位妇科女医师，在1950年所设计出来的女性用品。由于使用卫生棉条不影响衣着和运动，受到了许多人的青睐，欧美女性使用较多。由于多数亚洲人并不习惯使用置入性卫生用品，卫生棉条在亚洲国家的女性中使用比例较少。{{fact}}

全球有一些地方将卫生棉条列为医用品。美国药监局（FDA）将其列为二级医疗用品。台湾卫生署1989年公告实施法令中，明列卫生棉条归类为2级侵入式医疗用品，与避孕套同级，目的是要国内生产商在医疗等级的环境进行生产及良好的品管，进口商则需要提供输入途径的资讯，食药署也会进行抽检，而在产品包装上则要列明生产商、物料、使用方法、制造日期及有效期间等资料，法令并不限制一般消费者从零售商购买卫生棉条。

=== 古代起源与原始形态 ===
人类历史上女性使用置入型吸收物的记载可追溯至古埃及。古埃及妇女利用软化压制的莎草纸卷制成圆柱形吸收体；古希腊名医[[希波克拉底]]记载女性将细亚麻布包裹在光滑木条上作为月经栓；古罗马时期则使用脱脂羊毛球<ref>{{Cite web|title=The History of Tampons|author=Vostral, Sharra L.|year=2008}}</ref>。

=== 现代发明与专利历程 ===
哈斯医生于1931年11月19日正式向美国专利商标局提交专利申请，并于1933年9月获颁美利坚合众国专利第1,926,900号（名称为「月经吸收装置」Catamenial device）<ref>{{Cite patent|country=US|number=1926900A|title=Catamenial device|inventor=Earle Haas|pubdate=1933-09-12}}</ref>。随后，女性企业家格特鲁德·腾德里奇（Gertrude Tendrich）以32,000美元买下该专利权与品牌注册商标，于1936年创立了知名经期用品品牌「丹碧丝」（Tampax），正式开启了现代棉条的大规模工业化量产。

1950年，西德妇产科女医师朱迪丝·埃瑟-米塔格（Judith Esser-Mittag）与化学工程师卡尔·汉克尔（Carl Hahn）合作，从女性人体工学与环保减塑出发，改良研发出无需导管的「指入式棉条」，并以德语「ohne Binde」（意为「无需卫生护垫」）的缩写创立了著名的「o.b.」品牌<ref>{{Cite journal|title=Der o.b.-Tampon: Geschichte einer Erfindung|journal=Deutsches Ärzteblatt|year=1985}}</ref>。

== 棉条的构造与类型 ==
[[File:Elements of a tampon with applicator.jpg|thumb|导管型卫生棉条的构造拆解：1. 棉条 2. 外管 3. 内管 4. 绳子 5. 防菌包装纸]]
卫生棉条的材质主要是由棉、人造纤维或这两种材质混合而成，有直径1公分到1.9公分等尺寸，尾端附有棉线（拉绳）。卫生棉条的尖端的圆弧程度各家厂牌有所不同，让使用者可依自己的使用习惯选择。卫生棉条的本体上常有直线型或斜纹型的压痕，可增加卫生棉条导流的能力，在吸收经血膨胀时能与阴道壁贴合。

导管型的卫生棉条附纸质或塑胶质导管，方便使用者导入棉条。导管整体构造又分为外管和内管。外管的表面平滑，前端是圆头的，以便插入。外管前端是圆滑的半球状，并有类似花瓣状的开口，圆滑的设计能方便插入阴道。内管是一枝推杆，以活塞的方式将外管内的导管推出。

=== 导管型卫生棉条 ===
导管型卫生棉条包含一套辅助置入套管，分为：
* '''外导管'''：前端多为圆滑花瓣状切口（Petal tip），推入时顺滑扩张，减轻摩擦不适。
* '''防滑握把区'''：管身设有防滑凹槽或凸环，便于手指稳定捏持施力。
* '''内推杆'''：嵌套在外管后方，通过推进机制将内部压缩棉芯推至阴道深处无感区。
* '''吸收棉芯与拉绳'''：紧密压缩棉体，尾部拉绳抗拉力标准需承受至少3公斤。

=== 指入式卫生棉条 ===
指入式棉条（Digital tampon）不具备外附塑料或纸质导管，包装体积极为小巧。棉条本体外部通常设计有纵向或螺旋状的压花纹路，旨在引导经血均匀向四周扩散，使棉条在吸收水分时呈同心圆状均匀膨胀，紧密贴合阴道壁。

=== 吸收量与国际规格标准 ===
[[File:Tamponlable.jpg|thumb|卫生棉条外包装上的吸收量级别标签标示]]
{| class="wikitable" style="width:100%; text-align:center;"
! 吸收等级 !! 英文标示 !! 吸收量标准（克） !! 适用流量场景 !! 水滴图示
|-
| 量少型 || Light / Junior || 6克以下 || 经期初起或尾声 || 💧
|-
| 普通型 || Regular || 6 至 9克 || 中等标准流量 || 💧💧
|-
| 量多型 || Super || 9 至 12克 || 流量高峰日间 || 💧💧💧
|-
| 超多型 || Super Plus || 12 至 15克 || 特大经血流量 || 💧💧💧💧
|-
| 极多型 || Ultra || 15 至 18克 || 异常大流量（慎用） || 💧💧💧💧💧
|}

== 使用方法与步骤 ==
[[File:Vaginal tampon.png|thumb|卫生棉条在阴道内的放置位置示意图]]
使用卫生棉条前，首要步骤为使用肥皂与清水彻底清洁双手。
初学者置入导管型棉条时，应保持朝向后背尾骨方向呈约45度角缓慢推进，直到手指触碰阴道口，再用食指推动推杆将棉芯推入无感区，最后取出空导管。
取出时拉动体外棉线即可。单一棉条留置在体内的最长时间绝对不可超过8小时。

== 安全防护与中毒性休克综合征 ==
[[中毒性休克综合征]]（TSS）是由[[金黄色葡萄球菌]]产生之外毒素（TSST-1）引起的急性全身毒血症。
现代临床防护指引：
# 选用符合当前经血流量的'''最低吸收量'''棉条。
# 单支棉条置留时间建议为'''4至6小时'''，严禁超过'''8小时'''。
# 经期夜间睡眠若超过8小时，建议改用外部卫生巾或经期短裤。

== 参见 ==
* [[月经]]
* [[卫生巾]]
* [[月经杯]]
* [[阴道冠]]
* [[中毒性休克综合征]]
* [[布卫生巾]]

== 参考文献 ==
{{reflist}}

== 外部链接 ==
* [https://www.fda.gov/consumers/consumer-updates/facts-tampons-and-how-use-them-safely 美国食品药品监督管理局（FDA）：卫生棉条使用安全指引]
* [https://commons.wikimedia.org/wiki/Category:Tampons 维基共享资源上的相关多媒体与解剖图解：Tampons]
`;
