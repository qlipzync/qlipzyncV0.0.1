import React from 'react';
import { X, ShieldCheck, Trash2, Check, FileCheck } from 'lucide-react';
import { StreamerUser } from '../../types/pipeline';

interface GdprPrivacyAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: StreamerUser;
  onAccountDeleted?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenAvvAgreement?: () => void;
}

export const GdprPrivacyAuditModal: React.FC<GdprPrivacyAuditModalProps> = ({
  isOpen,
  onClose,
  user,
  onAccountDeleted,
  onOpenPrivacyPolicy,
  onOpenAvvAgreement,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl border border-purple-500/30 bg-[#0c0822] p-6 sm:p-8 shadow-2xl relative space-y-6 text-zinc-100 my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black font-display text-white">DSGVO & Datenschutz Audit</h2>
          <p className="text-xs text-zinc-400">Transparente Übersicht deiner gespeicherten Daten & Datenschutz-Zertifikate.</p>
        </div>

        <div className="space-y-3 text-left">
          <div className="p-3.5 rounded-2xl border border-purple-500/20 bg-[#090518] space-y-1">
            <span className="text-[10px] font-mono font-bold text-fuchsia-400 uppercase">Art. 15 DSGVO • Auskunftsrecht</span>
            <p className="text-xs text-white">Streamer-ID: {user.id}</p>
            <p className="text-xs text-zinc-400">Kanal: @{user.channelName} • E-Mail: {user.email || 'Nicht hinterlegt'}</p>
          </div>

          <div className="p-3.5 rounded-2xl border border-purple-500/20 bg-[#090518] space-y-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Art. 5 DSGVO • Datensparsamkeit</span>
            <p className="text-xs text-zinc-300">0 MB persistenter Videospeicher. Alle Streams werden flüchtig in /dev/shm verarbeitet.</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="space-x-3 text-xs">
            {onOpenPrivacyPolicy && (
              <button type="button" onClick={onOpenPrivacyPolicy} className="text-fuchsia-400 hover:underline">
                Datenschutzerklärung
              </button>
            )}
            {onOpenAvvAgreement && (
              <button type="button" onClick={onOpenAvvAgreement} className="text-purple-400 hover:underline">
                AVV-Vertrag
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
