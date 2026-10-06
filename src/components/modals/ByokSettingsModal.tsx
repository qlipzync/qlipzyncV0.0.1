import React, { useState } from 'react';
import { X, Key, Check, Zap } from 'lucide-react';
import { StreamerUser } from '../../types/pipeline';

interface ByokSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: StreamerUser;
  onUpdateUser?: (user: StreamerUser) => void;
}

export const ByokSettingsModal: React.FC<ByokSettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) => {
  const [apiKey, setApiKey] = useState(user.settings?.byok?.geminiApiKey || '');

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: StreamerUser = {
      ...user,
      settings: {
        ...(user.settings || {} as any),
        byok: {
          enabled: Boolean(apiKey.trim()),
          geminiApiKey: apiKey.trim() || undefined,
        },
      },
    };
    onUpdateUser?.(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-3xl border border-purple-500/30 bg-[#0c0822] p-6 sm:p-8 shadow-2xl relative space-y-6 text-zinc-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
            <Key className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black font-display text-white">BYOK (Bring Your Own Key)</h2>
          <p className="text-xs text-zinc-400">Verwende deinen eigenen Gemini-API-Schlüssel für unbegrenzte KI-Transkription.</p>
        </div>

        <div className="space-y-2 text-left">
          <label className="text-[11px] font-mono font-bold text-zinc-400">Google Gemini API-Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-purple-500/30 bg-zinc-950 text-white text-xs font-mono focus:outline-none focus:border-purple-400"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer transition shadow"
        >
          Schlüssel speichern
        </button>
      </div>
    </div>
  );
};
