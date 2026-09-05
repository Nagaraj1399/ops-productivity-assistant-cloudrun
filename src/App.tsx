import React, { useState, useEffect } from 'react';
import { ExecutiveHeader } from './components/ExecutiveHeader';
import { BriefingChat } from './components/BriefingChat';
import { InventoryLedger } from './components/InventoryLedger';
import { ProcurementQueue } from './components/ProcurementQueue';
import { SalesIntelligence } from './components/SalesIntelligence';
import { PriorityMatrix } from './components/PriorityMatrix';
import { ToolChainModal } from './components/ToolChainModal';
import { SciFiBridgeView } from './components/SciFiBridgeView';
import { VoiceCommandListener } from './components/VoiceCommandListener';
import { OperationsState, ChatMessage, ToolCallExecution } from './types';
import { Boxes, FileText, BarChart3, ListChecks } from 'lucide-react';

const INITIAL_FALLBACK_STATE: OperationsState = {
  inventory: [
    {
      sku: 'SKU-102',
      name: 'Wireless Mechanical Keyboard',
      category: 'Input Devices',
      currentStock: 4,
      safetyMin: 15,
      reorderQuantity: 25,
      unitCost: 52.00,
      retailPrice: 99.00,
      dailyVelocity: 6.2,
      leadTimeDays: 4,
      supplier: 'Apex Peripherals Co.',
      status: 'critical'
    },
    {
      sku: 'SKU-205',
      name: 'USB-C Dual Dock',
      category: 'Hubs & Connectivity',
      currentStock: 12,
      safetyMin: 15,
      reorderQuantity: 15,
      unitCost: 45.00,
      retailPrice: 89.00,
      dailyVelocity: 4.8,
      leadTimeDays: 3,
      supplier: 'Anker Pro Supplies',
      status: 'low'
    },
    {
      sku: 'SKU-310',
      name: 'Ergonomic Office Chair',
      category: 'Furniture & Seating',
      currentStock: 48,
      safetyMin: 20,
      reorderQuantity: 30,
      unitCost: 180.00,
      retailPrice: 389.00,
      dailyVelocity: 11.4,
      leadTimeDays: 7,
      supplier: 'Kinetics Seating Ltd.',
      status: 'nominal'
    }
  ],
  purchaseOrders: [
    {
      id: 'PO-205-3605',
      sku: 'SKU-205',
      itemName: 'Wireless Mechanical Keyboard',
      quantity: 25,
      unitCost: 5.40,
      totalCost: 135.00,
      supplier: 'Vendor Logistics Node',
      status: 'draft',
      createdAt: '2026-09-03 01:15:00',
      estimatedDelivery: '2 business days'
    },
    {
      id: 'PO-102-9841',
      sku: 'SKU-102',
      itemName: 'USB-C Dual Dock',
      quantity: 15,
      unitCost: 116.66,
      totalCost: 1750.00,
      supplier: 'Venogistics Supply',
      status: 'dispatched',
      createdAt: '2026-09-03 01:30:00',
      estimatedDelivery: '2 business days'
    },
    {
      id: 'PO-205-9842',
      sku: 'SKU-102',
      itemName: 'Wireless Mechanical Keyboard',
      quantity: 25,
      unitCost: 50.00,
      totalCost: 1250.00,
      supplier: 'Apex Peripherals Co.',
      status: 'dispatched',
      createdAt: '2026-09-03 01:35:00',
      estimatedDelivery: '3 business days'
    }
  ],
  salesSummary: {
    date: '2026-09-03',
    grossSales: 14250.00,
    orderCount: 138,
    aov: 103.26,
    conversionRate: 3.8,
    topPerformer: {
      sku: 'SKU-310',
      name: 'Ergonomic Office Chair',
      unitsSold: 34,
      revenue: 13226.00
    },
    laggingSector: {
      category: 'Desk Accessories',
      changePctVs7Day: -18.2,
      note: 'Volume deficit vs 7-day baseline'
    },
    categoryBreakdown: [
      { category: 'Furniture & Seating', revenue: 13226.00, unitsSold: 34, growthPct: 12.4 },
      { category: 'Input Devices', revenue: 396.00, unitsSold: 4, growthPct: -4.2 },
      { category: 'Hubs & Connectivity', revenue: 1068.00, unitsSold: 12, growthPct: 2.1 },
      { category: 'Desk Accessories', revenue: 1240.00, unitsSold: 18, growthPct: -18.2 }
    ],
    hourlySales: [
      { hour: '00:00', sales: 420, orders: 4 },
      { hour: '02:00', sales: 280, orders: 3 },
      { hour: '04:00', sales: 190, orders: 2 },
      { hour: '06:00', sales: 850, orders: 8 },
      { hour: '08:00', sales: 2350, orders: 22 },
      { hour: '10:00', sales: 3100, orders: 30 },
      { hour: '12:00', sales: 2980, orders: 28 },
      { hour: '14:00', sales: 2450, orders: 24 },
      { hour: '16:00', sales: 1630, orders: 17 }
    ]
  },
  tasks: [
    {
      id: 'task-1',
      title: 'Authorize PO-102-9841 (Wireless Keyboards)',
      department: 'fulfillment',
      priority: 'critical',
      assignedTo: 'Robotic Ops',
      status: 'pending',
      actionRequired: 'Authorize immediate dispatch to supplier node',
      dueDate: 'Today 12:00'
    },
    {
      id: 'task-2',
      title: 'Investigate Desk Accessories Margin Anomaly',
      department: 'executive',
      priority: 'high',
      assignedTo: 'Sales Intelligence AI',
      status: 'in_progress',
      actionRequired: 'Audit price sensitivity and ad spend anomaly',
      dueDate: 'Today 16:00'
    }
  ],
  rmaAlerts: [
    {
      id: 'rma-1',
      sku: 'SKU-205',
      itemName: 'USB-C Dual Dock',
      returnRate: 4.8,
      benchmarkRate: 1.2,
      primaryReason: 'Thermal Throttling & Port Drop',
      status: 'investigating'
    }
  ]
};

export default function App() {
  const [opState, setOpState] = useState<OperationsState>(INITIAL_FALLBACK_STATE);
  const [viewMode, setViewMode] = useState<'bridge' | 'analytics'>('bridge');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'procurement' | 'sales' | 'priorities'>('inventory');
  const [activeToolChain, setActiveToolChain] = useState<ToolCallExecution[] | null>(null);
  const [isVoiceListenerOpen, setIsVoiceListenerOpen] = useState<boolean>(false);

  // Initial message pre-loaded with the official morning operational briefing
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      role: 'assistant',
      timestamp: '08:00:12',
      content: `**Operations Health | September 3, 2026**

**Revenue Performance**
- **Gross Sales:** $14,250.00 (138 orders, AOV: $103.26)
- **Top Performer:** Ergonomic Office Chair (34 units sold)
- **Lagging Sector:** Desk Accessories (-18% vs 7-day average)

**Inventory Alerts**
| SKU | Item Name | Current Stock | Safety Min | Recommended Reorder |
| :--- | :--- | :--- | :--- | :--- |
| SKU-102 | Wireless Mechanical Keyboard | 4 units | 15 units | 25 units |
| SKU-205 | USB-C Dual Dock | 12 units | 15 units | 15 units |

Draft purchase orders PO-102-9841 and PO-205-9842 have been generated in the procurement queue. Authorize immediate dispatch to suppliers?`,
      toolCalls: [
        {
          id: 'call_init_1',
          toolName: 'get_daily_sales_summary',
          args: { date_str: '2026-09-03' },
          result: {
            date: '2026-09-03',
            gross_sales: '$14,250.00',
            order_count: 138,
            aov: '$103.26',
            top_performer: { sku: 'SKU-310', item_name: 'Ergonomic Office Chair', units_sold: 34 },
            lagging_sector: { category: 'Desk Accessories', change_vs_7day: '-18%' }
          },
          timestamp: '2026-09-03T08:00:10.000Z'
        },
        {
          id: 'call_init_2',
          toolName: 'check_low_inventory',
          args: { threshold: 15 },
          result: {
            threshold_inspected: 15,
            critical_items_count: 2,
            items: [
              { sku: 'SKU-102', item_name: 'Wireless Mechanical Keyboard', current_stock: '4 units', safety_min: '15 units', recommended_reorder: '25 units' },
              { sku: 'SKU-205', item_name: 'USB-C Dual Dock', current_stock: '12 units', safety_min: '15 units', recommended_reorder: '15 units' }
            ]
          },
          timestamp: '2026-09-03T08:00:11.000Z'
        }
      ]
    }
  ]);

  // Fetch live state from backend
  const fetchState = async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        setOpState(data);
      }
    } catch (err) {
      console.error('Failed to load operational state:', err);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  // Handle user prompting the COO assistant
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-4).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        toolCalls: data.toolCalls,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (data.state) {
        setOpState(data.state);
      }

      // If user prompted restock or POs, switch to relevant tab
      if (userText.toLowerCase().includes('replenish') || userText.toLowerCase().includes('po')) {
        setActiveTab('procurement');
      } else if (userText.toLowerCase().includes('anomaly') || userText.toLowerCase().includes('sales')) {
        setActiveTab('sales');
      }
    } catch (err: any) {
      console.error('Assistant execution failed:', err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `**Integration Notice:** The operational database encountered a communication issue (${err?.message || 'unknown error'}). Local cached ledger remains secure. Please retry query.`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Restock action
  const handleTriggerReorder = async (sku: string, quantity: number) => {
    handleSendMessage(`Schedule purchase order for ${quantity} units of ${sku}.`);
    setActiveTab('procurement');
  };

  // Dispatch action
  const handleDispatchPo = async (poId: string) => {
    handleSendMessage(`Authorize and dispatch purchase order ${poId} to the supplier.`);
  };

  // Dispatch all pending POs
  const handleDispatchAll = async () => {
    handleSendMessage(`Authorize and dispatch all pending purchase orders to suppliers now.`);
  };

  // Task status update
  const handleUpdateTaskStatus = async (taskId: string, status: any) => {
    try {
      const res = await fetch('/api/operations/task-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, status })
      });
      if (res.ok) {
        const data = await res.json();
        setOpState(data.state);
      }
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  // Direct stock adjustment
  const handleUpdateStock = async (sku: string, newStock: number) => {
    try {
      const res = await fetch('/api/operations/stock-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku, newStock })
      });
      if (res.ok) {
        const data = await res.json();
        setOpState(data.state);
      }
    } catch (err) {
      console.error('Failed to update stock:', err);
    }
  };

  // Voice Command Handlers
  const handleRestockKeyboardVoice = () => {
    handleTriggerReorder('SKU-102', 25);
    handleSendMessage("Schedule purchase order for 25 units of SKU-102 Wireless Mechanical Keyboard to restock inventory.");
    if (viewMode === 'analytics') {
      setActiveTab('procurement');
    }
  };

  const handleAnalyzeSalesVoice = () => {
    handleSendMessage("Analyze sales performance, gross revenue run-rate, and category anomaly diagnostics.");
    if (viewMode === 'analytics') {
      setActiveTab('sales');
    }
  };

  const handleDispatchOrdersVoice = () => {
    handleDispatchAll();
  };

  const handleMorningBriefingVoice = () => {
    handleSendMessage("Provide the executive morning operations briefing with revenue health and supply chain alerts.");
  };

  return (
    <div className="relative flex flex-col h-screen w-full bg-[#030712] text-slate-100 overflow-hidden font-sans selection:bg-cyan-500 selection:text-black">
      {viewMode === 'bridge' ? (
        /* Primary View: Futuristic Panoramic Sci-Fi Command Bridge Cockpit */
        <SciFiBridgeView
          state={opState}
          onRefresh={fetchState}
          onDispatchPo={handleDispatchPo}
          onDispatchAll={handleDispatchAll}
          onTriggerReorder={handleTriggerReorder}
          onOpenDataView={(tab) => {
            if (tab) setActiveTab(tab);
            setViewMode('analytics');
          }}
          onExecutePrompt={handleSendMessage}
          onOpenVoiceListener={() => setIsVoiceListenerOpen(true)}
        />
      ) : (
        /* Deep-Dive Operational Analytics & Autonomous Chat Terminal */
        <div className="flex flex-col h-full w-full">
          {/* Executive Header with Back to Bridge Toggle */}
          <ExecutiveHeader
            state={opState}
            onTriggerPrompt={handleSendMessage}
            isLoading={isLoading}
            onRefreshState={fetchState}
            currentViewMode="analytics"
            onToggleViewMode={() => setViewMode('bridge')}
            onOpenVoiceListener={() => setIsVoiceListenerOpen(true)}
          />

          {/* Main Dual-Pane Console */}
          <main className="flex-1 overflow-hidden p-2.5 sm:p-3 max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row gap-2.5 sm:gap-3">
            {/* Left Pane: Autonomous Briefing Terminal (Chat Feed) */}
            <section className="w-full lg:w-[48%] xl:w-[46%] h-full flex flex-col min-h-[420px] lg:min-h-0">
              <BriefingChat
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                onInspectTools={(tools) => setActiveToolChain(tools)}
                onOpenVoiceListener={() => setIsVoiceListenerOpen(true)}
              />
            </section>

            {/* Right Pane: Operations Command Center (Ledgers & Intelligence) */}
            <section className="w-full lg:w-[52%] xl:w-[54%] h-full flex flex-col min-h-[420px] lg:min-h-0">
              {/* Tabs Bar */}
              <div className="flex items-center gap-1.5 p-1 bg-[#050b14] border border-cyan-950 rounded-xl mb-2.5 shrink-0 font-cyber">
                <button
                  id="tab-btn-inventory"
                  onClick={() => setActiveTab('inventory')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'inventory'
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'text-slate-400 hover:text-cyan-200 border border-transparent'
                  }`}
                >
                  <Boxes className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="truncate">SUPPLY / STOCK</span>
                </button>

                <button
                  id="tab-btn-procurement"
                  onClick={() => setActiveTab('procurement')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'procurement'
                      ? 'bg-cyan-950/80 text-amber-300 border border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                      : 'text-slate-400 hover:text-amber-200 border border-transparent'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate">PURCHASE ORDERS</span>
                </button>

                <button
                  id="tab-btn-sales"
                  onClick={() => setActiveTab('sales')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'sales'
                      ? 'bg-cyan-950/80 text-emerald-300 border border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                      : 'text-slate-400 hover:text-emerald-200 border border-transparent'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate">REVENUE RADAR</span>
                </button>

                <button
                  id="tab-btn-priorities"
                  onClick={() => setActiveTab('priorities')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'priorities'
                      ? 'bg-cyan-950/80 text-red-300 border border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
                      : 'text-slate-400 hover:text-red-200 border border-transparent'
                  }`}
                >
                  <ListChecks className="w-3.5 h-3.5 text-red-400" />
                  <span className="truncate">QC & DIRECTIVES</span>
                </button>
              </div>

              {/* Active Tab View */}
              <div className="flex-1 overflow-hidden">
                {activeTab === 'inventory' && opState && (
                  <InventoryLedger
                    inventory={opState.inventory}
                    onTriggerReorder={handleTriggerReorder}
                    onUpdateStock={handleUpdateStock}
                  />
                )}

                {activeTab === 'procurement' && opState && (
                  <ProcurementQueue
                    purchaseOrders={opState.purchaseOrders}
                    onDispatchPo={handleDispatchPo}
                    onDispatchAll={handleDispatchAll}
                  />
                )}

                {activeTab === 'sales' && opState && (
                  <SalesIntelligence
                    summary={opState.salesSummary}
                    onInvestigateAnomaly={() =>
                      handleSendMessage("Why is Desk Accessories lagging? Give me anomaly data and competitor pricing.")
                    }
                  />
                )}

                {activeTab === 'priorities' && opState && (
                  <PriorityMatrix
                    tasks={opState.tasks}
                    rmaAlerts={opState.rmaAlerts}
                    onUpdateTaskStatus={handleUpdateTaskStatus}
                    onAskAboutTask={(prompt) => handleSendMessage(prompt)}
                  />
                )}
              </div>
            </section>
          </main>
        </div>
      )}

      {/* Tool Execution Chain Modal (Strict Grounding Verification) */}
      <ToolChainModal
        toolCalls={activeToolChain}
        onClose={() => setActiveToolChain(null)}
      />

      {/* Real-time Speech-to-Text Voice Command Listener Modal */}
      <VoiceCommandListener
        isOpen={isVoiceListenerOpen}
        onClose={() => setIsVoiceListenerOpen(false)}
        onExecuteCommand={(cmd) => handleSendMessage(cmd)}
        onRestockKeyboard={handleRestockKeyboardVoice}
        onAnalyzeSales={handleAnalyzeSalesVoice}
        onDispatchOrders={handleDispatchOrdersVoice}
        onMorningBriefing={handleMorningBriefingVoice}
      />
    </div>
  );
}
