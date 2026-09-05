import React from 'react';

interface AriaAvatarProps {
  className?: string;
  isSpeaking?: boolean;
}

export const AriaAvatar: React.FC<AriaAvatarProps> = ({ className = "w-16 h-16", isSpeaking = false }) => {
  return (
    <div className={`relative shrink-0 rounded-lg overflow-hidden border border-cyan-500/40 bg-gradient-to-b from-slate-900 to-cyan-950/60 p-1 shadow-[0_0_15px_rgba(6,182,212,0.3)] ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
      >
        <defs>
          <linearGradient id="ariaFace" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          <linearGradient id="ariaCyanGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <filter id="cyanNeon" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient background glow */}
        <circle cx="60" cy="55" r="45" fill="#083344" opacity="0.6" />

        {/* Neck & Shoulder armor */}
        <path d="M 40,82 L 80,82 L 88,110 L 32,110 Z" fill="#475569" stroke="#334155" strokeWidth="1.5" />
        <path d="M 46,84 L 74,84 L 70,105 L 50,105 Z" fill="#64748b" />
        {/* Collar cyan light line */}
        <path d="M 38,92 L 82,92" stroke="#22d3ee" strokeWidth="2" filter="url(#cyanNeon)" opacity="0.8" />

        {/* Head Shell Shape */}
        <path
          d="M 60,18 C 36,18 30,36 32,60 C 33,78 45,90 60,90 C 75,90 87,78 88,60 C 90,36 84,18 60,18 Z"
          fill="url(#ariaFace)"
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />

        {/* Cranium / Hairline Panel Seams */}
        <path d="M 35,38 C 45,28 75,28 85,38" stroke="#64748b" strokeWidth="1" fill="none" />
        <path d="M 60,18 L 60,34" stroke="#64748b" strokeWidth="1" />
        <path d="M 42,26 L 40,36" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />
        <path d="M 78,26 L 80,36" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />

        {/* Temple Audio Sensor Disks */}
        <ellipse cx="32" cy="52" rx="3.5" ry="6" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1" />
        <ellipse cx="88" cy="52" rx="3.5" ry="6" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1" />

        {/* Face Contours (Cheek seams) */}
        <path d="M 38,58 Q 42,70 50,76" stroke="#94a3b8" strokeWidth="0.8" fill="none" opacity="0.7" />
        <path d="M 82,58 Q 78,70 70,76" stroke="#94a3b8" strokeWidth="0.8" fill="none" opacity="0.7" />

        {/* Cyber Eyes */}
        {/* Left Eye */}
        <ellipse cx="48" cy="52" rx="6.5" ry="4.5" fill="#0f172a" />
        <circle cx="48" cy="52" r="3" fill="url(#ariaCyanGlow)" filter="url(#cyanNeon)" />
        <circle cx="47" cy="51" r="1" fill="#ffffff" />

        {/* Right Eye */}
        <ellipse cx="72" cy="52" rx="6.5" ry="4.5" fill="#0f172a" />
        <circle cx="72" cy="52" r="3" fill="url(#ariaCyanGlow)" filter="url(#cyanNeon)" />
        <circle cx="71" cy="51" r="1" fill="#ffffff" />

        {/* Eye Brow Accent Lines */}
        <path d="M 42,45 Q 48,43 54,46" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 66,46 Q 72,43 78,45" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />

        {/* Nose Bridge */}
        <path d="M 60,48 L 59,62 L 63,64" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" fill="none" />

        {/* Cyber Lips */}
        <path d="M 52,74 Q 60,76 68,74" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M 54,74 Q 60,78 66,74" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" fill="none" />

        {/* Chin Sensor Dot */}
        <circle cx="60" cy="83" r="1.5" fill="#22d3ee" filter="url(#cyanNeon)" />

        {/* Dynamic Voice Modulation Glow */}
        {isSpeaking && (
          <circle cx="60" cy="60" r="50" stroke="#22d3ee" strokeWidth="1.5" opacity="0.6" className="animate-ping" />
        )}
      </svg>
    </div>
  );
};
