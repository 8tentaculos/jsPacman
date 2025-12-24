import Animation, { ANIMATION_HORIZONTAL } from './engine/Animation.js';
import Character from './Character.js';

/**
 * Base animation configuration for Pacman.
 * @type {Object}
 */
const animationBase = {
    imageURL : 'img/characters.png',
    numberOfFrame : 4,
    delta : 64,
    refreshRate : 60,
    offsetY : 60,
    type : ANIMATION_HORIZONTAL
};

/**
 * Animation definitions for Pacman in different directions.
 * @type {Object}
 */
const animations = {
    'right' : new Animation({
        ...animationBase
    }),

    'down' : new Animation({
        ...animationBase,
        offsetX : 64 * 4
    }),

    'up' : new Animation({
        ...animationBase,
        offsetX : 64 * 8
    }),

    'left' : new Animation({
        ...animationBase,
        offsetX : 64 * 12
    })
};

/**
 * Default properties for Pacman instances.
 * @type {Object}
 */
const defaults = {
    animations,
    dir : 'l',
    defaultAnimation : 'left',
    preturn : true,
    frightenedSpeed : null,
    frightenedDotSpeed : null,
    dotSpeed : null
};

/**
 * Pacman character class. Extends Character with Pacman-specific behavior.
 * @class Pacman
 * @extends {Character}
 */
class Pacman extends Character {
    /**
     * Creates an instance of Pacman.
     * @param {Object} options - Configuration options.
     * @param {string} [options.dir='l'] - Initial direction.
     * @param {boolean} [options.preturn=true] - Enable preturn for faster cornering.
     * @param {number} [options.frightenedSpeed] - Speed when ghosts are frightened.
     * @param {number} [options.frightenedDotSpeed] - Speed when eating dots and ghosts are frightened.
     * @param {number} [options.dotSpeed] - Speed when eating dots.
     * @param {Function} options.addGameGhostEatEventListener - Function to add ghost eat event listener.
     * @param {Function} options.addGameGhostModeFrightenedEnter - Function to add frightened enter listener.
     * @param {Function} options.addGameGhostModeFrightenedExit - Function to add frightened exit listener.
     */
    constructor(options) {
        super(options);

        Object.keys(defaults).forEach(key => {
            if (key in options) this[key] = options[key];
        });

        const {
            addGameGhostEatEventListener,
            addGameGhostModeFrightenedEnter,
            addGameGhostModeFrightenedExit
        } = options;

        this._ghostFrightened = [];

        // Change tile. Set direction.
        this.on('item:tile', (tile) => {
            if (this._ghostFrightened.length) this._speed = this.frightenedSpeed;
            else this._speed = this.speed;

            if (tile.item) {
                if (tile.hasPill()) { // Pill!
                    this.emit('item:eatpill', tile);
                }
                else if (tile.hasDot()) { // Dot!
                    this.emit('item:eatdot', tile);
                    if (this._ghostFrightened.length) this._speed = this.frightenedDotSpeed;
                    else this._speed = this.dotSpeed;
                }
                tile.item.destroy();
                tile.item = null;
            }

        });

        addGameGhostEatEventListener(() => {
            this._eatenTurns = 9;
            this.dir = 'r';
            this.pauseAnimation();
        });

        addGameGhostModeFrightenedEnter(ghost => {
            this._ghostFrightened = this._ghostFrightened.filter(f => f !== ghost).concat([ghost]);
        });

        addGameGhostModeFrightenedExit(ghost => {
            this._ghostFrightened = this._ghostFrightened.filter(f => f !== ghost);
        });
    }

    /**
     * Resets Pacman to initial state.
     */
    reset() {
        Character.prototype.reset.apply(this);
        this._lastEatenTurnsTime = null;
    }

    /**
     * Moves Pacman, handling eaten state animation if applicable.
     * @param {string} [dir] - Direction to move. If not provided, uses current direction.
     */
    move() {
        if (!this._eatenTurns) Character.prototype.move.apply(this, arguments);
        else if (!this._eatenTurnsFrames) {
            if (this._eatenTurns === 9) this.emit('item:die');
            if (this._eatenTurns > 2) {
                var directions = {'d' : 'l', 'l' : 'u', 'u' : 'r', 'r' : 'd'};
                this.dir = directions[this.dir];
                this.setNextAnimation();
                this.update();
                this._eatenTurnsFrames = 5;
            } else this._eatenTurnsFrames = 25;

            this._eatenTurns--;

            if (this._eatenTurns === 0) this.emit('item:life');

        } else this._eatenTurnsFrames--;
    }

};

Object.assign(Pacman.prototype, defaults);

export default Pacman;
