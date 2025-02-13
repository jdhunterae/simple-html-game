// === Player.js ===
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  setPosition(pos) {
    this.x = pos.x;
    this.y = pos.y;
  }
}
