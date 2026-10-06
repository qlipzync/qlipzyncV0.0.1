export type SubscriptionPlan = 'free' | 'starter' | 'basic' | 'pro' | 'elite' | 'creator' | 'enterprise' | 'none';
export type SocialChannelsTier = 1 | 2 | 3 | 4 | 5;
export type ProgressiveTierLevel = 1 | 2 | 3 | 4 | 5;

export interface ClipPackage {
  id: string;
  name: string;
  clips: number;
  price?: string | number;
  priceNum?: number;
  priceEur?: number;
  priceId?: string;
  pricePerClip?: string;
  description?: string;
  badge?: string;
  popular?: boolean;
}

export interface ModularSubscriptionConfig {
  clipVolume: number;
  socialChannelsCount: SocialChannelsTier;
  connectedPlatforms: string[];
  renderTier: number;
  aiSpeechTier: number;
  videoCropTier: number;
  monitoringTier: number;
  publishingTier: number;
  brandingTier: number;
  enableAiSubtitles: boolean;
  enableFaceCrop916: boolean;
  enableMultiStreamMonitoring: boolean;
  enableWhiteLabelBot: boolean;
  billingCycle: 'monthly' | 'annual';
  calculatedPriceMonthly: number;
  calculatedPriceAnnual: number;
  tierName?: string;
  tierLevel?: ProgressiveTierLevel;
  stripeProductId?: string;
  stripePriceId?: string;
  stripeMetadataCode?: string;
  description?: string;
}

export interface TwoFactorAuthConfig {
  isEnabled: boolean;
  isVerified: boolean;
  method: 'email_code' | 'totp_authenticator';
  backupCodes?: string[];
  lastVerifiedAt?: string;
  secretKey?: string;
}

export interface ReferralRecord {
  referredUserId: string;
  referredChannelName: string;
  registeredAt: string;
  bonusClipsAwarded: number;
  hasConvertedToPaid: boolean;
}

export interface QuickClickSettings {
  socialInvites: {
    xTwitter: boolean;
    tikTok: boolean;
    instagram: boolean;
    threads: boolean;
    youtubeShorts: boolean;
    customMessage: string;
    appendGameName: boolean;
    appendTwitchUrl: boolean;
    sendTwentyMinReminder: boolean;
    customReminderMessage: string;
    distributeToAllConnected: boolean;
  };
  botSync: {
    discordWebhook: boolean;
    discordWebhookUrl: string;
    telegramBot: boolean;
    telegramChatId: string;
    pingRole: string;
    embedColor: string;
    includeThumbnail: boolean;
    sendLiveUpdatesDuringStream: boolean;
    intervalMinutes: number;
    liveUpdateMessage: string;
    sendFarewellOnOffline: boolean;
    farewellMessage: string;
  };
  communityOutro: {
    sendFarewell: boolean;
    thankRaiders: boolean;
    postStreamStats: boolean;
    customFarewellMessage: string;
    discordOutroMessage?: string;
    telegramOutroMessage?: string;
    nextStreamDate?: string;
  };
  zeroStorageClip?: {
    waitForMinutes: number;
    autoFetchClips: boolean;
    aiSmartCrop9x16: boolean;
    uploadToTikTok: boolean;
    uploadToShorts: boolean;
    uploadToInstagramReels: boolean;
    deleteMp4ImmediatelyAfterUpload: boolean;
    syncToGoogleSheets: boolean;
    googleSheetName: string;
  };
  healthAgent?: {
    deduplicationLock: boolean;
    signatureVerification: boolean;
    autoRetryFailedSteps: boolean;
    maxRetries: number;
    alertOnFailure: boolean;
    memoryLeakProtector: boolean;
  };
  byok?: {
    enabled: boolean;
    geminiApiKey?: string;
    openaiApiKey?: string;
    anthropicApiKey?: string;
  };
}

export interface StreamerUser {
  id: string;
  name: string;
  channelName: string;
  email?: string;
  avatarUrl: string;
  plan: SubscriptionPlan;
  clipsUsedThisMonth: number;
  clipsLimitTotal: number;
  extraPacksPurchased?: number;
  bonusClips?: number;
  apiCallsUsed: number;
  apiCallsLimit: number;
  referralCount: number;
  earnedCredits: number;
  referralCode?: string;
  referredBy?: string;
  referralsList?: ReferralRecord[];
  hasActiveSubscription: boolean;
  role: 'streamer' | 'admin' | 'vip';
  isAdmin?: boolean;
  isTitanVip?: boolean;
  isLive: boolean;
  streamTitle?: string;
  game?: string;
  viewers?: number;
  twitchConnected: boolean;
  twitchUserId?: string;
  twitchAccessToken?: string;
  googleConnected: boolean;
  googleSheetId?: string;
  googleSheetUrl?: string;
  discordConnected?: boolean;
  discordWebhookConfigured?: boolean;
  twoFactorAuth?: TwoFactorAuthConfig;
  isFullyConfigured?: boolean;
  onboardingStep?: number;
  modularConfig?: ModularSubscriptionConfig;
  settings?: QuickClickSettings;
  byokConfig?: {
    enabled: boolean;
    geminiApiKey?: string;
    openaiApiKey?: string;
    anthropicApiKey?: string;
  };
  trialActive?: boolean;
  trialStartedAt?: string;
  trialEndsAt?: string;
  trialPlan?: SubscriptionPlan;
  trialPriceAfterEur?: number;
  trialConvertedToPaid?: boolean;
  trialCancelled?: boolean;
}

export interface GoogleSheetsRow {
  clipId: string;
  timestamp: string;
  title: string;
  game: string;
  viralityScore: number;
  platforms: string;
  status: string;
  durationSeconds: number;
}
