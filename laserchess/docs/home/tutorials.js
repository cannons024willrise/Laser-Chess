/**
 * LASER CHESS - TUTORIAL INTERACTIVE PHYSICS ENGINE (COMPLETE CLICK GUI WITH ROTATION)
 * Full inline rotation controls, cell-clicking movement matrices, and dynamic selection mapping.
 * Featuring Self-Initializing DOM Hydration Core.
 */

// 1. CONFIGURABLE PIECE INTERACTION MATRIX WITH GEOMETRICALLY CORRECTED LOGIC
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

// 2. AUTOMATIC DOM HYDRATION ENGINE
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.rule-card').forEach(card => {
    const h4 = card.querySelector('h4');
    if (!h4) return;
    
    const pieceKey = h4.textContent.trim().toUpperCase();
    if (!tutorialStates[pieceKey]) return;
    
    // Add layout click styling cursor and action handler
    card.classList.add('cursor-pointer', 'hover:border-theme/40', 'transition-all');
    card.setAttribute('onclick', `togglePieceTutorial(this, '${pieceKey}')`);
    
    // Build and inject sandbox markup components smoothly
    const sandboxContainer = document.createElement('div');
    sandboxContainer.className = 'sandbox-container hidden mt-6 pt-6 border-t border-white/10 flex flex-col items-center';
    
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.id = `svg-sandbox-${pieceKey}`;
    svgElement.setAttribute('width', '300');
    svgElement.setAttribute('height', '300');
    svgElement.setAttribute('viewBox', '0 0 300 300');
    svgElement.className = 'bg-black/80 border border-white/10 rounded shadow-2xl';
    
    sandboxContainer.appendChild(svgElement);
    card.appendChild(sandboxContainer);
  });
});

// 3. CORE ACTION HANDLERS
// =========================================================================
window.togglePieceTutorial = function(cardElement, pieceKey) {
  if (window.event && (window.event.target.tagName === 'BUTTON' || window.event.target.tagName === 'SELECT' || window.event.target.closest('.gui-controls') || window.event.target.tagName === 'rect' || window.event.target.tagName === 'image')) {
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

  if (pieceKey === 'LASER' || state.selectedEntity === 'PIECE') {
    state.rotation = (state.rotation + direction + 4) % 4;
  } else if (state.selectedEntity === 'LASER') {
    state.laserRotation = (state.laserRotation + direction + 4) % 4;
  }
  
  renderSandbox(pieceKey);
};

window.selectTutorialEntity = function(pieceKey, entity) {
  if (window.event) window.event.stopPropagation();
  const state = tutorialStates[pieceKey];
  if (state) {
    state.selectedEntity = entity;
    renderSandbox(pieceKey);
  }
};

window.handleGridCellClick = function(pieceKey, x, y) {
  if (window.event) window.event.stopPropagation();
  const state = tutorialStates[pieceKey];
  if (!state) return;

  if (pieceKey === 'LASER' || state.selectedEntity === 'PIECE') {
    if (pieceKey !== 'LASER' && x === state.laserX && y === state.laserY) return;
    
    if (pieceKey !== 'LASER') {
      const deltaX = Math.abs(x - state.gridX);
      const deltaY = Math.abs(y - state.gridY);
      if (deltaX > 1 || deltaY
