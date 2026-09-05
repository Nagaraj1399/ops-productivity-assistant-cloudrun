import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, Sparkles, CheckCircle2, AlertCircle, X, ChevronRight, Activity, Terminal, Radio } from 'lucide-react';
import { sciFiAudio } from '../utils/audioEffects';

export interface VoiceCommandListenerProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand: (commandText: string) => void;
  onRestockKeyboard: () => void;
  onAnalyzeSales: () => void;
  onDispatchOrders: () => void;
  onMorningBriefing: () => void;
}

export const VoiceCommandListener: React.FC<VoiceCommandListenerProps> = ({
  isOpen,
  onClose,
  onExecuteCommand,
  onRestockKeyboard,
  onAnalyzeSales,
  onDispatchOrders,
  onMorningBriefing
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [recognizedIntent, setRecognizedIntent] = useState<string | null>(null);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [micStatusMessage, setMicStatusMessage] = useState<string>('Ready for voice command');
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState<boolean>(true);
  const [autoExecuteCountdown, setAutoExecuteCountdown] = useState<number | null>(null);

  // Audio Stream & Web Audio API Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Voice Command Intent Matching
  const evaluateVoiceCommand = useCallback((spokenText: string) => {
    const clean = spokenText.toLowerCase().trim();
    if (!clean) return;

    if (
      clean.includes('restock keyboard') ||
      clean.includes('reorder keyboard') ||
      clean.includes('restock the keyboard') ||
      clean.includes('order keyboard') ||
      (clean.includes('restock') && clean.includes('keyboard'))
    ) {
      setRecognizedIntent('RESTOCK_KEYBOARD');
      sciFiAudio.playCommandRecognized();
      setMicStatusMessage('Command Recognized: Restock Keyboard');
      sciFiAudio.speakDirective('Command recognized: Restocking Wireless Mechanical Keyboard. Purchase order scheduled.');
      setTimeout(() => {
        onRestockKeyboard();
        handleClose();
      }, 900);
      return;
    }

    if (
      clean.includes('analyze sales') ||
      clean.includes('sales analysis') ||
      clean.includes('analyse sales') ||
      clean.includes('check sales') ||
      clean.includes('revenue analysis') ||
      clean.includes('sales report') ||
      (clean.includes('sales') && (clean.includes('analyze') || clean.includes('performance') || clean.includes('anomalies')))
    ) {
      setRecognizedIntent('ANALYZE_SALES');
      sciFiAudio.playCommandRecognized();
      setMicStatusMessage('Command Recognized: Analyze Sales');
      sciFiAudio.speakDirective('Command recognized: Analyzing sales telemetry and category anomalies.');
      setTimeout(() => {
        onAnalyzeSales();
        handleClose();
      }, 900);
      return;
    }

    if (
      clean.includes('dispatch orders') ||
      clean.includes('dispatch purchase orders') ||
      clean.includes('dispatch pos') ||
      clean.includes('authorize dispatch') ||
      clean.includes('send pos')
    ) {
      setRecognizedIntent('DISPATCH_ORDERS');
      sciFiAudio.playCommandRecognized();
      setMicStatusMessage('Command Recognized: Dispatch All POs');
      sciFiAudio.speakDirective('Command recognized: Authorizing all purchase orders to robotic logistics.');
      setTimeout(() => {
        onDispatchOrders();
        handleClose();
      }, 900);
      return;
    }

    if (
      clean.includes('morning briefing') ||
      clean.includes('operational briefing') ||
      clean.includes('daily briefing') ||
      clean.includes('operations status')
    ) {
      setRecognizedIntent('MORNING_BRIEFING');
      sciFiAudio.playCommandRecognized();
      setMicStatusMessage('Command Recognized: Morning Briefing');
      sciFiAudio.speakDirective('Command recognized: Preparing the executive morning operations briefing.');
      setTimeout(() => {
        onMorningBriefing();
        handleClose();
      }, 900);
      return;
    }

    // Generic natural language prompt
    if (clean.length > 5) {
      setRecognizedIntent('CUSTOM_QUERY');
      setMicStatusMessage(`Transmitting: "${spokenText}"`);
      sciFiAudio.playCommandRecognized();
      setTimeout(() => {
        onExecuteCommand(spokenText);
        handleClose();
      }, 1000);
    }
  }, [onRestockKeyboard, onAnalyzeSales, onDispatchOrders, onMorningBriefing, onExecuteCommand]);

  // Start Real-Time Microphone & Speech Recognition
  const startRealtimeListening = async () => {
    try {
      sciFiAudio.playMicStart();
      setTranscript('');
      setInterimTranscript('');
      setRecognizedIntent(null);
      setMicStatusMessage('Requesting microphone authorization...');

      // 1. Browser Microphone API: Request media stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      mediaStreamRef.current = stream;

      // 2. Web Audio API Setup for real-time frequency analysis
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsRecording(true);
      setMicStatusMessage("LISTENING... Say 'restock keyboard' or 'analyze sales'");

      // Draw real-time visualizer
      const renderWaveform = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume level (0 to 100)
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setVolumeLevel(Math.min(100, Math.round((avg / 128) * 100)));

        // Render to canvas if present
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const width = canvas.width;
            const height = canvas.height;
            const barWidth = (width / dataArray.length) * 1.5;
            let x = 0;

            for (let i = 0; i < dataArray.length; i++) {
              const barHeight = (dataArray[i] / 255) * height;
              const gradient = ctx.createLinearGradient(0, height, 0, 0);
              gradient.addColorStop(0, '#0891b2');
              gradient.addColorStop(0.5, '#22d3ee');
              gradient.addColorStop(1, '#a855f7');

              ctx.fillStyle = gradient;
              ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
              x += barWidth;
            }
          }
        }

        animationFrameRef.current = requestAnimationFrame(renderWaveform);
      };

      animationFrameRef.current = requestAnimationFrame(renderWaveform);

      // 3. Web Speech Recognition API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setHasSpeechRecognition(true);
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let interim = '';
          let final = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }

          if (final.trim()) {
            setTranscript(final.trim());
            setInterimTranscript('');
            evaluateVoiceCommand(final.trim());
          } else if (interim.trim()) {
            setInterimTranscript(interim.trim());
            // Proactive intent detection while speaking
            const currentSpoken = interim.toLowerCase().trim();
            if (currentSpoken.includes('restock') && currentSpoken.includes('keyboard')) {
              evaluateVoiceCommand(interim.trim());
            } else if (currentSpoken.includes('analyze') && currentSpoken.includes('sales')) {
              evaluateVoiceCommand(interim.trim());
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition event:', event.error);
          if (event.error === 'not-allowed') {
            setMicStatusMessage('Microphone access denied. Please enable microphone permissions in browser.');
          } else if (event.error !== 'no-speech') {
            setMicStatusMessage(`Audio Status: ${event.error}`);
          }
        };

        recognition.onend = () => {
          // If still marked as recording, restart recognition
          if (isRecording && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch {
              // Ignore restart error
            }
          }
        };

        recognition.start();
      } else {
        setHasSpeechRecognition(false);
        setMicStatusMessage('Web Speech API not detected. You can speak or use quick command triggers.');
      }
    } catch (err: any) {
      console.error('Microphone API Error:', err);
      setIsRecording(false);
      setMicStatusMessage(`Microphone Error: ${err.message || 'Permission denied'}`);
      sciFiAudio.playMicStop();
    }
  };

  // Stop Real-Time Microphone & Cleaning Up
  const stopRealtimeListening = () => {
    sciFiAudio.playMicStop();
    setIsRecording(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      } catch {
        // Ignore stop error
      }
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {
        // Ignore close error
      }
      audioContextRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    setVolumeLevel(0);
    setMicStatusMessage('Microphone offline.');
  };

  const handleClose = () => {
    stopRealtimeListening();
    onClose();
  };

  // Trigger simulated voice command for immediate testing or fallback
  const triggerSimulatedCommand = (command: string) => {
    setTranscript(command);
    setInterimTranscript('');
    evaluateVoiceCommand(command);
  };

  useEffect(() => {
    if (isOpen) {
      startRealtimeListening();
    } else {
      stopRealtimeListening();
    }

    return () => {
      stopRealtimeListening();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="voice-command-listener-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl rounded-2xl border-2 border-cyan-500/60 bg-gradient-to-b from-[#061426]/95 via-[#040c18]/95 to-[#02060f]/98 shadow-[0_0_50px_rgba(6,182,212,0.35)] p-5 sm:p-6 overflow-hidden robotic-panel">
        {/* Glowing Top Scanner Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 animate-pulse" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-950/80">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className={`w-3.5 h-3.5 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-slate-600'} absolute opacity-75`} />
              <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-red-500' : 'bg-slate-500'}`} />
            </div>
            <div>
              <h2 className="text-sm font-cyber font-bold tracking-wider text-cyan-200 uppercase flex items-center gap-2">
                <span>REAL-TIME SPEECH-TO-TEXT LISTENER</span>
                <span className="text-[10px] font-tech text-cyan-400 bg-cyan-950/90 px-2 py-0.5 rounded border border-cyan-500/30">
                  BROWSER MIC API
                </span>
              </h2>
              <p className="text-[11px] font-tech text-slate-400">
                Acoustic Neural Interface // Say voice directives aloud to execute
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800/40 text-cyan-300 transition-colors"
            title="Close voice listener"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Center Microphone & Live Audio Waveform HUD */}
        <div className="my-5 flex flex-col items-center justify-center text-center">
          {/* Circular Microphone Pulsing Core */}
          <div className="relative my-2">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording
                  ? 'bg-cyan-950/80 border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.6)]'
                  : 'bg-slate-900 border border-slate-700 text-slate-500'
              }`}
            >
              {isRecording ? (
                <div className="relative flex items-center justify-center">
                  <Mic className="w-10 h-10 text-cyan-300 animate-pulse" />
                  {/* Dynamic volume ripple ring */}
                  <div
                    className="absolute inset-0 rounded-full border border-cyan-400/50 pointer-events-none transition-transform"
                    style={{
                      transform: `scale(${1 + (volumeLevel / 100) * 0.8})`,
                      opacity: Math.max(0.2, volumeLevel / 100)
                    }}
                  />
                </div>
              ) : (
                <MicOff className="w-10 h-10 text-slate-500" />
              )}
            </div>

            {/* Live Volume Decibel Level Badge */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-950 border border-cyan-500/40 text-[10px] font-tech text-cyan-300 font-bold whitespace-nowrap shadow-sm">
              VOL: {volumeLevel}%
            </div>
          </div>

          {/* Real-time Frequency Spectrum Visualizer Canvas */}
          <div className="w-full max-w-sm h-12 mt-4 bg-slate-950/80 rounded-lg border border-cyan-950/80 overflow-hidden relative flex items-center justify-center">
            <canvas ref={canvasRef} width={380} height={48} className="w-full h-full" />
            {!isRecording && (
              <span className="absolute text-[11px] font-tech text-slate-500">
                MIC MUTED // CLICK TOGGLE TO ENGAGE
              </span>
            )}
          </div>

          {/* Real-Time Microphone Status Ticker */}
          <div className="mt-3 flex items-center gap-2 font-tech text-xs">
            <Activity className={`w-3.5 h-3.5 ${isRecording ? 'text-cyan-400 animate-spin' : 'text-slate-500'}`} />
            <span className={isRecording ? 'text-cyan-300 font-semibold' : 'text-slate-400'}>
              {micStatusMessage}
            </span>
          </div>
        </div>

        {/* Live Speech-to-Text Transcription Box */}
        <div className="p-3.5 rounded-xl bg-slate-950/90 border border-cyan-900/60 shadow-inner min-h-[70px] flex flex-col justify-center">
          <div className="flex items-center justify-between text-[10px] font-tech text-slate-500 mb-1">
            <span className="flex items-center gap-1">
              <Terminal className="w-3 h-3 text-cyan-400" />
              <span>LIVE TRANSCRIPTION BUFFER</span>
            </span>
            {recognizedIntent && (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>INTENT: {recognizedIntent}</span>
              </span>
            )}
          </div>

          <div className="font-mono text-sm leading-relaxed text-slate-100 flex items-center gap-1.5 flex-wrap">
            {transcript ? (
              <span className="text-cyan-200 font-bold">{transcript}</span>
            ) : null}
            {interimTranscript ? (
              <span className="text-cyan-400/80 italic">{interimTranscript}</span>
            ) : null}
            {!transcript && !interimTranscript ? (
              <span className="text-slate-500 text-xs italic font-tech">
                {isRecording ? "Speak into your microphone now (e.g., 'restock keyboard' or 'analyze sales')..." : "Microphone offline."}
              </span>
            ) : null}
            {isRecording && <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-0.5" />}
          </div>
        </div>

        {/* Tactical Voice Command Cheat Sheet Chips */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-tech text-slate-400">
            <span className="font-bold text-cyan-300 uppercase">Available Voice Directives:</span>
            <span className="text-[10px] text-slate-500">Speak aloud or click to execute</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Command 1: Restock Keyboard */}
            <button
              onClick={() => triggerSimulatedCommand('restock keyboard')}
              className="p-2.5 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/40 hover:border-cyan-400 text-left transition-all group flex items-start justify-between gap-2 shadow-sm"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-cyber font-bold text-cyan-300 group-hover:text-cyan-100">
                    "restock keyboard"
                  </span>
                </div>
                <p className="text-[10px] font-tech text-slate-400 mt-0.5">
                  Generates & schedules PO for SKU-102 Wireless Mechanical Keyboard
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform shrink-0 mt-0.5" />
            </button>

            {/* Command 2: Analyze Sales */}
            <button
              onClick={() => triggerSimulatedCommand('analyze sales')}
              className="p-2.5 rounded-lg bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/40 hover:border-purple-400 text-left transition-all group flex items-start justify-between gap-2 shadow-sm"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-cyber font-bold text-purple-300 group-hover:text-purple-100">
                    "analyze sales"
                  </span>
                </div>
                <p className="text-[10px] font-tech text-slate-400 mt-0.5">
                  Audits gross sales, $14,250 run-rate & category deficit anomalies
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform shrink-0 mt-0.5" />
            </button>

            {/* Command 3: Dispatch Orders */}
            <button
              onClick={() => triggerSimulatedCommand('dispatch orders')}
              className="p-2.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 hover:border-emerald-400 text-left transition-all group flex items-start justify-between gap-2 shadow-sm"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-cyber font-bold text-emerald-300 group-hover:text-emerald-100">
                    "dispatch orders"
                  </span>
                </div>
                <p className="text-[10px] font-tech text-slate-400 mt-0.5">
                  Authorizes all pending POs to warehouse robotics fleet
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0 mt-0.5" />
            </button>

            {/* Command 4: Morning Briefing */}
            <button
              onClick={() => triggerSimulatedCommand('morning briefing')}
              className="p-2.5 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 hover:border-amber-400 text-left transition-all group flex items-start justify-between gap-2 shadow-sm"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-cyber font-bold text-amber-300 group-hover:text-amber-100">
                    "morning briefing"
                  </span>
                </div>
                <p className="text-[10px] font-tech text-slate-400 mt-0.5">
                  ARIA delivers comprehensive operations health status
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0 mt-0.5" />
            </button>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="mt-5 pt-3 border-t border-cyan-950/80 flex items-center justify-between">
          <button
            onClick={() => {
              if (isRecording) {
                stopRealtimeListening();
              } else {
                startRealtimeListening();
              }
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-cyber font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              isRecording
                ? 'bg-red-950 hover:bg-red-900 border border-red-500/60 text-red-300'
                : 'bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-300'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-3.5 h-3.5 text-red-400" />
                <span>Mute Microphone</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-cyan-400" />
                <span>Engage Microphone</span>
              </>
            )}
          </button>

          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-tech font-bold uppercase transition-colors"
          >
            Close HUD
          </button>
        </div>
      </div>
    </div>
  );
};
