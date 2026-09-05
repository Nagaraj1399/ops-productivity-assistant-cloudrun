import React from 'react';
import { OperationalTask, RmaAlert } from '../types';
import { CheckCircle2, Clock, AlertTriangle, AlertOctagon, User, ShieldAlert, ArrowRight, ListChecks, Radio, Cpu, Sparkles } from 'lucide-react';
import { SentinelQcDroidAvatar } from './SentinelQcDroidAvatar';

interface PriorityMatrixProps {
  tasks: OperationalTask[];
  rmaAlerts: RmaAlert[];
  onUpdateTaskStatus: (taskId: string, status: OperationalTask['status']) => void;
  onAskAboutTask: (taskTitle: string) => void;
}

export const PriorityMatrix: React.FC<PriorityMatrixProps> = ({
  tasks,
  rmaAlerts,
  onUpdateTaskStatus,
  onAskAboutTask
}) => {
  const pendingCount = tasks.filter(t => t.status !== 'completed').length;

  return (
    <div id="priority-matrix-card" className="bg-[#050b14] border border-cyan-950 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full robotic-panel">
      {/* High-Tech Header with Sentinel QC Droid Avatar */}
      <div className="px-4 py-3 border-b border-cyan-950/80 bg-gradient-to-r from-[#200808] via-[#140505] to-[#040202] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <SentinelQcDroidAvatar className="w-11 h-11 ring-1 ring-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-400 border border-slate-950 animate-ping" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-400 border border-slate-950" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xs font-cyber font-bold tracking-wider text-red-200 uppercase flex items-center gap-1.5">
                SENTINEL-07 <span className="text-[10px] font-tech text-red-400 bg-red-950/90 px-1.5 py-0.5 rounded border border-red-500/30">QC SENTINEL</span>
              </h2>
              <span className="text-[10px] font-tech px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/40">
                {pendingCount} DIRECTIVES PENDING
              </span>
            </div>
            <p className="text-[11px] font-tech text-slate-400">
              Autonomous obstacle triaging, RMA defect telemetry & cross-departmental robot directives
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-tech text-[10px]">
          <span className="px-2 py-1 rounded bg-red-950/80 text-red-300 border border-red-700/50">
            DEFECT MONITOR: ACTIVE
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-robotic-grid">
        {/* RMA / Quality Alert Banner if any */}
        {rmaAlerts.length > 0 && (
          <div className="p-3.5 rounded-lg border border-red-500/40 bg-red-950/20 space-y-2 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-cyber font-bold text-red-300 flex items-center gap-1.5 uppercase tracking-wide">
                <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />
                CRITICAL DEFECT SPIKE DETECTED ({rmaAlerts[0].id})
              </span>
              <span className="text-xs font-tech text-red-300 font-bold bg-red-950 px-2 py-0.5 rounded border border-red-500/30">
                RETURN RATE: {rmaAlerts[0].returnRate}% (BENCHMARK: {rmaAlerts[0].benchmarkRate}%)
              </span>
            </div>
            <p className="text-xs text-slate-200 font-sans">
              <strong className="text-red-300">{rmaAlerts[0].itemName} ({rmaAlerts[0].sku}):</strong> {rmaAlerts[0].primaryReason}
            </p>
            <button
              onClick={() => onAskAboutTask(`Audit RMA-${rmaAlerts[0].id} and review supplier defect claim.`)}
              className="text-[11px] font-tech text-red-300 hover:text-red-200 flex items-center gap-1 underline underline-offset-2 uppercase"
            >
              [EXECUTE COO VENDOR DEFECT INQUEST] →
            </button>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-3 font-tech">
          <span className="text-xs font-cyber uppercase tracking-wider text-cyan-300 font-bold block">
            EXECUTIVE DIRECTIVE QUEUE
          </span>

          {tasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isCritical = task.priority === 'critical';
            const isHigh = task.priority === 'high';

            return (
              <div
                key={task.id}
                id={`task-item-${task.id}`}
                className={`p-3.5 rounded-lg border transition-all ${
                  isCompleted
                    ? 'border-cyan-950/40 bg-[#081220]/40 opacity-60'
                    : isCritical
                    ? 'border-red-500/40 bg-red-950/20 shadow-md'
                    : isHigh
                    ? 'border-amber-500/40 bg-amber-950/20 shadow-md'
                    : 'border-cyan-950 bg-[#081220]/90 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyan-200 font-cyber">
                        {task.id}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded uppercase font-tech ${
                        isCritical
                          ? 'bg-red-950/80 text-red-300 font-bold border border-red-500/40 animate-pulse'
                          : isHigh
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-800/40'
                      }`}>
                        {task.priority.toUpperCase()}
                      </span>
                      <span className="text-[9px] text-slate-400 px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-900/40 uppercase">
                        NODE: {task.department}
                      </span>
                    </div>

                    <h4 className={`text-xs font-semibold font-sans ${isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                      {task.title}
                    </h4>
                  </div>

                  {/* Status Toggle */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onUpdateTaskStatus(task.id, isCompleted ? 'pending' : 'completed')}
                      className={`px-2.5 py-1 rounded text-xs font-bold uppercase transition-all flex items-center gap-1 ${
                        isCompleted
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {isCompleted ? 'RESOLVED' : '[RESOLVE]'}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-snug mb-2 font-sans">
                  {task.actionRequired}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-cyan-950/80">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 text-cyan-400" />
                    <span>OWNER: {task.assignedTo}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>DEADLINE: {task.dueDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

