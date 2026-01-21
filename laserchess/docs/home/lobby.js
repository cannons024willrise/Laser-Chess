// lobby.js
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// DO NOT initializeApp here if it's already done in homeauthcheck.js
const auth = getAuth(); 

window.creatematchrequest = async () => {
  const user = auth.currentUser;
  
  if (!user) {
    alert("Auth is still loading. Please try again in a second!");
    return;
  }

  // Your worker logic...
  console.log("Using UID:", user.uid);
  
  try {
    const response = await fetch("https://laserchessnexus-matchmanager-v-alpha.later5143.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: user.uid })
    });
    const data = await response.json();
    alert("Success! Echoed UID: " + data.echo);
  } catch (err) {
    console.error("Worker connection failed.");
  }
};
