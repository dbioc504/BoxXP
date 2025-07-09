import { signIn, createAccount } from './firebaseAuth.js';

const createBtn       = document.getElementById('create-account-btn');
const signInBtn       = document.getElementById('sign-in-btn');
const confirmPassCont = document.getElementById('confirm-password-container');
let isCreateMode = false;

createBtn.addEventListener('click', async () => {
  if (!isCreateMode) {
    isCreateMode = true;
    confirmPassCont.style.display = 'block';
    createBtn.textContent = 'Submit Account';
    signInBtn.style.display = 'none';
    return;
  }

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirm  = document.getElementById('confirm-password').value.trim();

  if (!email || !password || !confirm) return alert('Fill in all fields.');
  if (password !== confirm) return alert('Passwords must match.');

  try {
    await createAccount(email, password);
    localStorage.setItem('currentUser', email);
    window.location.href = 'index.html';
  } catch (err) {
    alert(err.message || 'Failed to create account');
  }
});

signInBtn.addEventListener('click', async () => {
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) return alert('Enter both email and password.');

  try {
    await signIn(email, password);
    localStorage.setItem('currentUser', email);
    window.location.href = 'index.html';
  } catch (err) {
    alert(err.message || 'Failed to sign in');
  }
});
