import React from 'react';
import {
  AlertTriangle,
  Stethoscope,
  PhoneCall,
  Scale,
  HeartPulse,
  Clock,
  ShieldAlert
} from 'lucide-react';

interface PolicyPageProps {
  isDarkMode: boolean;
  contentWidth: 'standard' | 'wide';
  onNavigateHome?: () => void;
}

export const DisclaimerPage: React.FC<PolicyPageProps> = ({
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
        <span className="text-[#54595d] dark:text-[#a2a9b1]">制度与法律方针</span>
        <span>/</span>
        <span className="text-[#ba0000] font-bold">免责声明（医学与法律）</span>
      </div>

      {/* Official Wikipedia Red Warning Box (Critical Medical Policy) */}
      <div className={`p-4 rounded border-l-4 border-l-[#ba0000] border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${
        isDarkMode ? 'bg-[#2b1d1d] border-[#5a2a2a]' : 'bg-[#fff5f5] border-[#fed7d7]'
      }`}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded bg-red-600/20 flex items-center justify-center text-red-600 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-sm text-[#ba0000] flex items-center gap-2">
              <span>重要法律通告：MZ维基词条不构成临床医疗诊断与治疗处方</span>
            </div>
            <p className="text-[#742a2a] dark:text-[#feb2b2] leading-relaxed">
              维基百科的医学内容不能替代专业医师、注册护士或药剂师的面对面诊断。如果您处于紧急医疗危险或身体突发异常，请立刻就医。
            </p>
          </div>
        </div>
        <div className="shrink-0 px-3 py-1.5 rounded border border-red-500/30 bg-white/60 dark:bg-black/30 font-mono text-[11px] text-red-600 dark:text-red-400 text-center">
          <div className="text-[10px] text-[#72777d]">快捷方式</div>
          <strong>WP:MEDIC</strong>
        </div>
      </div>

      {/* LEAD SECTION */}
      <div id="top" className="text-[15px] space-y-3.5 leading-relaxed text-justify">
        <p>
          本页面为<strong>MZ维基</strong>全域适用的核心法律声明与医学健康免责规范。由于本百科全书中包含大量关于女性生殖解剖、经期卫生护理、置入式卫生用品（如卫生棉条、月经杯、经期碟片）、材料生物相容性及妇科感染性急症（如中毒性休克综合征 TSS）的内容，所有读者在阅读、采纳或参照执行相关信息时，均视为已无条件阅读、理解并同意本声明之全部条款。
        </p>
      </div>

      {/* SECTION 1 */}
      <section id="medical-disclaimer" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#ba0000] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          1 医学健康核心免责声明
        </h2>
        <div className="space-y-3.5 text-[15px] leading-relaxed text-justify">
          <p>
            MZ维基是一个面向公众的非营利性自由知识百科工程，其所有收录条目与卫教资料的编纂初衷<strong>仅限于公共科学传播、历史演进梳理与解剖常识普及</strong>：
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-[#54595d] dark:text-[#bdc1c6]">
            <li><strong>非医疗机构资质：</strong>MZ维基及其编审志愿者团队绝非医疗执业机构，亦不具备出具处方、开立临床诊断证明或指导个体用药治疗的法定职能。</li>
            <li><strong>不可替代专业医嘱：</strong>无论条目引用的学术期刊影响因子有多高（如《柳叶刀》、《新英格兰医学杂志》或美国 CDC 周报），页面中的文字说明均无法取代妇产科主治医师、全科医生或妇幼保健专家的面对面触诊、化验检查与个体化医疗干预方案。</li>
            <li><strong>禁止依据条目自我治疗：</strong>任何读者不得单纯依据本站关于病理症状、细菌毒素机制或更换时限的文字描述，擅自推迟、中止正在进行的临床治疗，或作为否定执业医师临床诊断的依据。</li>
          </ul>
        </div>
      </section>

      {/* SECTION 2 */}
      <section id="emergency-symptoms" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          2 急性中毒性休克（TSS）急救体征
        </h2>
        <div className="space-y-3.5 text-[15px] leading-relaxed text-justify">
          <p>
            {/* Red Alert Callout */}
            中毒性休克综合征（Toxic Shock Syndrome, TSS）是由金黄色葡萄球菌或链球菌外毒素引起的极急性全身毒血反应，病情进展极为迅猛。若您或您身边的人在经期使用卫生棉条期间（或取出后24-48小时内）出现以下任何一组复合临床体征，必须将其视为<strong>危及生命的医学紧急状态</strong>：
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className={`p-3.5 rounded border border-l-4 border-l-red-600 ${isDarkMode ? 'bg-[#27292d] border-[#3a3d42]' : 'bg-[#fff5f5] border-[#fed7d7]'}`}>
              <div className="font-bold text-red-600 mb-1 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4" />
                <span>1. 突发急性高热与畏寒</span>
              </div>
              <p className="text-[#54595d] dark:text-[#bdc1c6] leading-relaxed">
                体温在短时间内急剧升高至 38.9°C（102°F）以上，伴随剧烈寒战、肌肉极度酸痛及全身乏力。
              </p>
            </div>

            <div className={`p-3.5 rounded border border-l-4 border-l-red-600 ${isDarkMode ? 'bg-[#27292d] border-[#3a3d42]' : 'bg-[#fff5f5] border-[#fed7d7]'}`}>
              <div className="font-bold text-red-600 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>2. 严重消化道排空反应</span>
              </div>
              <p className="text-[#54595d] dark:text-[#bdc1c6] leading-relaxed">
                无前驱诱因的突发剧烈恶心、喷射状反复呕吐，或频繁发生的大量水样腹泻。
              </p>
            </div>

            <div className={`p-3.5 rounded border border-l-4 border-l-red-600 ${isDarkMode ? 'bg-[#27292d] border-[#3a3d42]' : 'bg-[#fff5f5] border-[#fed7d7]'}`}>
              <div className="font-bold text-red-600 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>3. 弥漫性猩红热样皮疹</span>
              </div>
              <p className="text-[#54595d] dark:text-[#bdc1c6] leading-relaxed">
                类似严重晒伤样式的弥漫性红斑，特别好发于手掌心、脚掌底或面部，数日后可能出现脱屑。
              </p>
            </div>

            <div className={`p-3.5 rounded border border-l-4 border-l-red-600 ${isDarkMode ? 'bg-[#27292d] border-[#3a3d42]' : 'bg-[#fff5f5] border-[#fed7d7]'}`}>
              <div className="font-bold text-red-600 mb-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>4. 顽固性低血压与晕厥</span>
              </div>
              <p className="text-[#54595d] dark:text-[#bdc1c6] leading-relaxed">
                收缩压急剧下降（低于90mmHg），站立时眼前发黑、神志嗜睡、定向障碍乃至突发昏迷。
              </p>
            </div>
          </div>

          <div className="p-4 rounded border border-red-600 bg-red-600/10 text-red-700 dark:text-red-300 text-xs font-semibold space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold">
              <PhoneCall className="w-4 h-4" />
              <span>现场急救处置黄金准则：</span>
            </div>
            <p className="leading-relaxed">
              第一步：立即将体内置入的卫生棉条取出丢弃；<br />
              第二步：片刻不要耽搁，立刻由家人陪同或拨打急救中心电话（120 / 911 / 999）直奔就近三甲综合医院急诊科；<br />
              第三步：挂号与接诊时向分诊护士及急诊医师清晰声明：“我正在来月经，且最近数小时内使用了卫生棉条，请求排查中毒性休克综合征”。
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section id="individual-variation" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          3 个体生理多样性与主治医嘱
        </h2>
        <div className="space-y-3.5 text-[15px] leading-relaxed text-justify">
          <p>
            女性生殖系统的解剖形态（包括阴道管腔长度、后穹窿深度、阴道冠黏膜褶皱弹力与孔径、盆底肌神经敏感度）具有显著的个体先天差异性。
          </p>
          <p>
            若读者存在以下临床指征，使用任何置入型用品前<strong>必须首先获得主治妇产科医师的明确评估与授权</strong>：
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm text-[#54595d] dark:text-[#bdc1c6]">
            <li>确诊患有阴道痉挛症（Vaginismus）或前庭大腺炎；</li>
            <li>正处于急性阴道炎（如念珠菌性阴道炎、滴虫性阴道炎或细菌性阴道病）发作期；</li>
            <li>近期接受过宫颈活检、宫腔镜检查、LEEP刀手术或人工流产术不足6周；</li>
            <li>经阴道顺产分娩后处于产褥期恶露阶段（产后6周内禁止使用体内棉条）；</li>
            <li>曾有明确的金黄色葡萄球菌感染或中毒性休克综合征既往病史。</li>
          </ul>
        </div>
      </section>

      {/* SECTION 4 */}
      <section id="legal-limitations" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          4 法律责任限制与现状原则（As-Is）
        </h2>
        <div className="space-y-3.5 text-[15px] leading-relaxed text-justify">
          <p>
            在法律允许的最大范围内，MZ维基所包含的全部内容均按<strong>“现状”（As-Is）</strong>和<strong>“现有”（As-Available）</strong>的基础提供。
          </p>
          <p>
            本平台不就条目内容的准确性、完整性、最新性、适销性或针对某一特定健康意图的适用性提供任何明示或暗示的担保。对于因阅读、信赖或依据本站资料自行操作、购买使用任何品牌卫生用品所直接或间接引起的任何身体损伤、过敏反应、医疗支出、精神损害或衍生法律纠纷，MZ维基及其志愿者团队、服务器托管方概不承担连带民事赔偿责任。
          </p>
        </div>
      </section>

      {/* Page Category Box */}
      <div className={`p-3 rounded border text-xs text-[#54595d] dark:text-[#a2a9b1] ${
        isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-[#f8f9fa] border-[#c8ccd1]'
      }`}>
        <span className="font-semibold text-[#202122] dark:text-white">分类：</span>
        <span className="text-[#3366cc] hover:underline cursor-pointer ml-1">MZ维基法律声明</span>
        <span className="mx-1">|</span>
        <span className="text-[#3366cc] hover:underline cursor-pointer">医学健康免责方针</span>
        <span className="mx-1">|</span>
        <span className="text-[#3366cc] hover:underline cursor-pointer">急救医学通告</span>
      </div>

    </article>
  );
};
