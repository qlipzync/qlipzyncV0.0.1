export interface IntegrationStatusPayload {
  twitch: {
    connected: boolean;
    channelName: string | null;
    broadcasterId: string | null;
    isLive: boolean;
    displayName?: string | null;
    avatarUrl?: string | null;
    game?: string | null;
    viewerCount?: number;
    title?: string | null;
  };
  google: {
    connected: boolean;
    spreadsheetId: string | null;
    spreadsheetUrl: string | null;
  };
  discord: {
    connected: boolean;
    webhookConfigured: boolean;
  };
}

export interface GoogleSheetsLiveRowItem {
  id: string;
  clipTitle: string;
  category: string;
  viralityScore: number;
  platforms: string[];
  status: string;
  timestamp: string;
  game?: string;
  durationSec?: number;
  tiktokUrl?: string;
  xPostUrl?: string;
  shortsUrl?: string;
  tempStorageState?: string;
}

export interface UserWebhookEventItem {
  id: string;
  type: string;
  timestamp: string;
  source: string;
  details: string;
  provider?: string;
  eventType?: string;
  receivedAt?: string;
  eventData?: any;
  userId?: string;
}

export async function fetchIntegrationsLiveStatus(uid: string): Promise<IntegrationStatusPayload> {
  try {
    const res = await fetch(`/api/integrations/status?uid=${encodeURIComponent(uid)}`);
    if (!res.ok) throw new Error(`Status HTTP ${res.status}`);
    const data = await res.json();
    return data.status || {
      twitch: { connected: true, channelName: uid, broadcasterId: uid, isLive: false, displayName: uid },
      google: { connected: false, spreadsheetId: null, spreadsheetUrl: null },
      discord: { connected: false, webhookConfigured: false },
    };
  } catch (err) {
    return {
      twitch: { connected: true, channelName: uid, broadcasterId: uid, isLive: false, displayName: uid },
      google: { connected: false, spreadsheetId: null, spreadsheetUrl: null },
      discord: { connected: false, webhookConfigured: false },
    };
  }
}

export async function fetchLiveSheetsRows(uid: string): Promise<GoogleSheetsLiveRowItem[]> {
  try {
    const res = await fetch(`/api/integrations/sheets/rows?uid=${encodeURIComponent(uid)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.rows || [];
  } catch {
    return [];
  }
}

export async function fetchUserWebhookEvents(uid: string): Promise<UserWebhookEventItem[]> {
  try {
    const res = await fetch(`/api/integrations/events?uid=${encodeURIComponent(uid)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.events || [];
  } catch {
    return [];
  }
}

export async function provisionGoogleSheets(
  channelName: string,
  uid?: string
): Promise<{ success: boolean; spreadsheetId?: string; spreadsheetUrl?: string; title?: string; error?: string }> {
  try {
    const res = await fetch('/api/integrations/sheets/provision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelName, uid }),
    });
    if (!res.ok) throw new Error('Provisioning failed');
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export function openOAuthConnectPopup(
  provider: string,
  uid?: string,
  channelName?: string,
  onSuccess?: () => void
): void {
  const url = `/api/oauth/${provider}/start?uid=${encodeURIComponent(uid || '')}&channel=${encodeURIComponent(channelName || '')}`;
  const width = 600;
  const height = 700;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  const popup = window.open(
    url,
    `Connect ${provider}`,
    `width=${width},height=${height},top=${top},left=${left}`
  );

  const timer = setInterval(() => {
    if (!popup || popup.closed) {
      clearInterval(timer);
      onSuccess?.();
    }
  }, 1000);
}

export async function disconnectOAuthAccount(provider: string, uid: string): Promise<boolean> {
  try {
    const res = await fetch('/api/integrations/disconnect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, uid }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
