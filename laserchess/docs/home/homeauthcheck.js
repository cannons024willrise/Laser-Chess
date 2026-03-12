// laserchess/docs/home/homeauthcheck.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBuT7P1iTdXcZW-y05DX-kseuLrPGmaWSs",
  authDomain: "laserchess-web-free.firebaseapp.com",
  projectId: "laserchess-web-free",
  storageBucket: "laserchess-web-free.firebasestorage.app",
  messagingSenderId: "887464510754",
  appId: "1:887464510754:web:aee6938681543602a4517b",
  databaseURL: "https://laserchess-web-free-default-rtdb.firebaseio.com/"
};

// EXPORT these so lobby.js can see them
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

let currentUID = null;

onAuthStateChanged(auth, (user) => {
  if (user && (user.emailVerified || user.providerData[0]?.providerId === 'google.com')) {
    currentUID = user.uid; 
    console.log("Global UID Set:", currentUID);
    const emailLink = document.getElementById('userEmail');
    if (emailLink) emailLink.textContent = user.email;
    document.body.style.display = "block";
  } else {
    currentUID = null;
    if (!window.location.pathname.includes("login.html")) {
        window.location.replace("../../login/login.html");
    }
  }
});

// Sign Out Logic...
const signOutBtn = document.getElementById('signOutBtn');
if (signOutBtn) {
  signOutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth).then(() => window.location.replace("../../login/login.html"));
  });
}
