class TileManager {
  constructor(game) {
    this.game = game;

    this.effects = {
      [TILE_TYPES.START]: new StartTile(game),
      [TILE_TYPES.END]: new EndTile(game),

      [TILE_TYPES.EMPTY]: new GrassTile(game),
      [TILE_TYPES.CRACKED_FLOOR]: new CrackedFloorTile(game),
      [TILE_TYPES.ICE]: new IceTile(game),
      [TILE_TYPES.WATER]: new WaterTile(game),
      [TILE_TYPES.HOLE]: new HoleTile(game),
      [TILE_TYPES.STONE_WALL]: new StoneWallTile(game),
      [TILE_TYPES.LOCKED_DOOR]: new LockedDoorTile(game),
      [TILE_TYPES.BUTTON]: new ButtonTile(game),
    };
  }

  getEffect(tileType) {
    return this.effects[tileType] || this.effects[TILE_TYPES.EMPTY];
  }

  isWalkable(x, y) {
    const tile = this.game.map.getTile(x, y);
    return tile !== null && this.getEffect(tile).isWalkable();
  }

  handleMovement(currentX, currentY, dx, dy) {
    const currentTile = this.game.map.getTile(currentX, currentY);
    const effect = this.getEffect(currentTile);

    const nextPos = effect.getNextPosition(currentX, currentY, dx, dy);

    // handle exit from current tile
    effect.onExit(currentX, currentY);

    // handle entry to next tile
    const newTile = this.game.map.getTile(nextPos.x, nextPos.y);
    this.getEffect(newTile).onEnter(nextPos.x, nextPos.y);

    return nextPos;
  }

  renderTile(tileType, ctx, x, y, tileSize) {
    const effect = this.getEffect(tileType);
    effect.render(ctx, x, y, tileSize);
  }
}
