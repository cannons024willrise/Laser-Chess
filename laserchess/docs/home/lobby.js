// Ensure this code is in your lobby.js file
document.addEventListener('DOMContentLoaded', () => {
    const sideToggle = document.getElementById('sideToggle');
    const lobbyStatus = document.getElementById('lobbyStatus');
    const statusText = document.getElementById('statusText');
    const statusValue = document.getElementById('statusValue');
    const mainActionBtn = document.getElementById('mainActionBtn');

    function applyTheme() {
        const isBlue = sideToggle.checked;

        if (isBlue) {
            // --- BLUE MODE ---
            lobbyStatus.classList.remove('red-mode');
            
            mainActionBtn.classList.remove('red-mode');
            mainActionBtn.classList.add('blue-mode');
            
            statusText.classList.replace('text-red-500', 'text-cyan-400');
            statusValue.classList.replace('text-red-600', 'text-gray-600');
        } else {
            // --- RED MODE ---
            lobbyStatus.classList.add('red-mode');
            
            mainActionBtn.classList.remove('blue-mode');
            mainActionBtn.classList.add('red-mode');
            
            // Switch Tailwind colors on text
            statusText.classList.replace('text-cyan-400', 'text-red-500');
            statusValue.classList.replace('text-gray-600', 'text-red-600');
        }
    }

    // Initialize on load
    applyTheme();

    // Listen for toggle changes
    sideToggle.addEventListener('change', applyTheme);
});
