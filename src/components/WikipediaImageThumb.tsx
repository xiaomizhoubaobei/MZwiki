import React from 'react';

export interface WikiImageData {
  id: string;
  filename: string;
  title: string;
  caption: string;
  author: string;
  license: string;
  licenseUrl?: string;
  date: string;
  dimensions: string;
  fileSize: string;
  commonsUrl: string;
  type: 'cellophane' | 'applicator' | 'elements' | 'absorbency' | 'anatomy';
}

interface WikipediaImageThumbProps {
  image: WikiImageData;
  width?: number;
  align?: 'right' | 'left' | 'center' | 'none';
  isDarkMode: boolean;
  onImageClick?: (image: WikiImageData) => void;
}

export const WikipediaImageThumb: React.FC<WikipediaImageThumbProps> = ({
  image,
  width = 250,
  align = 'right',
  isDarkMode,
  onImageClick,
}) => {
  const alignClass =
    align === 'right'
      ? 'float-none sm:float-right clear-right ml-0 sm:ml-5 mb-4'
      : align === 'left'
      ? 'float-none sm:float-left clear-left mr-0 sm:mr-5 mb-4'
      : align === 'center'
      ? 'mx-auto mb-4 block'
      : 'mb-4';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onImageClick) {
      onImageClick(image);
    }
  };

  return (
    <div
      className={`thumb tright not-italic select-none my-2 transition-colors ${alignClass}`}
      style={{ width: `${width + 4}px`, maxWidth: '100%' }}
    >
      {/* Outer Wikipedia Thumb Container: 1px border, 3px padding, #f8f9fa bg */}
      <div
        className={`thumbinner p-[3px] border rounded-[2px] transition-colors ${
          isDarkMode
            ? 'bg-[#27292d] border-[#54595d] text-[#eaecf0]'
            : 'bg-[#f8f9fa] border-[#c8ccd1] text-[#202122]'
        }`}
        style={{ width: '100%' }}
      >
        {/* Image Area */}
        <a
          href={`#view-${image.id}`}
          onClick={handleClick}
          className="image block relative overflow-hidden group cursor-pointer border border-[#c8ccd1]/40 dark:border-[#54595d]/40 bg-white dark:bg-[#1a1b1e]"
          title={`${image.title} - 点击放大`}
        >
          {renderImageGraphic(image.type)}

          {/* Subtle hover overlay hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors pointer-events-none" />
        </a>

        {/* Thumbnail Caption Bar */}
        <div className="thumbcaption px-[3px] pt-1.5 pb-0.5 text-[12px] leading-[1.4] text-left relative flex items-start justify-between gap-1.5 font-sans">
          <div className="flex-1 text-[#202122] dark:text-[#eaecf0]">
            {image.caption}
          </div>

          {/* Wikipedia's Classic Magnify Icon: Two overlapping rectangles */}
          <div className="magnify shrink-0 mt-0.5">
            <a
              href={`#view-${image.id}`}
              onClick={handleClick}
              className="internal block p-0.5 text-[#72777d] hover:text-[#3366cc] dark:hover:text-[#6699ff] transition-colors"
              title="放大查看图片与详细信息"
              aria-label="放大"
            >
              {/* MediaWiki SVG Magnify / Enlarge Icon */}
              <svg
                className="w-3.5 h-3.5 fill-current"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                {/* Front window and back window icon */}
                <path d="M14 2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM4 14V4h10v10H4z"/>
                <path d="M18 6h-2v2h2v8H8v-2H6v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * High-fidelity Vector Representations of Wikipedia Commons Photos
 */
function renderImageGraphic(type: WikiImageData['type']) {
  switch (type) {
    case 'cellophane':
      // Recreates File:Tampon.JPG - Cellophane wrapped tampon above cm ruler
      return (
        <svg
          viewBox="0 0 320 200"
          className="w-full h-auto block select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="photoBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f3f4f6" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e5e7eb" />
            </linearGradient>

            {/* Wooden ruler gradient */}
            <linearGradient id="rulerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e9cf9f" />
              <stop offset="20%" stopColor="#f7e4be" />
              <stop offset="80%" stopColor="#dec08c" />
              <stop offset="100%" stopColor="#bfa16f" />
            </linearGradient>

            {/* Cotton tampon cylinder texture */}
            <linearGradient id="tamponCotton" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e8eaed" />
              <stop offset="25%" stopColor="#ffffff" />
              <stop offset="65%" stopColor="#f8f9fa" />
              <stop offset="100%" stopColor="#d2d6dc" />
            </linearGradient>

            {/* Cellophane shine effect */}
            <linearGradient id="cellophaneShine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0.4" />
              <stop offset="30%" stopColor="white" stopOpacity="0.8" />
              <stop offset="45%" stopColor="white" stopOpacity="0.2" />
              <stop offset="70%" stopColor="white" stopOpacity="0.7" />
              <stop offset="100%" stopColor="white" stopOpacity="0.3" />
            </linearGradient>

            {/* Red tear tape band */}
            <linearGradient id="tearTape" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>

            <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Background studio plane */}
          <rect width="320" height="200" fill="url(#photoBg)" />

          {/* Wooden metric ruler (File:Tampon.JPG has ruler underneath) */}
          <g transform="translate(15, 140)">
            {/* Ruler body */}
            <rect x="0" y="0" width="290" height="34" rx="2" fill="url(#rulerGrad)" stroke="#a18452" strokeWidth="1" filter="url(#subtleShadow)" />
            {/* Beveled edge line */}
            <line x1="0" y1="8" x2="290" y2="8" stroke="#fef3c7" strokeWidth="1" />

            {/* Centimeter ticks and numerals (0 to 6 cm) */}
            {[0, 1, 2, 3, 4, 5, 6].map((cm) => {
              const x = 20 + cm * 40;
              return (
                <g key={cm}>
                  {/* Major tick */}
                  <line x1={x} y1="0" x2={x} y2="14" stroke="#4a3718" strokeWidth="1.2" />
                  {/* Half cm tick */}
                  {cm < 6 && <line x1={x + 20} y1="0" x2={x + 20} y2="9" stroke="#5c4520" strokeWidth="0.9" />}
                  {/* Millimeter ticks */}
                  {cm < 6 && [4, 8, 12, 16, 24, 28, 32, 36].map((mm) => (
                    <line key={mm} x1={x + mm} y1="0" x2={x + mm} y2="6" stroke="#785a2b" strokeWidth="0.6" />
                  ))}
                  {/* Numeral */}
                  <text x={x} y="25" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle" fill="#3b2b13">
                    {cm}
                  </text>
                </g>
              );
            })}
            <text x="275" y="24" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="end" fill="#5c4520">
              cm
            </text>
          </g>

          {/* The Tampon in Cellophane (File:Tampon.JPG) */}
          <g transform="translate(45, 52)" filter="url(#subtleShadow)">
            {/* Withdrawal string peeking out left */}
            <path
              d="M 15,35 C 0,38 -15,48 -25,44 C -32,41 -35,52 -40,55"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M 15,35 C 0,38 -15,48 -25,44 C -32,41 -35,52 -40,55"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1.2"
              strokeDasharray="2,2"
            />

            {/* Left twisted cellophane tail wrapper */}
            <path
              d="M 10,22 C 3,25 -2,32 0,37 C 2,42 8,46 12,48 Z"
              fill="#ffffff"
              fillOpacity="0.75"
              stroke="#94a3b8"
              strokeWidth="0.6"
            />
            {/* Twist crimp lines */}
            <path d="M 2,32 Q 8,36 12,35" stroke="#64748b" strokeWidth="0.8" fill="none" opacity="0.6" />

            {/* Main tampon body with rounded tip */}
            {/* Base cylinder */}
            <rect x="12" y="16" width="180" height="38" rx="19" fill="url(#tamponCotton)" stroke="#cbd5e1" strokeWidth="1" />

            {/* Tampon longitudinal absorbent grooves (ob grooves) */}
            <path d="M 25,24 Q 100,23 182,24" stroke="#d1d5db" strokeWidth="1.2" fill="none" />
            <path d="M 20,30 Q 100,29 188,30" stroke="#cbd5e1" strokeWidth="1.2" fill="none" />
            <path d="M 20,40 Q 100,41 188,40" stroke="#cbd5e1" strokeWidth="1.2" fill="none" />
            <path d="M 25,46 Q 100,47 182,46" stroke="#d1d5db" strokeWidth="1.2" fill="none" />

            {/* Red center tear strip band (easy open tab) */}
            <g transform="translate(95, 15)">
              <rect x="0" y="0" width="14" height="40" rx="1" fill="url(#tearTape)" stroke="#b91c1c" strokeWidth="0.5" />
              {/* Tear tape tab arrow / text */}
              <path d="M 4,8 L 10,8 L 7,4 Z" fill="#ffffff" />
              <text x="7" y="24" fontSize="6" fontFamily="sans-serif" fontWeight="bold" fill="#ffffff" textAnchor="middle" transform="rotate(90, 7, 24)">
                OPEN
              </text>
              <line x1="0" y1="12" x2="14" y2="12" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="1,1" />
              <line x1="0" y1="28" x2="14" y2="28" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="1,1" />
            </g>

            {/* Cellophane outer wrap gloss highlight */}
            <rect x="12" y="16" width="180" height="38" rx="19" fill="url(#cellophaneShine)" pointerEvents="none" />

            {/* Right rounded tip smooth curve */}
            <path
              d="M 172,16 C 188,16 200,25 200,35 C 200,45 188,54 172,54 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              opacity="0.8"
            />

            {/* Printed micro-labels on wrapper */}
            <text x="50" y="37" fontSize="7.5" fontFamily="sans-serif" fontWeight="bold" fill="#3b82f6" opacity="0.65" letterSpacing="1">
              o.b.
            </text>
            <text x="135" y="37" fontSize="7.5" fontFamily="sans-serif" fontWeight="bold" fill="#3b82f6" opacity="0.65" letterSpacing="1">
              o.b.
            </text>
          </g>

          {/* Scale Indicator Label Overlay */}
          <g transform="translate(20, 20)">
            <rect x="0" y="0" width="95" height="18" rx="3" fill="#000000" fillOpacity="0.6" />
            <text x="8" y="12" fontSize="9" fill="#ffffff" fontFamily="sans-serif" fontWeight="500">
              比例尺: 1小格 = 1mm
            </text>
          </g>
        </svg>
      );

    case 'applicator':
      // Recreates File:Tampon with applicator.jpg - Modern white applicator tampon
      return (
        <svg
          viewBox="0 0 320 200"
          className="w-full h-auto block select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cleanBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#f1f5f9" />
            </linearGradient>

            {/* Pearlescent white plastic barrel gradient */}
            <linearGradient id="barrelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="25%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#f1f5f9" />
              <stop offset="90%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            {/* Inner plunger push rod gradient */}
            <linearGradient id="plungerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="30%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            <filter id="applicatorShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#0f172a" floodOpacity="0.18" />
            </filter>
          </defs>

          {/* Clean clinical background */}
          <rect width="320" height="200" fill="url(#cleanBg)" />

          {/* Tampon with Applicator Assembly */}
          <g transform="translate(30, 85)" filter="url(#applicatorShadow)">
            {/* White Braided Cotton Withdrawal Cord extending from plunger */}
            <path
              d="M 235,14 C 255,14 265,30 275,25 C 285,20 280,38 290,42"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <path
              d="M 235,14 C 255,14 265,30 275,25 C 285,20 280,38 290,42"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.2"
              strokeDasharray="2,2"
            />
            {/* Cord knot at the end */}
            <circle cx="290" cy="42" r="2.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />

            {/* Inner Plunger (内推杆) */}
            <rect x="145" y="6" width="90" height="16" rx="3" fill="url(#plungerGrad)" stroke="#cbd5e1" strokeWidth="1" />
            {/* Plunger back flange / thumb ring */}
            <rect x="232" y="2" width="6" height="24" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />

            {/* Outer Barrel (外导管) */}
            <rect x="42" y="2" width="108" height="24" rx="3" fill="url(#barrelGrad)" stroke="#cbd5e1" strokeWidth="1" />

            {/* Finger Grip Rings (防滑指握区) */}
            <g transform="translate(125, 2)">
              <rect x="0" y="0" width="22" height="24" rx="2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="5" y1="2" x2="5" y2="22" stroke="#94a3b8" strokeWidth="1.2" />
              <line x1="11" y1="2" x2="11" y2="22" stroke="#94a3b8" strokeWidth="1.2" />
              <line x1="17" y1="2" x2="17" y2="22" stroke="#94a3b8" strokeWidth="1.2" />
            </g>

            {/* Rounded Petal Tip (花瓣状圆头开口) */}
            <path
              d="M 42,2 C 26,3 15,9 15,14 C 15,19 26,25 42,26 Z"
              fill="url(#barrelGrad)"
              stroke="#cbd5e1"
              strokeWidth="1"
            />
            {/* Petal seam slit cuts */}
            <path d="M 15,14 L 34,14" stroke="#94a3b8" strokeWidth="1" />
            <path d="M 23,8 L 36,14 L 23,20" stroke="#94a3b8" strokeWidth="0.8" fill="none" />

            {/* Plastic Specular Highlights */}
            <line x1="30" y1="6" x2="135" y2="6" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
            <line x1="155" y1="9" x2="225" y2="9" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
          </g>

          {/* Technical callouts label */}
          <g transform="translate(20, 20)">
            <text x="0" y="12" fontSize="11" fontFamily="sans-serif" fontWeight="bold" fill="#334155">
              塑料导管型卫生棉条（带推杆与花瓣顶端）
            </text>
            <text x="0" y="26" fontSize="9.5" fontFamily="sans-serif" fill="#64748b">
              Applicator tampon with push plunger & petal tip
            </text>
          </g>
        </svg>
      );

    case 'elements':
      // Recreates File:Elements of a tampon with applicator.jpg
      return (
        <svg
          viewBox="0 0 320 220"
          className="w-full h-auto block select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="320" height="220" fill="#f8fafc" />

          {/* Number 1: 棉条 (Tampon Core) */}
          <g transform="translate(30, 25)">
            <circle cx="10" cy="15" r="9" fill="#0284c7" />
            <text x="10" y="19" fontSize="11" fontWeight="bold" fill="#ffffff" textAnchor="middle">1</text>
            <rect x="35" y="5" width="85" height="20" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
            <text x="130" y="19" fontSize="10.5" fontFamily="sans-serif" fontWeight="bold" fill="#1e293b">
              吸水棉芯 (Tampon core)
            </text>
          </g>

          {/* Number 2: 外管 (Outer barrel) */}
          <g transform="translate(30, 65)">
            <circle cx="10" cy="15" r="9" fill="#0284c7" />
            <text x="10" y="19" fontSize="11" fontWeight="bold" fill="#ffffff" textAnchor="middle">2</text>
            <rect x="35" y="5" width="105" height="20" rx="3" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />
            <path d="M 35,5 C 24,7 20,12 20,15 C 20,18 24,23 35,25 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />
            <text x="150" y="19" fontSize="10.5" fontFamily="sans-serif" fontWeight="bold" fill="#1e293b">
              外导管 (Outer barrel)
            </text>
          </g>

          {/* Number 3: 内管 (Inner plunger) */}
          <g transform="translate(30, 105)">
            <circle cx="10" cy="15" r="9" fill="#0284c7" />
            <text x="10" y="19" fontSize="11" fontWeight="bold" fill="#ffffff" textAnchor="middle">3</text>
            <rect x="35" y="6" width="95" height="16" rx="2" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" />
            <rect x="127" y="3" width="5" height="22" rx="1.5" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
            <text x="145" y="19" fontSize="10.5" fontFamily="sans-serif" fontWeight="bold" fill="#1e293b">
              内推杆 (Inner plunger)
            </text>
          </g>

          {/* Number 4: 棉线拉绳 (Withdrawal cord) */}
          <g transform="translate(30, 145)">
            <circle cx="10" cy="15" r="9" fill="#0284c7" />
            <text x="10" y="19" fontSize="11" fontWeight="bold" fill="#ffffff" textAnchor="middle">4</text>
            <path d="M 35,15 C 60,10 75,22 105,15 C 115,12 120,20 135,17" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="3,2" />
            <text x="145" y="19" fontSize="10.5" fontFamily="sans-serif" fontWeight="bold" fill="#1e293b">
              棉线拉绳 (Withdrawal cord)
            </text>
          </g>

          {/* Number 5: 独立包装 (Wrapper) */}
          <g transform="translate(30, 180)">
            <circle cx="10" cy="15" r="9" fill="#0284c7" />
            <text x="10" y="19" fontSize="11" fontWeight="bold" fill="#ffffff" textAnchor="middle">5</text>
            <rect x="35" y="6" width="75" height="18" rx="2" fill="#fce7f3" stroke="#db2777" strokeWidth="0.8" strokeDasharray="2,2" />
            <text x="120" y="19" fontSize="10.5" fontFamily="sans-serif" fontWeight="bold" fill="#1e293b">
              防菌包装纸 (Protective wrapper)
            </text>
          </g>
        </svg>
      );

    case 'absorbency':
      // Absorbency standard droplet chart
      return (
        <svg
          viewBox="0 0 320 180"
          className="w-full h-auto block select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="320" height="180" fill="#f8fafc" />
          <text x="160" y="22" fontSize="11.5" fontWeight="bold" textAnchor="middle" fill="#0f172a">
            国际/FDA 卫生棉条吸收量分级标准
          </text>

          {/* Table headers */}
          <rect x="15" y="32" width="290" height="22" fill="#e2e8f0" rx="2" />
          <text x="30" y="47" fontSize="9.5" fontWeight="bold" fill="#334155">规格类别</text>
          <text x="120" y="47" fontSize="9.5" fontWeight="bold" fill="#334155">吸收能力 (克)</text>
          <text x="210" y="47" fontSize="9.5" fontWeight="bold" fill="#334155">水滴标示</text>

          {/* Rows */}
          {[
            { name: '量少型 (Light)', g: '≤ 6 克', drops: 1, y: 58 },
            { name: '普通型 (Regular)', g: '6 - 9 克', drops: 2, y: 84 },
            { name: '量多型 (Super)', g: '9 - 12 克', drops: 3, y: 110 },
            { name: '超多型 (Super Plus)', g: '12 - 15 克', drops: 4, y: 136 },
          ].map((row, idx) => (
            <g key={idx}>
              <line x1="15" y1={row.y + 20} x2="305" y2={row.y + 20} stroke="#e2e8f0" strokeWidth="1" />
              <text x="30" y={row.y + 14} fontSize="9.5" fill="#1e293b">{row.name}</text>
              <text x="120" y={row.y + 14} fontSize="9.5" fontFamily="monospace" fill="#0369a1">{row.g}</text>
              <g transform={`translate(210, ${row.y + 4})`}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <path
                    key={i}
                    d="M 6,0 C 6,0 12,7 12,10 C 12,13 9,15 6,15 C 3,15 0,13 0,10 C 0,7 6,0 6,0 Z"
                    transform={`translate(${i * 15}, 0)`}
                    fill={i < row.drops ? '#0284c7' : '#e2e8f0'}
                  />
                ))}
              </g>
            </g>
          ))}
          <text x="160" y="172" fontSize="8" fill="#64748b" textAnchor="middle">
            数据来源：美国食品药品监督管理局 (FDA 21 CFR 801.430)
          </text>
        </svg>
      );

    case 'anatomy':
      // Anatomical sagittal cross section
      return (
        <svg
          viewBox="0 0 320 200"
          className="w-full h-auto block select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="320" height="200" fill="#f8fafc" />

          {/* Uterus & Pelvic Organs Outline */}
          <path
            d="M 70,60 C 90,40 140,40 160,60 C 170,72 165,95 155,105 C 150,110 145,115 145,125 L 140,175 C 135,178 120,178 115,175 L 125,125 C 125,115 120,110 115,105 C 100,90 55,80 70,60 Z"
            fill="#ffe4e6"
            stroke="#f43f5e"
            strokeWidth="1.5"
          />
          {/* Cervix marker */}
          <path d="M 125,120 Q 135,123 145,120" stroke="#e11d48" strokeWidth="2" fill="none" />

          {/* Vaginal Canal with 45 degree angle */}
          <path
            d="M 125,125 L 115,175"
            stroke="#fda4af"
            strokeWidth="20"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* Correctly placed tampon in upper vaginal fornix */}
          <g transform="translate(118, 130) rotate(-12)">
            <rect x="0" y="0" width="18" height="32" rx="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
            {/* Cord extending outside */}
            <path d="M 9,32 C 8,40 4,50 -2,58" fill="none" stroke="#64748b" strokeWidth="1.8" strokeDasharray="2,2" />
          </g>

          {/* Anatomical labels */}
          <g fontSize="9" fontFamily="sans-serif">
            <line x1="160" y1="55" x2="200" y2="45" stroke="#94a3b8" strokeWidth="1" />
            <text x="205" y="48" fill="#1e293b" fontWeight="bold">子宫 (Uterus)</text>

            <line x1="145" y1="120" x2="200" y2="105" stroke="#94a3b8" strokeWidth="1" />
            <text x="205" y="108" fill="#1e293b" fontWeight="bold">子宫颈 (Cervix)</text>

            <line x1="135" y1="145" x2="200" y2="145" stroke="#0284c7" strokeWidth="1.2" />
            <text x="205" y="148" fill="#0284c7" fontWeight="bold">棉条位于阴道后穹隆</text>
            <text x="205" y="160" fill="#64748b" fontSize="8">无感觉神经敏感区</text>

            <line x1="110" y1="185" x2="60" y2="185" stroke="#94a3b8" strokeWidth="1" />
            <text x="15" y="188" fill="#1e293b" fontWeight="bold">阴道口外棉线</text>
          </g>
        </svg>
      );

    default:
      return null;
  }
}
