import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  getGlobalContentStatistics, 
  getAllArticlesContentStats, 
  getFeaturedTamponStats, 
  getWikiEntryStats, 
  generateStatisticsJSON, 
  generateStatisticsCSV 
} from './src/utils/contentStatisticsAutomation.ts';
import { calculateReadingMetrics } from './src/utils/headerAutomation.ts';
import { GRAPH_NODES, GRAPH_EDGES } from './src/data/knowledgeGraphData.ts';
import { WIKI_ENTRIES } from './src/data/wikiEntriesData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Allowed domains for safe proxying (prevent open relay / SSRF)
  const ALLOWED_HOSTS = [
    'upload.wikimedia.org',
    'commons.wikimedia.org',
    'en.wikipedia.org',
    'zh.wikipedia.org'
  ];

  // ==========================================
  // Automated Content Statistics REST API
  // ==========================================

  // 1. GET /api/statistics/global - Returns 100% automated derived global statistics
  app.get('/api/statistics/global', (_req, res) => {
    try {
      const startTime = performance.now();
      const stats = getGlobalContentStatistics();
      const computationMs = parseFloat((performance.now() - startTime).toFixed(3));

      return res.json({
        status: 'success',
        code: 200,
        source: 'automated_derivation_engine',
        calculatedAt: new Date().toISOString(),
        computationLatencyMs: computationMs,
        data: stats
      });
    } catch (err: any) {
      console.error('API Error /api/statistics/global:', err);
      return res.status(500).json({ status: 'error', code: 500, message: err?.message });
    }
  });

  // 2. GET /api/statistics/articles - Filter, search, and sort all articles statistics
  app.get('/api/statistics/articles', (req, res) => {
    try {
      const startTime = performance.now();
      let articles = getAllArticlesContentStats();
      const totalCount = articles.length;

      const { q, category, grade, sort = 'wordCount', order = 'desc' } = req.query as Record<string, string>;

      // Filter by search query
      if (q && q.trim()) {
        const queryLower = q.trim().toLowerCase();
        articles = articles.filter(a => 
          a.title.toLowerCase().includes(queryLower) || 
          a.categoryLabel.toLowerCase().includes(queryLower)
        );
      }

      // Filter by category
      if (category && category !== 'all') {
        articles = articles.filter(a => a.category === category);
      }

      // Filter by quality grade
      if (grade && grade !== 'all') {
        articles = articles.filter(a => a.qualityGrade === grade);
      }

      // Sort
      articles.sort((a, b) => {
        let valA: any = a.metrics.wordCount;
        let valB: any = b.metrics.wordCount;

        if (sort === 'referenceCount') {
          valA = a.referenceCount;
          valB = b.referenceCount;
        } else if (sort === 'readingMinutes') {
          valA = a.metrics.readingMinutes;
          valB = b.metrics.readingMinutes;
        } else if (sort === 'paragraphCount') {
          valA = a.paragraphCount;
          valB = b.paragraphCount;
        } else if (sort === 'title') {
          valA = a.title;
          valB = b.title;
          return order === 'asc' ? valA.localeCompare(valB, 'zh-Hans') : valB.localeCompare(valA, 'zh-Hans');
        } else if (sort === 'quality') {
          const weights: Record<string, number> = { FA: 4, GA: 3, A: 2, B: 1 };
          valA = weights[a.qualityGrade] || 0;
          valB = weights[b.qualityGrade] || 0;
        }

        return order === 'asc' ? valA - valB : valB - valA;
      });

      const computationMs = parseFloat((performance.now() - startTime).toFixed(3));

      return res.json({
        status: 'success',
        code: 200,
        total: totalCount,
        filtered: articles.length,
        computationLatencyMs: computationMs,
        data: articles
      });
    } catch (err: any) {
      console.error('API Error /api/statistics/articles:', err);
      return res.status(500).json({ status: 'error', code: 500, message: err?.message });
    }
  });

  // 3. GET /api/statistics/article/:id - Single article statistics by ID or title
  app.get('/api/statistics/article/:id', (req, res) => {
    try {
      const idOrTitle = decodeURIComponent(req.params.id);
      
      if (idOrTitle === 'tampon' || idOrTitle === '卫生棉条') {
        return res.json({
          status: 'success',
          code: 200,
          data: getFeaturedTamponStats()
        });
      }

      const entry = WIKI_ENTRIES.find(e => e.id === idOrTitle || e.title === idOrTitle);
      if (!entry) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: `Article not found: "${idOrTitle}"`
        });
      }

      return res.json({
        status: 'success',
        code: 200,
        data: getWikiEntryStats(entry)
      });
    } catch (err: any) {
      console.error('API Error /api/statistics/article/:id:', err);
      return res.status(500).json({ status: 'error', code: 500, message: err?.message });
    }
  });

  // 4. GET /api/statistics/graph - Automated knowledge graph topology statistics
  app.get('/api/statistics/graph', (_req, res) => {
    try {
      const nodeDegrees: Record<string, number> = {};
      GRAPH_EDGES.forEach(edge => {
        nodeDegrees[edge.source] = (nodeDegrees[edge.source] || 0) + 1;
        nodeDegrees[edge.target] = (nodeDegrees[edge.target] || 0) + 1;
      });

      const hubNodes = GRAPH_NODES.map(node => ({
        id: node.id,
        label: node.label,
        group: node.group,
        degree: nodeDegrees[node.id] || 0
      })).sort((a, b) => b.degree - a.degree);

      return res.json({
        status: 'success',
        code: 200,
        data: {
          totalNodes: GRAPH_NODES.length,
          totalEdges: GRAPH_EDGES.length,
          averageDegree: parseFloat(((GRAPH_EDGES.length * 2) / GRAPH_NODES.length).toFixed(2)),
          centralHubNodes: hubNodes.slice(0, 5),
          density: parseFloat(((2 * GRAPH_EDGES.length) / (GRAPH_NODES.length * (GRAPH_NODES.length - 1))).toFixed(4))
        }
      });
    } catch (err: any) {
      console.error('API Error /api/statistics/graph:', err);
      return res.status(500).json({ status: 'error', code: 500, message: err?.message });
    }
  });

  // 5. POST /api/statistics/recalculate - Live recalculate and performance benchmark
  app.post('/api/statistics/recalculate', (_req, res) => {
    try {
      const t0 = performance.now();
      const stats = getGlobalContentStatistics();
      const articles = getAllArticlesContentStats();
      const latencyMs = parseFloat((performance.now() - t0).toFixed(3));

      return res.json({
        status: 'success',
        code: 200,
        message: 'All content statistics recalculated successfully',
        latencyMs,
        recalculatedAt: new Date().toISOString(),
        summary: {
          totalArticles: stats.totalArticles,
          totalWords: stats.totalWords,
          totalReferences: stats.totalReferences,
          articlesProcessed: articles.length
        }
      });
    } catch (err: any) {
      console.error('API Error /api/statistics/recalculate:', err);
      return res.status(500).json({ status: 'error', code: 500, message: err?.message });
    }
  });

  // 6. POST & GET /api/statistics/metrics - Automated text reading metrics calculator
  const handleCalculateMetrics = (req: express.Request, res: express.Response) => {
    try {
      const text = (req.body?.text || req.query.text || '') as string;
      const metrics = calculateReadingMetrics(text);
      return res.json({
        status: 'success',
        code: 200,
        data: metrics
      });
    } catch (err: any) {
      return res.status(500).json({ status: 'error', code: 500, message: err?.message });
    }
  };
  app.get('/api/statistics/metrics', handleCalculateMetrics);
  app.post('/api/statistics/metrics', handleCalculateMetrics);

  // 7. GET /api/statistics/export/json - Direct downloadable JSON API
  app.get('/api/statistics/export/json', (_req, res) => {
    try {
      const jsonContent = generateStatisticsJSON();
      const dateStr = new Date().toISOString().slice(0, 10);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="mzwiki-statistics-${dateStr}.json"`);
      return res.send(jsonContent);
    } catch (err: any) {
      return res.status(500).json({ status: 'error', code: 500, message: err?.message });
    }
  });

  // 8. GET /api/statistics/export/csv - Direct downloadable CSV API
  app.get('/api/statistics/export/csv', (_req, res) => {
    try {
      const csvContent = generateStatisticsCSV();
      const dateStr = new Date().toISOString().slice(0, 10);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="mzwiki-statistics-${dateStr}.csv"`);
      return res.send('\uFEFF' + csvContent);
    } catch (err: any) {
      return res.status(500).json({ status: 'error', code: 500, message: err?.message });
    }
  });

  // Image Proxy Endpoint
  app.get('/api/proxy-image', async (req, res) => {
    try {
      const targetUrl = req.query.url as string;
      if (!targetUrl) {
        return res.status(400).json({ error: 'Missing "url" query parameter' });
      }

      let parsedUrl: URL;
      try {
        parsedUrl = new URL(targetUrl);
      } catch {
        return res.status(400).json({ error: 'Invalid URL format' });
      }

      // Security check: only allow authorized Wikimedia hosts
      if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
        return res.status(403).json({ error: 'Domain not allowed' });
      }

      // Fetch from Wikimedia with proper User-Agent header (required by Wikimedia API policy)
      const upstreamResponse = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'MZWikiImageProxy/1.0 (https://ais-dev.example.org; contact: support@example.org) Mozilla/5.0'
        }
      });

      if (!upstreamResponse.ok) {
        return res.status(upstreamResponse.status).send(`Upstream error: ${upstreamResponse.statusText}`);
      }

      const contentType = upstreamResponse.headers.get('content-type') || 'image/jpeg';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=604800, s-maxage=604800, immutable');
      res.setHeader('Access-Control-Allow-Origin', '*');

      const arrayBuffer = await upstreamResponse.arrayBuffer();
      return res.send(Buffer.from(arrayBuffer));
    } catch (err: any) {
      console.error('Proxy image error:', err);
      return res.status(500).json({ error: 'Failed to proxy image', details: err?.message });
    }
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
