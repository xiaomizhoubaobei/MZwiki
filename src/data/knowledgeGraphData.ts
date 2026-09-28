export type GraphCategory =
  | 'core'       // 核心条目
  | 'product'    // 生理用品
  | 'medical'    // 医学与病理
  | 'anatomy'    // 解剖与生理
  | 'history'    // 历史人物与品牌
  | 'material'   // 材质与工艺
  | 'society';   // 社会与文化

export interface GraphNode {
  id: string;
  name: string;
  pinyin?: string;
  category: GraphCategory;
  categoryLabel: string;
  val: number;          // Node weight / visual size
  summary: string;
  inArticleSectionId?: string;
  articleWikiTerm?: string;
  imageUrl?: string;
  tags?: string[];
  // Dynamic coordinates computed by simulation or layout
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
  type?: 'primary' | 'medical' | 'anatomy' | 'contrast' | 'history' | 'material';
  description?: string;
}

export const GRAPH_CATEGORIES: { key: GraphCategory | 'all'; label: string; color: string; darkColor: string; bg: string }[] = [
  { key: 'all', label: '全部实体', color: '#3366cc', darkColor: '#6699ff', bg: 'bg-[#3366cc]/10' },
  { key: 'core', label: '核心条目', color: '#2563eb', darkColor: '#60a5fa', bg: 'bg-blue-500/10' },
  { key: 'product', label: '生理用品', color: '#059669', darkColor: '#34d399', bg: 'bg-emerald-500/10' },
  { key: 'medical', label: '医学与病理', color: '#dc2626', darkColor: '#f87171', bg: 'bg-red-500/10' },
  { key: 'anatomy', label: '解剖生理', color: '#7c3aed', darkColor: '#a78bfa', bg: 'bg-purple-500/10' },
  { key: 'history', label: '历史与品牌', color: '#d97706', darkColor: '#fbbf24', bg: 'bg-amber-500/10' },
  { key: 'material', label: '结构材质', color: '#0891b2', darkColor: '#22d3ee', bg: 'bg-cyan-500/10' },
  { key: 'society', label: '社会与文化', color: '#db2777', darkColor: '#f472b6', bg: 'bg-pink-500/10' },
];

export const GRAPH_NODES: GraphNode[] = [
  {
    id: 'tampon',
    name: '卫生棉条',
    pinyin: 'Tampon',
    category: 'core',
    categoryLabel: '核心条目',
    val: 32,
    summary: '是一种圆柱状吸收经血的女性经期个人卫生用品，由医用脱脂棉或人造棉压缩制成，置入阴道无感区直接吸纳经血。',
    inArticleSectionId: 'top',
    articleWikiTerm: '卫生棉条',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Tampons.jpg/640px-Tampons.jpg',
    tags: ['核心', '经期用品', '体内吸收']
  },
  {
    id: 'applicator-tampon',
    name: '导管型卫生棉条',
    pinyin: 'Applicator Tampon',
    category: 'product',
    categoryLabel: '生理用品',
    val: 20,
    summary: '附带由光滑塑料或纸质外管与内推杆组成的套管系统，辅助使用者顺畅、无痛且卫生地将吸收棉芯推入阴道后穹窿。',
    inArticleSectionId: 'types-and-structure',
    articleWikiTerm: '导管型卫生棉条',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Tampax_Compak.jpg/640px-Tampax_Compak.jpg',
    tags: ['套管', '新手友好', '外壳推杆']
  },
  {
    id: 'digital-tampon',
    name: '指入式卫生棉条',
    pinyin: 'Digital Tampon',
    category: 'product',
    categoryLabel: '生理用品',
    val: 18,
    summary: '无外置导管的圆柱形棉条，由清洁的手指直接推入阴道。体积小巧易携，环保且减少一次性塑料废弃物。',
    inArticleSectionId: 'types-and-structure',
    articleWikiTerm: '指入式卫生棉条',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Tampons.jpg/640px-Tampons.jpg',
    tags: ['紧凑', '便携', '零塑料']
  },
  {
    id: 'sanitary-pad',
    name: '卫生巾',
    pinyin: 'Sanitary Napkin / Pad',
    category: 'product',
    categoryLabel: '生理用品',
    val: 24,
    summary: '贴附于内裤内侧以吸收经血的外部吸收垫，主要由棉柔或干爽网面表层、高分子吸水树脂（SAP）与防漏底膜构成。',
    articleWikiTerm: '卫生巾',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sanitary_towel_with_wings.jpg/640px-Sanitary_towel_with_wings.jpg',
    tags: ['外置吸收', '大众普及', '防漏']
  },
  {
    id: 'menstrual-cup',
    name: '月经杯',
    pinyin: 'Menstrual Cup',
    category: 'product',
    categoryLabel: '生理用品',
    val: 22,
    summary: '又称月事杯，钟形医用级硅胶或TPE弹性容器，置于阴道内收集而非吸收经血，具有重复清洗使用、环保经济且长效等优势。',
    inArticleSectionId: 'market-and-alternatives',
    articleWikiTerm: '月经杯',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Menstrual_cup_white_background.jpg/640px-Menstrual_cup_white_background.jpg',
    tags: ['体内收集', '硅胶', '环保']
  },
  {
    id: 'panty-liner',
    name: '护垫',
    pinyin: 'Panty Liner',
    category: 'product',
    categoryLabel: '生理用品',
    val: 16,
    summary: '比常规卫生巾更薄更短小的外部吸收衬垫，用于非经期日常分泌物吸收、经期初期或尾声微量经血吸收以及配合棉条防漏。',
    articleWikiTerm: '护垫',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Panty_liner.jpg/640px-Panty_liner.jpg',
    tags: ['日常轻薄', '分泌物护理']
  },
  {
    id: 'cloth-pad',
    name: '布卫生巾',
    pinyin: 'Cloth Menstrual Pad',
    category: 'product',
    categoryLabel: '生理用品',
    val: 15,
    summary: '由纯棉、竹纤维等织物缝制而成的可清洗重复使用经期用品，具有透气性良好及减少塑料废弃物等优点。',
    articleWikiTerm: '布卫生巾',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Cloth_menstrual_pads.jpg/640px-Cloth_menstrual_pads.jpg',
    tags: ['纯棉', '可水洗', '零废弃']
  },
  {
    id: 'feminine-hygiene',
    name: '女性生理用品',
    pinyin: 'Feminine Hygiene Products',
    category: 'product',
    categoryLabel: '生理用品',
    val: 26,
    summary: '女性在月经期、分娩后及日常分泌物管理中用于吸收或收集血液、体液并维护外阴及生殖道卫生的产品总称。',
    articleWikiTerm: '女性生理用品',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Tampons.jpg/640px-Tampons.jpg',
    tags: ['分类主条目', '卫生个护']
  },
  {
    id: 'tss',
    name: '中毒性休克综合征',
    pinyin: 'Toxic Shock Syndrome',
    category: 'medical',
    categoryLabel: '医学与病理',
    val: 26,
    summary: '由金黄色葡萄球菌释放的外毒素引发的全身性急性重症，症状包括突发高热、皮疹、低血压与多器官受累，科学规范使用棉条（不超过8小时）可有效预防。',
    inArticleSectionId: 'safety-and-tss',
    articleWikiTerm: '中毒性休克综合征',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Staphylococcus_aureus_Gram.jpg/640px-Staphylococcus_aureus_Gram.jpg',
    tags: ['急性重症', 'TSST-1', '8小时安全限']
  },
  {
    id: 'staph-aureus',
    name: '金黄色葡萄球菌',
    pinyin: 'Staphylococcus aureus',
    category: 'medical',
    categoryLabel: '医学与病理',
    val: 20,
    summary: '一种革兰氏阳性球菌，广泛存在于人体皮肤、鼻腔与黏膜表面。在特定高需氧或高吸水纤维密闭环境下可过度繁殖并产生毒素。',
    inArticleSectionId: 'tss-pathophysiology',
    articleWikiTerm: '金黄色葡萄球菌',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Staphylococcus_aureus_Gram.jpg/640px-Staphylococcus_aureus_Gram.jpg',
    tags: ['病原菌', '条件致病']
  },
  {
    id: 'tsst-1',
    name: '中毒性休克综合征毒素-1',
    pinyin: 'Toxic Shock Syndrome Toxin-1 (TSST-1)',
    category: 'medical',
    categoryLabel: '医学与病理',
    val: 17,
    summary: '金黄色葡萄球菌在特定高吸收人造纤维与高氧微环境下分泌的超抗原外毒素，能过度激活T细胞触发严重的细胞因子风暴。',
    inArticleSectionId: 'tss-pathophysiology',
    tags: ['超抗原', '细胞因子风暴']
  },
  {
    id: 'vaginal-flora',
    name: '阴道菌群',
    pinyin: 'Vaginal Flora',
    category: 'medical',
    categoryLabel: '医学与病理',
    val: 21,
    summary: '以乳杆菌（Lactobacillus）为主导的正常女性生殖道共生微生态系统，通过分泌乳酸与过氧化氢维持弱酸性微环境（pH 3.8–4.5）抵御外来致病菌。',
    inArticleSectionId: 'vaginal-microecology',
    articleWikiTerm: '阴道菌群',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Lactobacillus_acidophilus_%2801%29.jpg/640px-Lactobacillus_acidophilus_%2801%29.jpg',
    tags: ['乳杆菌', '弱酸自净', '微生态']
  },
  {
    id: 'douching',
    name: '清洗 (医学)',
    pinyin: 'Vaginal Douching',
    category: 'medical',
    categoryLabel: '医学与病理',
    val: 17,
    summary: '将液体引入阴道内的冲洗操作。现代妇产科学指南明确建议健康女性避免常规冲洗，以防破坏菌群平衡与屏障功能。',
    articleWikiTerm: '清洗 (医学)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Klystierspritze.jpg/640px-Klystierspritze.jpg',
    tags: ['冲洗禁忌', '菌群失调']
  },
  {
    id: 'menstruation',
    name: '月经',
    pinyin: 'Menstruation',
    category: 'anatomy',
    categoryLabel: '解剖生理',
    val: 24,
    summary: '育龄期女性卵巢周期性排卵引起的子宫内膜剥脱并伴随出血的生理现象。平均周期约28天，出血持续约3至7天。',
    inArticleSectionId: 'top',
    articleWikiTerm: '月经',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/MenstrualCycle2_zh-hans.svg/640px-MenstrualCycle2_zh-hans.svg.png',
    tags: ['生理周期', '子宫内膜', '经血']
  },
  {
    id: 'vaginal-fornix',
    name: '阴道穹',
    pinyin: 'Vaginal Fornix',
    category: 'anatomy',
    categoryLabel: '解剖生理',
    val: 20,
    summary: '阴道顶端环绕宫颈后方的深陷区域（后穹窿）。该部位缺乏痛觉神经末梢，棉条推入此深度后呈现完全无异物感的舒适状态。',
    inArticleSectionId: 'insertion-applicator',
    tags: ['无感区', '无痛感', '放置深度']
  },
  {
    id: 'vaginal-corona',
    name: '阴道冠',
    pinyin: 'Vaginal Corona / Hymen',
    category: 'anatomy',
    categoryLabel: '解剖生理',
    val: 22,
    summary: '位于女性阴道口周围的一圈柔软且富有弹性的黏膜皱襞组织（旧称处女膜）。中心天然具有开孔（如筛状、环状），经血由此排出，并非封闭实心薄膜。',
    inArticleSectionId: 'myths-hymen',
    articleWikiTerm: '阴道冠',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Hymen_types.svg/640px-Hymen_types.svg.png',
    tags: ['弹性黏膜', '自然开孔', '破除羞辱']
  },
  {
    id: 'female-reproductive',
    name: '女性生殖系统',
    pinyin: 'Female Reproductive System',
    category: 'anatomy',
    categoryLabel: '解剖生理',
    val: 20,
    summary: '由内生殖器（卵巢、输卵管、子宫、阴道）与外生殖器（阴阜、大阴唇、小阴唇、阴蒂、前庭）组成。',
    articleWikiTerm: '女性生殖系统',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Female_anatomy.svg/640px-Female_anatomy.svg.png',
    tags: ['人体解剖', '内生殖器']
  },
  {
    id: 'earle-haas',
    name: '厄尔·哈斯',
    pinyin: 'Earle Haas (1888–1981)',
    category: 'history',
    categoryLabel: '历史与品牌',
    val: 22,
    summary: '美国骨科医生与发明家。1929年发明了现代双套管导管型卫生棉条，并于1931年取得专利，随后催生了著名品牌丹碧丝（Tampax）。',
    inArticleSectionId: 'history-modern-invention',
    articleWikiTerm: '厄尔·哈斯',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/US_Patent_1926900_Earle_Haas_Tampon.png/640px-US_Patent_1926900_Earle_Haas_Tampon.png',
    tags: ['发明家', '现代专利', '骨科医生']
  },
  {
    id: 'tampax',
    name: '丹碧丝',
    pinyin: 'Tampax',
    category: 'history',
    categoryLabel: '历史与品牌',
    val: 19,
    summary: '宝洁旗下的著名卫生棉条品牌，源自厄尔·哈斯1931年的专利发明，于1936年创立并推向国际市场，是现代导管式卫生棉条的商业化代表。',
    inArticleSectionId: 'history-modern-invention',
    articleWikiTerm: '丹碧丝',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Tampax_Compak.jpg/640px-Tampax_Compak.jpg',
    tags: ['导管商业化', '宝洁', '1936']
  },
  {
    id: 'kotex',
    name: '高洁丝',
    pinyin: 'Kotex',
    category: 'history',
    categoryLabel: '历史与品牌',
    val: 17,
    summary: '金佰利旗下的女性卫生护理品牌，创立于1920年，是世界上最早实现工业化批量生产一次性经期卫生用品的品牌之一。',
    articleWikiTerm: '高洁丝',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Kotex_pad_box.jpg/640px-Kotex_pad_box.jpg',
    tags: ['金佰利', '一次性卫生巾']
  },
  {
    id: 'rayon',
    name: '粘胶纤维',
    pinyin: 'Rayon / Viscose',
    category: 'material',
    categoryLabel: '结构材质',
    val: 18,
    summary: '由天然木浆纤维素经过碱化与黄化处理制成的再生纤维素纤维，吸水率显著高于天然纯棉，常用于棉条高吸收芯体。',
    inArticleSectionId: 'types-and-structure',
    articleWikiTerm: '粘胶纤维',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Rayon_fiber.jpg/640px-Rayon_fiber.jpg',
    tags: ['木浆再生', '高吸水芯体']
  },
  {
    id: 'cotton',
    name: '脱脂棉',
    pinyin: 'Absorbent Cotton',
    category: 'material',
    categoryLabel: '结构材质',
    val: 17,
    summary: '天然棉花经脱脂、漂白与消毒制成的纤维材料，亲肤、透气且天然低致敏，是纯棉棉条与医用棉球的核心材质。',
    inArticleSectionId: 'types-and-structure',
    tags: ['纯棉', '低致敏', '亲肤']
  },
  {
    id: 'pink-tax',
    name: '粉红税',
    pinyin: 'Pink Tax',
    category: 'society',
    categoryLabel: '社会与文化',
    val: 19,
    summary: '指基于性别而对针对女性销售的商品或服务标示更高价格的社会与市场现象，广泛体现在经期必需用品的税率与溢价中。',
    inArticleSectionId: 'culture-and-society',
    articleWikiTerm: '粉红税',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sanitary_towel_with_wings.jpg/640px-Sanitary_towel_with_wings.jpg',
    tags: ['性别溢价', '经期税', '经济学']
  },
  {
    id: 'railway-controversy',
    name: '中国大陆铁路卫生巾售卖争议',
    pinyin: 'Railway Sanitary Pad Controversy',
    category: 'society',
    categoryLabel: '社会与文化',
    val: 17,
    summary: '围绕公共交通工具（如高铁客运列车）是否应常规售卖经期应急卫生用品展开的广泛公众讨论，推动了公共关怀与性别友好设施的建设。',
    inArticleSectionId: 'culture-and-society',
    articleWikiTerm: '中国大陆铁路卫生巾售卖争议',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/CRH380A-2722_at_Beijing_South_%2820160505151523%29.jpg/640px-CRH380A-2722_at_Beijing_South_%2820160505151523%29.jpg',
    tags: ['高铁应急', '公共卫生', '社会倡议']
  },
  {
    id: 'menstrual-taboo',
    name: '月经禁忌',
    pinyin: 'Menstrual Taboo',
    category: 'society',
    categoryLabel: '社会与文化',
    val: 18,
    summary: '世界各地不同宗教、神话与民俗中对月经现象产生的文化禁忌、洁净观念以及当代破除经期羞辱、普及生理科学知识的社会运动。',
    inArticleSectionId: 'common-myths',
    articleWikiTerm: '月经禁忌',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Menstruation_taboo_symbol.svg/640px-Menstruation_taboo_symbol.svg.png',
    tags: ['人类学', '反羞辱', '文化观念']
  }
];

export const GRAPH_EDGES: GraphEdge[] = [
  // Core connections
  { id: 'e1', source: 'feminine-hygiene', target: 'tampon', relation: '下属核心品类', type: 'primary' },
  { id: 'e2', source: 'feminine-hygiene', target: 'sanitary-pad', relation: '主要外置品类', type: 'primary' },
  { id: 'e3', source: 'feminine-hygiene', target: 'menstrual-cup', relation: '重复收集品类', type: 'primary' },
  { id: 'e4', source: 'feminine-hygiene', target: 'panty-liner', relation: '轻量吸收品类', type: 'primary' },
  { id: 'e5', source: 'feminine-hygiene', target: 'cloth-pad', relation: '传统环保品类', type: 'primary' },

  // Forms of Tampon
  { id: 'e6', source: 'tampon', target: 'applicator-tampon', relation: '结构分类：导管式', type: 'primary' },
  { id: 'e7', source: 'tampon', target: 'digital-tampon', relation: '结构分类：指入式', type: 'primary' },

  // Product Comparison
  { id: 'e8', source: 'tampon', target: 'sanitary-pad', relation: '体内吸收 vs 体外垫附', type: 'contrast' },
  { id: 'e9', source: 'tampon', target: 'menstrual-cup', relation: '吸收型 vs 收集型', type: 'contrast' },
  { id: 'e10', source: 'tampon', target: 'panty-liner', relation: '常搭配使用以防侧漏', type: 'primary' },

  // Anatomy & Physiology
  { id: 'e11', source: 'tampon', target: 'menstruation', relation: '吸收排出经血', type: 'anatomy' },
  { id: 'e12', source: 'tampon', target: 'vaginal-fornix', relation: '正确置入：后穹窿无感区', type: 'anatomy' },
  { id: 'e13', source: 'tampon', target: 'vaginal-corona', relation: '弹性组织通过无撕裂', type: 'anatomy' },
  { id: 'e14', source: 'vaginal-fornix', target: 'female-reproductive', relation: '生殖道深部解剖构造', type: 'anatomy' },
  { id: 'e15', source: 'vaginal-corona', target: 'female-reproductive', relation: '阴道外口弹性黏膜', type: 'anatomy' },
  { id: 'e16', source: 'menstruation', target: 'female-reproductive', relation: '子宫内膜周期性剥脱', type: 'anatomy' },

  // Materials
  { id: 'e17', source: 'tampon', target: 'rayon', relation: '高吸收纤维芯体', type: 'material' },
  { id: 'e18', source: 'tampon', target: 'cotton', relation: '天然纯棉透气材质', type: 'material' },

  // History & Patents
  { id: 'e19', source: 'earle-haas', target: 'tampon', relation: '1929年发明并取得专利', type: 'history' },
  { id: 'e20', source: 'earle-haas', target: 'applicator-tampon', relation: '设计首款双套管系统', type: 'history' },
  { id: 'e21', source: 'earle-haas', target: 'tampax', relation: '专利授权创立品牌', type: 'history' },
  { id: 'e22', source: 'tampax', target: 'applicator-tampon', relation: '经典导管棉条产品', type: 'history' },
  { id: 'e23', source: 'kotex', target: 'sanitary-pad', relation: '1920年批量工业化', type: 'history' },

  // Medical & Microbiology
  { id: 'e24', source: 'tampon', target: 'tss', relation: '超时滞留（>8h）风险关联', type: 'medical' },
  { id: 'e25', source: 'tss', target: 'staph-aureus', relation: '致病菌过度繁殖', type: 'medical' },
  { id: 'e26', source: 'staph-aureus', target: 'tsst-1', relation: '释放致病性超抗原毒素', type: 'medical' },
  { id: 'e27', source: 'tampon', target: 'vaginal-flora', relation: '规范使用维系弱酸平衡', type: 'medical' },
  { id: 'e28', source: 'douching', target: 'vaginal-flora', relation: '过度冲洗破坏微生态', type: 'medical' },
  { id: 'e29', source: 'douching', target: 'feminine-hygiene', relation: '传统但有争议护理方式', type: 'medical' },

  // Society & Culture
  { id: 'e30', source: 'tampon', target: 'pink-tax', relation: '必需品增值税减免争议', type: 'primary' },
  { id: 'e31', source: 'sanitary-pad', target: 'railway-controversy', relation: '列车应急售卖公共议题', type: 'primary' },
  { id: 'e32', source: 'tampon', target: 'menstrual-taboo', relation: '倡导身体自主与去羞辱化', type: 'primary' },
  { id: 'e33', source: 'vaginal-corona', target: 'menstrual-taboo', relation: '科学破除处女膜贞洁迷思', type: 'anatomy' }
];
