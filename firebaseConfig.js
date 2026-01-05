import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCAa9_EdO1a0LYMxdQVb8b3IeAEa2Yeix4",
  authDomain: "euro2024-d2e7d.firebaseapp.com",
  databaseURL: "https://euro2024-d2e7d.firebaseio.com",
  projectId: "euro2024-d2e7d",
  storageBucket: "euro2024-d2e7d.appspot.com",
  messagingSenderId: "542315755419",
  appId: "1:542315755419:web:794f8f132d38ebcf23d33e",
  //measurementId: "G-measurement-id",
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const storage = getStorage(app);
export const db = getFirestore(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
