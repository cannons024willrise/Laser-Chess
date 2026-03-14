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
            
            // Labels
            userEmail.style.color = "#03e9f4";
            statusText.style.color = "#03e9f4";
            statusValue.style.color = "#4b5563"; // gray-600
        } else {
            document.body.classList.add('red-theme');
            lobbyStatus.classList.add('red-mode');
            mainActionBtn.classList.remove('blue-mode');
            mainActionBtn.classList.add('red-mode');
            
            // Labels
            userEmail.style.color = "#f44336";
            statusText.style.color = "#f44336";
            statusValue.style.color = "#f44336";
        }
    }

    applyTheme();
    sideToggle.addEventListener('change', applyTheme);
});
