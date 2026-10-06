import React, { useState } from 'react';
import { X, Sliders, Check, Zap, Tv, FileSpreadsheet, Bot, Share2 } from 'lucide-react';
import { StreamerUser, QuickClickSettings } from '../../types/pipeline';

interface SystemConfigurationHubProps {
  user: StreamerUser;
  onUpdateUser?: (user: StreamerUser) => void;
  onCompleteAndUnlockDashboard?: () => void;
  isModalView?: boolean;
  onCloseModal?: () => void;
}

export const SystemConfigurationHub: React.FC<SystemConfigurationHubProps> = ({
  user,
  onUpdateUser,
  onCompleteAndUnlockDashboard,
  isModalView,
  onCloseModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'pipeline' | 'socials' | 'sheets' | 'bot'>('pipeline');
  const [settings, setSettings] = useState<QuickClickSettings>(
    user.settings || {
      socialInvites: {
        xTwitter: true,
        tikTok: true,
        instagram: false,
        threads: true,
        youtubeShorts: true,
        customMessage: '🔴 Wir sind JETZT LIVE! Kommt rein & lasst Liebe da! 🔥',
        appendGameName: true,
        appendTwitchUrl: true,
        sendTwentyMinReminder: true,
        customReminderMessage: '⏰ REMINDER: Wir sind immer noch LIVE! Jetzt einschalten! 🔥',
        distributeToAllConnected: true,
      },
      botSync: {
        discordWebhook: true,
        discordWebhookUrl: 'https://discord.com/api/webhooks/quickclick-live-feed',
        telegramBot: true,
        telegramChatId: '@pixelvortex_community',
        pingRole: '@everyone',
        embedColor: '#9146FF',
        includeThumbnail: true,
        sendLiveUpdatesDuringStream: true,
        intervalMinutes: 10,
        liveUpdateMessage: '🎮 Live-Update: Neue Runde gestartet!',
        sendFarewellOnOffline: true,
        farewellMessage: '👋 Stream beendet! Vielen Dank an alle Zuschauer fürs Einschalten!',
      },
      communityOutro: {
        sendFarewell: true,
        thankRaiders: true,
        postStreamStats: true,
        customFarewellMessage: '✨ Stream-Highlights werden jetzt automatisch gerendert!',
      },
    }
  );

  const handleSave = () => {
    const updated: StreamerUser = {
      ...user,
      settings,
      isFullyConfigured: true,
      onboardingStep: 4,
    };
    onUpdateUser?.(updated);
    onCompleteAndUnlockDashboard?.();
    onCloseModal?.();
  };

  return (
    <div className="w-full rounded-3xl border border-purple-500/30 bg-[#0c0822] p-6 sm:p-8 shadow-2xl space-y-6 text-zinc-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black font-display text-white">System Configuration Hub</h2>
            <p className="text-xs text-zinc-400">Passe deine autonome Clip- & Social-Pipeline an.</p>
          </div>
        </div>
        {onCloseModal && (
          <button type="button" onClick={onCloseModal} className="text-zinc-400 hover:text-white transition cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        <div className="p-4 rounded-2xl border border-purple-500/20 bg-[#090518] space-y-3">
          <h4 className="text-xs font-bold text-fuchsia-400 uppercase">9:16 Video Transcoder</h4>
          <label className="flex items-center gap-2 text-xs text-zinc-300">
            <input type="checkbox" defaultChecked className="rounded text-purple-600" />
            <span>KI-Facecam Auto-Tracking (0 MB RAM)</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-zinc-300">
            <input type="checkbox" defaultChecked className="rounded text-purple-600" />
            <span>Automatische deutsche & englische Untertitel</span>
          </label>
        </div>

        <div className="p-4 rounded-2xl border border-purple-500/20 bg-[#090518] space-y-3">
          <h4 className="text-xs font-bold text-purple-400 uppercase">Multi-Social Auto-Post</h4>
          <label className="flex items-center gap-2 text-xs text-zinc-300">
            <input
              type="checkbox"
              checked={settings.socialInvites.tikTok}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialInvites: { ...settings.socialInvites, tikTok: e.target.checked },
                })
              }
              className="rounded text-purple-600"
            />
            <span>TikTok Direct Post</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-zinc-300">
            <input
              type="checkbox"
              checked={settings.socialInvites.youtubeShorts}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialInvites: { ...settings.socialInvites, youtubeShorts: e.target.checked },
                })
              }
              className="rounded text-purple-600"
            />
            <span>YouTube Shorts Direct Post</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-xs cursor-pointer shadow-lg transition"
        >
          Konfiguration übernehmen ↗
        </button>
      </div>
    </div>
  );
};
