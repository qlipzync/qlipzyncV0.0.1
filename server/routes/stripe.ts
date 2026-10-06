import { Router } from 'express';
import Stripe from 'stripe';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import {
  STRIPE_OFFICIAL_TIERS,
  CLIP_PACKAGES,
  FREE_STARTER_PLAN,
  BASIC_TRIAL_PLAN,
  findTierByPriceId,
  findTierByLevel,
  getUnifiedPlanPrice,
} from '../../src/config/stripeUnifiedConfig.js';
import { isTitanLifetime, isMasterAdmin } from '../middleware/authMiddleware.js';

export const stripeRouter = Router();

const FIRESTORE_DB_ID =
  process.env.FIRESTORE_DB || 'ai-studio-quickclick-003fd948-cf64-489f-9030-863f460c6c91';
const db = getFirestore(FIRESTORE_DB_ID);

// Lazy Stripe initialization
let stripeClient: Stripe | null = null;
export function getStripe(): Stripe | null {
  if (!stripeClient && process.env.STRIPE_SECRET_KEY) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
}

// In-memory audit trail for Stripe events (Zero-Mock: starts empty)
export interface StripeWebhookLog {
  id: string;
  type: string;
  createdAt: string;
  livemode: boolean;
  objectId?: string;
  objectType?: string;
  details: string;
  status: 'acknowledged' | 'processed' | 'warning' | 'error';
}

const recentStripeEvents: StripeWebhookLog[] = [];

const processedWebhookIds = new Set<string>();

export function recordStripeEvent(log: StripeWebhookLog) {
  recentStripeEvents.unshift(log);
  if (recentStripeEvents.length > 50) {
    recentStripeEvents.pop();
  }
}

// -------------------------------------------------------------------------
// POST /api/stripe/checkout (Canonical) & /api/stripe/create-checkout-session (Alias)
// -------------------------------------------------------------------------
stripeRouter.post(['/checkout', '/create-checkout-session'], async (req, res) => {
  try {
    const {
      userId,
      userEmail,
      itemType,
      planName,
      tierLevel,
      clipVolume,
      amountEur,
      billingCycle,
      stripePriceId,
      stripeProductId,
      stripeMetadataCode,
      returnUrl,
    } = req.body;

    const matchedTier = stripePriceId
      ? findTierByPriceId(stripePriceId)
      : tierLevel
      ? findTierByLevel(tierLevel)
      : null;

    const effectiveTierLevel = matchedTier?.tierLevel || (tierLevel ? Number(tierLevel) : 2);
    const effectiveClipVolume = matchedTier?.clipVolume || (clipVolume ? Number(clipVolume) : 90);
    const effectiveProductId = stripeProductId || matchedTier?.productId || '';
    const effectivePriceId = stripePriceId || matchedTier?.priceId || '';
    const effectiveMetadataCode = stripeMetadataCode || matchedTier?.tierCode || 'abo2';
    const isAnnual = billingCycle === 'annual';

    const calculatedAmount = matchedTier
      ? isAnnual
        ? matchedTier.annualPriceEur
        : matchedTier.monthlyPriceEur
      : (amountEur || 3);
    const isTitan = isTitanLifetime(userEmail);
    const finalAmount = isTitan ? 0 : calculatedAmount;

    const stripe = getStripe();
    if (!stripe) {
      return res.status(500).json({
        error: 'ERROR: STRIPE_SECRET_KEY fehlt zwingend. Ausführung abgebrochen. Bitte den echten Wert bereitstellen.',
      });
    }

    // In annual mode, we charge the discounted annual total for the subscription cycle
    // For Titan Lifetime VIPs, amount is 0 EUR setup
    const lineItem = effectivePriceId && !isAnnual && !isTitan
      ? {
          price: effectivePriceId,
          quantity: 1,
        }
      : {
          price_data: {
            currency: 'eur',
            product_data: {
              name: isTitan
                ? 'QlipZync: Titan Lifetime VIP (600 Clips/Monat)'
                : planName || `${matchedTier?.displayName || `Stufe ${effectiveTierLevel}`} (${effectiveClipVolume} Clips)`,
              description: isTitan
                ? 'Kostenfreies Titan-Abonnement auf Lebenszeit (600 Clips/Monat, Zero-Storage)'
                : matchedTier?.description || `Autonome Twitch-Verarbeitung: ${effectiveClipVolume} Clips/Monat (${isAnnual ? 'Jährlich (-20%)' : 'Monatlich'})`,
            },
            unit_amount: Math.round(finalAmount * 100),
            ...(itemType === 'subscription' && !isTitan
              ? {
                  recurring: {
                    interval: (isAnnual ? 'year' : 'month') as 'year' | 'month',
                  },
                }
              : {}),
          },
          quantity: 1,
        };

    const session = await stripe.checkout.sessions.create({
      mode: isTitan ? 'setup' : itemType === 'subscription' ? 'subscription' : 'payment',
      customer_email: userEmail || undefined,
      client_reference_id: userId || 'streamer_guest',
      ...(isTitan ? {} : { line_items: [lineItem] }),
      metadata: {
        userId: userId || 'streamer_guest',
        userEmail: userEmail || '',
        itemType: isTitan ? 'titan_lifetime_setup' : itemType || 'subscription',
        tierLevel: isTitan ? '5' : String(effectiveTierLevel),
        tierCode: isTitan ? 'titan' : effectiveMetadataCode,
        clipVolume: isTitan ? '600' : String(effectiveClipVolume),
        billingCycle: isTitan ? 'lifetime' : isAnnual ? 'annual' : 'monthly',
        stripeProductId: effectiveProductId,
        stripePriceId: effectivePriceId,
        stripeMetadataCode: isTitan ? 'titan' : effectiveMetadataCode,
      },
      success_url: `${returnUrl || 'http://localhost:3000'}?session_id={CHECKOUT_SESSION_ID}&payment=success`,
      cancel_url: `${returnUrl || 'http://localhost:3000'}?payment=cancelled`,
    });

    return res.json({
      sessionId: session.id,
      url: session.url,
      live: true,
    });
  } catch (err: any) {
    console.error('Stripe session creation error:', err);
    return res.status(500).json({ error: err.message || 'Fehler bei Stripe Checkout Initialisierung' });
  }
});

// -------------------------------------------------------------------------
// GET /api/stripe/products
// -------------------------------------------------------------------------
stripeRouter.get('/products', (_req, res) => {
  return res.json({
    status: 'ok',
    currency: 'EUR',
    products: Object.values(STRIPE_OFFICIAL_TIERS).map((tier) => ({
      tierLevel: tier.tierLevel,
      tierCode: tier.tierCode,
      name: tier.name,
      displayName: tier.displayName,
      monthlyPriceEur: tier.monthlyPriceEur,
      annualPriceEur: tier.annualPriceEur,
      annualMonthlyEquivalentEur: tier.annualMonthlyEquivalentEur,
      productId: tier.productId,
      priceId: tier.priceId,
      metadataKey: tier.metadataKey,
      metadataVal: tier.metadataVal,
      description: tier.description,
      channelsDescription: tier.channelsDescription,
      resolution: tier.resolution,
      aiFeatures: tier.aiFeatures,
      clipVolume: tier.clipVolume,
      dailyClips: tier.dailyClips,
      socialChannelsCount: tier.socialChannelsCount,
      adminMarginPercent: tier.adminMarginPercent,
    })),
    freeStarter: FREE_STARTER_PLAN,
    trialPlan: BASIC_TRIAL_PLAN,
    clipPackages: CLIP_PACKAGES,
  });
});

// -------------------------------------------------------------------------
// POST /api/stripe/webhook
// -------------------------------------------------------------------------
stripeRouter.post(['/webhook', '/'], async (req: any, res) => {
  const sig = req.headers['stripe-signature'] as string;
  if (!sig) {
    return res.status(400).send('Missing stripe-signature header');
  }
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = getStripe();

  let event: any;

  if (stripe && webhookSecret && sig && req.rawBody) {
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } catch (err: any) {
      console.error('⚠️ Stripe Webhook Signaturprüfung fehlgeschlagen:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    event = req.body;
  }

  if (!event || !event.type) {
    return res.status(400).json({ error: 'Kein gültiges Stripe Event übermittelt' });
  }

  const type = event.type;
  const eventId = event.id || `evt_sim_${Date.now()}`;
  const livemode = Boolean(event.livemode);
  const dataObj = event.data?.object || event.related_object || {};

  // Replay attack prevention: check duplicate event ID
  if (eventId && processedWebhookIds.has(`stripe_${eventId}`)) {
    return res.status(200).json({ received: true, note: 'Duplicate Stripe webhook event ignored' });
  }
  processedWebhookIds.add(`stripe_${eventId}`);
  if (processedWebhookIds.size > 1000) {
    const first = processedWebhookIds.values().next().value;
    if (first) processedWebhookIds.delete(first);
  }

  console.log(`💳 [Stripe Webhook] Empfangen: '${type}' (ID: ${eventId})`);

  let logDetails = '';
  let logStatus: 'acknowledged' | 'processed' | 'warning' | 'error' = 'acknowledged';

  switch (type) {
    case 'setup_intent.created': {
      const setupIntentId = dataObj.id || 'seti_setup';
      const customerId = dataObj.customer || 'cus_creator';
      const usage = dataObj.usage || 'off_session';
      const status = dataObj.status || 'requires_payment_method';
      logDetails = `SetupIntent ${setupIntentId} erstellt für Kunde ${customerId} (Usage: ${usage}, Status: ${status})`;
      logStatus = 'processed';
      break;
    }
    case 'setup_intent.succeeded': {
      const setupIntentId = dataObj.id;
      const paymentMethodId = dataObj.payment_method;
      logDetails = `SetupIntent ${setupIntentId} erfolgreich! Zahlungsmethode ${paymentMethodId} hinterlegt.`;
      logStatus = 'processed';
      break;
    }
    case 'checkout.session.completed': {
      const userId = dataObj.metadata?.userId || 'streamer';
      const planName = dataObj.metadata?.planName || 'QuickClick Plan';
      const isTitanSetup = dataObj.metadata?.itemType === 'titan_lifetime_setup';
      logDetails = `Checkout abgeschlossen für User ${userId}: ${planName}`;
      logStatus = 'processed';

      if (userId && userId !== 'streamer_guest') {
        const userRef = db.collection('users').doc(userId);
        const subPlan = isTitanSetup ? 'titan' : (dataObj.metadata?.tierCode || 'pro');
        const tierLevel = isTitanSetup ? 5 : Number(dataObj.metadata?.tierLevel || 2);
        const clipsLimit = isTitanSetup ? 600 : Number(dataObj.metadata?.clipVolume || 90);

        userRef.set(
          {
            hasActiveSubscription: true,
            subscriptionStatus: 'active',
            subscriptionPlan: subPlan,
            subscriptionTierLevel: tierLevel,
            clipsLimitTotal: clipsLimit,
            stripeCustomerId: dataObj.customer || undefined,
            stripeSubscriptionId: dataObj.subscription || undefined,
            stripeSetupIntentId: dataObj.setup_intent || undefined,
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        ).catch((err) => console.warn('[Stripe Webhook User Update Error]', err.message));

        const invoiceId = `inv_${dataObj.id || Date.now()}`;
        userRef.collection('invoices').doc(invoiceId).set({
          id: invoiceId,
          userId,
          stripeInvoiceId: dataObj.invoice || dataObj.id,
          amountCents: dataObj.amount_total || 0,
          currency: dataObj.currency || 'eur',
          planName: isTitanSetup ? 'Titan Lifetime VIP (0 € Setup)' : planName,
          status: 'paid',
          createdAt: FieldValue.serverTimestamp(),
        }).catch((err) => console.warn('[Stripe Webhook Invoice Error]', err.message));
      }
      break;
    }
    case 'payment_intent.succeeded': {
      const amount = dataObj.amount ? (dataObj.amount / 100).toFixed(2) + ' €' : 'Zahlung bestätigt';
      logDetails = `Zahlung erfolgreich: ${amount} (PI: ${dataObj.id})`;
      logStatus = 'processed';
      break;
    }
    case 'invoice.payment_succeeded': {
      logDetails = `Rechnung ${dataObj.id} bezahlt (${dataObj.customer_email || 'Kunde'})`;
      logStatus = 'processed';
      break;
    }
    default: {
      logDetails = `Event '${type}' empfangen und quittiert`;
      logStatus = 'acknowledged';
      break;
    }
  }

  let isoCreatedAt = new Date().toISOString();
  if (event.created) {
    if (typeof event.created === 'number') {
      const timestampMs = event.created < 1e11 ? event.created * 1000 : event.created;
      isoCreatedAt = new Date(timestampMs).toISOString();
    } else if (typeof event.created === 'string') {
      const parsed = new Date(event.created);
      if (!isNaN(parsed.getTime())) {
        isoCreatedAt = parsed.toISOString();
      }
    }
  }

  recordStripeEvent({
    id: eventId,
    type,
    createdAt: isoCreatedAt,
    livemode,
    objectId: event.related_object?.id || dataObj.id,
    objectType: event.related_object?.type || (event.object ? String(event.object) : undefined),
    details: logDetails,
    status: logStatus,
  });

  return res.status(200).json({
    received: true,
    eventId,
    eventType: type,
    status: logStatus,
    message: logDetails,
  });
});

// -------------------------------------------------------------------------
// GET /api/stripe/webhook/events and GET /api/stripe/events
// -------------------------------------------------------------------------
stripeRouter.get(['/webhook/events', '/events'], (_req, res) => {
  res.json({
    status: 'ok',
    totalCount: recentStripeEvents.length,
    events: recentStripeEvents,
  });
});
