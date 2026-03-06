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
    // 1. Obtain the JWT (ID Token) from Firebase.
    // Zuplo will use this to verify the user identity server-side.
    const idToken = await user.getIdToken();

    console.log(`Requesting match for color: ${color} (UID: ${user.uid})`);

    // 2. Call your Zuplo Gateway
    // REPLACE 'your-zuplo-url' with your actual Zuplo Gateway URL (e.g., https://laser-chess-api-main-abc123.zuplo.io/join-lobby)
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
        // Store the signed ticket for future Gate B validation
        localStorage.setItem("match_ticket", result.ticket);
        alert(`Match Found! Room ID: ${result.matchId}`);
        // Optional: window.location.href = `../game/game.html?id=${result.matchId}`;
      } else {
        console.log("Searching...", result.message);
        alert("Searching for opponent... You are now in the lobby.");
      }
    } else {
      console.error("Matchmaking error:", result.error || result);
      alert("Matchmaking failed. Check the console for details.");
    }
  } catch (error) {
    console.error("Connection error:", error);
    alert("Could not connect to the matchmaking server.");
  }
}

// --- GATEKEEPER LOGIC ---
onAuthStateChanged(auth, (user) => {
