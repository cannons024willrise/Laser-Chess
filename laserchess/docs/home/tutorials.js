/**
 * LASER CHESS - TUTORIALS ENGINE (EXACT ASSET ALIGNMENT MATCH)
 * Matched precisely to raw project image orientations.
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
 * Simulates path tracking based on actual uploaded graphic assets.
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
      // Native Asset: Shield is at the BOTTOM (Faces South) at rotation 0.
      // Rotation 1 (90° CW): Shield faces West (Blocks West laser safely!)
      // Rotation 2 (180° CW): Shield faces North (Vulnerable from West)
      // Rotation 3 (270° CW): Shield faces East (Vulnerable from West)
      if (rotation === 1) {
        pathStr = IN; 
        isDestroyed = false;
      } else {
        pathStr = THROUGH; 
        isDestroyed = true;
      }
      break;

    case 'DEFLECTOR':
      // Native Asset: Mirror runs Top-Left to Bottom-Right.
      // Rotation 0: Bounces West laser DOWN to South.
      // Rotation 1: Exposes unmirrored back walls to West laser.
      // Rotation 2: Bounces West laser UP to North.
      // Rotation 3: Exposes unmirrored back walls to West laser.
      if (rotation === 0) {
        pathStr = `${IN} ${DOWN}`;
        isDestroyed = false;
      } else if (rotation === 2) {
        pathStr = `${IN} ${UP}`;
        isDestroyed = false;
      } else {
        pathStr = IN;
        isDestroyed = true;
      }
      break;

    case 'SWITCH':
      // Double sided diagonal mirror. Never destroyed.
      if (rotation === 0 || rotation === 2) {
        pathStr = `${IN} ${DOWN}`;
      } else {
        pathStr = `${IN} ${UP}`;
      }
      isDestroyed = false;
      break;

    case 'LASER':
      // Native Asset: Firing nozzle points UP (North) at rotation 0.
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
  glow.setAttribute('stroke', 'rgba(239, 68, 68, 0.4)'); // Red/crimson laser path glow
  glow.setAttribute('stroke-width', '12');
  glow.setAttribute('fill', 'none');
  
  const core = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  core.setAttribute('d', physics.pathStr);
  core.setAttribute('stroke', 'rgba(248, 113, 113, 1)'); // High visibility core
  core.setAttribute('stroke-width', '4');
  core.setAttribute('fill', 'none');

  laserGroup.appendChild(glow);
  laserGroup.appendChild(core);
  svgBoard.appendChild(laserGroup);

  // 3. Game Piece Sprite Layer
  const pieceGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  
  pieceGroup.style.transformOrigin = "150px 150px";
  pieceGroup.style.transform = `rotate(${state.rotation * 90}deg)`;
  pieceGroup.style.transition = "transform 0.2s ease-out, filter 0.2s ease-in-out";
  
  // COLOR-CONSISTENT FEEDBACK: Preserves original piece blue/red integrity while projecting a structural hazard aura
  if (physics.isDestroyed) {
    pieceGroup.style.filter = "drop-shadow(0 0 16px rgba(220, 38, 38, 1)) brightness(1.1)";
  } else {
    pieceGroup.style.filter = "drop-shadow(0 4px 6px rgba(0,0,0,0.5))";
  }

  const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
  image.setAttribute('x', 110); 
  image.setAttribute('y', 110);
  image.setAttribute('width', 80);
  image.setAttribute('height', 80);
  
  // Dynamic lookup to the asset folder path shown in your filetree
  const spritePath = `../pieces/blue${pieceKey.toLowerCase()}.png`;
  image.setAttribute('href', spritePath);
  image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', spritePath);
  
  pieceGroup.appendChild(image);
  svgBoard.appendChild(pieceGroup);
}
