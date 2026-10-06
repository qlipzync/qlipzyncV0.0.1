import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { StreamerDashboard } from './components/dashboard/StreamerDashboard';
import { AccessDeniedPaywall } from './components/monetization/AccessDeniedPaywall';
import { AuthModal } from './components/modals/AuthModal';
import { ClipPacksModal } from './components/modals/ClipPacksModal';
import { QuickClickBotGuide } from './components/modals/QuickClickBotGuide';
import { TwoFactorAuthModal } from './components/modals/TwoFactorAuthModal';
import { ChannelSetupWizard } from './components/modals/ChannelSetupWizard';
import { SystemConfigurationHub } from './components/modals/SystemConfigurationHub';
import { StripeCheckoutModal } from './components/modals/StripeCheckoutModal';
import { ImpressumModal } from './components/legal/ImpressumModal';
import { PrivacyPolicyModal } from './components/legal/PrivacyPolicyModal';
import { TermsAndConditionsModal } from './components/legal/TermsAndConditionsModal';
import { CookieConsentBanner } from './components/legal/CookieConsentBanner';
import { AvvAgreementModal } from './components/legal/AvvAgreementModal';
import { GdprPrivacyAuditModal } from './components/modals/GdprPrivacyAuditModal';
import { StreamerUser, SubscriptionPlan, ClipPackage, ModularSubscriptionConfig } from './types/pipeline';
import {
  syncUserToFirestore,
  subscribeToUserDocument,
  logOutFirebase,
  subscribeToAuthState,
  loadUserFromFirestore,
} from './lib/firebase';
import { createRealStreamerUserFromTwitchHelix, authenticateWithTwitch } from './lib/firebaseAuth';
import {
  parseTwitchHashParams,
  cleanUrlHash,
  fetchTwitchCurrentUser,
  fetchTwitchStreamLiveStatus,
} from './lib/twitchApi';
import { PRESET_MODULAR_PLANS, BASIC_TRIAL_PLAN, FREE_STARTER_PLAN } from './utils/pricingCalculator';
import {
  ShieldCheck,
  CheckCircle2,
  Scale,
  FileCheck,
  Cookie,
  LayoutDashboard,
  ArrowRight,
} from 'lucide-react';

const MASTER_ADMIN_EMAIL = 'robert.f.telekom@gmail.com';
const TITAN_LIFETIME_EMAILS = ['sh00trs.tv@gmail.com', 'twoandahalfeafc@gmail.com'];

export default function App() {
  const [currentUser, setCurrentUser] = useState<StreamerUser | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [preferredPlanForAuth, setPreferredPlanForAuth] = useState<SubscriptionPlan | undefined>(undefined);
  const [initialChannelForAuth, setInitialChannelForAuth] = useState<string | undefined>(undefined);
  const [isClipPacksModalOpen, setIsClipPacksModalOpen] = useState<boolean>(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState<boolean>(false);
  const [isChannelSetupOpen, setIsChannelSetupOpen] = useState<boolean>(false);
  const [isConfigHubModalOpen, setIsConfigHubModalOpen] = useState<boolean>(false);
  const [oauthSuccessNotice, setOauthSuccessNotice] = useState<string | null>(null);

  // Legal & GDPR Compliance Modals (German & EU Law)
  const [isImpressumOpen, setIsImpressumOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isAvvOpen, setIsAvvOpen] = useState<boolean>(false);
  const [isGdprAuditOpen, setIsGdprAuditOpen] = useState<boolean>(false);
  const [forceCookieBanner, setForceCookieBanner] = useState<boolean>(false);

  // Stripe Checkout state
  const [isStripeModalOpen, setIsStripeModalOpen] = useState<boolean>(false);
  const [stripePlan, setStripePlan] = useState<ModularSubscriptionConfig | null>(null);
  const [stripeClipPack, setStripeClipPack] = useState<ClipPackage | null>(null);
  const [stripeBillingCycle, setStripeBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isTrialCheckout, setIsTrialCheckout] = useState<boolean>(false);

  // Auto-Assign Roles & Privileges (Master Admin & Titan VIPs)
  const applyVipAndAdminPrivileges = (user: StreamerUser): StreamerUser => {
    const email = (user.email || '').trim().toLowerCase();
    const isAdmin = email === MASTER_ADMIN_EMAIL.toLowerCase();
    const isTitan = TITAN_LIFETIME_EMAILS.some((e) => e.toLowerCase() === email);

    if (isAdmin) {
      return {
        ...user,
        role: 'admin',
        isAdmin: true,
        isTitanVip: true,
        hasActiveSubscription: true,
        plan: 'elite',
        clipsLimitTotal: 9999,
        apiCallsLimit: 99999,
      };
    }
    if (isTitan) {
      return {
        ...user,
        role: 'streamer',
        isTitanVip: true,
        hasActiveSubscription: true,
        plan: 'elite',
        clipsLimitTotal: 600,
        apiCallsLimit: 4800,
      };
    }
    return user;
  };

  // Process real Twitch OAuth access token and create/login streamer
  const handleTwitchAccessToken = async (token: string) => {
    try {
      const helixUser = await fetchTwitchCurrentUser(token);
      if (helixUser) {
        const stream = await fetchTwitchStreamLiveStatus(helixUser.id, token);
        let realUser = await createRealStreamerUserFromTwitchHelix(
          helixUser,
          token,
          'pro',
          undefined,
          stream
        );
        realUser = applyVipAndAdminPrivileges(realUser);
        setCurrentUser(realUser);
        setCurrentView('dashboard');
        localStorage.setItem('quickclick_user', JSON.stringify(realUser));
        await syncUserToFirestore(realUser);
        setIsAuthModalOpen(false);
        setOauthSuccessNotice(`🎉 Erfolgreich mit echtem Twitch-Account "${helixUser.display_name}" verbunden!`);
        setTimeout(() => setOauthSuccessNotice(null), 6000);
      }
    } catch (err) {
      console.error('Twitch OAuth login error:', err);
    }
  };

  // Real Twitch OAuth Hash Handler, Popup Listener & LocalStorage Restoration
  useEffect(() => {
    const handleAuthInit = async () => {
      // 1. Check if returning from Twitch OAuth 2.0 redirect (#access_token=...)
      const { accessToken } = parseTwitchHashParams();
      if (accessToken) {
        cleanUrlHash();
        // If opened in a popup, message opener and close popup
        if (window.opener) {
          try {
            window.opener.postMessage(
              {
                type: 'TWITCH_OAUTH_SUCCESS',
                accessToken,
              },
              '*'
            );
            setTimeout(() => {
              try { window.close(); } catch (e) {}
            }, 500);
            return;
          } catch (e) {
            console.warn('Failed to message opener window:', e);
          }
        }
        await handleTwitchAccessToken(accessToken);
        return;
      }

      // Check if localStorage has pending token from popup fallback
      try {
        const storedToken = localStorage.getItem('quickclick_twitch_oauth_token');
        if (storedToken) {
          localStorage.removeItem('quickclick_twitch_oauth_token');
          await handleTwitchAccessToken(storedToken);
          return;
        }
      } catch (e) {
        // ignore
      }

      // 2. Restore session from localStorage if user previously logged in
      try {
        const savedUser = localStorage.getItem('quickclick_user') || localStorage.getItem('qlipzync_user');
        if (savedUser) {
          let parsed: StreamerUser = JSON.parse(savedUser);
          parsed = applyVipAndAdminPrivileges(parsed);

          // Auto-check if 14-day trial expired and needs transition to paid Basic
          if (parsed.trialActive && parsed.trialEndsAt && !parsed.trialCancelled && !parsed.trialConvertedToPaid) {
            if (new Date(parsed.trialEndsAt).getTime() <= Date.now()) {
              parsed.trialActive = false;
              parsed.trialConvertedToPaid = true;
              parsed.hasActiveSubscription = true;
              parsed.plan = 'pro';
              parsed.clipsLimitTotal = 90;
              parsed.apiCallsLimit = 900;
              parsed.modularConfig = BASIC_TRIAL_PLAN;
            }
          }
          setCurrentUser(parsed);
          syncUserToFirestore(parsed);
          if (!sessionStorage.getItem('quickclick_explicit_logout')) {
            setCurrentView('dashboard');
          }
        }
      } catch {
        // ignore
      }
    };

    handleAuthInit();

    // Listen for Twitch OAuth completion messages from popup
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'TWITCH_OAUTH_SUCCESS' && event.data?.accessToken) {
        handleTwitchAccessToken(event.data.accessToken);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'quickclick_twitch_oauth_token' && e.newValue) {
        localStorage.removeItem('quickclick_twitch_oauth_token');
        handleTwitchAccessToken(e.newValue);
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Deep-linking for Legal Pages & Modals: Privacy Policy (Datenschutz), Terms (AGB), Impressum, AVV, GDPR Audit
  useEffect(() => {
    const handleUrlRoutes = () => {
      const hash = (window.location.hash || '').toLowerCase();
      const search = (window.location.search || '').toLowerCase();
      const pathname = (window.location.pathname || '').toLowerCase();

      if (
        hash.includes('privacy') ||
        hash.includes('datenschutz') ||
        search.includes('privacy') ||
        search.includes('datenschutz') ||
        pathname === '/privacy' ||
        pathname === '/datenschutz'
      ) {
        setIsPrivacyOpen(true);
      } else if (
        hash.includes('terms') ||
        hash.includes('agb') ||
        hash.includes('nutzungsbedingungen') ||
        search.includes('terms') ||
        search.includes('agb') ||
        pathname === '/terms' ||
        pathname === '/agb' ||
        pathname === '/nutzungsbedingungen'
      ) {
        setIsTermsOpen(true);
      } else if (
        hash.includes('impressum') ||
        search.includes('impressum') ||
        pathname === '/impressum'
      ) {
        setIsImpressumOpen(true);
      } else if (
        hash.includes('avv') ||
        search.includes('avv') ||
        pathname === '/avv'
      ) {
        setIsAvvOpen(true);
      } else if (
        hash.includes('audit') ||
        search.includes('audit')
      ) {
        setIsGdprAuditOpen(true);
      }
    };

    handleUrlRoutes();
    window.addEventListener('hashchange', handleUrlRoutes);
    window.addEventListener('popstate', handleUrlRoutes);
    return () => {
      window.removeEventListener('hashchange', handleUrlRoutes);
      window.removeEventListener('popstate', handleUrlRoutes);
    };
  }, []);

  const clearModalHash = () => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const h = window.location.hash.toLowerCase();
      if (
        h.includes('privacy') ||
        h.includes('datenschutz') ||
        h.includes('terms') ||
        h.includes('agb') ||
        h.includes('impressum') ||
        h.includes('avv') ||
        h.includes('audit')
      ) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  };

  // Listen for remote updates from Firestore if user is logged in
  useEffect(() => {
    if (!currentUser?.id) return;
    const unsubscribe = subscribeToUserDocument(currentUser.id, (remoteData) => {
      if (remoteData) {
        setCurrentUser((prev) => {
          if (!prev) return null;
          const merged = { ...prev, ...remoteData } as StreamerUser;
          return applyVipAndAdminPrivileges(merged);
        });
      }
    });
    return () => unsubscribe();
  }, [currentUser?.id]);

  // Real-time Firebase Auth session hydration
  useEffect(() => {
    const unsubAuth = subscribeToAuthState(async (fbUser) => {
      if (fbUser && !sessionStorage.getItem('quickclick_explicit_logout')) {
        const firestoreData = await loadUserFromFirestore(fbUser.uid);
        if (firestoreData && firestoreData.id) {
          setCurrentUser((prev) => {
            let merged = { ...(prev || {}), ...firestoreData } as StreamerUser;
            merged = applyVipAndAdminPrivileges(merged);
            localStorage.setItem('quickclick_user', JSON.stringify(merged));
            return merged;
          });
          if (!sessionStorage.getItem('quickclick_explicit_logout')) {
            setCurrentView('dashboard');
          }
        }
      }
    });
    return () => unsubAuth();
  }, []);

  const handleLoginSuccess = (user: StreamerUser, isNewRegistration?: boolean) => {
    sessionStorage.removeItem('quickclick_explicit_logout');
    const verifiedUser = applyVipAndAdminPrivileges(user);
    localStorage.setItem('quickclick_user', JSON.stringify(verifiedUser));
    setCurrentUser(verifiedUser);
    setCurrentView('dashboard');
    setIsAuthModalOpen(false);
    syncUserToFirestore(verifiedUser);
    if (isNewRegistration || !verifiedUser.isFullyConfigured) {
      sessionStorage.setItem('quickclick_auto_open_config', 'true');
    }
  };

  const handleLogout = async () => {
    sessionStorage.setItem('quickclick_explicit_logout', 'true');
    localStorage.removeItem('quickclick_user');
    localStorage.removeItem('qlipzync_user');
    try {
      await logOutFirebase();
    } catch (e) {
      console.warn('Firebase logout warning:', e);
    }
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleGoToDashboard = () => {
    sessionStorage.removeItem('quickclick_explicit_logout');
    if (currentUser) {
      // Ensure user has at least free subscription access so the dashboard opens smoothly
      if (!currentUser.hasActiveSubscription || currentUser.plan === 'none') {
        const freeUser: StreamerUser = {
          ...currentUser,
          hasActiveSubscription: true,
          plan: 'free',
          clipsLimitTotal: 30,
          clipsUsedThisMonth: 0,
          bonusClips: 0,
          modularConfig: FREE_STARTER_PLAN,
        };
        handleUpdateUser(freeUser);
      }
      setCurrentView('dashboard');
    } else {
      // Direct live preview for visitors
      handleStartLivePreview('sh00trs');
      setCurrentView('dashboard');
    }
  };

  const handleGoToLanding = () => {
    setCurrentView('landing');
  };

  const handleUpdateUser = (updatedUser: StreamerUser) => {
    const verified = applyVipAndAdminPrivileges(updatedUser);
    localStorage.setItem('quickclick_user', JSON.stringify(verified));
    setCurrentUser(verified);
    syncUserToFirestore(verified);
  };

  const handleOpenStripeSubscription = (
    planId: SubscriptionPlan,
    cycle: 'monthly' | 'annual' = 'annual',
    customConfig?: ModularSubscriptionConfig
  ) => {
    if (planId === 'free') {
      if (currentUser) {
        const freeUser: StreamerUser = {
          ...currentUser,
          hasActiveSubscription: true,
          plan: 'free',
          clipsLimitTotal: 30,
          clipsUsedThisMonth: 0,
          bonusClips: 0,
          modularConfig: FREE_STARTER_PLAN,
        };
        handleUpdateUser(freeUser);
      }
      return;
    }

    let matchedPlan: ModularSubscriptionConfig;
    if (customConfig) {
      matchedPlan = customConfig;
    } else {
      const tierIdx =
        planId === 'elite' ? 4 : planId === 'pro' ? 2 : planId === 'basic' ? 1 : planId === 'starter' ? 0 : 2;
      matchedPlan = PRESET_MODULAR_PLANS[tierIdx] || PRESET_MODULAR_PLANS[2];
    }
    setStripePlan(matchedPlan);
    setStripeClipPack(null);
    setStripeBillingCycle(cycle);
    setIsTrialCheckout(Boolean(matchedPlan.tierName?.includes('Testphase') || matchedPlan.description?.includes('14 Tage')));
    setIsStripeModalOpen(true);
  };

  const handleActivateSubscription = (
    plan: SubscriptionPlan,
    cycle: 'monthly' | 'annual' = 'annual',
    customConfig?: ModularSubscriptionConfig
  ) => {
    handleOpenStripeSubscription(plan, cycle, customConfig);
  };

  const handleUpgradePlan = (
    plan: SubscriptionPlan,
    cycle: 'monthly' | 'annual' = 'annual',
    customConfig?: ModularSubscriptionConfig
  ) => {
    handleOpenStripeSubscription(plan, cycle, customConfig);
  };

  const handleStartTrial = () => {
    if (!currentUser) {
      setPreferredPlanForAuth('pro');
      setIsAuthModalOpen(true);
      return;
    }
    setStripePlan(BASIC_TRIAL_PLAN);
    setStripeClipPack(null);
    setStripeBillingCycle('monthly');
    setIsTrialCheckout(true);
    setIsStripeModalOpen(true);
  };

  const handleBuyClipPackage = (pkg: ClipPackage) => {
    setStripePlan(null);
    setStripeClipPack(pkg);
    setIsStripeModalOpen(true);
    setIsClipPacksModalOpen(false);
  };

  const handleStartLivePreview = async (channelName: string) => {
    try {
      const previewUser = await authenticateWithTwitch(channelName, 'elite');
      handleLoginSuccess(previewUser);
      setOauthSuccessNotice(`✨ Live-Vorschau von QuickClick für @${channelName} erfolgreich gestartet!`);
      setTimeout(() => setOauthSuccessNotice(null), 5000);
    } catch (err) {
      console.error('Error launching preview:', err);
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (currentUser && currentUser.hasActiveSubscription) {
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070514] text-zinc-100 font-sans selection:bg-purple-500/30 selection:text-purple-200 flex flex-col justify-between antialiased overflow-x-hidden relative">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onOpenAuth={() => {
          setPreferredPlanForAuth(undefined);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onScrollTo={(sectionId) => {
          if (currentView === 'dashboard') {
            setCurrentView('landing');
            setTimeout(() => scrollToSection(sectionId), 80);
          } else {
            scrollToSection(sectionId);
          }
        }}
        onGoToDashboard={handleGoToDashboard}
        onGoToLanding={handleGoToLanding}
      />

      {/* Main Content View */}
      <main id="main-content" className="relative w-full max-w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 flex-1 transition-all duration-300">
        {/* Subtle background ambient lighting */}
        <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl" aria-hidden="true">
          <div
            className="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-indigo-600/15 via-purple-600/15 to-fuchsia-600/15 opacity-35"
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
          />
        </div>

        {oauthSuccessNotice && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-sm text-emerald-300 shadow-lg shadow-emerald-500/10">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span className="font-semibold">{oauthSuccessNotice}</span>
            </div>
            <button
              onClick={() => setOauthSuccessNotice(null)}
              className="text-xs text-emerald-400/70 hover:text-emerald-300 cursor-pointer"
            >
              Ausblenden
            </button>
          </div>
        )}

        {/* View Routing */}
        {currentView === 'landing' || !currentUser ? (
          <LandingPage
            onGoToDashboard={handleGoToDashboard}
            onOpenAuth={(preferredPlan, channel) => {
              setPreferredPlanForAuth(preferredPlan);
              setInitialChannelForAuth(channel);
              setIsAuthModalOpen(true);
            }}
            onSelectPlan={(plan) => {
              setPreferredPlanForAuth(plan);
              setIsAuthModalOpen(true);
            }}
            onStartTrial={handleStartTrial}
            onDirectPreview={(channel) => {
              handleStartLivePreview(channel);
              setCurrentView('dashboard');
            }}
            onBuyClipPackage={handleBuyClipPackage}
            onOpenStripeCheckout={(plan, cycle) => {
              setStripePlan(plan);
              setStripeClipPack(null);
              setStripeBillingCycle(cycle);
              setIsTrialCheckout(Boolean(plan.tierName?.includes('Testphase') || plan.description?.includes('14 Tage')));
              setIsStripeModalOpen(true);
            }}
            onOpenImpressum={() => setIsImpressumOpen(true)}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onOpenTerms={() => setIsTermsOpen(true)}
            onOpenAvv={() => setIsAvvOpen(true)}
            onOpenGdprAudit={() => setIsGdprAuditOpen(true)}
          />
        ) : !currentUser.hasActiveSubscription || currentUser.plan === 'none' ? (
          /* CASE 2: No active subscription -> Paywall */
          <AccessDeniedPaywall
            user={currentUser}
            onActivateSubscription={handleActivateSubscription}
            onLogout={handleLogout}
          />
        ) : (
          /* CASE 3: Full Streamer Dashboard (with SystemConfigurationHub available as modal) */
          <StreamerDashboard
            user={currentUser}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
            onUpgradePlan={handleUpgradePlan}
            onStartTrial={handleStartTrial}
            onOpenImpressum={() => setIsImpressumOpen(true)}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onOpenTerms={() => setIsTermsOpen(true)}
            onOpenAvv={() => setIsAvvOpen(true)}
            onOpenCookieSettings={() => setForceCookieBanner(true)}
            onGoToLanding={handleGoToLanding}
          />
        )}
      </main>

      {/* Floating Quick-Switch Dashboard Button when on Landing Page */}
      {currentView === 'landing' && (
        <button
          type="button"
          onClick={handleGoToDashboard}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 rounded-2xl border border-purple-500/40 bg-[#0c0822]/95 hover:bg-[#180f3d] backdrop-blur-md px-4 py-2.5 text-xs font-bold text-white shadow-2xl shadow-purple-950/80 hover:border-fuchsia-500/70 transition-all duration-200 active:scale-95 cursor-pointer group"
          title="Schnellzugriff: Streamer Dashboard öffnen"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-fuchsia-500 text-white shadow-md shadow-purple-500/30 group-hover:scale-105 transition">
            <LayoutDashboard className="h-4 w-4 text-white" />
          </div>
          <div className="text-left">
            <span className="font-extrabold block text-white leading-none">Dashboard</span>
            <span className="text-[10px] text-fuchsia-400 font-mono block leading-tight">Live anzeigen ↗</span>
          </div>
        </button>
      )}

      {/* Floating Animated Bot Guide: Zero user data leak on landing page */}
      <QuickClickBotGuide
        user={currentView === 'dashboard' ? currentUser : null}
        onNavigateToSection={scrollToSection}
        onOpenAuth={(plan) => {
          setPreferredPlanForAuth(plan);
          setIsAuthModalOpen(true);
        }}
        onOpenChannelSetup={() => {
          if (!currentUser) {
            setIsAuthModalOpen(true);
          } else {
            setIsChannelSetupOpen(true);
          }
        }}
        onOpen2FASetup={() => {
          if (!currentUser) {
            setIsAuthModalOpen(true);
          } else {
            setIs2FAModalOpen(true);
          }
        }}
      />

      {/* Global Minimalist Statutory Legal Footer (Single-Row Glassmorphism) */}
      <footer className="border-t border-purple-500/20 bg-[#070514]/90 backdrop-blur-md py-4 text-xs text-zinc-400 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          {/* Copyright & Brand */}
          <div className="flex items-center gap-2 text-zinc-400 text-xs tracking-tight">
            <span className="font-bold text-zinc-200">© {new Date().getFullYear()} QlipZync</span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-zinc-500 text-[11px] hidden sm:inline">Autonomous Cloud Systems</span>
          </div>

          {/* Legal Interactive Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-medium text-zinc-400">
            <button
              type="button"
              onClick={() => setIsImpressumOpen(true)}
              className="hover:text-[#9146FF] transition cursor-pointer"
            >
              Impressum
            </button>
            <span className="text-zinc-700">•</span>
            <button
              type="button"
              onClick={() => setIsPrivacyOpen(true)}
              className="hover:text-[#9146FF] transition cursor-pointer"
            >
              Datenschutz
            </button>
            <span className="text-zinc-700">•</span>
            <button
              type="button"
              onClick={() => setIsTermsOpen(true)}
              className="hover:text-[#9146FF] transition cursor-pointer"
            >
              AGB
            </button>
            <span className="text-zinc-700">•</span>
            <button
              type="button"
              onClick={() => setIsAvvOpen(true)}
              className="hover:text-[#D946EF] text-fuchsia-400/90 transition cursor-pointer"
            >
              AVV (Art. 28)
            </button>
            <span className="text-zinc-700">•</span>
            <button
              type="button"
              onClick={() => setForceCookieBanner(true)}
              className="hover:text-amber-400 transition cursor-pointer flex items-center gap-1"
            >
              <Cookie className="h-3 w-3 text-amber-400" />
              <span>Cookies</span>
            </button>
          </div>

          {/* Status Pill: 0 MB RAM | ALL SYSTEMS OPERATIONAL */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[11px] font-semibold text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>0 MB RAM | ALL SYSTEMS OPERATIONAL</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        preferredPlan={preferredPlanForAuth}
        initialChannel={initialChannelForAuth}
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenImpressum={() => setIsImpressumOpen(true)}
      />

      {/* 2FA Modal */}
      {currentUser && (
        <TwoFactorAuthModal
          isOpen={is2FAModalOpen}
          onClose={() => setIs2FAModalOpen(false)}
          user={currentUser}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {/* Channel Setup Wizard Modal */}
      {currentUser && (
        <ChannelSetupWizard
          isOpen={isChannelSetupOpen}
          onClose={() => setIsChannelSetupOpen(false)}
          user={currentUser}
          onUpdateUser={handleUpdateUser}
          onOpen2FA={() => setIs2FAModalOpen(true)}
        />
      )}

      {/* System Configuration Hub Modal */}
      {currentUser && isConfigHubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-5xl my-8">
            <SystemConfigurationHub
              user={currentUser}
              onUpdateUser={handleUpdateUser}
              onCompleteAndUnlockDashboard={() => {
                const updated: StreamerUser = {
                  ...currentUser,
                  isFullyConfigured: true,
                  onboardingStep: 4,
                };
                handleUpdateUser(updated);
                setIsConfigHubModalOpen(false);
              }}
              isModalView={true}
              onCloseModal={() => setIsConfigHubModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Clip Packs Upsell Modal */}
      {currentUser && (
        <ClipPacksModal
          isOpen={isClipPacksModalOpen}
          onClose={() => setIsClipPacksModalOpen(false)}
          onBuyPackage={handleBuyClipPackage}
          currentClipsUsed={currentUser.clipsUsedThisMonth}
          currentClipsTotal={currentUser.clipsLimitTotal || 30}
        />
      )}

      {/* Stripe Real-Time Checkout Modal */}
      <StripeCheckoutModal
        isOpen={isStripeModalOpen}
        onClose={() => {
          setIsStripeModalOpen(false);
          setIsTrialCheckout(false);
        }}
        user={currentUser}
        selectedPlan={stripePlan}
        selectedClipPack={stripeClipPack}
        billingCycle={stripeBillingCycle}
        isTrial={isTrialCheckout}
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onSuccess={(result) => {
          setIsStripeModalOpen(false);
          if (currentUser) {
            if (isTrialCheckout) {
              const updated: StreamerUser = {
                ...currentUser,
                hasActiveSubscription: true,
                plan: 'pro',
                clipsLimitTotal: 90,
                apiCallsLimit: 900,
                modularConfig: stripePlan || BASIC_TRIAL_PLAN,
                trialActive: true,
                trialStartedAt: new Date().toISOString(),
                trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                trialPlan: 'pro',
                trialPriceAfterEur: 12.0,
                trialConvertedToPaid: false,
                trialCancelled: false,
              };
              handleUpdateUser(updated);
              setIsTrialCheckout(false);
            } else if (stripePlan) {
              const tierLvl = stripePlan.tierLevel ?? 2;
              const planType: SubscriptionPlan = tierLvl >= 4 ? 'elite' : tierLvl >= 2 ? 'pro' : 'creator';
              const updated: StreamerUser = {
                ...currentUser,
                hasActiveSubscription: true,
                plan: planType,
                clipsLimitTotal: (currentUser.clipsLimitTotal || 0) + stripePlan.clipVolume,
                apiCallsLimit: (currentUser.apiCallsLimit || 0) + stripePlan.clipVolume * 8,
                modularConfig: stripePlan,
              };
              handleUpdateUser(updated);
            } else if (stripeClipPack) {
              const updated: StreamerUser = {
                ...currentUser,
                clipsLimitTotal: (currentUser.clipsLimitTotal || 30) + stripeClipPack.clips,
                extraPacksPurchased: (currentUser.extraPacksPurchased || 0) + stripeClipPack.clips,
              };
              handleUpdateUser(updated);
            }
          }
        }}
      />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner
        forceOpen={forceCookieBanner}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onClose={() => setForceCookieBanner(false)}
      />

      {/* Legal Modals */}
      <ImpressumModal
        isOpen={isImpressumOpen}
        onClose={() => {
          setIsImpressumOpen(false);
          clearModalHash();
        }}
      />
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => {
          setIsPrivacyOpen(false);
          clearModalHash();
        }}
        onOpenAvv={() => setIsAvvOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
      />
      <TermsAndConditionsModal
        isOpen={isTermsOpen}
        onClose={() => {
          setIsTermsOpen(false);
          clearModalHash();
        }}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenImpressum={() => setIsImpressumOpen(true)}
      />
      <AvvAgreementModal
        isOpen={isAvvOpen}
        onClose={() => {
          setIsAvvOpen(false);
          clearModalHash();
        }}
        user={currentUser}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />
      <GdprPrivacyAuditModal
        isOpen={isGdprAuditOpen}
        onClose={() => {
          setIsGdprAuditOpen(false);
          clearModalHash();
        }}
        user={
          currentUser || {
            id: 'guest_visitor',
            name: 'Gast / Besucher',
            channelName: 'guest',
            email: 'guest@quickclick.local',
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
            plan: 'creator',
            clipsUsedThisMonth: 0,
            clipsLimitTotal: 30,
            extraPacksPurchased: 0,
            apiCallsUsed: 0,
            apiCallsLimit: 240,
            referralCount: 0,
            earnedCredits: 0,
            hasActiveSubscription: false,
            role: 'streamer',
            isLive: false,
            streamTitle: '',
            game: '',
            viewers: 0,
            twitchConnected: false,
            googleConnected: false,
            twoFactorAuth: { isEnabled: false, isVerified: false, method: 'email_code' },
          }
        }
        onAccountDeleted={handleLogout}
        onOpenPrivacyPolicy={() => setIsPrivacyOpen(true)}
        onOpenAvvAgreement={() => setIsAvvOpen(true)}
      />
    </div>
  );
}
