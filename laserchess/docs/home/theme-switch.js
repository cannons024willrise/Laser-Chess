document.addEventListener("DOMContentLoaded", () => {
  const red = document.getElementById("themeRed");
  const blue = document.getElementById("themeBlue");
  const toggle = document.getElementById("sideToggle");

  if (!red || !blue || !toggle) return;

  // Randomly pick a theme on load
  const blueTheme = Math.random() < 0.5;
  toggle.checked = blueTheme;
  red.disabled = blueTheme;
  blue.disabled = !blueTheme;

  // Switch theme when toggle changes
  toggle.addEventListener("change", () => {
    const isBlue = toggle.checked;
    red.disabled = isBlue;
    blue.disabled = !isBlue;
  });
});
