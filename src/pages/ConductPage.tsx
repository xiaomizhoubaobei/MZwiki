import React from 'react';
import { 
  HeartHandshake, 
  Scale, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Award, 
  AlertCircle
} from 'lucide-react';

interface PolicyPageProps {
  isDarkMode: boolean;
  contentWidth: 'standard' | 'wide';
  onNavigateHome?: () => void;
}

export const ConductPage: React.FC<PolicyPageProps> = ({
  isDarkMode,
  contentWidth,
}) => {
  return (
    <article className={`space-y-8 font-sans ${contentWidth === 'standard' ? 'max-w-4xl' : 'max-w-full'}`}>
      
      {/* Namespace Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs pb-3 border-b border-black/10 dark:border-white/10 text-[#54595d] dark:text-[#a2a9b1] flex-wrap">
        <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[11px] font-mono text-[#72777d]">
          全域命名空间: MZ维基
        </span>
        <span>/</span>
        <span className="text-[#54595d] dark:text-[#a2a9b1]">社群指引与公约</span>
        <span>/</span>
        <span className="text-emerald-700 dark:text-emerald-400 font-bold">全域行为准则</span>
      </div>

      {/* Official Wikipedia Policy Box (Green Emerald Policy Banner) */}
      <div className={`p-4 rounded border-l-4 border-l-emerald-600 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${
        isDarkMode ? 'bg-[#1b2b23] border-[#294c3b]' : 'bg-[#f0fdf4] border-[#bbf7d0]'
      }`}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded bg-emerald-600/20 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <span>MZ维基全域普遍行为准则（Universal Code of Conduct, UCOC）</span>
            </div>
            <p className="text-[#166534] dark:text-[#86efac] leading-relaxed">
              本准则确立了所有读者、志愿者与知识创作者的基本行为底线。在涉及人类身体生理与女性经期健康的讨论中，我们致力于消除恐惧、偏见与歧视，构筑文明、科学的数字化共同体。
            </p>
          </div>
        </div>
        <div className="shrink-0 px-3 py-1.5 rounded border border-emerald-500/30 bg-white/60 dark:bg-black/30 font-mono text-[11px] text-emerald-700 dark:text-emerald-400 text-center">
          <div className="text-[10px] text-[#72777d]">快捷方式</div>
          <strong>WP:UCOC</strong>
        </div>
      </div>

      {/* LEAD SECTION */}
      <div id="top" className="text-[15px] space-y-3.5 leading-relaxed text-justify">
        <p>
          <strong>全域普遍行为准则</strong>（以下简称“准则”）是 MZ维基数字化知识共享生态的基石。科学的真谛在于包容与理性求真。作为一部不断扩充人类各项知识的开放自由百科全书，每一位进入本社区查阅或参与编辑的成员均有责任维护一个安全、受尊重、中立客观且免受骚扰的学术与交流环境。
        </p>
      </div>

      {/* SECTION 1 */}
      <section id="conduct-foundations" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          1 全域普遍行为准则基石
        </h2>
        <div className="space-y-3.5 text-[15px] leading-relaxed text-justify">
          <p>
            MZ维基秉持三大基石原则：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className={`p-3.5 rounded border ${isDarkMode ? 'bg-[#27292d] border-[#3a3d42]' : 'bg-[#f8f9fa] border-[#eaecf0]'}`}>
              <div className="font-bold text-emerald-600 mb-1 flex items-center gap-1.5 text-sm">
                <Users className="w-4 h-4" />
                <span>善意推定（Assume Good Faith）</span>
              </div>
              <p className="text-[#54595d] dark:text-[#bdc1c6] leading-relaxed">
                在无确凿证据前，推定其他参与者的提问、编辑与讨论均出于完善知识的善意愿景，包容初学者对人体解剖知识的探索。
              </p>
            </div>
            <div className={`p-3.5 rounded border ${isDarkMode ? 'bg-[#27292d] border-[#3a3d42]' : 'bg-[#f8f9fa] border-[#eaecf0]'}`}>
              <div className="font-bold text-emerald-600 mb-1 flex items-center gap-1.5 text-sm">
                <Scale className="w-4 h-4" />
                <span>理性中立（Neutral Point of View）</span>
              </div>
              <p className="text-[#54595d] dark:text-[#bdc1c6] leading-relaxed">
                严格遵循现代循证医学结论，客观阐述不同经期用品（棉条、卫生巾、月经杯）的各自优缺点，不拉踩、不吹捧。
              </p>
            </div>
            <div className={`p-3.5 rounded border ${isDarkMode ? 'bg-[#27292d] border-[#3a3d42]' : 'bg-[#f8f9fa] border-[#eaecf0]'}`}>
              <div className="font-bold text-emerald-600 mb-1 flex items-center gap-1.5 text-sm">
                <Award className="w-4 h-4" />
                <span>文明互尊（Civil Interactivity）</span>
              </div>
              <p className="text-[#54595d] dark:text-[#bdc1c6] leading-relaxed">
                杜绝一切辱骂、讥讽、人身攻击以及基于性别、年龄、地域、文化习惯或性认同的任何贬低性言论。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 */}
      <section id="anti-stigmatization" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          2 坚决反对生理健康污名化
        </h2>
        <div className="space-y-3.5 text-[15px] leading-relaxed text-justify">
          <p>
            月经是人类繁衍繁衍与女性正常生理周期代谢的自然表征。长久以来，许多社会传统中残留着将月经视为“污秽不洁”、“羞于启齿”的陈腐观念。MZ维基对此秉持毫不妥协的立场：
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-[#54595d] dark:text-[#bdc1c6]">
            <li><strong>消除经期羞耻（Period Shame）：</strong>倡导使用规范、严谨的医学解剖学词汇（如经血、子宫内膜剥脱、阴道冠、宫颈穹窿），严禁在交流中以低俗化、猎奇化心态评判生理现象。</li>
            <li><strong>捍卫身体自主权：</strong>女性自主选择适合自身生活方式的经期护理用品（无论是外部护垫、导管棉条还是指入式棉条）属于个人健康主权，任何将使用置入用品与个人道德品质强行挂钩的言论均视为严重违规。</li>
          </ul>
        </div>
      </section>

      {/* SECTION 3 */}
      <section id="scientific-evidence" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          3 恪守同行评议科学证据
        </h2>
        <div className="space-y-3.5 text-[15px] leading-relaxed text-justify">
          <p>
            生理医学知识直接关乎身体健康安全，严禁在条目中植入未经同行评议检验的个人主观臆断：
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-[#54595d] dark:text-[#bdc1c6]">
            <li><strong>权威来源为唯一基准：</strong>条目数据必须可追溯至美国 FDA、世界卫生组织（WHO）、国际标准化组织（ISO 23418）或 PubMed 索引的高水平医学文献。</li>
            <li><strong>坚决打击伪科学与谣言：</strong>严禁编造“棉条会导致不孕不育”、“棉条会游走到胃部”等反常识谣言，一经发现将直接清理并对散布者施行全域封禁。</li>
          </ul>
        </div>
      </section>

      {/* SECTION 4 */}
      <section id="neutrality-and-commercial" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          4 零商业软文与利益冲突规范
        </h2>
        <div className="space-y-3.5 text-[15px] leading-relaxed text-justify">
          <p>
            MZ维基为非商业性自由工程。严厉禁止以下行为：
          </p>
          <div className={`p-4 rounded border text-xs space-y-2 ${
            isDarkMode ? 'bg-[#27292d] border-[#3a3d42]' : 'bg-[#fffbeb] border-[#fde68a]'
          }`}>
            <div className="font-bold text-[#b45309] dark:text-[#fbbf24] flex items-center gap-1.5 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>商业利益冲突（Conflict of Interest, COI）红线：</span>
            </div>
            <p className="text-[#92400e] dark:text-[#fde68a] leading-relaxed">
              任何卫生巾/棉条生产厂商、公关代理人、电商分销者或带货博主，均不得隐匿身份参与词条编写，严禁在条目中植入含有促销性质的商业链接、专属优惠代码、贬损竞争品牌言论或刻意夸大本品牌材料安全性。
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5 */}
      <section id="dispute-resolution" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          5 理性协作与争议解决机制
        </h2>
        <div className="space-y-3.5 text-[15px] leading-relaxed text-justify">
          <p>
            当编审志愿者对某一医学研究结论存在不同理解时，应遵循以下梯次进行文明协商：
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-sm text-[#54595d] dark:text-[#bdc1c6]">
            <li>在讨论页提出可靠文献出处（优先考虑系统评价与 Meta 分析）；</li>
            <li>若学界存在不同主流学术观点，应并列客观记录各方证据及发表年份；</li>
            <li>严禁发起反复撤销与无休止的“编辑战”；</li>
            <li>违规行为将由社群仲裁委员会依章程施以警告直至永久封禁。</li>
          </ol>
        </div>
      </section>

      {/* Page Category Box */}
      <div className={`p-3 rounded border text-xs text-[#54595d] dark:text-[#a2a9b1] ${
        isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-[#f8f9fa] border-[#c8ccd1]'
      }`}>
        <span className="font-semibold text-[#202122] dark:text-white">分类：</span>
        <span className="text-[#3366cc] hover:underline cursor-pointer ml-1">MZ维基社群规范</span>
        <span className="mx-1">|</span>
        <span className="text-[#3366cc] hover:underline cursor-pointer">全域普遍行为准则</span>
        <span className="mx-1">|</span>
        <span className="text-[#3366cc] hover:underline cursor-pointer">反歧视与文明公约</span>
      </div>

    </article>
  );
};
