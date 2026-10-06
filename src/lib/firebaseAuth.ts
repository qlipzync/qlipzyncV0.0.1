import { app as firebaseApp, auth as firebaseAuth } from './firebase';
export { firebaseApp, firebaseAuth };
import {
  StreamerUser,
  SubscriptionPlan,
} from '../types/pipeline';
import {
  FREE_STARTER_PLAN,
  BASIC_TRIAL_PLAN,
  PRESET_MODULAR_PLANS,
} from '../utils/pricingCalculator';
import {
  checkIsVip,
  isMasterAdmin,
  MASTER_ADMIN_PASSWORD,
  TWOANDAHALFEAFC_PASSWORD,
} from './vipWhitelist';
import {
  TwitchHelixUser,
  TwitchHelixStream,
  fetchTwitchCurrentUser,
  fetchTwitchStreamLiveStatus,
} from './twitchApi';

export function validateReferralCode(code?: string): boolean {
  if (!code) return false;
  const clean = code.trim().toUpperCase();
  return clean.length >= 3 && clean.length <= 25;
}

export function buildReferralLink(channelName: string, referralCode?: string): string {
  const codeParam = referralCode ? `?ref=${encodeURIComponent(referralCode)}` : '';
  return `https://quickclick.gg/ref/${encodeURIComponent(channelName.toLowerCase())}${codeParam}`;
}

export async function createRealStreamerUserFromTwitchHelix(
  helixUser: TwitchHelixUser,
  accessToken: string,
  plan: SubscriptionPlan = 'pro',
  referredBy?: string,
  streamInfo?: TwitchHelixStream | null
): Promise<StreamerUser> {
  const channel = helixUser.login.toLowerCase();
  const email = helixUser.email || `${channel}@twitch.tv`;
  const isAdmin = isMasterAdmin(email, channel);
  const isVip = checkIsVip(channel, email);

  const finalPlan: SubscriptionPlan = isAdmin || isVip ? 'elite' : plan;
  const clipsLimit = isAdmin ? 9999 : isVip ? 600 : 90;
  const apiLimit = isAdmin ? 99999 : isVip ? 4800 : 900;

  return {
    id: `twitch_${helixUser.id}`,
    name: helixUser.display_name,
    channelName: channel,
    email,
    avatarUrl: helixUser.profile_image_url,
    plan: finalPlan,
    clipsUsedThisMonth: 0,
    clipsLimitTotal: clipsLimit,
    extraPacksPurchased: 0,
    bonusClips: 0,
    apiCallsUsed: 0,
    apiCallsLimit: apiLimit,
    referralCount: 0,
    earnedCredits: 0,
    referralCode: `QC-${channel.toUpperCase().slice(0, 6)}`,
    referredBy,
    hasActiveSubscription: true,
    role: isAdmin ? 'admin' : isVip ? 'vip' : 'streamer',
    isAdmin,
    isTitanVip: isVip,
    isLive: Boolean(streamInfo),
    streamTitle: streamInfo?.title || '',
    game: streamInfo?.game_name || '',
    viewers: streamInfo?.viewer_count || 0,
    twitchConnected: true,
    twitchUserId: helixUser.id,
    twitchAccessToken: accessToken,
    googleConnected: false,
    twoFactorAuth: { isEnabled: false, isVerified: false, method: 'email_code' },
    isFullyConfigured: true,
    onboardingStep: 4,
    modularConfig: PRESET_MODULAR_PLANS[2],
  };
}

export async function authenticateWithTwitch(
  channelInput: string,
  preferredPlan: SubscriptionPlan = 'pro',
  passwordInput?: string,
  tokenInput?: string
): Promise<StreamerUser> {
  const cleanChannel = channelInput.replace(/^https?:\/\/(www\.)?twitch\.tv\//i, '').replace(/[@/]/g, '').trim().toLowerCase();
  let resolvedEmail = `${cleanChannel}@twitch.tv`;

  if (cleanChannel === 'robert_f_telekom' || cleanChannel === 'admin') {
    resolvedEmail = 'robert.f.telekom@gmail.com';
  } else if (cleanChannel === 'sh00trs' || cleanChannel === 'sh00trstv') {
    resolvedEmail = 'sh00trs.tv@gmail.com';
  } else if (cleanChannel === 'twoandahalfeafc') {
    resolvedEmail = 'twoandahalfeafc@gmail.com';
  }

  const isMaster = passwordInput === MASTER_ADMIN_PASSWORD || isMasterAdmin(resolvedEmail, cleanChannel);
  const isVip = checkIsVip(cleanChannel, resolvedEmail) || passwordInput === TWOANDAHALFEAFC_PASSWORD;

  const finalPlan: SubscriptionPlan = isMaster || isVip ? 'elite' : preferredPlan;
  const clipsLimit = isMaster ? 9999 : isVip ? 600 : 90;
  const apiLimit = isMaster ? 99999 : isVip ? 4800 : 900;

  return {
    id: `user_${cleanChannel}_${Date.now()}`,
    name: isMaster ? 'Robert F. Telekom (Admin)' : cleanChannel.charAt(0).toUpperCase() + cleanChannel.slice(1),
    channelName: cleanChannel,
    email: resolvedEmail,
    avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    plan: finalPlan,
    clipsUsedThisMonth: 0,
    clipsLimitTotal: clipsLimit,
    extraPacksPurchased: 0,
    bonusClips: 0,
    apiCallsUsed: 0,
    apiCallsLimit: apiLimit,
    referralCount: 0,
    earnedCredits: 0,
    referralCode: `QC-${cleanChannel.toUpperCase().slice(0, 6)}`,
    hasActiveSubscription: true,
    role: isMaster ? 'admin' : isVip ? 'vip' : 'streamer',
    isAdmin: isMaster,
    isTitanVip: isVip,
    isLive: false,
    streamTitle: 'Autonomer Live-Stream Highlight Test',
    game: 'Just Chatting',
    viewers: 0,
    twitchConnected: true,
    googleConnected: false,
    twoFactorAuth: { isEnabled: false, isVerified: false, method: 'email_code' },
    isFullyConfigured: true,
    onboardingStep: 4,
    modularConfig: PRESET_MODULAR_PLANS[2],
  };
}
