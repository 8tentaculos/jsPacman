import Item from './Item';

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

class Character extends Item {
    constructor(options) {
        super(options);

        Object.keys(defaults).forEach(key => {
            if (key in options) this[key] = options[key];
        });

        this.pauseAnimation();

        this.on('item:tile', (tile) => {
            this._setNextAnimation();
        });

        this._moving = false;
        this._lastX = this.x;
        this._lastY = this.y;
        this._speed = this.speed;
        this._dir = null;
        this._nextAnimation = null;
        this._nextDirection = null;
        this._moving = false;

        this._saveDefaults()
    }

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


    reset() {
        Object.assign(this, this._defaults);
        this.transform();
        this.setAnimation(this.animation);
        this.pauseAnimation();
    }

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

            this.emit('item:position', this._getPositionData())
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

    _getPositionData() {
        return {
            x : this.x,
            y : this.y,
            tile : this.getTile(),
            dir : this.dir
        };
    }
    // Called from Game main loop at every revolution.
    move(dir) {
        if (!dir) dir = this.dir;
        if (!dir) return;

        var tile = this.getTile(), step, _step = this.getStep();
        // Could go that direction.
        if ((dir != this.dir || this._preturn) && this._canGo(dir)) {

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
                this._setNextAnimation();
            }
        }

        if (!step) {
            // Keep straight.
            if (this._canGo(this.dir)) {
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

    getStep() {
        return this.step * (this._speed / 100);
    }
    // Set animation according model conditions. Override on subclasses.
    _setNextAnimation() {
        this._nextAnimation = this.animations[animationLabelsByDirections[this.dir]];
    }
    // Helper methods:
    _getOpDirection(dir) {
        return oppositeDirections[dir || this.dir];
    }
    // Tile on passed direction is available for walking.
    _canGo(dir) {
        const tile = this.getTile();

        const nextTile = tile.get(dir);

        return nextTile && !nextTile.isHouse() && !nextTile.isWall();
    }

    _isV(dir) {
        return dir === 'u' || dir === 'd';
    }

    _isH(dir) {
        return dir === 'l' || dir === 'r';
    }

    _isCentered(xy) {
        var tile = this.getTile();
        var x = tile.x === this.x, y = tile.y === this.y;

        if (xy === 'x') return x;
        if (xy === 'y') return y;
        else return  x && y;
    }

    getMin() {
        var min = null;
        for (var i = 0, l = arguments.length; i < l; i++)
            if (min === null || arguments[i] < min) min = arguments[i];

        return min;
    }

}

Object.assign(Character.prototype, defaults);

export default Character;
