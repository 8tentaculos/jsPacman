import $ from 'jquery';
import Bot from '../Bot';
import ts from '../helper/ts';
import getDistance from '../helper/getDistance';

class Mode {
    constructor(ghost) {
        this.ghost = ghost;
    }

    move() {
        if (this.exit()) this.onExit();
        else {
            Bot.prototype.move.call(this.ghost, this.ghost._dir);
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

    setAnimation() {
        Bot.prototype._setAnimation.call(this.ghost);
    }

    canGo(dir, t) {
        if (!t) t = this.ghost.getTile();
        var nt = t.get(dir);

        if (!nt) return false;

        return !nt.isWall() && !nt.isHouse();
    }

    exit() {
        if (this.ghost.mode != this.ghost.globalMode) return true;
        return false;
    }

    onExit() {
        var t = this.ghost.getTile();
        if (!t.isHouse()) {
            this.ghost._turnBack = true;
        }
        this.ghost.setMode();
    }
}

export default Mode;
