# simple-html-game

A simple HTML and Javascript game for hosting on pages

## Error message when trying to step on a button tile

```
Map.js:59 Uncaught TypeError: Cannot read properties of undefined (reading 'getEffect')
    at Map.unlockDoor (Map.js:59:48)
    at ButtonTile.onEnter (TileEffects.js:218:21)
    at TileManager.handleMovement (TileManager.js:40:29)
    at Player.move (Player.js:13:38)
    at Game.handleGameInput (Game.js:112:21)
    at Game.js:73:12
```
