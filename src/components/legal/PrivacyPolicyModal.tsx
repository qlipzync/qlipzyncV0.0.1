import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAvv?: () => void;
  onOpenTerms?: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  onOpenAvv,
  onOpenTerms,
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
          <div className="h-12 w-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black font-display text-white">Datenschutzerklärung</h2>
          <p className="text-xs text-zinc-400">DSGVO-konforme Datenverarbeitung nach Art. 13 & 14 DSGVO</p>
        </div>

        <div className="space-y-4 text-xs text-zinc-300 text-left leading-relaxed max-h-96 overflow-y-auto pr-2">
          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
            <h4 className="font-bold text-emerald-400 mb-1">1. Zero-Storage Doktrin (Art. 5 Abs. 1 lit. c DSGVO)</h4>
            <p>
              QlipZync speichert zu keinem Zeitpunkt Videoinhalte auf persistenten Festplatten. Die Transcodierung erfolgt flüchtig im Linux Shared Memory (/dev/shm) und wird nach dem Upload unverzüglich gelöscht.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">2. Serverstandort</h4>
            <p>Alle Server und Datenbanken befinden sich in Frankfurt am Main (GCP Region europe-west3).</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 text-xs">
          <div className="space-x-3">
            {onOpenAvv && <button type="button" onClick={onOpenAvv} className="text-fuchsia-400 hover:underline">AVV (Art. 28)</button>}
            {onOpenTerms && <button type="button" onClick={onOpenTerms} className="text-purple-400 hover:underline">AGB</button>}
          </div>
        </div>
      </div>
    </div>
  );
};
