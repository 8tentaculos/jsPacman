import Animation, { ANIMATION_HORIZONTAL } from './engine/Animation';
import Character from './Character';
import ModeChase from './modes/Chase';
import ModeDead from './modes/Dead';
import ModeFrightened from './modes/Frightened';
import ModeHouse from './modes/House';
import ModeScatter from './modes/Scatter';

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
    mode : 'house',
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

        // Modes.
        this.modes = {
            scatter    : new ModeScatter(this),
            chase      : new ModeChase(this),
            frightened : new ModeFrightened(this),
            house      : new ModeHouse(this),
            dead       : new ModeDead(this)
        };

        this.setMode(this.mode);

        this.scatterTarget = this.map.tiles[this.scatterTarget];

        addGameGlobalModeEventListener(this._onGameGlobalMode.bind(this));

        // Change tile.
        this.on('item:tile', (t) => {
            if (this.mode === this.modes.frightened) this._speed = this.frightenedSpeed;
            else if (this.mode === this.modes.dead) this._speed = 130;
            else if (t.isTunnel()) this._speed = this.tunnelSpeed;
            else this._speed = this.speed;

            if (this._turnBack) {
               this.dir = this._getOpDirection(this.dir);
               this._dir = null;
               this._nextDir = this.mode.getNextDirection();
               this._turnBack = false;
            } else {
                this._dir = this._nextDir;
                this._nextDir = this.mode.getNextDirection();
            }

            this._eatEvent = false;
        });

        addPacmanEatPillEventListener(() => {
            this.setMode('frightened');
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
        this.mode.pause();
    }

    resume() {
        this.mode.resume();
    }

    setMode(mode) {
        if (typeof mode === 'string') mode = this.modes[mode];

        if (!mode) {
            if (this.frightened) {
                this.mode = this.frightened;
                this.frightened = null;
                return;
            }

            mode = this.globalMode;
        }

        var house = this.modes.house, dead = this.modes.dead, frightened = this.modes.frightened;

        if (mode === frightened && (this.mode === house || this.mode === dead)) {
            this.frightened = mode;
        } else {
            this.mode = mode;
        }

        if (typeof mode.onEnter === 'function') mode.onEnter();
    }

    isFrightened() {
        return this.frightened || this.mode === this.modes.frightened;
    }

    isDead() {
        return this.mode === this.modes.dead;
    }

    _onGameGlobalMode(mode) {
        if (typeof mode === 'string') mode = this.modes[mode];
        if (mode) this.globalMode = mode;
    }

    move() {
        this.mode.move();
        // Eat or eaten!
        if (!this._eatEvent) {
            var pt = this.pacmanData.tile, t = this.getTile(), op = this._getOpDirection(this.dir);
            if (pt === t || (this.pacmanData.dir === op && pt === t.get(op))) {
                this._eatEvent = true;
                if (this.mode === this.modes.frightened) {
                    // Ghost eaten by Pacman!
                    this.setMode('dead');
                    this.emit('item:eaten');
                } else if (this.mode !== this.modes.dead) {
                    // Eat Pacman!
                    this.emit('item:eat');
                }
            }
        }
    }

    _setNextAnimation() {
        this.mode.setAnimation();
    }

    _canGo(dir) {
        return this.mode.canGo(dir);
    }
}

Object.assign(Ghost.prototype, defaults);

export default Ghost;
