document.addEventListener('DOMContentLoaded', () => {
    const sideToggle = document.getElementById('sideToggle');
    const mainBtn = document.getElementById('mainActionBtn');
    const userEmail = document.getElementById('userEmail');
    const statusText = document.getElementById('statusText');
    const statusValue = document.getElementById('statusValue');

    function applyTheme() {
        const isBlue = sideToggle.checked;
        
        // VIBRANT NEON COLORS
        const color = isBlue ? "#03e9f4" : "#ff3131"; 
        const rgb = isBlue ? "3, 233, 244" : "255, 49, 49"; // Brighter Red for "Glow"
        const opacity = isBlue ? "0.08" : "0.15"; // Red needs more opacity to be visible

        document.documentElement.style.setProperty('--theme-color', color);
        document.documentElement.style.setProperty('--theme-rgb', rgb);
        document.documentElement.style.setProperty('--theme-bg-opacity', opacity);
        
        userEmail.style.color = color;
        statusText.style.color = color;
        if(statusValue.innerText !== "IDLE") statusValue.style.color = color;
    }

    sideToggle.addEventListener('change', applyTheme);
    applyTheme();
});
