import { auth, logOut, onAuthStateChanged } from './firebaseAuth.js';

document.addEventListener('DOMContentLoaded', () => {
  const authLink   = document.getElementById('auth-link');
  const signOutBtn = document.getElementById('sign-out-btn');

  onAuthStateChanged(auth, (user) => {
    if (user) {
      authLink.textContent = `Logged in as: ${user.email}`.toUpperCase();
      authLink.removeAttribute('href');
      authLink.style.cursor = 'default';
      signOutBtn.style.display = 'inline-block';
    } else {
      authLink.textContent = 'LOGIN / CREATE ACCOUNT';
      authLink.href = 'login.html';
      signOutBtn.style.display = 'none';
    }
  });

  signOutBtn.addEventListener('click', async () => {
    await logOut();
    localStorage.removeItem('currentUser');
    window.location.reload();
  });
});
