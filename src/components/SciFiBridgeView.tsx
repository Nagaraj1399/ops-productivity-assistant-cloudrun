import React, { useState, useEffect } from 'react';
import { OperationsState, PurchaseOrder } from '../types';
import { SciFiBridgeBackground } from './SciFiBridgeBackground';
import { AriaAvatar } from './AriaAvatar';
import { TacticalRobotAvatar } from './TacticalRobotAvatar';
import { sciFiAudio } from '../utils/audioEffects';
import { 
  Volume2, 
  VolumeX, 
  Terminal, 
  Maximize2, 
  Minimize2, 
  X, 
  Send, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  RotateCw, 
  Radio, 
  ShieldAlert,
  Zap,
  Activity,
  Layers,
  Truck,
  Mic
} from 'lucide-react';

interface SciFiBridgeViewProps {
  state: OperationsState;
  onRefresh: () => void;
  onDispatchPo: (poId: string) => void;
  onDispatchAll: () => void;
  onTriggerReorder: (sku: string, qty: number) => void;
  onOpenDataView: (tab?: 'inventory' | 'procurement' | 'sales' | 'priorities') => void;
  onExecutePrompt: (prompt: string) => void;
  onOpenVoiceListener?: () => void;
}

export const SciFiBridgeView: React.FC<SciFiBridgeViewProps> = ({
  state,
  onRefresh,
  onDispatchPo,
  onDispatchAll,
  onTriggerReorder,
  onOpenDataView,
  onExecutePrompt,
  onOpenVoiceListener
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sciFiAudio.getIsMuted());
  const [tacticalOverrideActive, setTacticalOverrideActive] = useState<boolean>(false);
  const [autonomousHandoffActive, setAutonomousHandoffActive] = useState<boolean>(true);
  const [purgingPoId, setPurgingPoId] = useState<string | null>(null);
  const [radarAngle, setRadarAngle] = useState<number>(0);
  const [terminalMinimized, setTerminalMinimized] = useState<boolean>(false);
  const [terminalInput, setTerminalInput] = useState<string>('');

  // Radar sweep animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle((prev) => (prev + 3) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Play ARIA directive voice
  const handleAriaVoice = () => {
    if (isSpeaking) {
      sciFiAudio.stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    const directive = "Commander, purchase orders 102-1826 and 205-3605 are ready for dispatch. Strategic overview recommends immediate approval.";
    sciFiAudio.playRadarPing();
    sciFiAudio.speakDirective(
      directive,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleToggleSound = () => {
    const muted = sciFiAudio.toggleMute();
    setIsMuted(muted);
  };

  // Tactical Toggle 1: Autonomous AI Dispatch
  const handleToggleAutonomous = () => {
    const next = !autonomousHandoffActive;
    setAutonomousHandoffActive(next);
    sciFiAudio.playSwitch(next);
  };

  // Tactical Toggle 2: Tactical Override Mode
  const handleToggleOverride = () => {
    const next = !tacticalOverrideActive;
    setTacticalOverrideActive(next);
    sciFiAudio.playSwitch(next);
  };

  // Dispatch with disintegrating particle effect
  const handleDispatchCard = (poId: string) => {
    sciFiAudio.playAuthorize();
    setPurgingPoId(poId);
    setTimeout(() => {
      onDispatchPo(poId);
      setPurgingPoId(null);
    }, 1200);
  };

  // Terminal manual prompt submission
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    sciFiAudio.playClick();
    onExecutePrompt(terminalInput.trim());
    setTerminalInput('');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#030712] font-tech select-none flex flex-col justify-between">
      {/* 1. Cinematic Panoramic Sci-Fi Command Bridge Background */}
      <SciFiBridgeBackground />

      {/* 2. Top Executive Telemetry HUD Bar */}
      <header className="relative z-30 w-full px-3 py-2 flex items-center justify-between bg-[#040814]/85 border-b border-cyan-950/80 backdrop-blur-md shadow-2xl">
        {/* Left Circular Speedo Gauge & Telemetry Chips */}
        <div className="flex items-center gap-2.5">
          {/* Circular Gauge Left (305) */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" stroke="#1e293b" strokeWidth="3" fill="none" />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="url(#neonPurpleCyan)"
                strokeWidth="3.5"
                strokeDasharray="125"
                strokeDashoffset="35"
                strokeLinecap="round"
                fill="none"
              />
              <defs>
                <linearGradient id="neonPurpleCyan" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#d946ef" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-cyber">
              <span className="text-xs font-bold text-cyan-200">305</span>
            </div>
          </div>

          {/* Left KPI Telemetry */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="text-cyan-300 font-cyber drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                ${state.salesSummary.grossSales.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </span>
              <span className="text-fuchsia-400 font-cyber">186</span>
              <span className="text-cyan-400 text-[10px]">SKUs</span>
              <span className="text-amber-400 font-cyber">{state.salesSummary.aov.toFixed(2)}</span>
              <span className="text-emerald-400 text-[10px]">Stags</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-tech">
              <span>Gross Sales: <strong className="text-cyan-200">${state.salesSummary.grossSales.toFixed(2)}</strong></span>
              <span className="text-cyan-800">|</span>
              <span>Order / <strong className="text-slate-200">{state.salesSummary.orderCount} orders</strong></span>
              <span className="text-cyan-800">|</span>
              <span className="text-amber-300">Low Stock: {state.inventory.filter(i => i.currentStock <= i.safetyMin).length} SKUs</span>
            </div>
          </div>
        </div>

        {/* Center: Glowing Circular Tactical Radar HUD */}
        <div className="relative w-14 h-14 flex items-center justify-center">
          <div className="relative w-12 h-12 rounded-full border border-cyan-500/50 bg-cyan-950/40 p-1 shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center overflow-hidden">
            {/* Radar Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-[0.5px] bg-cyan-500/40" />
              <div className="h-full w-[0.5px] bg-cyan-500/40 absolute" />
            </div>
            {/* Distance Concentric Circles */}
            <div className="w-8 h-8 rounded-full border border-cyan-500/30 absolute" />
            <div className="w-4 h-4 rounded-full border border-cyan-500/40 absolute" />
            
            {/* Blip dots */}
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 absolute top-2 right-3 animate-ping" />
            <div className="w-1 h-1 rounded-full bg-emerald-400 absolute bottom-3 left-3" />
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 absolute top-4 left-2" />

            {/* Sweep Beam */}
            <div
              className="absolute w-6 h-6 origin-bottom-right"
              style={{
                top: 0,
                left: 0,
                transform: `rotate(${radarAngle}deg)`,
                background: 'conic-gradient(from 0deg, rgba(6,182,212,0.6) 0deg, transparent 60deg)'
              }}
            />
          </div>
        </div>

        {/* Right Telemetry Values & Quick Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Right Metrics */}
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2 text-xs font-bold font-cyber">
              <span className="text-fuchsia-400">303,360</span>
              <span className="text-cyan-300">169</span>
              <span className="text-cyan-400 text-[10px]">SKUs</span>
              <span className="text-amber-400 text-[11px]">307.alm Goo L...</span>
            </div>

            {/* Quick Sci-Fi Action Buttons from reference image */}
            <div className="flex items-center gap-1.5 mt-0.5">
              {onOpenVoiceListener && (
                <button
                  id="btn-hud-voice-listener"
                  onClick={onOpenVoiceListener}
                  className="px-2 py-0.5 rounded bg-gradient-to-r from-cyan-950 to-purple-950 border border-cyan-400/60 hover:border-cyan-300 text-cyan-200 hover:text-white text-[10px] font-bold font-cyber uppercase tracking-wider shadow-sm transition-all hover:shadow-[0_0_12px_rgba(6,182,212,0.6)] flex items-center gap-1 animate-pulse"
                  title="Engage Real-Time Speech-to-Text Listener"
                >
                  <Mic className="w-2.5 h-2.5 text-cyan-300" />
                  <span>VOICE MIC</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                </button>
              )}

              <button
                id="btn-hud-morning-briefing"
                onClick={handleAriaVoice}
                className="px-2 py-0.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold font-tech uppercase tracking-wider shadow-sm transition-all hover:shadow-[0_0_8px_rgba(6,182,212,0.5)] flex items-center gap-1"
              >
                <Zap className="w-2.5 h-2.5" />
                <span>+ Morning Briefing</span>
              </button>

              <button
                id="btn-hud-replenish"
                onClick={() => {
                  sciFiAudio.playClick();
                  onOpenDataView('inventory');
                }}
                className="px-2 py-0.5 rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 text-[10px] font-bold font-tech uppercase tracking-wider shadow-sm transition-all hover:shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              >
                Replenish Low Stock
              </button>

              <button
                id="btn-hud-dispatch-pos"
                onClick={() => {
                  sciFiAudio.playAuthorize();
                  onDispatchAll();
                }}
                className="px-2 py-0.5 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold font-tech uppercase tracking-wider shadow-sm transition-all hover:shadow-[0_0_8px_rgba(16,185,129,0.5)] flex items-center gap-1"
              >
                <Truck className="w-2.5 h-2.5" />
                Dispatch POs
              </button>

              <button
                id="btn-hud-anomaly-dive"
                onClick={() => {
                  sciFiAudio.playClick();
                  onOpenDataView('sales');
                }}
                className="px-2 py-0.5 rounded bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-[10px] font-bold font-tech uppercase tracking-wider shadow-sm transition-all hover:shadow-[0_0_8px_rgba(168,85,247,0.5)]"
              >
                Anomaly Dive
              </button>
            </div>
          </div>

          {/* Right Circular Gauge (357) */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" stroke="#1e293b" strokeWidth="3" fill="none" />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="url(#neonAmberCyan)"
                strokeWidth="3.5"
                strokeDasharray="125"
                strokeDashoffset="25"
                strokeLinecap="round"
                fill="none"
              />
              <defs>
                <linearGradient id="neonAmberCyan" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-cyber">
              <span className="text-xs font-bold text-amber-300">357</span>
            </div>
          </div>

          {/* Sound & Data View Toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleSound}
              title={isMuted ? "Enable Audio Feedback" : "Mute Audio Feedback"}
              className="p-1.5 rounded bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
            </button>

            <button
              id="btn-toggle-analytics-matrix"
              onClick={() => onOpenDataView('inventory')}
              className="px-2.5 py-1 rounded bg-cyan-900/60 hover:bg-cyan-800 border border-cyan-500/50 text-cyan-200 text-xs font-cyber font-bold tracking-wider uppercase transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] flex items-center gap-1"
            >
              <Layers className="w-3 h-3" />
              <span>Full Telemetry</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Center Workspace with Floating Holographic Cards */}
      <div className="relative z-20 flex-1 w-full max-w-[1720px] mx-auto px-4 py-2 flex flex-col justify-between overflow-hidden">
        {/* Upper Zone: ARIA Directive on Left, Robotic Execution AI & PO Cards on Right */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 items-start pt-2">
          
          {/* Left Column (5 Cols): ARIA Strategic Directive + Disposable Protocol Deck */}
          <div className="lg:col-span-5 space-y-3">
            {/* ARIA Strategic Directive Card */}
            <div 
              id="aria-directive-hologram"
              className="relative p-3.5 rounded-xl border border-cyan-500/50 bg-[#061224]/85 backdrop-blur-md shadow-[0_0_25px_rgba(6,182,212,0.25)] robotic-panel"
            >
              <div className="flex items-start gap-3">
                {/* Robot Avatar */}
                <AriaAvatar isSpeaking={isSpeaking} className="w-20 h-20 shrink-0" />

                {/* Directive Content */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-cyber font-bold text-cyan-300 tracking-wider uppercase flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      ARIA: STRATEGIC DIRECTIVE
                    </h3>

                    {/* Soundwave Frequency Bars */}
                    <button
                      onClick={handleAriaVoice}
                      title="Speak Directive"
                      className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 hover:border-cyan-400 text-cyan-300 transition-colors"
                    >
                      <div className="flex items-end gap-0.5 h-3.5 w-8">
                        <span className={`w-1 bg-cyan-400 rounded-xs transition-all ${isSpeaking ? 'h-3 animate-pulse' : 'h-1.5'}`} />
                        <span className={`w-1 bg-cyan-400 rounded-xs transition-all ${isSpeaking ? 'h-3.5 animate-pulse' : 'h-2.5'}`} />
                        <span className={`w-1 bg-cyan-400 rounded-xs transition-all ${isSpeaking ? 'h-2 animate-pulse' : 'h-1'}`} />
                        <span className={`w-1 bg-cyan-400 rounded-xs transition-all ${isSpeaking ? 'h-3 animate-pulse' : 'h-2'}`} />
                      </div>
                      <Volume2 className="w-3 h-3 ml-1 text-cyan-400" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-200 font-sans leading-relaxed">
                    Commander, <strong className="text-cyan-300 font-tech">PO-102-1826</strong> & <strong className="text-cyan-300 font-tech">PO-205-3605</strong> are ready for dispatch. Strategic overview recommends approval.
                  </p>

                  {/* Hexagonal Cyber Pattern under text */}
                  <div className="flex items-center gap-1 pt-1 opacity-70">
                    <div className="w-3 h-3 border border-cyan-500/40 rotate-45" />
                    <div className="w-3 h-3 border border-cyan-500/40 rotate-45" />
                    <div className="w-3 h-3 border border-cyan-500/40 rotate-45" />
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-500/40 to-transparent" />
                    <span className="text-[9px] font-tech text-cyan-400/80">NEURAL FEED 04.9</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Disposable Protocol Deck (Terminal Frame) */}
            <div 
              id="disposable-protocol-deck"
              className={`relative rounded-xl border border-cyan-500/50 bg-[#040a16]/90 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)] overflow-hidden transition-all robotic-panel ${
                terminalMinimized ? 'h-10' : 'h-64'
              }`}
            >
              {/* Terminal Window Header */}
              <div className="px-3 py-1.5 border-b border-cyan-950 bg-[#071224] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-cyber font-bold text-cyan-300 tracking-wider">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>DISPOSABLE PROTOCOL DECK</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400">
                  <button 
                    onClick={() => setTerminalMinimized(!terminalMinimized)} 
                    className="p-1 hover:text-cyan-300 transition-colors"
                  >
                    {terminalMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                  </button>
                  <button 
                    onClick={() => onExecutePrompt("Show current warehouse telemetry and active orders.")}
                    className="p-1 hover:text-cyan-300 transition-colors"
                    title="Reset Feed"
                  >
                    <RotateCw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {!terminalMinimized && (
                <div className="p-3 flex flex-col h-[calc(100%-2.25rem)] justify-between font-tech text-xs">
                  {/* Commentary from IMAGE */}
                  <div className="space-y-1.5 overflow-y-auto pr-1 text-slate-300">
                    <div className="text-[11px] text-cyan-400 font-bold uppercase">
                      Commentary from IMAGE, e.g. terminal:
                    </div>
                    <div className="text-amber-300 font-bold">
                      Replenish SKU-1023!
                    </div>
                    <div className="text-slate-300 text-xs leading-relaxed">
                      Replenish the low stock items immediately:
                    </div>
                    <ul className="space-y-1 pl-2 text-xs">
                      <li className="flex items-start gap-1.5">
                        <span className="text-cyan-400">•</span>
                        <span><strong className="text-cyan-200">PO-102-1826:</strong> 25 units of Wireless Mechanical Keyboard with Venogistics.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-cyan-400">•</span>
                        <span><strong className="text-cyan-200">PO-205-3605:</strong> 15 units of USB-C Dock with Vendor Logistics.</span>
                      </li>
                    </ul>
                    <p className="text-[11px] text-slate-400 italic pt-1">
                      Estimated supplier confirmation -&gt; Warehouse inventory alerts will clear once deliveries are received.
                    </p>
                  </div>

                  {/* Terminal Command Input Form */}
                  <form onSubmit={handleTerminalSubmit} className="mt-2 flex items-center gap-1.5 pt-2 border-t border-cyan-950/80">
                    <span className="text-cyan-400 font-bold">&gt;</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder="Dispatch PO-205-3605 or type operational directive..."
                      className="flex-1 bg-transparent border-none outline-none text-cyan-200 placeholder:text-slate-600 text-xs font-tech"
                    />
                    {onOpenVoiceListener && (
                      <button
                        type="button"
                        id="protocol-deck-voice-btn"
                        onClick={onOpenVoiceListener}
                        title="Voice Command Listener (Speak 'restock keyboard' or 'analyze sales')"
                        className="p-1.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 transition-all flex items-center justify-center hover:shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                      >
                        <Mic className="w-3 h-3 text-cyan-400 animate-pulse" />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="p-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (7 Cols): Robotic Execution AI + Floating PO Cards */}
          <div className="lg:col-span-7 space-y-3">
            {/* Top Right: Robotic Execution AI Avatar Card */}
            <div 
              id="robotic-execution-ai-card"
              className="relative p-2.5 rounded-xl border border-blue-500/40 bg-[#061224]/85 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.2)] flex items-center justify-between gap-3 robotic-panel"
            >
              <div className="flex items-center gap-3">
                <TacticalRobotAvatar className="w-14 h-14 shrink-0" />
                <div>
                  <h4 className="text-xs font-cyber font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    Robotic Execution AI
                  </h4>
                  <p className="text-xs text-slate-200 font-sans mt-0.5">
                    Warehouse robots are ready for payload handoff upon authorization.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={onDispatchAll}
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-cyber font-bold tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                >
                  Authorize All
                </button>
              </div>
            </div>

            {/* Stack of Floating Holographic Purchase Order Cards */}
            <div className="space-y-2.5">
              {/* Card 1: PO-205-3605 [QUEUED] with Dissolving Digital Particle Purge Effect */}
              <div 
                id="po-card-205-3605"
                className={`relative p-3 rounded-xl border border-cyan-500/60 bg-[#050f20]/90 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center justify-between gap-3 transition-all ${
                  purgingPoId === 'PO-205-3605' ? 'border-cyan-300 ring-2 ring-cyan-400/50' : ''
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-cyber font-bold text-cyan-200 text-xs tracking-wide">
                      PO-205-3605
                    </span>
                    <span className="text-cyan-700">•</span>
                    <span className="text-xs font-tech text-cyan-400 font-bold">
                      SKU-205
                    </span>
                    <span className="text-[9px] font-cyber px-2 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-500/50 uppercase tracking-wider animate-pulse">
                      QUEUED
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-100 font-sans">
                    Wireless Mechanical Keyboard
                  </div>
                  <div className="text-[11px] text-slate-400 font-tech">
                    Keyboard
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-300 font-tech">
                    <span>Qty: <strong className="text-cyan-200">25 units</strong></span>
                    <span>Cost: <strong className="text-cyan-200">$135.00</strong></span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      2 business days
                    </span>
                  </div>
                </div>

                {/* Right side: Dissolving digital particle effect & Purge button */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {purgingPoId === 'PO-205-3605' ? (
                    <div className="text-right animate-pulse">
                      <span className="text-[10px] font-tech font-bold text-cyan-300 block flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
                        PO-205-3605 DISPATCH PROTOCOL COMPLETE...
                      </span>
                      <span className="text-[9px] font-tech text-emerald-400">
                        PURGING NODE...
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end gap-1">
                      <button
                        onClick={() => handleDispatchCard('PO-205-3605')}
                        className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-cyber font-bold tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)] flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        Dispatch Node
                      </button>
                      <span className="text-[9px] text-cyan-400/80 font-tech">
                        Autonomous Handoff Ready
                      </span>
                    </div>
                  )}

                  {/* Visual Particle Dissolve Effect Graphic */}
                  <div className="relative w-28 h-6 overflow-hidden flex items-center justify-end">
                    <div className="flex gap-1">
                      <span className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
                      <span className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" />
                      <span className="w-1 h-1 bg-cyan-500 rounded-full" />
                      <span className="w-2 h-0.5 bg-cyan-300 rounded-xs" />
                      <span className="w-1 h-1 bg-cyan-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: PO-102-9841 [DISPATCHED] Awaiting Tactical Override */}
              <div 
                id="po-card-102-9841"
                className="relative p-3 rounded-xl border border-cyan-800/60 bg-[#050f20]/90 backdrop-blur-md shadow-md flex items-center justify-between gap-3 hover:border-cyan-600 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-cyber font-bold text-cyan-200 text-xs tracking-wide">
                      PO-102-9841
                    </span>
                    <span className="text-cyan-700">•</span>
                    <span className="text-xs font-tech text-cyan-400 font-bold">
                      SKU-102
                    </span>
                    <span className="text-[9px] font-cyber px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 uppercase tracking-wider">
                      DISPATCHED
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-100 font-sans">
                    USB-C Dual Dock
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-300 font-tech">
                    <span>Qty: <strong className="text-cyan-200">15 units</strong></span>
                    <span>Cost: <strong className="text-cyan-200">$1,750.00</strong></span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      2 business days
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[11px] font-cyber font-bold text-amber-300 tracking-wider block drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]">
                    AWAITING TACTICAL OVERRIDE
                  </span>
                  <span className="text-[9px] font-tech text-slate-400 block">
                    Vendor Node: Venogistics
                  </span>
                </div>
              </div>

              {/* Card 3: PO-205-9842 [DISPATCHED] Awaiting Tactical Override */}
              <div 
                id="po-card-205-9842"
                className="relative p-3 rounded-xl border border-cyan-800/60 bg-[#050f20]/90 backdrop-blur-md shadow-md flex items-center justify-between gap-3 hover:border-cyan-600 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-cyber font-bold text-cyan-200 text-xs tracking-wide">
                      PO-205-9842
                    </span>
                    <span className="text-cyan-700">•</span>
                    <span className="text-xs font-tech text-cyan-400 font-bold">
                      SKU-102
                    </span>
                    <span className="text-[9px] font-cyber px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 uppercase tracking-wider">
                      DISPATCHED
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-100 font-sans">
                    Wireless Mechanical Keyboard
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-300 font-tech">
                    <span>Qty: <strong className="text-cyan-200">25 units</strong></span>
                    <span>Cost: <strong className="text-cyan-200">$1,250.00</strong></span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      3 business days
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[11px] font-cyber font-bold text-amber-300 tracking-wider block drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]">
                    AWAITING TACTICAL OVERRIDE
                  </span>
                  <span className="text-[9px] font-tech text-slate-400 block">
                    Vendor Node: Global Keyboards
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Lower Foreground Console: "Operation Deck" Table Mounted Glass Console */}
        <div className="w-full flex justify-center pb-2 pt-2">
          <div 
            id="operation-deck-console"
            className="relative w-full max-w-4xl p-3.5 rounded-2xl border border-cyan-500/60 bg-[#07152b]/95 backdrop-blur-xl shadow-[0_0_35px_rgba(6,182,212,0.3)] flex flex-col md:flex-row items-center justify-between gap-4 robotic-panel transform perspective-1000 rotate-x-2"
          >
            {/* Left Hologram: Speedometer Arc Dial (80.1%) & Hex Cells */}
            <div className="flex items-center gap-4">
              {/* Dial Arc */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r="24" stroke="#0e2238" strokeWidth="4" fill="none" />
                  <circle
                    cx="30"
                    cy="30"
                    r="24"
                    stroke="url(#deckArcGrad)"
                    strokeWidth="4"
                    strokeDasharray="150"
                    strokeDashoffset="30"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <defs>
                    <linearGradient id="deckArcGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="50%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-cyber">
                  <span className="text-xs font-bold text-cyan-200">80.1%</span>
                  <span className="text-[8px] text-cyan-400/80">EFF</span>
                </div>
              </div>

              {/* Title & Hexagonal Battery Cells */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-cyber font-bold text-cyan-300 tracking-wider uppercase">
                    Operation Deck
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                    LIVE
                  </span>
                </div>

                {/* Hex Pattern */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <div className="w-3.5 h-3.5 rounded-xs bg-cyan-500/20 border border-cyan-400 rotate-45 flex items-center justify-center">
                    <span className="w-1 h-1 bg-cyan-400 rounded-full" />
                  </div>
                  <div className="w-3.5 h-3.5 rounded-xs bg-cyan-500/20 border border-cyan-400 rotate-45 flex items-center justify-center">
                    <span className="w-1 h-1 bg-cyan-400 rounded-full" />
                  </div>
                  <div className="w-3.5 h-3.5 rounded-xs bg-cyan-500/20 border border-cyan-400 rotate-45 flex items-center justify-center">
                    <span className="w-1 h-1 bg-cyan-400 rounded-full" />
                  </div>
                  <span className="text-[10px] text-slate-400 ml-1">Sub-cells synchronized</span>
                </div>
              </div>
            </div>

            {/* Middle: Mini Live Output Chart & Nodes */}
            <div className="hidden sm:flex items-center gap-4 px-4 py-1.5 rounded-lg border border-cyan-950 bg-[#040c1a]">
              <div className="space-y-1">
                <span className="text-[9px] font-cyber text-cyan-400/90 uppercase tracking-wider block">
                  DAILY OUTPUT MATRIX
                </span>
                <div className="flex items-end gap-1.5 h-7">
                  <div className="w-2.5 bg-cyan-500/70 h-4 rounded-xs" />
                  <div className="w-2.5 bg-cyan-500/90 h-6 rounded-xs" />
                  <div className="w-2.5 bg-cyan-400 h-7 rounded-xs animate-pulse" />
                  <div className="w-2.5 bg-amber-400/80 h-5 rounded-xs" />
                  <div className="w-2.5 bg-cyan-500/80 h-4.5 rounded-xs" />
                </div>
              </div>

              <div className="space-y-1 text-[10px] font-tech text-slate-400 pl-3 border-l border-cyan-950">
                <div>SERVER: <strong className="text-emerald-400">ONLINE (100%)</strong></div>
                <div>SPHERE: <strong className="text-cyan-300">GEO-SYNC</strong></div>
                <div>FIRMWARE: <strong className="text-amber-300">v4.8-ROBOTIC</strong></div>
              </div>
            </div>

            {/* Right: Tactile Illuminated Physical Pill Switches from reference image! */}
            <div className="flex items-center gap-3">
              {/* Cyan Tactile Pill Switch: Autonomous Handoff */}
              <button
                id="tactile-switch-cyan"
                onClick={handleToggleAutonomous}
                title="Autonomous AI Dispatch Relay"
                className={`relative w-16 h-8 rounded-full transition-all flex items-center p-1 border ${
                  autonomousHandoffActive
                    ? 'bg-cyan-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                    : 'bg-slate-900 border-slate-700 opacity-60'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full transition-transform transform ${
                    autonomousHandoffActive
                      ? 'translate-x-8 bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                      : 'translate-x-0 bg-slate-500'
                  }`}
                />
              </button>

              {/* Amber Tactile Pill Switch: Tactical Override */}
              <button
                id="tactile-switch-amber"
                onClick={handleToggleOverride}
                title="Tactical Executive Override"
                className={`relative w-16 h-8 rounded-full transition-all flex items-center p-1 border ${
                  tacticalOverrideActive
                    ? 'bg-amber-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                    : 'bg-slate-900 border-slate-700 opacity-60'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full transition-transform transform ${
                    tacticalOverrideActive
                      ? 'translate-x-8 bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                      : 'translate-x-0 bg-slate-500'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
