document.addEventListener('DOMContentLoaded', () => {
    const sideToggle = document.getElementById('sideToggle');
    const lobbyStatus = document.getElementById('lobbyStatus');
    const mainBtn = document.getElementById('mainActionBtn');
    const userEmail = document.getElementById('userEmail');
    const statusText = document.getElementById('statusText');
    const statusValue = document.getElementById('statusValue');

    function applyTheme() {
        const isBlue = sideToggle.checked;
        const color = isBlue ? "#03e9f4" : "#f44336";

        // Update button appearance
        mainBtn.className = `play-now-btn w-full ${isBlue ? 'blue-mode' : 'red-mode'}`;
        
        // Update CSS variables for the components
        document.documentElement.style.setProperty('--theme-color', color);
        
        // Manual color updates for specific text elements
        userEmail.style.color = color;
        statusText.style.color = color;
        
        // Optional: change the status text color when it's not IDLE
        if(statusValue.innerText !== "IDLE") {
            statusValue.style.color = color;
        }
    }

    sideToggle.addEventListener('change', applyTheme);
    applyTheme();
});
