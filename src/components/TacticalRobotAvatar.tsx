import React from 'react';

interface TacticalRobotAvatarProps {
  className?: string;
}

export const TacticalRobotAvatar: React.FC<TacticalRobotAvatarProps> = ({ className = "w-14 h-14" }) => {
  return (
    <div className={`relative shrink-0 rounded-lg overflow-hidden border border-blue-500/40 bg-gradient-to-b from-slate-900 to-blue-950/60 p-1 shadow-[0_0_12px_rgba(59,130,246,0.3)] ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
      >
        <defs>
          <linearGradient id="tacPlating" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="60%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          <linearGradient id="tacBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          <filter id="blueNeon" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Neck & Tactical Collar */}
        <path d="M 38,82 L 82,82 L 92,112 L 28,112 Z" fill="#334155" stroke="#1e293b" strokeWidth="2" />
        <path d="M 44,82 L 76,82 L 80,105 L 40,105 Z" fill="#1e293b" />
        <line x1="32" y1="96" x2="88" y2="96" stroke="#3b82f6" strokeWidth="1.5" opacity="0.7" />

        {/* Angular Jaw & Skull Base */}
        <path
          d="M 60,16 C 38,16 32,32 32,56 C 32,74 42,88 60,92 C 78,88 88,74 88,56 C 88,32 82,16 60,16 Z"
          fill="url(#tacPlating)"
          stroke="#94a3b8"
          strokeWidth="2"
        />

        {/* Tactical Head Armor Panels */}
        <path d="M 40,32 L 60,22 L 80,32 L 74,48 L 46,48 Z" fill="#475569" stroke="#334155" strokeWidth="1" />
        <circle cx="60" cy="28" r="3" fill="#3b82f6" filter="url(#blueNeon)" />

        {/* High-Tech Optic Sensor Visor Bar */}
        <rect x="36" y="50" width="48" height="12" rx="3" fill="#090d16" stroke="#1e293b" strokeWidth="1" />
        {/* Glowing Tactical Optic Eye Sensors */}
        <circle cx="48" cy="56" r="3.5" fill="url(#tacBlue)" filter="url(#blueNeon)" />
        <circle cx="47" cy="55" r="1.2" fill="#ffffff" />

        <circle cx="72" cy="56" r="3.5" fill="url(#tacBlue)" filter="url(#blueNeon)" />
        <circle cx="71" cy="55" r="1.2" fill="#ffffff" />

        <line x1="53" y1="56" x2="67" y2="56" stroke="#60a5fa" strokeWidth="1" opacity="0.6" />

        {/* Cheek Armor Cutouts */}
        <polygon points="34,68 45,72 44,82 35,78" fill="#475569" />
        <polygon points="86,68 75,72 76,82 85,78" fill="#475569" />

        {/* Speaker / Vocoder Mesh */}
        <rect x="52" y="74" width="16" height="6" rx="2" fill="#0f172a" />
        <line x1="55" y1="77" x2="65" y2="77" stroke="#38bdf8" strokeWidth="1" opacity="0.8" />

        {/* Lateral Cyber Ears */}
        <rect x="28" y="48" width="5" height="16" rx="2" fill="#334155" stroke="#3b82f6" strokeWidth="0.8" />
        <rect x="87" y="48" width="5" height="16" rx="2" fill="#334155" stroke="#3b82f6" strokeWidth="0.8" />
      </svg>
    </div>
  );
};
