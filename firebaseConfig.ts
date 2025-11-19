import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
  apiKey: "AIzaSyDvaWSn_ccDvWSHXXpZMGNSHyn195-gkis",
  authDomain: "insureos-professionals.firebaseapp.com",
  projectId: "insureos-professionals",
  storageBucket: "insureos-professionals.firebasestorage.app",
  messagingSenderId: "346604530936",
  appId: "1:346604530936:web:858d62436d5d53a0c539f0d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
