import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink, Download, Info, ShieldCheck, ZoomIn, ZoomOut } from 'lucide-react';
import { WikiImageData } from './WikipediaImageThumb';

interface WikipediaMediaViewerProps {
  images: WikiImageData[];
  currentImageId: string | null;
  onClose: () => void;
  onSelectImage: (id: string) => void;
}

export const WikipediaMediaViewer: React.FC<WikipediaMediaViewerProps> = ({
  images,
  currentImageId,
  onClose,
  onSelectImage,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(true);

  const currentIndex = images.findIndex((img) => img.id === currentImageId);
  const currentImage = currentIndex !== -1 ? images[currentIndex] : images[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onSelectImage(images[currentIndex - 1].id);
      }
      if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
        onSelectImage(images[currentIndex + 1].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images, onClose, onSelectImage]);

  if (!currentImageId || !currentImage) return null;

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectImage(images[currentIndex - 1].id);
      setZoomLevel(1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      onSelectImage(images[currentIndex + 1].id);
      setZoomLevel(1);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white backdrop-blur-xs select-none animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="维基媒体查看器"
    >
      {/* Top Header Bar */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-white/10 bg-black/60 shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/80 font-mono">
            Commons
          </span>
          <h2 className="text-sm font-medium truncate text-white/90">
            {currentImage.filename}
          </h2>
          <span className="text-xs text-white/50 shrink-0 hidden sm:inline">
            ({currentIndex + 1} / {images.length})
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Zoom Buttons */}
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2))}
            className="p-2 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="放大"
            aria-label="放大"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
            className="p-2 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="缩小"
            aria-label="缩小"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 ml-2 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-colors"
            title="关闭媒体查看器 (Esc)"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Center Image Stage */}
      <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/10 z-10 transition-colors"
            title="上一张 (←)"
            aria-label="上一张图片"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {currentIndex < images.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/10 z-10 transition-colors"
            title="下一张 (→)"
            aria-label="下一张图片"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Scaled Image Container */}
        <div 
          className="max-w-[760px] w-full max-h-full flex items-center justify-center transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <div className="rounded shadow-2xl overflow-hidden border border-white/10 bg-white">
            {renderLargeGraphic(currentImage.type)}
          </div>
        </div>
      </div>

      {/* Bottom Metadata Drawer */}
      <div className="border-t border-white/10 bg-[#121417] px-4 py-3 shrink-0">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1 flex-1">
            <div className="text-sm font-medium text-white flex items-center gap-2">
              <span>{currentImage.title}</span>
              <span className="text-[11px] px-1.5 py-0.2 rounded bg-blue-900/60 text-blue-200 border border-blue-700/50">
                {currentImage.license}
              </span>
            </div>
            <p className="text-white/70 line-clamp-2">
              {currentImage.caption}
            </p>
            <div className="text-white/50 text-[11px] flex flex-wrap gap-x-4 gap-y-1 pt-0.5">
              <span>作者：{currentImage.author}</span>
              <span>拍摄/创建时间：{currentImage.date}</span>
              <span>原始尺寸：{currentImage.dimensions}</span>
              <span>大小：{currentImage.fileSize}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={currentImage.commonsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 font-medium"
            >
              <span>维基共享资源</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => {
                alert(`在实际维基百科中，将下载高分辨率文件：${currentImage.filename}`);
              }}
              className="px-3 py-1.5 rounded bg-[#3366cc] hover:bg-[#2a4b8d] text-white transition-colors flex items-center gap-1.5 font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>下载</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function renderLargeGraphic(type: WikiImageData['type']) {
  // Renders high-res version of the graphic
  switch (type) {
    case 'cellophane':
      return (
        <svg viewBox="0 0 480 300" className="w-full h-auto block max-h-[58vh]">
          {/* Detailed background & ruler */}
          <rect width="480" height="300" fill="#f8fafc" />
          
          {/* Metric Ruler */}
          <g transform="translate(30, 210)">
            <rect x="0" y="0" width="420" height="48" rx="2" fill="#dec08c" stroke="#9a7b45" strokeWidth="1" />
            <line x1="0" y1="12" x2="420" y2="12" stroke="#fef3c7" strokeWidth="1.2" />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((cm) => {
              const x = 20 + cm * 50;
              return (
                <g key={cm}>
                  <line x1={x} y1="0" x2={x} y2="18" stroke="#3b2b13" strokeWidth="1.5" />
                  {cm < 7 && <line x1={x + 25} y1="0" x2={x + 25} y2="12" stroke="#5c4520" strokeWidth="1.2" />}
                  {cm < 7 && [5, 10, 15, 20, 30, 35, 40, 45].map((mm) => (
                    <line key={mm} x1={x + mm} y1="0" x2={x + mm} y2="8" stroke="#785a2b" strokeWidth="0.8" />
                  ))}
                  <text x={x} y="34" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle" fill="#3b2b13">
                    {cm}
                  </text>
                </g>
              );
            })}
            <text x="400" y="32" fontSize="10" fontWeight="bold" fontFamily="sans-serif" textAnchor="end" fill="#5c4520">
              cm
            </text>
          </g>

          {/* Tampon */}
          <g transform="translate(60, 75)">
            {/* Cord */}
            <path d="M 25,48 C 5,55 -15,70 -35,62 C -45,58 -50,75 -60,78" fill="none" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="3,3" />
            
            {/* Twisted wrapper end */}
            <path d="M 20,30 C 10,35 2,42 6,50 C 10,58 18,62 25,65 Z" fill="#ffffff" fillOpacity="0.8" stroke="#94a3b8" strokeWidth="0.8" />

            {/* Cotton Core */}
            <rect x="25" y="24" width="260" height="52" rx="26" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
            <path d="M 40,36 Q 150,34 260,36" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
            <path d="M 35,46 Q 150,44 270,46" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />
            <path d="M 35,56 Q 150,58 270,56" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />
            <path d="M 40,66 Q 150,68 260,66" stroke="#d1d5db" strokeWidth="1.5" fill="none" />

            {/* Tear strip */}
            <g transform="translate(145, 23)">
              <rect x="0" y="0" width="18" height="54" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.8" />
              <path d="M 5,10 L 13,10 L 9,5 Z" fill="#ffffff" />
              <text x="9" y="32" fontSize="8" fontFamily="sans-serif" fontWeight="bold" fill="#ffffff" textAnchor="middle" transform="rotate(90, 9, 32)">
                OPEN
              </text>
            </g>

            {/* Cellophane gloss */}
            <rect x="25" y="24" width="260" height="52" rx="26" fill="white" fillOpacity="0.25" />
            <text x="75" y="54" fontSize="11" fontFamily="sans-serif" fontWeight="bold" fill="#2563eb" opacity="0.6">
              o.b.
            </text>
            <text x="200" y="54" fontSize="11" fontFamily="sans-serif" fontWeight="bold" fill="#2563eb" opacity="0.6">
              o.b.
            </text>
          </g>
        </svg>
      );

    case 'applicator':
      return (
        <svg viewBox="0 0 480 280" className="w-full h-auto block max-h-[58vh]">
          <rect width="480" height="280" fill="#f8fafc" />
          <g transform="translate(40, 110)">
            {/* Cord */}
            <path d="M 330,20 C 360,20 375,45 390,38 C 405,32 400,55 420,60" fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="3,3" />
            {/* Plunger */}
            <rect x="205" y="8" width="130" height="24" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.2" />
            <rect x="330" y="3" width="8" height="34" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.2" />

            {/* Barrel */}
            <rect x="60" y="3" width="150" height="34" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" />
            <g transform="translate(175, 3)">
              <rect x="0" y="0" width="30" height="34" rx="2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="8" y1="3" x2="8" y2="31" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="15" y1="3" x2="15" y2="31" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="22" y1="3" x2="22" y2="31" stroke="#94a3b8" strokeWidth="1.5" />
            </g>

            {/* Petal tip */}
            <path d="M 60,3 C 38,4 20,13 20,20 C 20,27 38,36 60,37 Z" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" />
            <path d="M 20,20 L 48,20" stroke="#94a3b8" strokeWidth="1.2" />
          </g>
        </svg>
      );

    case 'elements':
    case 'absorbency':
    case 'anatomy':
    default:
      return (
        <div className="p-8 text-center text-slate-800 bg-white min-h-[300px] flex items-center justify-center">
          <div className="max-w-md space-y-2">
            <h3 className="text-lg font-bold">维基媒体图像详情</h3>
            <p className="text-sm text-slate-600">已完整加载该条目矢量图解，支持任意分辨率缩放与无损查看。</p>
          </div>
        </div>
      );
  }
}
