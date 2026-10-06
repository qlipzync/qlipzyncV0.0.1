import React from 'react';
import { Bot, Sparkles, Zap, Radio, Share2, Tv, Cpu } from 'lucide-react';

export const AstronautPipelineCanvas: React.FC = () => {
  return (
    <div className="relative w-full rounded-3xl border border-purple-500/30 bg-gradient-to-b from-[#0c0822] to-[#070514] p-6 shadow-2xl overflow-hidden text-zinc-100">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-purple-500/20 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-600/20 text-[#9146FF] border border-purple-500/30">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-display">
              Autonome Telemetrie & Motion-Pipeline
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono">
              Twitch EventSub ➔ 0 MB RAM Ephemeral Engine ➔ Multi-Social Post
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Pipeline Bereit</span>
        </span>
      </div>

      {/* SVG Motion Path Canvas */}
      <div className="relative w-full h-48 sm:h-56 my-4 flex items-center justify-center overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Grid Lines */}
          <line x1="50" y1="120" x2="1150" y2="120" stroke="rgba(147, 51, 234, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="600" y1="20" x2="600" y2="220" stroke="rgba(217, 70, 239, 0.15)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Orbital Laser Vector Path */}
          <path
            d="M 80,110 C 170,110 250,50 340,50 C 430,50 510,170 600,170 C 690,170 770,50 860,50 C 950,50 1030,110 1120,110 C 1170,110 1180,215 1100,215 C 800,225 400,225 100,215 C 20,215 30,110 80,110 Z"
            stroke="url(#motionGrad)"
            strokeWidth="3"
            strokeDasharray="12 18"
            className="animate-pipeline-laser"
          />

          {/* Pulsing Event Nodes */}
          {/* Node 1: Twitch Ingest */}
          <circle cx="80" cy="110" r="14" fill="#160835" stroke="#9146FF" strokeWidth="2.5" />
          <circle cx="80" cy="110" r="6" fill="#9146FF" className="animate-ping opacity-75" />
          <text x="80" y="145" textAnchor="middle" fill="#c084fc" fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="bold">TWITCH INGEST</text>

          {/* Node 2: Gemini KI Transcoder */}
          <circle cx="600" cy="170" r="18" fill="#250942" stroke="#D946EF" strokeWidth="3" />
          <circle cx="600" cy="170" r="8" fill="#D946EF" className="animate-ping opacity-75" />
          <text x="600" y="208" textAnchor="middle" fill="#f472b6" fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="bold">GEMINI 2.5 KI (0 MB RAM)</text>

          {/* Node 3: Multi-Social Sync */}
          <circle cx="1120" cy="110" r="14" fill="#091b38" stroke="#06B6D4" strokeWidth="2.5" />
          <circle cx="1120" cy="110" r="6" fill="#06B6D4" className="animate-ping opacity-75" />
          <text x="1120" y="145" textAnchor="middle" fill="#67e8f9" fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="bold">MULTI-SOCIAL POST</text>

          {/* Motion Path Rider: Flying Astronaut / Bot Juggler */}
          <g className="astronaut-path-rider" style={{ '--pipeline-duration': '14s' } as React.CSSProperties}>
            <g transform="translate(-20, -20)">
              {/* Bot Glow & Body */}
              <circle cx="20" cy="20" r="16" fill="#0c0822" stroke="#D946EF" strokeWidth="2" filter="url(#botGlow)" />
              <circle cx="20" cy="20" r="6" fill="#38bdf8" />
              {/* Thruster Flame */}
              <path d="M 16,36 Q 20,44 24,36 Z" fill="#f43f5e" className="animate-thruster" />
            </g>
          </g>

          {/* Gradients and Filters */}
          <defs>
            <linearGradient id="motionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9146FF" />
              <stop offset="50%" stopColor="#D946EF" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <filter id="botGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#D946EF" floodOpacity="0.8" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Bottom 3 Phase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-left text-xs relative z-10">
        <div className="p-3.5 rounded-2xl bg-[#090518] border border-purple-500/20 space-y-1">
          <div className="flex items-center gap-1.5 text-purple-400 font-mono font-bold text-[10px]">
            <Tv className="h-3 w-3" />
            <span>1. TWITCH EVENTSUB</span>
          </div>
          <span className="font-bold text-white block">0s Latenz Webhook</span>
          <p className="text-[11px] text-zinc-400">Automatische Erfassung bei Go-Live und Chat-Spikes.</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#090518] border border-purple-500/20 space-y-1">
          <div className="flex items-center gap-1.5 text-fuchsia-400 font-mono font-bold text-[10px]">
            <Cpu className="h-3 w-3" />
            <span>2. 0 MB RAM PIPELINE</span>
          </div>
          <span className="font-bold text-white block">Gemini 2.5 Flash</span>
          <p className="text-[11px] text-zinc-400">Facecam-Tracking & kinetische Subtitles flüchtig in /dev/shm.</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#090518] border border-purple-500/20 space-y-1">
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-bold text-[10px]">
            <Share2 className="h-3 w-3" />
            <span>3. MULTI-SOCIAL SYNC</span>
          </div>
          <span className="font-bold text-white block">Shorts, TikTok, Reels</span>
          <p className="text-[11px] text-zinc-400">Gleichzeitiger Upload auf alle Plattformen ohne Verzögerung.</p>
        </div>
      </div>
    </div>
  );
};
