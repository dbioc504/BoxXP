const firebaseConfig = {
  apiKey: "AIzaSyDHcPWT5CguvvKwg95-D4ROaMypGu5H4OA",
  authDomain: "boxxp-f4f64.firebaseapp.com",
  projectId: "boxxp-f4f64",
  storageBucket: "boxxp-f4f64.appspot.com",
  messagingSenderId: "274613580349",
  appId: "1:274613580349:web:44b844b91c8a3eb271f054",
  measurementId: "G-N8MJ2DD4QB"
};
// at the top of firebaseAuth.js
import firebase from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";
import "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";
import "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";

const app  = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db   = firebase.firestore();

// now set persistence on the compat auth
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .catch(err => {
      console.warn("Local persistence unavailable, falling back:", err);
      return auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
    });

export const onAuth = cb => auth.onAuthStateChanged(cb);
export const logOut  = () => auth.signOut();
