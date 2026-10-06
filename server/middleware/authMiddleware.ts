import { Request, Response, NextFunction } from 'express';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || 'qlipzync',
  });
}

const FIRESTORE_DB_ID =
  process.env.FIRESTORE_DB || 'ai-studio-quickclick-003fd948-cf64-489f-9030-863f460c6c91';
const db = getFirestore(FIRESTORE_DB_ID);

export const BOOTSTRAPPED_ADMIN_EMAIL = 'robert.f.telekom@gmail.com';
export const TITAN_LIFETIME_EMAILS = [
  'sh00trs.tv@gmail.com',
  'twoandahalfeafc@gmail.com',
];

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  role: 'streamer' | 'admin';
  isAdmin: boolean;
  isTitanVip: boolean;
  hasActiveSubscription: boolean;
  subscriptionPlan: 'free' | 'creator' | 'pro' | 'elite' | 'titan';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function isMasterAdmin(email?: string): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase();
}

export function isTitanLifetime(email?: string): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  return TITAN_LIFETIME_EMAILS.some((vip) => vip.toLowerCase() === cleanEmail);
}

/**
 * Stellt sicher, dass das Titan-Abo für VIPs in Firestore hinterlegt ist
 */
export async function syncVipAndAdminStatus(uid: string, email?: string): Promise<{
  isAdmin: boolean;
  isTitanVip: boolean;
  hasActiveSubscription: boolean;
  subscriptionPlan: 'free' | 'creator' | 'pro' | 'elite' | 'titan';
}> {
  const admin = isMasterAdmin(email);
  const titan = isTitanLifetime(email);

  const userRef = db.collection('users').doc(uid);
  const snap = await userRef.get();

  if (admin) {
    await userRef.set(
      {
        uid,
        email: email?.toLowerCase(),
        role: 'admin',
        isAdmin: true,
        hasActiveSubscription: true,
        subscriptionPlan: 'titan',
        subscriptionTierLevel: 5,
        subscriptionStatus: 'active',
        billingCycle: 'lifetime',
        clipBalance: 9999,
        clipsLimitTotal: 9999,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    return { isAdmin: true, isTitanVip: true, hasActiveSubscription: true, subscriptionPlan: 'titan' };
  }

  if (titan) {
    await userRef.set(
      {
        uid,
        email: email?.toLowerCase(),
        role: 'streamer',
        isAdmin: false,
        isTitanVip: true,
        hasActiveSubscription: true,
        subscriptionPlan: 'titan',
        subscriptionTierLevel: 5,
        subscriptionStatus: 'active',
        billingCycle: 'lifetime',
        clipBalance: 600,
        clipsLimitTotal: 600,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    return { isAdmin: false, isTitanVip: true, hasActiveSubscription: true, subscriptionPlan: 'titan' };
  }

  const existingData = snap.data();
  const hasActiveSub = Boolean(existingData?.hasActiveSubscription && existingData?.subscriptionStatus === 'active');
  return {
    isAdmin: false,
    isTitanVip: false,
    hasActiveSubscription: hasActiveSub,
    subscriptionPlan: existingData?.subscriptionPlan || 'free',
  };
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Nicht autorisiert: Bearer-Token fehlt.' });
    return;
  }

  const idToken = authHeader.split('Bearer ')[1].trim();
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken, true);
    const email = decodedToken.email || '';
    const status = await syncVipAndAdminStatus(decodedToken.uid, email);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: status.isAdmin ? 'admin' : 'streamer',
      isAdmin: status.isAdmin,
      isTitanVip: status.isTitanVip,
      hasActiveSubscription: status.hasActiveSubscription,
      subscriptionPlan: status.subscriptionPlan,
    };
    next();
  } catch (error: any) {
    console.error('[AuthMiddleware] Ungültiges Token:', error.message);
    res.status(401).json({ success: false, error: 'Token ungültig oder abgelaufen.' });
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.user) {
    await requireAuth(req, res, () => {
      if (!req.user?.isAdmin) {
        res.status(403).json({ success: false, error: 'Zugriff verweigert: Adminrechte erforderlich.' });
        return;
      }
      next();
    });
    return;
  }
  if (!req.user.isAdmin) {
    res.status(403).json({ success: false, error: 'Zugriff verweigert: Adminrechte erforderlich.' });
    return;
  }
  next();
}

/**
 * Gatekeeper: Erlaubt Kanalverbindungen nur zahlenden Abonnenten, Admins und Titan-Lifetime-VIPs
 */
export async function requireActiveSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.user) {
    await requireAuth(req, res, () => {
      if (!req.user?.hasActiveSubscription) {
        res.status(402).json({
          success: false,
          error: 'Abonnement erforderlich: Bitte buche ein aktives Stripe-Abo, um Kanäle verbinden zu können.',
          code: 'SUBSCRIPTION_REQUIRED',
        });
        return;
      }
      next();
    });
    return;
  }

  if (!req.user.hasActiveSubscription) {
    res.status(402).json({
      success: false,
      error: 'Abonnement erforderlich: Bitte buche ein aktives Stripe-Abo, um Kanäle verbinden zu können.',
      code: 'SUBSCRIPTION_REQUIRED',
    });
    return;
  }
  next();
}

export const verifyAuth = requireAuth;