/**
 * LASER CHESS - STANDALONE TUTORIALS ENGINE
 * Completely self-contained. Bypasses dynamic CSS compilation issues.
 */

// 1. Define the simulation states explicitly
const tutorialStates = {
  KING: { rotation: 0 },
  DEFENDER: { rotation: 0 },
  DEFLECTOR: { rotation: 0 },
  SWITCH: { rotation: 0 },
  LASER: { rotation: 0 }
};

// 2. Global attachment for HTML event attributes
window.togglePieceTutorial = function(cardElement, pieceKey) {
  // Prevent rotation button clicks from triggering the card collapse
  if (window.event && window.event.target.tagName === 'BUTTON') return;

  const sandbox = cardElement.querySelector('.sandbox-container');
  if (!sandbox) return;

  const isHidden = sandbox.classList.contains('hidden');
  
  // Collapse all other active sandboxes
  document.querySelectorAll('.sandbox-container').forEach(el => {
    el.classList.add('hidden');
  });

  if (isHidden) {
    sandbox.classList.remove('hidden');
    renderSandbox(pieceKey); // Render immediately upon opening
  }
};

window.rotateTutorialPiece = function(pieceKey, direction) {
  if (window.event) window.event.stopPropagation();
  
  const state = tutorialStates[pieceKey];
  if (!state) return;

  // Cycle rotations across 4 quadrants smoothly
  state.rotation = (state.rotation + direction + 4) % 4;
  renderSandbox(pieceKey);
};

// 3. The hardened, raw SVG generation engine
function renderSandbox(pieceKey) {
  const svgBoard = document.getElementById(`svg-sandbox-${pieceKey}`);
  if (!svgBoard) {
    console.error(`ERROR: Could not locate <svg id="svg-sandbox-${pieceKey}"> in DOM.`);
    return;
  }
  
  // Flush previous drawing layers completely
  svgBoard.innerHTML = '';
  const state = tutorialStates[pieceKey];
  const CELL_SIZE = 100;

  // LAYER A: Fixed Background Grid (Using raw inline SVG properties)
  const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x * CELL_SIZE);
      rect.setAttribute('y', y * CELL_SIZE);
      rect.setAttribute('width', CELL_SIZE);
      rect.setAttribute('height', CELL_SIZE);
      
      // Native SVG styling replaces Tailwind to guarantee visibility
      rect.setAttribute('fill', 'rgba(0,0,0,0.6)');
      rect.setAttribute('stroke', 'rgba(255,255,255,0.08)');
      rect.setAttribute('stroke-width', '2');
      gridGroup.appendChild(rect);
    }
  }
  svgBoard.appendChild(gridGroup);

  // LAYER B: Demonstration Laser Pass
  const laserGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  let dStr = `M 0 150 L 300 150`; 

  const glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  glow.setAttribute('d', dStr);
  glow.setAttribute('stroke', 'rgba(234, 179, 8, 0.3)'); 
  glow.setAttribute('stroke-width', '12');
  glow.setAttribute('fill', 'none');
  
  const core = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  core.setAttribute('d', dStr);
  core.setAttribute('stroke', 'rgba(253, 224, 71, 1)'); 
  core.setAttribute('stroke-width', '4');
  core.setAttribute('fill', 'none');

  laserGroup.appendChild(glow);
  laserGroup.appendChild(core);
  svgBoard.appendChild(laserGroup);

  // LAYER C: The Game Piece Sprite
  const pieceGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  
  // Pivot anchored to matrix center (3x3 grid = 300x300, center is 150,150)
  pieceGroup.style.transformOrigin = "150px 150px";
  pieceGroup.style.transform = `rotate(${state.rotation * 90}deg)`;
  pieceGroup.style.transition = "transform 0.25s ease-in-out";

  const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
  image.setAttribute('x', 110); 
  image.setAttribute('y', 110);
  image.setAttribute('width', 80);
  image.setAttribute('height', 80);
  
  // Dual-protocol declaration ensures standard compliance across Safari/Chrome
  const spritePath = `../pieces/blue${pieceKey.toLowerCase()}.png`;
  image.setAttribute('href', spritePath);
  image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', spritePath);
  
  pieceGroup.appendChild(image);
  svgBoard.appendChild(pieceGroup);
}
