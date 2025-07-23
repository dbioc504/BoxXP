import { auth, db } from "./firebaseAuth.js";
import {
    doc,            // points at one document
    getDoc,         // read once
    setDoc,         // write or merge
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";  // or the CDN URL if you use option 1 earlier

import { STARTER_DATA } from "./data.js";

export async function fetchUserData() {
    const uid     = auth.currentUser.uid;
    const docRef  = doc(db, "users", uid);      // modular path
    const snap    = await getDoc(docRef);

    if (!snap.exists()) {
        await setDoc(docRef, STARTER_DATA);
        return structuredClone(STARTER_DATA);
    }

    const data = snap.data() || {};

    // merge any missing arrays with starters
    const merged = {
        skills:   Array.isArray(data.skills)   && data.skills.length   ? data.skills   : structuredClone(STARTER_DATA.skills),
        workouts: Array.isArray(data.workouts) && data.workouts.length ? data.workouts : structuredClone(STARTER_DATA.workouts),
        combos:   Array.isArray(data.combos)   && data.combos.length   ? data.combos   : structuredClone(STARTER_DATA.combos),
    };

    // if you filled gaps, write them back
    if (merged !== data) await setDoc(docRef, merged, { merge: true });

    return merged;
}

export function saveUserData(data) {
    const uid    = auth.currentUser.uid;
    const docRef = doc(db, "users", uid);
    return setDoc(docRef, data);
}
