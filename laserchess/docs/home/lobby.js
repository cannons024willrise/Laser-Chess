import { getAuth } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-auth.js";

// Get the auth instance within this module
const auth = getAuth();

window.creatematchrequest = async () => {
  // Use the local 'auth' variable defined above
  const user = auth.currentUser;

  if (!user) {
    alert("Authentication in progress... please try again in a second.");
    console.log("Auth State:", auth); // Debug to see if auth is initialized
    return;
  }

  const btn = document.querySelector('.play-now-btn');
  btn.innerText = "Triggering...";

  try {
    const response = await fetch("https://laserchessnexus-matchmanager-v-alpha.later5143.workers.dev", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ uid: user.uid })
    });

    const data = await response.json();
    alert("Worker Echo Success! UID: " + data.echo);
    
  } catch (err) {
    console.error("Worker connection failed:", err);
    alert("Check console for CORS or Network errors.");
  } finally {
    btn.innerText = "Send Match Request";
  }
};
