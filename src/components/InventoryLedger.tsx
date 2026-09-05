import React from 'react';
import { InventoryItem } from '../types';
import { AlertCircle, CheckCircle2, Clock, Truck, Plus, Minus, ArrowUpRight, Cpu, Radio, Boxes, Sparkles, Activity } from 'lucide-react';
import { NexusWarehouseDroidAvatar } from './NexusWarehouseDroidAvatar';

interface InventoryLedgerProps {
  inventory: InventoryItem[];
  onTriggerReorder: (sku: string, quantity: number) => void;
  onUpdateStock: (sku: string, newStock: number) => void;
}

export const InventoryLedger: React.FC<InventoryLedgerProps> = ({
  inventory,
  onTriggerReorder,
  onUpdateStock
}) => {
  const criticalCount = inventory.filter(i => i.currentStock <= i.safetyMin * 0.5).length;
  const lowCount = inventory.filter(i => i.currentStock <= i.safetyMin && i.currentStock > i.safetyMin * 0.5).length;

  return (
    <div id="inventory-ledger-card" className="bg-[#050b14] border border-cyan-950 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full robotic-panel">
      {/* High-Tech Header with Nexus Warehouse Droid Avatar */}
      <div className="px-4 py-3 border-b border-cyan-950/80 bg-gradient-to-r from-[#061528] via-[#040e1c] to-[#030814] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <NexusWarehouseDroidAvatar className="w-11 h-11 ring-1 ring-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border border-slate-950 animate-ping" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border border-slate-950" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xs font-cyber font-bold tracking-wider text-cyan-200 uppercase flex items-center gap-1.5">
                NEXUS-08 <span className="text-[10px] font-tech text-cyan-400 bg-cyan-950/90 px-1.5 py-0.5 rounded border border-cyan-500/30">WAREHOUSE ANDROID</span>
              </h2>
              <span className="text-[10px] font-tech px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                {inventory.length} NODES MONITORED
              </span>
              {criticalCount > 0 && (
                <span className="text-[10px] font-tech px-2 py-0.5 rounded bg-red-950/70 text-red-400 border border-red-500/40 animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {criticalCount} CRITICAL ALERT
                </span>
              )}
            </div>
            <p className="text-[11px] font-tech text-slate-400">
              Autonomous robotic stocking, depletion velocity tracking & automated purchase triggers
            </p>
          </div>
        </div>

        {/* Real-time Subsystem Readout */}
        <div className="flex items-center gap-2.5 font-tech text-[10px]">
          <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 py-1 rounded border border-cyan-900/60 text-cyan-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>AGV CRANES: OPTIMAL</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 bg-slate-900/90 px-2 py-1 rounded border border-cyan-900/60 text-slate-300">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>DOCKS: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-x-auto p-3 bg-robotic-grid">
        <table className="w-full text-left text-xs text-slate-200 divide-y divide-cyan-950/80 font-tech">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-cyan-400/90 bg-[#040914]/90">
              <th className="px-3 py-2.5 font-cyber">SKU / ITEM DESIGNATION</th>
              <th className="px-3 py-2.5 font-cyber">STOCK LEVEL vs SAFETY BUFFER</th>
              <th className="px-3 py-2.5 font-cyber">BURN VELOCITY</th>
              <th className="px-3 py-2.5 font-cyber">DEPLETION HORIZON</th>
              <th className="px-3 py-2.5 font-cyber">VENDOR NODE</th>
              <th className="px-3 py-2.5 text-right font-cyber">ROBOTIC REORDER</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-950/40">
            {inventory.map((item) => {
              const daysRemaining = (item.currentStock / (item.dailyVelocity || 1)).toFixed(1);
              const isCritical = item.currentStock <= item.safetyMin * 0.5;
              const isLow = item.currentStock <= item.safetyMin;
              const pct = Math.min(100, Math.round((item.currentStock / (item.safetyMin * 2)) * 100));

              return (
                <tr 
                  key={item.sku}
                  id={`inventory-row-${item.sku}`}
                  className="hover:bg-cyan-950/30 transition-colors"
                >
                  {/* SKU & Name */}
                  <td className="px-3 py-2.5">
                    <div className="font-bold text-cyan-100 flex items-center gap-1.5">
                      <span>{item.sku}</span>
                      {isCritical ? (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950/80 text-red-300 border border-red-500/50 font-tech animate-pulse">
                          CRITICAL
                        </span>
                      ) : isLow ? (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-500/50 font-tech">
                          LOW_BUFFER
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-tech">
                          NOMINAL
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-300 truncate max-w-[190px] font-sans">
                      {item.name}
                    </div>
                  </td>

                  {/* Stock vs Safety Bar */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-bold ${isCritical ? 'text-red-400' : isLow ? 'text-amber-300' : 'text-cyan-100'}`}>
                        {item.currentStock} units
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        (Min: {item.safetyMin})
                      </span>
                    </div>

                    <div className="w-24 bg-cyan-950/60 h-1.5 rounded-full overflow-hidden border border-cyan-900/50">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isCritical ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]' : isLow ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]' : 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    {/* Stock Adjustment Telemetry */}
                    <div className="flex items-center gap-1 mt-1.5">
                      <button
                        title="Simulate stock reduction"
                        onClick={() => onUpdateStock(item.sku, Math.max(0, item.currentStock - 1))}
                        className="p-0.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-400 hover:text-cyan-200 border border-cyan-800/40 transition-colors"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="text-[10px] text-slate-500">sim</span>
                      <button
                        title="Simulate stock receipt"
                        onClick={() => onUpdateStock(item.sku, item.currentStock + 5)}
                        className="p-0.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-400 hover:text-cyan-200 border border-cyan-800/40 transition-colors"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </td>

                  {/* Velocity */}
                  <td className="px-3 py-2.5">
                    <div className="text-cyan-200 font-bold">
                      {item.dailyVelocity}/day
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Lead: {item.leadTimeDays}d
                    </div>
                  </td>

                  {/* Run-out Horizon */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span className={`font-bold ${Number(daysRemaining) <= 2 ? 'text-red-400 animate-pulse' : Number(daysRemaining) <= 4 ? 'text-amber-300' : 'text-slate-200'}`}>
                        {daysRemaining} days
                      </span>
                    </div>
                    {Number(daysRemaining) <= 2 && (
                      <span className="text-[10px] text-red-400 block font-bold">
                        EXHAUSTION IMMINENT
                      </span>
                    )}
                  </td>

                  {/* Supplier */}
                  <td className="px-3 py-2.5 text-xs text-slate-300 truncate max-w-[140px]">
                    {item.supplier}
                  </td>

                  {/* Action */}
                  <td className="px-3 py-2.5 text-right">
                    <button
                      id={`btn-reorder-${item.sku}`}
                      onClick={() => onTriggerReorder(item.sku, item.reorderQuantity)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-tech font-bold uppercase transition-all ${
                        isLow
                          ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                          : 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60'
                      }`}
                    >
                      <Truck className="w-3 h-3" />
                      AUTO_PO +{item.reorderQuantity}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

