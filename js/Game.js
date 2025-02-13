// === Game.js ===
class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    this.tileSize = 64; // 64x64 pixel tiles
    this.gridSize = 9;

    this.map = new Map();
    this.player = new Player(4, 4); // start in center
    this.currentLevel = 0;
    this.message = '';
    this.awaitingStart = false;

    this.loadLevel(this.currentLevel);
    this.setupInput();
  }

  async loadLevel(level) {
    try {
      const response = await fetch(
        `maps/${String(level).padStart(4, '0')}.txt`
      );
      if (!response.ok) throw new Error('Map not found.');

      const mapData = await response.text();
      if (!mapData.trim()) throw new Error('Empty map.');

      this.map.loadMap(mapData);
      this.player.setPosition(this.map.findStart());
      this.message = 'Press ENTER to start.';
      this.awaitingStart = true;
      this.render();
    } catch (error) {
      this.loadWinScreen();
    }
  }

  loadWinScreen() {
    this.map.grid = Array.from({ length: this.gridSize }, () =>
      Array(this.gridSize).fill('0')
    );
    this.message = 'You Win! Press R to restart.';
    this.awaitingStart = true;
    this.render();
  }

  setupInput() {
    window.addEventListener('keydown', (e) => {
      if (this.awaitingStart && e.key === 'Enter') {
        this.awaitingStart = false;
        this.message = '';

        if (this.map.isLevelComplete) {
          this.currentLevel++;
          this.loadLevel(this.currentLevel);
        } else {
          this.render();
        }

        return;
      }

      if (this.awaitingStart && e.key === 'r') {
        this.currentLevel = 0;
        this.loadLevel(this.currentLevel);
        return;
      }

      if (!this.awaitingStart) {
        const moves = {
          ArrowUp: [0, -1],
          ArrowDown: [0, 1],
          ArrowLeft: [-1, 0],
          ArrowRight: [1, 0],
          w: [0, -1],
          s: [0, 1],
          a: [-1, 0],
          d: [1, 0],
        };

        if (moves[e.key]) {
          const [dx, dy] = moves[e.key];
          const newX = this.player.x + dx;
          const newY = this.player.y + dy;

          if (this.map.isWalkable(newX, newY)) {
            this.player.move(dx, dy);

            if (this.map.getTile(newX, newY) === 'E') {
              this.message = 'Level Complete! Press ENTER for next level.';
              this.awaitingStart = true;
              this.map.isLevelComplete = true;
            }
            this.render();
          }
        }
      }
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Calculate top-left tile to render
    const startX = this.player.x - Math.floor(this.gridSize / 2);
    const startY = this.player.y - Math.floor(this.gridSize / 2);

    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const tileX = startX + col;
        const tileY = startY + row;
        const tile = this.map.getTile(tileX, tileY);

        this.ctx.fillStyle = this.getTileColor(tile);
        this.ctx.fillRect(
          col * this.tileSize,
          row * this.tileSize,
          this.tileSize,
          this.tileSize
        );
      }
    }

    // Draw player if not awaiting start
    if (!this.awaitingStart) {
      const centerX = Math.floor(this.gridSize / 2) * this.tileSize;
      const centerY = Math.floor(this.gridSize / 2) * this.tileSize;

      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(centerX, centerY, this.tileSize, this.tileSize);
    }

    // Draw message if present
    if (this.message) {
      const messageManager = new MessageManager(
        this.ctx,
        this.canvas.width,
        this.canvas.height
      );
      messageManager.displayMessage(this.message);
    }
  }

  getTileColor(tile) {
    switch (tile) {
      case '0':
        return 'green';
      case '1':
        return 'blue';
      case 'E':
        return 'red';
      case 'S':
        return 'lightgreen';
      default:
        return 'black';
    }
  }
}
