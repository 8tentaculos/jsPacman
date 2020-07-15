import $ from 'jquery';
import Bot from './Bot';
import ModeChase from './modes/Chase';
import ModeDead from './modes/Dead';
import ModeFrightened from './modes/Frightened';
import ModeHouse from './modes/House';
import ModeScatter from './modes/Scatter';

class Ghost extends Bot {
    constructor(attrs) {
        super(attrs);

        const {
            addGameGlobalModeEventListener,
            addGameGhostEatenEventListener
        } = attrs;

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
        this.on('sprite:tile', (t) => {
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

        this.pacman.on('sprite:pill', () => {
            this.setMode('frightened');
            this.score = 200;
        });

        addGameGhostEatenEventListener(() => {
            this.score = this.scores[this.score];
        });
    }

    reset(attrs = {}) {
        Object.assign(this, this.defaults, attrs);
        this.setMode(this.mode);
        this.render(true);
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

    getChaseTarget() {
        return this.pacman.getTile();
    }

    _onGameGlobalMode(mode) {
        if (typeof mode === 'string') mode = this.modes[mode];
        this.globalMode = mode;
    }

    move() {
        this.mode.move();
        // Eat or eaten!
        if (!this._eatEvent) {
            var pt = this.pacman.getTile(), t = this.getTile(), op = this._getOpDirection(this.dir);
            if (pt === t || (this.pacman.dir === op && pt === t.get(op))) {
                this._eatEvent = true;
                if (this.mode === this.modes.frightened) {
                    // Ghost eaten by Pacman!
                    this.setMode('dead');
                    this.emit('sprite:eaten');
                } else if (this.mode !== this.modes.dead) {
                    // Eat Pacman!
                    this.emit('sprite:eat');
                }
            }
        }
    }

    _setAnimation() {
        this.mode.setAnimation();
    }

    _canGo(dir) {
        return this.mode.canGo(dir);
    }
}

Object.assign(Ghost.prototype, {
    w : 64,
    // Options.
    dir : null,
    // Overriden by Level
    speed : 75,
    frightenedTime : 5,

    waitTime : 4,

    animationBase : {
        imageURL : 'img/bots.png',
        numberOfFrame : 2,
        delta : 64,
        rate : 180,
        type : $.gQ.ANIMATION_HORIZONTAL
    },

    animations : {
        frightened : {
            offsety : 376,
            offsetx : -2
        },

        frightenedBlink : {
            offsety : 376,
            offsetx : -2,
            numberOfFrame : 4
        },

        deadRight : {
            offsety : 376,
            offsetx : 64 * 4 - 2,
            numberOfFrame : 1
        },

        deadDown : {
            offsety : 376,
            offsetx : 64 * 5 - 2,
            numberOfFrame : 1
        },

        deadUp : {
            offsety : 376,
            offsetx : 64 * 6 - 2,
            numberOfFrame : 1
        },

        deadLeft : {
            offsety : 376,
            offsetx : 64 * 7 - 2,
            numberOfFrame : 1
        },

        score_200 : {
            imageURL : 'img/misc.png',
            numberOfFrame : 1,
            offsetx : -2,
            offsety : 110
        },

        score_400 : {
            imageURL : 'img/misc.png',
            numberOfFrame : 1,
            offsetx : 64 * 1 - 2,
            offsety : 110
        },

        score_800 : {
            imageURL : 'img/misc.png',
            numberOfFrame : 1,
            offsetx : 64 * 2 - 2,
            offsety : 110
        },

        score_1600 : {
            imageURL : 'img/misc.png',
            numberOfFrame : 1,
            offsetx : 64 * 3,
            offsety : 110
        }
    },

    mode : 'house',
    pacman : null,

    score : '200',
    scores : { '200' : '400', '400' : '800', '800' : '1600' }
});

export default Ghost;
