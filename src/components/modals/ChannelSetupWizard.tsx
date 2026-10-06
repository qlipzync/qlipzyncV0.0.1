import React, { useState } from 'react';
import { X, Tv, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { StreamerUser } from '../../types/pipeline';

interface ChannelSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  user: StreamerUser;
  onUpdateUser?: (user: StreamerUser) => void;
  onOpen2FA?: () => void;
}

export const ChannelSetupWizard: React.FC<ChannelSetupWizardProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onOpen2FA,
}) => {
  const [clientId, setClientId] = useState('');
  const [secret, setSecret] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: StreamerUser = {
      ...user,
      isFullyConfigured: true,
      onboardingStep: 4,
    };
    onUpdateUser?.(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-3xl border border-purple-500/30 bg-[#0c0822] p-6 sm:p-8 shadow-2xl relative space-y-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-400">
            <Tv className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black font-display text-white">Twitch EventSub Konfiguration</h2>
          <p className="text-xs text-zinc-400">
            Hinterlege deine Twitch Client-ID und Webhook-Secret für verzögerungsfreie Go-Live Erkennung.
          </p>
        </div>

        <div className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold text-zinc-400">Twitch Client-ID</label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="z. B. afht5r000ofphuq2uh4aljljp0nivv"
              className="w-full px-3.5 py-2.5 rounded-xl border border-purple-500/30 bg-zinc-950 text-white text-xs font-mono focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold text-zinc-400">Twitch Webhook Secret</label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-purple-500/30 bg-zinc-950 text-white text-xs font-mono focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {onOpen2FA && (
            <button
              type="button"
              onClick={onOpen2FA}
              className="text-xs text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>2FA einrichten</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer transition shadow"
          >
            Speichern & Fertigstellen ↗
          </button>
        </div>
      </div>
    </div>
  );
};
