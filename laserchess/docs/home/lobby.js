// lobby.js - Targeted UID Reading
import { getDatabase, ref, onValue, off } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const db = getDatabase();
const auth = getAuth();

window.creatematchrequest = function(event) {
    const user = auth.currentUser;
    if (!user) return;

    const playBtn = event.currentTarget;
    playBtn.disabled = true;
    playBtn.innerText = "Listening for Match...";

    // 1. Point directly to the branch named after the User's UID
    const myBranchRef = ref(db, `requests/${user.uid}`);

    // 2. Start the Real-time Read (RTR) on that specific branch
    onValue(myBranchRef, (snapshot) => {
        const data = snapshot.val();

        if (data && data.matchId) {
            console.log("Match data received for UID:", user.uid);
            
            // 3. KILL THE CONNECTION IMMEDIATELY (Save that 1/100 slot!)
            off(myBranchRef);

            // Proceed to game
            window.location.href = `/game.html?id=${data.matchId}`;
        }
    });
};
