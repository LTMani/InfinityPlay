// BoardData.js - 10x10 Snakes and Ladders Grid & Configuration

export const BOARD_CONFIG = {
  gridSize: 10,
  totalSquares: 100,
  cellSize: 1.2, // 3D units per square
  boardHeight: 0.3,
  
  // Deterministic Ladders: base -> top
  ladders: {
    4: 25,
    12: 30,
    28: 50,
    40: 59,
    62: 81,
    71: 91
  },

  // Deterministic Snakes: head -> tail
  snakes: {
    99: 78,
    92: 73,
    75: 55,
    48: 26,
    41: 3
  },

  playerColors: [
    { name: 'Ruby Red', hex: '#d32f2f', emissive: '#5a0d0d', metal: 0.3, roughness: 0.15 },
    { name: 'Sapphire Blue', hex: '#1976d2', emissive: '#0a2d54', metal: 0.3, roughness: 0.15 },
    { name: 'Emerald Green', hex: '#2e7d32', emissive: '#0c3810', metal: 0.3, roughness: 0.15 },
    { name: 'Amber Gold', hex: '#f57f17', emissive: '#592c00', metal: 0.6, roughness: 0.2 }
  ]
};

/**
 * Returns the 3D board coordinates (x, y, z) for a given square (1-100).
 * Row 0 (squares 1-10) is at the bottom (positive Z), left-to-right.
 * Row 1 (squares 11-20) is right-to-left.
 * Row 9 (squares 91-100) is at the top (negative Z).
 */
export function getSquareCoordinates(squareNumber) {
  if (squareNumber < 1) squareNumber = 1;
  if (squareNumber > 100) squareNumber = 100;

  const sqIndex = squareNumber - 1;
  const row = Math.floor(sqIndex / BOARD_CONFIG.gridSize);
  let col = sqIndex % BOARD_CONFIG.gridSize;

  // Alternating boustrophedon layout
  if (row % 2 === 1) {
    col = BOARD_CONFIG.gridSize - 1 - col;
  }

  const offset = (BOARD_CONFIG.gridSize - 1) / 2;
  const x = (col - offset) * BOARD_CONFIG.cellSize;
  const z = (offset - row) * BOARD_CONFIG.cellSize;
  const y = BOARD_CONFIG.boardHeight / 2;

  return { x, y, z, row, col };
}

/**
 * Returns offset positions for multiple tokens on the same square so they don't clip.
 */
export function getTokenOffsetOnSquare(playerIndex, totalOnSquare = 1) {
  if (totalOnSquare <= 1) return { ox: 0, oz: 0 };
  
  const radius = 0.28;
  const angle = (playerIndex * (2 * Math.PI / totalOnSquare)) + (Math.PI / 4);
  return {
    ox: Math.cos(angle) * radius,
    oz: Math.sin(angle) * radius
  };
}
