// lobby.js - Verified Auth RTR Test
import { db, auth } from "./homeauthcheck.js";
import { ref, get, onValue, off } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

window.creatematchrequest = async function(event) {
    const user = auth.currentUser;
    if (!user) return; 

    const myQueueRef = ref(db, `queue/${user.uid}`);

    console.log("Checking for branch existence...");
    const snapshot = await get(myQueueRef);

    if (!snapshot.exists()) {
        console.warn("Branch missing. Triggering Worker to initialize queue...");
        
        // --- THE TRIGGER ---
        // This tells the Worker: "I want to play, but I can't write to my own branch."
        try {
            await fetch("https://your-worker-name.pages.dev/initialize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    uid: user.uid,
                    action: "CREATE_NODE" 
                })
            });
            console.log("Worker notified. Try clicking 'Play' again in a second.");
        } catch (err) {
            console.error("Worker trigger failed:", err);
        }
        
        return; 
    }

    // 2. THE RTR (Only starts if data is actually there)
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
