import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD82aHXPfjkfMuTL9EoxlbT2Xd0EPnFQmw",
  authDomain: "login-system-6cb85.firebaseapp.com",
  databaseURL: "https://login-system-6cb85-default-rtdb.firebaseio.com",
  projectId: "login-system-6cb85",
  storageBucket: "login-system-6cb85.firebasestorage.app",
  messagingSenderId: "624099027795",
  appId: "1:624099027795:web:1240047c70aaad22e6cfa6",
  measurementId: "G-SRM4JFHTJN"
};

// Firebase'in zaten initialize edilip edilmediğini kontrol et
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);