/**
 * LASER CHESS - STANDALONE TUTORIALS ENGINE
 * Now equipped with simulated laser physics and destruction states.
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
 * Calculates laser path and asset destruction based on piece type and 90-deg rotations.
 * Assumes a laser is entering from the LEFT (West) heading RIGHT (East) into the center.
 */
function calculatePhysics(pieceKey, rotation) {
  let pathStr = ``;
  let isDestroyed = false;

  // Center coordinates of our 3x3 (300x300) grid
  const IN = `M 0 150 L 150 150`; 
  const UP = `L 150 0`;
  const DOWN = `L 150 300`;

  switch(pieceKey) {
    case 'KING':
      // The King has no defenses. Any hit is fatal.
      pathStr = IN;
      isDestroyed = true;
      break;

    case 'DEFENDER':
      // Assuming rotation 3 (facing West) puts the shield directly facing the incoming left laser.
      if (rotation === 3) {
        pathStr = IN; // Blocks it safely
        isDestroyed = false;
      } else {
        pathStr = IN; // Hits side/rear
        isDestroyed = true;
      }
      break;

    case 'DEFLECTOR':
      // Assuming rotation 0 (mirror facing NW) & rotation 3 (mirror facing SW)
      if (rotation === 0) {
        pathStr = `${IN} ${UP}`;
        isDestroyed = false;
      } else if (rotation === 3) {
        pathStr = `${IN} ${DOWN}`;
        isDestroyed = false;
      } else {
        // Rotations 1 and 2 expose the flat, unmirrored back/sides to the left
        pathStr = IN;
        isDestroyed = true;
      }
      break;

    case 'SWITCH':
      // Switches have double-sided diagonal mirrors and are invulnerable.
      if (rotation === 0 || rotation === 2) {
        pathStr = `${IN} ${UP}`;
      } else {
        pathStr = `${IN} ${DOWN}`;
      }
      isDestroyed = false;
      break;

    case 'LASER':
      // The laser piece doesn't receive a beam, it EMITS it based on rotation.
      if (rotation === 0) pathStr = `M 150 150 L 150 0`;     // Shoots North
      if (rotation === 1) pathStr = `M 150 150 L 300 150`;   // Shoots East
      if (rotation === 2) pathStr = `M 150 150 L 150 300`;   // Shoots South
      if (rotation === 3) pathStr = `M 150 150 L 0 150`;     // Shoots West
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

  // 1. Calculate the dynamic physics state
  const physics = calculatePhysics(pieceKey, state.rotation);

  // 2. LAYER A: Background Grid
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

  // 3. LAYER B: Dynamic Laser Path
  const laserGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  
  const glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  glow.setAttribute('d', physics.pathStr);
  glow.setAttribute('stroke', 'rgba(234, 179, 8, 0.3)'); 
  glow.setAttribute('stroke-width', '12');
  glow.setAttribute('fill', 'none');
  
  const core = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  core.setAttribute('d', physics.pathStr);
  core.setAttribute('stroke', 'rgba(253, 224, 71, 1)'); 
  core.setAttribute('stroke-width', '4');
  core.setAttribute('fill', 'none');

  laserGroup.appendChild(glow);
  laserGroup.appendChild(core);
  svgBoard.appendChild(laserGroup);

  // 4. LAYER C: Game Piece Sprite with Damage Feedback
  const pieceGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  
  pieceGroup.style.transformOrigin = "150px 150px";
  pieceGroup.style.transform = `rotate(${state.rotation * 90}deg)`;
  pieceGroup.style.transition = "transform 0.25s ease-in-out, filter 0.2s ease-in-out";
  
  // Apply visual destruction filter (turns red and glows) if the physics engine flagged it dead
  if (physics.isDestroyed) {
    pieceGroup.style.filter = "drop-shadow(0 0 15px rgba(255,0,0,0.9)) sepia(100%) hue-rotate(-50deg) saturate(500%)";
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
