/**
 * LASER CHESS - TUTORIAL INTERACTIVE PHYSICS ENGINE
 * Complete integrated production build with a fully functional standalone multi-bounce 
 * Laser Raycasting Engine mapped exactly to the configurable interaction table.
 */

// 1. CONFIGURABLE PIECE INTERACTION MATRIX
// Maps the inbound direction of a laser beam to its deflection vector, absorption, or destruction behavior.
const PIECE_INTERACTION_TABLE = {
  KING: {
    0: { reflect: null, isDestroyed: true },
    1: { reflect: null, isDestroyed: true },
    2: { reflect: null, isDestroyed: true },
    3: { reflect: null, isDestroyed: true }
  },
  DEFENDER: {
    // Shield at bottom at rot 0. Struck from North -> Blocks safely.
    // In this tutorial sandbox, a mock West laser hits the piece.
    0: { reflect: 'EAST', isDestroyed: true },   // Laser passes through / destroys
    1: { reflect: null, isDestroyed: false },   // Shield faces West (Blocks safely!)
    2: { reflect: 'EAST', isDestroyed: true },   
    3: { reflect: 'EAST', isDestroyed: true }    
  },
  DEFLECTOR: {
    // Explicit Interaction Rules for Tutorial Laser from West:
    0: { reflect: 'NORTH', isDestroyed: false }, // Reflects UP
    1: { reflect: 'SOUTH', isDestroyed: false }, // Reflects DOWN
    2: { reflect: null, isDestroyed: true },     // Dies from West laser
    3: { reflect: 'SOUTH', isDestroyed: false }  // Inherits rotation 2's old active path (DOWN)
  },
  SWITCH: {
    // Companion double-sided mirror piece (Never destroyed):
    0: { reflect: 'NORTH', isDestroyed: false }, // Reflects UP
    1: { reflect: 'SOUTH', isDestroyed: false }, // Reflects DOWN
    2: { reflect: 'NORTH', isDestroyed: false }, // Reflects DOWN
    3: { reflect: 'SOUTH', isDestroyed: false }  // Reflects DOWN
  },
  LASER: {
    // Laser Emitter interactions if hit externally
    0: { reflect: null, isDestroyed: false },
    1: { reflect: null, isDestroyed: false },
    2: { reflect: null, isDestroyed: false },
    3: { reflect: null, isDestroyed: false }
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
 * STANDALONE TACTICAL LASER VECTOR ENGINE
 * Traces steps through a 3x3 sandbox space.
 * Automatically casts a laser ray originating from a real LASER SOURCE.
 */
function traceLaserEngine(targetPieceKey, targetRotation) {
  const CELL_SIZE = 100;
  
  // Define placement: Laser source resides at Cell (0, 1) [West Edge]. Target Piece resides at center (1, 1).
  let currentX = 0;
  let currentY = 1;
  
  // Establish direction vectors
  const directions = {
    NORTH: { dx: 0, dy: -1 },
    EAST:  { dx: 1, dy: 0 },
    SOUTH: { dx: 0, dy: 1 },
    WEST:  { dx: -1, dy: 0 }
  };

  // Determine starting firing direction based on the current Laser Source rotation state
  let laserSourceRotation = tutorialStates.LASER.rotation;
  if (targetPieceKey === 'LASER') {
    laserSourceRotation = targetRotation; // Dynamic sync if configuring the laser card itself
  }

  let currentDir = 'EAST'; // Initial sandbox traversal vectors
  if (laserSourceRotation === 0) currentDir = 'NORTH';
  if (laserSourceRotation === 1) currentDir = 'EAST';
  if (laserSourceRotation === 2) currentDir = 'SOUTH';
  if (laserSourceRotation === 3) currentDir = 'WEST';

  // Laser beam coordinates array initialization
  let startX = currentX * CELL_SIZE + CELL_SIZE / 2;
  let startY = currentY * CELL_SIZE + CELL_SIZE / 2;
  let points = [[startX, startY]];
  
  let isDestroyed = false;
  let steps = 0;
  const maxSteps = 10;

  while (steps < maxSteps) {
    steps++;
    let vec = directions[currentDir];
    
    // Move to next cell center or edge point boundaries
    let nextX = currentX + vec.dx;
    let nextY = currentY + vec.dy;
    
    let targetX = nextX * CELL_SIZE + CELL_SIZE / 2;
    let targetY = nextY * CELL_SIZE + CELL_SIZE / 2;

    // Check bounds. If leaving the 3x3 sandbox, terminate segment at edge
    if (nextX < 0 || nextX > 2 || nextY < 0 || nextY > 2) {
      let edgeX = startX + vec.dx * (CELL_SIZE * 1.5);
      let edgeY = startY + vec.dy * (CELL_SIZE * 1.5);
      points.push([edgeX, edgeY]);
      break;
    }

    // Append standard traversal grid vertex point
    points.push([targetX, targetY]);
    currentX = nextX;
    currentY = nextY;

    // Interaction point check: Center grid cell (1, 1) contains the sandbox element
    if (currentX === 1 && currentY === 1 && targetPieceKey !== 'LASER') {
      const config = PIECE_INTERACTION_TABLE[targetPieceKey]?.[targetRotation];
      
      if (config) {
        if (config.isDestroyed) {
          isDestroyed = true;
          break; // Absorbed and terminated upon collision explosion
        }
        if (config.reflect === null) {
          break; // Safely blocked or absorbed cleanly (e.g. Defender shield)
        }
        currentDir = config.reflect; // Modify ray projection trajectory
      }
    }

    startX = targetX;
    startY = targetY;
  }

  // Compile coordinates matrix into standard SVG Path definition string
  let pathStr = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    pathStr += ` L ${points[i][0]} ${points[i][1]}`;
  }

  return { pathStr, isDestroyed };
}

function renderSandbox(pieceKey) {
  const svgBoard = document.getElementById(`svg-sandbox-${pieceKey}`);
  if (!svgBoard) return;
  
  svgBoard.innerHTML = '';
  const state = tutorialStates[pieceKey];
  const CELL_SIZE = 100;

  // Run tracking calculations directly from the ported Laser Engine
  const physics = traceLaserEngine(pieceKey, state.rotation);

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

  // 3. Render Sandbox Piece Entities
  // Render Laser Source Node at Cell (0, 1) unless current card is testing the Laser piece directly
  if (pieceKey !== 'LASER') {
    const laserSrcGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    laserSrcGroup.style.transformOrigin = "50px 150px";
    laserSrcGroup.style.transform = `rotate(${tutorialStates.LASER.rotation * 90}deg)`;
    
    const laserImg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    laserImg.setAttribute('x', 5);
    laserImg.setAttribute('y', 105);
    laserImg.setAttribute('width', 90);
    laserImg.setAttribute('height', 90);
    laserImg.setAttribute('href', `../pieces/bluelaser.png`);
    laserSrcGroup.appendChild(laserImg);
    svgBoard.appendChild(laserSrcGroup);
  }

  // Render Target Sandbox Interactive Element at center Cell (1, 1)
  const pieceGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  pieceGroup.style.transformOrigin = "150px 150px";
  pieceGroup.style.transform = `rotate(${state.rotation * 90}deg)`;
  pieceGroup.style.transition = "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease-in-out";
  
  // Rule Compliance: Gray out when destroyed state matrix is triggered
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
