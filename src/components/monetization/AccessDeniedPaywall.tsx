import React, { useState } from 'react';
import {
  Lock,
  Tv,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldAlert,
  Layers,
  LogOut,
  Sparkles,
  CreditCard,
  Flame,
  Check,
} from 'lucide-react';
import { StreamerUser, SubscriptionPlan, ModularSubscriptionConfig } from '../../types/pipeline';
import {
  STRIPE_OFFICIAL_TIERS,
  FREE_STARTER_PLAN,
  BASIC_TRIAL_PLAN,
  PRESET_MODULAR_PLANS,
  getUnifiedPlanPrice,
} from '../../config/stripeUnifiedConfig';

interface AccessDeniedPaywallProps {
  user: StreamerUser;
  onActivateSubscription: (
    plan: SubscriptionPlan,
    cycle?: 'monthly' | 'annual',
    customConfig?: ModularSubscriptionConfig
  ) => void;
  onLogout: () => void;
}

export const AccessDeniedPaywall: React.FC<AccessDeniedPaywallProps> = ({
  user,
  onActivateSubscription,
  onLogout,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedTierLevel, setSelectedTierLevel] = useState<number>(3);
  const [isActivating, setIsActivating] = useState<boolean>(false);

  const tiers = [
    STRIPE_OFFICIAL_TIERS[1],
    STRIPE_OFFICIAL_TIERS[2],
    STRIPE_OFFICIAL_TIERS[3],
    STRIPE_OFFICIAL_TIERS[4],
    STRIPE_OFFICIAL_TIERS[5],
  ];

  const handleActivateFreeStarter = () => {
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      onActivateSubscription('free', 'annual', FREE_STARTER_PLAN);
    }, 400);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 text-zinc-100">
      <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-b from-[#190928] via-[#0f061e] to-[#070514] p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400 shadow-lg shadow-rose-500/20">
          <Lock className="h-8 w-8" />
        </div>
        <div className="space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
            Abonnement erforderlich
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-white">
            Aktiviere deinen Streamer-Autopiloten
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Hallo @{user.channelName || user.name}! Um die autonome Zero-Storage Multi-Social Pipeline zu nutzen, wähle deinen passenden Plan oder starte mit dem 0 € Starter Plan.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-purple-950/60 border border-purple-500/30">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-purple-500/30 bg-[#0c0822]/80 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Starter (0 €)</span>
            <h3 className="text-xl font-bold text-white">Free Starter</h3>
            <p className="text-2xl font-black text-white">0,00 € <span className="text-xs text-zinc-400">/Monat</span></p>
            <ul className="space-y-2 text-xs text-zinc-300 pt-3">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> 30 Clips / Monat</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> 1 Social Kanal</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> 0 MB RAM Engine</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={handleActivateFreeStarter}
            disabled={isActivating}
            className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs cursor-pointer transition"
          >
            {isActivating ? 'Wird aktiviert...' : 'Kostenlos starten'}
          </button>
        </div>

        <div className="rounded-2xl border-2 border-fuchsia-500 bg-[#160933]/90 p-6 flex flex-col justify-between space-y-6 relative shadow-xl shadow-fuchsia-500/20">
          <div className="absolute -top-3 right-6 bg-fuchsia-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full">
            Bestseller
          </div>
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-fuchsia-400 uppercase">Stufe 3 • Pro Grow</span>
            <h3 className="text-xl font-bold text-white">Pro Grow Autopilot</h3>
            <p className="text-2xl font-black text-white">
              {billingCycle === 'annual' ? '19,20 €' : '24,00 €'}{' '}
              <span className="text-xs text-zinc-400">/Monat</span>
            </p>
            <ul className="space-y-2 text-xs text-zinc-300 pt-3">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-fuchsia-400" /> 150 Clips / Monat</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-fuchsia-400" /> 3 Kanäle (TikTok, Shorts, Reels)</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-fuchsia-400" /> KI-Facecam & Subtitles</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-fuchsia-400" /> Google Sheets Sync</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => onActivateSubscription('pro', billingCycle, PRESET_MODULAR_PLANS[2])}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-fuchsia-500/30 transition"
          >
            Jetzt buchen ↗
          </button>
        </div>

        <div className="rounded-2xl border border-purple-500/30 bg-[#0c0822]/80 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase">Stufe 5 • Elite Max</span>
            <h3 className="text-xl font-bold text-white">Elite Max Pipeline</h3>
            <p className="text-2xl font-black text-white">
              {billingCycle === 'annual' ? '64,00 €' : '80,00 €'}{' '}
              <span className="text-xs text-zinc-400">/Monat</span>
            </p>
            <ul className="space-y-2 text-xs text-zinc-300 pt-3">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-purple-400" /> 600 Clips / Monat</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-purple-400" /> 5 Social Kanäle</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-purple-400" /> Maximale Priorität & 4K</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => onActivateSubscription('elite', billingCycle, PRESET_MODULAR_PLANS[4])}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer transition"
          >
            Elite buchen ↗
          </button>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Mit anderem Account anmelden</span>
        </button>
      </div>
    </div>
  );
};
