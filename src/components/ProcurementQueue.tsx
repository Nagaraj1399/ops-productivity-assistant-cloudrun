import React from 'react';
import { PurchaseOrder } from '../types';
import { Send, CheckCircle2, Clock, AlertTriangle, FileText, ArrowRight, Cpu, Radio, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { TitanLogisticsDroidAvatar } from './TitanLogisticsDroidAvatar';

interface ProcurementQueueProps {
  purchaseOrders: PurchaseOrder[];
  onDispatchPo: (poId: string) => void;
  onDispatchAll: () => void;
}

export const ProcurementQueue: React.FC<ProcurementQueueProps> = ({
  purchaseOrders,
  onDispatchPo,
  onDispatchAll
}) => {
  const pendingOrders = purchaseOrders.filter(p => p.status === 'draft' || p.status === 'queued');
  const totalCommitment = purchaseOrders.reduce((acc, p) => acc + p.totalCost, 0);

  return (
    <div id="procurement-queue-card" className="bg-[#050b14] border border-cyan-950 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full robotic-panel">
      {/* High-Tech Header with Titan Logistics Droid Avatar */}
      <div className="px-4 py-3 border-b border-cyan-950/80 bg-gradient-to-r from-[#031d14] via-[#041410] to-[#020a07] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <TitanLogisticsDroidAvatar className="w-11 h-11 ring-1 ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950 animate-ping" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xs font-cyber font-bold tracking-wider text-emerald-200 uppercase flex items-center gap-1.5">
                TITAN-04 <span className="text-[10px] font-tech text-emerald-400 bg-emerald-950/90 px-1.5 py-0.5 rounded border border-emerald-500/30">LOGISTICS DROID</span>
              </h2>
              <span className="text-[10px] font-tech px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                ${totalCommitment.toLocaleString('en-US', { minimumFractionDigits: 2 })} PIPELINE
              </span>
            </div>
            <p className="text-[11px] font-tech text-slate-400">
              Autonomous purchase order fabrication & supplier dispatch conduits
            </p>
          </div>
        </div>

        {pendingOrders.length > 0 ? (
          <button
            id="dispatch-all-pos-btn"
            onClick={onDispatchAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-cyber font-bold uppercase shadow-lg shadow-emerald-950/50 transition-all border border-emerald-400/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>AUTHORIZE ALL DISPATCH ({pendingOrders.length})</span>
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 font-tech text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ALL POs COMMITTED</span>
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-robotic-grid">
        {purchaseOrders.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs font-tech">
            NO ACTIVE ORDERS IN ROBOTIC PIPELINE.
          </div>
        ) : (
          purchaseOrders.map((po) => {
            const isPending = po.status === 'draft' || po.status === 'queued';
            const isDispatched = po.status === 'dispatched';

            return (
              <div
                key={po.id}
                id={`po-card-${po.id}`}
                className="p-3.5 rounded-lg border border-cyan-950 bg-[#081220]/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-cyan-800/60 transition-colors shadow-md"
              >
                <div className="space-y-1 font-tech">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-200 text-xs font-cyber">
                      {po.id}
                    </span>
                    <span className="text-cyan-800">•</span>
                    <span className="text-xs text-cyan-400 font-semibold">
                      {po.sku}
                    </span>
                    <span className={`text-[9px] px-2 py-0.2 rounded uppercase tracking-wider ${
                      isDispatched
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-500/40 animate-pulse'
                    }`}>
                      {isDispatched ? 'DISPATCHED_TO_VENDOR' : 'QUEUED_FOR_EXEC'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-200 font-medium font-sans">
                    {po.itemName}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span>VOLUME: <strong className="text-cyan-200">{po.quantity} UNITS</strong></span>
                    <span>TOTAL: <strong className="text-cyan-200">${po.totalCost.toFixed(2)}</strong></span>
                    <span className="truncate max-w-[160px]">NODE: {po.supplier}</span>
                  </div>

                  {po.estimatedDelivery && (
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1 pt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>ETA TELEMETRY: {po.estimatedDelivery}</span>
                    </div>
                  )}
                </div>

                {/* Dispatch Button */}
                <div className="shrink-0 flex items-center gap-2 font-tech">
                  {isPending ? (
                    <button
                      id={`btn-dispatch-${po.id}`}
                      onClick={() => onDispatchPo(po.id)}
                      className="w-full sm:w-auto px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                    >
                      <Send className="w-3 h-3" />
                      [EXECUTE DISPATCH]
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      SUPPLIER_ACKNOWLEDGED
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

