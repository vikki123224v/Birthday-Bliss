import admin from 'firebase-admin';

let db = null;

export function getAdminDb() {
  if (db) return db;

  if (!admin.apps.length) {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountKey) {
      try {
        const parsedKey = JSON.parse(serviceAccountKey);
        admin.initializeApp({
          credential: admin.credential.cert(parsedKey),
          projectId: parsedKey.project_id || process.env.VITE_FIREBASE_PROJECT_ID
        });
        console.log('🔥 Initialized Firebase Admin from service account key');
      } catch (e) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON:', e.message);
        throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY JSON format');
      }
    } else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
      });
      console.log('🔥 Initialized Firebase Admin from client email + private key');
    } else {
      // Fallback for local emulator or application default credentials
      admin.initializeApp({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'birthday-bliss-d5acb'
      });
      console.warn('⚠️ Initialized Firebase Admin without explicit credentials (default/emulator mode)');
    }
  }

  db = admin.firestore();
  return db;
}
