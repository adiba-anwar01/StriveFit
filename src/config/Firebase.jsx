import { initializeApp } from "firebase/app";

/* ================= AUTH ================= */
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updatePassword
} from "firebase/auth";

/* ================= FIRESTORE (MODERN) ================= */
import {
  initializeFirestore,
  persistentLocalCache,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  Timestamp
} from "firebase/firestore";

/* ================= REALTIME DATABASE ================= */
import {
  getDatabase,
  ref,
  set,
  update,
  remove,
  onValue,
  get,
  child,
} from "firebase/database";

/* ================= STORAGE ================= */
import {
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  uploadBytes,
} from "firebase/storage";


/* ================= FIREBASE CONFIG ================= */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};


/* ================= INITIALIZE APP ================= */
const app = initializeApp(firebaseConfig);


/* ================= SERVICES ================= */

// Auth
const auth = getAuth(app);

// Firestore (Modern offline persistence)
const db = initializeFirestore(app, {
  localCache: persistentLocalCache()
});

// Realtime Database
const database = getDatabase(app);

// Storage
const storage = getStorage(app);


/* ================= EXPORTS ================= */
export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updatePassword,

  db,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  Timestamp,

  database,
  ref,
  set,
  update,
  remove,
  onValue,
  get,
  child,

  storage,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  uploadBytes,
};
