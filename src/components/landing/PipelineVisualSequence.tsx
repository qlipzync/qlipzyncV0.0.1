import React from 'react';
import { Tv, Cpu, Share2, Check, Zap } from 'lucide-react';

export const PipelineVisualSequence: React.FC = () => {
  return (
    <div className="w-full rounded-3xl border border-purple-500/30 bg-[#0c0822] p-6 shadow-2xl space-y-4 text-zinc-100">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-fuchsia-400" />
          <h3 className="text-sm font-bold text-white">QuickClick Pipeline Sequenz</h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Autopilot Aktiv</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
            <Tv className="h-4 w-4" />
            <span>1. Twitch Stream</span>
          </div>
          <p className="text-[11px] text-zinc-400">Automatische Webhook-Erfassung von Live-Streams & Highlights.</p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <div className="flex items-center gap-2 text-fuchsia-400 text-xs font-bold">
            <Cpu className="h-4 w-4" />
            <span>2. Gemini 2.5 Flash</span>
          </div>
          <p className="text-[11px] text-zinc-400">Transkription, Facecam-Tracking & 9:16 Video-Zuschnitt in /dev/shm.</p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
            <Share2 className="h-4 w-4" />
            <span>3. Multi-Social Sync</span>
          </div>
          <p className="text-[11px] text-zinc-400">Autonomer Upload auf TikTok, YouTube Shorts & Instagram Reels.</p>
        </div>
      </div>
    </div>
  );
};
