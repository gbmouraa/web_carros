import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAmz-7dfwAeuCTa2AM3aEIWNBDcg06tJys",
  authDomain: "webcarros-curso.firebaseapp.com",
  projectId: "webcarros-curso",
  storageBucket: "webcarros-curso.firebasestorage.app",
  messagingSenderId: "804739222789",
  appId: "1:804739222789:web:4adeef96c46fa93d34fb6c",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
