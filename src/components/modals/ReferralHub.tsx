import React, { useState } from 'react';
import { X, Gift, Copy, Check, Users } from 'lucide-react';
import { StreamerUser } from '../../types/pipeline';
import { buildReferralLink } from '../../lib/firebaseAuth';

interface ReferralHubProps {
  isOpen?: boolean;
  onClose?: () => void;
  user: StreamerUser;
  onUpdateUser?: (user: StreamerUser) => void;
}

export const ReferralHub: React.FC<ReferralHubProps> = ({ isOpen = true, onClose, user, onUpdateUser }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const refLink = buildReferralLink(user.channelName || user.name, user.referralCode);

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-3xl border border-purple-500/30 bg-[#0c0822] p-6 sm:p-8 shadow-2xl space-y-6 text-zinc-100">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-fuchsia-600/20 border border-fuchsia-500/40 flex items-center justify-center text-fuchsia-400">
            <Gift className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black font-display text-white">Streamer Referral & Bonus Hub</h2>
            <p className="text-xs text-zinc-400">Empfiehl QuickClick weiter & erhalte +30 Bonus-Clips.</p>
          </div>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-white transition cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="p-4 rounded-2xl border border-purple-500/30 bg-[#090518] space-y-2 text-left">
        <label className="text-[11px] font-mono font-bold text-zinc-400">Dein persönlicher Einladungslink</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={refLink}
            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 select-all"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
          <span className="text-[10px] text-zinc-400 block font-mono">Geworbene Streamer</span>
          <span className="text-xl font-black text-white font-mono">{user.referralCount || 0}</span>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
          <span className="text-[10px] text-zinc-400 block font-mono">Verdiente Credits</span>
          <span className="text-xl font-black text-fuchsia-400 font-mono">{user.earnedCredits || 0} €</span>
        </div>
      </div>
    </div>
  );
};
