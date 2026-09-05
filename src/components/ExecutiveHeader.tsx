import React from 'react';
import { ShieldCheck, Calendar, Zap, RefreshCw, Truck, AlertTriangle, CheckSquare, BarChart3, Bot, Cpu, Radio, Activity, Mic } from 'lucide-react';
import { OperationsState } from '../types';
import { AriaAvatar } from './AriaAvatar';

interface ExecutiveHeaderProps {
  state: OperationsState | null;
  onTriggerPrompt: (prompt: string) => void;
  isLoading: boolean;
  onRefreshState: () => void;
  currentViewMode?: 'bridge' | 'analytics';
  onToggleViewMode?: () => void;
  onOpenVoiceListener?: () => void;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  state,
  onTriggerPrompt,
  isLoading,
  onRefreshState,
  currentViewMode = 'bridge',
  onToggleViewMode,
  onOpenVoiceListener
}) => {
  const lowStockCount = state?.inventory.filter(i => i.currentStock <= i.safetyMin).length || 0;
  const draftPoCount = state?.purchaseOrders.filter(p => p.status === 'draft' || p.status === 'queued').length || 0;
  const grossSales = state?.salesSummary.grossSales ? `$${state.salesSummary.grossSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$14,250.00';
  const orders = state?.salesSummary.orderCount || 138;
  const aov = state?.salesSummary.aov ? `$${state.salesSummary.aov.toFixed(2)}` : '$103.26';

  return (
    <header id="executive-header" className="bg-[#050b14] border-b border-cyan-950/80 shrink-0 relative z-20 shadow-lg shadow-black/60">
      {/* Tactical Grid Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent" />

      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Robotic Agent Persona Identity */}
        <div className="flex items-center gap-3">
          {/* Robotic Chassis Avatar with Animated Optical Iris */}
          <div className="relative">
            <AriaAvatar className="w-11 h-11 ring-1 ring-cyan-500/50 shadow-[0_0_18px_rgba(6,182,212,0.4)]" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950 animate-ping" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-cyber font-bold tracking-wider text-base text-cyan-100 flex items-center gap-1.5 uppercase">
                CYBER-COO <span className="text-cyan-400 font-tech text-xs bg-cyan-950/90 px-1.5 py-0.5 rounded border border-cyan-500/30">ARIA MK-IV // ROBOTIC AGENT</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-tech font-bold uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                NEURAL LOOP ONLINE
              </span>
            </div>
            <p className="text-[11px] font-tech text-slate-400 tracking-wide flex items-center gap-2">
              <span>DESIGNATION: SYS-ROBOT-01</span>
              <span className="text-cyan-800">|</span>
              <span className="text-slate-300">AUTONOMOUS SUPPLY CHAIN & EXECUTIVE BOT</span>
            </p>
          </div>
        </div>

        {/* Robotic Subsystem Telemetry & Refresh */}
        <div className="flex items-center gap-2.5 text-xs">
          {/* Subsystem status badges */}
          <div className="hidden xl:flex items-center gap-2 font-tech text-[10px] text-cyan-300/80 bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-900/60">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span>CORE: 99.8%</span>
            </span>
            <span className="text-cyan-800">•</span>
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>SERVOS: NOMINAL</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1.5 rounded border border-cyan-900/50 text-cyan-200 font-tech text-xs shadow-inner">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>2026-09-03 // 08:00 LOCAL</span>
          </div>

          <button
            id="refresh-state-btn"
            onClick={onRefreshState}
            disabled={isLoading}
            title="Synchronize Robotic Operational Telemetry"
            className="p-1.5 rounded bg-slate-900/90 border border-cyan-900/50 text-cyan-400 hover:text-cyan-200 hover:bg-cyan-950/60 hover:border-cyan-500/50 transition-all disabled:opacity-50 flex items-center gap-1 font-tech text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden sm:inline text-[10px]">SYNC</span>
          </button>

          {onOpenVoiceListener && (
            <button
              id="header-voice-listener-btn"
              onClick={onOpenVoiceListener}
              title="Activate Real-Time Voice Command Listener"
              className="px-2.5 py-1.5 rounded bg-gradient-to-r from-cyan-950 to-purple-950/80 border border-cyan-400/60 hover:border-cyan-300 text-cyan-200 hover:text-white font-cyber text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] flex items-center gap-1.5 animate-pulse"
            >
              <Mic className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden sm:inline">VOICE COMMANDS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
            </button>
          )}

          {onToggleViewMode && (
            <button
              id="switch-view-mode-btn"
              onClick={onToggleViewMode}
              className="px-2.5 py-1.5 rounded bg-cyan-950/90 border border-cyan-500/60 hover:border-cyan-400 text-cyan-300 hover:text-white font-cyber text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] flex items-center gap-1.5"
            >
              <span>{currentViewMode === 'bridge' ? 'FULL LEDGERS' : '🛰️ BRIDGE COCKPIT'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Operations Telemetry Bar & Directive Presets */}
      <div className="bg-[#030712]/90 border-t border-cyan-950/60 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          {/* Live Robotic Metric Readouts */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-tech">
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-400/70 uppercase text-[11px]">GROSS REVENUE:</span>
              <span className="font-bold text-cyan-100 tracking-wider bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-900/40">{grossSales}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-400/70 uppercase text-[11px]">VOLUME / AOV:</span>
              <span className="text-slate-200">{orders} UNITS ({aov})</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-400/70 uppercase text-[11px]">BOTTLENECK SKUs:</span>
              <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${lowStockCount > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' : 'text-slate-300'}`}>
                {lowStockCount} LOW
              </span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-400/70 uppercase text-[11px]">PO QUEUE:</span>
              <span className="text-cyan-300 bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-800/40">{draftPoCount} PENDING</span>
            </div>
          </div>

          {/* Quick Robotic Directives */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
            <span className="text-[10px] font-tech text-cyan-400/80 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
              DIRECTIVES:
            </span>

            <button
              id="btn-trigger-morning-briefing"
              onClick={() => onTriggerPrompt("Give me the morning operational briefing.")}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/70 hover:bg-cyan-900/60 text-cyan-200 border border-cyan-500/40 text-xs font-tech transition-all shrink-0 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] disabled:opacity-50"
            >
              <Zap className="w-3 h-3 text-cyan-400" />
              EXEC_BRIEFING
            </button>

            <button
              id="btn-trigger-replenish"
              onClick={() => onTriggerPrompt("Replenish the low stock items immediately.")}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/50 hover:bg-amber-900/50 text-amber-200 border border-amber-500/40 text-xs font-tech transition-all shrink-0 hover:shadow-[0_0_10px_rgba(245,158,11,0.25)] disabled:opacity-50"
            >
              <Truck className="w-3 h-3 text-amber-400" />
              AUTO_RESTOCK
            </button>

            <button
              id="btn-trigger-dispatch-pos"
              onClick={() => onTriggerPrompt("Authorize and dispatch all pending purchase orders to suppliers now.")}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-200 border border-emerald-500/40 text-xs font-tech transition-all shrink-0 hover:shadow-[0_0_10px_rgba(16,185,129,0.25)] disabled:opacity-50"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              DISPATCH_POs
            </button>

            <button
              id="btn-trigger-anomalies"
              onClick={() => onTriggerPrompt("Run sales anomaly check and inspect the lagging sector.")}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-tech transition-colors shrink-0 disabled:opacity-50"
            >
              <BarChart3 className="w-3 h-3 text-cyan-400" />
              ANOMALY_SCAN
            </button>

            <button
              id="btn-trigger-priorities"
              onClick={() => onTriggerPrompt("What are today's daily management priorities?")}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-tech transition-colors shrink-0 disabled:opacity-50"
            >
              <CheckSquare className="w-3 h-3 text-cyan-400" />
              TASK_MATRIX
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

