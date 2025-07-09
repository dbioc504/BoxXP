import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword,
         createUserWithEmailAndPassword, signOut,
         onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDHcPWT5CguvvKwg95-D4ROaMypGu5H4OA",
  authDomain: "boxxp-f4f64.firebaseapp.com",
  projectId: "boxxp-f4f64",
  storageBucket: "boxxp-f4f64.appspot.com",
  messagingSenderId: "274613580349",
  appId: "1:274613580349:web:44b844b91c8a3eb271f054",
  measurementId: "G-N8MJ2DD4QB"
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function createAccount(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function logOut() {  return signOut(auth);
}

export { onAuthStateChanged };
