import Animation from './engine/Animation.js';
import Character from './Character.js';
import getDistance from './helper/getDistance.js';

/**
 * Base animation configuration for bonus items.
 * @type {Object}
 */
export const animationBase = {
    imageURL : 'img/misc.png',
    offsetY : 0,
    offsetX : 0
};

/**
 * Animation definitions for different bonus score values.
 * @type {Object}
 */
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

/**
 * Default properties for Bonus instances.
 * @type {Object}
 */
const defaults = {
    animations,
    speed : 40,
    score : '100'
};

/**
 * Bonus item class that moves through the maze and can be eaten by Pacman.
 * Extends Character with bonus-specific behavior.
 * @class Bonus
 * @extends {Character}
 */
class Bonus extends Character {
    /**
     * Creates an instance of Bonus.
     * @param {Object} options - Configuration options.
     * @param {number} [options.speed=40] - Bonus movement speed.
     * @param {string} [options.score='100'] - Score value when eaten.
     * @param {Function} options.getPacmanData - Function to get current Pacman position data.
     */
    constructor(options) {
        super(options);

        Object.keys(defaults).forEach(key => {
            if (key in options) this[key] = options[key];
        });

        this.getPacmanData = options.getPacmanData;

        // Change tile.
        this.on('item:tile', () => {
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

    /**
     * Moves the bonus and checks for collision with Pacman.
     */
    move() {
        Character.prototype.move.call(this, this._dir);
        // Eat or eaten!
        if (!this._eatEvent) {
            const pacmanData = this.getPacmanData();
            const pacmanTile = pacmanData.tile, tile = this.getTile(), opposite = this._getOpDirection(this._dir);
            if (pacmanTile === tile || (pacmanData.dir === opposite && pacmanTile === tile.get(opposite))) {
                this._eatEvent = true;

                this._nextAnimation =  this.animations[`score${this.score}`];
                this.update();

                this.emit('item:eaten', this);
            }
        }
    }

    /**
     * Calculates the next direction for the bonus using pathfinding.
     * @returns {string} The next direction ('u', 'r', 'd', 'l').
     */
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

    /**
     * Checks if the bonus can move in a given direction.
     * @param {string} dir - The direction to check.
     * @param {Tile} [tile] - The tile to check from. Defaults to current tile.
     * @returns {boolean} True if the bonus can move in that direction.
     */
    canGo(dir, tile) {
        if (!tile) tile = this.getTile();

        var nextTile = tile.get(dir);

        if (!nextTile) return false;

        return !nextTile.isWall() && !nextTile.isHouse();
    }

    /**
     * Gets the target tile for the bonus (first tunnel).
     * @returns {Tile} The target tile.
     * @private
     */
    _getTarget() {
        return this.map.tunnels[0];
    }

    /**
     * Overrides setNextAnimation to do nothing (bonus doesn't change animation).
     */
    setNextAnimation() {}
}

Object.assign(Bonus.prototype, defaults);

export default Bonus;
