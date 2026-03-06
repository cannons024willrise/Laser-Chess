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

// --- MATCHMAKING LOGIC ---
async function startMatchmaking(color) {
  const user = auth.currentUser;
  
  if (!user) {
    alert("You must be logged in to play!");
    return;
  }

  try {
    // 1. Get the JWT (ID Token). 
    // Removed 'true' so it uses the fast cached token unless expired!
    const idToken = await user.getIdToken();

    console.log("Requesting match for color:", color);

    // 2. Call your Zuplo Gateway
    // REPLACE 'your-zuplo-url' with your actual Zuplo Gateway URL
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
        console.log("MATCH FOUND!", result.matchId);
        // Store the signed ticket for Gate B
        localStorage.setItem("match_ticket", result.ticket);
        alert(`Match Found! Room: ${result.matchId}`);
        // window.location.href = `../game/game.html?id=${result.matchId}`;
      } else {
        console.log("Searching...", result.message);
        alert("Added to lobby. Waiting for an opponent...");
      }
    } else {
      console.error("Matchmaking error:", result.error);
      alert("Matchmaking failed. Check console.");
    }
  } catch (error) {
    console.error("Connection error:", error);
    alert("Could not connect to the matchmaking server.");
  }
}

// --- GATEKEEPER LOGIC ---
onAuthStateChanged(auth, (user) => {
  if (user && (user.emailVerified || user.providerData[0]?.providerId === 'google.com')) {
    // 1. Set user email/UID in header
    const emailLink = document.getElementById('userEmail');
    if (emailLink) emailLink.textContent = user.email;
    
    // 2. Reveal the body
    document.body.style.display = "block";
  } else {
    // 3. Not logged in or not verified
    window.location.replace("../../login/login.html");
  }
});

// --- ONE-TIME EVENT LISTENERS ---
// Attached safely outside the observer so they don't multiply!
document.getElementById('btnPlayRed')?.addEventListener('click', () => startMatchmaking('red'));
document.getElementById('btnPlayBlue')?.addEventListener('click', () => startMatchmaking('blue'));

// Sign out listener
document.getElementById('signOutBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  signOut(auth).then(() => {
    window.location.replace("../../login/login.html");
  });
});
