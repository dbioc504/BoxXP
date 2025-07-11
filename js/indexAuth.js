// js/indexAuth.js
import {auth, logOut, onAuth} from './firebaseAuth.js';

console.log('[indexAuth] script loaded, auth =', auth);


document.addEventListener('DOMContentLoaded', () => {
    const authLink = document.getElementById('auth-link');
    const signOutBtn = document.getElementById('sign-out-btn');
    const loginModal = document.getElementById('login-modal');
    const closeBtn = document.getElementById('close-login');

    // Firebase-UI init (compat)
    const ui = new firebaseui.auth.AuthUI(auth);
    const uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
            {
                provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                signInMethod: firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
                requireDisplayName: false
            },
            firebase.auth.GithubAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccessWithAuthResult: () => {
                loginModal.style.display = 'none';
                return false;
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
