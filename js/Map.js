// === Map.js ===
class Map {
  constructor() {
    this.grid = [];
    this.isLevelComplete = false;
  }

  loadMap(mapData) {
    this.grid = mapData.split('\n').map((line) => line.split(''));
    this.isLevelComplete = false;
  }

  getTile(x, y) {
    if (y >= 0 && y < this.grid.length && x >= 0 && x < this.grid[y].length) {
      return this.grid[y][x];
    }

    return null;
  }

  isWalkable(x, y) {
    const tile = this.getTile(x, y);
    return tile !== '1' && tile !== null;
  }

  findStart() {
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.grid[y][x] === 'S') {
          return { x, y };
        }
      }
    }
    
    return { x: 4, y: 4 }; // default fallback position
  }
}
