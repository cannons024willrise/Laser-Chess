// Inside lobby.js
async function creatematchrequest(event) {
    const isBlue = document.getElementById('sideToggle').checked;
    const playBtn = event.currentTarget;
    
    // 1. Visual Feedback (Instant feel)
    playBtn.disabled = true;
    playBtn.innerText = "Finding Strategist...";

    // 2. The Worker Handshake
    const response = await fetch('https://your-laser-chess-worker.pages.dev/api/matchmake', {
        method: 'POST',
        body: JSON.stringify({ 
            side: isBlue ? 'blue' : 'red',
            uid: getAuth().currentUser.uid 
        })
    });

    const { matchId } = await response.json();

    // 3. TRIGGER THE REAL-TIME READ
    // Now that we have a matchId, we open the connection slot (1/100)
    startRealtimeSync(matchId);
}
