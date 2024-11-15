import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7s064fG_jlo9TnnFfiEg-i-ZNf500aoM",
  authDomain: "fcm-notification-9fd3e.firebaseapp.com",
  projectId: "fcm-notification-9fd3e",
  storageBucket: "fcm-notification-9fd3e.firebasestorage.app",
  messagingSenderId: "616313834359",
  appId: "1:616313834359:web:8fa6f17b58ddc054a56f72",
  measurementId: "G-GEFSG1162R",
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();

    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (err) {
    console.log(err);

    // console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };
