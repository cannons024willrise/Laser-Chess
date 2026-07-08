/**
 * LASER CHESS - TUTORIAL INTERACTIVE PHYSICS ENGINE (COMPREHENSIVE UPGRADE)
 * Full standalone raycasting supporting piece selection and targeted dual-rotations.
 */

// 1. CONFIGURABLE PIECE INTERACTION MATRIX
// Maps the inbound direction of a laser beam to its deflection vector, absorption, or destruction behavior.
const PIECE_INTERACTION_TABLE = {
  KING: {
    NORTH: { reflect: null, isDestroyed: true },
    EAST:  { reflect: null, isDestroyed: true },
    SOUTH: { reflect: null, isDestroyed: true },
    WEST:  { reflect: null, isDestroyed: true }
  },
  DEFENDER: {
    // Shield at bottom at rot 0 (Faces South). Struck from South -> Blocks safely.
    // rotation 0: Shield faces South (Blocks SOUTH laser safely)
    // rotation 1: Shield faces West  (Blocks WEST laser safely)
    // rotation 2: Shield faces North (Blocks NORTH laser safely)
    // rotation 3: Shield faces East  (Blocks EAST laser safely)
    NORTH: {
      0: { reflect: 'NORTH', isDestroyed: true },
      1: { reflect: 'NORTH', isDestroyed: true },
      2: { reflect: null, isDestroyed: false },
      3: { reflect: 'NORTH', isDestroyed: true }
    },
    EAST: {
      0: { reflect: 'EAST', isDestroyed: true },
      1: { reflect: 'EAST', isDestroyed: true },
      2: { reflect: 'EAST', isDestroyed: true },
      3: { reflect: null, isDestroyed: false }
    },
    SOUTH: {
      0: { reflect: null, isDestroyed: false },
      1: { reflect: 'SOUTH', isDestroyed: true },
      2: { reflect: 'SOUTH', isDestroyed: true },
      3: { reflect: 'SOUTH', isDestroyed: true }
    },
    WEST: {
      0: { reflect: 'EAST', isDestroyed: true },
      1: { reflect: null, isDestroyed: false },
      2: { reflect: 'EAST', isDestroyed: true },
      3: { reflect: 'EAST', isDestroyed: true }
    }
  },
  DEFLECTOR: {
    // Explicit Interaction Rules for Deflector:
    // When hit from WEST: Rot 0 -> UP, Rot 1 -> DOWN, Rot 2 -> DIE, Rot 3 -> DOWN
    WEST: {
      0: { reflect: 'NORTH', isDestroyed: false },
      1: { reflect: 'SOUTH', isDestroyed: false },
      2: { reflect: null, isDestroyed: true },
      3: { reflect: 'SOUTH', isDestroyed: false }
    },
    NORTH: {
      0: { reflect: 'WEST', isDestroyed: false },
      1: { reflect: null, isDestroyed: true },
      2: { reflect: 'EAST', isDestroyed: false },
      3: { reflect: 'EAST', isDestroyed: false }
    },
    EAST: {
      0: { reflect: null, isDestroyed: true },
      1: { reflect: 'NORTH', isDestroyed: false },
      2: { reflect: 'SOUTH', isDestroyed: false },
      3: { reflect: 'SOUTH', isDestroyed: false }
    },
    SOUTH: {
      0: { reflect: 'EAST', isDestroyed: false },
      1: { reflect: 'EAST', isDestroyed: false },
      2: { reflect: 'WEST', isDestroyed: false },
      3: { reflect: null, isDestroyed: true }
    }
  },
  SWITCH: {
    // Companion double-sided mirror piece (Never destroyed):
    WEST: {
      0: { reflect: 'NORTH', isDestroyed: false },
      1: { reflect: 'SOUTH', isDestroyed: false },
      2: { reflect: 'SOUTH', isDestroyed: false },
      3: { reflect: 'SOUTH', isDestroyed: false }
    },
    NORTH: {
      0: { reflect: 'WEST', isDestroyed: false },
      1: { reflect: 'EAST', isDestroyed: false },
      2: { reflect: 'EAST', isDestroyed: false },
      3: { reflect: 'EAST', isDestroyed: false }
    },
    EAST: {
      0: { reflect: 'SOUTH', isDestroyed: false },
      1: { reflect: 'NORTH', isDestroyed: false },
      2: { reflect: 'SOUTH', isDestroyed: false },
      3: { reflect: 'SOUTH', isDestroyed: false }
    },
    SOUTH: {
      0: { reflect: 'EAST', isDestroyed: false },
      1: { reflect: 'EAST', isDestroyed: false },
      2: { reflect: 'WEST', isDestroyed: false },
      3: { reflect: 'EAST', isDestroyed: false }
    }
  }
};

const tutorialStates = {
  KING: { rotation: 0 },
  DEFENDER: { rotation: 0 },
  DEFLECTOR: { rotation: 0 },
  SWITCH: { rotation: 0 },
  LASER: { rotation: 0, targetPiece: 'KING', targetRotation: 0 }
};

window.togglePieceTutorial = function(cardElement, pieceKey) {
  if (window.event && window.event.target.tagName === 'BUTTON' || window.event?.target.tagName === 'SELECT') return;

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

// Specialized targeting rotations for the flexible Laser card controls
window.rotateLaserTarget = function(direction) {
  if (window.event) window.event.stopPropagation();
  const state = tutorialStates.LASER;
  state.targetRotation = (state.targetRotation + direction + 4) % 4;
  renderSandbox('LASER');
};

window.changeLaserTargetPiece = function(selectElement) {
  const state = tutorialStates.LASER;
  state.targetPiece = selectElement.value;
  renderSandbox('LASER');
};

/**
 * STANDALONE TACTICAL LASER VECTOR ENGINE
 * Simulates complete structural step raycasting through the sandbox matrix.
 */
function traceLaserEngine(targetPieceKey, currentRotation) {
  const CELL_SIZE = 100;
  
  // Laser source node occupies Cell (0, 1) [West Edge]. Target occupies Center (1, 1).
  let currentX = 0;
  let currentY = 1;
  
  const directions = {
    NORTH: { dx: 0, dy: -1 },
    EAST:  { dx: 1, dy: 0 },
    SOUTH: { dx: 0, dy: 1 },
    WEST:  { dx: -1, dy: 0 }
  };

  // Extract variables depending on which sandbox card we are executing inside
  let laserRot = (targetPieceKey === 'LASER') ? currentRotation : tutorialStates.LASER.rotation;
  let targetKey = (targetPieceKey === 'LASER') ? tutorialStates.LASER.targetPiece : targetPieceKey;
  let targetRot = (targetPieceKey === 'LASER') ? tutorialStates.LASER.targetRotation : currentRotation;

  // Determine starting path vector based on Laser Emitter rotation
  let currentDir = 'EAST';
  if (laserRot === 0) currentDir = 'NORTH';
  if (laserRot === 1) currentDir = 'EAST';
  if (laserRot === 2) currentDir = 'SOUTH';
  if (laserRot === 3) currentDir = 'WEST';

  let startX = currentX * CELL_SIZE + CELL_SIZE / 2;
  let startY = currentY * CELL_SIZE + CELL_SIZE / 2;
  let points = [[startX, startY]];
  
  let isDestroyed = false;
  let steps = 0;
  const maxSteps = 10;

  while (steps < maxSteps) {
    steps++;
    let vec = directions[currentDir];
    if (!vec) break;
    
    let nextX = currentX + vec.dx;
    let nextY = currentY + vec.dy;
    
    let targetX = nextX * CELL_SIZE + CELL_SIZE / 2;
    let targetY = nextY * CELL_SIZE + CELL_SIZE / 2;

    // Outer edge boundaries termination check
    if (nextX < 0 || nextX > 2 || nextY < 0 || nextY > 2) {
      let edgeX = startX + vec.dx * (CELL_SIZE * 1.5);
      let edgeY = startY + vec.dy * (CELL_SIZE * 1.5);
      points.push([edgeX, edgeY]);
      break;
    }

    points.push([targetX, targetY]);
    currentX = nextX;
    currentY = nextY;

    // Hit registration logic at central grid point (1, 1)
    if (currentX === 1 && currentY === 1 && targetPieceKey !== 'LASER') {
      // Inbound direction of laser hitting target piece (the opposite of traveling direction)
      let inboundDir = 'WEST';
      if (currentDir === 'NORTH') inboundDir = 'SOUTH';
      if (currentDir === 'SOUTH') inboundDir = 'NORTH';
      if (currentDir === 'EAST') inboundDir = 'WEST';
      if (currentDir === 'WEST') inboundDir = 'EAST';

      const matrix = PIECE_INTERACTION_TABLE[targetKey];
      const cellConfig = matrix?.[inboundDir]?.[targetRot] || matrix?.[inboundDir];

      if (cellConfig) {
        if (cellConfig.isDestroyed) {
          isDestroyed = true;
          break;
        }
        if (cellConfig.reflect === null) {
          break; // Blocked cleanly by shield or wall
        }
        currentDir = cellConfig.reflect;
      }
    }

    startX = targetX;
    startY = targetY;
  }

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

  const physics = traceLaserEngine(pieceKey, state.rotation);

  // 1. Grid Layer
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

  // 2. Laser Ray Vector Layer
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

  // 3. Render Game Pieces
  if (pieceKey !== 'LASER') {
    // Standard Card layout: Laser static at (0, 1) and piece at Center (1, 1)
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

    // Target piece at center
    const pieceGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    pieceGroup.style.transformOrigin = "150px 150px";
    pieceGroup.style.transform = `rotate(${state.rotation * 90}deg)`;
    pieceGroup.style.transition = "transform 0.25s ease-out, filter 0.3s ease-in-out";
    
    if (physics.isDestroyed) {
      pieceGroup.style.filter = "grayscale(100%) brightness(0.4)";
    } else {
      pieceGroup.style.filter = "grayscale(0%) brightness(1.05) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.6))";
    }

    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttribute('x', 105); 
    image.setAttribute('y', 105);
    image.setAttribute('width', 90);
    image.setAttribute('height', 90);
    image.setAttribute('href', `../pieces/blue${pieceKey.toLowerCase()}.png`);
    
    pieceGroup.appendChild(image);
    svgBoard.appendChild(pieceGroup);

  } else {
    // Laser Card Advanced Target Controls Layout Builder: Inject dynamically into UI if it doesn't exist
    let controlsContainer = svgBoard.nextElementSibling;
    if (!controlsContainer || !controlsContainer.classList.contains('laser-dynamic-controls')) {
      if (controlsContainer) controlsContainer.remove();
      
      controlsContainer = document.createElement('div');
      controlsContainer.className = "laser-dynamic-controls mt-4 p-3 bg-black/40 border border-white/5 flex flex-col gap-3 rounded";
      controlsContainer.innerHTML = `
        <div class="flex items-center justify-between text-[11px] uppercase font-bold tracking-wider">
          <span class="text-gray-400">Spawn Target Piece:</span>
          <select onchange="changeLaserTargetPiece(this)" class="bg-black border border-white/20 text-theme text-[10px] p-1 rounded font-mono uppercase">
            <option value="KING" ${state.targetPiece === 'KING' ? 'selected' : ''}>KING</option>
            <option value="DEFENDER" ${state.targetPiece === 'DEFENDER' ? 'selected' : ''}>DEFENDER</option>
            <option value="DEFLECTOR" ${state.targetPiece === 'DEFLECTOR' ? 'selected' : ''}>DEFLECTOR</option>
            <option value="SWITCH" ${state.targetPiece === 'SWITCH' ? 'selected' : ''}>SWITCH</option>
          </select>
        </div>
        <div class="flex items-center justify-between text-[11px] uppercase font-bold tracking-wider">
          <span class="text-gray-400">Target Orientation:</span>
          <div class="flex gap-1">
            <button onclick="rotateLaserTarget(-1)" class="bg-white/10 hover:bg-white/20 text-white px-2 py-1 text-[9px] font-bold font-mono rounded">ROT L</button>
            <button onclick="rotateLaserTarget(1)" class="bg-white/10 hover:bg-white/20 text-white px-2 py-1 text-[9px] font-bold font-mono rounded">ROT R</button>
          </div>
        </div>
      `;
      svgBoard.parentNode.insertBefore(controlsContainer, svgBoard.nextSibling);
    }

    // Render Laser piece inside center position
    const laserSrcGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    laserSrcGroup.style.transformOrigin = "150px 150px";
    laserSrcGroup.style.transform = `rotate(${state.rotation * 90}deg)`;
    
    const laserImg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    laserImg.setAttribute('x', 105);
    laserImg.setAttribute('y', 105);
    laserImg.setAttribute('width', 90);
    laserImg.setAttribute('height', 90);
    laserImg.setAttribute('href', `../pieces/bluelaser.png`);
    laserSrcGroup.appendChild(laserImg);
    svgBoard.appendChild(laserSrcGroup);
  }
}
