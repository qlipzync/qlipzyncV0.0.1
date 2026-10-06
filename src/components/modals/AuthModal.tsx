import React, { useState } from 'react';
import { Tv, ShieldCheck, Lock, X, Zap, ArrowRight } from 'lucide-react';
import { StreamerUser, SubscriptionPlan } from '../../types/pipeline';
import { authenticateWithTwitch } from '../../lib/firebaseAuth';
import { DEFAULT_TWITCH_CLIENT_ID } from '../../lib/twitchApi';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: StreamerUser) => void;
  preferredPlan?: SubscriptionPlan;
  initialChannel?: string;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
  onOpenImpressum?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  preferredPlan = 'pro',
  initialChannel = '',
  onOpenTerms,
  onOpenPrivacy,
}) => {
  const [channelInput, setChannelInput] = useState(initialChannel);
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOAuthTwitch = () => {
    const clientId = DEFAULT_TWITCH_CLIENT_ID;
    const redirectUri = window.location.origin;
    const scope = encodeURIComponent('user:read:email clips:edit');
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}`;
    window.location.href = authUrl;
  };

  const handleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelInput.trim()) {
      setErrorMsg('Bitte gib deinen Twitch-Kanalnamen ein.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const user = await authenticateWithTwitch(channelInput.trim(), preferredPlan, passwordInput);
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Anmeldung fehlgeschlagen.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-3xl border border-purple-500/30 bg-[#0c0822] p-6 sm:p-8 shadow-2xl relative space-y-6">
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
          <h2 className="text-2xl font-black font-display text-white">Twitch Autopilot Login</h2>
          <p className="text-xs text-zinc-400">Verbinde deinen Kanal für 100% autonomen Clip-Schnitt.</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        <button
          type="button"
          onClick={handleOAuthTwitch}
          className="w-full py-3.5 rounded-xl bg-[#9146FF] hover:bg-[#7d32eb] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition cursor-pointer active:scale-95"
        >
          <Tv className="h-4 w-4" />
          <span>Mit Twitch autorisieren ↗</span>
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-zinc-800" />
          <span className="flex-shrink mx-4 text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Oder Direkt-Login</span>
          <div className="flex-grow border-t border-zinc-800" />
        </div>

        <form onSubmit={handleDirectLogin} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="text-[11px] font-mono font-bold text-zinc-400">Twitch Kanalname / Streamer</label>
            <input
              type="text"
              value={channelInput}
              onChange={(e) => setChannelInput(e.target.value)}
              placeholder="z. B. sh00trs oder dein_kanal"
              className="w-full px-3.5 py-2.5 rounded-xl border border-purple-500/30 bg-zinc-950 text-white text-xs focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[11px] font-mono font-bold text-zinc-400">Passwort / VIP-Code (optional)</label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Für Admin / VIP Zugang"
              className="w-full px-3.5 py-2.5 rounded-xl border border-purple-500/30 bg-zinc-950 text-white text-xs focus:outline-none focus:border-purple-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-purple-600/20"
          >
            {isLoading ? 'Verbinde...' : 'Direkt starten ↗'}
          </button>
        </form>

        <div className="text-center text-[10px] text-zinc-500 space-x-2">
          {onOpenTerms && <button type="button" onClick={onOpenTerms} className="hover:underline">AGB</button>}
          <span>•</span>
          {onOpenPrivacy && <button type="button" onClick={onOpenPrivacy} className="hover:underline">Datenschutz</button>}
        </div>
      </div>
    </div>
  );
};
