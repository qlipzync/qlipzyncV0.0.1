import React from 'react';
import { X, FileSpreadsheet, ExternalLink, Check } from 'lucide-react';
import { StreamerUser } from '../../types/pipeline';

interface GoogleWorkspaceHubProps {
  isOpen?: boolean;
  onClose?: () => void;
  user: StreamerUser;
  onProvisionSheet?: () => void;
}

export const GoogleWorkspaceHub: React.FC<GoogleWorkspaceHubProps> = ({
  isOpen = true,
  onClose,
  user,
  onProvisionSheet,
}) => {
  if (!isOpen) return null;

  return (
    <div className="w-full rounded-3xl border border-emerald-500/30 bg-[#0c0822] p-6 sm:p-8 shadow-2xl relative space-y-6 text-zinc-100">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black font-display text-white">Google Workspace & Sheets Hub</h2>
            <p className="text-xs text-zinc-400">Automatisches Echtzeit-Logging aller Stream-Clips in Google Drive.</p>
          </div>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-white transition cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="p-4 rounded-2xl border border-emerald-500/20 bg-[#090518] space-y-3 text-left">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-white">Status Tabelle</span>
          <span className="text-xs font-mono font-bold text-emerald-400">
            {user.googleSheetId ? 'Verbunden' : 'Nicht eingerichtet'}
          </span>
        </div>
        {user.googleSheetUrl && (
          <a
            href={user.googleSheetUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1.5"
          >
            <span>Tabelle auf Google Drive öffnen</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      <button
        type="button"
        onClick={onProvisionSheet}
        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer transition shadow"
      >
        {user.googleSheetId ? 'Tabelle synchronisieren' : 'Neue Google Sheets Tabelle anlegen ↗'}
      </button>
    </div>
  );
};
