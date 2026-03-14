document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('sideToggle');
    const lobbyStatus = document.getElementById('lobbyStatus');
    const statusText = document.getElementById('statusText');
    const statusValue = document.getElementById('statusValue');
    const mainBtn = document.getElementById('mainActionBtn');
    const userEmail = document.getElementById('userEmail');

    function updateTheme() {
        if (toggle.checked) {
            // BLUE THEME
            document.body.classList.remove('red-theme');
            lobbyStatus.classList.remove('red-mode');
            mainBtn.classList.replace('red-mode', 'blue-mode');
            
            userEmail.style.color = "#03e9f4";
            statusText.style.color = "#03e9f4";
            statusValue.style.color = "#fff";
        } else {
            // RED THEME
            document.body.classList.add('red-theme');
            lobbyStatus.classList.add('red-mode');
            mainBtn.classList.replace('blue-mode', 'red-mode');
            
            userEmail.style.color = "#f44336";
            statusText.style.color = "#f44336";
            statusValue.style.color = "#f44336";
        }
    }

    toggle.addEventListener('change', updateTheme);
    updateTheme(); // Run once on load
});
