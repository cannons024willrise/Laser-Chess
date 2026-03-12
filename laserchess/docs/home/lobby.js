// lobby.js - RAW RTR TEST
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

    console.log("TEST START: Listening to requests/" + user.uid);

    // 1. Point directly to the branch named after the UID
    const testRef = ref(db, `requests/${user.uid}`);

    // 2. The Raw Listener
    onValue(testRef, (snapshot) => {
        const data = snapshot.val();
        
        console.log("--- RTR UPDATE DETECTED ---");
        console.log("Path: requests/" + user.uid);
        console.log("Data received:", data);
        
        if (data) {
            alert("RTR SUCCESS! Received: " + JSON.stringify(data));
        }
    });
};
