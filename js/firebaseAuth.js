const firebaseConfig = {
  apiKey: "AIzaSyDHcPWT5CguvvKwg95-D4ROaMypGu5H4OA",
  authDomain: "boxxp-f4f64.firebaseapp.com",
  projectId: "boxxp-f4f64",
  storageBucket: "boxxp-f4f64.appspot.com",
  messagingSenderId: "274613580349",
  appId: "1:274613580349:web:44b844b91c8a3eb271f054",
  measurementId: "G-N8MJ2DD4QB"
};
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence)
    .catch((err) => {
      console.warn("Local persistence unavailable. Falling back to session:")
      return setPersistence(auth, browserSessionPersistence);
    });

export const db = getFirestore(app);
export const onAuth = (cb) => onAuthStateChanged(auth, cb);
export const logOut = () => auth.signOut();