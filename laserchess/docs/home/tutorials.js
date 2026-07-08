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
    NORTH: { reflect: null, isDestroyed: true }, // [0]: ◈ | [1]: ◈ | [2]: ◈ | [3]: ◈
    EAST:  { reflect: null, isDestroyed: true },
    SOUTH: { reflect: null, isDestroyed: true },
    WEST:  { reflect: null, isDestroyed: true }
  },
  DEFENDER: {
    NORTH: {
      0: { reflect: null, isDestroyed: true },     // ⬓ (Vulnerable top)
      1: { reflect: null, isDestroyed: true },     // ◧ (Vulnerable top)
      2: { reflect: null, isDestroyed: false },    // ⬒ (Blocks beam on flat base)
      3: { reflect: null, isDestroyed: true }      // ◨ (Vulnerable top)
    },
    EAST: {
      0: { reflect: null, isDestroyed: true },     // ⬓
      1: { reflect: null, isDestroyed: true },     // ◧
      2: { reflect: null, isDestroyed: true },     // ⬒
      3: { reflect: null, isDestroyed: false }     // ◨ (Blocks beam on flat right base)
    },
    SOUTH: {
      0: { reflect: null, isDestroyed: false },    // ⬓ (Blocks beam on flat bottom base)
      1: { reflect: null, isDestroyed: true },     // ◧
      2: { reflect: null, isDestroyed: true },     // ⬒
      3: { reflect: null, isDestroyed: true }      // ◨
    },
    WEST: {
      0: { reflect: null, isDestroyed: true },     // ⬓
      1: { reflect: null, isDestroyed: false },    // ◧ (Blocks beam on flat left base)
      2: { reflect: null, isDestroyed: true },     // ⬒
      3: { reflect: null, isDestroyed: true }      // ◨
    }
  },
  DEFLECTOR: {
    WEST: { // Laser inbound from WEST (hits the left side of the piece)
      0: { reflect: null, isDestroyed: true },     // ◣ (Hits flat left)
      1: { reflect: null, isDestroyed: true },     // ◤ (Hits flat left)
      2: { reflect: 'SOUTH', isDestroyed: false }, // ◥ (Hits mirror, bounces South)
      3: { reflect: 'NORTH', isDestroyed: false }  // ◢ (Hits mirror, bounces North)
    },
    NORTH: { // Laser inbound from NORTH (hits the top side of the piece)
      0: { reflect: 'EAST', isDestroyed: false },  // ◣ (Hits mirror, bounces East)
      1: { reflect: null, isDestroyed: true },     // ◤ (Hits flat top)
      2: { reflect: null, isDestroyed: true },     // ◥ (Hits flat top)
      3: { reflect: 'WEST', isDestroyed: false }   // ◢ (Hits mirror, bounces West)
    },
    EAST: { // Laser inbound from EAST (hits the right side of the piece)
      0: { reflect: 'NORTH', isDestroyed: false }, // ◣ (Hits mirror, bounces North)
      1: { reflect: 'SOUTH', isDestroyed: false }, // ◤ (Hits mirror, bounces South)
      2: { reflect: null, isDestroyed: true },     // ◥ (Hits flat right)
      3: { reflect: null, isDestroyed: true }      // ◢ (Hits flat right)
    },
    SOUTH: { // Laser inbound from SOUTH (hits the bottom side of the piece)
      0: { reflect: null, isDestroyed: true },     // ◣ (Hits flat bottom)
      1: { reflect: 'EAST', isDestroyed: false },  // ◤ (Hits mirror, bounces East)
      2: { reflect: 'WEST', isDestroyed: false },  // ◥ (Hits mirror, bounces West)
      3: { reflect: null, isDestroyed: true }      // ◢ (Hits flat bottom)
    }
  },
  SWITCH: {
    WEST: {
      0: { reflect: 'NORTH', isDestroyed: false }, // ⟋ 
      1: { reflect: 'SOUTH', isDestroyed: false }, // ⟍ 
      2: { reflect: 'NORTH', isDestroyed: false }, // ⟋ 
      3: { reflect: 'SOUTH', isDestroyed: false }  // ⟍ 
    },
    NORTH: {
      0: { reflect: 'WEST', isDestroyed: false },  // ⟋
      1: { reflect: 'EAST', isDestroyed: false },  // ⟍
      2: { reflect: 'WEST', isDestroyed: false },  // ⟋
      3: { reflect: 'EAST', isDestroyed: false }   // ⟍
    },
    EAST: {
      0: { reflect: 'SOUTH', isDestroyed: false }, // ⟋
      1: { reflect: 'NORTH', isDestroyed: false }, // ⟍
      2: { reflect: 'SOUTH', isDestroyed: false }, // ⟋
      3: { reflect: 'NORTH', isDestroyed: false }  // ⟍
    },
    SOUTH: {
      0: { reflect: 'EAST', isDestroyed: false },  // ⟋
      1: { reflect: 'WEST', isDestroyed: false },  // ⟍
      2: { reflect: 'EAST', isDestroyed: false },  // ⟋
      3: { reflect: 'WEST', isDestroyed: false }   // ⟍
    }
  }
};
