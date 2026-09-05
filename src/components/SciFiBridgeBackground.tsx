import React, { useEffect, useRef } from 'react';

export const SciFiBridgeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Airborne transport light particles
    interface Vehicle {
      x: number;
      y: number;
      speed: number;
      color: string;
      size: number;
      length: number;
    }

    const vehicles: Vehicle[] = Array.from({ length: 22 }, () => ({
      x: Math.random() * width,
      y: height * 0.35 + Math.random() * (height * 0.25),
      speed: 0.8 + Math.random() * 2.2,
      color: Math.random() > 0.4 ? 'rgba(34, 211, 238, ' : 'rgba(245, 158, 11, ',
      size: 1.5 + Math.random() * 1.5,
      length: 15 + Math.random() * 30
    }));

    // City skyline skyscraper definitions
    interface Building {
      x: number;
      w: number;
      h: number;
      hasSpire: boolean;
      windowColor: string;
      beaconColor: string;
    }

    const buildings: Building[] = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      const w = 24 + Math.random() * 45;
      const h = height * 0.22 + Math.random() * (height * 0.38);
      const x = (i / count) * (width * 1.2) - width * 0.1;
      buildings.push({
        x,
        w,
        h,
        hasSpire: Math.random() > 0.5,
        windowColor: Math.random() > 0.5 ? 'rgba(34,211,238,' : 'rgba(251,191,36,',
        beaconColor: Math.random() > 0.5 ? '#ef4444' : '#22d3ee'
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // 1. Twilight Sky Gradient (warm sunset into dark violet blue)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.7);
      skyGrad.addColorStop(0, '#050a18');
      skyGrad.addColorStop(0.35, '#0b162f');
      skyGrad.addColorStop(0.65, '#2c1e40');
      skyGrad.addColorStop(0.85, '#683344');
      skyGrad.addColorStop(1, '#b05342');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height * 0.75);

      // Horizon atmospheric haze
      const hazeGrad = ctx.createLinearGradient(0, height * 0.45, 0, height * 0.75);
      hazeGrad.addColorStop(0, 'rgba(249, 115, 22, 0)');
      hazeGrad.addColorStop(0.7, 'rgba(249, 115, 22, 0.25)');
      hazeGrad.addColorStop(1, 'rgba(217, 70, 239, 0.2)');
      ctx.fillStyle = hazeGrad;
      ctx.fillRect(0, height * 0.45, width, height * 0.3);

      // 2. Distant background mountain / cloud silhouettes
      ctx.fillStyle = 'rgba(18, 20, 42, 0.85)';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.65);
      for (let x = 0; x <= width; x += 60) {
        const y = height * 0.62 + Math.sin(x * 0.005) * 20 + Math.cos(x * 0.015) * 10;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height * 0.75);
      ctx.lineTo(0, height * 0.75);
      ctx.closePath();
      ctx.fill();

      // 3. Cyberpunk Skyscrapers
      buildings.forEach((b) => {
        const by = height * 0.7 - b.h;
        // Building body
        const bGrad = ctx.createLinearGradient(b.x, by, b.x + b.w, by + b.h);
        bGrad.addColorStop(0, '#101d36');
        bGrad.addColorStop(1, '#080d1a');
        ctx.fillStyle = bGrad;
        ctx.fillRect(b.x, by, b.w, b.h);

        // Edge highlights
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x, by, b.w, b.h);

        // Spire & Blinking Beacon
        if (b.hasSpire) {
          ctx.beginPath();
          ctx.moveTo(b.x + b.w / 2, by);
          ctx.lineTo(b.x + b.w / 2, by - 24);
          ctx.strokeStyle = '#38bdf8';
          ctx.stroke();

          // Blinking light
          const blink = (Math.sin(time * 3 + b.x) + 1) / 2;
          ctx.fillStyle = b.beaconColor;
          ctx.beginPath();
          ctx.arc(b.x + b.w / 2, by - 24, 1.5 + blink * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Window matrix lights
        const rows = Math.floor(b.h / 14);
        const cols = Math.floor(b.w / 8);
        for (let r = 2; r < rows - 1; r += 2) {
          for (let c = 1; c < cols; c++) {
            if ((b.x + r + c) % 3 === 0) {
              const alpha = 0.3 + ((Math.sin(time + r) + 1) / 4);
              ctx.fillStyle = b.windowColor + alpha + ')';
              ctx.fillRect(b.x + c * 7, by + r * 13, 3, 5);
            }
          }
        }
      });

      // 4. Flying vehicle skyway trails
      vehicles.forEach((v) => {
        v.x += v.speed;
        if (v.x > width + 50) v.x = -50;

        const grad = ctx.createLinearGradient(v.x - v.length, v.y, v.x, v.y);
        grad.addColorStop(0, v.color + '0)');
        grad.addColorStop(0.7, v.color + '0.4)');
        grad.addColorStop(1, v.color + '0.95)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = v.size;
        ctx.beginPath();
        ctx.moveTo(v.x - v.length, v.y);
        ctx.lineTo(v.x, v.y);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(v.x, v.y, v.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Command Bridge Glass Horizon Overlay
      const glassReflect = ctx.createLinearGradient(0, 0, width, height * 0.8);
      glassReflect.addColorStop(0, 'rgba(34, 211, 238, 0.04)');
      glassReflect.addColorStop(0.4, 'rgba(255, 255, 255, 0.01)');
      glassReflect.addColorStop(0.8, 'rgba(15, 23, 42, 0.4)');
      ctx.fillStyle = glassReflect;
      ctx.fillRect(0, 0, width, height * 0.75);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Cityscape Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

      {/* Panoramic Window Arch Struts and Frame */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1600 900"
      >
        <defs>
          <linearGradient id="metalGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#080e1a" />
            <stop offset="50%" stopColor="#121b2d" />
            <stop offset="100%" stopColor="#060a14" />
          </linearGradient>

          <linearGradient id="glowBorder" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Top curved canopy / ceiling bulkhead */}
        <path
          d="M 0,0 L 1600,0 L 1600,110 C 1200,60 400,60 0,110 Z"
          fill="url(#metalGrad)"
          stroke="#1e293b"
          strokeWidth="2"
        />

        {/* Curved Left Window Pillar */}
        <path
          d="M 0,0 L 70,0 C 130,280 130,580 60,820 L 0,820 Z"
          fill="url(#metalGrad)"
          stroke="#0f172a"
          strokeWidth="2"
        />

        {/* Curved Right Window Pillar */}
        <path
          d="M 1600,0 L 1530,0 C 1470,280 1470,580 1540,820 L 1600,820 Z"
          fill="url(#metalGrad)"
          stroke="#0f172a"
          strokeWidth="2"
        />

        {/* Structural Arch Rib lines */}
        <path
          d="M 70,110 C 450,55 1150,55 1530,110"
          fill="none"
          stroke="url(#glowBorder)"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Vertical window mullions / support struts */}
        <line x1="380" y1="80" x2="360" y2="600" stroke="#0e1726" strokeWidth="6" opacity="0.75" />
        <line x1="380" y1="80" x2="360" y2="600" stroke="#06b6d4" strokeWidth="1" opacity="0.3" />

        <line x1="1220" y1="80" x2="1240" y2="600" stroke="#0e1726" strokeWidth="6" opacity="0.75" />
        <line x1="1220" y1="80" x2="1240" y2="600" stroke="#06b6d4" strokeWidth="1" opacity="0.3" />

        {/* Background Crew & Android Silhouettes */}
        {/* Left operator standing looking at screen */}
        <g opacity="0.55" transform="translate(100, 480)">
          {/* Desk & terminal */}
          <rect x="0" y="55" width="80" height="40" rx="3" fill="#0c1424" />
          <path d="M 25,25 L 60,25 L 55,55 L 20,55 Z" fill="#075985" opacity="0.7" />
          <line x1="20" y1="35" x2="55" y2="35" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Seated operator */}
          <circle cx="95" cy="40" r="10" fill="#060c18" />
          <path d="M 85,52 C 85,45 105,45 105,52 L 108,85 L 82,85 Z" fill="#081020" />
        </g>

        {/* Mid-ground center-left operator & android */}
        <g opacity="0.45" transform="translate(560, 500)">
          <rect x="20" y="50" width="70" height="35" fill="#081020" />
          <polygon points="30,25 65,25 60,50 25,50" fill="#0369a1" opacity="0.5" />
          <circle cx="45" cy="35" r="7" fill="#040914" />
        </g>

        {/* Right side Cute White Android Robot (sitting/working) */}
        <g opacity="0.8" transform="translate(1360, 510)">
          {/* Small warehouse biped robot body */}
          {/* Head */}
          <ellipse cx="40" cy="30" rx="14" ry="12" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
          {/* Cyan glowing visor face */}
          <path d="M 30,28 Q 40,33 50,28" stroke="#06b6d4" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Torso */}
          <path d="M 28,42 L 52,42 L 48,70 L 32,70 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          <circle cx="40" cy="55" r="4" fill="#0284c7" />
          {/* Legs */}
          <rect x="30" y="70" width="8" height="24" rx="4" fill="#e2e8f0" />
          <rect x="42" y="70" width="8" height="24" rx="4" fill="#e2e8f0" />
          {/* Glowing sensor antenna */}
          <circle cx="40" cy="14" r="2.5" fill="#38bdf8" />
          <line x1="40" y1="16" x2="40" y2="20" stroke="#94a3b8" strokeWidth="1" />
        </g>

        {/* Another standing robot on the right */}
        <g opacity="0.75" transform="translate(1440, 520)">
          <ellipse cx="25" cy="26" rx="12" ry="10" fill="#f1f5f9" />
          <ellipse cx="25" cy="26" rx="8" ry="4" fill="#0284c7" />
          <path d="M 16,36 L 34,36 L 31,64 L 19,64 Z" fill="#e2e8f0" />
          <rect x="18" y="64" width="6" height="20" rx="3" fill="#cbd5e1" />
          <rect x="26" y="64" width="6" height="20" rx="3" fill="#cbd5e1" />
        </g>

        {/* Foreground Command Table / Operation Deck Base Metal */}
        <g transform="translate(0, 680)">
          {/* Main Metallic Chamfered Deck Surface */}
          <polygon
            points="0,220 220,100 1380,100 1600,220"
            fill="#060c18"
            stroke="#162238"
            strokeWidth="2"
          />

          {/* Front Bevel Rim */}
          <polygon
            points="0,220 1600,220 1600,225 0,225"
            fill="#091426"
            stroke="#0ea5e9"
            strokeWidth="0.5"
            opacity="0.8"
          />

          {/* Top Deck Accent Line */}
          <line x1="230" y1="102" x2="1370" y2="102" stroke="#0284c7" strokeWidth="1.5" opacity="0.6" />

          {/* Chamfered Joint Insets */}
          <line x1="220" y1="100" x2="0" y2="220" stroke="#0369a1" strokeWidth="1.5" opacity="0.4" />
          <line x1="1380" y1="100" x2="1600" y2="220" stroke="#0369a1" strokeWidth="1.5" opacity="0.4" />

          {/* Subtle Desk vents & tech panels */}
          <rect x="420" y="112" width="120" height="4" rx="2" fill="#0284c7" opacity="0.3" />
          <rect x="1060" y="112" width="120" height="4" rx="2" fill="#0284c7" opacity="0.3" />
        </g>
      </svg>

      {/* Atmospheric Vignette & Horizon Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/60 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/70 pointer-events-none" />
    </div>
  );
};
