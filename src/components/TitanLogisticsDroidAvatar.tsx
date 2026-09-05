import React from 'react';

interface TitanLogisticsDroidAvatarProps {
  className?: string;
}

export const TitanLogisticsDroidAvatar: React.FC<TitanLogisticsDroidAvatarProps> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`relative shrink-0 rounded-lg overflow-hidden border border-emerald-500/50 bg-gradient-to-b from-slate-950 to-emerald-950/60 p-0.5 shadow-[0_0_12px_rgba(16,185,129,0.3)] ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
      >
        <defs>
          <linearGradient id="titanArmor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>

          <linearGradient id="emeraldNeon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Ring */}
        <circle cx="60" cy="60" r="50" fill="#022c22" opacity="0.4" />

        {/* Heavy Carbon Plating Neck */}
        <path d="M 30,86 L 90,86 L 98,116 L 22,116 Z" fill="#064e3b" stroke="#047857" strokeWidth="2" />
        <line x1="28" y1="98" x2="92" y2="98" stroke="#10b981" strokeWidth="2" filter="url(#emeraldGlow)" />

        {/* Hexagonal Reinforced Hull */}
        <polygon points="60,14 94,36 94,80 60,98 26,80 26,36" fill="url(#titanArmor)" stroke="#059669" strokeWidth="2" />

        {/* Armored Forehead Brow */}
        <polygon points="34,34 86,34 76,46 44,46" fill="#064e3b" stroke="#10b981" strokeWidth="1" />

        {/* Tactical Dual Slit Optic Visors */}
        <rect x="36" y="52" width="20" height="7" rx="2" fill="#022c22" stroke="#047857" strokeWidth="1" />
        <rect x="38" y="54" width="16" height="3" rx="1" fill="url(#emeraldNeon)" filter="url(#emeraldGlow)" />

        <rect x="64" y="52" width="20" height="7" rx="2" fill="#022c22" stroke="#047857" strokeWidth="1" />
        <rect x="66" y="54" width="16" height="3" rx="1" fill="url(#emeraldNeon)" filter="url(#emeraldGlow)" />

        {/* Comms Mesh & Data Port */}
        <line x1="48" y1="74" x2="72" y2="74" stroke="#34d399" strokeWidth="1.5" />
        <line x1="52" y1="80" x2="68" y2="80" stroke="#34d399" strokeWidth="1.5" />
        <line x1="56" y1="86" x2="64" y2="86" stroke="#34d399" strokeWidth="1.5" />

        {/* Industrial Warning Chevron Decal */}
        <polygon points="56,22 64,22 68,28 60,34 52,28" fill="#f59e0b" opacity="0.9" />
      </svg>
    </div>
  );
};
