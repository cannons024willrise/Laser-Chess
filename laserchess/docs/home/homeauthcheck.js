// auth-check.js
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

onAuthStateChanged(auth, (user) => {
  if (!user || !user.emailVerified) {
    console.warn("Unauthorized or unverified access. Redirecting...");
    window.location.replace("../../login/login.html");
  } else {
    // 1. Find the Account label and swap text with the user's email
    // This assumes your link has the class 'account-link'
    const accountLabel = document.querySelector('.account-link');
    if (accountLabel) {
      accountLabel.textContent = user.email; 
    }

    // 2. Reveal the UI once authenticated
    document.body.style.display = "block";
    console.log("Verified Strategist:", user.email);
  }
});

// 3. Handle Sign Out (Add this to make the button functional)
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
      window.location.replace("../../login/login.html");
    }).catch((error) => {
      console.error("Sign out error:", error);
    });
  });
}
