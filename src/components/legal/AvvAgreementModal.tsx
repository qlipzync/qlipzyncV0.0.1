import React from 'react';
import { X, FileText } from 'lucide-react';
import { StreamerUser } from '../../types/pipeline';

interface AvvAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: StreamerUser | null;
  onOpenPrivacy?: () => void;
}

export const AvvAgreementModal: React.FC<AvvAgreementModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenPrivacy,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl border border-purple-500/30 bg-[#0c0822] p-6 sm:p-8 shadow-2xl relative space-y-6 text-zinc-100 my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-fuchsia-600/20 border border-fuchsia-500/40 flex items-center justify-center mx-auto text-fuchsia-400">
            <FileText className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black font-display text-white">Auftragsverarbeitungsvertrag (AVV)</h2>
          <p className="text-xs text-zinc-400">Vertrag zur Auftragsverarbeitung gemäß Art. 28 DSGVO</p>
        </div>

        <div className="space-y-4 text-xs text-zinc-300 text-left leading-relaxed max-h-96 overflow-y-auto pr-2">
          <p>
            Dieser Vertrag regelt die Rechte und Pflichten der Parteien im Rahmen der Verarbeitung personenbezogener Daten durch QlipZync im Auftrag des Streamers ({user?.channelName || 'Nutzer'}).
          </p>
          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1">
            <h4 className="font-bold text-white">Gegenstand & Zweck der Verarbeitung:</h4>
            <p>Automatisierte Echtzeit-Erkennung von Twitch-Streams, flüchtiges 9:16 KI-Video-Rendering und Multi-Social-Publishing.</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 text-xs">
          {onOpenPrivacy && (
            <button type="button" onClick={onOpenPrivacy} className="text-fuchsia-400 hover:underline">
              Datenschutzerklärung
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
