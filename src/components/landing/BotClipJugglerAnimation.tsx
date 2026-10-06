import React, { useState, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Zap,
  Tv,
  Share2,
  Cpu,
  Flame,
  Radio,
  Play,
  Pause,
  Layers,
  ArrowRight,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

interface BotClipJugglerAnimationProps {
  autoPlay?: boolean;
  activeStep?: 1 | 2 | 3;
  onStepChange?: (step: 1 | 2 | 3) => void;
}

export const BotClipJugglerAnimation: React.FC<BotClipJugglerAnimationProps> = ({
  autoPlay = true,
  activeStep: externalStep,
  onStepChange,
}) => {
  const [internalStep, setInternalStep] = useState<1 | 2 | 3>(externalStep || 1);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [speed, setSpeed] = useState<number>(1);
  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(0);

  const currentStep = externalStep !== undefined ? externalStep : internalStep;

  // Auto-cycling sequence
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 4000 / speed;
    const interval = setInterval(() => {
      setInternalStep((prev) => {
        const next = prev === 3 ? 1 : ((prev + 1) as 1 | 2 | 3);
        if (onStepChange) onStepChange(next);
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, speed, onStepChange]);

  // Frame tick for subtitles & particle excitement
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setActiveFrameIndex((prev) => (prev + 1) % 3);
    }, 1800);
    return () => clearInterval(frameInterval);
  }, []);

  const handleStepClick = (step: 1 | 2 | 3) => {
    setInternalStep(step);
    if (onStepChange) onStepChange(step);
  };

  const clipHighlights = [
    { title: 'ACE IN OT!', virality: '98%', text: 'HIGHLIGHT ERKANNT 🔥', color: 'from-fuchsia-500 to-pink-500' },
    { title: 'INSANE FLICKSHOT', virality: '96%', text: 'FACE-TRACKING 9:16 🎯', color: 'from-purple-500 to-indigo-500' },
    { title: 'CLUTCH 1v3 WIN', virality: '94%', text: 'SUBTITLES KINETISCH ✨', color: 'from-cyan-500 to-blue-500' },
  ];

  return (
    <div className="relative w-full rounded-3xl border border-purple-500/30 bg-gradient-to-b from-[#0c0822] via-[#090518] to-[#070514] p-5 sm:p-8 shadow-2xl overflow-hidden text-zinc-100">
      {/* Background Ambient Glows */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar: Status, Controls & Step Badges */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-purple-500/20">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-[#9146FF] to-fuchsia-500 text-white shadow-lg shadow-purple-500/20 animate-pulse">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black font-display text-white tracking-wide">
                AUTONOMER CLIP-JUGGLER BOT
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                0 MB RAM
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-400">
              Twitch EventSub ➔ Gemini 2.5 Flash ➔ 9:16 Multi-Social Upload
            </p>
          </div>
        </div>

        {/* Step Indicator Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center rounded-xl bg-[#09041a] border border-purple-500/30 p-1">
            <button
              type="button"
              onClick={() => handleStepClick(1)}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentStep === 1
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Tv className="h-3 w-3" />
              <span>1. Ingest</span>
            </button>
            <button
              type="button"
              onClick={() => handleStepClick(2)}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentStep === 2
                  ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Cpu className="h-3 w-3" />
              <span>2. 9:16 Cut</span>
            </button>
            <button
              type="button"
              onClick={() => handleStepClick(3)}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentStep === 3
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Share2 className="h-3 w-3" />
              <span>3. Multi-Post</span>
            </button>
          </div>

          {/* Play/Pause & Speed Buttons */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-xl border border-purple-500/30 bg-[#09041a] text-zinc-300 hover:text-white hover:border-purple-400 transition cursor-pointer"
            title={isPlaying ? 'Animation anhalten' : 'Animation abspielen'}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5 text-fuchsia-400" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
          </button>
          <button
            type="button"
            onClick={() => setSpeed(speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1)}
            className="px-2 py-1 rounded-xl border border-purple-500/30 bg-[#09041a] text-[10px] font-mono font-bold text-zinc-300 hover:text-white transition cursor-pointer"
            title="Geschwindigkeit anpassen"
          >
            {speed}x
          </button>
        </div>
      </div>

      {/* Main Interactive Stage: Canvas & Particle Pipeline Visualizer */}
      <div className="relative z-10 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Node: Twitch Stream Live Ingest */}
          <div
            onClick={() => handleStepClick(1)}
            className={`lg:col-span-3 rounded-2xl p-4 transition-all duration-300 cursor-pointer text-left relative overflow-hidden ${
              currentStep === 1
                ? 'border-2 border-purple-500 bg-[#160a35] shadow-xl shadow-purple-500/25 scale-[1.02]'
                : 'border border-purple-500/25 bg-[#090518]/80 hover:border-purple-500/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5 text-xs font-mono font-black text-purple-400">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                TWITCH GO-LIVE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                0s EventSub
              </span>
            </div>

            <div className="relative rounded-xl border border-purple-500/30 bg-black/60 p-3 flex flex-col items-center justify-center space-y-2">
              <Tv className="h-8 w-8 text-[#9146FF] animate-pulse" />
              <div className="w-full space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>Chat Peak Rate</span>
                  <span className="text-purple-400 font-bold">42 msg/sec</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 w-[85%] animate-pulse" />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-zinc-300 mt-2.5">
              Automatische Erkennung bei Streamstart & Clip-Peaks ohne Verzögerung.
            </p>
          </div>

          {/* Center Stage: The Juggling Bot & Vertical 9:16 Hologram */}
          <div
            onClick={() => handleStepClick(2)}
            className={`lg:col-span-6 rounded-2xl p-5 sm:p-6 transition-all duration-300 cursor-pointer text-center relative overflow-hidden ${
              currentStep === 2
                ? 'border-2 border-fuchsia-500 bg-[#190a3c] shadow-2xl shadow-fuchsia-500/30 scale-[1.02]'
                : 'border border-purple-500/30 bg-[#0c0622] hover:border-purple-500/60'
            }`}
          >
            {/* Holographic Laser Stream Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="url(#laserGrad)" strokeWidth="2" strokeDasharray="6,6" className="animate-pipeline-laser" />
              <defs>
                <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9146FF" />
                  <stop offset="50%" stopColor="#D946EF" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Juggler Bot Character & Live Juggled Frame */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              {/* Bot Character Animation */}
              <div className="relative flex flex-col items-center">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 p-0.5 shadow-xl shadow-fuchsia-500/30 animate-astronaut-bob">
                  <div className="h-full w-full rounded-[14px] bg-[#0c0822] flex flex-col items-center justify-center space-y-1 p-2">
                    <Bot className="h-8 w-8 text-fuchsia-400 animate-pulse" />
                    <span className="text-[8px] font-mono font-black text-white px-1.5 py-0.5 rounded bg-fuchsia-500/20 border border-fuchsia-500/40">
                      GEMINI 2.5
                    </span>
                  </div>
                </div>
                {/* Bot Thruster Flame */}
                <div className="w-6 h-3 bg-gradient-to-b from-rose-500 via-amber-400 to-transparent rounded-full animate-thruster mt-0.5" />
                <span className="text-[10px] font-mono text-zinc-400 mt-1 font-bold">
                  /dev/shm (0 MB Disk)
                </span>
              </div>

              {/* Juggled 9:16 Vertical Video Preview Simulator */}
              <div className="relative w-36 h-56 rounded-2xl border-2 border-fuchsia-400/80 bg-black/80 shadow-2xl shadow-fuchsia-500/40 p-2 flex flex-col justify-between overflow-hidden animate-clip-glow">
                {/* Top Video Header */}
                <div className="flex items-center justify-between text-[9px] font-mono text-white">
                  <span className="px-1.5 py-0.5 rounded bg-fuchsia-500/30 text-fuchsia-300 font-bold border border-fuchsia-500/40">
                    9:16 HD
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <Flame className="h-3 w-3 text-amber-400" />
                    {clipHighlights[activeFrameIndex].virality}
                  </span>
                </div>

                {/* Simulated AI Face-Tracking Box */}
                <div className="my-auto relative flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-xl border-2 border-dashed border-cyan-400 flex items-center justify-center relative animate-pulse">
                    <span className="text-[8px] font-mono text-cyan-300 bg-cyan-950/80 px-1 py-0.5 rounded border border-cyan-500/30">
                      FaceCam AI
                    </span>
                  </div>
                  {/* Kinetic Subtitle Banner */}
                  <div className="mt-2 px-2 py-1 rounded-md bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-black text-[10px] shadow-lg animate-bounce">
                    {clipHighlights[activeFrameIndex].text}
                  </div>
                </div>

                {/* Bottom Timeline Indicator */}
                <div className="w-full space-y-1">
                  <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 w-full animate-pipeline-laser" />
                  </div>
                  <span className="text-[8px] font-mono text-zinc-400 block truncate text-center">
                    Auto-Cropped by QlipZync
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs font-semibold text-zinc-300 mt-4 relative z-10">
              Echtzeit Transkription, kinetische Untertitel & Smart-Crop direkt im RAM.
            </p>
          </div>

          {/* Right Node: Multi-Social Distribution */}
          <div
            onClick={() => handleStepClick(3)}
            className={`lg:col-span-3 rounded-2xl p-4 transition-all duration-300 cursor-pointer text-left relative overflow-hidden ${
              currentStep === 3
                ? 'border-2 border-cyan-500 bg-[#091a35] shadow-xl shadow-cyan-500/25 scale-[1.02]'
                : 'border border-cyan-500/25 bg-[#07101f]/80 hover:border-cyan-500/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5 text-xs font-mono font-black text-cyan-400">
                <Share2 className="h-3.5 w-3.5" />
                MULTI-POST
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Synchron
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-2 rounded-xl bg-black/50 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold text-white">YouTube Shorts</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">100% Upload</span>
              </div>
              <div className="p-2 rounded-xl bg-black/50 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-xs font-bold text-white">TikTok</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">100% Upload</span>
              </div>
              <div className="p-2 rounded-xl bg-black/50 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-pink-500" />
                  <span className="text-xs font-bold text-white">Instagram Reels</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">100% Upload</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-300 mt-2.5">
              Automatisches Multi-Posting ohne manuelles Rendern oder Downloads.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Ticker Bar */}
      <div className="relative z-10 pt-4 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-300 font-bold">TELEMETRIE:</span>
          <span>Buffer: 0,00 MB</span>
          <span className="text-zinc-600">|</span>
          <span>Engine: Gemini 2.5 Flash</span>
          <span className="text-zinc-600">|</span>
          <span>Server: Frankfurt (europe-west3)</span>
        </div>
        <div className="text-fuchsia-400 font-semibold">
          Aktiver Modus: {currentStep === 1 ? '1. Ingest EventSub' : currentStep === 2 ? '2. KI 9:16 Video Rendering' : '3. Paralleler Social Sync'}
        </div>
      </div>
    </div>
  );
};
