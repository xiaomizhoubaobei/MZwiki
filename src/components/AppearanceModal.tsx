import React from 'react';
import { X, Moon, Sun, Type, Maximize2, Minimize2 } from 'lucide-react';

interface AppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: (dark: boolean) => void;
  fontSize: 'small' | 'standard' | 'large';
  onChangeFontSize: (size: 'small' | 'standard' | 'large') => void;
  contentWidth: 'standard' | 'wide';
  onChangeContentWidth: (w: 'standard' | 'wide') => void;
}

export const AppearanceModal: React.FC<AppearanceModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onToggleDarkMode,
  fontSize,
  onChangeFontSize,
  contentWidth,
  onChangeContentWidth
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Card (Vector 2022 Appearance Panel) */}
      <div className={`relative w-full max-w-sm rounded-lg shadow-2xl border p-5 z-10 transition-colors ${
        isDarkMode
          ? 'bg-[#27292d] border-[#54595d] text-[#eaecf0]'
          : 'bg-white border-[#c8ccd1] text-[#202122]'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
          <div className="font-bold font-serif text-base">
            页面外观设置
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4 text-[#72777d]" />
          </button>
        </div>

        <div className="space-y-5 py-4 text-xs">
          {/* Color Mode */}
          <div>
            <div className="font-semibold text-[#72777d] uppercase tracking-wider mb-2">
              色彩布景
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onToggleDarkMode(false)}
                className={`py-2 px-3 rounded flex items-center justify-center gap-2 border font-medium transition-colors cursor-pointer ${
                  !isDarkMode
                    ? 'border-[#3366cc] bg-[#3366cc]/10 text-[#3366cc] font-bold'
                    : 'border-[#c8ccd1] hover:bg-black/5 text-[#54595d]'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>浅色（默认）</span>
              </button>

              <button
                onClick={() => onToggleDarkMode(true)}
                className={`py-2 px-3 rounded flex items-center justify-center gap-2 border font-medium transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'border-[#3366cc] bg-[#3366cc]/20 text-[#3366cc] font-bold'
                    : 'border-[#54595d] hover:bg-white/5 text-[#eaecf0]'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>深色夜间模式</span>
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <div className="font-semibold text-[#72777d] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              <span>正文字号</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'small', label: '小 (87%)' },
                { id: 'standard', label: '标准 (100%)' },
                { id: 'large', label: '大 (115%)' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => onChangeFontSize(s.id as any)}
                  className={`py-2 px-1 rounded text-center border transition-colors cursor-pointer ${
                    fontSize === s.id
                      ? 'border-[#3366cc] bg-[#3366cc]/10 text-[#3366cc] font-bold'
                      : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-[#72777d]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Width */}
          <div>
            <div className="font-semibold text-[#72777d] uppercase tracking-wider mb-2">
              正文宽度（Vector 2022）
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChangeContentWidth('standard')}
                className={`py-2 px-3 rounded flex items-center justify-center gap-2 border transition-colors cursor-pointer ${
                  contentWidth === 'standard'
                    ? 'border-[#3366cc] bg-[#3366cc]/10 text-[#3366cc] font-bold'
                    : 'border-black/10 dark:border-white/10 hover:bg-black/5 text-[#72777d]'
                }`}
              >
                <Minimize2 className="w-4 h-4" />
                <span>限制宽度（舒适阅读）</span>
              </button>

              <button
                onClick={() => onChangeContentWidth('wide')}
                className={`py-2 px-3 rounded flex items-center justify-center gap-2 border transition-colors cursor-pointer ${
                  contentWidth === 'wide'
                    ? 'border-[#3366cc] bg-[#3366cc]/10 text-[#3366cc] font-bold'
                    : 'border-black/10 dark:border-white/10 hover:bg-black/5 text-[#72777d]'
                }`}
              >
                <Maximize2 className="w-4 h-4" />
                <span>宽幅模式</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-black/5 dark:border-white/5 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#3366cc] text-white rounded font-medium hover:bg-[#2a4b8d] cursor-pointer"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
