import React from 'react';
import { Trophy, Award, Users } from 'lucide-react';
import { StreamerUser } from '../../types/pipeline';

interface TopReferrersLeaderboardProps {
  user?: StreamerUser;
  onUpdateUser?: (user: StreamerUser) => void;
  onOpenClipPacksModal?: () => void;
}

export const TopReferrersLeaderboard: React.FC<TopReferrersLeaderboardProps> = ({
  user,
  onUpdateUser,
  onOpenClipPacksModal,
}) => {
  const leaders = [
    { rank: 1, name: 'sh00trs.tv', referrals: 42, reward: '+1260 Clips' },
    { rank: 2, name: 'twoandahalfeafc', referrals: 28, reward: '+840 Clips' },
    { rank: 3, name: 'eliasn97', referrals: 19, reward: '+570 Clips' },
  ];

  return (
    <div className="w-full rounded-3xl border border-purple-500/30 bg-[#0c0822] p-6 shadow-2xl space-y-4 text-zinc-100">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Streamer Referral Rangliste</h3>
        </div>
        {onOpenClipPacksModal && (
          <button
            type="button"
            onClick={onOpenClipPacksModal}
            className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer"
          >
            Extra Clips
          </button>
        )}
      </div>

      <div className="space-y-2">
        {leaders.map((item) => (
          <div key={item.rank} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-amber-400 w-4">#{item.rank}</span>
              <span className="font-bold text-white">{item.name}</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-zinc-400">
              <span>{item.referrals} Streamer geworben</span>
              <span className="text-emerald-400 font-bold">{item.reward}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
