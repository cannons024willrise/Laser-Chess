document.addEventListener('DOMContentLoaded', () => {
    const sideToggle = document.getElementById('sideToggle');
    const lobbyStatus = document.getElementById('lobbyStatus');
    const statusText = document.getElementById('statusText');
    const statusValue = document.getElementById('statusValue');
    const mainActionBtn = document.getElementById('mainActionBtn');
    const userEmail = document.getElementById('userEmail');

    function applyTheme() {
        const isBlue = sideToggle.checked;

        if (isBlue) {
            document.body.classList.remove('red-theme');
            lobbyStatus.classList.remove('red-mode');
            mainActionBtn.classList.remove('red-mode');
            mainActionBtn.classList.add('blue-mode');
            
            // Override Tailwind via direct Style
            userEmail.style.setProperty('color', '#03e9f4', 'important');
            statusText.style.setProperty('color', '#03e9f4', 'important');
            statusValue.style.setProperty('color', '#4b5563', 'important');
        } else {
            document.body.classList.add('red-theme');
            lobbyStatus.classList.add('red-mode');
            mainActionBtn.classList.remove('blue-mode');
            mainActionBtn.classList.add('red-mode');
            
            // Override Tailwind via direct Style
            userEmail.style.setProperty('color', '#f44336', 'important');
            statusText.style.setProperty('color', '#f44336', 'important');
            statusValue.style.setProperty('color', '#f44336', 'important');
        }
    }

    applyTheme();
    sideToggle.addEventListener('change', applyTheme);
});
