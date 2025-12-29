// docs/home/homeauthcheck.js
// Minimal compat auth-check for Home page.
// Requires: firebase-app-compat.js and firebase-auth-compat.js loaded BEFORE this script.

// Use the same Firebase project as your working Auth code:
const HOME_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCVHWRoVyuDnKRPY4EQbmyeY_rRR56XpEg",
  authDomain: "laserchessnexus-lobby-db-auth.firebaseapp.com",
  databaseURL: "https://laserchessnexus-lobby-db-auth-default-rtdb.europe-west1.firebasedatabase.app", // <- Add this
  projectId: "laserchessnexus-lobby-db-auth",
  storageBucket: "laserchessnexus-lobby-db-auth.firebasestorage.app",
  messagingSenderId: "1054469827964",
  appId: "1:1054469827964:web:0fe70a1fddb5b5d27588f9",
  measurementId: "G-F0PHDZYB4M"
};

(function() {
  if (typeof firebase === 'undefined' || !firebase.auth) {
    console.warn('homeauthcheck: Firebase compat SDK not found. Load firebase-app-compat.js and firebase-auth-compat.js first.');
    return;
  }

  // Initialize only if not already initialized (safe when other pages also init)
  if (!firebase.apps || !firebase.apps.length) {
    try {
      firebase.initializeApp(HOME_FIREBASE_CONFIG);
      console.log('homeauthcheck: Firebase initialized for project', HOME_FIREBASE_CONFIG.projectId);
    } catch (e) {
      console.warn('homeauthcheck: initializeApp error (ignored):', e);
    }
  } else {
    // already initialized; log which project is active
    try {
      console.log('homeauthcheck: Firebase already initialized for project', firebase.app().options.projectId);
    } catch (e) {}
  }

  const auth = firebase.auth();

  // Sign-out helper wired to your "Sign out" link
  window.handleSignOut = async function() {
    try {
      await auth.signOut();
      console.log('Signed out.');
      window.location.replace('/Auth/login.html');
    } catch (e) {
      console.error('Sign out failed:', e);
    }
  };

  // Main check — redirect to login if not signed in
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log('homeauthcheck: Signed in as', user.email || user.uid);
      const el = document.getElementById('userEmail');
      if (el) el.textContent = user.email || user.displayName || 'Account';
    } else {
      console.warn('homeauthcheck: Not signed in — redirecting to /Auth/login.html');
      // Use relative path to your Auth login page (adjust only if your hosting uses a different route)
      window.location.replace('/Auth/login.html');
    }
  });
})();

