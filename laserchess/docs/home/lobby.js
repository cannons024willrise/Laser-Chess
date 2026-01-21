import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

window.creatematchrequest = async (event) => {
    if (event) event.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error("❌ Auth not ready.");
        return;
    }

    // 1. Create the Object
    const matchData = {
        USER_UID: user.uid,
        TIME: Date.now(),
        TYPE: "standard",
        COLOR: document.getElementById('sideToggle')?.checked ? "blue" : "red"
    };

    // 2. Console the Object
    console.log("--- ATTEMPTING BARE WRITE ---");
    console.log(matchData);

    try {
        // 3. Simple POST to Worker
        const response = await fetch("https://laserchessnexus-matchmanager-v-alpha.later5143.workers.dev", {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(matchData)
        });

        const statusText = await response.text();
        console.log("✅ Worker Response:", statusText);
        console.log("Check your Firebase Realtime Database now.");

    } catch (err) {
        console.error("❌ Network/Worker Error:", err);
    }
};
