import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  BookOpen, 
  FileText, 
  GitBranch, 
  Download, 
  Check, 
  ExternalLink,
  ChevronRight,
  ListChecks,
  Activity,
  Info
} from 'lucide-react';
import { 
  ArticleHealthReport, 
  getArticleHealthReport 
} from '../utils/articleHealthRadar';

interface ArticleHealthRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  articleId: string;
  articleTitle: string;
}

export const ArticleHealthRadarModal: React.FC<ArticleHealthRadarModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  articleId,
  articleTitle
}) => {
  const [activeTab, setActiveTab] = useState<'radar' | 'citations' | 'checklist'>('radar');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const report = getArticleHealthReport(articleId);

  // SVG Radar Polygon Chart Math
  const centerX = 120;
  const centerY = 120;
  const maxRadius = 85;

  // Background radar circles (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Calculate polygon points
  const pointsString = report.radarPolygonPoints.map(p => {
    const r = (p.score / 100) * maxRadius;
    const x = centerX + r * Math.cos(p.angle);
    const y = centerY + r * Math.sin(p.angle);
    return `${x},${y}`;
  }).join(' ');

  const handleCopyReport = () => {
    const summary = `【MZ维基 条目自动化质检与健康度报告】\n条目：${report.title}\n综合健康评分：${report.overallScore} 分 (${report.overallStatusLabel})\n各维度得分：\n${report.radarDimensions.map(d => `• ${d.name} (${d.weight * 100}%权重): ${d.score}分`).join('\n')}\n评定时间：${report.evaluatedAt}\nMZ维基自动化质检引擎 v2.6`;
    navigator.clipboard.writeText(summary);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-3xl rounded-xl shadow-2xl border overflow-hidden flex flex-col max-h-[92vh] transition-colors ${
          isDarkMode 
            ? 'bg-[#18191a] border-[#3a3d42] text-[#eaecf0]' 
            : 'bg-white border-[#c8ccd1] text-[#202122]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-xs ${
              report.overallScore >= 90
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                : report.overallScore >= 75
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
            }`}>
              <Activity className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#202122] dark:text-white">
                  条目自动化健康度与质检雷达（Article Health Radar）
                </h2>
                <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                  report.overallGrade === 'FA' 
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' 
                    : report.overallGrade === 'GA'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                }`}>
                  {report.overallScore} 分 · {report.overallGrade}
                </span>
              </div>
              <p className="text-xs text-[#72777d]">
                评估对象：<strong className="text-[#3366cc]">{report.title}</strong> · 100% 自动派生算法与维基媒体质检模型
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#72777d] hover:text-[#202122] dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-black/10 dark:border-white/10 px-4 sm:px-5 gap-2 bg-black/2 dark:bg-white/2 py-2">
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'radar'
                ? 'bg-[#3366cc] text-white shadow-xs font-semibold'
                : 'hover:bg-black/5 dark:hover:bg-white/10 text-[#54595d] dark:text-[#a2a9b1]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>五维雷达透视</span>
          </button>

          <button
            onClick={() => setActiveTab('citations')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'citations'
                ? 'bg-[#3366cc] text-white shadow-xs font-semibold'
                : 'hover:bg-black/5 dark:hover:bg-white/10 text-[#54595d] dark:text-[#a2a9b1]'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>来源请求诊断</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10">
              {report.citationNeededDiagnostics.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'checklist'
                ? 'bg-[#3366cc] text-white shadow-xs font-semibold'
                : 'hover:bg-black/5 dark:hover:bg-white/10 text-[#54595d] dark:text-[#a2a9b1]'
            }`}
          >
            <ListChecks className="w-3.5 h-3.5" />
            <span>扩充建议清单</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10">
              {report.expansionChecklist.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* TAB 1: Radar Dimensions */}
          {activeTab === 'radar' && (
            <div className="space-y-5">
              
              {/* Top Overview: Radar SVG Graphic + Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                
                {/* SVG Radar Chart Visual (5 cols) */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-3 rounded-xl border border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2">
                  <svg width="240" height="240" viewBox="0 0 240 240" className="overflow-visible select-none">
                    {/* Background grid concentric circles */}
                    {gridLevels.map((lvl, idx) => (
                      <circle
                        key={idx}
                        cx={centerX}
                        cy={centerY}
                        r={maxRadius * lvl}
                        fill="none"
                        stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}
                        strokeDasharray={idx === gridLevels.length - 1 ? undefined : '2,2'}
                      />
                    ))}

                    {/* 5 Axis lines */}
                    {report.radarPolygonPoints.map((p, idx) => {
                      const ax = centerX + maxRadius * Math.cos(p.angle);
                      const ay = centerY + maxRadius * Math.sin(p.angle);
                      return (
                        <line
                          key={idx}
                          x1={centerX}
                          y1={centerY}
                          x2={ax}
                          y2={ay}
                          stroke={isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}
                        />
                      );
                    })}

                    {/* Data Filled Polygon */}
                    <polygon
                      points={pointsString}
                      fill="rgba(51, 102, 204, 0.28)"
                      stroke="#3366cc"
                      strokeWidth="2.5"
                    />

                    {/* Data Points and Axis Labels */}
                    {report.radarPolygonPoints.map((p, idx) => {
                      const r = (p.score / 100) * maxRadius;
                      const dotX = centerX + r * Math.cos(p.angle);
                      const dotY = centerY + r * Math.sin(p.angle);

                      // Label position (slightly outside radius)
                      const labelRadius = maxRadius + 22;
                      const labelX = centerX + labelRadius * Math.cos(p.angle);
                      const labelY = centerY + labelRadius * Math.sin(p.angle);

                      return (
                        <g key={idx}>
                          <circle
                            cx={dotX}
                            cy={dotY}
                            r="4"
                            fill="#3366cc"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                          <text
                            x={labelX}
                            y={labelY}
                            fontSize="10"
                            fontWeight="bold"
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill={isDarkMode ? '#eaecf0' : '#202122'}
                          >
                            {p.dimension}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  <div className="mt-2 text-center text-[10px] text-[#72777d]">
                    五维自动化平衡模型（标准化满分 100）
                  </div>
                </div>

                {/* Score & Verdict Card (7 cols) */}
                <div className="md:col-span-7 space-y-3">
                  <div className={`p-4 rounded-xl border space-y-2 ${
                    isDarkMode ? 'bg-[#1f2023] border-[#3a3d42]' : 'bg-[#f8f9fa] border-[#c8ccd1]'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#72777d]">综合质量评定结论</span>
                      <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                        评定于 {report.evaluatedAt}
                      </span>
                    </div>

                    <div className="text-2xl font-serif font-bold text-[#202122] dark:text-white flex items-center gap-2">
                      <span>{report.overallScore}</span>
                      <span className="text-sm font-sans font-normal text-[#72777d]">/ 100 分</span>
                      <span className="text-sm font-sans font-semibold text-[#059669] dark:text-[#34d399] ml-2">
                        {report.overallStatusLabel}
                      </span>
                    </div>

                    <p className="text-xs text-[#54595d] dark:text-[#a2a9b1] leading-relaxed">
                      {report.summaryFeedback}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded border border-black/5 dark:border-white/5 space-y-0.5">
                      <div className="text-[10px] text-[#72777d]">实证文献合规度</div>
                      <div className="font-bold text-sm text-[#202122] dark:text-white">100% 同行评审</div>
                    </div>
                    <div className="p-2.5 rounded border border-black/5 dark:border-white/5 space-y-0.5">
                      <div className="text-[10px] text-[#72777d]">临床免责声明</div>
                      <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">已完整合规关联</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* 5 Dimensions Detailed Breakdown List */}
              <div className="space-y-3 pt-2">
                <div className="font-semibold text-xs text-[#202122] dark:text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#3366cc]" />
                  <span>分项质检指标与基准对齐（Dimension Metrics）</span>
                </div>

                <div className="space-y-2.5">
                  {report.radarDimensions.map(d => (
                    <div 
                      key={d.key}
                      className="p-3 rounded-lg border border-black/5 dark:border-white/5 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-medium text-[#202122] dark:text-white">
                          <span className="font-bold">{d.name}</span>
                          <span className="text-[10px] text-[#72777d]">
                            (权重 {d.weight * 100}%)
                          </span>
                        </div>
                        <div className="font-mono text-xs font-bold text-[#3366cc]">
                          {d.score} 分
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-[#3366cc] transition-all duration-500"
                          style={{ width: `${d.score}%` }}
                        />
                      </div>

                      {/* Benchmarks tags */}
                      <div className="flex items-center gap-2 flex-wrap text-[11px] pt-1">
                        {d.metrics.map((m, idx) => (
                          <div 
                            key={idx}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${
                              m.passed
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            <span>{m.label}: <strong>{m.value}</strong></span>
                            <span className="opacity-60">({m.benchmark})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Citation Needed Scanner */}
          {activeTab === 'citations' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 text-xs text-[#54595d] dark:text-[#a2a9b1] space-y-1">
                <div className="font-semibold text-[#202122] dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#3366cc]" />
                  <span>自动化「来源请求 (Citation Needed)」扫描机制说明</span>
                </div>
                <p>
                  算法自动扫描正文中的医学发生率、生理数据、临床疗效与实验断言。若陈述缺乏权威文献标号，将触发质检诊断提示，协助编修者迅速补全引证。
                </p>
              </div>

              {report.citationNeededDiagnostics.length === 0 ? (
                <div className="p-8 text-center space-y-2 border border-black/5 dark:border-white/5 rounded-lg">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <div className="font-semibold text-sm text-[#202122] dark:text-white">
                    全篇无遗漏来源请求！学术实证完整
                  </div>
                  <p className="text-xs text-[#72777d]">
                    正文全部医学断言均已妥善配置同行评议文献或国际监管批号。
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {report.citationNeededDiagnostics.map((diag) => (
                    <div 
                      key={diag.id}
                      className="p-3.5 rounded-lg border border-black/10 dark:border-white/10 space-y-2 bg-black/2 dark:bg-white/2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#202122] dark:text-white flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          <span>所在章节：{diag.sectionTitle}</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          diag.severity === 'high' 
                            ? 'bg-red-500/10 text-red-600' 
                            : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {diag.issueType}
                        </span>
                      </div>

                      <div className="p-2 rounded bg-black/5 dark:bg-white/5 font-mono text-[11px] text-[#54595d] dark:text-[#a2a9b1]">
                        "{diag.statementSnippet}"
                      </div>

                      <div className="text-[11px] space-y-0.5">
                        <div className="text-[#72777d]">{diag.reason}</div>
                        <div className="text-[#3366cc] font-medium">💡 建议操作：{diag.suggestedAction}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Expansion Checklist */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="text-xs text-[#72777d]">
                依据《维基百科条目质量评审指引》自动规划的进阶优化行动清单：
              </div>

              <div className="space-y-2.5">
                {report.expansionChecklist.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-3 rounded-lg border flex items-start justify-between gap-3 transition-colors ${
                      item.completed 
                        ? 'border-emerald-500/30 bg-emerald-500/5' 
                        : 'border-black/10 dark:border-white/10 bg-black/2 dark:bg-white/2'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[#202122] dark:text-white">
                          {item.title}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                          item.priority === 'high' 
                            ? 'bg-red-500/10 text-red-600' 
                            : 'bg-blue-500/10 text-blue-600'
                        }`}>
                          {item.priority === 'high' ? '高优先级' : '进阶建议'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#72777d]">
                        {item.description}
                      </p>
                    </div>

                    <div className="shrink-0 pt-0.5">
                      {item.completed ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>已达标</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-medium">
                          待优化
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs bg-black/2 dark:bg-white/2">
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/10"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <FileText className="w-3.5 h-3.5" />}
            <span>{isCopied ? '质检摘要已复制！' : '复制质检报告摘要'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#3366cc] hover:bg-[#2a4b8d] text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            完成查看
          </button>
        </div>

      </div>
    </div>
  );
};
