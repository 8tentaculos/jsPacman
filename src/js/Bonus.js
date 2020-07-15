import $ from 'jquery';
import Bot from './Bot';
import getDistance from './helper/getDistance';

class Bonus extends Bot {
    constructor(attrs) {
        super(attrs);
        // Change tile.
        this.on('item:tile', (t) => {
            let offset;
            if (this.y === t.y) offset = 1;
            else offset = 2;
            if (t.col % 2) this._offsetY = -offset;
            else this._offsetY = offset;

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

        this._targetFound = 2;
    }

    move() {
        Bot.prototype.move.call(this, this._dir);
        // Eat or eaten!
        if (!this._eatEvent) {
            var pt = this.pacman.getTile(), t = this.getTile(), op = this._getOpDirection(this.dir);
            if (pt === t || (this.pacman.dir === op && pt === t.get(op))) {
                this._eatEvent = true;

                this.animation =  this.animations['score_' + this.score];
                this.render();

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

    canGo(dir, t) {
        if (!t) t = this.ghost.getTile();
        var nt = t.get(dir);

        if (!nt) return false;

        return !nt.isWall() && !nt.isHouse();
    }

    _getTarget() {
        return this.map.tunnels[0];
    }

    _setAnimation() {}
}

Object.assign(Bonus.prototype, {
    // Options.
    dir : null,
    // Overriden by Level
    speed : 40,

    pacman : null,

    score : '100',

    animationBase : {
        imageURL : 'img/misc.png',
        offsety : 0,
        offsetx : 0
    },

    animations : {
        default : {},

        score_100 : {
            offsety : 60
        },

        score_200 : {
            offsetx : 60,
            offsety : 60
        },

        score_500 : {
            offsetx : 60 * 2,
            offsety : 60
        },

        score_700 : {
            offsetx : 60 * 3,
            offsety : 60
        },

        score_1000 : {
            offsetx : 60 * 4,
            offsety : 60
        },

        score_2000 : {
            offsetx : 60 * 5,
            offsety : 60
        },

        score_5000 : {
            offsetx : 60 * 6,
            offsety : 60
        }
    }
});

export default Bonus;
