import React from 'react';
import { TrendingUp, Film, Cpu, Zap } from 'lucide-react';
import { StreamerUser } from '../../types/pipeline';

interface UsageAnalyticsProps {
  user: StreamerUser;
  onOpenClipPacksModal?: () => void;
  onUpgradePlan?: () => void;
}

export const UsageAnalytics: React.FC<UsageAnalyticsProps> = ({
  user,
  onOpenClipPacksModal,
  onUpgradePlan,
}) => {
  const clipsPercent = user.clipsLimitTotal > 0 ? Math.min(100, Math.round((user.clipsUsedThisMonth / user.clipsLimitTotal) * 100)) : 0;
  const apiPercent = user.apiCallsLimit > 0 ? Math.min(100, Math.round((user.apiCallsUsed / user.apiCallsLimit) * 100)) : 0;

  return (
    <div className="w-full rounded-3xl border border-purple-500/30 bg-[#0c0822] p-6 shadow-2xl space-y-6 text-zinc-100">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-fuchsia-400" />
          <h3 className="text-sm font-bold text-white">Nutzungs- & Kontingent-Analytics</h3>
        </div>
        <div className="flex items-center gap-2">
          {onOpenClipPacksModal && (
            <button
              type="button"
              onClick={onOpenClipPacksModal}
              className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer"
            >
              + Extra Clips
            </button>
          )}
          {onUpgradePlan && (
            <button
              type="button"
              onClick={onUpgradePlan}
              className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition cursor-pointer"
            >
              Plan anpassen
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        <div className="p-4 rounded-2xl bg-[#090518] border border-purple-500/20 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400 flex items-center gap-1.5 font-bold">
              <Film className="h-4 w-4 text-purple-400" />
              <span>Verbrauchte Video-Clips</span>
            </span>
            <span className="font-mono font-black text-white">{user.clipsUsedThisMonth} / {user.clipsLimitTotal}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full" style={{ width: `${clipsPercent}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090518] border border-purple-500/20 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400 flex items-center gap-1.5 font-bold">
              <Cpu className="h-4 w-4 text-emerald-400" />
              <span>KI-API Aufrufe (Gemini)</span>
            </span>
            <span className="font-mono font-black text-white">{user.apiCallsUsed} / {user.apiCallsLimit}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${apiPercent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
