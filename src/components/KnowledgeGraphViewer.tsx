import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Search,
  Info,
  ExternalLink,
  Layers,
  Play,
  Pause,
  Share2,
  BookOpen,
  X,
  Compass,
  ArrowRight,
  Filter,
  Eye,
  Sliders,
  Sparkles,
  GitBranch,
  Tag
} from 'lucide-react';
import {
  GraphNode,
  GraphEdge,
  GraphCategory,
  GRAPH_NODES,
  GRAPH_EDGES,
  GRAPH_CATEGORIES
} from '../data/knowledgeGraphData';
import {
  generateAutomatedTopology,
  AutomatedGraphEdge,
  AutomatedGraphNode
} from '../utils/graphTopologyAutomation';
import { getPopularTags } from '../data/tagsData';
import { EntityImagePreview } from './EntityImagePreview';

interface KnowledgeGraphViewerProps {
  isDarkMode: boolean;
  onNavigateArticle?: (sectionId?: string) => void;
  onNavigateCategory?: () => void;
  onNavigateWikiTerm?: (term: string) => void;
  onNavigateTags?: (tag?: string) => void;
  initialSelectedNodeId?: string;
  initialTagFilter?: string;
  className?: string;
}

export const KnowledgeGraphViewer: React.FC<KnowledgeGraphViewerProps> = ({
  isDarkMode,
  onNavigateArticle,
  onNavigateCategory,
  onNavigateWikiTerm,
  onNavigateTags,
  initialSelectedNodeId = 'tampon',
  initialTagFilter,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Topology Automation Mode
  const [topologyMode, setTopologyMode] = useState<'automated' | 'curated'>('automated');
  const [minSharedTags] = useState<number>(1);

  // Layout mode
  const [layoutMode, setLayoutMode] = useState<'force' | 'concentric' | 'list'>('force');
  const [selectedCategoryId, setSelectedCategoryId] = useState<GraphCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialSelectedNodeId);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(initialTagFilter || null);
  const [isTagDrawerOpen, setIsTagDrawerOpen] = useState<boolean>(Boolean(initialTagFilter));
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPhysicsActive, setIsPhysicsActive] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  // Popular Tags for quick filtering
  const popularTags = useMemo(() => getPopularTags(14), []);

  // Pan & Zoom state
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const isDraggingCanvas = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Node Dragging state
  const draggedNodeRef = useRef<GraphNode | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // Nodes simulation mutable state
  const nodesRef = useRef<AutomatedGraphNode[]>([]);
  const [, setTick] = useState(0);

  // Automated Topology Generation
  const automatedTopology = useMemo(() => {
    return generateAutomatedTopology({
      includeCoTagEdges: topologyMode === 'automated',
      includeMentionEdges: topologyMode === 'automated',
      minSharedTags,
      activeTagFilter: selectedTagFilter
    });
  }, [topologyMode, minSharedTags, selectedTagFilter]);

  const activeEdges: AutomatedGraphEdge[] = automatedTopology.edges;
  const activeTopologyStats = automatedTopology.stats;

  // Category Color Map
  const categoryColorMap = useMemo(() => {
    const map: Record<string, { color: string; darkColor: string }> = {};
    GRAPH_CATEGORIES.forEach(c => {
      map[c.key] = { color: c.color, darkColor: c.darkColor };
    });
    return map;
  }, []);

  // Initialize node positions
  useEffect(() => {
    const width = 1000;
    const height = 650;
    const center = { x: width / 2, y: height / 2 };

    const initialNodes = automatedTopology.nodes.map((node, i) => {
      // If concentric mode or initial seed
      const angle = (i / automatedTopology.nodes.length) * 2 * Math.PI;
      const radius = node.id === 'tampon' ? 0 : node.category === 'product' ? 170 : 260 + (i % 3) * 35;
      return {
        ...node,
        x: center.x + Math.cos(angle) * radius + (Math.random() - 0.5) * 40,
        y: center.y + Math.sin(angle) * radius + (Math.random() - 0.5) * 40,
        vx: 0,
        vy: 0,
        fx: null,
        fy: null
      };
    });

    nodesRef.current = initialNodes;
    setTick(t => t + 1);
  }, []);

  // Sync node properties when topology updates without resetting x/y positions
  useEffect(() => {
    if (nodesRef.current.length === 0) return;
    const nodeDataMap = new Map(automatedTopology.nodes.map(n => [n.id, n]));
    nodesRef.current = nodesRef.current.map(n => {
      const updated = nodeDataMap.get(n.id);
      return updated ? { ...n, ...updated, x: n.x, y: n.y, vx: n.vx, vy: n.vy } : n;
    });
    setTick(t => t + 1);
  }, [automatedTopology]);

  // Physics Force Simulation Loop
  useEffect(() => {
    if (!isPhysicsActive || layoutMode !== 'force') return;

    let animId: number;
    const width = 1000;
    const height = 650;
    const cx = width / 2;
    const cy = height / 2;

    const runPhysicsStep = () => {
      const nodes = nodesRef.current;
      if (!nodes.length) return;

      // 1. Repulsion between all pairs
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = (n1.x || cx) - (n2.x || cx);
          const dy = (n1.y || cy) - (n2.y || cy);
          const distSq = dx * dx + dy * dy || 1;
          const dist = Math.sqrt(distSq);

          if (dist < 400) {
            const force = 3200 / (distSq + 100);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (n1.fx === null || n1.fx === undefined) {
              n1.vx = (n1.vx || 0) + fx;
              n1.vy = (n1.vy || 0) + fy;
            }
            if (n2.fx === null || n2.fx === undefined) {
              n2.vx = (n2.vx || 0) - fx;
              n2.vy = (n2.vy || 0) - fy;
            }
          }
        }
      }

      // 2. Spring attraction along edges
      const nodeMap = new Map(nodes.map(n => [n.id, n]));
      for (const edge of activeEdges) {
        const s = nodeMap.get(edge.source);
        const t = nodeMap.get(edge.target);
        if (s && t) {
          const dx = (t.x || cx) - (s.x || cx);
          const dy = (t.y || cy) - (s.y || cy);
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDist = edge.type === 'primary' ? 120 : 160;
          const spring = (dist - targetDist) * 0.035;

          const fx = (dx / dist) * spring;
          const fy = (dy / dist) * spring;

          if (s.fx === null || s.fx === undefined) {
            s.vx = (s.vx || 0) + fx;
            s.vy = (s.vy || 0) + fy;
          }
          if (t.fx === null || t.fx === undefined) {
            t.vx = (t.vx || 0) - fx;
            t.vy = (t.vy || 0) - fy;
          }
        }
      }

      // 3. Center gravity & Damping velocity
      const damping = 0.88;
      for (const n of nodes) {
        if (n.fx !== null && n.fx !== undefined) {
          n.x = n.fx;
          n.y = n.fy!;
          n.vx = 0;
          n.vy = 0;
          continue;
        }

        // Weak gravity to center
        const toCenterX = cx - (n.x || cx);
        const toCenterY = cy - (n.y || cy);
        n.vx = ((n.vx || 0) + toCenterX * 0.003) * damping;
        n.vy = ((n.vy || 0) + toCenterY * 0.003) * damping;

        n.x = (n.x || cx) + n.vx;
        n.y = (n.y || cy) + n.vy;

        // Keep inside soft boundaries
        n.x = Math.max(60, Math.min(width - 60, n.x));
        n.y = Math.max(60, Math.min(height - 60, n.y));
      }

      setTick(t => (t + 1) % 100000);
      animId = requestAnimationFrame(runPhysicsStep);
    };

    animId = requestAnimationFrame(runPhysicsStep);
    return () => cancelAnimationFrame(animId);
  }, [isPhysicsActive, layoutMode]);

  // Concentric circle layout computation
  useEffect(() => {
    if (layoutMode === 'concentric') {
      const width = 1000;
      const height = 650;
      const cx = width / 2;
      const cy = height / 2;

      // Group nodes into rings: Core (0), Products/Medical (1), Others (2)
      const ring0 = nodesRef.current.filter(n => n.id === 'tampon');
      const ring1 = nodesRef.current.filter(n => ['product', 'medical'].includes(n.category) && n.id !== 'tampon');
      const ring2 = nodesRef.current.filter(n => !['product', 'medical'].includes(n.category) && n.id !== 'tampon');

      ring0.forEach(n => {
        n.x = cx;
        n.y = cy;
      });

      ring1.forEach((n, idx) => {
        const angle = (idx / ring1.length) * 2 * Math.PI - Math.PI / 2;
        n.x = cx + Math.cos(angle) * 160;
        n.y = cy + Math.sin(angle) * 160;
      });

      ring2.forEach((n, idx) => {
        const angle = (idx / ring2.length) * 2 * Math.PI - Math.PI / 2;
        n.x = cx + Math.cos(angle) * 280;
        n.y = cy + Math.sin(angle) * 280;
      });

      setTick(t => t + 1);
    }
  }, [layoutMode]);

  // Map of nodes by ID for fast lookup
  const nodeLookup = useMemo(() => {
    const map = new Map<string, GraphNode>();
    nodesRef.current.forEach(n => map.set(n.id, n));
    return map;
  }, [nodesRef.current]);

  // Filtered nodes based on category, search query, and active tag filter
  const filteredNodes = useMemo(() => {
    return nodesRef.current.filter(node => {
      const matchCat = selectedCategoryId === 'all' || node.category === selectedCategoryId;
      const matchQuery = !searchQuery.trim() ||
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (node.pinyin && node.pinyin.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (node.tags && node.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchTag = !selectedTagFilter || (node.tags && node.tags.includes(selectedTagFilter));
      return matchCat && matchQuery && matchTag;
    });
  }, [selectedCategoryId, searchQuery, selectedTagFilter]);

  // Active / connected node IDs for highlighting on hover or select
  const activeFocusId = hoveredNodeId || selectedNodeId;

  const connectedInfo = useMemo(() => {
    if (!activeFocusId) return { neighborIds: new Set<string>(), edgeIds: new Set<string>() };

    const neighborIds = new Set<string>([activeFocusId]);
    const edgeIds = new Set<string>();

    activeEdges.forEach(edge => {
      if (edge.source === activeFocusId) {
        neighborIds.add(edge.target);
        edgeIds.add(edge.id);
      } else if (edge.target === activeFocusId) {
        neighborIds.add(edge.source);
        edgeIds.add(edge.id);
      }
    });

    return { neighborIds, edgeIds };
  }, [activeFocusId, activeEdges]);

  // Currently selected node object
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodeLookup.get(selectedNodeId) || null;
  }, [selectedNodeId, nodeLookup]);

  // Direct connected edges for detail drawer
  const selectedNodeEdges = useMemo(() => {
    if (!selectedNodeId) return [];
    return activeEdges.filter(e => e.source === selectedNodeId || e.target === selectedNodeId).map(edge => {
      const isOutbound = edge.source === selectedNodeId;
      const otherNodeId = isOutbound ? edge.target : edge.source;
      const otherNode = nodeLookup.get(otherNodeId);
      return {
        edge,
        isOutbound,
        otherNode
      };
    });
  }, [selectedNodeId, nodeLookup, activeEdges]);

  // Zoom handlers
  const handleZoom = (factor: number) => {
    setTransform(prev => {
      const newK = Math.max(0.4, Math.min(2.8, prev.k * factor));
      return { ...prev, k: newK };
    });
  };

  const handleResetView = () => {
    setTransform({ x: 0, y: 0, k: 1 });
  };

  // Center on a specific node
  const handleFocusNode = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    const target = nodeLookup.get(nodeId);
    if (target && target.x && target.y) {
      const width = 1000;
      const height = 650;
      // Center target node in view with slight offset for right detail panel
      const targetX = width / 2 - target.x;
      const targetY = height / 2 - target.y;
      setTransform({ x: targetX * 1.1, y: targetY * 1.1, k: 1.15 });
    }
  }, [nodeLookup]);

  // Canvas Drag / Pan
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName !== 'svg' && !(e.target as HTMLElement).classList.contains('canvas-bg')) {
      return;
    }
    isDraggingCanvas.current = true;
    dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas.current) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      }));
    } else if (draggedNodeRef.current && svgRef.current) {
      // Calculate coordinates relative to SVG
      const rect = svgRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - transform.x) / transform.k;
      const mouseY = (e.clientY - rect.top - transform.y) / transform.k;
      draggedNodeRef.current.fx = mouseX;
      draggedNodeRef.current.fy = mouseY;
      draggedNodeRef.current.x = mouseX;
      draggedNodeRef.current.y = mouseY;
      setTick(t => t + 1);
    }
  };

  const handleCanvasMouseUp = () => {
    isDraggingCanvas.current = false;
    if (draggedNodeRef.current) {
      draggedNodeRef.current.fx = null;
      draggedNodeRef.current.fy = null;
      draggedNodeRef.current = null;
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.08 : 0.92;
    handleZoom(factor);
  };

  // Node Drag Start
  const handleNodeMouseDown = (node: GraphNode, e: React.MouseEvent) => {
    e.stopPropagation();
    draggedNodeRef.current = node;
    node.fx = node.x;
    node.fy = node.y;
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col rounded-lg border transition-all ${
        isDarkMode
          ? 'bg-[#18191a] border-[#54595d] text-[#eaecf0]'
          : 'bg-[#fcfcfd] border-[#c8ccd1] text-[#202122]'
      } ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'w-full min-h-[680px]'
      } ${className}`}
    >
      {/* 1. TOP TOOLBAR: Search, Category Filters, Layout Mode, Actions */}
      <div className={`p-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs z-10 transition-colors ${
        isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-white border-[#c8ccd1]'
      }`}>
        {/* Left: Title & Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-sm text-[#202122] dark:text-white">
            <GitBranch className="w-4 h-4 text-[#3366cc] dark:text-[#6699ff]" />
            <span>知识图谱可视化</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#72777d] font-mono">
            <span>{GRAPH_NODES.length} 实体</span>
            <span>·</span>
            <span>{activeEdges.length} 拓扑连线</span>
            {topologyMode === 'automated' && (
              <>
                <span>·</span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>自动推导 +{activeTopologyStats.coTagEdgeCount + activeTopologyStats.mentionEdgeCount}</span>
                </span>
              </>
            )}
            <span>·</span>
            <span className="text-[#3366cc] dark:text-[#6699ff]">
              {selectedNode ? `当前聚焦：${selectedNode.name}` : '全域实体拓扑网络'}
            </span>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="relative flex-1 max-w-xs min-w-[180px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#72777d]" />
          <input
            type="text"
            placeholder="搜索全域词条与实体 (如 卫生巾、TSS、哈斯...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-8 pr-7 py-1.5 rounded text-xs border focus:outline-none focus:ring-1 focus:ring-[#3366cc] transition-colors ${
              isDarkMode
                ? 'bg-[#151617] border-[#54595d] text-[#eaecf0] placeholder-[#72777d]'
                : 'bg-[#f8f9fa] border-[#c8ccd1] text-[#202122] placeholder-[#a2a9b1]'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#72777d] hover:text-[#202122] dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Topology Mode, Layout Switcher & Action Controls */}
        <div className="flex items-center gap-2">
          {/* Topology Automation Switcher */}
          <button
            onClick={() => setTopologyMode(m => m === 'automated' ? 'curated' : 'automated')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 border shadow-xs ${
              topologyMode === 'automated'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold'
                : 'bg-black/5 dark:bg-white/5 text-[#54595d] dark:text-[#a2a9b1] border-transparent hover:border-black/10'
            }`}
            title="点击切换：全自动化推导网络（共现标签+正文引用）或 核心人工核定网络"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{topologyMode === 'automated' ? `智能拓扑 (${activeEdges.length}边)` : `人工精选 (33边)`}</span>
          </button>

          {/* Layout Mode Segmented Control */}
          <div className={`p-0.5 rounded border flex items-center ${
            isDarkMode ? 'bg-[#151617] border-[#54595d]' : 'bg-[#eaecf0] border-[#c8ccd1]'
          }`}>
            <button
              onClick={() => setLayoutMode('force')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                layoutMode === 'force'
                  ? 'bg-white dark:bg-[#2c3036] text-[#3366cc] dark:text-[#6699ff] shadow-xs'
                  : 'text-[#72777d] hover:text-[#202122] dark:hover:text-white'
              }`}
              title="力导向网络拓扑视图"
            >
              力导向图
            </button>
            <button
              onClick={() => setLayoutMode('concentric')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                layoutMode === 'concentric'
                  ? 'bg-white dark:bg-[#2c3036] text-[#3366cc] dark:text-[#6699ff] shadow-xs'
                  : 'text-[#72777d] hover:text-[#202122] dark:hover:text-white'
              }`}
              title="同心环聚类视图"
            >
              同心环
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                layoutMode === 'list'
                  ? 'bg-white dark:bg-[#2c3036] text-[#3366cc] dark:text-[#6699ff] shadow-xs'
                  : 'text-[#72777d] hover:text-[#202122] dark:hover:text-white'
              }`}
              title="实体与关系矩阵列表"
            >
              列表矩阵
            </button>
          </div>

          {/* Physics Play/Pause (Only for force mode) */}
          {layoutMode === 'force' && (
            <button
              onClick={() => setIsPhysicsActive(!isPhysicsActive)}
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                isPhysicsActive
                  ? 'text-[#3366cc] border-[#3366cc]/30 bg-[#3366cc]/5'
                  : 'text-[#72777d] border-black/10 dark:border-white/10'
              }`}
              title={isPhysicsActive ? '暂停力导向物理推演' : '恢复物理碰撞推演'}
            >
              {isPhysicsActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={handleToggleFullscreen}
            className={`p-1.5 rounded border transition-colors cursor-pointer ${
              isFullscreen
                ? 'bg-[#3366cc] text-white border-[#3366cc]'
                : 'text-[#72777d] hover:text-[#202122] dark:hover:text-white border-black/10 dark:border-white/10'
            }`}
            title={isFullscreen ? '退出全屏' : '全屏探索模式'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. SECONDARY FILTER & TAGS BAR */}
      <div className={`px-3 py-1.5 border-b flex flex-wrap items-center justify-between gap-2 text-[11px] select-none transition-colors ${
        isDarkMode ? 'bg-[#1d1f21] border-[#54595d]' : 'bg-[#f8f9fa] border-[#c8ccd1]'
      }`}>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 max-w-full">
          <span className="text-[#72777d] font-medium shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>分类:</span>
          </span>
          {GRAPH_CATEGORIES.map(cat => {
            const isSelected = selectedCategoryId === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategoryId(cat.key)}
                className={`px-2.5 py-0.5 rounded-full font-medium transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-[#3366cc] text-white border-[#3366cc] shadow-xs'
                    : isDarkMode
                      ? 'border-[#3a3d42] text-[#a2a9b1] hover:bg-white/5'
                      : 'border-[#c8ccd1] text-[#54595d] hover:bg-black/5'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: isSelected ? '#ffffff' : (isDarkMode ? cat.darkColor : cat.color) }}
                />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tag filter toggle and shortcuts */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          <button
            onClick={() => setIsTagDrawerOpen(!isTagDrawerOpen)}
            className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 border ${
              isTagDrawerOpen || selectedTagFilter
                ? 'bg-[#3366cc] text-white border-[#3366cc] shadow-xs'
                : isDarkMode
                  ? 'border-[#3a3d42] text-[#a2a9b1] hover:bg-white/5'
                  : 'border-[#c8ccd1] text-[#54595d] hover:bg-black/5'
            }`}
          >
            <Tag className="w-3 h-3" />
            <span>标签系统{selectedTagFilter ? ` (#${selectedTagFilter})` : ''}</span>
          </button>

          {selectedTagFilter && (
            <button
              onClick={() => setSelectedTagFilter(null)}
              className="px-1.5 py-0.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] cursor-pointer flex items-center gap-0.5"
              title="清除标签筛选"
            >
              <X className="w-3 h-3" />
              <span>清除</span>
            </button>
          )}

          {onNavigateTags && (
            <button
              onClick={() => onNavigateTags(selectedTagFilter || undefined)}
              className="text-[#3366cc] dark:text-[#6699ff] hover:underline flex items-center gap-0.5 cursor-pointer ml-1 text-[11px] font-medium"
              title="前往全域标签与主题索引页面"
            >
              <span>标签索引 »</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Tag Cloud Bar */}
      {isTagDrawerOpen && (
        <div className={`px-3 py-2 border-b flex flex-wrap items-center gap-1.5 text-xs transition-colors ${
          isDarkMode ? 'bg-[#18191a] border-[#54595d]' : 'bg-white border-[#c8ccd1]'
        }`}>
          <span className="text-[11px] text-[#72777d] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-[#e67e22]" />
            <span>热门标签快速过滤：</span>
          </span>
          {popularTags.map(tag => {
            const isTagActive = selectedTagFilter === tag.name;
            return (
              <button
                key={tag.name}
                onClick={() => setSelectedTagFilter(isTagActive ? null : tag.name)}
                className={`px-2 py-0.5 rounded-full text-[11px] transition-all cursor-pointer border flex items-center gap-1 ${
                  isTagActive
                    ? 'bg-[#3366cc] text-white border-[#3366cc] shadow-xs font-semibold'
                    : isDarkMode
                      ? 'bg-[#151617] border-[#3a3d42] text-[#eaecf0] hover:border-[#6699ff]/50'
                      : 'bg-[#f8f9fa] border-[#e5e7eb] text-[#202122] hover:border-[#3366cc]/50'
                }`}
              >
                <Tag className="w-2.5 h-2.5 opacity-70" />
                <span>#{tag.name}</span>
                <span className="text-[9px] opacity-70 font-mono">({tag.count})</span>
              </button>
            );
          })}
          {onNavigateTags && (
            <button
              onClick={() => onNavigateTags(selectedTagFilter || undefined)}
              className="text-[11px] text-[#3366cc] dark:text-[#6699ff] hover:underline ml-auto font-medium cursor-pointer"
            >
              查看全部 58 个标签 »
            </button>
          )}
        </div>
      )}

      {/* 3. GRAPH CANVAS AREA & DETAIL DRAWER */}
      <div className="relative flex-1 w-full min-h-[560px] overflow-hidden flex">
        {layoutMode !== 'list' ? (
          /* SVG Force/Concentric Interactive Canvas */
          <div
            className="canvas-bg relative flex-1 h-full w-full cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onWheel={handleWheel}
          >
            {/* Background Grid Pattern */}
            <svg
              ref={svgRef}
              className="w-full h-full"
              viewBox="0 0 1000 650"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke={isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}
                    strokeWidth="1"
                  />
                </pattern>

                {/* Arrow markers for directed edges */}
                <marker
                  id="arrow-primary"
                  viewBox="0 -5 10 10"
                  refX="22"
                  refY="0"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M0,-4L10,0L0,4" fill={isDarkMode ? '#6699ff' : '#3366cc'} opacity="0.6" />
                </marker>
                <marker
                  id="arrow-medical"
                  viewBox="0 -5 10 10"
                  refX="22"
                  refY="0"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M0,-4L10,0L0,4" fill={isDarkMode ? '#f87171' : '#dc2626'} opacity="0.6" />
                </marker>
                <marker
                  id="arrow-dimmed"
                  viewBox="0 -5 10 10"
                  refX="22"
                  refY="0"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M0,-4L10,0L0,4" fill={isDarkMode ? '#54595d' : '#c8ccd1'} opacity="0.25" />
                </marker>
              </defs>

              {/* Background Rect for catching click */}
              <rect width="100%" height="100%" fill="url(#graph-grid)" />

              {/* Main Transformed Group (Pan & Zoom) */}
              <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>

                {/* 1. EDGES / RELATION LINES */}
                <g className="edges-layer">
                  {activeEdges.map(edge => {
                    const sourceNode = nodeLookup.get(edge.source);
                    const targetNode = nodeLookup.get(edge.target);
                    if (!sourceNode || !targetNode || sourceNode.x === undefined || sourceNode.y === undefined || targetNode.x === undefined || targetNode.y === undefined) {
                      return null;
                    }

                    const isConnected = connectedInfo.edgeIds.has(edge.id);
                    const isHovered = hoveredEdgeId === edge.id;
                    const isDimmed = activeFocusId && !isConnected;

                    // Edge color
                    const strokeColor = isHovered || isConnected
                      ? (edge.type === 'medical' ? '#dc2626' : edge.origin === 'co-tag' ? '#9333ea' : isDarkMode ? '#6699ff' : '#3366cc')
                      : (isDarkMode ? '#4a4d52' : '#d2d6dc');

                    const strokeWidth = isHovered || isConnected ? 2.4 : (edge.origin === 'co-tag' || edge.origin === 'mention') ? 1.0 : 1.3;
                    const strokeOpacity = isDimmed ? 0.12 : (isConnected ? 0.9 : (edge.origin === 'curated' ? 0.55 : 0.4));
                    const strokeDash = edge.type === 'contrast' ? '4 3' : edge.origin === 'co-tag' ? '4 3' : edge.origin === 'mention' ? '2 2' : undefined;

                    // Midpoint for relationship label
                    const midX = (sourceNode.x + targetNode.x) / 2;
                    const midY = (sourceNode.y + targetNode.y) / 2;

                    return (
                      <g
                        key={edge.id}
                        onMouseEnter={() => setHoveredEdgeId(edge.id)}
                        onMouseLeave={() => setHoveredEdgeId(null)}
                        className="transition-opacity duration-150 cursor-pointer"
                      >
                        {/* Interactive fat line for easy hover */}
                        <line
                          x1={sourceNode.x}
                          y1={sourceNode.y}
                          x2={targetNode.x}
                          y2={targetNode.y}
                          stroke="transparent"
                          strokeWidth="14"
                        />
                        {/* Visible Line */}
                        <line
                          x1={sourceNode.x}
                          y1={sourceNode.y}
                          x2={targetNode.x}
                          y2={targetNode.y}
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          strokeOpacity={strokeOpacity}
                          strokeDasharray={strokeDash}
                          markerEnd={isDimmed ? 'url(#arrow-dimmed)' : (edge.type === 'medical' ? 'url(#arrow-medical)' : 'url(#arrow-primary)')}
                        />

                        {/* Edge Label (Show when hovered or connected to active node) */}
                        {(isHovered || isConnected || isFullscreen) && (
                          <g transform={`translate(${midX}, ${midY})`} className="pointer-events-none">
                            <rect
                              x={-edge.relation.length * 5 - 4}
                              y="-9"
                              width={edge.relation.length * 10 + 8}
                              height="18"
                              rx="4"
                              fill={isDarkMode ? '#202122' : '#ffffff'}
                              stroke={isHovered ? strokeColor : (isDarkMode ? '#54595d' : '#c8ccd1')}
                              strokeWidth="1"
                              opacity={isDimmed ? 0.2 : 0.95}
                            />
                            <text
                              y="3"
                              textAnchor="middle"
                              fontSize="10"
                              fontFamily="sans-serif"
                              fill={isHovered || isConnected ? (isDarkMode ? '#eaecf0' : '#202122') : '#72777d'}
                              fontWeight={isHovered || isConnected ? '600' : 'normal'}
                              opacity={isDimmed ? 0.3 : 1}
                            >
                              {edge.relation}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* 2. NODES / ENTITY CIRCLES */}
                <g className="nodes-layer">
                  {nodesRef.current.map(node => {
                    if (node.x === undefined || node.y === undefined) return null;

                    const isSelected = selectedNodeId === node.id;
                    const isHovered = hoveredNodeId === node.id;
                    const isConnected = connectedInfo.neighborIds.has(node.id);
                    const isDimmed = activeFocusId && !isConnected;

                    // Match category filter or search
                    const isMatchedBySearch = searchQuery.trim() && (
                      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (node.pinyin && node.pinyin.toLowerCase().includes(searchQuery.toLowerCase()))
                    );

                    const catColors = categoryColorMap[node.category] || { color: '#3366cc', darkColor: '#6699ff' };
                    const nodeBaseColor = isDarkMode ? catColors.darkColor : catColors.color;

                    const effectiveVal = node.computedVal || node.val || 16;
                    const radius = Math.max(14, effectiveVal * 0.72);

                    return (
                      <g
                        key={node.id}
                        transform={`translate(${node.x}, ${node.y})`}
                        onMouseDown={(e) => handleNodeMouseDown(node, e)}
                        onClick={() => setSelectedNodeId(node.id)}
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        className="cursor-pointer transition-opacity duration-150"
                        style={{ opacity: isDimmed ? 0.2 : 1 }}
                      >
                        {/* Search match pulsating ring */}
                        {isMatchedBySearch && (
                          <circle
                            r={radius + 8}
                            fill="none"
                            stroke="#eab308"
                            strokeWidth="2.5"
                            className="animate-ping opacity-75"
                          />
                        )}

                        {/* Outer Selection / Hover Halo */}
                        {(isSelected || isHovered) && (
                          <circle
                            r={radius + 6}
                            fill="none"
                            stroke={nodeBaseColor}
                            strokeWidth="2.5"
                            strokeDasharray={isSelected ? undefined : '3 2'}
                            opacity="0.8"
                          />
                        )}

                        {/* Node Main Circle */}
                        <circle
                          r={radius}
                          fill={isDarkMode ? '#202122' : '#ffffff'}
                          stroke={nodeBaseColor}
                          strokeWidth={isSelected ? 3.5 : 2.5}
                          className="shadow-sm transition-transform hover:scale-105"
                        />

                        {/* Center Color Core */}
                        <circle
                          r={radius * 0.45}
                          fill={nodeBaseColor}
                          opacity={isSelected ? 1 : 0.85}
                        />

                        {/* Node Label Text */}
                        {showLabels && (
                          <g transform={`translate(0, ${radius + 12})`} className="pointer-events-none">
                            <text
                              textAnchor="middle"
                              fontSize={node.id === 'tampon' ? '13' : '11'}
                              fontWeight={node.id === 'tampon' || isSelected || isHovered ? 'bold' : '500'}
                              fill={isDarkMode ? '#ffffff' : '#202122'}
                              paintOrder="stroke"
                              stroke={isDarkMode ? '#18191a' : '#ffffff'}
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              {node.name}
                            </text>
                            {/* Pinyin or category label */}
                            <text
                              y="13"
                              textAnchor="middle"
                              fontSize="9"
                              fill={isDarkMode ? '#a2a9b1' : '#72777d'}
                              fontFamily="monospace"
                              paintOrder="stroke"
                              stroke={isDarkMode ? '#18191a' : '#ffffff'}
                              strokeWidth="2.5"
                            >
                              {node.categoryLabel}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>

              </g>
            </svg>

            {/* Floating Floating Canvas Controls (Zoom In, Zoom Out, Reset, Fit, Labels) */}
            <div className={`absolute left-3 bottom-3 p-1 rounded-md border shadow-md flex items-center gap-1 text-xs z-20 backdrop-blur-xs ${
              isDarkMode ? 'bg-[#202122]/90 border-[#54595d]' : 'bg-white/95 border-[#c8ccd1]'
            }`}>
              <button
                onClick={() => handleZoom(1.2)}
                className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-[#54595d] dark:text-[#a2a9b1] hover:text-[#202122] dark:hover:text-white transition-colors cursor-pointer"
                title="放大视图 (+)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleZoom(0.8)}
                className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-[#54595d] dark:text-[#a2a9b1] hover:text-[#202122] dark:hover:text-white transition-colors cursor-pointer"
                title="缩小视图 (-)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <div className="w-[1px] h-3.5 bg-black/10 dark:bg-white/10" />
              <button
                onClick={handleResetView}
                className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-[#54595d] dark:text-[#a2a9b1] hover:text-[#202122] dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                title="复位到默认中心"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="font-mono text-[10px]">{Math.round(transform.k * 100)}%</span>
              </button>
              <div className="w-[1px] h-3.5 bg-black/10 dark:bg-white/10" />
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`p-1.5 rounded transition-colors cursor-pointer text-[11px] flex items-center gap-1 ${
                  showLabels
                    ? 'text-[#3366cc] font-medium'
                    : 'text-[#72777d] hover:text-[#202122] dark:hover:text-white'
                }`}
                title="显示或隐藏节点文字标签"
              >
                <Eye className="w-3 h-3" />
                <span className="hidden sm:inline">标签</span>
              </button>
            </div>

            {/* Quick Helper Floating Tip */}
            <div className="absolute right-3 bottom-3 hidden lg:flex items-center gap-2 text-[11px] text-[#72777d] px-2.5 py-1 rounded bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 pointer-events-none">
              <span>滚轮缩放 · 拖拽平移 · 点击实体查看关联与条目</span>
            </div>
          </div>
        ) : (
          /* LIST / MATRIX EXPLORER VIEW */
          <div className="flex-1 p-4 overflow-y-auto max-h-[700px] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-[#202122] dark:text-white">
                知识图谱实体与关联关系矩阵
              </h3>
              <span className="text-xs text-[#72777d] font-mono">
                共收录 {filteredNodes.length} 个实体，{GRAPH_EDGES.length} 条关系网络
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredNodes.map(node => {
                const edges = GRAPH_EDGES.filter(e => e.source === node.id || e.target === node.id);
                const isSelected = selectedNodeId === node.id;
                const catColor = categoryColorMap[node.category] || { color: '#3366cc', darkColor: '#6699ff' };

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-3 rounded border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#3366cc] shadow-sm bg-blue-500/5'
                        : isDarkMode
                          ? 'bg-[#202122] border-[#54595d] hover:border-[#6699ff]/50'
                          : 'bg-white border-[#c8ccd1] hover:border-[#3366cc]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: isDarkMode ? catColor.darkColor : catColor.color }}
                          />
                          <span className="font-bold text-sm text-[#202122] dark:text-white">
                            {node.name}
                          </span>
                          <span className="text-[10px] text-[#72777d] font-mono">
                            {node.pinyin}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#72777d]">
                          {node.categoryLabel} · {edges.length} 条关联
                        </div>
                      </div>

                      {node.imageUrl && (
                        <img
                          src={node.imageUrl}
                          alt={node.name}
                          className="w-10 h-10 object-cover rounded border border-black/10 dark:border-white/10 shrink-0"
                        />
                      )}
                    </div>

                    <p className="text-xs text-[#54595d] dark:text-[#bdc1c6] mt-2 line-clamp-2 leading-relaxed">
                      {node.summary}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-black/5 dark:border-white/5 flex flex-wrap gap-1.5">
                      {edges.slice(0, 3).map(e => {
                        const otherId = e.source === node.id ? e.target : e.source;
                        const other = nodeLookup.get(otherId);
                        return (
                          <span
                            key={e.id}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[#54595d] dark:text-[#a2a9b1]"
                          >
                            {e.relation}: {other?.name || otherId}
                          </span>
                        );
                      })}
                      {edges.length > 3 && (
                        <span className="text-[10px] text-[#72777d] self-center">
                          +{edges.length - 3} 更多
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. RIGHT DETAIL INSPECTOR DRAWER (Shows details of selected entity) */}
        {selectedNode && (
          <aside className={`w-80 md:w-96 shrink-0 border-l p-4 flex flex-col justify-between overflow-y-auto z-20 transition-colors ${
            isDarkMode ? 'bg-[#202122] border-[#54595d]' : 'bg-white border-[#c8ccd1]'
          }`}>
            <div className="space-y-4">
              {/* Drawer Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#3366cc] dark:text-[#6699ff] font-semibold">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: isDarkMode
                          ? categoryColorMap[selectedNode.category]?.darkColor
                          : categoryColorMap[selectedNode.category]?.color
                      }}
                    />
                    <span>{selectedNode.categoryLabel}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#202122] dark:text-white leading-tight">
                    {selectedNode.name}
                  </h3>
                  {selectedNode.pinyin && (
                    <div className="text-xs text-[#72777d] font-mono">
                      {selectedNode.pinyin}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-[#72777d] hover:text-[#202122] dark:hover:text-white transition-colors cursor-pointer"
                  title="关闭实体面板"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Entity Thumbnail Image & Vector Illustration */}
              <EntityImagePreview
                node={selectedNode}
                isDarkMode={isDarkMode}
              />

              {/* Entity Summary Excerpt */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-[#72777d] uppercase tracking-wider">
                  实体百科摘要
                </div>
                <p className="text-xs leading-relaxed text-[#202122] dark:text-[#eaecf0] text-justify">
                  {selectedNode.summary}
                </p>
              </div>

              {/* Interactive Tags */}
              {selectedNode.tags && selectedNode.tags.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#72777d] uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-[#3366cc]" />
                      <span>实体标签 ({selectedNode.tags.length})</span>
                    </span>
                    {onNavigateTags && (
                      <button
                        onClick={() => onNavigateTags(selectedNode.tags?.[0])}
                        className="text-[10px] text-[#3366cc] dark:text-[#6699ff] hover:underline cursor-pointer font-normal"
                      >
                        标签索引 »
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.tags.map((tag, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedTagFilter(tag === selectedTagFilter ? null : tag);
                          setIsTagDrawerOpen(true);
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded cursor-pointer transition-all flex items-center gap-1 border ${
                          selectedTagFilter === tag
                            ? 'bg-[#3366cc] text-white border-[#3366cc] font-semibold'
                            : 'bg-black/5 dark:bg-white/5 hover:bg-[#3366cc]/10 hover:text-[#3366cc] dark:hover:text-[#6699ff] border-transparent text-[#54595d] dark:text-[#a2a9b1]'
                        }`}
                        title={`点击筛选所有包含 #${tag} 的实体`}
                      >
                        <Tag className="w-2.5 h-2.5 opacity-70" />
                        <span>#{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Connected Relationships in Graph */}
              <div className="space-y-2 pt-2 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#72777d] uppercase tracking-wider">
                  <span>拓扑连接网络 ({selectedNodeEdges.length})</span>
                  <span className="font-normal font-mono text-[10px]">点击切换聚焦</span>
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {selectedNodeEdges.map(({ edge, otherNode }) => {
                    if (!otherNode) return null;
                    return (
                      <div
                        key={edge.id}
                        onClick={() => handleFocusNode(otherNode.id)}
                        className="p-2 rounded bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-[#3366cc]/40 hover:bg-[#3366cc]/5 transition-all cursor-pointer flex items-center justify-between text-xs group"
                      >
                        <div className="space-y-0.5">
                          <div className="font-medium text-[#202122] dark:text-white group-hover:text-[#3366cc] dark:group-hover:text-[#6699ff] transition-colors flex items-center gap-1.5 flex-wrap">
                            <span>{otherNode.name}</span>
                            {edge.origin === 'co-tag' && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-normal">
                                标签共现
                              </span>
                            )}
                            {edge.origin === 'mention' && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-normal">
                                语义引用
                              </span>
                            )}
                            {edge.origin === 'curated' && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-normal">
                                官方核定
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#72777d]">
                            {edge.relation}
                          </div>
                        </div>

                        <ArrowRight className="w-3.5 h-3.5 text-[#72777d] group-hover:text-[#3366cc] group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Navigation Action Buttons */}
            <div className="pt-4 mt-4 border-t border-black/10 dark:border-white/10 space-y-2">
              <button
                onClick={() => onNavigateWikiTerm ? onNavigateWikiTerm(selectedNode.articleWikiTerm || selectedNode.name) : onNavigateArticle?.(selectedNode.inArticleSectionId)}
                className="w-full py-2 px-3 rounded bg-[#3366cc] hover:bg-[#2a4b8d] text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>阅读「{selectedNode.name}」百科词条</span>
              </button>

              {selectedNode.inArticleSectionId && (
                <button
                  onClick={() => onNavigateArticle?.(selectedNode.inArticleSectionId)}
                  className="w-full py-1.5 px-3 rounded border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs text-[#54595d] dark:text-[#a2a9b1] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>定位至《卫生棉条》对应章节</span>
                </button>
              )}

              <button
                onClick={() => handleFocusNode(selectedNode.id)}
                className="w-full py-1.5 px-3 rounded border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs text-[#54595d] dark:text-[#a2a9b1] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>在图谱中居中聚焦</span>
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* 5. FOOTER LEGEND BAR */}
      <div className={`px-4 py-2 border-t flex flex-wrap items-center justify-between gap-3 text-[11px] transition-colors ${
        isDarkMode ? 'bg-[#151617] border-[#54595d] text-[#72777d]' : 'bg-[#f8f9fa] border-[#c8ccd1] text-[#72777d]'
      }`}>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-semibold text-[#202122] dark:text-[#eaecf0]">图例说明：</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#2563eb]" /> 核心条目
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#059669]" /> 生理用品
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#dc2626]" /> 医学与病理
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#7c3aed]" /> 解剖生理
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#d97706]" /> 历史品牌
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#0891b2]" /> 结构材质
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#db2777]" /> 社会文化
          </span>

          <span className="text-[#a2a9b1] dark:text-[#54595d]">|</span>

          <span className="flex items-center gap-1 text-[#54595d] dark:text-[#a2a9b1]">
            <span className="w-3 border-t-2 border-[#3366cc]" /> 官方核定
          </span>
          <span className="flex items-center gap-1 text-[#54595d] dark:text-[#a2a9b1]">
            <span className="w-3 border-t-2 border-dashed border-[#9333ea]" /> 标签共现推导
          </span>
          <span className="flex items-center gap-1 text-[#54595d] dark:text-[#a2a9b1]">
            <span className="w-3 border-t-2 border-dotted border-[#059669]" /> 正文引用提及
          </span>
        </div>

        <div className="font-mono text-[10px]">
          MZ维基 拓扑自动化引擎 v2.0 · 智能语义与标签推导
        </div>
      </div>
    </div>
  );
};
