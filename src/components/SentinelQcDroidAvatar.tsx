import React from 'react';

interface SentinelQcDroidAvatarProps {
  className?: string;
}

export const SentinelQcDroidAvatar: React.FC<SentinelQcDroidAvatarProps> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`relative shrink-0 rounded-lg overflow-hidden border border-red-500/50 bg-gradient-to-b from-slate-950 to-red-950/60 p-0.5 shadow-[0_0_12px_rgba(239,68,68,0.3)] ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
      >
        <defs>
          <linearGradient id="sentinelArmor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e1e24" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>

          <linearGradient id="redNeon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>

          <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Ring */}
        <circle cx="60" cy="60" r="50" fill="#450a0a" opacity="0.4" />

        {/* Tactical Reinforced Collar */}
        <path d="M 32,86 L 88,86 L 96,116 L 24,116 Z" fill="#1e1e24" stroke="#7f1d1d" strokeWidth="2" />
        <line x1="30" y1="98" x2="90" y2="98" stroke="#ef4444" strokeWidth="2" filter="url(#redGlow)" />

        {/* Aggressive Angular Sentinel Helmet */}
        <polygon points="60,14 88,26 94,62 80,94 60,98 40,94 26,62 32,26" fill="url(#sentinelArmor)" stroke="#b91c1c" strokeWidth="2" />

        {/* Target Reticle Brow Pattern */}
        <path d="M 36,36 L 60,26 L 84,36" stroke="#ef4444" strokeWidth="1.5" fill="none" opacity="0.8" />
        <circle cx="60" cy="26" r="2.5" fill="#f87171" filter="url(#redGlow)" />

        {/* Monocular Crimson Diagnostic Scanner Eye */}
        <rect x="36" y="50" width="48" height="16" rx="3" fill="#0b0a0f" stroke="#7f1d1d" strokeWidth="1.5" />
        <line x1="36" y1="58" x2="84" y2="58" stroke="#ef4444" strokeWidth="1" opacity="0.6" />

        {/* Glowing Central Eye with Crosshair */}
        <circle cx="60" cy="58" r="6" fill="url(#redNeon)" filter="url(#redGlow)" />
        <circle cx="60" cy="58" r="2.5" fill="#ffffff" />
        <line x1="54" y1="58" x2="66" y2="58" stroke="#ffffff" strokeWidth="0.8" />
        <line x1="60" y1="52" x2="60" y2="64" stroke="#ffffff" strokeWidth="0.8" />

        {/* Defensive Heat Dissipation Vents */}
        <rect x="46" y="76" width="28" height="3" fill="#7f1d1d" />
        <rect x="48" y="82" width="24" height="3" fill="#7f1d1d" />
        <rect x="52" y="88" width="16" height="3" fill="#7f1d1d" />

        {/* Warning Hazard Stripe on Cheek */}
        <polygon points="28,68 34,68 30,76 24,76" fill="#f59e0b" opacity="0.85" />
        <polygon points="92,68 86,68 90,76 96,76" fill="#f59e0b" opacity="0.85" />
      </svg>
    </div>
  );
};
