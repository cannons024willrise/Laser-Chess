/**
 * MINI PHYSICS ENGINE - UPDATED SWITCH LOGIC
 * The Switch behavior is now the exact inverse of the Deflector's interactions.
 */

function calculatePhysics(pieceKey, rotation) {
  let pathStr = ``;
  let isDestroyed = false;

  const IN = `M 0 150 L 150 150`; 
  const THROUGH = `M 0 150 L 300 150`;
  const UP = `L 150 0`;
  const DOWN = `L 150 300`;

  switch(pieceKey) {
    // ... (Keep KING, DEFENDER, DEFLECTOR, and LASER logic as previously defined) ...

    case 'SWITCH':
      // FLIPPED INTERACTION TABLE:
      // Rotation 0: Mirror is NE-SW. Bounces West laser UP (Inverse of Deflector rot 0)
      // Rotation 1: Mirror is NW-SE. Bounces West laser DOWN (Inverse of Deflector rot 1)
      // Rotation 2: Mirror is NE-SW. Bounces West laser UP
      // Rotation 3: Mirror is NW-SE. Bounces West laser DOWN
      if (rotation === 0 || rotation === 2) {
        pathStr = `${IN} ${UP}`;
      } else {
        pathStr = `${IN} ${DOWN}`;
      }
      isDestroyed = false;
      break;
      
    // ...
  }

  return { pathStr, isDestroyed };
}
