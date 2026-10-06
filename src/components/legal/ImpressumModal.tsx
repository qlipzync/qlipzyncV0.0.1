import React from 'react';
import { X, Scale } from 'lucide-react';

interface ImpressumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImpressumModal: React.FC<ImpressumModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl border border-purple-500/30 bg-[#0c0822] p-6 sm:p-8 shadow-2xl relative space-y-6 text-zinc-100 my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-400">
            <Scale className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black font-display text-white">Impressum</h2>
          <p className="text-xs text-zinc-400">Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG) & § 18 Abs. 2 MStV</p>
        </div>

        <div className="space-y-4 text-xs text-zinc-300 text-left leading-relaxed">
          <div>
            <h4 className="font-bold text-white mb-1">Dienstanbieter:</h4>
            <p>QlipZync Cloud Systems</p>
            <p>Autonomous Zero-Storage Media Processing</p>
            <p>Frankfurt am Main, Deutschland</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Kontakt:</h4>
            <p>E-Mail: robert.f.telekom@gmail.com</p>
            <p>Plattform-Betrieb: Google Cloud Platform (europe-west3, Frankfurt)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
