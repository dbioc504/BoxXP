import { auth, logOut, onAuthStateChanged } from './firebaseAuth.js';

document.addEventListener('DOMContentLoaded', () => {
  const authLink   = document.getElementById('auth-link');
  const signOutBtn = document.getElementById('sign-out-btn');
  const loginModal = document.getElementById('login-modal');
  const closeBtn   = document.getElementById('close-login');

  let ui;

  function showLogin() {
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(auth);
    }
    ui.start('#firebaseui-auth-container', {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInSuccessWithAuthResult: () => {
          hideLogin();
          return false;
        }
      }
    });
    loginModal.style.display = 'flex';
  }

  function hideLogin() {
    loginModal.style.display = 'none';
  }

  onAuthStateChanged((user) => {
    if (user) {
      authLink.textContent = `Logged in as: ${user.email}`.toUpperCase();
      authLink.removeAttribute('href');
      authLink.style.cursor = 'default';
      signOutBtn.style.display = 'inline-block';
    } else {
      authLink.textContent = 'LOGIN / CREATE ACCOUNT';
      authLink.removeAttribute('href');
      authLink.style.cursor = 'pointer';
      signOutBtn.style.display = 'none';
    }
  });

  authLink.addEventListener('click', (e) => {
    if (!auth.currentUser) {
      e.preventDefault();
      showLogin();
    }
  });

  closeBtn.addEventListener('click', hideLogin);

  signOutBtn.addEventListener('click', async () => {
    await logOut();
    window.location.reload();
  });
});
