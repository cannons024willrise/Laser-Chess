// lobby.js - Verified Auth RTR Test
import { db, auth } from "./homeauthcheck.js";
import { ref, get, onValue, off } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

window.creatematchrequest = async function(event) {
    const user = auth.currentUser;
    if (!user) return; 

    const myQueueRef = ref(db, `queue/${user.uid}`);

    console.log("Checking for branch existence...");
    const snapshot = await get(myQueueRef);

    // --- SECOND PATH: Branch doesn't exist ---
    if (!snapshot.exists()) {
        console.warn("Branch missing. Triggering Worker...");
        
        try {
            const response = await fetch("https://z9s73n03d0m.later5143.workers.dev/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    uid: user.uid,
                    color: "white" // You can pull this from a UI toggle later
                })
            });

            if (response.ok) {
                console.log("Worker initialized the node! Please click 'Play' again.");
                // Optional: You could call creatematchrequest(event) again automatically here
            } else {
                console.error("Worker rejected the request.");
            }
        } catch (err) {
            console.error("Failed to connect to Worker:", err);
        }
        return; 
    }

    // --- FIRST PATH (Existing Branch) / AFTER WORKER INITIALIZES ---
    console.log("Branch verified. Starting RTR...");
    onValue(myQueueRef, (snapshot) => {
        const data = snapshot.val();
        
        if (data) {
            console.log("--- LIVE DATA ---", data);
            
            if (data.MATCH_ID) {
                console.log("Match ID found! Killing listener...");
                off(myQueueRef); 
            }
        }
    });
};
