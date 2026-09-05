import React from 'react';
import { ToolCallExecution } from '../types';
import { X, Terminal, CheckCircle2, AlertCircle, Cpu, Radio, ShieldCheck } from 'lucide-react';

interface ToolChainModalProps {
  toolCalls: ToolCallExecution[] | null;
  onClose: () => void;
}

export const ToolChainModal: React.FC<ToolChainModalProps> = ({ toolCalls, onClose }) => {
  if (!toolCalls || toolCalls.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div 
        id="tool-chain-modal-container"
        className="w-full max-w-2xl bg-[#050b14] border border-cyan-800 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[85vh] robotic-panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-950/80 bg-[#071224]/95">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-cyber font-bold text-cyan-200 tracking-wider uppercase">
                ROBOTIC ACTUATOR AUDIT TRACE
              </h3>
              <p className="text-[11px] font-tech text-slate-400">
                Ground truth telemetry ({toolCalls.length} sub-routine invocation{toolCalls.length > 1 ? 's' : ''})
              </p>
            </div>
          </div>
          <button
            id="close-tool-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-cyan-300 rounded hover:bg-cyan-950/50 border border-transparent hover:border-cyan-800/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 space-y-4 bg-robotic-grid font-tech">
          {toolCalls.map((call, idx) => {
            const hasError = call.result && call.result.error;
            return (
              <div 
                key={call.id || idx}
                id={`tool-call-card-${idx}`}
                className="rounded-lg border border-cyan-950 bg-[#081220]/90 p-4 space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-tech font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                      FRAME #{idx + 1}
                    </span>
                    <span className="text-xs font-cyber font-bold text-cyan-300 tracking-wide">
                      {call.toolName}()
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {hasError ? (
                      <span className="flex items-center gap-1 text-red-400">
                        <AlertCircle className="w-3.5 h-3.5" /> FAILED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> EXECUTED
                      </span>
                    )}
                    <span className="text-cyan-800">|</span>
                    <span className="text-[10px] text-slate-500">
                      {call.timestamp ? new Date(call.timestamp).toLocaleTimeString() : 'now'}
                    </span>
                  </div>
                </div>

                {/* Arguments */}
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-cyan-400/80 mb-1 font-cyber">
                    COMMAND BUS PAYLOAD:
                  </div>
                  <pre className="text-xs bg-[#030710] text-amber-300 p-2.5 rounded border border-cyan-950 overflow-x-auto">
                    {JSON.stringify(call.args, null, 2)}
                  </pre>
                </div>

                {/* Output Result */}
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-cyan-400/80 mb-1 font-cyber">
                    ACTUATOR RETURN TELEMETRY:
                  </div>
                  <pre className="text-xs bg-[#030710] text-emerald-300 p-2.5 rounded border border-cyan-950 overflow-x-auto max-h-48">
                    {JSON.stringify(call.result, null, 2)}
                  </pre>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-cyan-950/80 bg-[#071224] flex items-center justify-between text-xs text-slate-400 font-tech">
          <span className="text-[11px] text-cyan-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            PROTOCOL: DETERMINISTIC GROUNDED VERIFICATION
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs font-bold font-tech uppercase bg-cyan-950 hover:bg-cyan-900 text-cyan-200 rounded border border-cyan-800/60 transition-colors"
          >
            [CLOSE AUDIT]
          </button>
        </div>
      </div>
    </div>
  );
};

