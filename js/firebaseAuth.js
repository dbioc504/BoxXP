const firebaseConfig = {
  apiKey: "AIzaSyDHcPWT5CguvvKwg95-D4ROaMypGu5H4OA",
  authDomain: "boxxp-f4f64.firebaseapp.com",
  projectId: "boxxp-f4f64",
  storageBucket: "boxxp-f4f64.appspot.com",
  messagingSenderId: "274613580349",
  appId: "1:274613580349:web:44b844b91c8a3eb271f054",
  measurementId: "G-N8MJ2DD4QB"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();

export function logOut() {
  return auth.signOut();
}

export function onAuth(cb) {
  return auth.onAuthStateChanged(cb);
}