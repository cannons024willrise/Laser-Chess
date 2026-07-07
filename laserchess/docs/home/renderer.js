/**
 * LASER CHESS - TUTORIAL ENGINE OPERATIONAL PATCH
 * Binds module-scoped layout triggers directly to the global window environment.
 */

// --- Keep your existing tutorialStates dictionary up here ---

/**
 * Toggles visibility of the card sandbox and fires the SVG vector engine renderer
 */
window.togglePieceTutorial = function(cardElement, pieceKey) {
  // Find the sandbox wrapper inside this specific clicked card
  const sandbox = cardElement.querySelector('.sandbox-container');
  if (!sandbox) return;

  // Toggle the hidden display utility state
  const isHidden = sandbox.classList.contains('hidden');
  
  // Close any other open sandboxes first for clean UX
  document.querySelectorAll('.sandbox-container').forEach(el => el.classList.add('hidden'));

  if (isHidden) {
    sandbox.classList.remove('hidden');
    // Call your SVG rendering engine logic immediately once container layout renders
    renderSandbox(cardElement, pieceKey);
  }
};

/**
 * Handles clockwise / counter-clockwise rotations from the button parameters
 */
window.rotateTutorialPiece = function(pieceKey, direction) {
  const state = tutorialStates[pieceKey];
  if (!state) return;

  // Track standard 0-3 rotational quadrant matrix bounds
  state.rotation = (state.rotation + direction + 4) % 4;

  // Find the active open card element to force an immediate scene update pass
  const targetCard = document.querySelector(`[data-tutorial-id="${pieceKey}"]`);
  if (targetCard) {
    renderSandbox(targetCard, pieceKey);
  }
};

/**
 * Your Core Vector Rendering Engine Logic
 */
function renderSandbox(cardElement, pieceKey) {
  const svgBoard = document.getElementById(`svg-sandbox-${pieceKey}`);
  if (!svgBoard) return;
  
  svgBoard.innerHTML = ''; // Flush layout buffer
  const state = tutorialStates[pieceKey];
  const CELL_SIZE = 100;

  // 1. Paint 3x3 Vector Grid Matrix
  const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x * CELL_SIZE);
      rect.setAttribute('y', y * CELL_SIZE);
      rect.setAttribute('width', CELL_SIZE);
      rect.setAttribute('height', CELL_SIZE);
      rect.setAttribute('class', 'fill-transparent stroke-white/5 stroke-[1]');
      gridGroup.appendChild(rect);
    }
  }
  svgBoard.appendChild(gridGroup);

  // 2. Mock Laser Vector Path Line Drawing (Middle horizontal lane pass example)
  const laserGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  // Creates a clean line from left edge through middle cell
  let dStr = `M 0 150 L 300 150`; 

  const glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  glow.setAttribute('d', dStr);
  glow.setAttribute('class', 'stroke-yellow-500/20 fill-none stroke-[8] blur-sm');
  
  const core = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  core.setAttribute('d', dStr);
  core.setAttribute('class', 'stroke-yellow-400 fill-none stroke-[3]');

  laserGroup.appendChild(glow);
  laserGroup.appendChild(core);
  svgBoard.appendChild(laserGroup);

  // 3. Mount Unit Sprite Layer Nodes
  const pieceGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  pieceGroup.style.transformOrigin = "150px 150px";
  pieceGroup.style.transform = `rotate(${state.rotation * 90}deg)`;
  pieceGroup.setAttribute('class', 'transition-transform duration-200');

  const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
  image.setAttribute('x', 110); // Center layout position configuration
  image.setAttribute('y', 110);
  image.setAttribute('width', 80);
  image.setAttribute('height', 80);
  
  // Dynamic path translation relative to your repository map layout configuration
  image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `../pieces/blue${pieceKey.toLowerCase()}.png`);
  
  pieceGroup.appendChild(image);
  svgBoard.appendChild(pieceGroup);
}
