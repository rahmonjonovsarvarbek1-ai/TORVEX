

// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyDc-kYemWOasjaYyLc5x0TVDxe93Jls2z8",
  authDomain: "torvex-xxxx.firebaseapp.com", // Bu yerga o'zingning real domainingni qo'y
  projectId: "torvex-xxxx",
  storageBucket: "torvex-xxxx.firebasestorage.app",
  messagingSenderId: "999014412743",
  appId: "1:999014412743:web:1f061f466263c7b86769e2",
  measurementId: "G-GTKR6M4Q5C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Eksportlar - script.js bularni ko'ra olishi shart
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app); 
export { signInWithPopup, onAuthStateChanged };