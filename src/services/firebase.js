import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Импортируем getStorage

const firebaseConfig = {
  apiKey: "AIzaSyA8OChW3jcdlI547lSRsqoLU75gJZ9PRX0",
  authDomain: "project-a9e46.firebaseapp.com",
  projectId: "project-a9e46",
  storageBucket: "project-a9e46.appspot.com",
  messagingSenderId: "193497908211",
  appId: "1:193497908211:web:fc51c29b68e1c9ede48886",
  measurementId: "G-S41N11WY47"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Инициализируем Firebase Storage
