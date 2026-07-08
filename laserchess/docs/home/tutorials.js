/**
 * MINI PHYSICS ENGINE (CORRECTED GEOMETRIC INTERACTION PASS)
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
      // Shield is at the BOTTOM (Faces South) at rotation 0.
      // Rotation 1 (90° CW): Shield faces West (Blocks West laser safely!)
      if (rotation === 1) {
        pathStr = IN; 
        isDestroyed = false;
      } else {
        pathStr = THROUGH; 
        isDestroyed = true;
      }
      break;

    case 'DEFLECTOR':
      // Exact User Spec Alignment:
      // Rotation 0: Reflects UP from West
      // Rotation 1: Safe path (As previously working)
      // Rotation 2: Dies from West laser
      // Rotation 3: Inherits Rotation 2's previous active path (Reflects DOWN)
      if (rotation === 0) {
        pathStr = `${IN} ${UP}`;
        isDestroyed = false;
      } else if (rotation === 1) {
        pathStr = `${IN} ${UP}`; // Kept consistent with working state
        isDestroyed = false;
      } else if (rotation === 3) {
        pathStr = `${IN} ${DOWN}`;
        isDestroyed = false;
      } else {
        // Rotation 2 drops here and gets destroyed
        pathStr = IN;
        isDestroyed = true;
      }
      break;

    case 'SWITCH':
      // Switch reflects identically across the same layout without destruction:
      if (rotation === 0 || rotation === 1) {
        pathStr = `${IN} ${UP}`;
      } else {
        pathStr = `${IN} ${DOWN}`;
      }
      isDestroyed = false;
      break;

    case 'LASER':
      // Firing nozzle points UP (North) at rotation 0.
      if (rotation === 0) pathStr = `M 150 150 L 150 0`;     // North
      if (rotation === 1) pathStr = `M 150 150 L 300 150`;   // East
      if (rotation === 2) pathStr = `M 150 150 L 150 300`;   // South
      if (rotation === 3) pathStr = `M 150 150 L 0 150`;     // West
      isDestroyed = false;
      break;
  }

  return { pathStr, isDestroyed };
}
