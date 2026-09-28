import React, { useState } from 'react';
import { Info, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

interface InfoboxProps {
  onOpenWikiLink: (term: string) => void;
  isDarkMode: boolean;
}

export const Infobox: React.FC<InfoboxProps> = ({
  onOpenWikiLink,
  isDarkMode
}) => {
  const [activeDiagram, setActiveDiagram] = useState<'applicator' | 'digital'>('applicator');
  const [highlightPart, setHighlightPart] = useState<number | null>(null);

  return (
    <aside
      className={`float-none lg:float-right w-full lg:w-76 mb-6 lg:ml-6 rounded border text-xs overflow-hidden transition-colors ${
        isDarkMode
          ? 'bg-[#27292d] border-[#54595d] text-[#eaecf0]'
          : 'bg-[#f8f9fa] border-[#c8ccd1] text-[#202122]'
      }`}
      aria-label="条目基本信息框"
    >
      {/* Title Header */}
      <div className={`p-2.5 text-center border-b font-serif font-bold text-sm tracking-wide ${
        isDarkMode ? 'bg-[#1f2124] border-[#3a3d42]' : 'bg-[#eaf3ff] border-[#c8ccd1] text-[#0b0080]'
      }`}>
        <div className="text-base font-bold text-[#202122] dark:text-white">
          卫生棉条
        </div>
        <div className="text-xs font-sans font-normal text-[#54595d] dark:text-[#a2a9b1] italic">
          Tampon
        </div>
      </div>

      {/* Interactive Switcher for Vector Diagrams */}
      <div className="p-2 border-b border-black/5 dark:border-white/5 flex gap-1 bg-black/5 dark:bg-white/5">
        <button
          onClick={() => { setActiveDiagram('applicator'); setHighlightPart(null); }}
          className={`flex-1 py-1 px-2 rounded text-center font-medium transition-colors ${
            activeDiagram === 'applicator'
              ? 'bg-white dark:bg-[#34373c] text-[#3366cc] shadow-xs font-bold'
              : 'hover:bg-white/50 text-[#72777d]'
          }`}
        >
          导管型结构
        </button>
        <button
          onClick={() => { setActiveDiagram('digital'); setHighlightPart(null); }}
          className={`flex-1 py-1 px-2 rounded text-center font-medium transition-colors ${
            activeDiagram === 'digital'
              ? 'bg-white dark:bg-[#34373c] text-[#3366cc] shadow-xs font-bold'
              : 'hover:bg-white/50 text-[#72777d]'
          }`}
        >
          指入式结构
        </button>
      </div>

      {/* SVG Technical Diagram Canvas */}
      <div className="p-3 bg-white dark:bg-[#1a1b1c] border-b border-black/5 dark:border-white/5">
        {activeDiagram === 'applicator' ? (
          <div className="space-y-2">
            <svg
              viewBox="0 0 400 180"
              className="w-full h-auto drop-shadow-xs"
              style={{ maxHeight: '170px' }}
            >
              {/* Petal Tip */}
              <path
                d="M 60,75 C 45,75 35,85 35,90 C 35,95 45,105 60,105 Z"
                fill={highlightPart === 1 ? '#38bdf8' : '#e0f2fe'}
                stroke="#0284c7"
                strokeWidth="2"
              />
              <circle cx="50" cy="90" r="1.5" fill="#0284c7" />

              {/* Outer Barrel */}
              <rect
                x="60"
                y="75"
                width="140"
                height="30"
                rx="3"
                fill={highlightPart === 2 ? '#bae6fd' : '#f0f9ff'}
                stroke="#0284c7"
                strokeWidth="2"
              />

              {/* Compressed Tampon Core */}
              <rect
                x="65"
                y="78"
                width="110"
                height="24"
                rx="4"
                fill={highlightPart === 3 ? '#fbbf24' : '#fef3c7'}
                stroke="#d97706"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <text x="120" y="94" fontSize="10" textAnchor="middle" fill="#92400e" fontWeight="bold">
                压缩吸收棉芯
              </text>

              {/* Finger Grip Rings */}
              <g fill="#0284c7">
                <rect x="185" y="73" width="3" height="34" rx="1.5" />
                <rect x="191" y="73" width="3" height="34" rx="1.5" />
                <rect x="197" y="73" width="3" height="34" rx="1.5" />
              </g>

              {/* Inner Push Plunger */}
              <rect
                x="200"
                y="81"
                width="120"
                height="18"
                rx="2"
                fill={highlightPart === 4 ? '#fed7aa' : '#ffedd5'}
                stroke="#ea580c"
                strokeWidth="2"
              />
              <circle cx="318" cy="90" r="5" fill="#ea580c" />

              {/* Withdrawal Cord */}
              <path
                d="M 175,90 C 240,90 280,120 370,120"
                fill="none"
                stroke={highlightPart === 5 ? '#e11d48' : '#64748b'}
                strokeWidth="2.5"
                strokeDasharray="3 3"
              />
              <circle cx="370" cy="120" r="3" fill="#64748b" />

              {/* Numbered Hotspots */}
              <g fontSize="10" fontWeight="bold" textAnchor="middle" fill="white">
                <circle cx="45" cy="55" r="9" fill="#0284c7" />
                <text x="45" y="58">1</text>

                <circle cx="120" cy="55" r="9" fill="#0284c7" />
                <text x="120" y="58">2</text>

                <circle cx="193" cy="55" r="9" fill="#0284c7" />
                <text x="193" y="58">3</text>

                <circle cx="260" cy="55" r="9" fill="#ea580c" />
                <text x="260" y="58">4</text>

                <circle cx="365" cy="95" r="9" fill="#64748b" />
                <text x="365" y="98">5</text>
              </g>
            </svg>

            {/* Hotspots legend */}
            <div className="grid grid-cols-2 gap-1 text-[11px] pt-1 border-t border-black/5 dark:border-white/5">
              {[
                { id: 1, label: '① 花瓣圆头 (Petal tip)' },
                { id: 2, label: '② 外导管筒身' },
                { id: 3, label: '③ 防滑捏持区' },
                { id: 4, label: '④ 内推进手柄' },
                { id: 5, label: '⑤ 经编纯棉拉绳' }
              ].map(item => (
                <button
                  key={item.id}
                  onMouseEnter={() => setHighlightPart(item.id)}
                  onMouseLeave={() => setHighlightPart(null)}
                  className={`text-left p-1 rounded transition-colors ${
                    highlightPart === item.id
                      ? 'bg-[#3366cc]/15 text-[#3366cc] font-bold'
                      : 'text-[#54595d] dark:text-[#a2a9b1] hover:text-[#202122]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              viewBox="0 0 400 160"
              className="w-full h-auto drop-shadow-xs"
              style={{ maxHeight: '160px' }}
            >
              {/* Digital Tampon Body */}
              <defs>
                <linearGradient id="tamponShade" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="50%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
              </defs>

              {/* Bullet Shape Body */}
              <path
                d="M 120,50 C 90,50 80,80 80,80 C 80,80 90,110 120,110 L 220,110 C 225,110 230,105 230,80 C 230,55 225,50 220,50 Z"
                fill={highlightPart === 1 ? '#bae6fd' : 'url(#tamponShade)'}
                stroke="#64748b"
                strokeWidth="2"
              />

              {/* Curved Grooves */}
              <path d="M 115,54 Q 130,80 115,106" stroke="#94a3b8" strokeWidth="2" fill="none" />
              <path d="M 145,52 Q 160,80 145,108" stroke="#94a3b8" strokeWidth="2" fill="none" />
              <path d="M 175,52 Q 190,80 175,108" stroke="#94a3b8" strokeWidth="2" fill="none" />
              <path d="M 205,53 Q 220,80 205,107" stroke="#94a3b8" strokeWidth="2" fill="none" />

              {/* Cord Base Indent */}
              <ellipse cx="225" cy="80" rx="4" ry="12" fill="#94a3b8" />

              {/* Cord */}
              <path
                d="M 228,80 C 270,80 290,125 360,125"
                fill="none"
                stroke={highlightPart === 2 ? '#e11d48' : '#475569'}
                strokeWidth="3"
                strokeDasharray="4 2"
              />
              <circle cx="360" cy="125" r="4" fill="#475569" />

              {/* Hotspots */}
              <g fontSize="10" fontWeight="bold" textAnchor="middle" fill="white">
                <circle cx="150" cy="30" r="9" fill="#0284c7" />
                <text x="150" y="33">1</text>

                <circle cx="310" cy="95" r="9" fill="#64748b" />
                <text x="310" y="98">2</text>
              </g>
            </svg>

            {/* Hotspots legend */}
            <div className="grid grid-cols-2 gap-1 text-[11px] pt-1 border-t border-black/5 dark:border-white/5">
              <button
                onMouseEnter={() => setHighlightPart(1)}
                onMouseLeave={() => setHighlightPart(null)}
                className={`text-left p-1 rounded transition-colors ${
                  highlightPart === 1
                    ? 'bg-[#3366cc]/15 text-[#3366cc] font-bold'
                    : 'text-[#54595d] dark:text-[#a2a9b1]'
                }`}
              >
                ① 螺旋导流槽弹头棉体
              </button>
              <button
                onMouseEnter={() => setHighlightPart(2)}
                onMouseLeave={() => setHighlightPart(null)}
                className={`text-left p-1 rounded transition-colors ${
                  highlightPart === 2
                    ? 'bg-[#3366cc]/15 text-[#3366cc] font-bold'
                    : 'text-[#54595d] dark:text-[#a2a9b1]'
                }`}
              >
                ② 高强度纯棉牵引拉绳
              </button>
            </div>
          </div>
        )}
        <div className="text-[10px] text-center text-[#72777d] mt-1 italic">
          导管型（上）与指入式（下）结构示意图（点击标签切换）
        </div>
      </div>

      {/* Infobox Key-Value Fields */}
      <div className="divide-y divide-black/5 dark:divide-white/5 text-[11px]">
        <div className="p-2 flex">
          <span className="w-24 font-bold text-[#54595d] dark:text-[#a2a9b1] shrink-0">其他名称</span>
          <span className="flex-1 text-[#202122] dark:text-white">
            棉条、月经栓、内置卫生栓
          </span>
        </div>

        <div className="p-2 flex">
          <span className="w-24 font-bold text-[#54595d] dark:text-[#a2a9b1] shrink-0">产品类型</span>
          <span className="flex-1 text-[#202122] dark:text-white">
            女性经期个人卫生用品（FDA II类医疗器械）
          </span>
        </div>

        <div className="p-2 flex">
          <span className="w-24 font-bold text-[#54595d] dark:text-[#a2a9b1] shrink-0">现代发明人</span>
          <div className="flex-1 text-[#202122] dark:text-white space-y-1">
            <div>
              <button
                onClick={() => onOpenWikiLink('厄尔·哈斯')}
                className="text-[#3366cc] hover:underline font-semibold"
              >
                厄尔·哈斯
              </button>（1929年导管专利）
            </div>
            <div>
              <span className="font-semibold">朱迪丝·埃瑟-米塔格</span>（1950年指入式研发）
            </div>
          </div>
        </div>

        <div className="p-2 flex">
          <span className="w-24 font-bold text-[#54595d] dark:text-[#a2a9b1] shrink-0">主要材质</span>
          <span className="flex-1 text-[#202122] dark:text-white">
            脱脂棉、
            <button
              onClick={() => onOpenWikiLink('粘胶纤维')}
              className="text-[#3366cc] hover:underline"
            >
              粘胶纤维
            </button>
            （人造棉）、纯棉编织拉绳、聚乙烯/纸质导管
          </span>
        </div>

        <div className="p-2 flex">
          <span className="w-24 font-bold text-[#54595d] dark:text-[#a2a9b1] shrink-0">规格标准</span>
          <span className="flex-1 text-[#202122] dark:text-white">
            FDA Syngyna / ISO 23418（6g以下至18g五级吸收量）
          </span>
        </div>

        <div className="p-2 flex">
          <span className="w-24 font-bold text-[#54595d] dark:text-[#a2a9b1] shrink-0">建议时限</span>
          <span className="flex-1 text-[#202122] dark:text-white font-semibold text-amber-700 dark:text-amber-400">
            建议4–6小时，严禁超过8小时
          </span>
        </div>

        <div className="p-2 flex">
          <span className="w-24 font-bold text-[#54595d] dark:text-[#a2a9b1] shrink-0">罕见并发症</span>
          <span className="flex-1">
            <button
              onClick={() => onOpenWikiLink('中毒性休克综合征')}
              className="text-[#ba0000] hover:underline font-bold"
            >
              中毒性休克综合征（TSS）
            </button>
          </span>
        </div>

        <div className="p-2 flex">
          <span className="w-24 font-bold text-[#54595d] dark:text-[#a2a9b1] shrink-0">医学代码</span>
          <div className="flex-1 space-y-0.5 font-mono text-[10px]">
            <div>
              MeSH：
              <a
                href="https://meshb.nlm.nih.gov/record/ui?ui=D000072098"
                target="_blank"
                rel="noreferrer"
                className="text-[#3366cc] hover:underline"
              >
                D000072098
              </a>
            </div>
            <div>ICD-9-CM：96.14</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
