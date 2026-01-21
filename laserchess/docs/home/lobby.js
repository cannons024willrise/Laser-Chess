import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

window.creatematchrequest = (event) => {
    if (event) event.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error("❌ Auth not ready.");
        return;
    }

    // This is the UID that will become the Node Name (The Object Name)
    const objectName = user.uid;

    // This is the content that goes INSIDE that object
    const objectContent = {
        COLOR: document.getElementById('sideToggle')?.checked ? "blue" : "red",
        TIME: Date.now(),
        TYPE: "standard"
    };

    // The final payload for the Worker
    const finalPayload = {
        [objectName]: objectContent
    };

    console.log("--- CLIENT SIDE OBJECT VERIFICATION ---");
    console.log("This will be the structure in Firebase:");
    console.log(JSON.stringify(finalPayload, null, 2));
    console.log("---------------------------------------");
};
