// === Player.js ===
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.state = {
      ...PLAYER_SETTINGS.INITIAL_STATE,
    };
  }

  move(dx, dy, tileManager) {
    const nextPosition = tileManager.handleMovement(this.x, this.y, dx, dy);

    this.x = nextPosition.x;
    this.y = nextPosition.y;
  }

  setPosition(pos) {
    this.x = pos.x;
    this.y = pos.y;
  }

  giveSwimPowerup() {
    this.state.hasSwimPowerup = true;
  }

  removeSwimPowerup() {
    this.state.hasSwimPowerup = false;
  }
}
