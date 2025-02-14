// === Constants.js ===
// Tile types
const TILE_TYPES = {
  EMPTY: '0',
  WATER: '1',
  START: 'S',
  END: 'E',
  STONE_WALL: 'W',
  CRACKED_FLOOR: 'C',
  ICE: 'I',
  HOLE: 'H',
  BUTTON: 'B',
  LOCKED_DOOR: 'D',
};

// Tile colors
const TILE_COLORS = {
  [TILE_TYPES.EMPTY]: 'green',
  [TILE_TYPES.WATER]: 'blue',
  [TILE_TYPES.START]: 'lightgreen',
  [TILE_TYPES.END]: 'red',
  [TILE_TYPES.STONE_WALL]: 'gray',
  [TILE_TYPES.CRACKED_FLOOR]: 'saddlebrown',
  [TILE_TYPES.ICE]: 'lightblue',
  [TILE_TYPES.HOLE]: 'black',
  [TILE_TYPES.BUTTON]: 'gray',
  [TILE_TYPES.LOCKED_DOOR]: 'saddlebrown',
};

const PLAYER_SETTINGS = {
  SIZE_RATIO: 0.6, // player is 60% of tile size
  COLOR: 'white',
  INITIAL_STATE: {
    hasSwimPowerup: false,
  },
};

const ANIMATION_SETTINGS = {
  CRUMBLE_DURATION: 1000,
  BUTTON_PRESS_DURATION: 200,
  DOOR_UNLOCK_DURATION: 500,
};

const DEBUG = true;
