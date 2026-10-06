import React from 'react';
import { X, Layers, Check, Zap } from 'lucide-react';
import { StreamerUser, SocialChannelsTier } from '../../types/pipeline';
import { STRIPE_OFFICIAL_TIERS } from '../../config/stripeUnifiedConfig';

interface ProgressiveExtensionsMatrixProps {
  isOpen?: boolean;
  onClose?: () => void;
  user?: StreamerUser;
  clipVolume?: number;
  socialChannelsCount?: SocialChannelsTier;
  renderTier?: number;
  aiSpeechTier?: number;
  videoCropTier?: number;
  monitoringTier?: number;
  publishingTier?: number;
  brandingTier?: number;
  billingCycle?: 'monthly' | 'annual';
  onChangeClipVolume?: (val: any) => void;
  onChangeSocialCount?: (val: any) => void;
  onChangeRenderTier?: (val: any) => void;
  onChangeAiSpeechTier?: (val: any) => void;
  onChangeVideoCropTier?: (val: any) => void;
  onChangeMonitoringTier?: (val: any) => void;
  onChangePublishingTier?: (val: any) => void;
  onChangeBrandingTier?: (val: any) => void;
  mode?: string;
  onActionClick?: () => void;
  actionButtonLabel?: string;
  onSelectPlan?: (tierLevel: number) => void;
}

export const ProgressiveExtensionsMatrix: React.FC<ProgressiveExtensionsMatrixProps> = ({
  isOpen = true,
  onClose,
  user,
  onActionClick,
  actionButtonLabel = 'Auswählen',
  onSelectPlan,
}) => {
  return (
    <div className="w-full rounded-3xl border border-purple-500/30 bg-[#0c0822] p-6 sm:p-8 shadow-2xl space-y-6 text-zinc-100">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="text-left space-y-1">
          <span className="text-xs font-mono font-bold text-fuchsia-400 uppercase">Stufen-Matrix</span>
          <h2 className="text-lg font-black font-display text-white">Progressive Feature Extensions</h2>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-white transition cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
        {Object.values(STRIPE_OFFICIAL_TIERS).map((tier) => (
          <div key={tier.tierLevel} className="p-4 rounded-2xl border border-purple-500/20 bg-[#090518] space-y-3 text-left">
            <span className="text-[10px] font-mono font-bold text-fuchsia-400">Stufe {tier.tierLevel}</span>
            <h4 className="text-xs font-bold text-white">{tier.name}</h4>
            <p className="text-sm font-black text-white font-mono">{tier.monthlyPriceEur.toFixed(2).replace('.', ',')} €</p>
            <ul className="text-[10px] text-zinc-400 space-y-1">
              <li>• {tier.clipVolume} Clips / Mon.</li>
              <li>• {tier.socialChannelsCount} Kanäle</li>
              <li>• {tier.resolution}</li>
            </ul>
            <button
              type="button"
              onClick={() => {
                onSelectPlan?.(tier.tierLevel);
                onActionClick?.();
              }}
              className="w-full py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] transition cursor-pointer"
            >
              {actionButtonLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
