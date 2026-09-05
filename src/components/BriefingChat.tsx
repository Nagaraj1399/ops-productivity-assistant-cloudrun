import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Send, Terminal, Sparkles, ArrowRight, CornerDownLeft, ShieldAlert, Cpu, Mic, MicOff, AlertCircle, Radio, X, Bot, User, Volume2, VolumeX, Flame } from 'lucide-react';
import { ChatMessage, ToolCallExecution } from '../types';
import { AriaAvatar } from './AriaAvatar';
import { CyberOperatorAvatar } from './CyberOperatorAvatar';

interface BriefingChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onInspectTools: (tools: ToolCallExecution[]) => void;
  onOpenVoiceListener?: () => void;
}

export const BriefingChat: React.FC<BriefingChatProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onInspectTools,
  onOpenVoiceListener
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const isSpeechRecognitionSupported = typeof window !== 'undefined' && 
    Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Cleanup speech recognition and synthesis on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Robotic Voice Synthesizer
  const speakRoboticResponse = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Strip markdown formatting for cleaner robotic speech
    const cleanText = text
      .replace(/\*\*|__|[*_#`]/g, '')
      .replace(/\|.*\|/g, '')
      .replace(/\[.*?\]/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 0.95; // slightly deeper synthetic tone

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!isSpeechRecognitionSupported) {
      setVoiceFeedback('Web Speech API is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceFeedback(null);
      };

      recognition.onresult = (event: any) => {
        let finalChunk = '';
        let interimChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += transcript;
          } else {
            interimChunk += transcript;
          }
        }

        if (finalChunk.trim()) {
          setInputPrompt((prev) => {
            const cleanPrev = prev.trim();
            return cleanPrev ? `${cleanPrev} ${finalChunk.trim()}` : finalChunk.trim();
          });
        }
        setInterimTranscript(interimChunk);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition warning:', event.error);
        if (event.error === 'not-allowed') {
          setVoiceFeedback('Microphone permission was denied. Please allow microphone access in browser settings.');
        } else if (event.error === 'no-speech') {
          // Keep listening or allow silence
        } else {
          setVoiceFeedback(`Audio recognition status: ${event.error}`);
        }
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.start();
    } catch (err: any) {
      console.error('Failed to initialize speech recognition:', err);
      setVoiceFeedback('Unable to initialize speech recognition engine.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  };

  const toggleVoiceInput = () => {
    if (onOpenVoiceListener) {
      onOpenVoiceListener();
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;
    if (isListening) {
      stopListening();
    }
    onSendMessage(inputPrompt.trim());
    setInputPrompt('');
    setInterimTranscript('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div id="briefing-chat-container" className="flex flex-col h-full bg-[#050b14] border border-cyan-950 rounded-xl overflow-hidden shadow-2xl relative robotic-panel">
      {/* Feed Header / High-Tech Robotic HUD Banner with ARIA Avatar */}
      <div className="px-4 py-3 border-b border-cyan-950/80 bg-gradient-to-r from-[#07152b] via-[#050f1d] to-[#040a14] flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          {/* ARIA Robotic Avatar in Header */}
          <div className="relative">
            <AriaAvatar className="w-10 h-10 ring-1 ring-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.4)]" isSpeaking={isSpeaking} />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-cyber font-bold text-xs tracking-wider text-cyan-200 uppercase flex items-center gap-1.5">
                ARIA MK-IV <span className="text-[10px] font-tech text-cyan-400 bg-cyan-950/90 px-1.5 py-0.5 rounded border border-cyan-500/40">ROBOTIC COO</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-tech font-bold uppercase bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                NEURAL LINK ACTIVE
              </span>
            </div>
            <p className="text-[10px] font-tech text-slate-400 flex items-center gap-1.5">
              <span>DESIGNATION: SYS-ROBOT-01</span>
              <span className="text-cyan-800">•</span>
              <span className="text-cyan-300/80 font-mono">AUTONOMOUS LOGISTICS AI</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-tech text-[10px]">
          {/* Robotic Voice Status Indicator */}
          {isSpeaking ? (
            <button
              onClick={() => speakRoboticResponse('')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-900/50 text-cyan-300 border border-cyan-500/50 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.4)]"
              title="Stop robotic voice synthesis"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold">TRANSMITTING AUDIO...</span>
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-full bg-cyan-400 animate-pulse" />
                <span className="w-0.5 h-2/3 bg-cyan-400 animate-pulse" />
                <span className="w-0.5 h-full bg-cyan-400 animate-pulse" />
              </div>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-cyan-950">
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span>COGNITIVE CORE 100%</span>
            </div>
          )}

          <span className="px-2 py-1 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-700/50 font-mono shadow-[0_0_8px_rgba(6,182,212,0.2)]">
            LIVE TELEMETRY
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 bg-robotic-grid">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const hasToolCalls = msg.toolCalls && msg.toolCalls.length > 0;

          return (
            <div
              key={msg.id}
              id={`chat-message-${msg.id}`}
              className={`flex items-start gap-3.5 w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Full Robotic Avatar on Left (Agent) or Right (Operator) */}
              {!isUser ? (
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <AriaAvatar className="w-10 h-10 sm:w-11 sm:h-11 ring-1 ring-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.35)]" isSpeaking={isSpeaking} />
                  <span className="text-[8px] font-tech text-cyan-400 uppercase tracking-widest px-1 py-0.2 bg-cyan-950/80 rounded border border-cyan-900/60">
                    MK-IV
                  </span>
                </div>
              ) : (
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <CyberOperatorAvatar className="w-10 h-10 sm:w-11 sm:h-11 ring-1 ring-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.35)]" />
                  <span className="text-[8px] font-tech text-amber-400 uppercase tracking-widest px-1 py-0.2 bg-amber-950/80 rounded border border-amber-900/60">
                    EXO-01
                  </span>
                </div>
              )}

              {/* Message Payload Container */}
              <div className={`flex flex-col flex-1 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Message Header Identity Bar */}
                <div className={`flex items-center gap-2 mb-1.5 font-tech text-xs ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isUser ? (
                    <>
                      <span className="font-semibold text-cyan-300 tracking-wide font-cyber flex items-center gap-1">
                        [SYS-ROBOT: ARIA // CYBER-COO]
                      </span>
                      <span className="text-[10px] text-cyan-500/70 font-mono">
                        {msg.timestamp}
                      </span>
                      <button
                        onClick={() => speakRoboticResponse(msg.content)}
                        className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/50 transition-colors flex items-center gap-1 shadow-sm"
                        title="Synthesize robotic voice aloud"
                      >
                        <Volume2 className="w-3 h-3 text-cyan-400" />
                        <span>Voice Audio</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-amber-300 tracking-wide font-cyber flex items-center gap-1">
                        [COMMANDER // EXOSUIT OPERATOR]
                      </span>
                      <span className="text-[10px] text-amber-500/70 font-mono">
                        {msg.timestamp}
                      </span>
                    </>
                  )}
                </div>

                {/* Message Content Bubble with Holographic Borders */}
                <div
                  className={`w-full rounded-xl px-4 sm:px-5 py-3.5 relative border backdrop-blur-sm ${
                    isUser
                      ? 'bg-gradient-to-br from-amber-950/30 via-slate-950/90 to-amber-950/20 border-amber-500/40 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                      : 'bg-gradient-to-br from-[#081528]/95 via-[#060e1b]/95 to-[#040813]/95 border-cyan-500/30 text-slate-100 shadow-xl shadow-black/60'
                  }`}
                >
                {/* Robotic Tool Sub-Routine Pill */}
                {hasToolCalls && (
                  <div className="mb-3.5 pb-2.5 border-b border-cyan-950 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-tech">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-cyan-300 uppercase tracking-wide">
                        [SUB-ROUTINES EXEC ({msg.toolCalls!.length})]:
                      </span>
                      <span className="text-slate-300 text-[11px] bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-900/40">
                        {msg.toolCalls!.map(t => t.toolName).join(' ➔ ')}
                      </span>
                    </div>

                    <button
                      id={`inspect-tool-trace-btn-${msg.id}`}
                      onClick={() => onInspectTools(msg.toolCalls!)}
                      className="text-[11px] font-tech px-2 py-0.5 rounded bg-cyan-950/70 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1 hover:shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                    >
                      Audit Telemetry Data
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Markdown Content */}
                <div className="markdown-content text-sm leading-relaxed space-y-3 font-sans">
                  <Markdown
                    components={{
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-3 rounded-lg border border-cyan-900/50 bg-[#040914]/90 shadow-inner">
                          <table className="w-full text-left text-xs text-cyan-100 divide-y divide-cyan-950 font-tech" {...props} />
                        </div>
                      ),
                      thead: ({ node, ...props }) => (
                        <thead className="bg-cyan-950/60 text-cyan-300 font-tech text-[11px] uppercase tracking-wider" {...props} />
                      ),
                      th: ({ node, ...props }) => (
                        <th className="px-3 py-2 font-semibold text-cyan-300" {...props} />
                      ),
                      td: ({ node, ...props }) => (
                        <td className="px-3 py-2 text-slate-200 border-t border-cyan-950/80 font-tech text-xs" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="mb-2 last:mb-0" {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-semibold text-cyan-200 font-cyber tracking-wide" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="space-y-1.5 my-2 list-disc list-inside text-slate-200" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="leading-snug" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-2 border-cyan-400 pl-3 my-2 text-cyan-200/90 italic font-tech bg-cyan-950/20 py-1" {...props} />
                      )
                    }}
                  >
                    {msg.content}
                  </Markdown>
                </div>

                {/* Robotic Actionable Directives */}
                {!isUser && msg.content.includes('Authorize') && (
                  <div className="mt-4 pt-3 border-t border-cyan-950 flex flex-wrap items-center gap-2 font-tech">
                    <span className="text-[10px] text-cyan-400/80 uppercase tracking-wider">
                      COMMAND READY:
                    </span>
                    <button
                      onClick={() => onSendMessage("Authorize immediate dispatch of purchase orders to suppliers now.")}
                      disabled={isLoading}
                      className="px-3 py-1.5 rounded bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-1.5 disabled:opacity-50 border border-emerald-400/40"
                    >
                      [EXECUTE: DISPATCH POs]
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onSendMessage("Replenish the low stock items immediately.")}
                      disabled={isLoading}
                      className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/50 text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      [RE-VERIFY QUANTITIES]
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

        {/* Robotic Processing Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2 font-tech">
            <div className="w-6 h-6 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-[10px] shadow-[0_0_10px_rgba(6,182,212,0.4)]">
              <Bot className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            </div>
            <div className="rounded-xl px-4 py-3 bg-[#081220] border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-3 shadow-lg shadow-cyan-950/40">
              <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
              <div className="space-y-0.5">
                <p className="font-cyber text-xs text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <span>ROBOTIC AGENT EXECUTING SEQUENTIAL SUB-ROUTINES...</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </p>
                <p className="text-[11px] text-slate-400 font-tech">
                  Interfacing with supply chain ledgers & sensory pricing bus
                </p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Directives */}
      <div className="px-4 py-2 border-t border-cyan-950/80 bg-[#030712]/90 overflow-x-auto flex items-center gap-2 scrollbar-none font-tech">
        <span className="text-[10px] uppercase tracking-wider text-cyan-400/80 shrink-0 flex items-center gap-1">
          <Terminal className="w-3 h-3 text-cyan-400" />
          DIRECTIVE:
        </span>
        <button
          onClick={() => onSendMessage("Give me the morning operational briefing.")}
          disabled={isLoading}
          className="text-[11px] px-2.5 py-1 rounded bg-cyan-950/50 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/40 transition-colors whitespace-nowrap disabled:opacity-50 hover:border-cyan-500/40"
        >
          "Run Morning Briefing"
        </button>
        <button
          onClick={() => onSendMessage("Replenish the low stock items immediately.")}
          disabled={isLoading}
          className="text-[11px] px-2.5 py-1 rounded bg-cyan-950/50 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/40 transition-colors whitespace-nowrap disabled:opacity-50 hover:border-cyan-500/40"
        >
          "Replenish Low Stock"
        </button>
        <button
          onClick={() => onSendMessage("Why is desk accessories lagging? Give me anomaly data.")}
          disabled={isLoading}
          className="text-[11px] px-2.5 py-1 rounded bg-cyan-950/50 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/40 transition-colors whitespace-nowrap disabled:opacity-50 hover:border-cyan-500/40"
        >
          "Check Sales Anomaly"
        </button>
        <button
          onClick={() => onSendMessage("Check RMA defect rate on USB-C docks.")}
          disabled={isLoading}
          className="text-[11px] px-2.5 py-1 rounded bg-cyan-950/50 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/40 transition-colors whitespace-nowrap disabled:opacity-50 hover:border-cyan-500/40"
        >
          "Inspect RMA Defect Spikes"
        </button>
      </div>

      {/* Voice Recognition Feedback & Error Banners */}
      {voiceFeedback && (
        <div className="px-4 py-2 bg-amber-500/10 border-t border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-2 font-tech">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>{voiceFeedback}</span>
          </div>
          <button
            onClick={() => setVoiceFeedback(null)}
            className="text-amber-400 hover:text-amber-200 p-0.5"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {isListening && (
        <div className="px-4 py-2 bg-cyan-950/80 border-t border-cyan-500/40 flex items-center justify-between gap-2 text-xs font-tech">
          <div className="flex items-center gap-2 overflow-hidden">
            {/* Real-time Audio Frequency Visualizer */}
            <div className="flex items-end gap-0.5 h-4 px-1 shrink-0">
              <span className="w-1 bg-cyan-400 animate-audio-bar-1" />
              <span className="w-1 bg-cyan-400 animate-audio-bar-2" />
              <span className="w-1 bg-cyan-400 animate-audio-bar-3" />
              <span className="w-1 bg-cyan-400 animate-audio-bar-4" />
              <span className="w-1 bg-cyan-400 animate-audio-bar-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 shrink-0">
              VOICE SENSOR ACTIVE:
            </span>
            <span className="text-slate-200 italic font-sans truncate">
              {interimTranscript ? `"${interimTranscript}..."` : 'Robotic audio capture listening...'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={stopListening}
              className="text-[10px] font-tech px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              HALT
            </button>
            {inputPrompt.trim() && (
              <button
                type="button"
                onClick={(e) => handleSubmit(e)}
                disabled={isLoading}
                className="text-[10px] font-tech px-2 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors flex items-center gap-1 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
              >
                DISPATCH DIRECTIVE
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Terminal Input Box */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-cyan-950/80 bg-[#030712] shrink-0">
        <div className="relative flex items-center rounded-lg bg-[#071224] border border-cyan-900/60 focus-within:border-cyan-400 focus-within:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all">
          <textarea
            id="chat-input-textarea"
            rows={1}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? "Robotic ear active... speak hands-free (e.g. 'Run morning briefing')..."
                : "Enter command for Robotic COO (e.g. 'Run morning briefing', 'Replenish SKU-102')..."
            }
            className="w-full bg-transparent px-3.5 py-3 text-sm text-cyan-100 placeholder-slate-500 focus:outline-none resize-none font-tech"
          />
          <div className="pr-2 flex items-center gap-1.5 shrink-0">
            {/* Hands-Free Web Speech Microphone Button */}
            <button
              id="mic-command-btn"
              type="button"
              onClick={toggleVoiceInput}
              disabled={isLoading}
              title={
                !isSpeechRecognitionSupported
                  ? 'Web Speech API not supported in this browser'
                  : isListening
                  ? 'Stop voice capture'
                  : 'Speak directive hands-free to Robotic Agent'
              }
              className={`p-2 rounded transition-all flex items-center justify-center ${
                !isSpeechRecognitionSupported
                  ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                  : isListening
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/40 ring-2 ring-cyan-400 animate-pulse font-bold'
                  : 'bg-cyan-950/80 hover:bg-cyan-900 text-cyan-400 border border-cyan-800/60'
              }`}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-black" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            <span className="hidden sm:inline text-[10px] font-tech text-cyan-500/60 mr-0.5">
              ENTER ↵
            </span>
            <button
              id="send-message-btn"
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="p-2 rounded bg-cyan-600 hover:bg-cyan-500 text-black transition-all font-bold disabled:opacity-30 disabled:hover:bg-cyan-600 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

