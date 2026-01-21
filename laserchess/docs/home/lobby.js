// window.creatematchrequest is called by the onclick in your HTML
window.creatematchrequest = async () => {
  const user = auth.currentUser;

  if (!user) {
    alert("Auth not ready or user not logged in!");
    return;
  }

  console.log("Sending UID to Worker:", user.uid);

  try {
    const response = await fetch("https://laserchessnexus-matchmanager-v-alpha.later5143.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ uid: user.uid })
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Worker Echo:", data.echo);
      alert(`Success! Worker echoed your UID: ${data.echo}`);
    } else {
      console.error("Worker error:", data);
    }
  } catch (err) {
    console.error("Network error:", err);
    alert("Could not connect to Worker. Check console.");
  }
};
