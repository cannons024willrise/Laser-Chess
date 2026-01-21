window.creatematchrequest = async () => {
  const user = auth.currentUser;
  if (!user) return alert("Please log in first!");

  const btn = document.querySelector('.play-now-btn');
  const selectedColor = document.getElementById('sideToggle').checked ? "blue" : "red";
  
  btn.innerText = "Searching...";
  btn.disabled = true;

  const payload = {
    uid: user.uid,
    time: Date.now(),
    type: "classic",
    color: selectedColor
  };

  try {
    await fetch("https://laserchessnexus-matchmanager-v-alpha.later5143.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // Listen for the matchId to be written to YOUR user node
    const matchRef = ref(db, `users/${user.uid}/matchId`);
    onValue(matchRef, (snapshot) => {
      const matchId = snapshot.val();
      if (matchId) {
        off(matchRef); // Unsubscribe
        console.log("Match established:", matchId);
        // Change to your game page
        window.location.href = `game.html?matchId=${matchId}`;
      }
    });

  } catch (error) {
    console.error("Matchmaking failed:", error);
    btn.disabled = false;
    btn.innerText = "Send Match Request";
  }
};
