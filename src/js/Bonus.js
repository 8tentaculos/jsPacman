import Animation from './engine/Animation';
import Character from './Character';
import getDistance from './helper/getDistance';

export const animationBase = {
    imageURL : 'img/misc.png',
    offsetY : 0,
    offsetX : 0
}

export const animations = {
    'default' : new Animation({
        ...animationBase
    }),
    'score100' : new Animation({
        ...animationBase,
        offsetY : 60
    }),
    'score200' : new Animation({
        ...animationBase,
        offsetX : 60,
        offsetY : 60
    }),
    'score500' : new Animation({
        ...animationBase,
        offsetX : 60 * 2,
        offsetY : 60
    }),
    'score700' : new Animation({
        ...animationBase,
        offsetX : 60 * 3,
        offsetY : 60
    }),
    'score1000' : new Animation({
        ...animationBase,
        offsetX : 60 * 4,
        offsetY : 60
    }),
    'score2000' : new Animation({
        ...animationBase,
        offsetX : 60 * 5,
        offsetY : 60
    }),
    'score5000' : new Animation({
        ...animationBase,
        offsetX : 60 * 6,
        offsetY : 60
    })
};

const defaults = {
    animations,
    speed : 40,
    score : '100'
};

class Bonus extends Character {
    constructor(options) {
        super(options);

        Object.keys(defaults).forEach(key => {
            if (key in options) this[key] = options[key];
        })

        const { addPacmanPositionEventListener } = options;

        // Change tile.
        this.on('item:tile', (tile) => {
            this._dir = this._nextDir;
            this._nextDir = this.getNextDirection();
            this._eatEvent = false;

            if (this.getTile() === this._getTarget()) {
                if (this._targetFound) {
                    this._targetFound--;
                } else {
                    this.emit('item:destroy');
                }
            }

        });

        addPacmanPositionEventListener(data => {
            this.pacmanData = data;
        });

        this._targetFound = 2;
    }

    move() {
        Character.prototype.move.call(this, this._dir);
        // Eat or eaten!
        if (!this._eatEvent) {
            var pacmanTile = this.pacmanData.tile, tile = this.getTile(), opposite = this._getOpDirection(this._dir);
            if (pacmanTile === tile || (this.pacmanData.dir === opposite && pacmanTile === tile.get(opposite))) {
                this._eatEvent = true;

                this._nextAnimation =  this.animations[`score${this.score}`];
                this.update();

                this.emit('item:eaten', this);
            }
        }
    }

    getNextDirection() {
        var targetTile = this._getTarget(); // Target Tile

        var _dir = this._dir || this.dir;

        var nextTile = this.getTile().get(_dir); // Next tile.

        var directions = ['u', 'l', 'd', 'r']; // Preferred direction order.

        var nextDirection, lastDistance;

        for (var i = 0; i < 4; i++) {
            var dir = directions[i];

            if (dir === this._getOpDirection(_dir)) continue; // Cant't go back.

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

    canGo(dir, tile) {
        if (!tile) tile = this.getTile();

        var nextTile = tile.get(dir);

        if (!nextTile) return false;

        return !nextTile.isWall() && !nextTile.isHouse();
    }

    _getTarget() {
        return this.map.tunnels[0];
    }

    _setNextAnimation() {}
}

Object.assign(Bonus.prototype, defaults);

export default Bonus;
