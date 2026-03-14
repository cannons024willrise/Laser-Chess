document.addEventListener('DOMContentLoaded', () => {
    const sideToggle = document.getElementById('sideToggle');
    const lobbyStatus = document.getElementById('lobbyStatus');
    const mainBtn = document.getElementById('mainActionBtn');
    const userEmail = document.getElementById('userEmail');
    const statusText = document.getElementById('statusText');

    function syncTheme() {
        if (sideToggle.checked) {
            // BLUE THEME
            document.body.classList.remove('red-theme');
            lobbyStatus.classList.remove('red-mode');
            mainBtn.classList.add('blue-mode');
            mainBtn.classList.remove('red-mode');
            
            userEmail.style.color = "#03e9f4";
            statusText.style.color = "#03e9f4";
        } else {
            // RED THEME
            document.body.classList.add('red-theme');
            lobbyStatus.classList.add('red-mode');
            mainBtn.classList.add('red-mode');
            mainBtn.classList.remove('blue-mode');
            
            userEmail.style.color = "#f44336";
            statusText.style.color = "#f44336";
        }
    }

    sideToggle.addEventListener('change', syncTheme);
    syncTheme(); // Force correct state on load
});
