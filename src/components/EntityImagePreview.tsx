import React, { useState, useEffect } from 'react';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';
import { GraphNode } from '../data/knowledgeGraphData';
import { getProxiedImageUrl } from '../utils/imageProxy';

interface EntityImagePreviewProps {
  node: GraphNode;
  isDarkMode: boolean;
}

export const EntityImagePreview: React.FC<EntityImagePreviewProps> = ({ node, isDarkMode }) => {
  const [imageFailed, setImageFailed] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  // Reset state when active node changes
  useEffect(() => {
    setImageFailed(false);
    setImageLoaded(false);
  }, [node.id]);

  const proxiedUrl = getProxiedImageUrl(node.imageUrl);
  const showExternalImage = Boolean(proxiedUrl) && !imageFailed;

  return (
    <div className={`w-full h-40 rounded overflow-hidden border transition-colors relative flex items-center justify-center select-none ${
      isDarkMode
        ? 'bg-[#151617] border-[#3a3d42]'
        : 'bg-[#f8f9fa] border-[#c8ccd1]'
    }`}>
      {/* 1. Try proxied image */}
      {showExternalImage && (
        <img
          src={proxiedUrl}
          alt={node.name}
          onError={() => setImageFailed(true)}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-200 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* 2. Fallback / Embedded Vector Graphic if image failed or still loading or not specified */}
      {(!showExternalImage || !imageLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center p-2">
          {renderVectorGraphic(node, isDarkMode)}
        </div>
      )}

      {/* 3. Bottom caption tag */}
      <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] text-white/90 font-mono">
        <ImageIcon className="w-2.5 h-2.5" />
        <span>{imageLoaded && !imageFailed ? '维基共享影像' : '词条图解示意'}</span>
      </div>
    </div>
  );
};

/**
 * High-fidelity Wikipedia-style Vector Graphics for Knowledge Graph Entities
 */
function renderVectorGraphic(node: GraphNode, isDarkMode: boolean) {
  const id = node.id;
  const category = node.category;

  // Specific Graphics by Node ID
  if (id === 'tampon' || id === 'digital-tampon') {
    return (
      <svg viewBox="0 0 240 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tamponBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>
        <rect width="240" height="120" fill={isDarkMode ? '#1e2022' : '#f1f5f9'} />
        {/* Tampon Cylinder with rounded tip */}
        <g transform="translate(40, 35)">
          <path d="M 0,25 C -15,25 -25,35 -35,32" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="2,2" />
          <rect x="0" y="5" width="130" height="40" rx="20" fill="url(#tamponBody)" stroke="#94a3b8" strokeWidth="1.2" />
          {/* Absorbent grooves */}
          <line x1="15" y1="18" x2="115" y2="18" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="15" y1="25" x2="115" y2="25" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="15" y1="32" x2="115" y2="32" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Tear band */}
          <rect x="60" y="5" width="12" height="40" fill="#ef4444" opacity="0.85" />
          <text x="66" y="27" fontSize="7" fill="#ffffff" fontWeight="bold" textAnchor="middle">OPEN</text>
        </g>
        <text x="120" y="105" fontSize="11" fill={isDarkMode ? '#a2a9b1' : '#54595d'} textAnchor="middle" fontFamily="sans-serif">
          卫生棉条 (Tampon) 结构解构
        </text>
      </svg>
    );
  }

  if (id === 'applicator-tampon') {
    return (
      <svg viewBox="0 0 240 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="120" fill={isDarkMode ? '#1e2022' : '#f8fafc'} />
        <g transform="translate(30, 40)">
          {/* Withdrawal string */}
          <path d="M 160,20 C 180,20 185,32 195,30" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="2,2" />
          {/* Plunger */}
          <rect x="100" y="12" width="60" height="16" rx="2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
          {/* Outer Barrel */}
          <rect x="30" y="8" width="75" height="24" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" />
          {/* Petal Tip */}
          <path d="M 30,8 C 20,8 15,14 15,20 C 15,26 20,32 30,32 Z" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
          {/* Grip rings */}
          <line x1="90" y1="11" x2="90" y2="29" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="94" y1="11" x2="94" y2="29" stroke="#cbd5e1" strokeWidth="1.5" />
        </g>
        <text x="120" y="105" fontSize="11" fill={isDarkMode ? '#a2a9b1' : '#54595d'} textAnchor="middle" fontFamily="sans-serif">
          导管型双套管系统 (Applicator)
        </text>
      </svg>
    );
  }

  if (id === 'sanitary-pad' || id === 'cloth-pad' || id === 'panty-liner') {
    return (
      <svg viewBox="0 0 240 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="120" fill={isDarkMode ? '#1e2022' : '#f0fdf4'} />
        <g transform="translate(60, 25)">
          {/* Outer wings */}
          <path d="M 40,20 C 10,10 10,60 40,50 Z" fill="#dcfce7" stroke="#86efac" strokeWidth="1" />
          <path d="M 80,20 C 110,10 110,60 80,50 Z" fill="#dcfce7" stroke="#86efac" strokeWidth="1" />
          {/* Pad Main Body */}
          <rect x="30" y="5" width="60" height="60" rx="25" fill="#ffffff" stroke="#059669" strokeWidth="1.5" />
          {/* Inner embossed channels */}
          <path d="M 45,18 C 40,35 40,35 45,52" fill="none" stroke="#86efac" strokeWidth="1.5" />
          <path d="M 75,18 C 80,35 80,35 75,52" fill="none" stroke="#86efac" strokeWidth="1.5" />
        </g>
        <text x="120" y="105" fontSize="11" fill={isDarkMode ? '#a2a9b1' : '#047857'} textAnchor="middle" fontFamily="sans-serif">
          {node.name} 吸收层与防漏侧翼
        </text>
      </svg>
    );
  }

  if (id === 'menstrual-cup') {
    return (
      <svg viewBox="0 0 240 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="120" fill={isDarkMode ? '#1e2022' : '#f0fdfa'} />
        <g transform="translate(85, 20)">
          {/* Bell shaped cup */}
          <path d="M 10,10 C 10,45 30,55 35,65 C 40,55 60,45 60,10 Z" fill="#99f6e4" stroke="#0d9488" strokeWidth="1.5" fillOpacity="0.7" />
          {/* Top rim */}
          <ellipse cx="35" cy="10" rx="25" ry="5" fill="#5eead4" stroke="#0d9488" strokeWidth="1.5" />
          {/* Pull stem */}
          <rect x="33" y="65" width="4" height="18" rx="2" fill="#0d9488" />
          <circle cx="35" cy="70" r="1.5" fill="#ffffff" />
          <circle cx="35" cy="76" r="1.5" fill="#ffffff" />
        </g>
        <text x="120" y="108" fontSize="11" fill={isDarkMode ? '#a2a9b1' : '#0f766e'} textAnchor="middle" fontFamily="sans-serif">
          月经杯 (Menstrual Cup) 钟形容器
        </text>
      </svg>
    );
  }

  if (id === 'tss' || id === 'staph-aureus' || id === 'tsst-1') {
    return (
      <svg viewBox="0 0 240 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="120" fill={isDarkMode ? '#1e2022' : '#fef2f2'} />
        <g transform="translate(70, 20)">
          {/* Petri dish rim */}
          <circle cx="50" cy="40" r="35" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.5" />
          {/* Golden Staphylococcus clusters */}
          <circle cx="45" cy="35" r="5" fill="#eab308" stroke="#ca8a04" strokeWidth="0.8" />
          <circle cx="52" cy="33" r="5" fill="#eab308" stroke="#ca8a04" strokeWidth="0.8" />
          <circle cx="50" cy="42" r="5" fill="#eab308" stroke="#ca8a04" strokeWidth="0.8" />
          <circle cx="42" cy="43" r="4.5" fill="#eab308" stroke="#ca8a04" strokeWidth="0.8" />
          <circle cx="58" cy="39" r="4.5" fill="#eab308" stroke="#ca8a04" strokeWidth="0.8" />
          <circle cx="36" cy="38" r="4" fill="#eab308" stroke="#ca8a04" strokeWidth="0.8" />
          <circle cx="48" cy="49" r="4" fill="#eab308" stroke="#ca8a04" strokeWidth="0.8" />
        </g>
        <text x="120" y="108" fontSize="11" fill={isDarkMode ? '#f87171' : '#b91c1c'} textAnchor="middle" fontFamily="sans-serif">
          金黄色葡萄球菌与外毒素致病模型
        </text>
      </svg>
    );
  }

  if (id === 'vaginal-flora' || id === 'douching') {
    return (
      <svg viewBox="0 0 240 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="120" fill={isDarkMode ? '#1e2022' : '#faf5ff'} />
        <g transform="translate(80, 25)">
          {/* Beneficial Lactobacilli rods */}
          <rect x="10" y="10" width="30" height="9" rx="4.5" fill="#c084fc" stroke="#7e22ce" strokeWidth="1" transform="rotate(-15, 25, 14)" />
          <rect x="35" y="25" width="28" height="9" rx="4.5" fill="#c084fc" stroke="#7e22ce" strokeWidth="1" transform="rotate(30, 49, 29)" />
          <rect x="15" y="40" width="32" height="9" rx="4.5" fill="#c084fc" stroke="#7e22ce" strokeWidth="1" transform="rotate(-5, 31, 44)" />
          {/* Lactic acid shield */}
          <circle cx="70" cy="18" r="8" fill="#e9d5ff" stroke="#9333ea" strokeWidth="0.8" strokeDasharray="1,1" />
          <text x="70" y="21" fontSize="7" fill="#6b21a8" fontWeight="bold" textAnchor="middle">pH&lt;4.5</text>
        </g>
        <text x="120" y="108" fontSize="11" fill={isDarkMode ? '#c084fc' : '#6b21a8'} textAnchor="middle" fontFamily="sans-serif">
          乳杆菌主导之弱酸自净微生态
        </text>
      </svg>
    );
  }

  if (category === 'anatomy' || id === 'vaginal-fornix' || id === 'vaginal-corona' || id === 'female-reproductive') {
    return (
      <svg viewBox="0 0 240 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="120" fill={isDarkMode ? '#1e2022' : '#fdf2f8'} />
        <g transform="translate(60, 20)">
          {/* Uterus & Cervix & Vaginal Canal Outline */}
          <path d="M 30,10 C 15,25 35,40 50,45 C 55,42 65,42 70,45 C 85,40 105,25 90,10 Z" fill="#fbcfe8" stroke="#db2777" strokeWidth="1.2" />
          {/* Posterior fornix recession */}
          <path d="M 45,45 C 45,65 55,75 55,80" fill="none" stroke="#be185d" strokeWidth="2" />
          <path d="M 75,45 C 75,65 65,75 65,80" fill="none" stroke="#be185d" strokeWidth="2" />
          <circle cx="50" cy="52" r="3" fill="#ec4899" />
          <text x="35" y="55" fontSize="8" fill="#be185d" textAnchor="end">后穹窿</text>
        </g>
        <text x="120" y="108" fontSize="11" fill={isDarkMode ? '#f472b6' : '#9d174d'} textAnchor="middle" fontFamily="sans-serif">
          女性生殖系统与放置深度示意
        </text>
      </svg>
    );
  }

  if (id === 'earle-haas' || id === 'tampax' || id === 'kotex') {
    return (
      <svg viewBox="0 0 240 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="120" fill={isDarkMode ? '#1e2022' : '#fffbeb'} />
        <g transform="translate(75, 15)">
          {/* Patent Document Scroll */}
          <rect x="0" y="0" width="90" height="65" rx="3" fill="#ffffff" stroke="#d97706" strokeWidth="1.2" />
          <line x1="12" y1="12" x2="78" y2="12" stroke="#b45309" strokeWidth="2" />
          <text x="45" y="24" fontSize="7" fill="#92400e" fontWeight="bold" textAnchor="middle">US PATENT 1,926,900</text>
          <line x1="15" y1="32" x2="75" y2="32" stroke="#fde68a" strokeWidth="1.5" />
          <line x1="15" y1="40" x2="65" y2="40" stroke="#fde68a" strokeWidth="1.5" />
          <line x1="15" y1="48" x2="70" y2="48" stroke="#fde68a" strokeWidth="1.5" />
          {/* Seal */}
          <circle cx="72" cy="52" r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
        </g>
        <text x="120" y="105" fontSize="11" fill={isDarkMode ? '#fbbf24' : '#92400e'} textAnchor="middle" fontFamily="sans-serif">
          厄尔·哈斯 1931年专利文献图谱
        </text>
      </svg>
    );
  }

  // Default Elegant Encyclopedic Graphic
  return (
    <svg viewBox="0 0 240 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="120" fill={isDarkMode ? '#1e2022' : '#f8f9fa'} />
      <g transform="translate(95, 25)">
        <circle cx="25" cy="25" r="24" fill={isDarkMode ? '#2c3036' : '#e5e7eb'} stroke="#3366cc" strokeWidth="1.5" />
        <path d="M 15,25 L 35,25 M 25,15 L 25,35" stroke="#3366cc" strokeWidth="2" strokeLinecap="round" />
      </g>
      <text x="120" y="90" fontSize="12" fontWeight="bold" fill={isDarkMode ? '#eaecf0' : '#202122'} textAnchor="middle" fontFamily="sans-serif">
        {node.name}
      </text>
      <text x="120" y="108" fontSize="10" fill="#72777d" textAnchor="middle" fontFamily="sans-serif">
        MZ维基 词条实体网络
      </text>
    </svg>
  );
}
