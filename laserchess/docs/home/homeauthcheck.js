// homeauthcheck.js

// 1. Initial Config (Necessary because home.html doesn't have it)
const firebaseConfig = {
    apiKey: "AIzaSyBuT7P1iTdXcZW-y05DX-kseuLrPGmaWSs",
    authDomain: "laserchess-web-free.firebaseapp.com",
    projectId: "laserchess-web-free",
    storageBucket: "laserchess-web-free.firebasestorage.app",
    messagingSenderId: "887464510754",
    appId: "1:887464510754:web:aee6938681543602a4517b"
};

// Initialize Firebase for the Home Page
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

// 2. The Gatekeeper Logic
auth.onAuthStateChanged((user) => {
    if (user) {
        // Check if they verified their email (matching your login.html logic)
        if (user.emailVerified || user.providerData[0].providerId === 'google.com') {
            console.log("Access Granted:", user.email);
            
            // Update the 'Account' link with the user's email
            const emailLink = document.getElementById('userEmail');
            if (emailLink) {
                emailLink.textContent = user.email;
            }
        } else {
            // Logged in but not verified
            window.location.replace("../../login/login.html");
        }
    } else {
        // Not logged in at all
        window.location.replace("../../login/login.html");
    }
});

// 3. Global Sign Out Function (for the onclick in your HTML)
window.handleSignOut = function() {
    auth.signOut().then(() => {
        window.location.replace("../../login/login.html");
    });
};
