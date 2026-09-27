import { GRAPH_NODES, GraphNode } from './knowledgeGraphData';

export interface TagCategoryMeta {
  key: string;
  name: string;
  enName: string;
  color: string;
  darkColor: string;
  bg: string;
  darkBg: string;
  border: string;
  iconName: string;
  description: string;
}

export interface TagCoOccurrenceItem {
  tag: string;
  count: number;
  sharedNodeNames: string[];
}

export interface TagDetail {
  name: string;
  count: number;
  heatScore: number;
  categoryKey: string;
  categoryName: string;
  color: string;
  darkColor: string;
  bg: string;
  nodes: GraphNode[];
  correspondingEntryTitle: string;
  correspondingEntryId?: string;
  description: string;
  coOccurringTags: TagCoOccurrenceItem[];
}

export const TAG_CATEGORIES: TagCategoryMeta[] = [
  {
    key: 'medical',
    name: '医学与病理',
    enName: 'Medicine & Pathology',
    color: '#dc2626',
    darkColor: '#f87171',
    bg: 'bg-red-500/10 text-red-600 dark:text-red-400',
    darkBg: 'bg-red-950/40',
    border: 'border-red-500/20',
    iconName: 'ShieldAlert',
    description: '涵盖中毒性休克综合征（TSS）、金葡菌外毒素、菌群弱酸微生态及临床安全使用界限。'
  },
  {
    key: 'product',
    name: '生理用品与器械',
    enName: 'Hygiene Products & Devices',
    color: '#059669',
    darkColor: '#34d399',
    bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    darkBg: 'bg-emerald-950/40',
    border: 'border-emerald-500/20',
    iconName: 'PackageCheck',
    description: '导管型、指入式、外置卫生巾、月经杯与护垫等多品类经期个人卫生吸收与收集器械。'
  },
  {
    key: 'anatomy',
    name: '解剖学与生理系统',
    enName: 'Anatomy & Physiology',
    color: '#7c3aed',
    darkColor: '#a78bfa',
    bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    darkBg: 'bg-purple-950/40',
    border: 'border-purple-500/20',
    iconName: 'Activity',
    description: '女性内生殖器、阴道穹无感区、阴道冠弹性黏膜开孔及子宫内膜周期性月经机制。'
  },
  {
    key: 'history',
    name: '历史发明与品牌',
    enName: 'History & Patents',
    color: '#d97706',
    darkColor: '#fbbf24',
    bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    darkBg: 'bg-amber-950/40',
    border: 'border-amber-500/20',
    iconName: 'History',
    description: '厄尔·哈斯1929年双套管专利、丹碧丝及高洁丝工业化量产历程与演变。'
  },
  {
    key: 'material',
    name: '结构材质与工艺',
    enName: 'Materials & Engineering',
    color: '#0891b2',
    darkColor: '#22d3ee',
    bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    darkBg: 'bg-cyan-950/40',
    border: 'border-cyan-500/20',
    iconName: 'Cpu',
    description: '再生粘胶纤维人造棉、天然医用脱脂棉、亲水透气与高吸收膨胀物理机理。'
  },
  {
    key: 'society',
    name: '社会、政策与文化',
    enName: 'Society & Culture',
    color: '#db2777',
    darkColor: '#f472b6',
    bg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    darkBg: 'bg-pink-950/40',
    border: 'border-pink-500/20',
    iconName: 'Scale',
    description: '必需品粉红税性别溢价、公共列车应急配售争议、月经反羞辱与身体自主认知。'
  }
];

// Mapping of tags to category classification
const TAG_CATEGORY_MAPPING: Record<string, string> = {
  // Medical
  '急性重症': 'medical',
  'TSST-1': 'medical',
  '8小时安全限': 'medical',
  '病原菌': 'medical',
  '条件致病': 'medical',
  '超抗原': 'medical',
  '细胞因子风暴': 'medical',
  '乳杆菌': 'medical',
  '弱酸自净': 'medical',
  '微生态': 'medical',
  '冲洗禁忌': 'medical',
  '菌群失调': 'medical',

  // Product
  '核心': 'product',
  '经期用品': 'product',
  '体内吸收': 'product',
  '套管': 'product',
  '新手友好': 'product',
  '外壳推杆': 'product',
  '紧凑': 'product',
  '便携': 'product',
  '零塑料': 'product',
  '外置吸收': 'product',
  '大众普及': 'product',
  '防漏': 'product',
  '体内收集': 'product',
  '硅胶': 'product',
  '环保': 'product',
  '日常轻薄': 'product',
  '分泌物护理': 'product',
  '可水洗': 'product',
  '零废弃': 'product',
  '分类主条目': 'product',
  '卫生个护': 'product',

  // Anatomy
  '生理周期': 'anatomy',
  '子宫内膜': 'anatomy',
  '经血': 'anatomy',
  '无感区': 'anatomy',
  '无痛感': 'anatomy',
  '放置深度': 'anatomy',
  '弹性黏膜': 'anatomy',
  '自然开孔': 'anatomy',
  '破除羞辱': 'anatomy',
  '人体解剖': 'anatomy',
  '内生殖器': 'anatomy',

  // History
  '发明家': 'history',
  '现代专利': 'history',
  '骨科医生': 'history',
  '导管商业化': 'history',
  '宝洁': 'history',
  '1936': 'history',
  '金佰利': 'history',
  '一次性卫生巾': 'history',

  // Material
  '木浆再生': 'material',
  '高吸水芯体': 'material',
  '纯棉': 'material',
  '低致敏': 'material',
  '亲肤': 'material',

  // Society
  '性别溢价': 'society',
  '经期税': 'society',
  '经济学': 'society',
  '高铁应急': 'society',
  '公共卫生': 'society',
  '社会倡议': 'society',
  '人类学': 'society',
  '反羞辱': 'society',
  '文化观念': 'society'
};

const TAG_DESCRIPTIONS: Record<string, string> = {
  '体内吸收': '置于阴道腔内直接吸收经血的卫生物品使用机制，以卫生棉条为代表，具有无外漏感、运动自由等特点。',
  '经期用品': '育龄女性在月经期用于卫生护理与体液管理的器械与吸收用品统称。',
  '急性重症': '发病急剧、病情进展迅猛并可能引发多脏器功能损伤的临床危急病理状态。',
  '8小时安全限': 'FDA与妇产科医学指南制定的体内棉条连续滞留最长时间限制，严防金葡菌滋生。',
  'TSST-1': '中毒性休克综合征毒素-1，金黄色葡萄球菌释放的一种可引发全身免疫风暴的超抗原。',
  '微生态': '人体生殖道共生微生物群落构成的自稳防御系统，以优势乳杆菌维持酸性屏障。',
  '弱酸自净': '乳杆菌酵解糖原产生乳酸使阴道维持在 pH 3.8–4.5，天然抑制致病性需氧及厌氧菌。',
  '无感区': '阴道上2/3区域（后穹窿）缺乏敏锐的体感痛觉神经支配，棉条推入到位后毫无异物感。',
  '弹性黏膜': '阴道冠由富含弹性纤维的黏膜皱襞构成，具有自然生理开孔，并非实心封闭膜。',
  '现代专利': '1929年由厄尔·哈斯发明的双套管式棉条专利，为现代一次性生理用品奠定技术基础。',
  '粉红税': '在功能与材质等同的前提下，针对女性销售的商品价格高于男性同类商品的市场性别定价差异。',
  '高铁应急': '公众关于高铁等长途公共交通工具是否应常备经期应急用品引发的公共政策与性别友好讨论。',
  '反羞辱': '打破传统文化对月经生理现象的负面污名化与避讳，倡导科学公开讨论与身体关怀。'
};

export const TAG_CORRESPONDING_ENTRY: Record<string, { entryTitle: string; entryId: string }> = {
  // Medical
  '急性重症': { entryTitle: '中毒性休克综合征', entryId: 'tss' },
  'TSST-1': { entryTitle: '中毒性休克综合征毒素-1', entryId: 'tsst-1' },
  '8小时安全限': { entryTitle: '8小时安全时限', entryId: 'safety-limit' },
  '病原菌': { entryTitle: '金黄色葡萄球菌', entryId: 'staph-aureus' },
  '条件致病': { entryTitle: '金黄色葡萄球菌', entryId: 'staph-aureus' },
  '超抗原': { entryTitle: '中毒性休克综合征毒素-1', entryId: 'tsst-1' },
  '细胞因子风暴': { entryTitle: '中毒性休克综合征', entryId: 'tss' },
  '乳杆菌': { entryTitle: '阴道菌群', entryId: 'vaginal-flora' },
  '弱酸自净': { entryTitle: '阴道菌群', entryId: 'vaginal-flora' },
  '微生态': { entryTitle: '阴道菌群', entryId: 'vaginal-flora' },
  '冲洗禁忌': { entryTitle: '清洗 (医学)', entryId: 'douching' },
  '菌群失调': { entryTitle: '阴道菌群', entryId: 'vaginal-flora' },

  // Product
  '核心': { entryTitle: '卫生棉条', entryId: 'tampon' },
  '经期用品': { entryTitle: '卫生棉条', entryId: 'tampon' },
  '体内吸收': { entryTitle: '卫生棉条', entryId: 'tampon' },
  '套管': { entryTitle: '导管型卫生棉条', entryId: 'applicator-tampon' },
  '新手友好': { entryTitle: '导管型卫生棉条', entryId: 'applicator-tampon' },
  '外壳推杆': { entryTitle: '导管型卫生棉条', entryId: 'applicator-tampon' },
  '紧凑': { entryTitle: '指入式卫生棉条', entryId: 'digital-tampon' },
  '便携': { entryTitle: '指入式卫生棉条', entryId: 'digital-tampon' },
  '零塑料': { entryTitle: '指入式卫生棉条', entryId: 'digital-tampon' },
  '外置吸收': { entryTitle: '卫生巾', entryId: 'sanitary-pad' },
  '大众普及': { entryTitle: '卫生巾', entryId: 'sanitary-pad' },
  '防漏': { entryTitle: '卫生巾', entryId: 'sanitary-pad' },
  '体内收集': { entryTitle: '月经杯', entryId: 'menstrual-cup' },
  '硅胶': { entryTitle: '月经杯', entryId: 'menstrual-cup' },
  '环保': { entryTitle: '月经杯', entryId: 'menstrual-cup' },
  '日常轻薄': { entryTitle: '护垫', entryId: 'panty-liner' },
  '分泌物护理': { entryTitle: '护垫', entryId: 'panty-liner' },
  '可水洗': { entryTitle: '布卫生巾', entryId: 'cloth-pad' },
  '零废弃': { entryTitle: '布卫生巾', entryId: 'cloth-pad' },
  '分类主条目': { entryTitle: '女性生理用品', entryId: 'feminine-hygiene' },
  '卫生个护': { entryTitle: '女性生理用品', entryId: 'feminine-hygiene' },

  // Anatomy
  '生理周期': { entryTitle: '月经', entryId: 'menstruation' },
  '子宫内膜': { entryTitle: '月经', entryId: 'menstruation' },
  '经血': { entryTitle: '月经', entryId: 'menstruation' },
  '无感区': { entryTitle: '阴道穹', entryId: 'vaginal-fornix' },
  '无痛感': { entryTitle: '阴道穹', entryId: 'vaginal-fornix' },
  '放置深度': { entryTitle: '阴道穹', entryId: 'vaginal-fornix' },
  '弹性黏膜': { entryTitle: '阴道冠', entryId: 'vaginal-corona' },
  '自然开孔': { entryTitle: '阴道冠', entryId: 'vaginal-corona' },
  '破除羞辱': { entryTitle: '阴道冠', entryId: 'vaginal-corona' },
  '人体解剖': { entryTitle: '女性生殖系统', entryId: 'female-reproductive' },
  '内生殖器': { entryTitle: '女性生殖系统', entryId: 'female-reproductive' },

  // History
  '发明家': { entryTitle: '厄尔·哈斯', entryId: 'earle-haas' },
  '现代专利': { entryTitle: '厄尔·哈斯', entryId: 'earle-haas' },
  '骨科医生': { entryTitle: '厄尔·哈斯', entryId: 'earle-haas' },
  '导管商业化': { entryTitle: '丹碧丝', entryId: 'tampax' },
  '宝洁': { entryTitle: '丹碧丝', entryId: 'tampax' },
  '1936': { entryTitle: '丹碧丝', entryId: 'tampax' },
  '金佰利': { entryTitle: '高洁丝', entryId: 'kotex' },
  '一次性卫生巾': { entryTitle: '高洁丝', entryId: 'kotex' },

  // Material
  '木浆再生': { entryTitle: '粘胶纤维', entryId: 'rayon' },
  '高吸水芯体': { entryTitle: '粘胶纤维', entryId: 'rayon' },
  '纯棉': { entryTitle: '脱脂棉', entryId: 'cotton' },
  '低致敏': { entryTitle: '脱脂棉', entryId: 'cotton' },
  '亲肤': { entryTitle: '脱脂棉', entryId: 'cotton' },

  // Society
  '性别溢价': { entryTitle: '粉红税', entryId: 'pink-tax' },
  '经期税': { entryTitle: '粉红税', entryId: 'pink-tax' },
  '经济学': { entryTitle: '粉红税', entryId: 'pink-tax' },
  '高铁应急': { entryTitle: '中国大陆铁路卫生巾售卖争议', entryId: 'railway-controversy' },
  '公共卫生': { entryTitle: '中国大陆铁路卫生巾售卖争议', entryId: 'railway-controversy' },
  '社会倡议': { entryTitle: '中国大陆铁路卫生巾售卖争议', entryId: 'railway-controversy' },
  '人类学': { entryTitle: '月经禁忌', entryId: 'menstrual-taboo' },
  '反羞辱': { entryTitle: '月经禁忌', entryId: 'menstrual-taboo' },
  '文化观念': { entryTitle: '月经禁忌', entryId: 'menstrual-taboo' }
};

/**
 * Computes all tags dynamically with aggregated node counts and metadata
 */
export function getAllTags(): TagDetail[] {
  const tagMap = new Map<string, { count: number; nodes: GraphNode[] }>();

  // Aggregate tags from all nodes
  GRAPH_NODES.forEach(node => {
    node.tags?.forEach(tag => {
      const existing = tagMap.get(tag);
      if (existing) {
        existing.count += 1;
        existing.nodes.push(node);
      } else {
        tagMap.set(tag, { count: 1, nodes: [node] });
      }
    });
  });

  const allTags: TagDetail[] = [];

  tagMap.forEach((val, tagName) => {
    const catKey = TAG_CATEGORY_MAPPING[tagName] || 'product';
    const cat = TAG_CATEGORIES.find(c => c.key === catKey) || TAG_CATEGORIES[1];
    const mapping = TAG_CORRESPONDING_ENTRY[tagName];
    const defaultEntryTitle = mapping ? mapping.entryTitle : (val.nodes[0]?.name || '卫生棉条');
    const defaultEntryId = mapping ? mapping.entryId : val.nodes[0]?.id;

    // Automated Tag Co-Occurrence Calculation
    const coMap = new Map<string, { count: number; nodes: Set<string> }>();
    val.nodes.forEach(node => {
      node.tags?.forEach(otherTag => {
        if (otherTag === tagName) return;
        const current = coMap.get(otherTag) || { count: 0, nodes: new Set() };
        current.count++;
        current.nodes.add(node.name);
        coMap.set(otherTag, current);
      });
    });

    const coOccurringTags: TagCoOccurrenceItem[] = Array.from(coMap.entries())
      .map(([coTag, coData]) => ({
        tag: coTag,
        count: coData.count,
        sharedNodeNames: Array.from(coData.nodes)
      }))
      .sort((a, b) => b.count - a.count);

    const heatScore = val.count * 10 + coOccurringTags.reduce((sum, item) => sum + item.count, 0) * 3;

    allTags.push({
      name: tagName,
      count: val.count,
      heatScore,
      categoryKey: cat.key,
      categoryName: cat.name,
      color: cat.color,
      darkColor: cat.darkColor,
      bg: cat.bg,
      nodes: val.nodes,
      correspondingEntryTitle: defaultEntryTitle,
      correspondingEntryId: defaultEntryId,
      description: TAG_DESCRIPTIONS[tagName] || `与「${val.nodes.map(n => n.name).join('、')}」等百科词条紧密关联的知识实体标签。`,
      coOccurringTags
    });
  });

  // Sort descending by count, then alphabetically
  return allTags.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-Hans-CN'));
}

/**
 * Returns tags grouped by domain categories
 */
export function getTagsByCategories(): { category: TagCategoryMeta; tags: TagDetail[] }[] {
  const tags = getAllTags();
  return TAG_CATEGORIES.map(cat => ({
    category: cat,
    tags: tags.filter(t => t.categoryKey === cat.key)
  })).filter(group => group.tags.length > 0);
}

/**
 * Returns high-frequency popular tags for quick navigation
 */
export function getPopularTags(limit = 12): TagDetail[] {
  return getAllTags().slice(0, limit);
}
