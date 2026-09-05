import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { opDb } from './server/data';
import { processAssistantRequest } from './server/gemini';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Executive Operations Assistant API',
      date: '2026-09-03',
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // Get full operational state
  app.get('/api/state', (req, res) => {
    res.json(opDb.getState());
  });

  // Chat / Executive Briefing with Gemini & Function Calling
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

  // Restock action
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

  // Dispatch PO action
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

  // Task status update
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

  // Direct inventory adjustment
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Executive COO Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
