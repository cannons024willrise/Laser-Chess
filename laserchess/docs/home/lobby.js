// laserchess/docs/home/lobby.js
import { db, auth } from "./homeauthcheck.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Attach to window so the HTML onclick can find it
window.creatematchrequest = function(event) {
    const user = auth.currentUser;
    if (!user) {
        console.error("RTR TEST: User not found in Auth state.");
        return;
    }

    console.log("RTR TEST: Starting listener for UID:", user.uid);
    
    // The specific branch for this user
    const myQueueRef = ref(db, `queue/${user.uid}`);

    // The Real-time Read (RTR)
    onValue(myQueueRef, (snapshot) => {
        const data = snapshot.val();
        console.log("--- RTR DATA RECEIVED ---");
        console.log("Location: queue/" + user.uid);
        console.log("Content:", data);

        if (data) {
            alert(`RTR SUCCESS!\nColor: ${data.COLOR}\nType: ${data.TYPE}`);
        }
    }, (error) => {
        console.error("RTR TEST FAILED (Rules?):", error);
    });
};
