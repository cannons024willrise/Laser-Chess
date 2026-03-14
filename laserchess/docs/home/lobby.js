document.addEventListener('DOMContentLoaded', () => {
    const sideToggle = document.getElementById('sideToggle');
    const lobbyStatus = document.getElementById('lobbyStatus');
    const statusText = document.getElementById('statusText');
    const statusValue = document.getElementById('statusValue');
    const mainActionBtn = document.getElementById('mainActionBtn');
    const userEmail = document.getElementById('userEmail');
    const body = document.body;

    function applyTheme() {
        const isBlue = sideToggle.checked;

        if (isBlue) {
            body.classList.remove('red-theme');
            lobbyStatus.classList.remove('red-mode');
            mainActionBtn.classList.replace('red-mode', 'blue-mode');
            
            // Account Label & Status Text
            userEmail.classList.replace('text-red-500', 'text-cyan-400');
            statusText.classList.replace('text-red-500', 'text-cyan-400');
            statusValue.classList.replace('text-red-600', 'text-gray-600');
        } else {
            body.classList.add('red-theme');
            lobbyStatus.classList.add('red-mode');
            mainActionBtn.classList.replace('blue-mode', 'red-mode');
            
            // Account Label & Status Text
            userEmail.classList.replace('text-cyan-400', 'text-red-500');
            statusText.classList.replace('text-cyan-400', 'text-red-500');
            statusValue.classList.replace('text-gray-600', 'text-red-600');
        }
    }

    applyTheme();
    sideToggle.addEventListener('change', applyTheme);
});
