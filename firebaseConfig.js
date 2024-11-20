// firebaseConfig.js

import { initializeApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'API Key',
  authDomain: 'nerfwarapp.firebaseapp.com',
  projectId: 'nerfwarapp',
  storageBucket: 'nerfwarapp.firebasestorage.app',
  messagingSenderId: '170020530728',
  appId: '1:170020530728:web:e63aa7cf340f32079fa31d',
  measurementId: 'G-FGCMFN58M9',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
