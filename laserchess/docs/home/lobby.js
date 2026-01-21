import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

window.creatematchrequest = (event) => {
    if (event) event.preventDefault(); // Prevent page refresh

    const auth = getAuth();
    const user = auth.currentUser;

    // Structure the object exactly as requested
    const matchData = {
        USER_UID: user ? user.uid : "LOGGED_OUT_OR_UNDEFINED",
        TIME: Date.now(),
        TYPE: "standard", // Always standard for now
        COLOR: document.getElementById('sideToggle')?.checked ? "blue" : "red"
    };

    console.log("--- MATCH REQUEST OBJECT ---");
    console.log(matchData);
    console.log("----------------------------");

    if (matchData.USER_UID === "LOGGED_OUT_OR_UNDEFINED") {
        console.warn("⚠️ AUTH ERROR: The user object is not loaded yet.");
    } else {
        console.log("✅ SUCCESS: Data is clean and ready for Worker.");
    }
};
