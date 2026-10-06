export const DEFAULT_TWITCH_CLIENT_ID =
  import.meta.env.VITE_TWITCH_CLIENT_ID || 'hq1d65u7q8v2cd2jgtj7fpd51ig1st';

export interface TwitchHelixUser {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  email?: string;
  created_at: string;
}

export interface TwitchHelixStream {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
}

export function parseTwitchHashParams(): { accessToken?: string; state?: string } {
  if (typeof window === 'undefined') return {};
  const hash = window.location.hash.substring(1);
  if (!hash) return {};
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token') || undefined;
  const state = params.get('state') || undefined;
  return { accessToken, state };
}

export function cleanUrlHash(): void {
  if (typeof window === 'undefined') return;
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  } else {
    window.location.hash = '';
  }
}

export async function fetchTwitchCurrentUser(token: string): Promise<TwitchHelixUser | null> {
  try {
    const res = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Client-ID': DEFAULT_TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      console.warn('Twitch Helix /users returned status', res.status);
      return null;
    }
    const data = await res.json();
    return data.data?.[0] || null;
  } catch (err) {
    console.error('Error fetching Twitch user:', err);
    return null;
  }
}

export async function fetchTwitchStreamLiveStatus(
  userId: string,
  token: string
): Promise<TwitchHelixStream | null> {
  try {
    const res = await fetch(`https://api.twitch.tv/helix/streams?user_id=${encodeURIComponent(userId)}`, {
      headers: {
        'Client-ID': DEFAULT_TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.[0] || null;
  } catch (err) {
    console.error('Error fetching Twitch stream:', err);
    return null;
  }
}
