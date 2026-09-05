import React from 'react';

interface CyberOperatorAvatarProps {
  className?: string;
}

export const CyberOperatorAvatar: React.FC<CyberOperatorAvatarProps> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`relative shrink-0 rounded-lg overflow-hidden border border-amber-500/50 bg-gradient-to-b from-slate-950 to-amber-950/60 p-0.5 shadow-[0_0_12px_rgba(245,158,11,0.3)] ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
      >
        <defs>
          <linearGradient id="exoArmor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="amberVisor" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          <filter id="amberGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Halo */}
        <circle cx="60" cy="60" r="50" fill="#451a03" opacity="0.3" />

        {/* Neck & Tactical Shoulders */}
        <path d="M 32,86 L 88,86 L 96,115 L 24,115 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        <path d="M 40,88 L 80,88 L 84,110 L 36,110 Z" fill="#0f172a" />
        <line x1="30" y1="98" x2="90" y2="98" stroke="#f59e0b" strokeWidth="1.5" opacity="0.8" />

        {/* Armored Helmet Chassis */}
        <path
          d="M 60,14 C 36,14 28,30 28,58 C 28,78 38,92 60,94 C 82,92 92,78 92,58 C 92,30 84,14 60,14 Z"
          fill="url(#exoArmor)"
          stroke="#475569"
          strokeWidth="2"
        />

        {/* Cranium Ridge Plates */}
        <path d="M 42,24 L 60,16 L 78,24 L 72,40 L 48,40 Z" fill="#334155" stroke="#f59e0b" strokeWidth="1" opacity="0.85" />
        <line x1="60" y1="16" x2="60" y2="40" stroke="#f59e0b" strokeWidth="1.5" />

        {/* Panoramic Golden Visor Bar with Tactical Telemetry Display */}
        <polygon points="34,46 86,46 82,68 38,68" fill="url(#amberVisor)" filter="url(#amberGlow)" />
        {/* Internal HUD scan grid in visor */}
        <line x1="42" y1="52" x2="78" y2="52" stroke="#ffffff" strokeWidth="1" opacity="0.9" />
        <line x1="40" y1="58" x2="80" y2="58" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
        <circle cx="50" cy="52" r="1.5" fill="#ffffff" />
        <circle cx="70" cy="52" r="1.5" fill="#ffffff" />

        {/* Breathing Respirator / Vocoder Mesh */}
        <polygon points="46,74 74,74 68,90 52,90" fill="#0f172a" stroke="#475569" strokeWidth="1" />
        <line x1="50" y1="78" x2="70" y2="78" stroke="#f59e0b" strokeWidth="1" opacity="0.7" />
        <line x1="53" y1="82" x2="67" y2="82" stroke="#f59e0b" strokeWidth="1" opacity="0.7" />
        <line x1="56" y1="86" x2="64" y2="86" stroke="#f59e0b" strokeWidth="1" opacity="0.7" />

        {/* Tactical Ear Antennae */}
        <rect x="22" y="44" width="6" height="22" rx="2" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
        <line x1="25" y1="36" x2="25" y2="44" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="25" cy="34" r="2" fill="#fbbf24" filter="url(#amberGlow)" />

        <rect x="92" y="44" width="6" height="22" rx="2" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
        <circle cx="95" cy="50" r="1.5" fill="#fbbf24" />
      </svg>
    </div>
  );
};
