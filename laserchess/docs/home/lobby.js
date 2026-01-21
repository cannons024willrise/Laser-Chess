import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, onValue, off } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// We attach the function to window so the HTML onclick="creatematchrequest()" can find it
window.creatematchrequest = async () => {
  // 1. Get instances INSIDE the function to avoid ReferenceErrors
  const auth = getAuth();
  const db = getDatabase();
  const user = auth.currentUser;

  if (!user) {
    alert("Please sign in or wait a moment for the connection to establish.");
    return;
  }

  const btn = document.querySelector('.play-now-btn');
  const selectedColor = document.getElementById('sideToggle').checked ? "blue" : "red";
  
  // UI Feedback
  btn.innerText = "Searching...";
  btn.disabled = true;

  const payload = {
    uid: user.uid,
    time: Date.now(),
    type: "standard", 
    color: selectedColor
  };

  try {
    // 2. Trigger the Worker
    await fetch("https://laserchessnexus-matchmanager-v-alpha.later5143.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // 3. Listen for the matchId
    const matchRef = ref(db, `users/${user.uid}/matchId`);
    onValue(matchRef, (snapshot) => {
      const matchId = snapshot.val();
      if (matchId) {
        off(matchRef); // Clean up listener
        window.location.href = `game.html?matchId=${matchId}`;
      }
    });

  } catch (error) {
    console.error("Matchmaking error:", error);
    btn.disabled = false;
    btn.innerText = "Send Match Request";
  }
};
