// lobby.js - Integrated Theme & Matchmaking
import { db, auth } from "./homeauthcheck.js";
import { ref, get, onValue, off } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// --- UI THEME LOGIC ---
const sideToggle = document.getElementById('sideToggle');
const mainActionBtn = document.getElementById('mainActionBtn');

function updateButtonTheme() {
    if (sideToggle.checked) {
        mainActionBtn.classList.remove('red-mode');
        mainActionBtn.classList.add('blue-mode');
    } else {
        mainActionBtn.classList.remove('blue-mode');
        mainActionBtn.classList.add('red-mode');
    }
}

// Initialize theme on load and on toggle change
if (sideToggle) {
    sideToggle.addEventListener('change', updateButtonTheme);
    updateButtonTheme(); // Run once to set initial state
}

// --- MATCHMAKING LOGIC ---
window.handleMatchmaking = async function() {
    const user = auth.currentUser;
    if (!user) return; 

    // Determine color based on toggle state
    const selectedColor = sideToggle.checked ? "blue" : "red";
    const myQueueRef = ref(db, `queue/${user.uid}`);

    console.log(`Checking queue for ${user.uid} as ${selectedColor}...`);
    const snapshot = await get(myQueueRef);

    if (!snapshot.exists()) {
        console.warn("Branch missing. Triggering Worker...");
        
        try {
            const response = await fetch("https://z9s73n03d0m.later5143.workers.dev/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    uid: user.uid,
                    color: selectedColor // Dynamic color from UI
                })
            });

            if (response.ok) {
                console.log("Worker initialized the node!");
            } else {
                console.error("Worker rejected the request.");
            }
        } catch (err) {
            console.error("Failed to connect to Worker:", err);
        }
        return; 
    }

    // Existing Branch / After Worker init
    console.log("Branch verified. Starting RTR...");
    onValue(myQueueRef, (snapshot) => {
        const data = snapshot.val();
        if (data && data.MATCH_ID) {
            console.log("Match ID found! Killing listener...");
            off(myQueueRef); 
            // Add redirect to game here later
        }
    });
};
