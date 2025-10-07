// src/firebase/config.ts (FRONTEND)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBb3mSePtVI53T_4b-axHQ4nMlHkh47gHc",
    authDomain: "capstone-589bb.firebaseapp.com",
    databaseURL: "https://capstone-589bb-default-rtdb.firebaseio.com",
    projectId: "capstone-589bb",
    storageBucket: "capstone-589bb.firebasestorage.app",
    messagingSenderId: "416429122843",
    appId: "1:416429122843:web:c0e0d20d1bad201e83dfbe",
    measurementId: "G-Z34Y11XBYT"
  };
// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios que usarás
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;