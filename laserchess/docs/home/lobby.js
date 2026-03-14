document.addEventListener('DOMContentLoaded', () => {
    const sideToggle = document.getElementById('sideToggle');
    const lobbyStatus = document.getElementById('lobbyStatus');
    const mainBtn = document.getElementById('mainActionBtn');
    const userEmail = document.getElementById('userEmail');
    const statusText = document.getElementById('statusText');
    const statusValue = document.getElementById('statusValue');

    function applyTheme() {
        const isBlue = sideToggle.checked;
        
        // VIBRANT NEON COLORS
        const color = isBlue ? "#03e9f4" : "#ff3131";
        const rgb = isBlue ? "3, 233, 244" : "255, 49, 49";

        // Update button appearance
        mainBtn.className = `play-now-btn w-full ${isBlue ? 'blue-mode' : 'red-mode'}`;
        
        // Update CSS variables for all components
        document.documentElement.style.setProperty('--theme-color', color);
        document.documentElement.style.setProperty('--theme-rgb', rgb);
        
        // Manual color updates for specific text elements
        userEmail.style.color = color;
        statusText.style.color = color;
        
        if(statusValue.innerText !== "IDLE") {
            statusValue.style.color = color;
        }

        // CORRECT PLACEMENT: Inside the function so it knows what "isBlue" is
        const bgImage = isBlue ? 'Gemini_Generated_Image_tjcevutjcevutjce.png' : 'Gemini_Generated_Image_atb53oatb53oatb5.png';
        
        document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.92)), url('${bgImage}')`;
        // Make sure it stays fixed and covers the screen
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center center';
        document.body.style.backgroundAttachment = 'fixed';
    }

    sideToggle.addEventListener('change', applyTheme);
    applyTheme(); // Initialize on load
});
