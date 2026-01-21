import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

window.creatematchrequest = async (event) => {
    if (event) event.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error("❌ Auth not ready.");
        return;
    }

    // 1. Define the contents
    const objectContent = {
        COLOR: document.getElementById('sideToggle')?.checked ? "blue" : "red",
        TIME: Date.now(),
        TYPE: "standard"
    };

    // 2. Define the payload (using the UID as the Key)
    const finalPayload = {
        [user.uid]: objectContent
    };

    // 3. Log it (No more ReferenceError)
    console.log("--- SENDING TO WORKER ---");
    console.log(finalPayload);

    try {
        // 4. Send to Worker
        const response = await fetch("https://laserchessnexus-matchmanager-v-alpha.later5143.workers.dev", {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(finalPayload)
        });

        const result = await response.text();
        console.log("✅ Worker Response:", result);

    } catch (err) {
        console.error("❌ Network Error:", err);
    }
};
