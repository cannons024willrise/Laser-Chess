import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

window.creatematchrequest = (event) => {
    if (event) event.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error("❌ Auth not ready - Cannot find UID.");
        return;
    }

    // This is the clean structure you want for the DB node
    const nodeData = {
        COLOR: document.getElementById('sideToggle')?.checked ? "blue" : "red",
        TIME: Date.now(),
        TYPE: "standard"
    };

    // This is the 'Wrapper' we send to the Worker so it knows the Node Name
    const payload = {
        USER_UID: user.uid, // Worker will use this for the path: /queue/USER_UID
        DATA: nodeData      // Worker will write this inside the path
    };

    console.log("--- CLIENT-SIDE VERIFICATION ---");
    console.log("Target Node Name (UID):", payload.USER_UID);
    console.log("Data to be written inside:", payload.DATA);
    console.log("-------------------------------");
};
