import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBQ2Dqvr6NVCItRMR-GiiWH2S9wvtigQNE",
  authDomain: "mediatation-6ff23.firebaseapp.com",
  projectId: "mediatation-6ff23",
  storageBucket: "mediatation-6ff23.appspot.com",
  messagingSenderId: "276222150059",
  appId: "1:276222150059:web:54c25820585756149cfeee",
  measurementId: "G-YHL2345Z62"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Always use initializeAuth for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };