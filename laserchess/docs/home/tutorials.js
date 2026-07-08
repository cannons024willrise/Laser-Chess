/**
 * LASER CHESS - TUTORIAL INTERACTIVE PHYSICS ENGINE (COMPLETE CLICK GUI WITH ROTATION)
 * Full inline rotation controls, cell-clicking movement matrices, and dynamic selection mapping.
 */

// 1. CONFIGURABLE PIECE INTERACTION MATRIX WITH GEOMETRICALLY CORRECTED LOGIC
// =========================================================================
// QUICK ASCII REFERENCE MATRIX LOOKUP BY ROTATION STATE (0 - 3):
// KING:      [0]: ◈  | [1]: ◈  | [2]: ◈  | [3]: ◈
// LASER:     [0]: ⫝  | [1]: ⟜  | [2]: Ͳ  | [3]: Ð
// SWITCH:    [0]: ⟋  | [1]: ⟍  | [2]: ⟋  | [3]: ⟍
// DEFENDER:  [0]: ⬓  | [1]: ◧  | [2]: ⬒  | [3]: ◨
// DEFLECTOR: [0]: ◣  | [1]: ◤  | [2]: ◥  | [3]: ◢
// =========================================================================

const PIECE_INTERACTION_TABLE = {
  KING: {
    NORTH: {
      0: { reflect: null, isDestroyed: true }, // [0]: ◈ | Laser hits and terminates instantly
      1: { reflect: null, isDestroyed: true }, // [1]: ◈
      2: { reflect: null, isDestroyed: true }, // [2]: ◈
      3: { reflect: null, isDestroyed: true }  // [3]: ◈
    },
    EAST: {
      0: { reflect: null, isDestroyed: true },
      1: { reflect: null, isDestroyed: true },
      2: { reflect: null, isDestroyed: true },
      3: { reflect: null, isDestroyed: true }
    },
    SOUTH: {
      0: { reflect: null, isDestroyed: true },
      1: { reflect: null, isDestroyed: true },
      2: { reflect: null, isDestroyed: true },
      3: { reflect: null, isDestroyed: true }
    },
    WEST: {
      0: { reflect: null, isDestroyed: true },
      1: { reflect: null, isDestroyed: true },
      2: { reflect: null, isDestroyed: true },
      3: { reflect: null, isDestroyed: true }
    }
  },
  DEFENDER: {
    NORTH: { // Laser inbound from NORTH (travelling down, hitting top side)
      0: { reflect: null, isDestroyed: true },     // ⬓ (Vulnerable rounded top)
      1: { reflect: null, isDestroyed: true },     // ◧ (Vulnerable rounded top)
      2: { reflect: null, isDestroyed: false },    // ⬒ (Blocks beam harmlessly on flat base)
      3: { reflect: null, isDestroyed: true }      // ◨ (Vulnerable rounded top)
    },
    EAST: { // Laser inbound from EAST (travelling left, hitting right side)
      0: { reflect: null, isDestroyed: true },     // ⬓
      1: { reflect: null, isDestroyed: true },     // ◧
      2: { reflect: null, isDestroyed: true },     // ⬒
      3: { reflect: null, isDestroyed: false }     // ◨ (Blocks beam harmlessly on flat base)
    },
    SOUTH: { // Laser inbound from SOUTH (travelling up, hitting bottom side)
      0: { reflect: null, isDestroyed: false },    // ⬓ (Blocks beam harmlessly on flat base)
      1: { reflect: null, isDestroyed: true },     // ◧
      2: { reflect: null, isDestroyed: true },     // ⬒
      3: { reflect: null, isDestroyed: true }      // ◨
    },
    WEST: { // Laser inbound from WEST (travelling right, hitting left side)
      0: { reflect: null, isDestroyed: true },     // ⬓
      1: { reflect: null, isDestroyed: false },    // ◧ (Blocks beam harmlessly on flat base)
      2: { reflect: null, isDestroyed: true },     // ⬒
      3: { reflect: null, isDestroyed: true }      // ◨
    }
  },
  DEFLECTOR: {
    WEST: { // Laser traveling RIGHT, hitting the left side of the piece
      0: { reflect: null, isDestroyed: true },     // ◣ (Hits non-mirrored flat vertical wall)
      1: { reflect: null, isDestroyed: true },     // ◤ (Hits non-mirrored flat vertical wall)
      2: { reflect: 'SOUTH', isDestroyed: false }, // ◥ (Hits hypotenuse mirror plane -> deflected South)
      3: { reflect: 'NORTH', isDestroyed: false }  // ◢ (Hits hypotenuse mirror plane -> deflected North)
    },
    NORTH: { // Laser traveling DOWN, hitting the top side of the piece
      0: { reflect: 'EAST', isDestroyed: false },  // ◣ (Hits hypotenuse mirror plane -> deflected East)
      1: { reflect: null, isDestroyed: true },     // ◤ (Hits non-mirrored flat horizontal wall)
      2: { reflect: null, isDestroyed: true },     // ◥ (Hits non-mirrored flat horizontal wall)
      3: { reflect: 'WEST', isDestroyed: false }   // ◢ (Hits hypotenuse mirror plane -> deflected West)
    },
    EAST: { // Laser traveling LEFT, hitting the right side of the piece
      0: { reflect: 'NORTH', isDestroyed: false }, // ◣ (Hits hypotenuse mirror plane -> deflected North)
      1: { reflect: 'SOUTH', isDestroyed: false }, // ◤ (Hits hypotenuse mirror plane -> deflected South)
      2: { reflect: null, isDestroyed: true },     // ◥ (Hits non-mirrored flat vertical wall)
      3: { reflect: null, isDestroyed: true }      // ◢ (Hits non-mirrored flat vertical wall)
    },
    SOUTH: { // Laser traveling UP, hitting the bottom side of the piece
      0: { reflect: null, isDestroyed: true },     // ◣ (Hits non-mirrored flat horizontal wall)
      1: { reflect: 'EAST', isDestroyed: false },  // ◤ (Hits hypotenuse mirror plane -> deflected East)
      2: { reflect: 'WEST', isDestroyed: false },  // ◥ (Hits hypotenuse mirror plane -> deflected West)
      3: { reflect: null, isDestroyed: true }      // ◢ (Hits non-mirrored flat horizontal wall)
    }
  },
  SWITCH: { // Double-sided mirrors (Never explodes)
    WEST: { // Laser traveling RIGHT
      0: { reflect: 'NORTH', isDestroyed: false }, // ⟋ (Bounces UP)
      1: { reflect: 'SOUTH', isDestroyed: false }, // ⟍ (Bounces DOWN)
      2: { reflect: 'NORTH', isDestroyed: false }, // ⟋ (Bounces UP)
      3: { reflect: 'SOUTH', isDestroyed: false }  // ⟍ (Bounces DOWN)
    },
    NORTH: { // Laser traveling DOWN
      0: { reflect: 'WEST', isDestroyed: false },  // ⟋ (Bounces LEFT)
      1: { reflect: 'EAST', isDestroyed: false },  // ⟍ (Bounces RIGHT)
      2: { reflect: 'WEST', isDestroyed: false },  // ⟋ (Bounces LEFT)
      3: { reflect: 'EAST', isDestroyed: false }   // ⟍ (Bounces RIGHT)
    },
    EAST: { // Laser traveling LEFT
      0: { reflect: 'SOUTH', isDestroyed: false }, // ⟋ (Bounces DOWN)
      1: { reflect: 'NORTH', isDestroyed: false }, // ⟍ (Bounces UP)
      2: { reflect: 'SOUTH', isDestroyed: false }, // ⟋ (Bounces DOWN)
      3: { reflect: 'NORTH', isDestroyed: false }  // ⟍ (Bounces UP)
    },
    SOUTH: { // Laser traveling UP
      0: { reflect: 'EAST', isDestroyed: false },  // ⟋ (Bounces RIGHT)
      1: { reflect: 'WEST', isDestroyed: false },  // ⟍ (Bounces LEFT)
      2: { reflect: 'EAST', isDestroyed: false },  // ⟋ (Bounces RIGHT)
      3: { reflect: 'WEST', isDestroyed: false }   // ⟍ (Bounces LEFT)
    }
  }
};
