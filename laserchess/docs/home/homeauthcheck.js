import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBuT7P1iTdXcZW-y05DX-kseuLrPGmaWSs",
  authDomain: "laserchess-web-free.firebaseapp.com",
  projectId: "laserchess-web-free",
  storageBucket: "laserchess-web-free.firebasestorage.app",
  messagingSenderId: "887464510754",
  appId: "1:887464510754:web:aee6938681543602a4517b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Gatekeeper logic
onAuthStateChanged(auth, (user) => {
  if (user && (user.emailVerified || user.providerData[0]?.providerId === 'google.com')) {
    // 1. Set user email in header
    const emailLink = document.getElementById('userEmail');
    if (emailLink) emailLink.textContent = user.email;

    // 2. Reveal the body
    document.body.style.display = "block";
  } else {
    // 3. Not logged in or not verified
    window.location.replace("../../login/login.html");
  }
});

// Sign out listener
document.getElementById('signOutBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  signOut(auth).then(() => {
    window.location.replace("../../login/login.html");
  });
});
