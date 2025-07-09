import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword,
         createUserWithEmailAndPassword, signOut } from "firebase/auth";


export const auth = getAuth();

export async function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

export async function createAccount(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

export function logOut() {
    return signOut(auth);
}