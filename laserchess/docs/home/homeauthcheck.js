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
let currentUID = null;

// --- GATEKEEPER ---
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

// --- SIGN OUT (The Fix) ---
const signOutBtn = document.getElementById('signOutBtn');
if (signOutBtn) {
  signOutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("Attempting Sign Out...");
    signOut(auth)
      .then(() => {
        console.log("Sign Out Success");
        window.location.replace("../../login/login.html");
      })
      .catch((error) => console.error("Sign Out Error:", error));
  });
}

// --- MATCHMAKING ---
async function startMatchmaking(color) {
  if (!currentUID) return;
  try {
    const idToken = await auth.currentUser.getIdToken();
    const response = await fetch("https://your-zuplo-url.zuplo.io/join-lobby", {
      method: "POST",
      headers: { "Authorization": `Bearer ${idToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ color: color })
    });
    const result = await response.json();
    console.log("Result:", result);
  } catch (err) {
    console.error("Matchmaking Error:", err);
  }
}

document.getElementById('btnPlayRed')?.addEventListener('click', () => startMatchmaking('red'));
document.getElementById('btnPlayBlue')?.addEventListener('click', () => startMatchmaking('blue'));
