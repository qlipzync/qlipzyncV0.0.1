import React, { useState } from 'react';
import { X, ShieldCheck, Key, Check } from 'lucide-react';
import { StreamerUser } from '../../types/pipeline';

interface TwoFactorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: StreamerUser;
  onUpdateUser?: (user: StreamerUser) => void;
}

export const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) => {
  const [code, setCode] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length >= 4) {
      const updated: StreamerUser = {
        ...user,
        twoFactorAuth: {
          isEnabled: true,
          isVerified: true,
          method: 'email_code',
          lastVerifiedAt: new Date().toISOString(),
        },
      };
      onUpdateUser?.(updated);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-3xl border border-sky-500/30 bg-[#0c0822] p-6 sm:p-8 shadow-2xl relative space-y-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-sky-600/20 border border-sky-500/40 flex items-center justify-center mx-auto text-sky-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black font-display text-white">2-Faktor-Authentifizierung (2FA)</h2>
          <p className="text-xs text-zinc-400">
            Zusätzlicher Schutz für deinen Streamer-Account und OAuth-Tokens.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs text-center font-bold flex items-center justify-center gap-2">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>2FA erfolgreich verifiziert & aktiviert!</span>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-mono font-bold text-zinc-400">Sicherheits-Code (6-stellig)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full text-center text-lg tracking-widest font-mono px-3.5 py-2.5 rounded-xl border border-sky-500/30 bg-zinc-950 text-white focus:outline-none focus:border-sky-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer shadow transition"
            >
              Code bestätigen & 2FA aktivieren
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
