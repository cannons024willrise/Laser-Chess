/**
 * LASER CHESS - TUTORIAL INTERACTIVE PHYSICS ENGINE
 * Refactored Event Architecture: Guaranteed DOM Hydration and strict event propagation isolation.
 */

// 1. CONFIGURABLE PIECE INTERACTION MATRIX
// =========================================================================
const PIECE_INTERACTION_TABLE = {
  KING: {
    NORTH: { 0: { reflect: null, isDestroyed: true }, 1: { reflect: null, isDestroyed: true }, 2: { reflect: null, isDestroyed: true }, 3: { reflect: null, isDestroyed: true } },
    EAST:  { 0: { reflect: null, isDestroyed: true }, 1: { reflect: null, isDestroyed: true }, 2: { reflect: null, isDestroyed: true }, 3: { reflect: null, isDestroyed: true } },
    SOUTH: { 0: { reflect: null, isDestroyed: true }, 1: { reflect: null, isDestroyed: true }, 2: { reflect: null, isDestroyed: true }, 3: { reflect: null, isDestroyed: true } },
    WEST:  { 0: { reflect: null, isDestroyed: true }, 1: { reflect: null, isDestroyed: true }, 2: { reflect: null, isDestroyed: true }, 3: { reflect: null, isDestroyed: true } }
  },
  DEFENDER: {
    NORTH: { 0: { reflect: null, isDestroyed: true }, 1: { reflect: null, isDestroyed: true }, 2: { reflect: null, isDestroyed: false }, 3: { reflect: null, isDestroyed: true } },
    EAST:  { 0: { reflect: null, isDestroyed: true }, 1: { reflect: null, isDestroyed: true }, 2: { reflect: null, isDestroyed: true }, 3: { reflect: null, isDestroyed: false } },
    SOUTH: { 0: { reflect: null, isDestroyed: false }, 1: { reflect: null, isDestroyed: true }, 2: { reflect: null, isDestroyed: true }, 3: { reflect: null, isDestroyed: true } },
    WEST:  { 0: { reflect: null, isDestroyed: true }, 1: { reflect: null, isDestroyed: false }, 2: { reflect: null, isDestroyed: true }, 3: { reflect: null, isDestroyed: true } }
  },
  DEFLECTOR: {
    WEST:  { 0: { reflect: null, isDestroyed: true }, 1: { reflect: null, isDestroyed: true }, 2: { reflect: 'SOUTH', isDestroyed: false }, 3: { reflect: 'NORTH', isDestroyed: false } },
    NORTH: { 0: { reflect: 'EAST', isDestroyed: false }, 1: { reflect: null, isDestroyed: true }, 2: { reflect: null, isDestroyed: true }, 3: { reflect: 'WEST', isDestroyed: false } },
    EAST:  { 0: { reflect: 'NORTH', isDestroyed: false }, 1: { reflect: 'SOUTH', isDestroyed: false }, 2: { reflect: null, isDestroyed: true }, 3: { reflect: null, isDestroyed: true } },
    SOUTH: { 0: { reflect: null, isDestroyed: true }, 1: { reflect: 'EAST', isDestroyed: false }, 2: { reflect: 'WEST', isDestroyed: false }, 3: { reflect: null, isDestroyed: true } }
  },
  SWITCH: {
    WEST:  { 0: { reflect: 'NORTH', isDestroyed: false }, 1: { reflect: 'SOUTH', isDestroyed: false }, 2: { reflect: 'NORTH', isDestroyed: false }, 3: { reflect: 'SOUTH', isDestroyed: false } },
    NORTH: { 0: { reflect: 'WEST', isDestroyed: false }, 1: { reflect: 'EAST', isDestroyed: false }, 2: { reflect: 'WEST', isDestroyed: false }, 3: { reflect: 'EAST', isDestroyed: false } },
    EAST:  { 0: { reflect: 'SOUTH', isDestroyed: false }, 1: { reflect: 'NORTH', isDestroyed: false }, 2: { reflect: 'SOUTH', isDestroyed: false }, 3: { reflect: 'NORTH', isDestroyed: false } },
    SOUTH: { 0: { reflect: 'EAST', isDestroyed: false }, 1: { reflect: 'WEST', isDestroyed: false }, 2: { reflect: 'EAST', isDestroyed: false }, 3: { reflect: 'WEST', isDestroyed: false } }
  }
};

const tutorialStates = {
  KING: { rotation: 0, activePieceType: 'KING', gridX: 1, gridY: 1, laserRotation: 1, laserX: 0, laserY: 1, selectedEntity: 'PIECE' },
  DEFENDER: { rotation: 0, activePieceType: 'DEFENDER', gridX: 1, gridY: 1, laserRotation: 1, laserX: 0, laserY: 1, selectedEntity: 'PIECE' },
  DEFLECTOR: { rotation: 0, activePieceType: 'DEFLECTOR', gridX: 1, gridY: 1, laserRotation: 1, laserX: 0, laserY: 1, selectedEntity: 'PIECE' },
  SWITCH: { rotation: 0, activePieceType: 'SWITCH', gridX: 1, gridY: 1, laserRotation: 1, laserX: 0, laserY: 1, selectedEntity: 'PIECE' },
  LASER: { rotation: 0, activePieceType: 'LASER', gridX: 1, gridY: 1, selectedEntity: 'LASER' }
};

// 3. AUTOMATIC DOM HYDRATION ENGINE (BULLETPROOF EVENT DELEGATION)
// =========================================================================
function hydrateTutorialCards() {
  document.querySelectorAll('.rule-card').forEach(card => {
    // 1. Tag element to guarantee we don't bind duplicate click listeners on hot reloads
    if (card.dataset.hydrated === 'true') return;
    card.dataset.hydrated = 'true';

    const h4 = card.querySelector('h4');
    if (!h4) return;
    
    const pieceKey = h4.textContent.trim().toUpperCase();
    if (!tutorialStates[pieceKey]) return;
    
    card.classList.add('cursor-pointer', 'hover:border-theme/40', 'transition-all');
    
    // 2. Build the Sandbox Container Safely
    let sandboxContainer = card.querySelector('.sandbox-container');
    if (!sandboxContainer) {
      sandboxContainer = document.createElement('div');
      sandboxContainer.className = 'sandbox-container hidden mt-6 pt-6 border-t border-white/10 flex flex-col items-center';
      
      const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgElement.id = `svg-sandbox-${pieceKey}`;
      svgElement.setAttribute('width', '300');
      svgElement.setAttribute('height', '300');
      svgElement.setAttribute('viewBox', '0 0 300 300');
      svgElement.className = 'bg-black/80 border border-white/10 rounded shadow-2xl';
      
      sandboxContainer.appendChild(svgElement);
      card.appendChild(sandboxContainer);
    }

    // 3. ARCHITECTURE FIX: Stop all interaction clicks from bleeding out to the parent card
    sandboxContainer.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // 4. Clean Click Listener: Toggles this specific card and hides the others
    card.addEventListener('click', () => {
      const isHidden = sandboxContainer.classList.contains('hidden');
      
      document.querySelectorAll('.sandbox-container').forEach(el => {
        el.classList.add('hidden');
      });

      if (isHidden) {
        sandboxContainer.classList.remove('hidden');
        renderSandbox(pieceKey); 
      }
    });
  });
}

// Bypass framework loading issues by verifying execution
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hydrateTutorialCards);
} else {
  hydrateTutorialCards();
}

// 4. CORE ACTION HANDLERS
// =========================================================================
// Because we isolated the event scope with stopPropagation(), these functions
// no longer need to manually block UI clicks or pass 'event' parameters.

window.rotateTutorialPiece = function(pieceKey, direction) {
  const state = tutorialStates[pieceKey];
  if (!state) return;

  if (pieceKey === 'LASER' || state.selectedEntity === 'PIECE') {
    state.rotation = (state.rotation + direction + 4) % 4;
  } else if (state.selectedEntity === 'LASER') {
    state.laserRotation = (state.laserRotation + direction + 4) % 4;
  }
  
  renderSandbox(pieceKey);
};

window.selectTutorialEntity = function(pieceKey, entity) {
  const state = tutorialStates[pieceKey];
  if (state) {
    state.selectedEntity = entity;
    renderSandbox(pieceKey);
  }
};

window.handleGridCellClick = function(pieceKey, x, y) {
  const state = tutorialStates[pieceKey];
  if (!state) return;

  if (pieceKey === 'LASER' || state.selectedEntity === 'PIECE') {
    if (pieceKey !== 'LASER' && x === state.laserX && y === state.laserY) return;
    
    if (pieceKey !== 'LASER') {
      const deltaX = Math.abs(x - state.gridX);
      const deltaY = Math.abs(y - state.gridY);
      if (deltaX > 1 || deltaY > 1) return; 
    }
    
    state.gridX = x;
    state.gridY = y;
  } else if (state.selectedEntity === 'LASER') {
    if (x === state.gridX && y === state.gridY) return;
    state.laserX = x;
    state.laserY = y;
  }

  renderSandbox(pieceKey);
};

window.changeSandboxPieceType = function(pieceKey, selectElement) {
  const state = tutorialStates[pieceKey];
  if (state) {
    state.activePieceType = selectElement.value;
    renderSandbox(pieceKey);
  }
};

// 5. RAYCAST PHYSICS CORE ENGINE
// =========================================================================
function traceLaserEngine(pieceKey) {
  const CELL_SIZE = 100;
  const state = tutorialStates[pieceKey];
  let currentX, currentY, currentDir;

  const directions = {
    NORTH: { dx: 0, dy: -1 },
    EAST:  { dx: 1, dy: 0 },
    SOUTH: { dx: 0, dy: 1 },
    WEST:  { dx: -1, dy: 0 }
  };

  if (pieceKey === 'LASER') {
    currentX = state.gridX;
    currentY = state.gridY;
    currentDir = ['NORTH', 'EAST', 'SOUTH', 'WEST'][state.rotation];
  } else {
    currentX = state.laserX;
    currentY = state.laserY;
    currentDir = ['NORTH', 'EAST', 'SOUTH', 'WEST'][state.laserRotation];
  }

  let startX = currentX * CELL_SIZE + CELL_SIZE / 2;
  let startY = currentY * CELL_SIZE + CELL_SIZE / 2;
  let points = [[startX, startY]];
  
  let isDestroyed = false;
  let steps = 0;
  const maxSteps = 12;

  while (steps < maxSteps) {
    steps++;
    let vec = directions[currentDir];
    if (!vec) break;
    
    let nextX = currentX + vec.dx;
    let nextY = currentY + vec.dy;
    
    let targetX = nextX * CELL_SIZE + CELL_SIZE / 2;
    let targetY = nextY * CELL_SIZE + CELL_SIZE / 2;

    if (nextX < 0 || nextX > 2 || nextY < 0 || nextY > 2) {
      points.push([startX + vec.dx * (CELL_SIZE * 1.5), startY + vec.dy * (CELL_SIZE * 1.5)]);
      break;
    }

    points.push([targetX, targetY]);
    currentX = nextX;
    currentY = nextY;

    if (currentX === state.gridX && currentY === state.gridY && pieceKey !== 'LASER') {
      let inboundDir = { NORTH: 'SOUTH', SOUTH: 'NORTH', EAST: 'WEST', WEST: 'EAST' }[currentDir];
      const matrix = PIECE_INTERACTION_TABLE[state.activePieceType];
      const cellConfig = matrix?.[inboundDir]?.[state.rotation];

      if (cellConfig) {
        if (cellConfig.isDestroyed) {
          isDestroyed = true;
          break;
        }
        if (cellConfig.reflect === null) break; 
        currentDir = cellConfig.reflect;
      }
    }
    startX = targetX;
    startY = targetY;
  }

  let pathStr = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) pathStr += ` L ${points[i][0]} ${points[i][1]}`;
  return { pathStr, isDestroyed };
}

// 6. VECTOR GRAPHICS RENDERING MATRIX
// =========================================================================
function renderSandbox(pieceKey) {
  const svgBoard = document.getElementById(`svg-sandbox-${pieceKey}`);
  if (!svgBoard) return;
  
  svgBoard.innerHTML = '';
  const state = tutorialStates[pieceKey];
  const CELL_SIZE = 100;
  const physics = traceLaserEngine(pieceKey);
  const isLaserSandbox = pieceKey === 'LASER';

  // Render Layout Cells 
  const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x * CELL_SIZE);
      rect.setAttribute('y', y * CELL_SIZE);
      rect.setAttribute('width', CELL_SIZE);
      rect.setAttribute('height', CELL_SIZE);
      
      let isWithinRange = Math.abs(x - state.gridX) <= 1 && Math.abs(y - state.gridY) <= 1;
      if (!isLaserSandbox && state.selectedEntity === 'PIECE' && isWithinRange) {
        rect.setAttribute('fill', 'rgba(3, 233, 244, 0.08)');
        rect.setAttribute('stroke', 'rgba(3, 233, 244, 0.15)');
      } else {
        rect.setAttribute('fill', 'rgba(0, 0, 0, 0.65)');
        rect.setAttribute('stroke', 'rgba(255, 255, 255, 0.05)');
      }
      
      rect.setAttribute('stroke-width', '1.5');
      rect.setAttribute('class', 'cursor-crosshair hover:fill-white/5 transition-colors duration-150');
      rect.setAttribute('onclick', `handleGridCellClick('${pieceKey}', ${x}, ${y})`);
      gridGroup.appendChild(rect);
    }
  }
  svgBoard.appendChild(gridGroup);

  // Trace Photonic Paths
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

  // Set up GUI Container
  let controlsContainer = svgBoard.nextElementSibling;
  if (!controlsContainer || !controlsContainer.classList.contains('gui-controls')) {
    if (controlsContainer) controlsContainer.remove();
    controlsContainer = document.createElement('div');
    controlsContainer.className = "gui-controls mt-4 p-3 bg-black/40 border border-white/5 flex flex-col gap-3 rounded w-full box-border";
    svgBoard.parentNode.insertBefore(controlsContainer, svgBoard.nextSibling);
  }

  // 1. Render Laser Emitter
  const laserSrcGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const activeLaserX = isLaserSandbox ? state.gridX : state.laserX;
  const activeLaserY = isLaserSandbox ? state.gridY : state.laserY;
  const activeLaserRot = isLaserSandbox ? state.rotation : state.laserRotation;

  const lOrigX = activeLaserX * CELL_SIZE + CELL_SIZE / 2;
  const lOrigY = activeLaserY * CELL_SIZE + CELL_SIZE / 2;
  
  laserSrcGroup.style.transformOrigin = `${lOrigX}px ${lOrigY}px`;
  laserSrcGroup.style.transform = `rotate(${activeLaserRot * 90}deg)`;
  
  if (state.selectedEntity === 'LASER' || isLaserSandbox) {
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    ring.setAttribute('x', activeLaserX * CELL_SIZE + 4); ring.setAttribute('y', activeLaserY * CELL_SIZE + 4);
    ring.setAttribute('width', 92); ring.setAttribute('height', 92); ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', 'rgba(3, 233, 244, 0.7)'); ring.setAttribute('stroke-width', '2');
    svgBoard.appendChild(ring);
  }

  const laserImg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
  laserImg.setAttribute('x', activeLaserX * CELL_SIZE + 5); laserImg.setAttribute('y', activeLaserY * CELL_SIZE + 5);
  laserImg.setAttribute('width', 90); laserImg.setAttribute('height', 90);
  laserImg.setAttribute('href', `../pieces/bluelaser.png`);
  laserSrcGroup.appendChild(laserImg);
  svgBoard.appendChild(laserSrcGroup);

  // 2. Render Structural Pieces
  if (!isLaserSandbox) {
    const pieceGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const pOrigX = state.gridX * CELL_SIZE + CELL_SIZE / 2;
    const pOrigY = state.gridY * CELL_SIZE + CELL_SIZE / 2;
    pieceGroup.style.transformOrigin = `${pOrigX}px ${pOrigY}px`;
    pieceGroup.style.transform = `rotate(${state.rotation * 90}deg)`;
    pieceGroup.style.filter = physics.isDestroyed ? "grayscale(100%) brightness(0.4)" : "grayscale(0%) brightness(1.05)";

    if (state.selectedEntity === 'PIECE') {
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      ring.setAttribute('x', state.gridX * CELL_SIZE + 4); ring.setAttribute('y', state.gridY * CELL_SIZE + 4);
      ring.setAttribute('width', 92); ring.setAttribute('height', 92); ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', 'rgba(3, 233, 244, 0.7)'); ring.setAttribute('stroke-width', '2');
      svgBoard.appendChild(ring);
    }

    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttribute('x', state.gridX * CELL_SIZE + 5); image.setAttribute('y', state.gridY * CELL_SIZE + 5);
    image.setAttribute('width', 90); image.setAttribute('height', 90);
    image.setAttribute('href', `../pieces/blue${state.activePieceType.toLowerCase()}.png`);
    
    pieceGroup.appendChild(image);
    svgBoard.appendChild(pieceGroup);
  }

  // 3. Render Sandbox GUI Controls
  if (isLaserSandbox) {
    controlsContainer.innerHTML = `
      <div class="flex items-center justify-between text-[11px] uppercase font-bold tracking-wider">
        <span class="text-gray-400">Rotate Laser:</span>
        <div class="flex gap-1">
          <button onclick="rotateTutorialPiece('${pieceKey}', -1)" class="bg-white/10 hover:bg-white/20 text-white px-2 py-1 text-[9px] font-bold font-mono rounded">ROT L</button>
          <button onclick="rotateTutorialPiece('${pieceKey}', 1)" class="bg-white/10 hover:bg-white/20 text-white px-2 py-1 text-[9px] font-bold font-mono rounded">ROT R</button>
        </div>
      </div>
    `;
  } else {
    controlsContainer.innerHTML = `
      <div class="flex items-center justify-between text-[11px] uppercase font-bold tracking-wider">
        <span class="text-gray-400">Swap Active Piece:</span>
        <select onchange="changeSandboxPieceType('${pieceKey}', this)" class="bg-black border border-white/20 text-theme text-[10px] p-1 rounded font-mono uppercase">
          <option value="KING" ${state.activePieceType === 'KING' ? 'selected' : ''}>KING</option>
          <option value="DEFENDER" ${state.activePieceType === 'DEFENDER' ? 'selected' : ''}>DEFENDER</option>
          <option value="DEFLECTOR" ${state.activePieceType === 'DEFLECTOR' ? 'selected' : ''}>DEFLECTOR</option>
          <option value="SWITCH" ${state.activePieceType === 'SWITCH' ? 'selected' : ''}>SWITCH</option>
        </select>
      </div>
      <div class="flex items-center justify-between text-[11px] uppercase font-bold tracking-wider">
        <span class="text-gray-400">Selection Target Focus:</span>
        <div class="flex gap-1">
          <button onclick="selectTutorialEntity('${pieceKey}', 'PIECE')" class="px-2 py-1 text-[9px] font-mono rounded border ${state.selectedEntity === 'PIECE' ? 'bg-theme/20 border-theme text-theme' : 'bg-white/5 border-white/10 text-gray-400'}">PIECE</button>
          <button onclick="selectTutorialEntity('${pieceKey}', 'LASER')" class="px-2 py-1 text-[9px] font-mono rounded border ${state.selectedEntity === 'LASER' ? 'bg-theme/20 border-theme text-theme' : 'bg-white/5 border-white/10 text-gray-400'}">LASER SOURCE</button>
        </div>
      </div>
      <div class="flex items-center justify-between text-[11px] uppercase font-bold tracking-wider border-t border-white/5 pt-2">
        <span class="text-gray-400">Rotate Selected Element:</span>
        <div class="flex gap-1">
          <button onclick="rotateTutorialPiece('${pieceKey}', -1)" class="bg-white/10 hover:bg-white/20 text-white px-2 py-1 text-[9px] font-bold font-mono rounded">ROT L</button>
          <button onclick="rotateTutorialPiece('${pieceKey}', 1)" class="bg-white/10 hover:bg-white/20 text-white px-2 py-1 text-[9px] font-bold font-mono rounded">ROT R</button>
        </div>
      </div>
    `;
  }
}
