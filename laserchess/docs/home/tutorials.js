/**
 * LASER CHESS - TUTORIAL INTERACTIVE PHYSICS ENGINE (STABLE PRODUCTION BUILD)
 * Complete interactive sandbox with isolated input event bubbling safeguards.
 */

// 1. CONFIGURABLE PIECE INTERACTION MATRIX
const PIECE_INTERACTION_TABLE = {
  KING: {
    NORTH: { reflect: null, isDestroyed: true },
    EAST:  { reflect: null, isDestroyed: true },
    SOUTH: { reflect: null, isDestroyed: true },
    WEST:  { reflect: null, isDestroyed: true }
  },
  DEFENDER: {
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
  KING: { rotation: 0, activePieceType: 'KING', gridX: 1, gridY: 1, laserSourceDir: 'WEST' },
  DEFENDER: { rotation: 0, activePieceType: 'DEFENDER', gridX: 1, gridY: 1, laserSourceDir: 'WEST' },
  DEFLECTOR: { rotation: 0, activePieceType: 'DEFLECTOR', gridX: 1, gridY: 1, laserSourceDir: 'WEST' },
  SWITCH: { rotation: 0, activePieceType: 'SWITCH', gridX: 1, gridY: 1, laserSourceDir: 'WEST' },
  LASER: { rotation: 0, activePieceType: 'LASER', gridX: 1, gridY: 1 }
};

window.togglePieceTutorial = function(cardElement, pieceKey) {
  // CRITICAL FIX: Prevent dropdown selects or button clicks from firing card toggles via propagation
  if (window.event && (window.event.target.tagName === 'BUTTON' || window.event.target.tagName === 'SELECT' || window.event.target.closest('.sandbox-interactive-controls') || window.event.target.closest('.laser-sandbox-controls'))) {
    return;
  }

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

window.changeSandboxPieceType = function(pieceKey, selectElement) {
  if (window.event) window.event.stopPropagation();
  const state = tutorialStates[pieceKey];
  if (state) {
    state.activePieceType = selectElement.value;
    renderSandbox(pieceKey);
  }
};

window.changeSandboxPosition = function(pieceKey, axis, selectElement) {
  if (window.event) window.event.stopPropagation();
  const state = tutorialStates[pieceKey];
  if (state) {
    state[axis] = parseInt(selectElement.value, 10);
    renderSandbox(pieceKey);
  }
};

window.changeLaserSourceDirection = function(pieceKey, selectElement) {
  if (window.event) window.event.stopPropagation();
  const state = tutorialStates[pieceKey];
  if (state) {
    state.laserSourceDir = selectElement.value;
    renderSandbox(pieceKey);
  }
};

/**
 * STANDALONE TACTICAL LASER VECTOR ENGINE
 */
function traceLaserEngine(pieceKey, currentRotation) {
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
    if (currentRotation === 0) currentDir = 'NORTH';
    if (currentRotation === 1) currentDir = 'EAST';
    if (currentRotation === 2) currentDir = 'SOUTH';
    if (currentRotation === 3) currentDir = 'WEST';
  } else {
    const srcDir = state.laserSourceDir || 'WEST';
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
      let edgeX = startX + vec.dx * (CELL_SIZE * 1.5);
      let edgeY = startY + vec.dy * (CELL_SIZE * 1.5);
      points.push([edgeX, edgeY]);
      break;
    }

    points.push([targetX, targetY]);
    currentX = nextX;
    currentY = nextY;

    if (currentX === state.gridX && currentY === state.gridY && pieceKey !== 'LASER') {
      let inboundDir = 'WEST';
      if (currentDir === 'NORTH') inboundDir = 'SOUTH';
      if (currentDir === 'SOUTH') inboundDir = 'NORTH';
      if (currentDir === 'EAST') inboundDir = 'WEST';
      if (currentDir === 'WEST') inboundDir = 'EAST';

      const matrix = PIECE_INTERACTION_TABLE[state.activePieceType];
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

  // 3. Render Sandbox UI Forms & Elements Dynamically
  let controlsContainer = svgBoard.nextElementSibling;

  if (pieceKey !== 'LASER') {
    // Laser Source Node Layout Position Check
    const srcDir = state.laserSourceDir || 'WEST';
    let srcX = 5, srcY = 105, srcRot = 1;
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

    // Refresh control templates
    if (!controlsContainer || !controlsContainer.classList.contains('sandbox-interactive-controls')) {
      if (controlsContainer) controlsContainer.remove();
      controlsContainer = document.createElement('div');
      controlsContainer.className = "sandbox-interactive-controls mt-4 p-3 bg-black/40 border border-white/5 flex flex-col gap-2 rounded";
      svgBoard.parentNode.insertBefore(controlsContainer, svgBoard.nextSibling);
    }

    controlsContainer.innerHTML = `
      <div class="flex items-center justify-between text-[11px] uppercase font-bold tracking-wider mb-1">
        <span class="text-gray-400">Piece Type:</span>
        <select onchange="changeSandboxPieceType('${pieceKey}', this)" class="bg-black border border-white/20 text-theme text-[10px] p-1 rounded font-mono uppercase">
          <option value="KING" ${state.activePieceType === 'KING' ? 'selected' : ''}>KING</option>
          <option value="DEFENDER" ${state.activePieceType === 'DEFENDER' ? 'selected' : ''}>DEFENDER</option>
          <option value="DEFLECTOR" ${state.activePieceType === 'DEFLECTOR' ? 'selected' : ''}>DEFLECTOR</option>
          <option value="SWITCH" ${state.activePieceType === 'SWITCH' ? 'selected' : ''}>SWITCH</option>
        </select>
      </div>
      <div class="flex items-center justify-between text-[11px] uppercase font-bold tracking-wider mb-1">
        <span class="text-gray-400">Grid Position:</span>
        <div class="flex gap-2">
          <label class="text-[9px] text-gray-500 flex items-center gap-1 font-mono">X
            <select onchange="changeSandboxPosition('${pieceKey}', 'gridX', this)" class="bg-black border border-white/20 text-white text-[10px] p-0.5 rounded font-mono">
              <option value="0" ${state.gridX === 0 ? 'selected' : ''}>0</option>
              <option value="1" ${state.gridX === 1 ? 'selected' : ''}>1</option>
              <option value="2" ${state.gridX === 2 ? 'selected' : ''}>2</option>
            </select>
          </label>
          <label class="text-[9px] text-gray-500 flex items-center gap-1 font-mono">Y
            <select onchange="changeSandboxPosition('${pieceKey}', 'gridY', this)" class="bg-black border border-white/20 text-white text-[10px] p-0.5 rounded font-mono">
              <option value="0" ${state.gridY === 0 ? 'selected' : ''}>0</option>
              <option value="1" ${state.gridY === 1 ? 'selected' : ''}>1</option>
              <option value="2" ${state.gridY === 2 ? 'selected' : ''}>2</option>
            </select>
          </label>
        </div>
      </div>
      <div class="flex items-center justify-between text-[11px] uppercase font-bold tracking-wider">
        <span class="text-gray-400">Laser Beam Source:</span>
        <select onchange="changeLaserSourceDirection('${pieceKey}', this)" class="bg-black border border-white/20 text-theme text-[10px] p-1 rounded font-mono uppercase">
          <option value="WEST" ${state.laserSourceDir === 'WEST' ? 'selected' : ''}>WEST (Left border)</option>
          <option value="NORTH" ${state.laserSourceDir === 'NORTH' ? 'selected' : ''}>NORTH (Top border)</option>
          <option value="EAST" ${state.laserSourceDir === 'EAST' ? 'selected' : ''}>EAST (Right border)</option>
          <option value="SOUTH" ${state.laserSourceDir === 'SOUTH' ? 'selected' : ''}>SOUTH (Bottom border)</option>
        </select>
      </div>
    `;

    // Target Interactive Element Node Group
    const pieceGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const computedOriginX = state.gridX * CELL_SIZE + CELL_SIZE / 2;
    const computedOriginY = state.gridY * CELL_SIZE + CELL_SIZE / 2;
    pieceGroup.style.transformOrigin = `${computedOriginX}px ${computedOriginY}px`;
    pieceGroup.style.transform = `rotate(${state.rotation * 90}deg)`;
    pieceGroup.style.transition = "transform 0.25s ease-out, filter 0.3s ease-in-out";
    
    if (physics.isDestroyed) {
      pieceGroup.style.filter = "grayscale(100%) brightness(0.4)";
    } else {
      pieceGroup.style.filter = "grayscale(0%) brightness(1.05) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.6))";
    }

    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttribute('x', state.gridX * CELL_SIZE + 5); 
    image.setAttribute('y', state.gridY * CELL_SIZE + 5);
    image.setAttribute('width', 90);
    image.setAttribute('height', 90);
    image.setAttribute('href', `../pieces/blue${state.activePieceType.toLowerCase()}.png`);
    
    pieceGroup.appendChild(image);
    svgBoard.appendChild(pieceGroup);

  } else {
    // Setup controls for LASER card viewports exclusively
    if (!controlsContainer || !controlsContainer.classList.contains('laser-sandbox-controls')) {
      if (controlsContainer) controlsContainer.remove();
      controlsContainer = document.createElement('div');
      controlsContainer.className = "laser-sandbox-controls mt-4 p-3 bg-black/40 border border-white/5 flex flex-col gap-2 rounded";
      svgBoard.parentNode.insertBefore(controlsContainer, svgBoard.nextSibling);
    }

    controlsContainer.innerHTML = `
      <div class="flex items-center justify-between text-[11px] uppercase font-bold tracking-wider">
        <span class="text-gray-400">Move Emitter Node:</span>
        <div class="flex gap-2">
          <label class="text-[9px] text-gray-500 flex items-center gap-1 font-mono">X
            <select onchange="changeSandboxPosition('${pieceKey}', 'gridX', this)" class="bg-black border border-white/20 text-white text-[10px] p-0.5 rounded font-mono">
              <option value="0" ${state.gridX === 0 ? 'selected' : ''}>0</option>
              <option value="1" ${state.gridX === 1 ? 'selected' : ''}>1</option>
              <option value="2" ${state.gridX === 2 ? 'selected' : ''}>2</option>
            </select>
          </label>
          <label class="text-[9px] text-gray-500 flex items-center gap-1 font-mono">Y
            <select onchange="changeSandboxPosition('${pieceKey}', 'gridY', this)" class="bg-black border border-white/20 text-white text-[10px] p-0.5 rounded font-mono">
              <option value="0" ${state.gridY === 0 ? 'selected' : ''}>0</option>
              <option value="1" ${state.gridY === 1 ? 'selected' : ''}>1</option>
              <option value="2" ${state.gridY === 2 ? 'selected' : ''}>2</option>
            </select>
          </label>
        </div>
      </div>
    `;

    const laserSrcGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const computedOriginX = state.gridX * CELL_SIZE + CELL_SIZE / 2;
    const computedOriginY = state.gridY * CELL_SIZE + CELL_SIZE / 2;
    laserSrcGroup.style.transformOrigin = `${computedOriginX}px ${computedOriginY}px`;
    laserSrcGroup.style.transform = `rotate(${state.rotation * 90}deg)`;
    laserSrcGroup.style.transition = "transform 0.25s ease-out";
    
    const laserImg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    laserImg.setAttribute('x', state.gridX * CELL_SIZE + 5);
    laserImg.setAttribute('y', state.gridY * CELL_SIZE + 5);
    laserImg.setAttribute('width', 90);
    laserImg.setAttribute('height', 90);
    laserImg.setAttribute('href', `../pieces/bluelaser.png`);
    laserSrcGroup.appendChild(laserImg);
    svgBoard.appendChild(laserSrcGroup);
  }
}
