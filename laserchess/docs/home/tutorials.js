/**
 * LASER CHESS - TUTORIAL INTERACTIVE PHYSICS ENGINE (SANDBOX MATRIX UPGRADE)
 * Full interactive playground allowing complete piece swapping, 3x3 positioning, 
 * directional raycasting, and rule-compliant grayscale/darkened asset destruction states.
 */

// 1. CONFIGURABLE PIECE INTERACTION MATRIX
// Maps the inbound direction of a laser beam to its deflection vector, absorption, or destruction behavior.
const PIECE_INTERACTION_TABLE = {
  KING: {
    NORTH: { reflect: null, isDestroyed: true },
    EAST:  { reflect: null, isDestroyed: true },
    SOUTH: { reflect: null, isDestroyed: true },
    WEST:  { reflect: null, isDestroyed: true }
  },
  DEFENDER: {
    // rotation 0: Shield faces South (Blocks SOUTH laser safely)
    // rotation 1: Shield faces West  (Blocks WEST laser safely)
    // rotation 2: Shield faces North (Blocks NORTH laser safely)
    // rotation 3: Shield faces East  (Blocks EAST laser safely)
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
      2: { reflect: 'EAST', is
