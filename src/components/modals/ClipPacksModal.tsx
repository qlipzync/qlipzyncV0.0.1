import React from 'react';
import { X, Zap, Check, Flame } from 'lucide-react';
import { ClipPackage } from '../../types/pipeline';

interface ClipPacksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuyPackage: (pkg: ClipPackage) => void;
  currentClipsUsed: number;
  currentClipsTotal?: number;
  currentClipsLimit?: number;
  bonusClips?: number;
}

export const ClipPacksModal: React.FC<ClipPacksModalProps> = ({
  isOpen,
  onClose,
  onBuyPackage,
  currentClipsUsed,
  currentClipsTotal,
  currentClipsLimit,
  bonusClips,
}) => {
  if (!isOpen) return null;

  const total = currentClipsLimit || currentClipsTotal || 30;

  const packages: ClipPackage[] = [
    { id: 'pack_50', name: 'Boost Pack 50', clips: 50, priceEur: 4.99 },
    { id: 'pack_150', name: 'Pro Booster 150', clips: 150, priceEur: 12.99, popular: true },
    { id: 'pack_500', name: 'Titan Pack 500', clips: 500, priceEur: 34.99 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-purple-500/30 bg-[#0c0822] p-6 sm:p-8 shadow-2xl relative space-y-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-fuchsia-400 uppercase">Sofortiges Clip-Guthaben</span>
          <h2 className="text-2xl font-black font-display text-white">Zusätzliche Clip-Packs nachkaufen</h2>
          <p className="text-xs text-zinc-400">
            Aktueller Verbrauch: {currentClipsUsed} / {total} Clips. Clip-Packs verfallen nie.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl p-5 border flex flex-col justify-between space-y-4 ${
                pkg.popular
                  ? 'border-fuchsia-500 bg-[#170a36] shadow-lg shadow-fuchsia-500/20 relative'
                  : 'border-purple-500/20 bg-[#090518]'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-fuchsia-600 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                  Beliebt
                </div>
              )}
              <div className="space-y-2 text-left">
                <span className="text-xs font-bold text-white block">{pkg.name}</span>
                <p className="text-2xl font-black text-white">{(pkg.priceEur ?? pkg.priceNum ?? 0).toFixed(2).replace('.', ',')} €</p>
                <span className="text-[11px] text-fuchsia-400 font-mono font-bold">+{pkg.clips} Extra-Clips</span>
              </div>
              <button
                type="button"
                onClick={() => onBuyPackage(pkg)}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer transition shadow"
              >
                Kaufen ↗
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
