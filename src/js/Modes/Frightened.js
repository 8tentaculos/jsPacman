import Mode from './Mode';
import ts from '../helper/ts';
import rnd from '../helper/rnd';

class Frightened extends Mode {
    onEnter() {
        this._startTime = ts();
        this.ghost.emit('item:modefrightened:enter');
    }

    resume() {
        this._startTime += ts() - this._pauseTime;
    }

    getNextDirection() {
        var nextTile = this.ghost.getTile().get(this.ghost._dir); // Next tile.

        var directions = ['u', 'r', 'd', 'l', 'u', 'r', 'd', 'l']; // Clockwise direction order.

        // Select random direction. Then try that direction or change following clockwise order.
        var idx = rnd(4);

        var nextDirection = directions[idx];

        while (nextDirection && (nextDirection === this.ghost._getOpDirection(this.ghost._dir)  || !this.canGo(nextDirection, nextTile))) {
            nextDirection = directions[++idx];
        }

        return nextDirection;
    }

    setAnimation() {
        if (this.ghost.frightenedTime - this.ghost.frightenedTime * 0.2 > ts() - this._startTime) {
            this.ghost._nextAnimation = this.ghost.animations.frightened;
        } else {
            this.ghost._nextAnimation = this.ghost.animations.frightenedBlink;
        }
    }

    exit() {
        if (this.ghost.frightenedTime > ts() - this._startTime) return false;
        return true;
    }

    onExit() {
        if (!this.ghost.frightened) this.ghost.setMode();
        this.ghost.emit('item:modefrightened:exit');
    }
}

export default Frightened;
