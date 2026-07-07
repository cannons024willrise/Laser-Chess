
/**
 * LASER CHESS - MINIMALIST SVG VECTOR ENGINE
 * Drops seamlessly into existing codebases with zero logic overrides.
 */

const CELL_SIZE = 100;

/**
 * Generates the static grid background frame
 */
export function initStaticBoard() {
  const board = document.getElementById('laser-board');
  if (!board) return;

  // Clear or initialize background tracking group
  let bgGroup = document.getElementById('svg-grid-background');
  if (!bgGroup) {
    bgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    bgGroup.setAttribute('id', 'svg-grid-background');
    board.appendChild(bgGroup);
  }
  bgGroup.innerHTML = '';

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 10; x++) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x * CELL_SIZE);
      rect.setAttribute('y', y * CELL_SIZE);
      rect.setAttribute('width', CELL_SIZE);
      rect.setAttribute('height', CELL_SIZE);
      
      // Default structural tile formatting
      let styleClass = "fill-transparent stroke-white/5 stroke-[1]";
      if (x === 0) styleClass = "fill-blue-500/5 stroke-blue-500/10 stroke-[1]";
      if (x === 9) styleClass = "fill-red-500/5 stroke-red-500/10 stroke-[1]";
      
      rect.setAttribute('class', styleClass);
      bgGroup.appendChild(rect);
    }
  }
}

/**
 * Paints all active game pieces onto the vector scene using your existing board state format
 * @param {Array} currentBoardState - Your original array of piece entities
 */
export function drawPieces(currentBoardState) {
  let piecesGroup = document.getElementById('svg-pieces-layer');
  const board = document.getElementById('laser-board');
  
  if (!piecesGroup && board) {
    piecesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    piecesGroup.setAttribute('id', 'svg-pieces-layer');
    board.appendChild(piecesGroup);
  }
  if (!piecesGroup) return;
  piecesGroup.innerHTML = ''; // Fresh paint frame buffer wipe

  currentBoardState.forEach(piece => {
    if (!piece) return;

    // Direct structural variables mapping your existing properties
    const { x, y, type, color, rotation } = piece;
    const pixelX = x * CELL_SIZE;
    const pixelY = y * CELL_SIZE;

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'cursor-pointer transition-transform duration-200');
    
    // Set piece rotational anchor coordinates directly at cell midpoint
    const cX = pixelX + (CELL_SIZE / 2);
    const cY = pixelY + (CELL_SIZE / 2);
    group.style.transformOrigin = `${cX}px ${cY}px`;
    group.style.transform = `rotate(${rotation * 90}deg)`;

    // Attach native data attributes so your current click handlers continue to function
    group.setAttribute('data-x', x);
    group.setAttribute('data-y', y);

    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttribute('x', pixelX + 10); // Uniform inner padding boundary
    image.setAttribute('y', pixelY + 10);
    image.setAttribute('width', CELL_SIZE - 20);
    image.setAttribute('height', CELL_SIZE - 20);
    
    // Direct link navigating back to your target sibling piece directories
    const spritePath = `../pieces/${color.toLowerCase()}${type.toLowerCase()}.png`;
    image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', spritePath);

    group.appendChild(image);
    piecesGroup.appendChild(group);
  });
}

/**
 * Renders glowing vector lines along existing calculated laser tracks
 * @param {Array<Object>} calculatedPath - [{x: 0, y: 1}, {x: 1, y: 1}]
 */
export function drawLaserBeam(calculatedPath) {
  let laserGroup = document.getElementById('svg-laser-beams');
  const board = document.getElementById('laser-board');

  if (!laserGroup && board) {
    laserGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    laserGroup.setAttribute('id', 'svg-laser-beams');
    board.appendChild(laserGroup);
  }
  if (!laserGroup) return;
  laserGroup.innerHTML = ''; // Clear previous frame track

  if (!calculatedPath || calculatedPath.length < 2) return;

  // Build sequential SVG vector track line strings
  let pathString = "";
  calculatedPath.forEach((pt, i) => {
    const pX = (pt.x * CELL_SIZE) + (CELL_SIZE / 2);
    const pY = (pt.y * CELL_SIZE) + (CELL_SIZE / 2);
    pathString += `${i === 0 ? 'M' : 'L'} ${pX} ${pY} `;
  });

  // Background glow element
  const glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  glow.setAttribute('d', pathString);
  glow.setAttribute('class', 'stroke-yellow-500/30 fill-none stroke-[8] blur-sm animate-pulse');
  
  // Focused intense center core element
  const core = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  core.setAttribute('d', pathString);
  core.setAttribute('class', 'stroke-yellow-300 fill-none stroke-[3] drop-shadow-[0_0_8px_rgba(255,255,0,0.8)]');

  laserGroup.appendChild(glow);
  laserGroup.appendChild(core);
}
