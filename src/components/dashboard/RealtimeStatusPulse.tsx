import React from 'react';
import { Radio, Zap } from 'lucide-react';

export const RealtimeStatusPulse: React.FC = () => {
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-400">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
      </span>
      <span className="font-mono text-[11px] text-emerald-400 font-bold">ALL SYSTEMS OPERATIONAL (0 MB RAM)</span>
    </div>
  );
};
