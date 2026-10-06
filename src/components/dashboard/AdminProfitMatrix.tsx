import React from 'react';
import { ShieldCheck, TrendingUp, DollarSign, Database, Server } from 'lucide-react';
import { STRIPE_OFFICIAL_TIERS } from '../../config/stripeUnifiedConfig';

export const AdminProfitMatrix: React.FC = () => {
  return (
    <div className="w-full rounded-3xl border border-amber-500/30 bg-[#120a21] p-6 shadow-2xl space-y-6 text-zinc-100">
      <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
        <ShieldCheck className="h-5 w-5 text-amber-400" />
        <h3 className="text-sm font-bold text-white">Master Admin Gewinn- & Kosten-Matrix</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
          <span className="text-[10px] text-zinc-400 uppercase font-mono">GCP Speicher-Kosten</span>
          <p className="text-xl font-black text-emerald-400 font-mono">0,00 €</p>
          <span className="text-[10px] text-zinc-500 font-mono">0 MB RAM Doktrin (/dev/shm)</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
          <span className="text-[10px] text-zinc-400 uppercase font-mono">Gemini 2.5 Flash Kosten</span>
          <p className="text-xl font-black text-white font-mono">~0,003 € <span className="text-xs text-zinc-500">/Clip</span></p>
          <span className="text-[10px] text-zinc-500 font-mono">Transkript & Scoring</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
          <span className="text-[10px] text-zinc-400 uppercase font-mono">Cloud Run Compute</span>
          <p className="text-xl font-black text-white font-mono">~0,005 € <span className="text-xs text-zinc-500">/Clip</span></p>
          <span className="text-[10px] text-zinc-500 font-mono">1 GiB / 1 CPU FFM</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-amber-500/30 space-y-1">
          <span className="text-[10px] text-amber-400 uppercase font-mono">Durchschnittliche Marge</span>
          <p className="text-xl font-black text-amber-400 font-mono">75 - 90%</p>
          <span className="text-[10px] text-zinc-500 font-mono">Stripe SaaS Abonnement</span>
        </div>
      </div>
    </div>
  );
};
