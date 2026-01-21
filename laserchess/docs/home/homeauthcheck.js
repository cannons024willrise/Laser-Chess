// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBuT7P1iTdXcZW-y05DX-kseuLrPGmaWSs",
  authDomain: "laserchess-web-free.firebaseapp.com",
  projectId: "laserchess-web-free",
  storageBucket: "laserchess-web-free.firebasestorage.app",
  messagingSenderId: "887464510754",
  appId: "1:887464510754:web:aee6938681543602a4517b",
  measurementId: "G-KC5J6JPX2M"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// auth-check.js
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

onAuthStateChanged(auth, (user) => {
  // Check if user is logged in AND has verified their email
  if (!user || !user.emailVerified) {
    console.warn("Unauthorized or unverified access. Redirecting...");
    window.location.replace("../../login/login.html");
  } else {
    // Reveal the UI once authenticated
    document.body.style.display = "block";
    console.log("Welcome, Strategist:", user.email);
  }
});
