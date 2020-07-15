import $ from 'jquery';
import Bot from './Bot.js';

class Pacman extends Bot {
    constructor(attrs) {
        super(attrs);

        const {
            addGameGhostEatEventListener,
            addGameGhostModeFrightenedEnter,
            addGameGhostModeFrightenedExit
        } = attrs;

        this._ghostFrightened = 0;

        // Change tile. Set direction.
        this.on('item:tile', (t) => {
            if (this._ghostFrightened) this._speed = this.frightenedSpeed;
            else this._speed = this.speed;

            if (t.item) {
                if (t.hasPill()) { // Pill!
                    this.emit('item:eatpill', t);
                }
                else if (t.hasDot()) { // Dot!
                    this.emit('item:eatdot', t);
                    if (this._ghostFrightened) this._speed = this.frightenedDotSpeed;
                    else this._speed = this.dotSpeed;
                }
                t.item.destroy();
                delete t.item;
            }

        });

        addGameGhostEatEventListener(ghost => {
            this._eatenTurns = 9;
            this.dir = 'r';
            this.$el.pauseAnimation();
        });

        addGameGhostModeFrightenedEnter(() => {
            this._ghostFrightened++;
        });

        addGameGhostModeFrightenedExit(() => {
            this._ghostFrightened--;
        });
    }

    reset() {
        Bot.prototype.reset.apply(this);
        this._lastEatenTurnsTime = null;
    }

    move() {
        if (!this._eatenTurns) Bot.prototype.move.apply(this, arguments);
        else if (!this._eatenTurnsFrames) {
            if (this._eatenTurns === 9) this.emit('item:die');
            if (this._eatenTurns > 2) {
                var directions = {'d' : 'l', 'l' : 'u', 'u' : 'r', 'r' : 'd'};
                this.dir = directions[this.dir];
                this._setAnimation();
                this.render();
                this._eatenTurnsFrames = 5;
            } else this._eatenTurnsFrames = 25;

            this._eatenTurns--;

            if (this._eatenTurns === 0) this.emit('item:life');

        } else this._eatenTurnsFrames--;
    }

};

Object.assign(Pacman.prototype, {
    animationBase : {
        imageURL : 'img/bots.png',
        numberOfFrame : 4,
        delta : 64,
        rate : 60,
        offsety : 60,
        type : $.gQ.ANIMATION_HORIZONTAL
    },

    animations : {
        right : {},

        down : {
            offsetx : 64 * 4
        },

        up : {
            offsetx : 64 * 8
        },

        left : {
            offsetx : 64 * 12
        }
    },

    dir : 'l',

    defaultAnimation : 'left'
});

export default Pacman;
