import React, { useState } from 'react';
import { Bot, X, Sparkles, Tv, ShieldCheck, Zap, ArrowRight, HelpCircle } from 'lucide-react';
import { StreamerUser, SubscriptionPlan } from '../../types/pipeline';

interface QuickClickBotGuideProps {
  user: StreamerUser | null;
  onNavigateToSection?: (sectionId: string) => void;
  onOpenAuth?: (plan?: SubscriptionPlan) => void;
  onOpenChannelSetup?: () => void;
  onOpen2FASetup?: () => void;
}

export const QuickClickBotGuide: React.FC<QuickClickBotGuideProps> = ({
  user,
  onNavigateToSection,
  onOpenAuth,
  onOpenChannelSetup,
  onOpen2FASetup,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-purple-500/40 bg-[#0c0822]/95 hover:bg-[#180f3d] backdrop-blur-md px-4 py-2.5 text-xs font-bold text-white shadow-2xl shadow-purple-950/80 hover:border-fuchsia-500/70 transition-all cursor-pointer group"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white">
          <Bot className="h-4 w-4" />
        </div>
        <span className="tracking-wide hidden sm:inline">Bot Guide</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 rounded-3xl border border-purple-500/30 bg-[#0c0822] p-5 shadow-2xl space-y-4 text-zinc-100">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-fuchsia-400" />
              <span className="text-sm font-bold text-white">QuickClick Bot Guide</span>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs text-zinc-300">
            <p>Willkommen beim QuickClick Autopilot Guide! Was möchtest du tun?</p>
            <div className="space-y-1.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (user) onOpenChannelSetup?.();
                  else onOpenAuth?.('pro');
                }}
                className="w-full text-left p-2 rounded-xl bg-[#090518] hover:bg-purple-900/40 border border-purple-500/20 text-xs font-semibold flex items-center justify-between"
              >
                <span>Twitch Kanal verbinden</span>
                <ArrowRight className="h-3 w-3 text-fuchsia-400" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onNavigateToSection?.('pricing');
                }}
                className="w-full text-left p-2 rounded-xl bg-[#090518] hover:bg-purple-900/40 border border-purple-500/20 text-xs font-semibold flex items-center justify-between"
              >
                <span>Preise & Pakete ansehen</span>
                <ArrowRight className="h-3 w-3 text-fuchsia-400" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (user) onOpen2FASetup?.();
                  else onOpenAuth?.('pro');
                }}
                className="w-full text-left p-2 rounded-xl bg-[#090518] hover:bg-purple-900/40 border border-purple-500/20 text-xs font-semibold flex items-center justify-between"
              >
                <span>2FA Schutz aktivieren</span>
                <ArrowRight className="h-3 w-3 text-sky-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
