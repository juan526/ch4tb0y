import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from './index';

const firebaseConfig = {
  credential: cert({
    projectId: config.FIREBASE_PROJECT_ID,
    clientEmail: config.FIREBASE_CLIENT_EMAIL,
    privateKey: config.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);