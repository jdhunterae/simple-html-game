// === TileEffects.js ===
class TileEffect {
  constructor(game) {
    this.game = game;
  }

  onEnter(x, y) {}
  onExit(x, y) {}
  isWalkable() {
    return true;
  }
  getNextPosition(currentX, currentY, dx, dy) {
    return { x: currentX + dx, y: currentY + dy };
  }

  render(ctx, x, y, tileSize) {
    ctx.fillStyle = this.getColor();
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
  }

  animate(ctx, x, y, tileSize, newTileType) {}

  getColor() {
    return TILE_COLORS[this.constructor.type] || 'gray';
  }
}

class GrassTile extends TileEffect {
  static type = TILE_TYPES.EMPTY;

  getColor() {
    return 'green';
  }
}

class WaterTile extends TileEffect {
  static type = TILE_TYPES.WATER;

  getColor() {
    return 'blue';
  }

  isWalkable() {
    return this.game.player.hasSwimPowerup;
  }

  onEnter(x, y) {
    if (!this.game.player.hasSwimPowerup) {
      this.game.resetLevel('You drowned! Press ENTER to try again.');
    }
  }

  render(ctx, x, y, tileSize) {
    ctx.fillStyle = this.getColor();
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

    // wave effect
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    const waveHeight = 3;
    const offset = (Date.now() / 1000) % 1; // sliding animation

    for (let i = 0; i < tileSize; i += 8) {
      ctx.beginPath();
      ctx.moveTo(x * tileSize, y * tileSize + i + offset * 8);
      ctx.lineTo(x * tileSize + tileSize, y * tileSize + i + offset * 8);
      ctx.stroke();
    }
  }
}

class IceTile extends TileEffect {
  static type = TILE_TYPES.ICE;

  getColor() {
    return 'lightblue';
  }

  getNextPosition(currentX, currentY, dx, dy) {
    let nextX = currentX + dx;
    let nextY = currentY + dy;

    while (
      this.game.map.getTile(nextX, nextY) === TILE_TYPES.ICE &&
      this.game.map.isInBounds(nextX + dx, nextY + dy)
    ) {
      nextX += dx;
      nextY += dy;
    }

    if (this.game.map.isWalkable(nextX, nextY)) {
      return { x: nextX, y: nextY };
    }

    return { x: nextX - dx, y: nextY - dy };
  }

  render(ctx, x, y, tileSize) {
    ctx.fillStyle = this.getColor();
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

    // shine effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';

    ctx.beginPath();
    ctx.moveTo(x * tileSize, y * tileSize);
    ctx.lineTo(x * tileSize + tileSize / 3, y * tileSize);
    ctx.lineTo(x * tileSize, y * tileSize + tileSize / 3);
    ctx.fill();
  }
}

class CrackedFloorTile extends TileEffect {
  static type = TILE_TYPES.CRACKED_FLOOR;

  onExit(x, y) {
    this.animate(this.game.ctx, x, y, this.game.tileSize, TILE_TYPES.HOLE);
  }

  animate(ctx, x, y, tileSize, newTileType) {
    const startTime = Date.now();
    const animationDuration = 1000; // 1 second
    const fps = 60;

    const crumbleAnimation = setInterval(() => {
      const progress = (Date.now() - startTime) / animationDuration;

      if (progress >= 1) {
        clearInterval(crumbleAnimation);
        this.game.map.setTile(x, y, newTileType);
        return;
      }

      // Draw crumbling floor
      ctx.fillStyle = this.getColor();
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

      const cracks = Math.floor(progress * 5) + 1;
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;

      for (let i = 0; i < cracks; i++) {
        ctx.beginPath();
        const startX = x * tileSize + Math.random() * tileSize;
        const startY = y * tileSize + Math.random() * tileSize;
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + 10, startY + 10);
        ctx.stroke();
      }

      // gradually darken
      ctx.fillStyle = `rgba(0, 0, 0, ${progress * 0.5})`;
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }, 1000 / fps);
  }

  render(ctx, x, y, tileSize) {
    ctx.fillStyle = this.getColor();
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

    // Permanent cracks
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x * tileSize + Math.random() * tileSize, y * tileSize);
      ctx.lineTo(
        x * tileSize + Math.random() * tileSize,
        y * tileSize + tileSize
      );
      ctx.stroke();
    }
  }
}

class HoleTile extends TileEffect {
  static type = TILE_TYPES.HOLE;

  getColor() {
    return 'black';
  }

  isWalkable() {
    return false;
  }

  onEnter(x, y) {
    this.game.resetLevel('You fell! Press ENTER to try again.');
  }

  render(ctx, x, y, tileSize) {
    // gradient for depth
    const gradient = ctx.createRadialGradient(
      x * tileSize + tileSize / 2,
      y * tileSize + tileSize / 2,
      0,
      x * tileSize + tileSize / 2,
      y * tileSize + tileSize / 2,
      tileSize / 2
    );
    gradient.addColorStop(0, 'rgb(30, 30, 30)');
    gradient.addColorStop(1, this.getColor());
    ctx.fillStyle = gradient;
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
  }
}

class ButtonTile extends TileEffect {
  static type = TILE_TYPES.BUTTON;
  #pressed = false;

  getColor() {
    return 'gray';
  }

  onEnter(x, y) {
    if (!this.#pressed) {
      this.#pressed = true;
      this.game.map.unlockDoor();
      this.animate(this.game.ctx, x, y, this.game.tileSize);
    }
  }

  animate(ctx, x, y, tileSize) {
    const startTime = Date.now();
    const animationDuration = 200; // 0.2 seconds
    const fps = 60;

    const pressAnimation = setInterval(() => {
      const progress = (Date.now() - startTime) / animationDuration;

      if (progress >= 1) {
        clearInterval(pressAnimation);
        return;
      }

      this.render(ctx, x, y, tileSize, progress);
    }, 1000 / fps);
  }

  render(ctx, x, y, tileSize, pressProgress = this.#pressed ? 1 : 0) {
    ctx.fillStyle = this.getColor();
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

    const buttonSize = tileSize * 0.6;
    const buttonX = x * tileSize + (tileSize - buttonSize) / 2;
    const buttonY = y * tileSize + (tileSize - buttonSize) / 2;
    const buttonHeight = tileSize * 0.2 * (1 - pressProgress);

    // button sides--3d effect
    ctx.fillStyle = this.#pressed ? 'darkred' : 'red';
    ctx.fillRect(buttonX, buttonY + buttonHeight, buttonSize, buttonSize);
  }
}

class LockedDoorTile extends TileEffect {
  static type = TILE_TYPES.LOCKED_DOOR;
  #unlocked = false;

  getColor() {
    return 'saddlebrown';
  }

  isWalkable() {
    return this.#unlocked;
  }

  unlock() {
    this.#unlocked = true;
    this.animate(this.game.ctx, this.x, this.y, this.game.tileSize);
  }

  animate(ctx, x, y, tileSize) {
    const startTime = Date.now();
    const animationDuration = 500; // 0.5 seconds
    const fps = 60;

    const unlockAnimation = setInterval(() => {
      const progress = (Date.now() - startTime) / animationDuration;

      if (progress >= 1) {
        clearInterval(unlockAnimation);
        return;
      }

      this.render(ctx, x, y, tileSize, progress);
    }, 1000 / fps);
  }

  render(ctx, x, y, tileSize, unlockProgress = this.#unlocked ? 1 : 0) {
    // frame
    ctx.fillStyle = this.getColor();
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

    // door
    ctx.fillStyle = this.#unlocked
      ? `rgba(139, 69, 19, ${1 - unlockProgress})`
      : 'rgb(139, 69, 19)';
    const doorWidth = tileSize * (1 - unlockProgress);
    ctx.fillRect(x * tileSize, y * tileSize, doorWidth, tileSize);

    // lock
    if (!this.#unlocked) {
      ctx.fillStyle = 'gold';
      const lockSize = tileSize * 0.2;
      ctx.fillRect(
        x * tileSize + tileSize * 0.7,
        y * tileSize + tileSize * 0.4,
        lockSize,
        lockSize
      );
    }
  }
}

class StartTile extends TileEffect {
  static type = TILE_TYPES.START;

  getColor() {
    return 'green';
  }

  onEnter(x, y) {
    // Could trigger special effects when return to start
  }

  render(ctx, x, y, tileSize) {
    ctx.fillStyle = this.getColor();
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

    // glowing effect
    const time = Date.now() / 1000;
    const alpha = ((Math.sin(time * 2) + 1) / 2) * 0.3; // pulsing opacity

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    const padding = tileSize * 0.1;
    ctx.fillRect(
      x * tileSize + padding,
      y * tileSize + padding,
      tileSize - 2 * padding,
      tileSize - 2 * padding
    );

    // arrow indicating start
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x * tileSize + tileSize / 2, y * tileSize + tileSize * 0.2);
    ctx.lineTo(x * tileSize + tileSize / 2, y * tileSize + tileSize * 0.8);
    ctx.moveTo(x * tileSize + tileSize * 0.3, y * tileSize + tileSize * 0.6);
    ctx.lineTo(x * tileSize + tileSize / 2, y * tileSize + tileSize * 0.8);
    ctx.lineTo(x * tileSize + tileSize * 0.7, y * tileSize + tileSize * 0.6);
    ctx.stroke();
  }
}

class EndTile extends TileEffect {
  static type = TILE_TYPES.END;

  getColor() {
    return 'red';
  }

  onEnter(x, y) {
    this.game.completeLevel();
  }

  render(ctx, x, y, tileSize) {
    ctx.fillStyle = this.getColor();
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

    // portal effect
    const time = Date.now() / 1000;
    const rotation = time % (Math.PI * 2);

    const rings = 3;
    for (let i = 0; i < rings; i++) {
      const scale = 0.8 - i * 0.2;
      const alpha = 0.7 - i * 0.2;

      ctx.beginPath();
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.ellipse(
        0,
        0,
        tileSize * 0.4 * scale,
        tileSize * 0.2 * scale,
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }

    ctx.restore();
  }
}

class StoneWallTile extends TileEffect {
  static type = TILE_TYPES.STONE_WALL;

  getColor() {
    return 'gray';
  }

  isWalkable() {
    return false;
  }

  render(ctx, x, y, tileSize) {
    ctx.fillStyle = this.getColor();
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

    // Stone pattern
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1;

    // Horizontal lines
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x * tileSize, y * tileSize + (tileSize / 3) * i);
      ctx.lineTo(x * tileSize + tileSize, y * tileSize + (tileSize / 3) * i);
      ctx.stroke();
    }

    // Vertical lines
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(x * tileSize + (tileSize / 4) * i, y * tileSize);
      ctx.lineTo(x * tileSize + (tileSize / 4) * i, y * tileSize + tileSize);
      ctx.stroke();
    }
  }
}
