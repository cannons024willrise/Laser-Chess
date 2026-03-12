/**
 * LOBBY LOGIC: One-Shot RTR Pattern
 * This script ensures we only use a Firebase connection for the 
 * split-second it takes to fetch the match data.
 */

import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const db = getDatabase();
const auth = getAuth();

window.creatematchrequest = async function(event) {
    const playBtn = event.currentTarget;
    const isBlue = document.getElementById('sideToggle').checked;
    const side = isBlue ? 'blue' : 'red';

    // UI Feedback
    playBtn.disabled = true;
    playBtn.innerText = "Requesting...";

    try {
        // 1. Trigger the Cloudflare Worker to handle the heavy lifting
        // This keeps the "matching" logic off the DB and on the Edge.
        const response = await fetch('https://your-worker.workers.dev/api/matchmake', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                uid: auth.currentUser.uid,
                side: side 
            })
        });

        const result = await response.json();

        if (result.matchId) {
            // 2. THE ONE-SHOT READ
            // Instead of .on(), we use .get() to pull the branch once and close the pipe.
            const userMatchRef = ref(db, `users/${auth.currentUser.uid}/activeMatch`);
            
            const snapshot = await get(userMatchRef);
            
            if (snapshot.exists()) {
                const matchData = snapshot.val();
                console.log("Match Found! Transitioning to game...", matchData.matchId);
                // Redirect user to the game board
                window.location.href = `/game.html?id=${matchData.matchId}`;
            } else {
                playBtn.innerText = "Waiting for Opponent...";
                // Logic for polling or re-checking can go here if match wasn't instant
            }
        }

    } catch (error) {
        console.error("Matchmaking error:", error);
        playBtn.disabled = false;
        playBtn.innerText = "Send Match Request";
    }
};
