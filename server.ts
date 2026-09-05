import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { opDb } from './server/data';
import { processAssistantRequest } from './server/gemini';
import { executeTool } from './server/tools';

dotenv.config();

// Cloud Run dynamically injects the PORT environment variable (defaults to 3000 in dev)
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = '0.0.0.0';

async function startServer() {
  const app = express();

  // Cloud Run & API Security Middleware
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());

  // Health check endpoint for Cloud Run container probes
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      service: 'Personal Productivity Assistant - Operations Agent',
      timestamp: new Date().toISOString(),
      operational_date: '2026-09-03',
      runtime: {
        node_version: process.version,
        platform: process.platform,
        uptime_seconds: Math.floor(process.uptime()),
        port: PORT,
        host: HOST
      },
      gemini_configured: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // Get full operational state (Sales, Inventory, Purchase Orders, Tasks)
  app.get('/api/state', (_req, res) => {
    res.json(opDb.getState());
  });

  // Direct REST execution of Lab 3 Operational Tooling
  app.get('/api/tools/check-daily-sales', async (req, res) => {
    try {
      const dateStr = (req.query.date as string) || '2026-09-03';
      const result = await executeTool('check_daily_sales', { date_str: dateStr });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to check daily sales' });
    }
  });

  app.get('/api/tools/track-inventory', async (req, res) => {
    try {
      const threshold = req.query.threshold ? Number(req.query.threshold) : 15;
      const result = await executeTool('track_inventory', { threshold });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to track inventory' });
    }
  });

  app.get('/api/tools/generate-operations-summary', async (req, res) => {
    try {
      const dateStr = (req.query.date as string) || '2026-09-03';
      const result = await executeTool('generate_daily_operations_summary', { date_str: dateStr });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to generate operations summary' });
    }
  });

  // Chat / Autonomous Executive Briefing with Gemini Multi-Tool Function Calling
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const result = await processAssistantRequest(message, history || []);
      const updatedState = opDb.getState();

      res.json({
        reply: result.text,
        toolCalls: result.toolCalls,
        modelUsed: result.modelUsed,
        state: updatedState
      });
    } catch (error: any) {
      console.error('Error in /api/chat:', error);
      res.status(500).json({
        error: 'Failed to process operational briefing request',
        details: error?.message || String(error)
      });
    }
  });

  // REST endpoints for operations automation
  app.post('/api/operations/restock', (req, res) => {
    const { sku, quantity } = req.body;
    if (!sku || !quantity) {
      res.status(400).json({ error: 'sku and quantity required' });
      return;
    }
    const po = opDb.createPurchaseOrder(sku, Number(quantity));
    if (!po) {
      res.status(404).json({ error: `SKU ${sku} not found` });
      return;
    }
    res.json({ success: true, po, state: opDb.getState() });
  });

  app.post('/api/operations/dispatch', (req, res) => {
    const { poId } = req.body;
    if (!poId) {
      res.status(400).json({ error: 'poId required' });
      return;
    }
    const po = opDb.dispatchPurchaseOrder(poId);
    if (!po) {
      res.status(404).json({ error: `PO ${poId} not found` });
      return;
    }
    res.json({ success: true, po, state: opDb.getState() });
  });

  app.post('/api/operations/task-status', (req, res) => {
    const { taskId, status } = req.body;
    if (!taskId || !status) {
      res.status(400).json({ error: 'taskId and status required' });
      return;
    }
    const updated = opDb.updateTaskStatus(taskId, status);
    if (!updated) {
      res.status(404).json({ error: `Task ${taskId} not found` });
      return;
    }
    res.json({ success: true, task: updated, state: opDb.getState() });
  });

  app.post('/api/operations/stock-update', (req, res) => {
    const { sku, newStock } = req.body;
    if (!sku || newStock === undefined) {
      res.status(400).json({ error: 'sku and newStock required' });
      return;
    }
    const updated = opDb.updateInventoryStock(sku, Number(newStock));
    if (!updated) {
      res.status(404).json({ error: `SKU ${sku} not found` });
      return;
    }
    res.json({ success: true, item: updated, state: opDb.getState() });
  });

  // Vite middleware for local development / Static serving for Cloud Run container production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[Personal Productivity Assistant API] Listening on http://${HOST}:${PORT} (Node ${process.version})`);
  });
}

startServer();
