// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArzPAcNlT1RJzIx7zCk4PbbHn71OAOQL8",
  authDomain: "mac-wayne-site.firebaseapp.com",
  projectId: "mac-wayne-site",
  storageBucket: "mac-wayne-site.appspot.com", // Corrected: .appspot.com is common for storageBucket
  messagingSenderId: "1042802261560",
  appId: "1:1042802261560:web:0adf8bde78a5292f86f0cd",
  measurementId: "G-8XP4MRDX35"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const firestore = getFirestore(app);
let analytics;

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, firestore, analytics, firebaseConfig };
