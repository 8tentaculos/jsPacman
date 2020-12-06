import Animation, { ANIMATION_HORIZONTAL } from './engine/Animation';
import Character from './Character.js';

const animationBase = {
    imageURL : 'img/characters.png',
    numberOfFrame : 4,
    delta : 64,
    refreshRate : 60,
    offsetY : 60,
    type : ANIMATION_HORIZONTAL
};

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

const defaults = {
    animations,
    dir : 'l',
    defaultAnimation : 'left',
    preturn : true,
    frightenedSpeed : null,
    frightenedDotSpeed : null,
    dotSpeed : null
};

class Pacman extends Character {
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

        this._ghostFrightened = 0;

        // Change tile. Set direction.
        this.on('item:tile', (tile) => {
            if (this._ghostFrightened) this._speed = this.frightenedSpeed;
            else this._speed = this.speed;

            if (tile.item) {
                if (tile.hasPill()) { // Pill!
                    this.emit('item:eatpill', tile);
                }
                else if (tile.hasDot()) { // Dot!
                    this.emit('item:eatdot', tile);
                    if (this._ghostFrightened) this._speed = this.frightenedDotSpeed;
                    else this._speed = this.dotSpeed;
                }
                tile.item.destroy();
                tile.item = null;
            }

        });

        addGameGhostEatEventListener(ghost => {
            this._eatenTurns = 9;
            this.dir = 'r';
            this.pauseAnimation();
        });

        addGameGhostModeFrightenedEnter(() => {
            this._ghostFrightened++;
        });

        addGameGhostModeFrightenedExit(() => {
            this._ghostFrightened--;
        });
    }

    reset() {
        Character.prototype.reset.apply(this);
        this._lastEatenTurnsTime = null;
    }

    move() {
        if (!this._eatenTurns) Character.prototype.move.apply(this, arguments);
        else if (!this._eatenTurnsFrames) {
            if (this._eatenTurns === 9) this.emit('item:die');
            if (this._eatenTurns > 2) {
                var directions = {'d' : 'l', 'l' : 'u', 'u' : 'r', 'r' : 'd'};
                this.dir = directions[this.dir];
                this._setNextAnimation();
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
