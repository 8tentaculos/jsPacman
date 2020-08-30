import Character from '../Character';
import ts from '../helper/ts';
import getDistance from '../helper/getDistance';

class Mode {
    constructor(ghost) {
        this.ghost = ghost;
    }

    move() {
        if (this.exit()) this.onExit();
        else {
            Character.prototype.move.call(this.ghost, this.ghost._dir);
        }
    }

    pause() {
        this._pauseTime = ts();
    }

    resume() {}

    getNextDirection() {
        var targetTile = this._getTarget(); // Target Tile

        var _dir = this.ghost._dir || this.ghost.dir;

        var nextTile = this.ghost.getTile().get(_dir); // Next tile.

        var directions = ['u', 'l', 'd', 'r']; // Preferred direction order.

        var nextDirection, lastDistance;

        for (var i = 0; i < 4; i++) {
            var dir = directions[i];

            if (dir === this.ghost._getOpDirection(_dir)) continue; // Cant't go back.

            if (this.canGo(dir, nextTile)) {
                var testTile = nextTile.get(dir);
                var distance = getDistance(testTile, targetTile);

                if (typeof lastDistance === 'undefined' || lastDistance > distance) {
                    nextDirection = dir;
                    lastDistance = distance;
                }
            }
        }

        return nextDirection;
    }

    _getTarget() {}

    setAnimation () {
        Character.prototype._setNextAnimation.call(this.ghost);
    }

    canGo(dir, tile) {
        if (!tile) tile = this.ghost.getTile();
        var nextTile = tile.get(dir);

        if (!nextTile) return false;

        return !nextTile.isWall() && !nextTile.isHouse();
    }

    exit() {
        if (this.ghost.mode != this.ghost.globalMode) return true;
        return false;
    }

    onExit() {
        var tile = this.ghost.getTile();
        if (!tile.isHouse()) {
            this.ghost._turnBack = true;
        }
        this.ghost.setMode();
    }
}

export default Mode;
