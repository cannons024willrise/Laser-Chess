document.addEventListener('DOMContentLoaded', () => {
    const sideToggle = document.getElementById('sideToggle');
    const lobbyStatus = document.getElementById('lobbyStatus');
    const mainBtn = document.getElementById('mainActionBtn');
    const userEmail = document.getElementById('userEmail');
    const statusText = document.getElementById('statusText');

    function applyTheme() {
        const isBlue = sideToggle.checked;
        const color = isBlue ? "#03e9f4" : "#f44336";

        // Update Button
        mainBtn.className = `play-now-btn w-full ${isBlue ? 'blue-mode' : 'red-mode'}`;
        
        // Update pulsing card
        lobbyStatus.style.setProperty('--theme-color', color);
        
        // Update Text & Header
        userEmail.style.color = color;
        statusText.style.color = color;
        document.querySelector('header').style.borderColor = color;
    }

    sideToggle.addEventListener('change', applyTheme);
    applyTheme(); // Run on init
});
