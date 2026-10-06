import React, { useState } from 'react';
import { Check, Zap } from 'lucide-react';
import { SubscriptionPlan, ModularSubscriptionConfig, ClipPackage } from '../../types/pipeline';
import {
  STRIPE_OFFICIAL_TIERS,
  FREE_STARTER_PLAN,
  BASIC_TRIAL_PLAN,
  PRESET_MODULAR_PLANS,
  formatEur,
} from '../../config/stripeUnifiedConfig';

interface CentralStripePricingSectionProps {
  onOpenAuth?: (plan?: SubscriptionPlan) => void;
  onSelectPlan?: (plan: SubscriptionPlan) => void;
  onOpenStripeCheckout?: (plan: ModularSubscriptionConfig, cycle: 'monthly' | 'annual') => void;
  onBuyClipPackage?: (pkg: ClipPackage) => void;
  onStartTrial?: () => void;
}

export const CentralStripePricingSection: React.FC<CentralStripePricingSectionProps> = ({
  onOpenAuth,
  onSelectPlan,
  onOpenStripeCheckout,
  onBuyClipPackage,
  onStartTrial,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  return (
    <section id="pricing" className="space-y-12 py-10 scroll-mt-24">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-fuchsia-400">
          TRANSPARENTE PREISE
        </span>
        <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
          Skaliere deine Twitch-Reichweite
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400">
          Wähle das passende Paket für deinen Stream. Jeder Plan enthält die 0 MB RAM Ephemeral Engine.
        </p>

        <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-purple-950/60 border border-purple-500/30 mt-4">
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              billingCycle === 'annual' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Jährlich (20% Rabatt)
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              billingCycle === 'monthly' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Monatlich
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Tier 1: Starter */}
        <div className="rounded-3xl border border-purple-500/30 bg-[#0c0822] p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3 text-left">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Starter</span>
            <h3 className="text-xl font-bold text-white">Stufe 1 • Starter</h3>
            <p className="text-3xl font-black text-white font-mono">
              {billingCycle === 'annual' ? '2,40 €' : '3,00 €'}{' '}
              <span className="text-xs text-zinc-400 font-sans">/Monat</span>
            </p>
            <ul className="space-y-2 text-xs text-zinc-300 pt-3">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> 30 Clips / Monat (1 pro Tag)</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> 1 Social Kanal (TikTok)</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> 720p HD Transcoding</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onOpenStripeCheckout) onOpenStripeCheckout(PRESET_MODULAR_PLANS[0], billingCycle);
              else onSelectPlan?.('starter');
            }}
            className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs cursor-pointer transition"
          >
            Starter wählen ↗
          </button>
        </div>

        {/* Tier 3: Pro */}
        <div className="rounded-3xl border-2 border-fuchsia-500 bg-[#160933] p-6 sm:p-8 flex flex-col justify-between space-y-6 relative shadow-2xl shadow-fuchsia-500/20">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-fuchsia-600 text-white text-[10px] font-black uppercase tracking-wider px-4 py-1 rounded-full">
            Bestseller
          </div>
          <div className="space-y-3 text-left">
            <span className="text-xs font-mono font-bold text-fuchsia-400 uppercase">Pro Grow</span>
            <h3 className="text-xl font-bold text-white">Stufe 3 • Pro Grow</h3>
            <p className="text-3xl font-black text-white font-mono">
              {billingCycle === 'annual' ? '19,20 €' : '24,00 €'}{' '}
              <span className="text-xs text-zinc-400 font-sans">/Monat</span>
            </p>
            <ul className="space-y-2 text-xs text-zinc-300 pt-3">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-fuchsia-400" /> 150 Clips / Monat</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-fuchsia-400" /> 3 Social Kanäle (TikTok, Shorts, Reels)</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-fuchsia-400" /> KI-Facecam & Subtitles</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-fuchsia-400" /> Google Sheets Sync</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onOpenStripeCheckout) onOpenStripeCheckout(PRESET_MODULAR_PLANS[2], billingCycle);
              else onSelectPlan?.('pro');
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-fuchsia-500/30 transition"
          >
            Jetzt Pro buchen ↗
          </button>
        </div>

        {/* Tier 5: Elite */}
        <div className="rounded-3xl border border-purple-500/30 bg-[#0c0822] p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3 text-left">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase">Elite Max</span>
            <h3 className="text-xl font-bold text-white">Stufe 5 • Elite Max</h3>
            <p className="text-3xl font-black text-white font-mono">
              {billingCycle === 'annual' ? '64,00 €' : '80,00 €'}{' '}
              <span className="text-xs text-zinc-400 font-sans">/Monat</span>
            </p>
            <ul className="space-y-2 text-xs text-zinc-300 pt-3">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-purple-400" /> 600 Clips / Monat</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-purple-400" /> 5 Social Kanäle (TikTok, Shorts, Reels, X, Threads)</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-purple-400" /> Höchste Render-Priorität & 4K</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onOpenStripeCheckout) onOpenStripeCheckout(PRESET_MODULAR_PLANS[4], billingCycle);
              else onSelectPlan?.('elite');
            }}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer transition"
          >
            Elite wählen ↗
          </button>
        </div>
      </div>
    </section>
  );
};
