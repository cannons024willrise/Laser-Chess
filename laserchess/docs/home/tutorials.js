/**
 * LASER CHESS - TUTORIAL INTERACTIVE PHYSICS ENGINE
 * Integrated Configurable Matrix Build matching tactical UI paradigms.
 */

// 1. CONFIGURABLE PIECE INTERACTION MATRIX
// Explicitly maps incoming laser trajectory from LEFT (West) -> RIGHT (East)
const PIECE_INTERACTION_TABLE = {
  KING: {
    0: { pathSuffix: '', isDestroyed: true },
    1: { pathSuffix: '', isDestroyed: true },
    2: { pathSuffix: '', isDestroyed: true },
    3: { pathSuffix: '', isDestroyed: true }
  },
  DEFENDER: {
    0: { pathSuffix: 'L 300 150', isDestroyed: true },  // THROUGH
    1: { pathSuffix: '', isDestroyed: false },         // BLOCKED BY SHIELD Safely
    2: { pathSuffix: 'L 300 150', isDestroyed: true },  // THROUGH
    3: { pathSuffix: 'L 300 150', isDestroyed: true }   // THROUGH
  },
  DEFLECTOR: {
    0: { pathSuffix: 'L 150 0', isDestroyed: true },   // Reflects UP from West
    1: { pathSuffix: ' ', isDestroyed: true }, // Reflects DOWN from West
    2: { pathSuffix: 'L 150 300', isDestroyed: true },          // Dies from West laser
    3: { pathSuffix: '', isDestroyed: true }  // Inherits rotation 2's old active path (DOWN)
  },
  SWITCH: {
    0: { pathSuffix: 'L 150 0', isDestroyed: false },   // Companion mirror -> UP
    1: { pathSuffix: 'L 150 300', isDestroyed: false }, // Companion mirror -> DOWN
    2: { pathSuffix: 'L 150 300', isDestroyed: false }, // Companion mirror -> DOWN
    3: { pathSuffix: 'L 150 300', isDestroyed: false }  // Companion mirror -> DOWN
  },
  LASER: {
    0: { pathOverride: 'M 150 150 L 150 0', isDestroyed: false },   // Fires North
    1: { pathOverride: 'M 150 150 L 300 150', isDestroyed: false }, // Fires East
    2: { pathOverride: 'M 150 150 L 150 300', isDestroyed: false }, // Fires South
    3: { pathOverride: 'M 150 150 L 0 150', isDestroyed: false }    // Fires West
  }
};

const tutorialStates = {
  KING: { rotation: 0 },
  DEFENDER: { rotation: 0 },
  DEFLECTOR: { rotation: 0 },
  SWITCH: { rotation: 0 },
  LASER: { rotation: 0 }
};

window.togglePieceTutorial = function(cardElement, pieceKey) {
  if (window.event && window.event.target.tagName === 'BUTTON') return;

  const sandbox = cardElement.querySelector('.sandbox-container');
  if (!sandbox) return;

  const isHidden = sandbox.classList.contains('hidden');
  
  document.querySelectorAll('.sandbox-container').forEach(el => {
    el.classList.add('hidden');
  });

  if (isHidden) {
    sandbox.classList.remove('hidden');
    renderSandbox(pieceKey); 
  }
};

window.rotateTutorialPiece = function(pieceKey, direction) {
  if (window.event) window.event.stopPropagation();
  
  const state = tutorialStates[pieceKey];
  if (!state) return;

  state.rotation = (state.rotation + direction + 4) % 4;
  renderSandbox(pieceKey);
};

/**
 * CONFIGURABLE PHYSICAL TRANSLATION
 */
function calculatePhysics(pieceKey, rotation) {
  const config = PIECE_INTERACTION_TABLE[pieceKey]?.[rotation];
  if (!config) return { pathStr: 'M 0 150 L 150 150', isDestroyed: true };

  // If laser emitter node, use exact static override path coordinates
  if (config.pathOverride) {
    return { pathStr: config.pathOverride, isDestroyed: config.isDestroyed };
  }

  // Otherwise calculate relative tracking path inbound from West grid edge
  const basePath = 'M 0 150 L 150 150';
  const pathStr = config.pathSuffix ? `${basePath} ${config.pathSuffix}` : basePath;

  return { pathStr, isDestroyed: config.isDestroyed };
}

function renderSandbox(pieceKey) {
  const svgBoard = document.getElementById(`svg-sandbox-${pieceKey}`);
  if (!svgBoard) return;
  
  svgBoard.innerHTML = '';
  const state = tutorialStates[pieceKey];
  const CELL_SIZE = 100;

  const physics = calculatePhysics(pieceKey, state.rotation);

  // 1. Cybernetic Grid Matrix Layer
  const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x * CELL_SIZE);
      rect.setAttribute('y', y * CELL_SIZE);
      rect.setAttribute('width', CELL_SIZE);
      rect.setAttribute('height', CELL_SIZE);
      rect.setAttribute('fill', 'rgba(0, 0, 0, 0.65)');
      rect.setAttribute('stroke', 'rgba(255, 255, 255, 0.05)');
      rect.setAttribute('stroke-width', '1.5');
      gridGroup.appendChild(rect);
    }
  }
  svgBoard.appendChild(gridGroup);

  // 2. Vector Laser Glow & Outer Paths
  const laserGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  
  const glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  glow.setAttribute('d', physics.pathStr);
  glow.setAttribute('stroke', physics.isDestroyed ? 'rgba(120, 120, 120, 0.3)' : 'rgba(3, 233, 244, 0.35)'); 
  glow.setAttribute('stroke-width', '14');
  glow.setAttribute('stroke-linecap', 'round');
  glow.setAttribute('fill', 'none');
  
  const core = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  core.setAttribute('d', physics.pathStr);
  core.setAttribute('stroke', physics.isDestroyed ? 'rgba(160, 160, 160, 0.9)' : 'rgba(255, 255, 255, 1)'); 
  core.setAttribute('stroke-width', '3.5');
  core.setAttribute('stroke-linecap', 'round');
  core.setAttribute('fill', 'none');

  laserGroup.appendChild(glow);
  laserGroup.appendChild(core);
  svgBoard.appendChild(laserGroup);

  // 3. Piece Sprite Layer with Rotational Bounds
  const pieceGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  pieceGroup.style.transformOrigin = "150px 150px";
  pieceGroup.style.transform = `rotate(${state.rotation * 90}deg)`;
  pieceGroup.style.transition = "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease-in-out";
  
  // Rule Compliance: Gray out when destroyed state is met
  if (physics.isDestroyed) {
    pieceGroup.style.filter = "grayscale(100%) brightness(0.4) contrast(0.9)";
  } else {
    pieceGroup.style.filter = "grayscale(0%) brightness(1.05) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.6))";
  }

  const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
  image.setAttribute('x', 105); 
  image.setAttribute('y', 105);
  image.setAttribute('width', 90);
  image.setAttribute('height', 90);
  
  const spritePath = `../pieces/blue${pieceKey.toLowerCase()}.png`;
  image.setAttribute('href', spritePath);
  image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', spritePath);
  
  pieceGroup.appendChild(image);
  svgBoard.appendChild(pieceGroup);
}
