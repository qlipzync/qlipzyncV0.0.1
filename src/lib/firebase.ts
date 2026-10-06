import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { StreamerUser } from '../types/pipeline';
import { FIREBASE_PUBLIC_CONFIG, GCP_PROJECT_METADATA } from '../config/quickclick-config';

export const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(FIREBASE_PUBLIC_CONFIG);

export const auth = getAuth(app);
export const db = getFirestore(app, GCP_PROJECT_METADATA.databaseId);

export async function syncUserToFirestore(user: StreamerUser): Promise<void> {
  if (!user || !user.id) return;
  try {
    const userRef = doc(db, 'streamers', user.id);
    await setDoc(userRef, { ...user, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Firestore sync note (fallback to local state):', err);
  }
}

export async function loadUserFromFirestore(userId: string): Promise<StreamerUser | null> {
  if (!userId) return null;
  try {
    const userRef = doc(db, 'streamers', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as StreamerUser;
    }
    return null;
  } catch (err) {
    console.warn('Firestore load note:', err);
    return null;
  }
}

export function subscribeToUserDocument(
  userId: string,
  onUpdate: (user: StreamerUser) => void
): () => void {
  if (!userId) return () => {};
  try {
    const userRef = doc(db, 'streamers', userId);
    return onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as StreamerUser);
      }
    });
  } catch (err) {
    console.warn('Firestore subscription fallback:', err);
    return () => {};
  }
}

export function subscribeToAuthState(onUserChanged: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, onUserChanged);
}

export async function logOutFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Firebase signOut note:', err);
  }
}
