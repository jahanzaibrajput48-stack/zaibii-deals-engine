import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjdwDt21gOjvcLud1_LwTcsFRzRBi3Tms",
  authDomain: "zaibii-deals-engine.firebaseapp.com",
  projectId: "zaibii-deals-engine",
  storageBucket: "zaibii-deals-engine.firebasestorage.app",
  messagingSenderId: "196765351344",
  appId: "1:196765351344:web:db61ca3f01e319c7dbea75",
  measurementId: "G-XQ9ZR67HN0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;