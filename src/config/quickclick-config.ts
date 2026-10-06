export const FIREBASE_PUBLIC_CONFIG = {
  apiKey: "AIzaSyB209DOGAYYqvZcD6KuQ4qvE3Z4RACiooM",
  authDomain: "qlipzync.firebaseapp.com",
  projectId: "qlipzync",
  storageBucket: "qlipzync.firebasestorage.app",
  messagingSenderId: "248792984033",
  appId: "1:248792984033:web:3c55dbd341eb24f6300aa0",
  measurementId: "G-X5B6GPCF8H"
} as const;

export const GCP_PROJECT_METADATA = {
  projectName: "quickclick",
  projectId: "qlipzync",
  projectNumber: "248792984033",
  repositoryUrl: "https://github.com/sh00trsTv/qlipzync",
  organization: "sh00trsTv",
  publicName: "QlipZync",
  supportEmail: "robert.f.telekom@gmail.com",
  defaultRegion: process.env.GCP_REGION || "europe-west3",
  databaseId: "ai-studio-quickclick-003fd948-cf64-489f-9030-863f460c6c91",
  fcmSenderId: "248792984033"
} as const;

export const AI_STUDIO_LIVE_ENDPOINTS = {
  repositoryUrl: "https://github.com/sh00trsTv/qlipzync",
  productionAppUrl: "https://quickclick-app-248792984033.europe-west3.run.app",
  productionHostingUrl: "https://qlipzync.web.app",
  firebaseAppDomain: "https://qlipzync.firebaseapp.com",
  devAppUrl: "https://ais-dev-fhiqhjgox5z6bynywnrcse-191120648656.europe-west2.run.app",
  sharedAppUrl: "https://ais-pre-fhiqhjgox5z6bynywnrcse-191120648656.europe-west2.run.app",
  twitchEventSubCallbackUrl: "https://quickclick-app-248792984033.europe-west3.run.app/api/webhooks/twitch",
  databaseId: "ai-studio-quickclick-003fd948-cf64-489f-9030-863f460c6c91"
} as const;

export const EXTENDED_PIPELINE_CONFIG = {
  streamInfoIntervalMinutes: 10,
  reminderDelayMinutes: 15,
  offlineCooldownMinutes: 5,
  zeroStorageRamOnly: true,
  omniPostingPlatforms: ["tiktok", "youtube_shorts", "instagram_reels", "twitter_x"],
  googleSheetsLogColumns: [
    "timestamp",
    "channelName",
    "eventType",
    "streamTitle",
    "viewerCount",
    "liveInviteUrl",
    "reminderPostUrl",
    "farewellStatus",
    "tiktokUrl",
    "youtubeShortsUrl",
    "instagramReelsUrl",
    "twitterUrl",
    "discordBotStatus",
    "telegramBotStatus",
    "processingStatus"
  ]
} as const;

export const QUOTA_TIERS = {
  free: { dailyLimit: 1, margin: "40%", monthlyClips: 15 },
  creator: { dailyLimit: 5, margin: "30%", monthlyClips: 30 },
  pro: { dailyLimit: 10, margin: "20%", monthlyClips: 150 },
  elite: { dailyLimit: 20, margin: "15%", monthlyClips: 600 }
} as const;
