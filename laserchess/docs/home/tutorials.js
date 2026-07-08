// 5. VECTOR GRAPHICS RENDERING MATRIX WITH ENLARGED LEGEND AND GREEN HIGHLIGHT ZONE
// =========================================================================
function renderSandbox(pieceKey) {
  const svgBoard = document.getElementById(`svg-sandbox-${pieceKey}`);
  if (!svgBoard) return;
  
  svgBoard.innerHTML = '';
  const state = tutorialStates[pieceKey];
  const CELL_SIZE = 100;
  const physics = traceLaserEngine(pieceKey);

  // Render Grid
  const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x * CELL_SIZE);
      rect.setAttribute('y', y * CELL_SIZE);
      rect.setAttribute('width', CELL_SIZE);
      rect.setAttribute('height', CELL_SIZE);
      
      let isWithinRange = Math.abs(x - state.gridX) <= 1 && Math.abs(y - state.gridY) <= 1;
      let isCurrentPos = (x === state.gridX && y === state.gridY);

      if (pieceKey !== 'LASER' && state.selectedEntity === 'PIECE' && isWithinRange && !isCurrentPos) {
        rect.setAttribute('fill', 'rgba(16, 185, 129, 0.15)');
        rect.setAttribute('stroke', 'rgba(16, 185, 129, 0.6)');
      } else {
        rect.setAttribute('fill', 'rgba(0, 0, 0, 0.65)');
        rect.setAttribute('stroke', 'rgba(255, 255, 255, 0.05)');
      }
      
      rect.setAttribute('stroke-width', '1.5');
      rect.setAttribute('onclick', `handleGridCellClick('${pieceKey}', ${x}, ${y})`);
      gridGroup.appendChild(rect);
    }
  }
  svgBoard.appendChild(gridGroup);

  // Trace Path (Core Logic remains the same)
  // ... (Path tracing code included here)
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
  laserGroup.appendChild(glow); laserGroup.appendChild(core);
  svgBoard.appendChild(laserGroup);

  let controlsContainer = svgBoard.nextElementSibling;
  if (!controlsContainer || !controlsContainer.classList.contains('gui-controls')) {
    if (controlsContainer) controlsContainer.remove();
    controlsContainer = document.createElement('div');
    controlsContainer.className = "gui-controls mt-4 p-4 bg-black/60 border border-white/10 flex flex-col gap-4 rounded w-full box-border";
    svgBoard.parentNode.insertBefore(controlsContainer, svgBoard.nextSibling);
  }

  // Render controls and ENLARGED LEGEND
  controlsContainer.innerHTML = `
    <div class="space-y-4">
      ${pieceKey !== 'LASER' ? `
      <div class="flex items-center justify-between text-[13px] uppercase font-bold tracking-wider">
        <span class="text-gray-400">Swap Active Piece:</span>
        <select onchange="changeSandboxPieceType('${pieceKey}', this)" class="bg-black border border-white/20 text-theme text-[12px] p-2 rounded font-mono uppercase">
          <option value="KING" ${state.activePieceType === 'KING' ? 'selected' : ''}>KING</option>
          <option value="DEFENDER" ${state.activePieceType === 'DEFENDER' ? 'selected' : ''}>DEFENDER</option>
          <option value="DEFLECTOR" ${state.activePieceType === 'DEFLECTOR' ? 'selected' : ''}>DEFLECTOR</option>
          <option value="SWITCH" ${state.activePieceType === 'SWITCH' ? 'selected' : ''}>SWITCH</option>
        </select>
      </div>` : ''}

      <div class="border-t border-white/10 pt-4 flex flex-col gap-3 text-[11px] font-mono tracking-wide text-gray-300 uppercase">
        <div class="text-[14px] font-black text-theme mb-1 tracking-widest text-center">SANDBOX LEGEND</div>
        
        <div class="flex items-center gap-3">
          <span class="w-5 h-5 rounded bg-emerald-500/20 border-2 border-emerald-500/80"></span>
          <span>GREEN GRID = LEGAL 1-SQUARE MOVE BOUNDS</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="w-5 h-5 rounded border-2 border-cyan-400/80"></span>
          <span>CYAN BORDER = ACTIVE ELEMENT SELECTED</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="w-5 h-1 bg-cyan-400"></span>
          <span>CYAN ENERGY PATH = LIVE LASER BEAM</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="w-5 h-1 bg-gray-500"></span>
          <span>GREY TRACE = TERMINATED BEAM STRIKE</span>
        </div>
      </div>
    </div>
  `;
}
