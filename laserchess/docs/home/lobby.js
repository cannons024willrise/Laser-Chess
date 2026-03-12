// lobby.js - Targeted RTR Test on current UID
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const db = getDatabase();
const auth = getAuth();

window.creatematchrequest = function(event) {
    const user = auth.currentUser;
    if (!user) {
        console.error("TEST FAILED: No authenticated user found.");
        return;
    }

    // 1. Target: https://laserchess-web-free-default-rtdb.firebaseio.com/queue/[YOUR_UID]
    const testBranchRef = ref(db, `queue/${user.uid}`);

    console.log("TEST START: Listening for changes at queue/" + user.uid);

    // 2. The Raw RTR
    onValue(testBranchRef, (snapshot) => {
        const data = snapshot.val();
        
        console.log("--- REAL-TIME DATA RECEIVED ---");
        console.log("UID:", user.uid);
        console.log("Data:", data);
        
        if (data) {
            // This will show you the COLOR, TIME, and TYPE you've set
            alert(`RTR Update!\nColor: ${data.COLOR}\nType: ${data.TYPE}`);
        }
    });
};
