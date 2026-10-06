import React from 'react';
import { X, Sparkles, Check, Clock } from 'lucide-react';

interface FutureRoadmapHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FutureRoadmapHub: React.FC<FutureRoadmapHubProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-3xl border border-purple-500/30 bg-[#0c0822] p-6 sm:p-8 shadow-2xl relative space-y-6 text-zinc-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black font-display text-white">QlipZync System Roadmap</h2>
          <p className="text-xs text-zinc-400">Kommende Features & Innovationen für den Streamer-Autopiloten.</p>
        </div>

        <div className="space-y-3 text-left">
          <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-1">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">Zero-Storage 0 MB RAM Engine</span>
            </div>
            <p className="text-[11px] text-zinc-400 pl-6">Vollständig flüchtige Highlight-Generierung in /dev/shm.</p>
          </div>

          <div className="p-3 rounded-xl border border-purple-500/30 bg-purple-950/20 space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-fuchsia-400" />
              <span className="text-xs font-bold text-white">Automatischer Multi-Language Subtitle Dub</span>
            </div>
            <p className="text-[11px] text-zinc-400 pl-6">Synchrone KI-Sprachübersetzung in 12 europäische Sprachen.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
