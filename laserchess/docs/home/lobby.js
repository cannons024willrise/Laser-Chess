document.addEventListener('DOMContentLoaded', () => {
    const sideToggle = document.getElementById('sideToggle');
    const lobbyStatus = document.getElementById('lobbyStatus');
    const mainBtn = document.getElementById('mainActionBtn');
    const userEmail = document.getElementById('userEmail');
    const statusText = document.getElementById('statusText');

    function applyTheme() {
        const isBlue = sideToggle.checked;
        const color = isBlue ? "#03e9f4" : "#f44336";

        mainBtn.className = `play-now-btn w-full ${isBlue ? 'blue-mode' : 'red-mode'}`;
        
        lobbyStatus.style.setProperty('--theme-color', color);
        userEmail.style.color = color;
        statusText.style.color = color;
        
        const header = document.querySelector('header');
        if (header) header.style.borderColor = color;
    }

    sideToggle.addEventListener('change', applyTheme);
    applyTheme();
});
