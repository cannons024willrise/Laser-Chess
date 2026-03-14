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
            mainBtn.classList.remove('red-mode');
            mainBtn.classList.add('blue-mode');
            
            userEmail.style.setProperty('color', '#03e9f4', 'important');
            statusText.style.setProperty('color', '#03e9f4', 'important');
            statusValue.style.setProperty('color', '#9ca3af', 'important'); // Gray
        } else {
            // RED THEME
            document.body.classList.add('red-theme');
            lobbyStatus.classList.add('red-mode');
            mainBtn.classList.remove('blue-mode');
            mainBtn.classList.add('red-mode');
            
            userEmail.style.setProperty('color', '#f44336', 'important');
            statusText.style.setProperty('color', '#f44336', 'important');
            statusValue.style.setProperty('color', '#f44336', 'important');
        }
    }

    toggle.addEventListener('change', updateTheme);
    updateTheme(); // Run once on load
});
