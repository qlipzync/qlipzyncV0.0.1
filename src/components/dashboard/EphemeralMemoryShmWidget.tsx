import React from 'react';
import { Database, ShieldCheck, Sparkles, Server } from 'lucide-react';

export const EphemeralMemoryShmWidget: React.FC = () => {
  return (
    <div className="w-full rounded-2xl border border-purple-500/20 bg-[#090518] p-4 text-xs text-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-purple-600/20 text-fuchsia-400">
          <Server className="h-4 w-4" />
        </div>
        <div>
          <span className="font-bold text-white block leading-tight">Flüchtiger Speicher: /dev/shm</span>
          <span className="text-[10px] text-zinc-400 font-mono">0 MB persistenter Festplattenverbrauch • Auto-Purge aktiv</span>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 font-mono text-[11px] bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 font-bold">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>0.00 MB / 1024 MB (100% frei)</span>
      </div>
    </div>
  );
};
