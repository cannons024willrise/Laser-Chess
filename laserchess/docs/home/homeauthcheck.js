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

// Global variable so the UID is always ready
let currentUID = null;

// --- MATCHMAKING LOGIC ---
async function startMatchmaking(color) {
  if (!currentUID) {
    console.error("Matchmaking blocked: No UID found yet.");
    alert("Still authenticating... please wait a second.");
    return;
  }

  try {
    const user = auth.currentUser;
    // Fast token retrieval
    const idToken = await user.getIdToken();

    console.log(`Sending Match Request: Color=${color}, UID=${currentUID}`);

    // REPLACE 'your-zuplo-url' with your actual Zuplo URL!
    const response = await fetch("https://your-zuplo-url.zuplo.io/join-lobby", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${idToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ color: color })
    });

    const result = await response.json();

    if (response.ok) {
      if (result.status === "matched") {
        console.log("Match found!", result.matchId);
        localStorage.setItem("match_ticket", result.ticket);
        alert(`Match Found! Room: ${result.matchId}`);
      } else {
        alert("Searching for opponent...");
      }
    } else {
      console.error("Zuplo error:", result);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

// --- GATEKEEPER LOGIC ---
onAuthStateChanged(auth, (user) => {
  if (user && (user.emailVerified || user.providerData[0]?.providerId === 'google.com')) {
    // UID is now globally available
    currentUID = user.uid; 
    console.log("Global UID Set:", currentUID);

    const emailLink = document.getElementById('userEmail');
    if (emailLink) emailLink.textContent = user.email;
    
    document.body.style.display = "block";
  } else {
    currentUID = null;
