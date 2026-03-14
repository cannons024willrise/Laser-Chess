// lobby.js - Integrated Theme & Matchmaking
import { db, auth } from "./homeauthcheck.js";
import { ref, get, onValue, off } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// --- TOGGLE DRIVEN THEME SWAPPER ---
function initTheme() {
    const sideToggle = document.getElementById('sideToggle');
    const mainActionBtn = document.getElementById('mainActionBtn');

    if (!sideToggle || !mainActionBtn) return;

    const syncTheme = () => {
        if (sideToggle.checked) {
            // Checkbox ON = BLUE
            mainActionBtn.classList.remove('red-mode');
            mainActionBtn.classList.add('blue-mode');
        } else {
            // Checkbox OFF = RED
            mainActionBtn.classList.remove('blue-mode');
            mainActionBtn.classList.add('red-mode');
        }
    };

    // Trigger on every flip
    sideToggle.addEventListener('change', syncTheme);
    // Trigger on page load
    syncTheme();
}

// Run init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}

// --- MATCHMAKING LOGIC ---
window.handleMatchmaking = async function() {
    const user = auth.currentUser;
    const sideToggle = document.getElementById('sideToggle');
    if (!user || !sideToggle) return; 

    const selectedColor = sideToggle.checked ? "blue" : "red";
    const myQueueRef = ref(db, `queue/${user.uid}`);

    // ... (rest of your existing worker fetch logic)
};
