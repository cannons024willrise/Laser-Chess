document.addEventListener('DOMContentLoaded', () => {
    const sideToggle = document.getElementById('sideToggle');
    const lobbyStatus = document.getElementById('lobbyStatus');
    const statusText = document.getElementById('statusText');
    const statusValue = document.getElementById('statusValue');
    const mainActionBtn = document.getElementById('mainActionBtn');
    const userEmail = document.getElementById('userEmail');

    function applyTheme() {
        if (sideToggle.checked) {
            // BLUE MODE
            lobbyStatus.classList.remove('red-mode');
            mainActionBtn.classList.replace('red-mode', 'blue-mode');
            
            // Swap Tailwind Text Colors
            userEmail.classList.replace('text-red-500', 'text-cyan-400');
            statusText.classList.replace('text-red-500', 'text-cyan-400');
            statusValue.classList.replace('text-red-600', 'text-gray-600');
        } else {
            // RED MODE
            lobbyStatus.classList.add('red-mode');
            mainActionBtn.classList.add('red-mode');
            mainActionBtn.classList.remove('blue-mode');
            
            // Swap Tailwind Text Colors
            userEmail.classList.replace('text-cyan-400', 'text-red-500');
            statusText.classList.replace('text-cyan-400', 'text-red-500');
            statusValue.classList.replace('text-gray-600', 'text-red-600');
        }
    }

    // Initial run
    if (!mainActionBtn.classList.contains('blue-mode') && !mainActionBtn.classList.contains('red-mode')) {
        mainActionBtn.classList.add('blue-mode');
    }
    applyTheme();
    sideToggle.addEventListener('change', applyTheme);
});
