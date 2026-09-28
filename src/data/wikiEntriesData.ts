export interface WikiContentSection {
  title: string;
  paragraphs: string[];
}

export interface WikiAcademicRef {
  title: string;
  journal: string;
  year: string;
  doiOrUrl?: string;
}

export interface WikiEntry {
  id: string;
  title: string;
  aliases: string[];
  enTitle: string;
  category: 'medical' | 'product' | 'anatomy' | 'history' | 'material' | 'society';
  categoryLabel: string;
  tags: string[];
  summary: string;
  infobox: {
    label: string;
    value: string;
  }[];
  contentSections: WikiContentSection[];
  academicReferences: WikiAcademicRef[];
  relatedTerms: string[];
  inArticleSectionId?: string;
  imageUrl?: string;
}

export const WIKI_ENTRIES: WikiEntry[] = [
  {
    id: 'tss',
    title: '中毒性休克综合征',
    aliases: ['TSS', '中毒性休克症候群', 'Toxic Shock Syndrome'],
    enTitle: 'Toxic Shock Syndrome (TSS)',
    category: 'medical',
    categoryLabel: '医学与病理',
    tags: ['急性重症', 'TSST-1', '8小时安全限', '金黄色葡萄球菌', '超抗原'],
    summary: '中毒性休克综合征（英语：Toxic Shock Syndrome，简称TSS）是由金黄色葡萄球菌或化脓性链球菌产生的外毒素（主要是TSST-1）引发的罕见但可危及生命的急性全身性多系统毒血症。其临床特征包括突发高热、全身弥漫性红斑样皮疹、低血压休克以及多脏器功能受累。20世纪80年代曾因高吸收性合成纤维卫生棉条的长时间连续滞留而引发广泛流行，促使全球公共卫生机构制定棉条吸收等级标准与最长滞留时限规范。',
    infobox: [
      { label: '医学英文', value: 'Toxic Shock Syndrome (TSS)' },
      { label: '致病机制', value: '超抗原毒素（TSST-1 / 肠毒素）过度活化T细胞' },
      { label: '主要致病原', value: '金黄色葡萄球菌（Staphylococcus aureus）' },
      { label: '典型发病特征', value: '突发高热（>38.9°C）、皮疹、低血压、脱屑' },
      { label: '预防核心要点', value: '棉条单次连续置入不应超过8小时，选用最低有效吸收量' },
      { label: 'ICD-10编码', value: 'A48.3' }
    ],
    inArticleSectionId: 'safety-and-tss',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Staphylococcus_aureus_Gram.jpg/640px-Staphylococcus_aureus_Gram.jpg',
    contentSections: [
      {
        title: '病理生理机制',
        paragraphs: [
          '中毒性休克综合征的核心病理是超抗原（Superantigen）毒素引发的恶性全身免疫应答。常规抗原呈递需要经过巨噬细胞加工后，仅能激活约0.01%至0.1%的T淋巴细胞；而金黄色葡萄球菌分泌的中毒性休克综合征毒素-1（TSST-1）无需胞内加工，即可直接桥接抗原呈递细胞表面的主要组织相容性复合体II类分子（MHC-II）与T细胞受体（TCR）的Vβ链可变区。',
          '这种直接交联可非特异性激活机体内高达20%甚至30%的初始T淋巴细胞，导致细胞毒性T细胞大量爆发性释放肿瘤坏死因子-α（TNF-α）、白细胞介素-1（IL-1）、白细胞介素-6（IL-6）及干扰素-γ（IFN-γ），形成致命的“细胞因子风暴”（Cytokine Storm），迅速导致毛细血管通透性剧增、有效循环血量锐减、弥漫性血管内凝血（DIC）与多脏器衰竭。'
        ]
      },
      {
        title: '历史流行与棉条工艺关联',
        paragraphs: [
          '1978年，儿科医生詹姆斯·托德（James Todd）首次描述了7名儿童中出现的一组高热伴剥脱性皮炎的病例并命名为TSS。1980年代初，美国疾病控制与预防中心（CDC）在全美育龄期女性中监测到TSS发病率显著激增，绝大多数病例发生在经期使用高吸收型人造粘胶纤维棉条（如Rely棉条）的女性中。',
          '后续流行病学与微生物学研究阐明：超高吸收性聚酯或人造纤维将微量氧气带入原本低氧的阴道腔，棉条滞留时间过长，为定植的金葡菌提供了有利的需氧繁殖与TSST-1毒素高表达微环境。该事件直接促成了超高吸收性原料的淘汰，美国FDA自1982年起强制推行棉条包装标准化吸收等级标注与4–8小时更换安全警示。'
        ]
      },
      {
        title: '临床诊断与应急处置',
        paragraphs: [
          '根据美国CDC及国际公认临床诊断标准，确诊TSS需符合五大核心指标：体温骤升至38.9°C（102°F）以上；弥漫性黄斑状红斑皮疹；起病1至2周后掌跖部特征性脱皮；收缩压降至90 mmHg以下或直立性休克；以及累及消化道、肌肉、中枢神经、肾脏、肝脏或血液等至少3个脏器系统。',
          '在使用卫生棉条期间若突发寒战高热、头晕、恶心或皮肤发红，必须立即由阴道取出棉条，切勿继续放置，并立即前往综合医院急诊科告知医师经期棉条使用史。临床治疗首重积极补液复苏抗休克，并联用对产酶金葡菌敏感的抗生素（如苯唑西林、万古霉素）及克林霉素抑制细菌外毒素合成。'
        ]
      }
    ],
    academicReferences: [
      { title: 'Toxic-shock syndrome associated with phage-group-I Staphylococci', journal: 'The Lancet', year: '1978', doiOrUrl: '10.1016/S0140-6736(78)92274-2' },
      { title: 'The epidemiology of toxic-shock syndrome', journal: 'Annals of Internal Medicine', year: '1982', doiOrUrl: '10.7326/0003-4819-96-6-865' },
      { title: 'Superantigen-induced toxic shock: a review of mechanisms and clinical management', journal: 'Clinical Microbiology Reviews', year: '2020', doiOrUrl: '10.1128/CMR.00032-19' }
    ],
    relatedTerms: ['金黄色葡萄球菌', '中毒性休克综合征毒素-1', '卫生棉条', '8小时安全时限', '阴道菌群']
  },
  {
    id: 'menstrual-cup',
    title: '月经杯',
    aliases: ['月事杯', 'Menstrual Cup', '月经收集器'],
    enTitle: 'Menstrual Cup',
    category: 'product',
    categoryLabel: '生理用品',
    tags: ['体内收集', '硅胶', '环保', '经期用品', '可水洗'],
    summary: '月经杯（英语：Menstrual Cup）是一种钟形或漏斗形的弹性经期用品，由医用级液态硅胶（Silicone）、热塑性弹性体（TPE）或天然乳胶制成。与吸收经血的传统棉条或卫生巾不同，月经杯折叠后置入阴道下部，依靠自身弹性展开并与阴道壁形成轻微真空密封，用以直接收集经血。其单次排空时间可长达8至12小时，单只规范清洗消毒后可循环使用数年，具有显著的环保性与长期经济优势。',
    infobox: [
      { label: '工作机理', value: '置入阴道内密封收集经血（非吸收性）' },
      { label: '主流材质', value: '医用级液态硅胶（Platinum Silicone）、TPE' },
      { label: '单次容积', value: '通常为 20 mL 至 40 mL' },
      { label: '连续滞留上限', value: '最长不超过 12 小时' },
      { label: '重复使用寿命', value: '规范消毒维护可使用 2 至 5 年' },
      { label: '优势特点', value: '零一次性垃圾、不干涩吸水、无异味、运动防漏' }
    ],
    inArticleSectionId: 'market-and-alternatives',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Menstrual_cup_white_background.jpg/640px-Menstrual_cup_white_background.jpg',
    contentSections: [
      {
        title: '结构设计与折叠置入技巧',
        paragraphs: [
          '月经杯主体包含杯体、上部承托边缘（Rim）、减压微气孔（Air Holes）及底部的取拔柄（Stem）。上缘在阴道肌张力配合下紧贴阴道黏膜，形成微负压密封圈，有效隔绝空气氧化经血引起的异味，并彻底阻断经血外溢。',
          '初次使用者需掌握常用的几种折叠手势：C折法（C-fold/心形折叠）、打孔折叠法（Punch-down，前端最尖锐利于置入）及7字折叠法（7-fold）。置入后旋转杯底或轻抚杯身，确保杯体完全回弹张开即可达到安全防漏状态。'
        ]
      },
      {
        title: '医学安全性与循证评价',
        paragraphs: [
          '2019年发表于权威医学期刊《柳叶刀·公共卫生》（The Lancet Public Health）的系统性回顾研究表明，月经杯在防漏有效性、舒适度及感染风险控制方面与卫生巾和棉条相当甚至更优。',
          '由于医用硅胶表面光滑无吸水纤维，月经杯不会破坏阴道壁黏膜水分，亦不改变健康乳杆菌弱酸微生态。取出时只需轻捏杯底破坏真空负压即可平稳滑出，经期前后采用沸水煮沸5–10分钟完成终末消毒。'
        ]
      }
    ],
    academicReferences: [
      { title: 'Menstrual cup use, leakage, acceptability, safety, and availability: a systematic review and meta-analysis', journal: 'The Lancet Public Health', year: '2019', doiOrUrl: '10.1016/S2468-2667(19)30111-2' }
    ],
    relatedTerms: ['卫生棉条', '卫生巾', '布卫生巾', '阴道菌群', '阴道穹']
  },
  {
    id: 'sanitary-pad',
    title: '卫生巾',
    aliases: ['卫生棉', '卫生垫', 'Sanitary Napkin', 'Sanitary Pad'],
    enTitle: 'Sanitary Napkin / Pad',
    category: 'product',
    categoryLabel: '生理用品',
    tags: ['外置吸收', '大众普及', '防漏', '经期用品', '高吸水芯体'],
    summary: '卫生巾（英语：Sanitary Napkin / Menstrual Pad）是一种贴附于女性内裤内侧以吸收月经经血的外置吸收垫。现代一次性卫生巾一般由亲水无纺布或打孔PE薄膜表层、高分子吸水树脂（SAP）与木浆复合吸收芯体、防渗漏PE透气底膜以及带防移位压敏胶的侧翼构成。它是全球使用最广泛、普及率最高的基础女性生理卫生用品。',
    infobox: [
      { label: '使用方式', value: '外置贴附于内裤裆部内侧' },
      { label: '核心吸收材料', value: '高分子吸水树脂（SAP）+ 绒毛木浆' },
      { label: '建议更换周期', value: '每 2 至 4 小时更换一次' },
      { label: '主要形态', value: '日用型（240mm）、夜用型（350–420mm）、护垫' },
      { label: '历史商品化起点', value: '1920年代（高洁丝 Kotex 问世）' }
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sanitary_towel_with_wings.jpg/640px-Sanitary_towel_with_wings.jpg',
    contentSections: [
      {
        title: '吸收构造工程学',
        paragraphs: [
          '现代一次性卫生巾的吸收核心依赖高分子吸水树脂（Super Absorbent Polymer, SAP）。SAP是一种聚丙烯酸钠高分子交联聚合物，能够在数秒内吸收自重数百倍的水分并迅速形成水凝胶，在人体坐卧受压时仍能强力锁水不返渗。',
          '表层材质主要分为棉柔（热风或水刺无纺布，亲肤低致敏）与干爽网面（打孔漏斗型PE膜，经血瞬吸快干）。两侧翼（Wings）设计有效包覆内裤边缘，降低活动时侧漏移位的风险。'
        ]
      },
      {
        title: '健康卫生与更换规范',
        paragraphs: [
          '由于卫生巾处于外阴密闭潮湿环境中，排出的经血暴露于空气与体表细菌，若长时间未更换，温度与湿度条件极易加速杂菌滋生并分解血液蛋白产生异味。妇科医师普遍建议即使在经期血量稀少时，也应每2–4小时更换一次，保持外阴清洁干爽。'
        ]
      }
    ],
    academicReferences: [
      { title: 'Evaluation of menstrual hygiene products: Material science and dermatological considerations', journal: 'International Journal of Gynecology & Obstetrics', year: '2018', doiOrUrl: '10.1002/ijgo.12560' }
    ],
    relatedTerms: ['卫生棉条', '护垫', '布卫生巾', '高吸水芯体', '粉红税']
  },
  {
    id: 'staph-aureus',
    title: '金黄色葡萄球菌',
    aliases: ['金葡菌', 'Staphylococcus aureus', 'S. aureus'],
    enTitle: 'Staphylococcus aureus',
    category: 'medical',
    categoryLabel: '医学与病理',
    tags: ['病原菌', '条件致病', '急性重症', 'TSST-1', '超抗原'],
    summary: '金黄色葡萄球菌（学名：Staphylococcus aureus）是一种革兰氏阳性球菌，显微镜下呈典型的葡萄串状排列，菌落呈特征性金黄色。金葡菌是人体常见的共生与条件致病菌，约20%–30%的健康人群鼻腔、皮肤或会阴黏膜表面常年定植。在机体屏障受损或局部微环境改变（如棉条带入氧气、长期滞留）时，特定菌株可大量分泌外毒素（如TSST-1、肠毒素），引发中毒性休克等危重病症。',
    infobox: [
      { label: '微生物门类', value: '厚壁菌门 · 葡萄球菌科 · 葡萄球菌属' },
      { label: '革兰氏染色', value: '阳性（G+），球形直径约 0.8–1.0 μm' },
      { label: '致病因子', value: 'TSST-1、肠毒素、溶血素、凝固酶、杀白细胞素' },
      { label: '相关疾病', value: 'TSS、化脓性感染、菌血症、食物中毒' }
    ],
    inArticleSectionId: 'tss-pathophysiology',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Staphylococcus_aureus_Gram.jpg/640px-Staphylococcus_aureus_Gram.jpg',
    contentSections: [
      {
        title: '毒力因子与超抗原合成',
        paragraphs: [
          '金黄色葡萄球菌拥有极其丰富的毒力因子库。除导致化脓性炎症的血浆凝固酶和溶血素外，特定溶原性噬菌体感染的菌株携带有编码TSST-1的染色体致病岛（tst基因）。当局部pH处于中性至微碱性、且存在微量溶解氧及中等二氧化碳浓度时，tst基因表达上调，毒素大量合成并分泌入体循环。'
        ]
      }
    ],
    academicReferences: [
      { title: 'Pathogenesis of Staphylococcus aureus infections', journal: 'New England Journal of Medicine', year: '1998', doiOrUrl: '10.1056/NEJM199810153391606' }
    ],
    relatedTerms: ['中毒性休克综合征', '中毒性休克综合征毒素-1', '阴道菌群', '8小时安全时限']
  },
  {
    id: 'tsst-1',
    title: '中毒性休克综合征毒素-1',
    aliases: ['TSST-1', '肠毒素F', 'Toxic Shock Syndrome Toxin-1'],
    enTitle: 'Toxic Shock Syndrome Toxin-1',
    category: 'medical',
    categoryLabel: '医学与病理',
    tags: ['超抗原', '细胞因子风暴', '急性重症', 'TSST-1'],
    summary: '中毒性休克综合征毒素-1（TSST-1）是由金黄色葡萄球菌分泌的一种单链多肽外毒素，分子量约22 kDa。TSST-1是目前已知的最典型原核超抗原（Superantigen）之一，能够跨越经典的MHC限制性，直接同时锚定抗原递呈细胞的HLA-DR/DQ分子和T细胞抗原受体的Vβ亚基，激发广泛剧烈的系统性免疫级联反应。',
    infobox: [
      { label: '分子量', value: '约 22,049 Da（含 194 个氨基酸残基）' },
      { label: '毒素性质', value: '耐热原核超抗原单链多肽外毒素' },
      { label: '编码基因', value: '染色体致病岛 SaPI1 上的 tst 基因' },
      { label: '结合靶点', value: 'MHC-II 类分子外表面与 TCR Vβ 链' }
    ],
    inArticleSectionId: 'tss-pathophysiology',
    contentSections: [
      {
        title: '超抗原交联生物学机制',
        paragraphs: [
          '传统外源抗原需经抗原呈递细胞吞噬并酶解为小肽段，镶嵌于MHC抗原结合槽内呈递。而TSST-1结合在MHC-II分子的外侧保守结构域，同时结合TCR的Vβ链，直接诱发T细胞非特异性克隆增殖。这不仅耗竭了机体的免疫储备，而且使血清TNF-α与IFN-γ水平在数小时内暴增数千倍，是TSS低血压及器官损伤的直接生化元凶。'
        ]
      }
    ],
    academicReferences: [
      { title: 'Crystal structure of toxic shock syndrome toxin-1', journal: 'Science', year: '1994', doiOrUrl: '10.1126/science.8009224' }
    ],
    relatedTerms: ['中毒性休克综合征', '金黄色葡萄球菌', '卫生棉条', '8小时安全时限']
  },
  {
    id: 'vaginal-flora',
    title: '阴道菌群',
    aliases: ['阴道微生态', '阴道微生物群', 'Vaginal Microbiome'],
    enTitle: 'Vaginal Microbiota / Flora',
    category: 'medical',
    categoryLabel: '医学与病理',
    tags: ['乳杆菌', '弱酸自净', '微生态', '冲洗禁忌', '菌群失调'],
    summary: '阴道菌群（Vaginal Flora）是指定植于健康女性阴道黏膜表面的复杂共生微生物群落。在育龄期女性体内，正常菌群以乳酸杆菌（Lactobacillus spp.，如卷曲乳杆菌、詹氏乳杆菌、加氏乳杆菌等）占据绝对优势（通常>90%）。乳杆菌通过发酵上皮细胞脱落的糖原产生大量乳酸与过氧化氢（H2O2），维持阴道pH在3.8至4.5的酸性自净范围，构成抵抗致病菌入侵的第一道生理防御屏障。',
    infobox: [
      { label: '核心优势菌', value: '卷曲乳杆菌（L. crispatus）、詹氏乳杆菌' },
      { label: '生理酸碱度', value: 'pH 3.8 – 4.5（健康弱酸环境）' },
      { label: '保护性代谢物', value: '乳酸（L-乳酸/D-乳酸）、过氧化氢（H2O2）、细菌素' },
      { label: '健康禁忌', value: '禁止常规阴道冲洗、慎用广谱抗生素' }
    ],
    inArticleSectionId: 'vaginal-microecology',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Lactobacillus_acidophilus_%2801%29.jpg/640px-Lactobacillus_acidophilus_%2801%29.jpg',
    contentSections: [
      {
        title: '微生态屏障与糖原代谢',
        paragraphs: [
          '育龄期女性体内雌激素促进阴道鳞状上皮增生变厚并在胞浆内蓄积丰富糖原。脱落的上皮细胞在α-淀粉酶作用下分解为麦芽糖与葡萄糖，乳杆菌利用糖类进行厌氧酵解产生高浓度乳酸。酸性微环境能抑制假丝酵母菌过度繁殖及加德纳菌等厌氧菌异常增生。',
          '规范使用纯棉或医用粘胶纤维卫生棉条，在推荐时长内不干扰乳杆菌的主导地位；但若过度冲洗阴道或长时间不取出棉条，会因血液积聚与碱化破坏酸性自净屏障，诱发细菌性阴道病（BV）或菌群失衡。'
        ]
      }
    ],
    academicReferences: [
      { title: 'The vaginal microbiome: Rethinking health and disease', journal: 'Nature Reviews Microbiology', year: '2021', doiOrUrl: '10.1038/s41579-020-00501-0' }
    ],
    relatedTerms: ['中毒性休克综合征', '清洗 (医学)', '阴道穹', '卫生棉条']
  },
  {
    id: 'vaginal-fornix',
    title: '阴道穹',
    aliases: ['阴道穹窿', 'Vaginal Fornix'],
    enTitle: 'Vaginal Fornix',
    category: 'anatomy',
    categoryLabel: '解剖生理',
    tags: ['无感区', '无痛感', '放置深度', '人体解剖', '内生殖器'],
    summary: '阴道穹（Vaginal Fornix）是指阴道顶端环绕子宫颈阴道部所形成的环状盲端凹陷盲囊，解剖学上细分为前穹、后穹和两侧穹。其中后穹深度最大且位置最高，与腹膜腔的直肠子宫陷凹（道格拉斯窝）仅隔一层薄膜。阴道上2/3区域（包括后穹窿）缺乏由躯体神经支配的痛觉游离神经末梢，这正是卫生棉条正确推入到位后体验完全“无异物感”的解剖学基础。',
    infobox: [
      { label: '解剖位置', value: '阴道顶端环绕宫颈周围（前穹、后穹、侧穹）' },
      { label: '神经支配', value: '主要由自主神经系统（骨盆内脏神经）支配' },
      { label: '感觉特征', value: '缺乏体感痛觉神经，对轻微触碰与温度钝感' },
      { label: '棉条放置意义', value: '棉条推入至阴道后穹窿区域方可达到真正的“无感”状态' }
    ],
    inArticleSectionId: 'insertion-applicator',
    contentSections: [
      {
        title: '神经分布与棉条“无感”原理',
        paragraphs: [
          '人体对疼痛敏感的区域集中在阴道外口及阴道下1/3部位，该区域由阴部神经（躯体神经）支配，布满痛觉与压觉感受器。一旦棉条仅推入阴道口附近，便会因括约肌收缩和神经敏感引发显著的摩擦痛与异物感。',
          '相反，阴道中上部及后穹窿仅受内脏自主神经支配，缺乏敏锐的痛觉纤维，主要感知牵拉与膨胀。因此，使用导管或手指将棉条推过敏感区深入后穹窿盲端后，周围平滑肌壁自然将其固定，使用者便能体验到完全无感的经期活动自由。'
        ]
      }
    ],
    academicReferences: [
      { title: 'Innervation of the human vagina: Functional and anatomical insights', journal: 'Journal of Sexual Medicine', year: '2015', doiOrUrl: '10.1111/jsm.12877' }
    ],
    relatedTerms: ['卫生棉条', '导管型卫生棉条', '阴道冠', '女性生殖系统']
  },
  {
    id: 'vaginal-corona',
    title: '阴道冠',
    aliases: ['处女膜', 'Vaginal Corona', 'Hymen'],
    enTitle: 'Vaginal Corona / Hymen',
    category: 'anatomy',
    categoryLabel: '解剖生理',
    tags: ['弹性黏膜', '自然开孔', '破除羞辱', '人体解剖', '反羞辱'],
    summary: '阴道冠（旧称处女膜，拉丁语：Hymen，现代医学倡议称 Vaginal Corona 或阴道瓣）是位于女性阴道外口周围的一圈柔软、富含微血管与弹性纤维的黏膜皱襞组织。阴道冠并非一片全封闭实心的结缔组织薄膜，中心天然存在开孔（如环状、半月状、筛状或中隔状），经血与生理分泌物由此排出。在正确引导与放松下，卫生棉条或月经杯可利用黏膜开孔的天然弹性顺畅通过，破除传统文化中将其视作“完整性”判据的非科学羞辱观念。',
    infobox: [
      { label: '组织学构成', value: '富含弹力纤维与微血管的复层扁平上皮黏膜皱襞' },
      { label: '生理开孔特征', value: '天然存在微孔（环状、筛状、半月状，直径通常可容纳手指或棉条）' },
      { label: '棉条通过性', value: '经期充血变软，在充分湿润下可弹性延展顺畅通过' },
      { label: '现代医学命名', value: '倡议命名为“阴道冠”，破除实心密封膜的误解' }
    ],
    inArticleSectionId: 'myths-hymen',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Hymen_types.svg/640px-Hymen_types.svg.png',
    contentSections: [
      {
        title: '形态多样性与弹性机理',
        paragraphs: [
          '阴道冠在女性个体之间的厚度、弹性及孔径形态差异极大。绝大多数女性天然具有1.5至2.5公分左右的弹性开孔，足以允许正常月经血块排出。常规初次使用的卫生棉条（如轻量级或普通型，直径仅约1.0至1.3公分）涂抹经血润滑后，完全能够在不造成黏膜创伤的情况下从开孔穿过。',
          '现代性学与妇产医学强调，剧烈运动（骑自行车、体操、跳高）或日常活动均可使阴道冠边缘发生微小弹性延展，许多女性天生开孔较大或缺乏明显的冠缘组织，以有无出血判定初夜贞操是缺乏生理依据的伪命题。'
        ]
      }
    ],
    academicReferences: [
      { title: 'The Vaginal Corona: Myth and reality in medical practice', journal: 'Swedish Association for Sexuality Education (RFSU)', year: '2009' }
    ],
    relatedTerms: ['卫生棉条', '女性生殖系统', '月经禁忌', '月经']
  },
  {
    id: 'menstruation',
    title: '月经',
    aliases: ['月经周期', '大姨妈', '生理期', 'Menstruation', 'Menses'],
    enTitle: 'Menstruation',
    category: 'anatomy',
    categoryLabel: '解剖生理',
    tags: ['生理周期', '子宫内膜', '经血', '人体解剖', '内生殖器'],
    summary: '月经（英语：Menstruation，又称月事、经期），是指育龄女性因下丘脑-垂体-卵巢轴（HPO轴）周期性激素调节，未受精时黄体退化、孕酮与雌激素水平骤降，导致子宫内膜功能层周期性坏死、脱落并伴随出血由阴道排出的生理现象。正常月经周期平均为28天（21–35天波动），经期持续约3至7天，平均失血量为30至50毫升。',
    infobox: [
      { label: '周期长度', value: '21 至 35 天（平均约 28 天）' },
      { label: '行经持续时间', value: '通常为 3 至 7 天' },
      { label: '经血平均总量', value: '30 至 80 毫升（超过 80mL 为月经过多）' },
      { label: '经血成分', value: '动脉及静脉血液、脱落内膜组织碎片、宫颈黏液、阴道分泌物' },
      { label: '调控中枢', value: '下丘脑-垂体-卵巢轴（HPO 轴）' }
    ],
    inArticleSectionId: 'top',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/MenstrualCycle2_zh-hans.svg/640px-MenstrualCycle2_zh-hans.svg.png',
    contentSections: [
      {
        title: '内膜周期演变与出血机理',
        paragraphs: [
          '子宫内膜从结构上分为基底层和功能层。月经周期分为卵泡期（增生期）、排卵期与黄体期（分泌期）。若排卵后未受精着床，黄体迅速萎缩，孕激素骤然滑落，内膜螺旋小动脉发生强烈阵发性痉挛与缺血，导致功能层组织坏死撕裂，血液混合内膜碎片自创面流出。经血中因含有高活性纤溶酶，通常呈暗红色且处于纤溶不凝固状态。'
        ]
      }
    ],
    academicReferences: [
      { title: 'The normal menstrual cycle and the control of ovarian function', journal: 'Endotext', year: '2020' }
    ],
    relatedTerms: ['女性生殖系统', '卫生棉条', '卫生巾', '月经杯', '月经禁忌']
  },
  {
    id: 'earle-haas',
    title: '厄尔·哈斯',
    aliases: ['Earle Haas', '厄尔·克利夫兰·哈斯'],
    enTitle: 'Earle Haas (1888–1981)',
    category: 'history',
    categoryLabel: '历史与品牌',
    tags: ['发明家', '现代专利', '骨科医生', '导管商业化', '丹碧丝'],
    summary: '厄尔·克利夫兰·哈斯（Earle Cleveland Haas，1888年–1981年）是美国全科及骨科医生、现代导管型卫生棉条的发明人。1929年，哈斯受到一位使用天然海绵塞入阴道吸收经血的女性朋友的启发，利用压缩脱脂棉条与可滑动的硬纸板双套管结构，成功研制出世界上第一款带导管的一次性卫生棉条，并于1931年提交申请、1933年正式获得美国第1,926,900号专利。随后他将专利出售给格特鲁德·滕德里奇（Gertrude Tendrich），催生了享誉全球的棉条品牌丹碧丝（Tampax）。',
    infobox: [
      { label: '生卒年月', value: '1888年1月28日 – 1981年9月13日' },
      { label: '职业', value: '骨科医生、医学发明家' },
      { label: '核心专利', value: 'US Patent 1,926,900（双套管导管棉条）' },
      { label: '专利申请时间', value: '1931年11月19日（1933年获批）' },
      { label: '商业化公司', value: '丹碧丝销售公司（Tampax Sales Corp）' }
    ],
    inArticleSectionId: 'history-modern-invention',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/US_Patent_1926900_Earle_Haas_Tampon.png/640px-US_Patent_1926900_Earle_Haas_Tampon.png',
    contentSections: [
      {
        title: '双套管伸缩专利的发明突破',
        paragraphs: [
          '在哈斯之前，虽然古代埃及与希腊已有使用软化纸莎草或亚麻布制作简易内置栓剂的记录，但现代一次性无菌棉条的推入始终面临痛感与手部细菌污染难题。哈斯巧妙利用内外双层同心硬纸管作为推杆，外管前端微收便于无痛穿透阴道口，内管则像注射器活塞一样推进棉芯，棉芯尾部牢固缝合拉绳。这项优雅的机械发明彻底实现了使用者“双手无需直接触碰棉芯或生殖道”的卫生突破。'
        ]
      }
    ],
    academicReferences: [
      { title: 'Catamenial device: US Patent 1,926,900', journal: 'United States Patent Office', year: '1933' },
      { title: 'The history of feminine hygiene', journal: 'Journal of the American Medical Association', year: '1995' }
    ],
    relatedTerms: ['卫生棉条', '导管型卫生棉条', '丹碧丝', '高洁丝']
  },
  {
    id: 'tampax',
    title: '丹碧丝',
    aliases: ['Tampax', '丹碧丝卫生棉条'],
    enTitle: 'Tampax',
    category: 'history',
    categoryLabel: '历史与品牌',
    tags: ['导管商业化', '宝洁', '1936', '现代专利', '经期用品'],
    summary: '丹碧丝（Tampax）是全球规模最大的卫生棉条专业制造品牌，目前隶属于美国宝洁公司（Procter & Gamble）。该品牌由女企业家格特鲁德·滕德里奇于1936年创立，其技术直接源自厄尔·哈斯1931年的双套管棉条专利。滕德里奇最初在丹佛使用缝纫机手工组装棉条，经过数十年的科学改良与全球普及教育，丹碧丝成为了现代导管式卫生棉条的行业标准代名词。',
    infobox: [
      { label: '创立时间', value: '1936年' },
      { label: '创始人', value: '格特鲁德·滕德里奇（Gertrude Tendrich）' },
      { label: '母公司', value: '宝洁公司（P&G，1997年斥资20亿美元收购）' },
      { label: '主力产品系列', value: 'Tampax Pearl（珍珠塑料导管）、Compak（紧凑伸缩型）' },
      { label: '全球市场地位', value: '北美及全球多地导管棉条市场份额第一' }
    ],
    inArticleSectionId: 'history-modern-invention',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Tampax_Compak.jpg/640px-Tampax_Compak.jpg',
    contentSections: [
      {
        title: '商业化开拓与破除文化阻力',
        paragraphs: [
          '在20世纪30年代，公开讨论经期与在药店货架展示经期用品在欧美社会仍属于文化禁忌。滕德里奇与早期营销团队开创性地在《早安美国》杂志刊登科普广告，并雇佣由护士组成的专业教育团队前往大学与企业举办女性卫生健康讲座，推动了内置卫生棉条在年轻职业女性中的迅速普及。'
        ]
      }
    ],
    academicReferences: [
      { title: 'Selling the Tampon: Tampax advertising and the culture of menstruation', journal: 'American Quarterly', year: '2001' }
    ],
    relatedTerms: ['厄尔·哈斯', '卫生棉条', '导管型卫生棉条', '高洁丝']
  },
  {
    id: 'pink-tax',
    title: '粉红税',
    aliases: ['性别溢价', '经期税', 'Pink Tax', 'Tampon Tax'],
    enTitle: 'Pink Tax & Tampon Tax',
    category: 'society',
    categoryLabel: '社会与文化',
    tags: ['性别溢价', '经期税', '经济学', '反羞辱', '公共卫生'],
    summary: '粉红税（英语：Pink Tax）是指在功能、材质、生产成本与效用基本相同的前提下，针对女性消费者设计、包装或营销的商品与服务，价格明显高于对应男性同类产品的市场定价现象。在女性生理卫生领域，更具体的争议体现在“棉条税/经期税”（Tampon Tax）上——即政府将卫生棉条与卫生巾等女性不可避免的生理刚需品归类为“非生活必需品”或“奢侈品”，征收普通甚至更高的增值税（VAT），而男士剃须刀或药膏等反而享受必需品免税待遇，引发了全球范围内的性别平权与税收抗议。',
    infobox: [
      { label: '经济学概念', value: '基于性别的价格歧视（Gender-based price discrimination）' },
      { label: '经期用品争议', value: '对不可替代的月经生活必需品课征增值税（棉条税）' },
      { label: '首个免税国家', value: '肯尼亚（2004年废除卫生巾税）、英国（2021年废除棉条税）' },
      { label: '苏格兰开创性法案', value: '2020年全票通过《经期产品免费法案》（全球首创）' }
    ],
    inArticleSectionId: 'culture-and-society',
    contentSections: [
      {
        title: '全球免税改革与社会倡议',
        paragraphs: [
          '过去二十年中，全球女性权益组织与公共卫生学者发起了一系列针对经期税的立法诉讼。2004年肯尼亚成为全球首个免除经期用品增值税的国家；2018年印度废除高达12%的卫生巾税；2020年苏格兰议会全票通过法案，依法在全境学校与公共建筑免费提供经期卫生用品，成为经期正义（Period Equity）运动的里程碑。'
        ]
      }
    ],
    academicReferences: [
      { title: 'The price of gender: An empirical analysis of the pink tax', journal: 'Journal of Consumer Affairs', year: '2019', doiOrUrl: '10.1111/joca.12245' }
    ],
    relatedTerms: ['卫生棉条', '卫生巾', '中国大陆铁路卫生巾售卖争议', '月经禁忌']
  },
  {
    id: 'safety-limit',
    title: '8小时安全时限',
    aliases: ['8小时安全使用时限', '棉条更换时限', '8-Hour Safety Limit'],
    enTitle: '8-Hour Safe Wear Limit',
    category: 'medical',
    categoryLabel: '医学与病理',
    tags: ['8小时安全限', '急性重症', 'TSST-1', '卫生棉条', '金黄色葡萄球菌'],
    summary: '8小时安全使用时限，是美国食品药品监督管理局（FDA）、英国国家医疗服务体系（NHS）及全球权威妇产科医学会为体内置入型卫生棉条制定的最长连续滞留严格医学指导界限。临床研究表明，当棉条在阴道内滞留超过8小时后，吸收了血液的纤维体在37°C体温下成为金黄色葡萄球菌等细菌繁殖与TSST-1超抗原合成的高风险孵化器。严格遵守4–8小时更换规范，是杜绝中毒性休克综合征（TSS）最关键的防线。',
    infobox: [
      { label: '推荐常规更换频次', value: '每 4 至 6 小时更换一次' },
      { label: '绝对滞留上限', value: '单次不得超过 8 小时' },
      { label: '夜间睡眠建议', value: '若睡眠时间超过 8 小时，应使用夜用卫生巾' },
      { label: '制定机构', value: '美国 FDA、英国 MHRA、中华医学会妇产科学分会' }
    ],
    inArticleSectionId: 'safety-and-tss',
    contentSections: [
      {
        title: '生化与微生物学依据',
        paragraphs: [
          '刚置入阴道时，棉条纤维内部含有微量空气氧气，随时间推移，经血浸润棉芯并将周围环境封闭。在滞留的前4至6小时内，正常微生态与机体黏膜屏障能有效抵御微量细菌代谢物；但若超过8小时，饱和经血中的蛋白质与铁离子在无氧/微氧梯度交替下，可使产毒金葡菌的生物膜迅速形成并暴发性释放超抗原。因此，夜间长时间睡眠（超过8小时）时，医师普遍建议首选外置夜用卫生巾或经期安全裤。'
        ]
      }
    ],
    academicReferences: [
      { title: 'Guidance for Industry and FDA Staff: Menstrual Tampons and Toxic Shock Syndrome', journal: 'U.S. Food and Drug Administration', year: '2020' }
    ],
    relatedTerms: ['中毒性休克综合征', '卫生棉条', '金黄色葡萄球菌', 'TSST-1']
  }
];

export function getWikiEntryById(id: string): WikiEntry | undefined {
  return WIKI_ENTRIES.find(e => e.id === id);
}

export function getWikiEntryByTitle(term: string): WikiEntry | undefined {
  const clean = term.replace(/[（(].*?[）)]/g, '').trim().toLowerCase();
  return WIKI_ENTRIES.find(e =>
    e.title.toLowerCase() === clean ||
    e.id.toLowerCase() === clean ||
    e.enTitle.toLowerCase() === clean ||
    e.aliases.some(a => a.toLowerCase() === clean)
  );
}
