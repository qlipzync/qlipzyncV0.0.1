import React, { useState } from 'react';
import {
  Zap,
  Sparkles,
  Tv,
  ArrowRight,
  ShieldCheck,
  Check,
  Play,
  Lock,
  Cpu,
  RefreshCw,
  ExternalLink,
  Flame,
  Radio,
  Share2,
  LayoutDashboard,
} from 'lucide-react';
import { SubscriptionPlan, ModularSubscriptionConfig, ClipPackage } from '../../types/pipeline';
import { BotClipJugglerAnimation } from './BotClipJugglerAnimation';
import { AstronautPipelineCanvas } from './AstronautPipelineCanvas';
import { ViralPeakGraph } from '../dashboard/ViralPeakGraph';
import { CentralStripePricingSection } from '../monetization/CentralStripePricingSection';

interface LandingPageProps {
  onGoToDashboard?: () => void;
  onOpenAuth: (preferredPlan?: SubscriptionPlan, initialChannel?: string) => void;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  onStartTrial?: () => void;
  onDirectPreview?: (channelName: string) => void;
  onBuyClipPackage?: (pkg: ClipPackage) => void;
  onOpenStripeCheckout?: (plan: ModularSubscriptionConfig, cycle: 'monthly' | 'annual') => void;
  onOpenBotGuide?: () => void;
  onOpenImpressum?: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenAvv?: () => void;
  onOpenGdprAudit?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToDashboard,
  onOpenAuth,
  onSelectPlan,
  onStartTrial,
  onDirectPreview,
  onBuyClipPackage,
  onOpenStripeCheckout,
  onOpenImpressum,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAvv,
  onOpenGdprAudit,
}) => {
  const [heroChannel, setHeroChannel] = useState<string>('');
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  const handleHeroSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onOpenAuth('free', heroChannel.trim() || undefined);
  };

  return (
    <div className="w-full space-y-24 py-6 text-zinc-100 font-sans">
      {/* ========================================================================= */}
      {/* ABSCHNITT 1: HERO (Above the fold - Maximale Klarheit & Hook)             */}
      {/* ========================================================================= */}
      <section
        id="hero"
        aria-labelledby="hero-title"
        className="rounded-3xl border border-purple-500/30 bg-gradient-to-b from-[#130830] via-[#0a051e] to-[#070514] p-6 sm:p-12 shadow-2xl relative overflow-hidden scroll-mt-24"
      >
        {/* Ambient atmospheric glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Column: Hook, Value Prop & Input */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Orientiert an der Pipeline-Header-Struktur: Icon-Box + Eyebrow-Tag + Status-Pill */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 shadow-lg shadow-fuchsia-500/10">
                <Zap className="h-5 w-5 text-fuchsia-400 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-black text-fuchsia-400 uppercase tracking-wider">
                    QuickClick Autopilot
                  </span>
                  <span className="rounded-full bg-purple-900/60 border border-purple-500/40 px-2.5 py-0.5 text-[10px] font-mono font-bold text-purple-200">
                    100% Autonom • 0 MB RAM
                  </span>
                </div>
                <div className="text-[11px] font-mono text-zinc-400 font-medium">
                  Echtzeit Twitch EventSub & Multi-Social Pipeline
                </div>
              </div>
            </div>

            {/* Titel, Subtitel & Beschreibung */}
            <div className="space-y-3">
              <h1
                id="hero-title"
                className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-[1.12]"
              >
                <span className="block">Deine Twitch Clips.</span>
                <span className="block">Viral.</span>
                <span className="block bg-gradient-to-r from-fuchsia-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  vollautomatisch.
                </span>
              </h1>

              {/* Subtitel */}
              <p className="text-sm sm:text-base font-bold text-fuchsia-300 font-display">
                Vom Twitch Go-Live zum viralen 9:16 Highlight in unter 60 Sekunden.
              </p>

              {/* Beschreibung */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans max-w-xl">
                Kein stundenlanges Schneiden mehr nach dem Stream. QuickClick erkennt Highlights in Echtzeit, schneidet im 9:16 Format mit KI-Facecam-Tracking & Untertiteln und postet autonom auf TikTok, YouTube Shorts & Instagram Reels.
              </p>
            </div>

            {/* 3-Step Orientierungs-Badges (identisches Schema wie in der Pipeline-Div) */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/25 text-left">
                <span className="text-[10px] font-mono font-bold text-purple-400 block mb-0.5">1. GO-LIVE</span>
                <span className="font-bold text-white text-xs block truncate">Twitch EventSub</span>
                <p className="text-[10px] text-zinc-400 mt-0.5 truncate">0s Latenz Webhook</p>
              </div>
              <div className="p-2.5 rounded-xl bg-fuchsia-950/40 border border-fuchsia-500/25 text-left">
                <span className="text-[10px] font-mono font-bold text-fuchsia-400 block mb-0.5">2. KI-SCHNITT</span>
                <span className="font-bold text-white text-xs block truncate">9:16 + Subtitles</span>
                <p className="text-[10px] text-zinc-400 mt-0.5 truncate">0 MB RAM Engine</p>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/25 text-left">
                <span className="text-[10px] font-mono font-bold text-cyan-400 block mb-0.5">3. MULTI-POST</span>
                <span className="font-bold text-white text-xs block truncate">Shorts, TikTok, Reels</span>
                <p className="text-[10px] text-zinc-400 mt-0.5 truncate">Paralleler Upload</p>
              </div>
            </div>

            {/* Direct Channel Input Form */}
            <form onSubmit={handleHeroSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                    <Tv className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={heroChannel}
                    onChange={(e) => setHeroChannel(e.target.value)}
                    placeholder="twitch.tv/dein_kanalname"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-purple-500/40 bg-[#09041a] text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 transition"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto shrink-0 px-6 py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-display font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 active:scale-95 transition cursor-pointer"
                >
                  <span>Jetzt kostenlos testen ↗</span>
                </button>
                {onGoToDashboard && (
                  <button
                    type="button"
                    onClick={onGoToDashboard}
                    className="w-full sm:w-auto shrink-0 px-5 py-3.5 rounded-xl border border-purple-500/50 bg-purple-950/70 hover:bg-purple-900/90 text-purple-200 hover:text-white font-display font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-950/40 active:scale-95 transition cursor-pointer"
                    title="Direkt zum Live Streamer-Dashboard"
                  >
                    <LayoutDashboard className="h-4 w-4 text-fuchsia-400" />
                    <span>Dashboard ↗</span>
                  </button>
                )}
              </div>

              {/* Micro-Trust direkt unter Button */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-zinc-400 font-mono">
                <span className="text-emerald-400">✓ 0 € Start</span>
                <span className="text-zinc-600">|</span>
                <span className="text-emerald-400">✓ Keine Kreditkarte</span>
                <span className="text-zinc-600">|</span>
                <span className="text-emerald-400">✓ DSGVO-konform (Server in FFM)</span>
              </div>
            </form>
          </div>

          {/* Right Column: Visual Telemetry Graph */}
          <div className="lg:col-span-6 w-full">
            <ViralPeakGraph />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ABSCHNITT 2: HOW IT WORKS (Visuelle Bot-Animation - 3 Schritte)           */}
      {/* ========================================================================= */}
      <section
        id="how-it-works"
        aria-labelledby="how-it-works-title"
        className="rounded-3xl border border-purple-500/30 bg-[#0a051e] p-6 sm:p-12 shadow-2xl space-y-10 scroll-mt-24"
      >
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-fuchsia-400">
            AUTONOMER ABLAUF
          </span>
          <h2
            id="how-it-works-title"
            className="text-2xl sm:text-4xl font-black font-display uppercase tracking-wide text-white"
          >
            In 3 Schritten auf Autopilot
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Von der Live-Erkennung bis zum synchronen Multi-Post – ohne manuellen Aufwand.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Schritt 1 */}
          <div
            onClick={() => setActiveStep(1)}
            className={`rounded-2xl p-6 space-y-3 transition duration-300 cursor-pointer ${
              activeStep === 1
                ? 'border-2 border-fuchsia-500 bg-[#160a35] shadow-lg shadow-fuchsia-500/20'
                : 'border border-purple-500/30 bg-[#0e0728] hover:border-purple-500/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="h-9 w-9 rounded-xl bg-purple-900/70 border border-purple-400 flex items-center justify-center font-display font-black text-sm text-purple-200">
                1
              </span>
              <span className="text-[10px] font-mono text-purple-300 uppercase">Twitch EventSub</span>
            </div>
            <h3 className="text-base font-bold text-white font-display">
              Du streamst
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              QuickClick erkennt live via EventSub, wenn du online gehst.
            </p>
          </div>

          {/* Schritt 2 */}
          <div
            onClick={() => setActiveStep(2)}
            className={`rounded-2xl p-6 space-y-3 transition duration-300 cursor-pointer ${
              activeStep === 2
                ? 'border-2 border-fuchsia-500 bg-[#160a35] shadow-lg shadow-fuchsia-500/20'
                : 'border border-purple-500/30 bg-[#0e0728] hover:border-purple-500/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="h-9 w-9 rounded-xl bg-fuchsia-900/70 border border-fuchsia-400 flex items-center justify-center font-display font-black text-sm text-fuchsia-200">
                2
              </span>
              <span className="text-[10px] font-mono text-fuchsia-300 uppercase">0 MB RAM Engine</span>
            </div>
            <h3 className="text-base font-bold text-white font-display">
              KI schneidet
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Highlights, 9:16 Face-Tracking & dynamische Untertitel im flüchtigen Speicher.
            </p>
          </div>

          {/* Schritt 3 */}
          <div
            onClick={() => setActiveStep(3)}
            className={`rounded-2xl p-6 space-y-3 transition duration-300 cursor-pointer ${
              activeStep === 3
                ? 'border-2 border-fuchsia-500 bg-[#160a35] shadow-lg shadow-fuchsia-500/20'
                : 'border border-purple-500/30 bg-[#0e0728] hover:border-purple-500/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="h-9 w-9 rounded-xl bg-cyan-900/70 border border-cyan-400 flex items-center justify-center font-display font-black text-sm text-cyan-200">
                3
              </span>
              <span className="text-[10px] font-mono text-cyan-300 uppercase">Multi-Social</span>
            </div>
            <h3 className="text-base font-bold text-white font-display">
              Multi-Post
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Autonomer Upload auf TikTok, YouTube Shorts & Reels.
            </p>
          </div>
        </div>

        {/* Visual Bot Animation Container */}
        <div className="pt-2 space-y-6">
          <BotClipJugglerAnimation
            autoPlay={true}
            activeStep={activeStep}
            onStepChange={(s) => setActiveStep(s)}
          />

          <AstronautPipelineCanvas />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ABSCHNITT 3: ZENTRALE STRIPE PREISSEKTION (Offizielle Stripe Tarife)       */}
      {/* ========================================================================= */}
      <CentralStripePricingSection
        onOpenAuth={onOpenAuth}
        onSelectPlan={onSelectPlan}
        onStartTrial={onStartTrial}
        onOpenStripeCheckout={onOpenStripeCheckout}
        onBuyClipPackage={onBuyClipPackage}
      />

      {/* ========================================================================= */}
      {/* ABSCHNITT 5: TRUST & SICHERHEIT (Einwandbehandlung)                       */}
      {/* ========================================================================= */}
      <section
        id="trust"
        aria-labelledby="trust-title"
        className="rounded-3xl border border-purple-500/30 bg-[#09041a] p-6 sm:p-12 shadow-2xl space-y-8 scroll-mt-24"
      >
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            SICHERHEIT & DATENSCHUTZ
          </span>
          <h2
            id="trust-title"
            className="text-2xl sm:text-3xl font-black font-display uppercase tracking-wide text-white"
          >
            Maximale Sicherheit für deinen Stream
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Wir schützen deine Zugangsdaten und Videoinhalte mit strengen deutschen Sicherheitsstandards.
          </p>
        </div>

        {/* Kompakter 3-Spalten-Bereich für Bedenken */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Säule 1 */}
          <div className="rounded-2xl border border-emerald-500/30 bg-[#0b1322] p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display">
              100% DSGVO-konform
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Serverstandort Frankfurt am Main (eu-central), zertifizierte Auftragsverarbeitung (AVV nach Art. 28 DSGVO) und strikt BGB-konform.
            </p>
          </div>

          {/* Säule 2 */}
          <div className="rounded-2xl border border-purple-500/30 bg-[#12082b] p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-fuchsia-400">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display">
              Zero-Storage RAM
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Keine Speicherung deiner Rohvideos auf Festplatten. Transcoding erfolgt flüchtig im Arbeitsspeicher (0 MB Disk) und wird sofort verworfen.
            </p>
          </div>

          {/* Säule 3 */}
          <div className="rounded-2xl border border-cyan-500/30 bg-[#09152b] p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display">
              Volle Kontrolle
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Jederzeit mit 1 Klick monatlich kündbar. Alle Upload-Links werden sekundengenau in deine persönliche Google Tabelle synchronisiert.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ABSCHNITT 6: READY-TO-LAUNCH CTA (Minimalistisch & Klar)                  */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-[#0d0724] to-[#150a36] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-black font-display text-white">
            Bereit für deinen Autopilot-Kanal?
          </h3>
          <p className="text-xs text-zinc-400">
            Starte jetzt deine 14-tägige Testphase mit 100% Zero-Storage RAM-Sicherheit.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onStartTrial}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-fuchsia-500/20 transition cursor-pointer"
          >
            Jetzt 14 Tage testen ↗
          </button>
          <button
            type="button"
            onClick={onGoToDashboard}
            className="px-4 py-2.5 rounded-xl border border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 font-bold text-xs transition cursor-pointer"
          >
            Live-Dashboard ↗
          </button>
        </div>
      </div>
    </div>
  );
};
