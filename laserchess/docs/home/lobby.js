// laserchess/docs/home/lobby.js
import { db, auth } from "./homeauthcheck.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

window.creatematchrequest = function(event) {
    const user = auth.currentUser;
    if (!user) {
        console.error("RTR ERROR: No authenticated user.");
        return;
    }

    console.log("RTR INITIATED: Listening to ALL data at queue/" + user.uid);

    // This points to the UID folder itself
    const myFullBranchRef = ref(db, `queue/${user.uid}`);

    // onValue on the branch captures the ENTIRE object
    onValue(myFullBranchRef, (snapshot) => {
        const data = snapshot.val();
        
        if (data) {
            console.log("--- FULL BRANCH DATA RECEIVED ---");
            // This logs the entire object (COLOR, TIME, TYPE, etc.)
            console.log(data); 
            
            // Visual confirmation of everything found
            alert("RTR Received Full Branch:\n" + JSON.stringify(data, null, 2));
        } else {
            console.log("Branch is currently empty.");
        }
    }, (error) => {
        console.error("RTR Permission Error:", error);
    });
};
