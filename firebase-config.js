// firebase-config.js
// firebase-config.js
// firebase-config.js faylida:
// Firebase kutubxonalarini onlayn ombordan (CDN) yuklab olish
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Skrinshotingda brauzer database.js ni so'rayotgani uchun Realtime Database ulaymiz
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
// Agar senga Firestore (NoSQL) kerak bo'lsa, tepadagi qatorni o'chirib, pastdagini yoq:
// import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDc-kYemWOasjaYyLc5x0TVDxe93Jls2z8",
  authDomain: "torvex-xxxx.firebaseapp.com",
  projectId: "torvex-xxxx",
  storageBucket: "torvex-xxxx.firebasestorage.app",
  messagingSenderId: "999014412743",
  appId: "1:999014412743:web:1f061f466263c7b86769e2",
  measurementId: "G-GTKR6M4Q5C"
};

// Firebase-ni ishga tushirish
const app = initializeApp(firebaseConfig);

// Eksport qilish (script.js faylida ishlatish uchun)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Ma'lumotlar bazasini eksport qilish
export const db = getDatabase(app); 
// Agar Firestore bo'lsa: export const db = getFirestore(app);