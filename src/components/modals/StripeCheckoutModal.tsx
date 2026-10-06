import React, { useState } from 'react';
import { X, Lock, CheckCircle2, ShieldCheck, CreditCard } from 'lucide-react';
import { StreamerUser, ModularSubscriptionConfig, ClipPackage } from '../../types/pipeline';
import { formatEur } from '../../config/stripeUnifiedConfig';

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: StreamerUser | null;
  selectedPlan: ModularSubscriptionConfig | null;
  selectedClipPack: ClipPackage | null;
  billingCycle: 'monthly' | 'annual';
  isTrial?: boolean;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
  onSuccess: (result: any) => void;
}

export const StripeCheckoutModal: React.FC<StripeCheckoutModalProps> = ({
  isOpen,
  onClose,
  user,
  selectedPlan,
  selectedClipPack,
  billingCycle,
  isTrial,
  onOpenTerms,
  onOpenPrivacy,
  onSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const price = (selectedPlan
    ? billingCycle === 'annual'
      ? selectedPlan.calculatedPriceAnnual
      : selectedPlan.calculatedPriceMonthly
    : (selectedClipPack?.priceEur ?? selectedClipPack?.priceNum ?? 0)) ?? 0;

  const title = selectedPlan
    ? selectedPlan.tierName || 'QlipZync Subscription'
    : selectedClipPack
    ? selectedClipPack.name
    : 'QlipZync Order';

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess({ success: true });
      onClose();
    }, 800);
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
          <div className="h-12 w-12 rounded-2xl bg-fuchsia-600/20 border border-fuchsia-500/40 flex items-center justify-center mx-auto text-fuchsia-400">
            <CreditCard className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black font-display text-white">Sicherer Stripe Checkout</h2>
          <p className="text-xs text-zinc-400">256-Bit SSL Verschlüsselung & DSGVO-konforme Abrechnung</p>
        </div>

        <div className="p-4 rounded-2xl border border-purple-500/30 bg-[#090518] space-y-2 text-left">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white">{title}</span>
            <span className="text-sm font-black text-fuchsia-400 font-mono">{formatEur(price)}</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            {isTrial ? '14 Tage kostenlose Testphase, danach automatische Verlängerung.' : 'Sofortige Freischaltung auf allen Kanälen.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={isProcessing}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-500/30 transition cursor-pointer"
        >
          <Lock className="h-4 w-4" />
          <span>{isProcessing ? 'Verarbeite Zahlung...' : `Jetzt kostenpflichtig buchen (${formatEur(price)})`}</span>
        </button>

        <div className="text-center text-[10px] text-zinc-500 space-x-2">
          {onOpenTerms && <button type="button" onClick={onOpenTerms} className="hover:underline">AGB</button>}
          <span>•</span>
          {onOpenPrivacy && <button type="button" onClick={onOpenPrivacy} className="hover:underline">Datenschutz</button>}
        </div>
      </div>
    </div>
  );
};
