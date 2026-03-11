// firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDc-kYemWOasjaYyLc5x0TVDxe93Jls2z8",
  authDomain: "torvex-xxxx.firebaseapp.com",
  projectId: "torvex-xxxx",
  storageBucket: "torvex-xxxx.firebasestorage.app",
  messagingSenderId: "999014412743",
  appId: "1:999014412743:web:1f061f466263c7b86769e2",
  measurementId: "G-GTKR6M4Q5C"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();