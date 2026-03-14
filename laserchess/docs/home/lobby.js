// --- IMPROVED THEME SWAPPER ---
document.addEventListener("DOMContentLoaded", () => {
    const sideToggle = document.getElementById('sideToggle');
    const mainActionBtn = document.getElementById('mainActionBtn');

    if (!sideToggle || !mainActionBtn) {
        console.error("Theme elements missing! Check your IDs.");
        return;
    }

    const updateButtonTheme = () => {
        if (sideToggle.checked) {
            console.log("Switching to BLUE");
            mainActionBtn.classList.remove('red-mode');
            mainActionBtn.classList.add('blue-mode');
        } else {
            console.log("Switching to RED");
            mainActionBtn.classList.remove('blue-mode');
            mainActionBtn.classList.add('red-mode');
        }
    };

    // Listen for clicks on the toggle
    sideToggle.addEventListener('change', updateButtonTheme);

    // Run once on load to sync with the current toggle state
    updateButtonTheme();
});

// --- MATCHMAKING LOGIC ---
window.handleMatchmaking = async function() {
    const user = auth.currentUser;
    const sideToggle = document.getElementById('sideToggle'); // Get state at time of click
    
    if (!user) {
        alert("Please wait for account sync...");
        return;
    }

    const selectedColor = sideToggle.checked ? "blue" : "red";
    // ... rest of your matchmaking code ...
