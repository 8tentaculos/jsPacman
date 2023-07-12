import Animation, { ANIMATION_HORIZONTAL } from './engine/Animation';
import Timer from './engine/Timer';
import Character from './Character';
import getDistance from './helper/getDistance';
import rnd from './helper/rnd';

export const MODE_SCATTER = 'scatter';
export const MODE_CHASE = 'chase';
export const MODE_FRIGHTENED = 'frightened';
export const MODE_HOUSE = 'house';
export const MODE_DEAD = 'dead';

export const animationBase = {
    imageURL : 'img/characters.png',
    numberOfFrame : 2,
    delta : 64,
    refreshRate : 180,
    type : ANIMATION_HORIZONTAL
};

export const animations = {
    'frightened' : new Animation({
        ...animationBase,
        offsetY : 376,
        offsetX : -2
    }),

    'frightenedBlink' : new Animation({
        ...animationBase,
        offsetY : 376,
        offsetX : -2,
        numberOfFrame : 4
    }),

    'deadRight' : new Animation({
        ...animationBase,
        offsetY : 376,
        offsetX : 64 * 4 - 2,
        numberOfFrame : 1
    }),

    'deadDown' : new Animation({
        ...animationBase,
        offsetY : 376,
        offsetX : 64 * 5 - 2,
        numberOfFrame : 1
    }),

    'deadUp' : new Animation({
        ...animationBase,
        offsetY : 376,
        offsetX : 64 * 6 - 2,
        numberOfFrame : 1
    }),

    'deadLeft' : new Animation({
        ...animationBase,
        offsetY : 376,
        offsetX : 64 * 7 - 2,
        numberOfFrame : 1
    }),

    'score200' : new Animation({
        ...animationBase,
        imageURL : 'img/misc.png',
        numberOfFrame : 1,
        offsetX : -2,
        offsetY : 110
    }),

    'score400' : new Animation({
        ...animationBase,
        imageURL : 'img/misc.png',
        numberOfFrame : 1,
        offsetX : 64 * 1 - 2,
        offsetY : 110
    }),

    'score800' : new Animation({
        ...animationBase,
        imageURL : 'img/misc.png',
        numberOfFrame : 1,
        offsetX : 64 * 2 - 2,
        offsetY : 110
    }),

    'score1600' : new Animation({
        ...animationBase,
        imageURL : 'img/misc.png',
        numberOfFrame : 1,
        offsetX : 64 * 3,
        offsetY : 110
    })
};

const defaults = {
    animations,
    width : 64,
    speed : 75,
    frightenedTime : 5,
    waitTime : 4,
    scatterTarget : 0,
    mode : MODE_HOUSE,
    score : '200',
    scores : { '200' : '400', '400' : '800', '800' : '1600' },
    blinky : null,
    getChaseTarget : function() {
        return this.pacmanData.tile;
    },
    tunnelSpeed : null,
    frightenedSpeed : null,
    frightenedFlashes : null
};

class Ghost extends Character {
    constructor(options) {
        super(options);

        Object.keys(defaults).forEach(key => {
            if (key in options) this[key] = options[key];
        });

        const {
            addGameGlobalModeEventListener,
            addGameGhostEatenEventListener,
            addPacmanEatPillEventListener,
            addPacmanPositionEventListener
        } = options;

        this.deadTarget = this.map.house.getR().getU();
        this.deadEndX = this._defaults.x;
        this.deadEndY = this.map.houseCenter.y;
        this.deadEnd = this.map.getTile(this.deadEndX, this.deadEndY, true);

        this.houseTop = this.y - this.getTile().height / 2;
        this.houseBottom = this.y + this.getTile().height / 2;
        this.houseExitTile = this.map.house.getR();
        this.houseExitTileX = this.houseExitTile.x - this.map.tileWidth / 2;

        this.scatterTarget = this.map.tiles[this.scatterTarget];

        this.setMode(this.mode);

        // Change tile.
        this.on('item:tile', (t) => {
            if (this.mode === MODE_FRIGHTENED) this._speed = this.frightenedSpeed;
            else if (this.mode === MODE_DEAD) this._speed = 130;
            else if (t.isTunnel()) this._speed = this.tunnelSpeed;
            else this._speed = this.speed;

            if (this._turnBack) {
                this.dir = this._getOpDirection(this.dir);
                this._dir = null;
                this._nextDir = this.getNextDirection();
                this._turnBack = false;
            } else {
                this._dir = this._nextDir;
                this._nextDir = this.getNextDirection();
            }

            this._eatEvent = false;
        });

        addGameGlobalModeEventListener(this.onGameGlobalMode.bind(this));

        addPacmanEatPillEventListener(() => {
            this.setMode(MODE_FRIGHTENED);
            this.score = 200;
        });

        addGameGhostEatenEventListener(() => {
            this.score = this.scores[this.score];
        });

        addPacmanPositionEventListener(data => {
            this.pacmanData = data;
        });
    }

    reset() {
        super.reset();
        this.setMode(this.mode);
    }

    pause() {
        if (this.houseTimer) this.houseTimer.pause();
        if (this.frightenedTimer) this.frightenedTimer.pause();
    }

    resume() {
        if (this.mode === MODE_FRIGHTENED) this.frightenedTimer.resume();
        if (this.mode === MODE_HOUSE && !this.housePrepareExit) houseTimer.resume();
    }

    setMode(mode) {
        if (!mode) {
            if (this.frightened) {
                this.mode = this.frightened;
                this.frightened = null;
                return;
            }

            mode = this.globalMode;
        }

        if (mode === MODE_FRIGHTENED && (this.mode === MODE_HOUSE || this.mode === MODE_DEAD)) {
            this.frightened = mode;
        } else {
            this.mode = mode;
        }

        this.onEnterMode(mode);
    }

    shouldExitMode() {
        if (this.mode === MODE_DEAD) return this.getTile() === this.deadEnd;
        
        else if (this.mode === MODE_FRIGHTENED) return this.frightenedTimer.isElapsed();

        else if (this.mode === MODE_HOUSE) return this.getTile() === this.houseExitTile.getU();

        else if (this.mode != this.globalMode) return true;

        return false;
    }

    onEnterMode(mode) {
        switch (mode) {
            case MODE_DEAD:
                this.deadPrepareEnter = false;
                this._nextAnimation = this.animations[`score${this.score}`];
                this.update();
                break;
            case MODE_FRIGHTENED:
                this.frightenedTimer = new Timer(this.frightenedTime);
                this.emit('item:modefrightened:enter');
                break;
            case MODE_HOUSE:
                this.housePrepareExit = false;
                this._speed = 70;
                break;
        }
    }

    onExitMode() {
        const tile = this.getTile();

        switch (this.mode) {
            case MODE_DEAD:
                this.reset();
                break;
            case MODE_FRIGHTENED:
                if (!this.frightened) this.setMode();
                this.emit('item:modefrightened:exit');
                break;
            case MODE_HOUSE:
                this.houseTimer = null;

                this._dir = 'l';
                this._nextDir = 'l';
                this._lastTile = tile.getD();
                this._speed = this.speed;
                this.setMode();
                break;
            default:
                if (!tile.isHouse()) {
                    this._turnBack = true;
                }
                this.setMode();
                break;
        }
    }

    isFrightened() {
        return this.frightened || this.mode === MODE_FRIGHTENED;
    }

    isDead() {
        return this.mode === MODE_DEAD;
    }

    onGameGlobalMode(mode) {
        if (mode) this.globalMode = mode;
    }

    move() {
        if (this.shouldExitMode()) {
            this.onExitMode();
        } else {
            if (this.mode === MODE_DEAD) {
                if (!this.deadPrepareEnter && this.getTile() === this.deadTarget) {
                    this.deadPrepareEnter = true;
                }

                if (this.deadPrepareEnter) {
                    let endX = this.deadEndX;
                    let endY = this.deadEndY;
                    // Should go to center first
                    if (this.y < endY) endX = this.deadTarget.x - this.map.tw / 2;
                    // Set direction
                    if (this.x < endX) this.dir = 'r';
                    else if (this.x > endX) this.dir = 'l';
                    else if (this.y < endY) this.dir = 'd';
                    // Move
                    if (this.dir === 'd')
                        this.y += this.getMin(this.getStep(), endY - this.y);
                    if (this.dir === 'r')
                        this.x += this.getMin(this.getStep(), endX - this.x);
                    if (this.dir === 'l')
                        this.x -= this.getMin(this.getStep(), this.x - endX);

                    this.setNextAnimation();
                    this.update();
                } else {
                    super.move(this._dir);
                }
            } else if (this.mode === MODE_HOUSE) {
                if (!this.houseTimer) this.houseTimer = new Timer(this.waitTime);

                const tile = this.getTile();

                if (!this.housePrepareExit && this.houseTimer.isElapsed() && !tile.isWall()) {
                    this.housePrepareExit = true;
                    this.y = tile.y;
                }

                if (this.frightened && this.frightenedTimer.isElapsed()) {
                    this.frightened = null;
                }

                if (this.housePrepareExit) {
                    if (this.x < this.houseExitTileX) this.dir = 'r';
                    else if (this.x > this.houseExitTileX) this.dir = 'l';
                    else this.dir = 'u';

                    if (this.dir === 'u')
                        this.y -= this.getMin(this.getStep(), this.y - this.houseExitTile.getU().y);
                    if (this.dir === 'r')
                        this.x += this.getMin(this.getStep(), this.houseExitTileX - this.x);
                    if (this.dir === 'l')
                        this.x -= this.getMin(this.getStep(), this.x - this.houseExitTileX);

                } else {
                    if (this.y <= this.houseTop && this.dir === 'u') this.dir = 'd';
                    if (this.y >= this.houseBottom && this.dir === 'd') this.dir = 'u';

                    if (this.dir === 'u')
                        this.y -= this.getMin(this.getStep(), this.y - this.houseTop);
                    if (this.dir === 'd')
                        this.y += this.getMin(this.getStep(), this.houseBottom - this.y);

                }

                this.setNextAnimation();
                this.update();
            } else {
                super.move(this._dir);
            }
        }

        // Eat or eaten!
        if (!this._eatEvent) {
            var pt = this.pacmanData.tile, t = this.getTile(), op = this._getOpDirection(this.dir);
            if (pt === t || (this.pacmanData.dir === op && pt === t.get(op))) {
                this._eatEvent = true;
                if (this.mode === MODE_FRIGHTENED) {
                    // Ghost eaten by Pacman!
                    this.setMode(MODE_DEAD);
                    this.emit('item:eaten');
                } else if (this.mode !== MODE_DEAD) {
                    // Eat Pacman!
                    this.emit('item:eat');
                }
            }
        }
    }

    canGo(dir, tile) {
        if (!tile) tile = this.getTile();

        const nextTile = tile.get(dir);

        if (this.mode === MODE_DEAD) return !nextTile || !nextTile.isWall();

        if (!nextTile) return false;

        return !nextTile.isWall() && !nextTile.isHouse();

    }

    getNextDirection() {
        if (this.mode === MODE_FRIGHTENED) {
            // Next tile.
            const nextTile = this.getTile().get(this._dir);
            // Clockwise direction order.
            const directions = ['u', 'r', 'd', 'l', 'u', 'r', 'd', 'l'];
            // Select random direction. Then try that direction or change following clockwise order.
            let idx = rnd(4);

            let nextDirection = directions[idx];

            while (nextDirection && (nextDirection === this._getOpDirection(this._dir) || !this.canGo(nextDirection, nextTile))) {
                nextDirection = directions[++idx];
            }

            return nextDirection;
        }
        // Target Tile
        const targetTile = this.mode === MODE_CHASE ? this.getChaseTarget() :
            this.mode === MODE_SCATTER ? this.scatterTarget :
            this.deadTarget;

        const _dir = this._dir || this.dir;
        // Next tile.
        const nextTile = this.getTile().get(_dir);
        // Preferred direction order.
        const directions = ['u', 'l', 'd', 'r'];

        let nextDirection, lastDistance;

        for (var i = 0; i < 4; i++) {
            let dir = directions[i];
            // Cant't go back.
            if (dir === this._getOpDirection(_dir)) continue;

            if (this.canGo(dir, nextTile)) {
                let testTile = nextTile.get(dir);
                let distance = getDistance(testTile, targetTile);

                if (typeof lastDistance === 'undefined' || lastDistance > distance) {
                    nextDirection = dir;
                    lastDistance = distance;
                }
            }
        }

        return nextDirection;
    }

    setNextAnimation() {
        if (this.mode === MODE_DEAD) {
            switch (this.dir) {
                case 'u':
                    this._nextAnimation = this.animations.deadUp;
                    break;
                case 'r':
                    this._nextAnimation = this.animations.deadRight;
                    break;
                case 'd':
                    this._nextAnimation = this.animations.deadDown;
                    break;
                case 'l':
                    this._nextAnimation = this.animations.deadLeft;
                    break;
            }
        } else if (this.mode === MODE_FRIGHTENED ||
            (this.mode === MODE_HOUSE && this.frightened)) {
            if (this.frightenedTime - this.frightenedTime * 0.2 > this.frightenedTimer.getElapsed()) {
                this._nextAnimation = this.animations.frightened;
            } else {
                this._nextAnimation = this.animations.frightenedBlink;
            }
        } else {
            super.setNextAnimation();
        }
    }
}

Object.assign(Ghost.prototype, defaults);

export default Ghost;
