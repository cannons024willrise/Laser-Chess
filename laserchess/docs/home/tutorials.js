/**
 * LASER CHESS - TUTORIALS ENGINE (COMPLETE PRODUCTION BUILD)
 * Includes explicit interaction tables, exact sprite orientation adjustments,
 * and rule-compliant grayscale/darkened asset destruction states.
 */

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
 * MINI PHYSICS ENGINE
 * Track laser paths and status matrices based on explicit instruction rules.
 * Mock laser enters from LEFT (West) traveling RIGHT (East) toward the center cell.
 */
function calculatePhysics(pieceKey, rotation) {
  let pathStr = ``;
  let isDestroyed = false;

  // Center paths of our 3x3 sandbox grid
  const IN = `M 0 150 L 150 150`; 
  const THROUGH = `M 0 150 L 300 150`;
  const UP = `L 150 0`;
  const DOWN = `L 150 300`;

  switch(pieceKey) {
    case 'KING':
      pathStr = IN;
      isDestroyed = true;
      break;

    case 'DEFENDER':
      // Shield is at the BOTTOM (Faces South) at rotation 0.
      // Rotation 1 (90° CW): Shield faces West (Blocks West laser safely!)
      if (rotation === 1) {
        pathStr = IN; 
        isDestroyed = false;
      } else {
        pathStr = THROUGH; 
        isDestroyed = true;
      }
      break;

    case 'DEFLECTOR':
      // Explicit Interaction Rules:
      // Rotation 0: Reflects UP from West
      // Rotation 1: Reflects DOWN from West
      // Rotation 2: Dies from West laser
      // Rotation 3: Inherits Rotation 2's old interaction -> Reflects DOWN from West
      if (rotation === 0) {
        pathStr = `${IN} ${UP}`;
        isDestroyed = false;
      } else if (rotation === 1) {
        pathStr = `${IN} ${DOWN}`; 
        isDestroyed = false;
      } else if (rotation === 3) {
        pathStr = `${IN} ${DOWN}`;
        isDestroyed = false;
      } else {
        // Rotation 2 drops here and gets destroyed cleanly
        pathStr = IN;
        isDestroyed = true;
      }
      break;

    case 'SWITCH':
      // Companion piece reflecting identical directions without destruction states:
      if (rotation === 0) {
        pathStr = `${IN} ${UP}`;
      } else {
        pathStr = `${IN} ${DOWN}`;
      }
      isDestroyed = false;
      break;

    case 'LASER':
      // Firing nozzle points UP (North) at rotation 0.
      if (rotation === 0) pathStr = `M 150 150 L 150 0`;     // North
      if (rotation === 1) pathStr = `M 150 150 L 300 150`;   // East
      if (rotation === 2) pathStr = `M 150 150 L 150 300`;   // South
      if (rotation === 3) pathStr = `M 150 150 L 0 150`;     // West
      isDestroyed = false;
      break;
  }

  return { pathStr, isDestroyed };
}

function renderSandbox(pieceKey) {
  const svgBoard = document.getElementById(`svg-sandbox-${pieceKey}`);
  if (!svgBoard) return;
  
  svgBoard.innerHTML = '';
  const state = tutorialStates[pieceKey];
  const CELL_SIZE = 100;

  const physics = calculatePhysics(pieceKey, state.rotation);

  // 1. Background Grid Layer
  const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x * CELL_SIZE);
      rect.setAttribute('y', y * CELL_SIZE);
      rect.setAttribute('width', CELL_SIZE);
      rect.setAttribute('height', CELL_SIZE);
      rect.setAttribute('fill', 'rgba(0,0,0,0.6)');
      rect.setAttribute('stroke', 'rgba(255,255,255,0.08)');
      rect.setAttribute('stroke-width', '2');
      gridGroup.appendChild(rect);
    }
  }
  svgBoard.appendChild(gridGroup);

  // 2. Laser Vector Layer
  const laserGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  
  const glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  glow.setAttribute('d', physics.pathStr);
  // Laser paths turn gray if the laser hits a dead piece
  glow.setAttribute('stroke', physics.isDestroyed ? 'rgba(100, 100, 100, 0.4)' : 'rgba(239, 68, 68, 0.4)'); 
  glow.setAttribute('stroke-width', '12');
  glow.setAttribute('fill', 'none');
  
  const core = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  core.setAttribute('d', physics.pathStr);
  core.setAttribute('stroke', physics.isDestroyed ? 'rgba(150, 150, 150, 1)' : 'rgba(248, 113, 113, 1)'); 
  core.setAttribute('stroke-width', '4');
  core.setAttribute('fill', 'none');

  laserGroup.appendChild(glow);
  laserGroup.appendChild(core);
  svgBoard.appendChild(laserGroup);

  // 3. Game Piece Sprite Layer
  const pieceGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  
  pieceGroup.style.transformOrigin = "150px 150px";
  pieceGroup.style.transform = `rotate(${state.rotation * 90}deg)`;
  pieceGroup.style.transition = "transform 0.2s ease-out, filter 0.3s ease-in-out";
  
  // Strict rule: Dead pieces turn gray
  if (physics.isDestroyed) {
    pieceGroup.style.filter = "grayscale(100%) brightness(0.5)";
  } else {
    pieceGroup.style.filter = "grayscale(0%) brightness(1) drop-shadow(0 4px 6px rgba(0,0,0,0.5))";
  }

  const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
  image.setAttribute('x', 110); 
  image.setAttribute('y', 110);
  image.setAttribute('width', 80);
  image.setAttribute('height', 80);
  
  const spritePath = `../pieces/blue${pieceKey.toLowerCase()}.png`;
  image.setAttribute('href', spritePath);
  image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', spritePath);
  
  pieceGroup.appendChild(image);
  svgBoard.appendChild(pieceGroup);
}
