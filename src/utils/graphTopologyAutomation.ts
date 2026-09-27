import { 
  GraphNode, 
  GraphEdge, 
  GRAPH_NODES, 
  GRAPH_EDGES, 
  GraphCategory 
} from '../data/knowledgeGraphData';
import { WIKI_ENTRIES } from '../data/wikiEntriesData';

export type EdgeOrigin = 'curated' | 'co-tag' | 'mention';

export interface AutomatedGraphEdge extends GraphEdge {
  origin: EdgeOrigin;
  sharedTags?: string[];
  confidence?: number;
  weight?: number;
}

export interface AutomatedGraphNode extends GraphNode {
  degree: number;
  inDegree: number;
  outDegree: number;
  computedVal: number;
  connectedNodeIds: string[];
  sharedTagCountWithFocus?: number;
}

export interface TagCoOccurrence {
  tag: string;
  count: number;
  sharedNodeNames: string[];
}

export interface TagTopologyInfo {
  tag: string;
  count: number;
  heatScore: number;
  coOccurringTags: TagCoOccurrence[];
  associatedNodes: GraphNode[];
}

/**
 * Builds the automated, comprehensive graph topology by:
 * 1. Keeping all primary curated edges from GRAPH_EDGES (origin: 'curated').
 * 2. Automatically discovering and creating edges for nodes sharing 1 or more tags (origin: 'co-tag').
 * 3. Automatically discovering cross-reference mentions in summaries/articles (origin: 'mention').
 * 4. Dynamically computing node degree, centrality, and dynamic node weight.
 */
export function generateAutomatedTopology(options: {
  includeCoTagEdges?: boolean;
  includeMentionEdges?: boolean;
  minSharedTags?: number;
  activeTagFilter?: string | null;
} = {}): {
  nodes: AutomatedGraphNode[];
  edges: AutomatedGraphEdge[];
  stats: {
    curatedEdgeCount: number;
    coTagEdgeCount: number;
    mentionEdgeCount: number;
    totalEdgeCount: number;
    isolatedNodeCount: number;
    density: number;
  };
} {
  const {
    includeCoTagEdges = true,
    includeMentionEdges = true,
    minSharedTags = 1,
    activeTagFilter = null
  } = options;

  // Build existing edge pair set to avoid duplicate edges
  const existingEdgeSet = new Set<string>();
  const allEdges: AutomatedGraphEdge[] = [];

  let curatedCount = 0;
  let coTagCount = 0;
  let mentionCount = 0;

  // 1. Curated Edges
  GRAPH_EDGES.forEach(edge => {
    const pairKey = [edge.source, edge.target].sort().join('<->');
    existingEdgeSet.add(pairKey);
    allEdges.push({
      ...edge,
      origin: 'curated',
      weight: 1.0
    });
    curatedCount++;
  });

  // 2. Discover Co-Tag Edges (Shared semantic tags between nodes)
  if (includeCoTagEdges) {
    for (let i = 0; i < GRAPH_NODES.length; i++) {
      const nodeA = GRAPH_NODES[i];
      const tagsA = new Set(nodeA.tags || []);
      if (tagsA.size === 0) continue;

      for (let j = i + 1; j < GRAPH_NODES.length; j++) {
        const nodeB = GRAPH_NODES[j];
        const tagsB = new Set(nodeB.tags || []);
        if (tagsB.size === 0) continue;

        const pairKey = [nodeA.id, nodeB.id].sort().join('<->');
        if (existingEdgeSet.has(pairKey)) continue;

        // Calculate shared tags
        const shared: string[] = [];
        tagsA.forEach(t => {
          if (tagsB.has(t)) {
            shared.push(t);
          }
        });

        if (shared.length >= minSharedTags) {
          existingEdgeSet.add(pairKey);
          
          let edgeType: GraphEdge['type'] = 'primary';
          if (nodeA.category === 'medical' || nodeB.category === 'medical') {
            edgeType = 'medical';
          } else if (nodeA.category === 'anatomy' || nodeB.category === 'anatomy') {
            edgeType = 'anatomy';
          } else if (nodeA.category === 'material' || nodeB.category === 'material') {
            edgeType = 'material';
          } else if (nodeA.category === 'history' || nodeB.category === 'history') {
            edgeType = 'history';
          }

          allEdges.push({
            id: `auto-cotag-${nodeA.id}-${nodeB.id}`,
            source: nodeA.id,
            target: nodeB.id,
            relation: `共有标签 #${shared.slice(0, 2).join(' #')}${shared.length > 2 ? ` 等${shared.length}个` : ''}`,
            type: edgeType,
            origin: 'co-tag',
            sharedTags: shared,
            confidence: Math.min(0.95, 0.65 + shared.length * 0.1),
            weight: 0.6 + shared.length * 0.15,
            description: `实体「${nodeA.name}」与「${nodeB.name}」共同归属于标签 [${shared.join(', ')}]，具有强拓扑共现关联。`
          });
          coTagCount++;
        }
      }
    }
  }

  // 3. Discover Cross-Reference Mention Edges (Summary / Entry mentions)
  if (includeMentionEdges) {
    GRAPH_NODES.forEach(nodeA => {
      // Find matching wiki entry if available
      const entryA = WIKI_ENTRIES.find(e => e.id === nodeA.id || e.title === nodeA.name);
      const textToScan = `${nodeA.summary} ${entryA ? entryA.summary : ''}`;

      GRAPH_NODES.forEach(nodeB => {
        if (nodeA.id === nodeB.id) return;
        const pairKey = [nodeA.id, nodeB.id].sort().join('<->');
        if (existingEdgeSet.has(pairKey)) return;

        // Check if nodeA's text mentions nodeB's name
        const regex = new RegExp(`(?<!\\[|\\])${nodeB.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
        if (regex.test(textToScan)) {
          existingEdgeSet.add(pairKey);
          allEdges.push({
            id: `auto-mention-${nodeA.id}-${nodeB.id}`,
            source: nodeA.id,
            target: nodeB.id,
            relation: `摘要引述提及: ${nodeB.name}`,
            type: nodeB.category === 'medical' ? 'medical' : nodeB.category === 'anatomy' ? 'anatomy' : 'primary',
            origin: 'mention',
            confidence: 0.8,
            weight: 0.75,
            description: `「${nodeA.name}」在官方条目释义中直接引用了「${nodeB.name}」知识实体。`
          });
          mentionCount++;
        }
      });
    });
  }

  // 4. Compute Degree Centralities and Dynamic Node Weights
  const degreeMap = new Map<string, { inDegree: number; outDegree: number; neighbors: Set<string> }>();
  GRAPH_NODES.forEach(n => {
    degreeMap.set(n.id, { inDegree: 0, outDegree: 0, neighbors: new Set<string>() });
  });

  allEdges.forEach(edge => {
    const s = degreeMap.get(edge.source);
    const t = degreeMap.get(edge.target);
    if (s) {
      s.outDegree++;
      s.neighbors.add(edge.target);
    }
    if (t) {
      t.inDegree++;
      t.neighbors.add(edge.source);
    }
  });

  // Calculate maximum degree for normalization
  let maxDegree = 1;
  degreeMap.forEach(d => {
    const total = d.inDegree + d.outDegree;
    if (total > maxDegree) maxDegree = total;
  });

  const nodes: AutomatedGraphNode[] = GRAPH_NODES.map(node => {
    const d = degreeMap.get(node.id) || { inDegree: 0, outDegree: 0, neighbors: new Set() };
    const degree = d.inDegree + d.outDegree;

    // Base value from hand-curated node or degree-based amplification
    const baseVal = node.val || 16;
    const degreeBonus = Math.round((degree / maxDegree) * 14);
    const computedVal = Math.min(42, Math.max(16, baseVal + degreeBonus));

    return {
      ...node,
      degree,
      inDegree: d.inDegree,
      outDegree: d.outDegree,
      computedVal,
      connectedNodeIds: Array.from(d.neighbors)
    };
  });

  // Calculate Graph Density
  const n = nodes.length;
  const maxPossibleEdges = (n * (n - 1)) / 2;
  const totalEdgeCount = allEdges.length;
  const density = maxPossibleEdges > 0 ? parseFloat((totalEdgeCount / maxPossibleEdges).toFixed(3)) : 0;
  const isolatedNodeCount = nodes.filter(n => n.degree === 0).length;

  return {
    nodes,
    edges: allEdges,
    stats: {
      curatedEdgeCount: curatedCount,
      coTagEdgeCount: coTagCount,
      mentionEdgeCount: mentionCount,
      totalEdgeCount,
      isolatedNodeCount,
      density
    }
  };
}

/**
 * Computes automated tag co-occurrence matrix and semantic topological network
 */
export function generateAutomatedTagTopology(): Map<string, TagTopologyInfo> {
  const tagNodeMap = new Map<string, GraphNode[]>();

  // 1. Gather all tags across nodes & wiki entries
  GRAPH_NODES.forEach(node => {
    node.tags?.forEach(tag => {
      const list = tagNodeMap.get(tag) || [];
      list.push(node);
      tagNodeMap.set(tag, list);
    });
  });

  const topologyMap = new Map<string, TagTopologyInfo>();

  tagNodeMap.forEach((nodes, tag) => {
    const coOccurrenceCountMap = new Map<string, { count: number; nodes: Set<string> }>();

    // For every node with this tag, inspect other tags on the same node
    nodes.forEach(node => {
      node.tags?.forEach(otherTag => {
        if (otherTag === tag) return;
        const existing = coOccurrenceCountMap.get(otherTag) || { count: 0, nodes: new Set() };
        existing.count++;
        existing.nodes.add(node.name);
        coOccurrenceCountMap.set(otherTag, existing);
      });
    });

    const coOccurringTags: TagCoOccurrence[] = Array.from(coOccurrenceCountMap.entries())
      .map(([otherTag, data]) => ({
        tag: otherTag,
        count: data.count,
        sharedNodeNames: Array.from(data.nodes)
      }))
      .sort((a, b) => b.count - a.count);

    // Heat score: frequency of tag * 10 + number of co-occurrences * 3
    const heatScore = nodes.length * 10 + coOccurringTags.reduce((sum, item) => sum + item.count, 0) * 3;

    topologyMap.set(tag, {
      tag,
      count: nodes.length,
      heatScore,
      coOccurringTags,
      associatedNodes: nodes
    });
  });

  return topologyMap;
}
