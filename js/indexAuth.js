// js/indexAuth.js
console.log('[indexAuth] script loaded, auth =', auth);

import { auth, logOut, onAuth } from './firebaseAuth.js?v=20250708-1';

document.addEventListener('DOMContentLoaded', () => {
  const authLink   = document.getElementById('auth-link');
  const signOutBtn = document.getElementById('sign-out-btn');
  const loginModal = document.getElementById('login-modal');
  const closeBtn   = document.getElementById('close-login');

  // Firebase-UI init (compat)
  const ui = new firebaseui.auth.AuthUI(auth);
  const uiConfig = {
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => {
        loginModal.style.display = 'none';
        return false; // do not redirect
      }
    }
  };

  function showLogin() {
    ui.start('#firebaseui-auth-container', uiConfig);
    loginModal.style.display = 'flex';
  }

  /* ---------------- auth state listener ---------------- */
  onAuth(user => {
    if (user) {
      authLink.textContent = `Logged in as: ${user.email}`.toUpperCase();
      authLink.style.cursor = 'default';
      signOutBtn.style.display = 'inline-block';
    } else {
      authLink.textContent = 'LOGIN / CREATE ACCOUNT';
      authLink.style.cursor = 'pointer';
      signOutBtn.style.display = 'none';
    }
  });

  /* ---------------- click handlers ---------------- */
  authLink.addEventListener('click', e => {
    if (!auth.currentUser) {
      e.preventDefault();
      showLogin();
    }
  });

  closeBtn.addEventListener('click', () => loginModal.style.display = 'none');

  signOutBtn.addEventListener('click', async () => {
    await logOut();
    window.location.reload();
  });
});
