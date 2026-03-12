// lobby.js - Verified Auth RTR Test
import { db, auth } from "./homeauthcheck.js";
import { ref, get, onValue, off } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

window.creatematchrequest = async function(event) {
    const user = auth.currentUser;
    if (!user) return; // Verified accounts only

    const myQueueRef = ref(db, `queue/${user.uid}`);

    // 1. THE PING (Uses standard Read rules)
    console.log("Checking for branch existence...");
    const snapshot = await get(myQueueRef);

    if (!snapshot.exists()) {
        console.warn("RTR BLOCKED: Branch does not exist for UID:", user.uid);
        alert("You aren't in the queue yet. No listener started.");
        return; 
    }

    // 2. THE RTR (Only starts if data is actually there)
    console.log("Branch verified. Starting RTR...");
    onValue(myQueueRef, (snapshot) => {
        const data = snapshot.val();
        
        if (data) {
            console.log("--- LIVE DATA ---", data);
            
            // If we find a specific key that means "Match Ready", we kill the RTR
            if (data.MATCH_ID) {
                console.log("Match ID found! Killing listener...");
                off(myQueueRef); // Frees the slot immediately
            }
        }
    });
};
