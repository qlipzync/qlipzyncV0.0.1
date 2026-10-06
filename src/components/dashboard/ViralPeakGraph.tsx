import React from 'react';
import { Flame, TrendingUp, Sparkles } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const mockData = [
  { time: '00:00', virality: 20 },
  { time: '05:00', virality: 35 },
  { time: '10:00', virality: 45 },
  { time: '15:00', virality: 95 },
  { time: '20:00', virality: 70 },
  { time: '25:00', virality: 85 },
  { time: '30:00', virality: 60 },
];

export const ViralPeakGraph: React.FC = () => {
  return (
    <div className="w-full rounded-3xl border border-purple-500/30 bg-[#0c0822] p-6 shadow-2xl space-y-4 text-zinc-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-fuchsia-600/20 text-fuchsia-400">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Echtzeit Viralitäts-Erkennung</h3>
            <span className="text-[10px] text-zinc-400 font-mono">Gemini 2.5 Flash Audio- & Chat-Analyse</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Peak: 95%</span>
        </div>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id="viralGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d946ef" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#71717a" fontSize={10} tickLine={false} />
            <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#090518', borderColor: '#a855f7', borderRadius: '12px', fontSize: '11px' }}
            />
            <Area type="monotone" dataKey="virality" stroke="#d946ef" strokeWidth={2} fillOpacity={1} fill="url(#viralGlow)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
