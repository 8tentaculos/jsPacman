import Item from './Item.js';

/**
 * Default properties for Character instances.
 * @type {Object}
 */
const defaults = {
    width : 60,
    height : 60,
    step : 10,
    speed : 80,
    dir : null,
    preturn : false
};

const animationLabelsByDirections = {
    l : 'left',
    r : 'right',
    u : 'up',
    d : 'down'
};

const oppositeDirections = {
    l : 'r',
    r : 'l',
    u : 'd',
    d : 'u'
};

/**
 * Base Character class for game entities that can move.
 * Extends Item with movement and animation capabilities.
 * @class Character
 * @extends {Item}
 */
class Character extends Item {
    /**
     * Creates an instance of Character.
     * @param {Object} options - Configuration options.
     * @param {number} [options.width=60] - Character width in pixels.
     * @param {number} [options.height=60] - Character height in pixels.
     * @param {number} [options.step=10] - Movement step size.
     * @param {number} [options.speed=80] - Character speed.
     * @param {string} [options.dir=null] - Initial direction ('u', 'r', 'd', 'l').
     * @param {boolean} [options.preturn=false] - Enable preturn for faster cornering.
     */
    constructor(options) {
        super(options);

        Object.keys(defaults).forEach(key => {
            if (key in options) this[key] = options[key];
        });

        this.pauseAnimation();

        this.on('item:tile', () => {
            this.setNextAnimation();
        });

        this._moving = false;
        this._lastX = this.x;
        this._lastY = this.y;
        this._speed = this.speed;
        this._dir = null;
        this._nextAnimation = null;
        this._nextDirection = null;
        this._moving = false;

        this._saveDefaults();
    }

    /**
     * Saves default values for reset functionality.
     * @private
     */
    _saveDefaults() {
        this._defaults = {};

        [
            'x',
            'y',
            '_lastX',
            '_lastY',
            'dir',
            '_dir',
            '_nextAnimation',
            '_nextDirection',
            '_moving',
            'mode',
            'animation'
        ].forEach(key => {
            this._defaults[key] = this[key];
        });
    }

    /**
     * Resets the character to its initial state.
     */
    reset() {
        Object.assign(this, this._defaults);
        this.transform();
        this.setAnimation(this.animation);
        this.pauseAnimation();
    }

    /**
     * Updates character position, animation, and emits position events.
     */
    update() {
        var tile = this.getTile();

        // Fix float point offset.
        if (Math.abs(this.y - tile.y) < 1) this.y = tile.y;
        if (Math.abs(this.x - tile.x) < 1) this.x = tile.x;

        // Position change, move.
        if (this._lastX !== this.x || this._lastY != this.y) {
            this.setXYZ({
                x : this.x,
                y : this.y
            });

            this._lastX = this.x;
            this._lastY = this.y;

            if (!this._moving) {
                this.emit('item:move');
                this.resumeAnimation();
                this._moving = true;
            }
        } else {
            // Not moving.
            if (this._moving) {
                this.emit('item:stop');
                this.pauseAnimation();
                this._moving = false;
            }
        }
        // Changed animation.
        if (this._nextAnimation && this.animation !== this._nextAnimation) {
            this.setAnimation(this._nextAnimation);
        }

    }
    /**
     * Returns the character's position data.
     * @returns {Object} - Object containing character's position and tile information.
     */
    getPositionData() {
        return {
            x : this.x,
            y : this.y,
            tile : this.getTile(),
            dir : this.dir
        };
    }

    /**
     * Moves the character in the specified direction.
     * Called from Game main loop at every revolution.
     * @param {string} [dir] - Direction to move. If not provided, uses current direction.
     */
    move(dir) {
        if (!dir) dir = this.dir;
        if (!dir) return;

        var tile = this.getTile(), step, _step = this.getStep();
        // Could go that direction.
        if ((dir != this.dir || this._preturn) && this.canGo(dir)) {

            if (((dir !== this.dir && dir !== this._getOpDirection()) || this._preturn) && !this._isCentered()) {
                // Not in the center of the tile. Befor turn, set step so on next frame we get into the center.
                if (this._isV(dir)) {
                    var diffX = Math.abs(this.x - tile.x);
                    if (this.preturn) { // Set preturn to true to turn faster on corners.
                        if (!this._isCentered('x')) {
                            if (this.x > tile.x) this.x -= this.getMin(diffX, _step);
                            else this.x += this.getMin(diffX, _step);
                            this._preturn = true;
                        } else this._preturn = false;
                    } else {
                        step = this.getMin(diffX, _step);
                    }
                }
                if (this._isH(dir)) {
                    var diffY = Math.abs(this.y - tile.y);
                    if (this.preturn) { // Set preturn to true to turn faster on corners.
                        if (!this._isCentered('y')) {
                            if (this.y > tile.y) this.y -= this.getMin(diffY, _step);
                            else this.y += this.getMin(diffY, _step);
                            this._preturn = true;
                        } else this._preturn = false;
                    } else {
                        step = this.getMin(diffY, _step);
                    }
                }

            }
            // No step. Means change direction.
            if (!step) {
                this.dir = dir;
                this.setNextAnimation();
            }
        }

        if (!step) {
            // Keep straight.
            if (this.canGo(this.dir)) {
                step = _step;
            } else {
                // Wall.
                if (this._isV(this.dir)) { step = this.getMin(Math.abs(this.y - tile.y), _step); }
                if (this._isH(this.dir)) { step = this.getMin(Math.abs(this.x - tile.x), _step); }
            }
        }
        // Move.
        if (step) {
            if (this.dir === 'u') {
                this.y -= step;
            }
            if (this.dir === 'r') {
                this.x += step;
            }
            if (this.dir === 'd') {
                this.y += step;
            }
            if (this.dir === 'l') {
                this.x -= step;
            }
        }
        // Pass away limits.
        if (this.x < 0) this.x = this.map.width * this.map.tileWidth;
        if (this.x > this.map.width * this.map.tileWidth) this.x = 0;
        if (this.y < 0) this.y = this.map.height * this.map.tileHeight;
        if (this.y > this.map.height * this.map.tileHeight) this.y = 0;

        tile = this.getTile();

        if (tile !== this._lastTile) {
            this._lastTile = tile;
            this.emit('item:tile', tile);
        }

        this.update();
    }

    /**
     * Calculates the movement step size based on current speed.
     * @returns {number} The step size in pixels.
     */
    getStep() {
        return this.step * (this._speed / 100);
    }

    /**
     * Sets the next animation based on current direction.
     * Override in subclasses for custom animation logic.
     */
    setNextAnimation() {
        this._nextAnimation = this.animations[animationLabelsByDirections[this.dir]];
    }

    /**
     * Gets the opposite direction.
     * @param {string} [dir] - Direction to get opposite of. If not provided, uses current direction.
     * @returns {string} The opposite direction.
     * @private
     */
    _getOpDirection(dir) {
        return oppositeDirections[dir || this.dir];
    }

    /**
     * Checks if the character can move in the specified direction.
     * @param {string} dir - The direction to check ('u', 'r', 'd', 'l').
     * @returns {boolean} True if the character can move in that direction.
     */
    canGo(dir) {
        const tile = this.getTile();

        const nextTile = tile.get(dir);

        return nextTile && !nextTile.isHouse() && !nextTile.isWall();
    }

    /**
     * Checks if direction is vertical (up or down).
     * @param {string} dir - The direction to check.
     * @returns {boolean} True if direction is vertical.
     * @private
     */
    _isV(dir) {
        return dir === 'u' || dir === 'd';
    }

    /**
     * Checks if direction is horizontal (left or right).
     * @param {string} dir - The direction to check.
     * @returns {boolean} True if direction is horizontal.
     * @private
     */
    _isH(dir) {
        return dir === 'l' || dir === 'r';
    }

    /**
     * Checks if the character is centered on the current tile.
     * @param {string} [xy] - 'x' or 'y' to check specific axis, or undefined for both.
     * @returns {boolean} True if centered.
     * @private
     */
    _isCentered(xy) {
        var tile = this.getTile();
        var x = tile.x === this.x, y = tile.y === this.y;

        if (xy === 'x') return x;
        if (xy === 'y') return y;
        else return  x && y;
    }

    /**
     * Gets the minimum value from the provided arguments.
     * @returns {number} The minimum value.
     */
    getMin() {
        var min = null;
        for (var i = 0, l = arguments.length; i < l; i++)
            if (min === null || arguments[i] < min) min = arguments[i];

        return min;
    }

}

Object.assign(Character.prototype, defaults);

export default Character;
