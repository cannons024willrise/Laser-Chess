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

// --- SIGN OUT LOGIC ---
// We attach the listener directly to the ID from your HTML
const signOutBtn = document.getElementById('signOutBtn');
if (signOutBtn) {
  signOutBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Stop the '#' link from jumping the page
    console.log("Sign Out Button clicked. Triggering Firebase SignOut...");
    
    signOut(auth)
      .then(() => {
        console.log("Successfully signed out of Firebase.");
        window.location.replace("../../login/login.html");
      })
      .catch((error) => {
        console.error("Error during sign out:", error);
      });
  });
} else {
  console.error("Could not find the 'signOutBtn' element in the HTML.");
}

// --- MATCHMAKING STUB ---
// Keeping this here so your play button doesn't break, 
// but focusing only on the event connection.
const playBtn = document.getElementById('btnSendRequest');
if (playBtn) {
  playBtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("Match request button clicked for UID:", currentUID);
    // Add your matchmaking fetch here when ready
  });
}
