import React from 'react';
import {
  ShieldCheck,
  Lock,
  Database,
  Server,
  ExternalLink,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface PolicyPageProps {
  isDarkMode: boolean;
  contentWidth: 'standard' | 'wide';
  onNavigateHome?: () => void;
}

export const PrivacyPage: React.FC<PolicyPageProps> = ({
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
        <span className="text-[#54595d] dark:text-[#a2a9b1]">隐私权与数据方针</span>
        <span>/</span>
        <span className="text-[#3366cc] font-bold">隐私政策</span>
      </div>

      {/* Official Wikipedia Policy Header Box (ombox / ambox standard) */}
      <div className={`p-4 rounded border-l-4 border-l-[#3366cc] border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${
        isDarkMode ? 'bg-[#1b2430] border-[#334b6b]' : 'bg-[#f0f6ff] border-[#c2dbff]'
      }`}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded bg-[#3366cc]/20 flex items-center justify-center text-[#3366cc] shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-sm text-[#202122] dark:text-white flex items-center gap-2">
              <span>本页面记载的是 MZ维基的官方核心隐私保护方针</span>
            </div>
            <p className="text-[#54595d] dark:text-[#bdc1c6] leading-relaxed">
              本方针具有全域制度权威，受到基金会与社群共识的共同支持。除技术必需之最小化瞬时日志外，MZ维基严格恪守零商业广告、零跨站画像追踪与数据自主可控原则。
            </p>
          </div>
        </div>
        <div className="shrink-0 px-3 py-1.5 rounded border border-[#3366cc]/30 bg-white/60 dark:bg-black/30 font-mono text-[11px] text-[#3366cc] dark:text-[#6699ff] text-center">
          <div className="text-[10px] text-[#72777d]">快捷方式</div>
          <strong>WP:PRIVACY</strong>
        </div>
      </div>

      {/* LEAD SECTION */}
      <div id="top" className="text-[15px] space-y-3.5 leading-relaxed text-justify">
        <p>
          <strong>MZ维基</strong>（以下简称“本平台”或“我们”）是一个秉承开放、非营利性及知识公有理念的数字化百科全书工程。我们坚信，自由获取人类经过同行评议验证的生理卫生与医学科学常识，是全球每一位个体的基本知识权利。与常规商业化互联网门户或社交媒体平台根本不同，MZ维基的运营理念建立在<strong>数据极简主义</strong>（Data Minimalism）与<strong>彻底的用户隐私自主</strong>之上。
        </p>
        <p>
          本隐私政策详细阐明了当您访问、检索及阅读本站词条（包括《卫生棉条》等生理健康医学条目）时，系统对数据的处理方式及您的法定数据知情权利。
        </p>
      </div>

      {/* SECTION 1 */}
      <section id="core-principles" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          1 核心原则与数据极简主义
        </h2>
        <div className="space-y-3.5 text-[15px] leading-relaxed text-justify">
          <p>
            在数字化时代，许多健康垂直类网站通过对用户的搜索关键词、病症浏览记录进行隐蔽画像，并将其转售给医药广告主或保险评估机构。MZ维基在此郑重宣告：
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-[#54595d] dark:text-[#bdc1c6]">
            <li><strong>不以个人隐私变现：</strong>我们绝不向任何第三方数据经纪商、公关公司、数字广告联盟或商业赞助商出售、出租或共享任何访问者的阅读行为数据。</li>
            <li><strong>无需实名注册：</strong>读者无需登记真实姓名、手机号、电子邮箱地址、社交平台账号或身份证明文件，即可享有查阅全站所有科学条目的完整权限。</li>
            <li><strong>零行为追踪脚本：</strong>本站页面内不引入任何跨站指纹采集脚本（Canvas/WebGL Fingerprinting）、第三方重定向追踪像素（Tracking Pixels）或行为热力图监控工具。</li>
          </ul>
        </div>
      </section>

      {/* SECTION 2 */}
      <section id="no-collection" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          2 我们明确不收集的信息
        </h2>
        <div className="space-y-3.5 text-[15px] leading-relaxed text-justify">
          <p>
            由于生理健康与女性经期卫生条目具有极高的私密性，为免除读者的后顾之忧，系统在架构设计上即杜绝了收集以下敏感数据的可能：
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className={`p-3.5 rounded border ${isDarkMode ? 'bg-[#27292d] border-[#3a3d42]' : 'bg-[#f8f9fa] border-[#eaecf0]'}`}>
              <div className="font-bold text-[#202122] dark:text-white flex items-center gap-1.5 mb-1.5 text-sm">
                <Lock className="w-4 h-4 text-emerald-500" />
                <span>生理与健康隐私</span>
              </div>
              <p className="text-[#54595d] dark:text-[#bdc1c6] leading-relaxed">
                绝不收集读者的月经初潮年龄、生理周期节律、过往病史、妇科诊疗诉求或使用经期卫生用品的个人频次记录。
              </p>
            </div>
            <div className={`p-3.5 rounded border ${isDarkMode ? 'bg-[#27292d] border-[#3a3d42]' : 'bg-[#f8f9fa] border-[#eaecf0]'}`}>
              <div className="font-bold text-[#202122] dark:text-white flex items-center gap-1.5 mb-1.5 text-sm">
                <Database className="w-4 h-4 text-emerald-500" />
                <span>精确定位与设备指纹</span>
              </div>
              <p className="text-[#54595d] dark:text-[#bdc1c6] leading-relaxed">
                绝不调用浏览器的 GPS 经纬度 API，亦不利用电池状态 API 或底层音频硬件参数合成设备的持久性唯一身份指纹。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section id="local-storage" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          3 客户端本地偏好存储（LocalStorage）
        </h2>
        <div className="space-y-3.5 text-[15px] leading-relaxed text-justify">
          <p>
            为实现无障碍阅读标准并满足不同读者对视觉光线的舒适度需求，本平台仅使用现代 Web 标准的客户端本地存储（Browser LocalStorage）记录以下3项排版偏好：
          </p>

          <div className="border rounded overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className={`border-b ${isDarkMode ? 'bg-[#27292d] border-[#3a3d42]' : 'bg-[#f8f9fa] border-[#c8ccd1]'}`}>
                <tr>
                  <th className="p-3 font-semibold">存储键名（Key）</th>
                  <th className="p-3 font-semibold">存储介质</th>
                  <th className="p-3 font-semibold">存续期限</th>
                  <th className="p-3 font-semibold">存储目的与技术作用</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                <tr>
                  <td className="p-3 font-mono font-bold text-[#3366cc]">mzwiki_darkmode</td>
                  <td className="p-3">LocalStorage</td>
                  <td className="p-3">持久（用户清除前）</td>
                  <td className="p-3">记录夜间深色高对比度主题开关状态，保护读者暗光阅读视力。</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-[#3366cc]">mzwiki_fontsize</td>
                  <td className="p-3">LocalStorage</td>
                  <td className="p-3">持久</td>
                  <td className="p-3">记忆读者定制的正文排版字号（小 / 标准 / 大号字）。</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-[#3366cc]">mzwiki_contentwidth</td>
                  <td className="p-3">LocalStorage</td>
                  <td className="p-3">持久</td>
                  <td className="p-3">记忆读者的屏幕排版偏好（800px 集中版心或宽屏自适应）。</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#72777d] dark:text-[#a2a9b1]">
            * 该数据全流程仅存在于您的本地终端计算机或移动设备中，不经过网络向服务器上传，读者可在任意时刻在浏览器设置中清除本地存储。
          </p>
        </div>
      </section>

      {/* SECTION 4 */}
      <section id="server-logs" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          4 网络防御日志与安全轮替
        </h2>
        <div className="space-y-3.5 text-[15px] leading-relaxed text-justify">
          <p>
            为防范分布式拒绝服务攻击（DDoS）、恶意爬虫洪泛抓取并保障全球 CDN 节点的基础健康度，底层服务器集群会在短期内暂存最基础的网络协议日志。包含：请求时间戳、HTTP 状态码、请求的静态资源路径及泛化的网络运营商网段（自治系统号 ASN）。
          </p>
          <p>
            此类协议日志绝不与任何现实个人身份相匹配，并在轮替保存不超过 <strong>7个自然日</strong> 后被自动覆写销毁。
          </p>
        </div>
      </section>

      {/* SECTION 5 */}
      <section id="external-links" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          5 同行评议外部资源管辖
        </h2>
        <div className="space-y-3.5 text-[15px] leading-relaxed text-justify">
          <p>
            为确保百科词条的学术严谨度，正文中大量提供了指向权威学术数据库与国家监管机构的公开文献档案（如美国国立医学图书馆 PubMed、数字对象唯一标识符 DOI 解析体系、FDA 官方通报等）。
          </p>
          <p>
            当您点击带有跳出图标（<ExternalLink className="w-3 h-3 inline-block" />）的外部链接时，您将离开 MZ维基的网络域。目标第三方网站具有其独立的隐私条款与数据治理准则，建议读者在查阅时参阅该站点的具体政策。
          </p>
        </div>
      </section>

      {/* SECTION 6 */}
      <section id="user-rights" className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-[#202122] dark:text-[#eaecf0] border-b border-[#a2a9b1] dark:border-[#54595d] pb-1 mb-4">
          6 读者知情权与数据自决
        </h2>
        <div className="space-y-3.5 text-[15px] leading-relaxed text-justify">
          <p>
            依据欧盟《通用数据保护条例》（GDPR）、中国《个人信息保护法》（PIPL）及加州消费者隐私法（CCPA），您享有对自己数据的知情、拒绝追踪与自决删除权。鉴于本站并未收集您的任何可识别个人身份信息（PII），您始终处于完全匿名的无感保护状态。
          </p>
          <div className={`p-4 rounded border text-xs space-y-1.5 ${
            isDarkMode ? 'bg-[#27292d] border-[#3a3d42]' : 'bg-[#f8f9fa] border-[#eaecf0]'
          }`}>
            <div className="font-bold text-[#202122] dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#3366cc]" />
              <span>方针版本生效与修订说明</span>
            </div>
            <p className="text-[#54595d] dark:text-[#bdc1c6] leading-relaxed">
              本政策由 MZ维基制度法务委员会共同审核发布，最新生效日期为 <strong>2026年3月18日</strong>。若未来技术迭代引起任何实质性策略变更，我们将至少提前30日在首页置顶醒目通告。
            </p>
          </div>
        </div>
      </section>

      {/* Page Category Box */}
      <div className={`p-3 rounded border text-xs text-[#54595d] dark:text-[#a2a9b1] ${
        isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-[#f8f9fa] border-[#c8ccd1]'
      }`}>
        <span className="font-semibold text-[#202122] dark:text-white">分类：</span>
        <span className="text-[#3366cc] hover:underline cursor-pointer ml-1">MZ维基官方核心方针</span>
        <span className="mx-1">|</span>
        <span className="text-[#3366cc] hover:underline cursor-pointer">法律与数据隐私保护</span>
        <span className="mx-1">|</span>
        <span className="text-[#3366cc] hover:underline cursor-pointer">自由数字人权规范</span>
      </div>

    </article>
  );
};
