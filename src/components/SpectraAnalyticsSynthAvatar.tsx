import React from 'react';

interface SpectraAnalyticsSynthAvatarProps {
  className?: string;
}

export const SpectraAnalyticsSynthAvatar: React.FC<SpectraAnalyticsSynthAvatarProps> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`relative shrink-0 rounded-lg overflow-hidden border border-purple-500/50 bg-gradient-to-b from-slate-950 to-purple-950/60 p-0.5 shadow-[0_0_12px_rgba(168,85,247,0.3)] ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
      >
        <defs>
          <linearGradient id="spectraSynth" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2e1065" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="purpleNeon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#e879f9" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Ring */}
        <circle cx="60" cy="60" r="50" fill="#3b0764" opacity="0.35" />

        {/* Neck Chassis */}
        <path d="M 38,84 L 82,84 L 90,114 L 30,114 Z" fill="#1e1b4b" stroke="#312e81" strokeWidth="1.5" />
        <line x1="36" y1="96" x2="84" y2="96" stroke="#c084fc" strokeWidth="2" filter="url(#purpleGlow)" />

        {/* Sleek Cybernetic Prism Head */}
        <path
          d="M 60,16 C 36,16 30,34 30,60 C 30,80 40,92 60,94 C 80,92 90,80 90,60 C 90,34 84,16 60,16 Z"
          fill="url(#spectraSynth)"
          stroke="#7c3aed"
          strokeWidth="2"
        />

        {/* Geometric Quantum Crown Nodes */}
        <polygon points="60,20 45,34 75,34" fill="#581c87" stroke="#c084fc" strokeWidth="1" />
        <circle cx="60" cy="20" r="2.5" fill="#f472b6" filter="url(#purpleGlow)" />

        {/* Wide Holographic Spectrum Visor */}
        <polygon points="34,48 86,48 80,68 40,68" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="1.5" />
        <path d="M 38,58 L 82,58" stroke="url(#purpleNeon)" strokeWidth="3" filter="url(#purpleGlow)" strokeLinecap="round" />
        {/* Holographic Pulse Dots in Visor */}
        <circle cx="48" cy="58" r="1.5" fill="#ffffff" />
        <circle cx="60" cy="58" r="2" fill="#ffffff" />
        <circle cx="72" cy="58" r="1.5" fill="#ffffff" />

        {/* Frequency Vocoder Array */}
        <circle cx="60" cy="80" r="4" fill="#090d16" stroke="#c084fc" strokeWidth="1" />
        <circle cx="60" cy="80" r="2" fill="#e879f9" filter="url(#purpleGlow)" />
        <line x1="48" y1="80" x2="52" y2="80" stroke="#7c3aed" strokeWidth="1.5" />
        <line x1="68" y1="80" x2="72" y2="80" stroke="#7c3aed" strokeWidth="1.5" />

        {/* Side Quantum Prisms */}
        <polygon points="26,50 30,44 30,64 26,60" fill="#6b21a8" stroke="#a855f7" strokeWidth="1" />
        <polygon points="94,50 90,44 90,64 94,60" fill="#6b21a8" stroke="#a855f7" strokeWidth="1" />
      </svg>
    </div>
  );
};
