// lobby.js

const WORKER_URL = "https://laserchessnexus-matchmanager-v-alpha.later5143.workers.dev";

window.creatematchrequest = async () => {
  console.log("Button clicked! Triggering Worker...");

  const btn = document.querySelector('.play-now-btn');
  btn.innerText = "Triggering...";
  btn.style.opacity = "0.5";

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Sending a test UID
      body: JSON.stringify({ uid: "test_user_123" }),
    });

    const result = await response.json();
    
    // Success Check
    console.log("Response from Worker:", result);
    alert("Connection Success: " + result.message);

  } catch (error) {
    console.error("Connection Failed:", error);
    alert("Worker failed to trigger. Check console.");
  } finally {
    btn.innerText = "Send Match Request";
    btn.style.opacity = "1";
  }
};

