

// We assume Firebase was initialized in 'homeauthcheck.js'
const auth = getAuth();

window.creatematchrequest = async () => {
  const user = auth.currentUser;

  // 1. Safety check for Auth state
  if (!user) {
    alert("Please sign in or wait a moment for auth to initialize.");
    return;
  }

  const btn = document.querySelector('.play-now-btn');
  const originalText = btn.innerHTML;
  
  // UI Feedback
  btn.disabled = true;
  btn.innerHTML = "<span></span>Connecting to Worker...";

  try {
    // 2. The Request to your Cloudflare Worker
    const response = await fetch("https://laserchessnexus-matchmanager-v-alpha.later5143.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        uid: user.uid 
      }),
    });

    if (!response.ok) throw new Error("Worker responded with error");

    const data = await response.json();
    
    // 3. Success Echo
    console.log("Worker Response:", data);
    alert(`Success! Worker recognized UID: ${data.echo}`);

  } catch (error) {
    console.error("Integration Error:", error);
    alert("Connection failed. Check if Worker is deployed and CORS is set.");
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
};
