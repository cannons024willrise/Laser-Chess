/**
 * LASER CHESS - TACTICAL SIMULATION SUBSYSTEM
 * Handles standalone interactive micro-boards for individual piece cards.
 */

// Isolated state configurations matching core engine symbols and mechanics
const tutorialStates = {
  KING: { rotation: 0, type: 'KING', symbols: ['◈', '◈', '◈', '◈'], desc: "TARGET // Absorbs lasers from all 4 sides." },
  LASER: { rotation: 0, type: 'LASER', symbols: ['⫝', '⟜', 'Ͳ', 'Ð'], desc: "EMITTER // Anchored hardware. Fires terminal beam vectors." },
  SWITCH: { rotation: 0, type: 'SWITCH', symbols: ['⟋', '⟍', '⟋', '⟍'], desc: "REFLECTOR // Dual-sided mirror. Cannot be destroyed." },
  DEFENDER: { rotation: 0, type: 'DEFENDER', symbols: ['⬓', '', '⬒', '◨'], desc: "SHIELD // Blocks from front. Vulnerable on 3 sides." },
  DEFLECTOR: { rotation: 0, type: 'DEFLECTOR', symbols: ['◤', '◥', '◢', '◣'], desc: "DIVERTER // Redirects lasers at 90-degree angles." }
};

/**
 * Toggles the visibility of the interactive simulation pane inside a piece card.
 */
export function togglePieceTutorial(cardElement, pieceKey) {
  const sandbox = cardElement.querySelector('.sandbox-container');
  const label = cardElement.querySelector('.expand-label');
  
  if (!sandbox || !label) return;

  if (sandbox.classList.contains('hidden')) {
    // Collapse any other open sandbox layers to keep UI focused
    document.querySelectorAll('.sandbox-container').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.expand-label').forEach(el => el.innerText = "[ CLICK TO OPEN TACTICAL SIMULATION ]");
    
    sandbox.classList.remove('hidden');
    label.innerText = "[ CLICK TO CLOSE SIMULATION ]";
    renderSandbox(cardElement, pieceKey);
  } else {
    sandbox.classList.add('hidden');
    label.innerText = "[ CLICK TO OPEN TACTICAL SIMULATION ]";
  }
}

/**
 * Processes a CW or CCW rotation command on a simulated piece asset.
 */
export function rotateTutorialPiece(pieceKey, direction) {
  const state = tutorialStates[pieceKey];
  if (!state) return;

  // The King piece is anchored and cannot execute manual rotation actions
  if (state.type === 'KING') return;

  state.rotation = (state.rotation + direction + 4) % 4;
  
  // Find host card element context dynamically and update its viewport matrix
  const card = document.querySelector(`[data-tutorial-id="${pieceKey}"]`);
  if (card) renderSandbox(card, pieceKey);
}

/**
 * Renders the local 3x3 layout and traces beam logic paths
 */
function renderSandbox(cardElement, pieceKey) {
  const gridContainer = cardElement.querySelector('.sandbox-grid');
  if (!gridContainer) return;

  gridContainer.innerHTML = ''; // Clear previous frame
  const state = tutorialStates[pieceKey];
  
  // Calculate laser path vectors crossing our 3x3 local coordinate scope.
  // Beam enters from Left side cell (0, 1) going Right (dx=1, dy=0)
  const beamPath = calculateMockLaserPath(state);

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cell = document.createElement('div');
      cell.className = "border border-white/5 flex items-center justify-center relative font-mono text-xl select-none text-gray-600 w-full h-full min-h-[50px] min-w-[50px]";
      
      const isCenter = (r === 1 && c === 1);
      const cellKey = `${c},${r}`;
      const isHitByLaser = beamPath.includes(cellKey);

      // Inject the structural token emblem at center coordinates
      if (isCenter) {
        cell.innerText = state.symbols[state.rotation];
        
        // If piece is destroyed by hitting an unshielded edge, change styles
        if (state.wasDestroyed) {
          cell.className += " text-red-500 font-black bg-red-900/20 animate-pulse border-red-500/30";
        } else {
          cell.className += " text-theme font-black bg-theme/5 border-theme/20";
        }
      }

      // Draw Laser paths if the vector occupies this cell grid node
      if (isHitByLaser && (!isCenter || !state.wasDestroyed)) {
        const laserLine = document.createElement('div');
        // Yellow active ray matching index.html colors (--laser: #ffff00)
        laserLine.className = "absolute inset-0 bg-yellow-500/10 border-y border-yellow-400/40 z-0 animate-pulse";
        
        // Adjust style layout if vector turned vertically
        const indexInPath = beamPath.indexOf(cellKey);
        if (indexInPath > 0) {
          const prevCell = beamPath[indexInPath - 1].split(',');
          if (prevCell[0] === String(c)) { // X is same, it means moving vertically
            laserLine.className = "absolute inset-0 bg-yellow-500/10 border-x border-yellow-400/40 z-0 animate-pulse";
          }
        }
        cell.appendChild(laserLine);
      }
      
      gridContainer.appendChild(cell);
    }
  }
}

/**
 * Traces input laser collisions inside a 3x3 space based on core index.html logic rules
 */
function calculateMockLaserPath(pieceState) {
  let path = ['0,1']; // Start at Left row center
  let currentX = 0, currentY = 1;
  let dirX = 1, dirY = 0; // Vector Heading Right
  
  pieceState.wasDestroyed = false;

  // Move right directly into the target cell at center context (1,1)
  currentX += dirX; currentY += dirY;
  path.push(`${currentX},${currentY}`);

  const rot = pieceState.rotation;

  if (pieceState.type === 'DEFLECTOR') {
    // 0:◤ (Reflects Left/Down), 1:◥ (Left/Up), 2:◢ (Right/Up), 3:◣ (Right/Down)
    if (rot === 0) { // Incoming from left hits mirror hypotenuse and diverts DOWN
      dirX = 0; dirY = 1;
    } else if (rot === 1) { // Diverts UP
      dirX = 0; dirY = -1;
    } else { // Hit the flat vertical/horizontal back sides -> Destroyed
      pieceState.wasDestroyed = true;
      return path;
    }
  } 
  else if (pieceState.type === 'DEFENDER') {
    // 0:⬓ (Shield Top), 1: (Shield Right), 2:⬒ (Shield Bottom), 3:◨ (Shield Left)
    if (rot === 3) { 
      // Laser hits the left side shield directly. Path safely terminates/absorbs
      return path;
    } else { 
      // Hits unprotected side. Piece is vaporized.
      pieceState.wasDestroyed = true;
      return path;
    }
  } 
  else if (pieceState.type === 'SWITCH') {
    // Dual mirror. 0 & 2: ⟋ (Reflects Left->Up), 1 & 3: ⟍ (Reflects Left->Down)
    if (rot === 0 || rot === 2) {
      dirX = 0; dirY = -1; // Divert Up
    } else {
      dirX = 0; dirY = 1;  // Divert Down
    }
  } 
  else if (pieceState.type === 'KING') {
    // Kings absorb from all angles and are instantly destroyed
    pieceState.wasDestroyed = true;
    return path;
  } 
  else if (pieceState.type === 'LASER') {
    // Emitter housing blocks fire natively without receiving destruction penalties
    return path;
  }

  // Final Step out of the center node into the peripheral exit cells
  currentX += dirX; currentY += dirY;
  if (currentX >= 0 && currentX < 3 && currentY >= 0 && currentY < 3) {
    path.push(`${currentX},${currentY}`);
  }
  
  return path;
}

// Attach callbacks cleanly to global window space so inline HTML hooks don't throw ReferenceErrors
window.togglePieceTutorial = togglePieceTutorial;
window.rotateTutorialPiece = rotateTutorialPiece;
