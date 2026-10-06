import React from 'react';
import { Tv, Share2, FileSpreadsheet, Check, ExternalLink } from 'lucide-react';
import { StreamerUser } from '../../types/pipeline';
import { openOAuthConnectPopup } from '../../lib/accountIntegrationsApi';

interface LiveIntegrationsDashboardProps {
  user?: StreamerUser;
  onUpdateUser?: (user: StreamerUser) => void;
}

export const LiveIntegrationsDashboard: React.FC<LiveIntegrationsDashboardProps> = ({
  user,
  onUpdateUser,
}) => {
  const handleConnect = (provider: string) => {
    openOAuthConnectPopup(provider, user?.id, user?.channelName, () => {
      // callback
    });
  };

  return (
    <div className="w-full rounded-3xl border border-purple-500/30 bg-[#0c0822] p-6 shadow-2xl space-y-6 text-zinc-100">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <h3 className="text-sm font-bold text-white">Verbundene Social Media & Cloud Konten</h3>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
          OAuth 2.0 Integration
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left text-xs">
        <div className="p-4 rounded-2xl bg-[#090518] border border-purple-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Tv className="h-4 w-4 text-[#9146FF]" />
              <span>Twitch EventSub</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">Verbunden</span>
          </div>
          <p className="text-[11px] text-zinc-400">Streamer: @{user?.channelName || 'Streamer'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#090518] border border-purple-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5">
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span>Google Sheets Sync</span>
            </span>
            <span className={`text-[10px] font-mono font-bold ${user?.googleConnected ? 'text-emerald-400' : 'text-zinc-500'}`}>
              {user?.googleConnected ? 'Aktiv' : 'Nicht verbunden'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleConnect('google')}
            className="w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-bold transition cursor-pointer"
          >
            {user?.googleConnected ? 'Verbindung verwalten' : 'Google Drive verbinden ↗'}
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#090518] border border-purple-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Share2 className="h-4 w-4 text-cyan-400" />
              <span>Social Accounts (TikTok/IG)</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Bereit</span>
          </div>
          <button
            type="button"
            onClick={() => handleConnect('tiktok')}
            className="w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-bold transition cursor-pointer"
          >
            Socials verknüpfen ↗
          </button>
        </div>
      </div>
    </div>
  );
};
