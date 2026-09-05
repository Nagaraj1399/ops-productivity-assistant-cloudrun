import React from 'react';

interface NexusWarehouseDroidAvatarProps {
  className?: string;
}

export const NexusWarehouseDroidAvatar: React.FC<NexusWarehouseDroidAvatarProps> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`relative shrink-0 rounded-lg overflow-hidden border border-cyan-500/50 bg-gradient-to-b from-slate-950 to-cyan-950/60 p-0.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
      >
        <defs>
          <linearGradient id="nexusWhite" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          <linearGradient id="nexusCyan" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <filter id="nexusGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Ring */}
        <circle cx="60" cy="60" r="50" fill="#083344" opacity="0.3" />

        {/* Neck Servos & Chassis Collar */}
        <path d="M 36,84 L 84,84 L 92,114 L 28,114 Z" fill="#334155" stroke="#1e293b" strokeWidth="2" />
        <line x1="34" y1="94" x2="86" y2="94" stroke="#06b6d4" strokeWidth="2" opacity="0.8" />
        <circle cx="60" cy="100" r="3" fill="#22d3ee" filter="url(#nexusGlow)" />

        {/* Spherical Android Head */}
        <path
          d="M 60,18 C 34,18 26,36 26,62 C 26,82 38,92 60,94 C 82,92 94,82 94,62 C 94,36 86,18 60,18 Z"
          fill="url(#nexusWhite)"
          stroke="#cbd5e1"
          strokeWidth="2"
        />

        {/* Panoramic Curved Scanner Visor */}
        <ellipse cx="60" cy="54" rx="30" ry="16" fill="#050e1d" stroke="#1e293b" strokeWidth="1.5" />

        {/* Tri-Beam Optical Sensors & Barcode Laser */}
        <circle cx="45" cy="54" r="4.5" fill="url(#nexusCyan)" filter="url(#nexusGlow)" />
        <circle cx="44" cy="53" r="1.5" fill="#ffffff" />

        <circle cx="75" cy="54" r="4.5" fill="url(#nexusCyan)" filter="url(#nexusGlow)" />
        <circle cx="74" cy="53" r="1.5" fill="#ffffff" />

        {/* Center Laser Barcode Alignment Dot */}
        <line x1="38" y1="54" x2="82" y2="54" stroke="#22d3ee" strokeWidth="0.8" opacity="0.5" />
        <circle cx="60" cy="54" r="2.5" fill="#ef4444" filter="url(#nexusGlow)" />

        {/* Chin Audio Sensor Port */}
        <rect x="52" y="76" width="16" height="4" rx="2" fill="#1e293b" />
        <line x1="54" y1="78" x2="66" y2="78" stroke="#38bdf8" strokeWidth="1" />

        {/* Antenna / LiDAR Beacon */}
        <line x1="60" y1="18" x2="60" y2="8" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="60" cy="6" r="3" fill="#38bdf8" filter="url(#nexusGlow)" />

        {/* Side Ear Servos */}
        <circle cx="24" cy="60" r="5" fill="#475569" stroke="#0ea5e9" strokeWidth="1" />
        <circle cx="96" cy="60" r="5" fill="#475569" stroke="#0ea5e9" strokeWidth="1" />
      </svg>
    </div>
  );
};
