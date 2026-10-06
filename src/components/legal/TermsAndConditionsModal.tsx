import React from 'react';
import { X, FileCheck } from 'lucide-react';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacy?: () => void;
  onOpenImpressum?: () => void;
}

export const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
  isOpen,
  onClose,
  onOpenPrivacy,
  onOpenImpressum,
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
          <div className="h-12 w-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-400">
            <FileCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black font-display text-white">Allgemeine Geschäftsbedingungen (AGB)</h2>
          <p className="text-xs text-zinc-400">Nutzungsbedingungen & Widerrufsbelehrung (§§ 305 ff. BGB, § 355 BGB)</p>
        </div>

        <div className="space-y-4 text-xs text-zinc-300 text-left leading-relaxed max-h-96 overflow-y-auto pr-2">
          <div>
            <h4 className="font-bold text-white mb-1">§ 1 Geltungsbereich & Vertragsgegenstand</h4>
            <p>
              Diese AGB regeln die Bereitstellung und Nutzung des autonomen Clip-Schnitt- und Multi-Social-Publishing-Dienstes QlipZync für Content Creator und Streamer.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">§ 2 Widerrufsrecht</h4>
            <p>Verbrauchern steht ein gesetzliches 14-tägiges Widerrufsrecht gemäß § 355 BGB zu.</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 text-xs">
          <div className="space-x-3">
            {onOpenPrivacy && <button type="button" onClick={onOpenPrivacy} className="text-fuchsia-400 hover:underline">Datenschutz</button>}
            {onOpenImpressum && <button type="button" onClick={onOpenImpressum} className="text-purple-400 hover:underline">Impressum</button>}
          </div>
        </div>
      </div>
    </div>
  );
};
