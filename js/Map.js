// === Map.js ===
class Map {
  constructor() {
    this.grid = [];
    this.isLevelComplete = false;
    this.doorUnlocked = false;
  }

  loadMap(mapData) {
    this.grid = mapData
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => line.split(''));

    this.isLevelComplete = false;
    this.doorUnlocked = false;
  }

  isInBounds(x, y) {
    return y >= 0 && y < this.grid.length && x >= 0 && x < this.grid[y].length;
  }

  getTile(x, y) {
    if (this.isInBounds(x, y)) {
      return this.grid[y][x];
    }

    return null;
  }

  setTile(x, y, tileType) {
    if (this.isInBounds(x, y)) {
      this.grid[y][x] = tileType;
    }
  }

  findStart() {
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.grid[y][x] === TILE_TYPES.START) {
          return { x, y };
        }
      }
    }

    return {
      x: Math.floor(this.grid[0].length / 2),
      y: Math.floor(this.grid.length / 2),
    }; // default fallback position
  }

  unlockDoor() {
    this.doorUnlocked = true;

    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.grid[y][x] === TILE_TYPES.LOCKED_DOOR) {
          if (this.tileManager) {
            const doorEffect = this.tileEffect.getEffect(
              TILE_TYPES.LOCKED_DOOR
            );
            doorEffect.unlock();
          }
        }
      }
    }
  }

  findTilePositions(tileType) {
    const positions = [];

    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.grid[y][x] === tileType) {
          positions.push(x, y);
        }
      }
    }

    return positions;
  }

  setTileManager(tileManager) {
    this.tileManager = tileManager;
  }

  getWidth() {
    return this.grid[0]?.length || 0;
  }

  getHeight() {
    return this.grid.length || 0;
  }

  isWalkable(x, y) {
    return this.tileManager ? this.tileManager.isWalkable(x, y) : false;
  }
}
