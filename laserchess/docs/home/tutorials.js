/**
 * LASER CHESS - TUTORIAL INTERACTIVE PHYSICS ENGINE (FULL LOGICAL ALIGNMENT)
 * Standalone raycasting engine supporting configurable laser fire directions and exact piece interaction states.
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
    // Companion double-sided mirror piece (Never destroyed, perfectly inverted table mapping):
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
  KING: { rotation: 0, laserSourceDir: 'WEST' },
  DEFENDER: { rotation: 0, laserSourceDir: 'WEST' },
  DEFLECTOR: { rotation: 0, laserSourceDir: 'WEST' },
  SWITCH: { rotation: 0, laserSourceDir: 'WEST' },
  LASER: { rotation: 0 }
};

window.togglePieceTutorial = function(cardElement, pieceKey) {
  if (window.event && (window.event.target.tagName === 'BUTTON' || window.event.target.tagName === 'SELECT')) return;

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

window.changeLaserSourceDirection = function(pieceKey, selectElement) {
  const state = tutorialStates[pieceKey];
  if (state) {
    state.laserSourceDir = selectElement.value;
    renderSandbox(pieceKey);
  }
};

/**
 * STANDALONE TACTICAL LASER VECTOR ENGINE
 * Simulates path trajectories through a 3x3 sandbox grid.
 */
function traceLaserEngine(pieceKey, currentRotation) {
  const CELL_SIZE = 100;
  let currentX, currentY, currentDir;

  const directions = {
    NORTH: { dx: 0, dy: -1 },
    EAST:  { dx: 1, dy: 0 },
    SOUTH: { dx: 0, dy: 1 },
    WEST:  { dx: -1, dy: 0 }
  };

  if (pieceKey === 'LASER') {
    // Laser card fires directly from the center node matching its piece rotation
    currentX = 1;
    currentY = 1;
    if (currentRotation === 0) currentDir = 'NORTH';
    if (currentRotation === 1) currentDir = 'EAST';
    if (currentRotation === 2) currentDir = 'SOUTH';
    if (currentRotation === 3) currentDir = 'WEST';
  } else {
    // Configurable laser emitter injection positions matching selector direction rules
    const srcDir = tutorialStates[pieceKey].laserSourceDir || 'WEST';
    if (srcDir === 'WEST')  { currentX = 0; currentY = 1; currentDir = 'EAST'; }
    if (srcDir === 'NORTH') { currentX = 1; currentY = 0; currentDir = 'SOUTH'; }
    if (srcDir === 'EAST')  { currentX = 2; currentY = 1; currentDir = 'WEST'; }
    if (srcDir === 'SOUTH') { currentX = 1; currentY = 2; currentDir = 'NORTH'; }
  }

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

    // Check Outer Boundaries termination segment
    if (nextX < 0 || nextX > 2 || nextY < 0 || nextY > 2) {
      let edgeX = startX + vec.dx * (CELL_SIZE * 1.5);
      let edgeY = startY + vec.dy * (CELL_SIZE * 1.5);
      points.push([edgeX, edgeY]);
      break;
    }

    points.push([targetX, targetY]);
    currentX = nextX;
    currentY = nextY;

    // Trigger grid hit verification segment if crossing the center node (1,1)
    if (currentX === 1 && currentY === 1 && pieceKey !== 'LASER') {
      let inboundDir = 'WEST';
      if (currentDir === 'NORTH') inboundDir = 'SOUTH';
      if (currentDir === 'SOUTH') inboundDir = 'NORTH';
      if (currentDir === 'EAST') inboundDir = 'WEST';
      if (currentDir === 'WEST') inboundDir = 'EAST';

      const matrix = PIECE_INTERACTION_TABLE[pieceKey];
      const cellConfig = matrix?.[inboundDir]?.[currentRotation] || matrix?.[inboundDir];

      if (cellConfig) {
        if (cellConfig.isDestroyed) {
          isDestroyed = true;
          break;
        }
        if (cellConfig.reflect === null) {
          break; 
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

  // 1. Grid Background
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

  // 2. Vector Laser Rendering Layers
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

  // 3. Render Node Elements
  if (pieceKey !== 'LASER') {
    // Dynamic External Laser Source placement configurations
    const srcDir = state.laserSourceDir || 'WEST';
    let srcX = 5, srcY = 105, srcRot = 1; // Default matching West -> firing East
    
    if (srcDir === 'NORTH') { srcX = 105; srcY = 5;   srcRot = 2; }
    if (srcDir === 'EAST')  { srcX = 205; srcY = 105; srcRot = 3; }
    if (srcDir === 'SOUTH') { srcX = 105; srcY = 205; srcRot = 0; }

    const laserSrcGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    laserSrcGroup.style.transformOrigin = `${srcX + 45}px ${srcY + 45}px`;
    laserSrcGroup.style.transform = `rotate(${srcRot * 90}deg)`;
    
    const laserImg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    laserImg.setAttribute('x', srcX);
    laserImg.setAttribute('y', srcY);
    laserImg.setAttribute('width', 90);
    laserImg.setAttribute('height', 90);
    laserImg.setAttribute('href', `../pieces/bluelaser.png`);
    laserSrcGroup.appendChild(laserImg);
    svgBoard.appendChild(laserSrcGroup);

    // Target configuration controls drop selector setup block
    let controlsContainer = svgBoard.nextElementSibling;
    if (!controlsContainer || !controlsContainer.classList.contains('laser-direction-controls')) {
      if (controlsContainer) controlsContainer.remove();
      
      controlsContainer = document.createElement('div');
      controlsContainer.className = "laser-direction-controls mt-4 p-3 bg-black/40 border border-white/5 flex flex-col gap-3 rounded";
      controlsContainer.innerHTML = `
        <div class="flex items-center justify-between text-[11px] uppercase font-bold tracking-wider">
          <span class="text-gray-400">Laser Inbound Vector:</span>
          <select onchange="changeLaserSourceDirection('${pieceKey}', this)" class="bg-black border border-white/20 text-theme text-[10px] p-1 rounded font-mono uppercase">
            <option value="WEST" ${srcDir === 'WEST' ? 'selected' : ''}>WEST (Hits Left)</option>
            <option value="NORTH" ${srcDir === 'NORTH' ? 'selected' : ''}>NORTH (Hits Top)</option>
            <option value="EAST" ${srcDir === 'EAST' ? 'selected' : ''}>EAST (Hits Right)</option>
            <option value="SOUTH" ${srcDir === 'SOUTH' ? 'selected' : ''}>SOUTH (Hits Bottom)</option>
          </select>
        </div>
      `;
      svgBoard.parentNode.insertBefore(controlsContainer, svgBoard.nextSibling);
    }

    // Target piece rendering at position cell (1,1)
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
    // Cleaning any dangling controls container instances left over on the laser card view bounds
    let controlsContainer = svgBoard.nextElementSibling;
    if (controlsContainer && controlsContainer.classList.contains('laser-direction-controls')) {
      controlsContainer.remove();
    }

    // Render Laser piece strictly at the center layout location cell (1, 1) without duplicated sub nodes
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
